from pathlib import Path
import re
from urllib.parse import urlparse
from PIL import Image

ROOT = Path('.')
IMG_EXTS = {'.jpg', '.jpeg', '.png', '.gif'}
TEXT_EXTS = {'.html', '.css', '.js', '.xml'}

converted = 0
skipped_existing = 0
failed = []


def convert_to_webp(src: Path) -> bool:
    dst = src.with_suffix('.webp')
    if dst.exists() and dst.stat().st_size > 0:
        return False
    try:
        with Image.open(src) as im:
            
            mode = 'RGBA' if 'A' in im.getbands() else 'RGB'
            im.convert(mode).save(dst, format='WEBP', quality=80, method=0)
        return True
    except Exception as exc:
        failed.append((str(src), str(exc)))
        return False


image_files = sorted([p for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in IMG_EXTS], key=lambda x: str(x).lower())
for idx, p in enumerate(image_files, start=1):
    print(f'Converting {idx}/{len(image_files)}: {p}', flush=True)
    did_convert = convert_to_webp(p)
    if did_convert:
        converted += 1
    else:
        dst = p.with_suffix('.webp')
        if dst.exists() and dst.stat().st_size > 0:
            skipped_existing += 1
    if idx % 25 == 0:
        print(f'Progress checkpoint: {idx}/{len(image_files)}', flush=True)


img_ref_pattern = re.compile(r'(?P<q>["\'`\(])(?P<path>[^"\'`\)]+?)\.(?P<ext>jpg|jpeg|png|gif)(?P<suf>(?:\?[^"\'`\)]*)?)(?P<q2>["\'`\)])', re.IGNORECASE)

encoded_url_pattern = re.compile(r'url\((?P<q>&quot;|&#34;)(?P<path>[^"&]+?)\.(?P<ext>jpg|jpeg|png|gif)(?P<suf>(?:\?[^"&]*)?)(?P=q)\)', re.IGNORECASE)

srcset_pattern = re.compile(r'(?P<path>[^"\'`\(),\s<>]+?)\.(?P<ext>jpg|jpeg|png|gif)(?P<suf>(?:\?[^"\'`\(),\s<>]*)?)(?P<descriptor>\s+[0-9.]+[wx])', re.IGNORECASE)


def resolve_local_webp(ref_path: str, text_file: Path) -> Path | None:
    candidate = ref_path.strip()
    if not candidate or candidate.lower().startswith('data:'):
        return None

    parsed = urlparse(candidate)
    if parsed.scheme in {'http', 'https'}:
        candidate = parsed.path or ''

    candidate = candidate.split('?', 1)[0].split('#', 1)[0].replace('\\', '/').strip()
    if not candidate:
        return None

    candidate_paths = []
    raw_path = Path(candidate)
    stripped_path = Path(candidate.lstrip('/'))

    if raw_path.is_absolute() or candidate.startswith('/'):
        candidate_paths.append(ROOT / stripped_path)
    else:
        candidate_paths.append(text_file.parent / raw_path)
        candidate_paths.append(ROOT / raw_path)

    for base_path in candidate_paths:
        webp_path = base_path.with_suffix('.webp')
        if webp_path.exists() and webp_path.stat().st_size > 0:
            return webp_path

    return None

updated_files = 0
updated_refs = 0

for p in ROOT.rglob('*'):
    if not (p.is_file() and p.suffix.lower() in TEXT_EXTS):
        continue

    try:
        original = p.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        
        continue

    def rewrite_ref(rel_ref: str, matched_text: str, replacement: str, changed: list[int]) -> str:
        webp_path = resolve_local_webp(rel_ref, p)
        if webp_path is not None:
            changed[0] += 1
            return replacement
        return matched_text

    
    changed = [0]

    content = img_ref_pattern.sub(
        lambda m: rewrite_ref(
            m.group('path'),
            m.group(0),
            f"{m.group('q')}{m.group('path')}.webp{m.group('suf')}{m.group('q2')}",
            changed,
        ),
        original,
    )

    content = encoded_url_pattern.sub(
        lambda m: rewrite_ref(
            m.group('path'),
            m.group(0),
            f"url({m.group('q')}{m.group('path')}.webp{m.group('suf')}{m.group('q')})",
            changed,
        ),
        content,
    )

    content = srcset_pattern.sub(
        lambda m: rewrite_ref(
            m.group('path'),
            m.group(0),
            f"{m.group('path')}.webp{m.group('suf')}{m.group('descriptor')}",
            changed,
        ),
        content,
    )

  
    def add_lazy(tag: str) -> str:
        if re.search(r'\sloading\s*=\s*["\']', tag, flags=re.IGNORECASE):
            return tag
        return tag.replace('<img', '<img loading="lazy"', 1)

    content2 = re.sub(r'<img\b[^>]*>', lambda m: add_lazy(m.group(0)), content, flags=re.IGNORECASE)

    if content2 != original:
        p.write_text(content2, encoding='utf-8', newline='')
        updated_files += 1
        updated_refs += changed[0]

print(f'Converted images: {converted}')
print(f'Skipped existing webp: {skipped_existing}')
print(f'Failed conversions: {len(failed)}')
if failed:
    for path, err in failed[:20]:
        print(f'FAIL: {path} -> {err}')
print(f'Updated text files: {updated_files}')
print(f'Updated image refs: {updated_refs}')
