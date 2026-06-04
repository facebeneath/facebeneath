from pathlib import Path
import re
from urllib.parse import urlparse

ROOT = Path('.')
ORIG_EXTS = ['.jpg', '.jpeg', '.png', '.gif']
TEXT_EXTS = {'.html', '.css', '.js', '.xml'}


def find_original_for_webp(ref_path: str, text_file: Path) -> str | None:
    candidate = ref_path.strip()
    if not candidate:
        return None

    parsed = urlparse(candidate)
    if parsed.scheme in {'http', 'https'}:
       
        candidate_path = (parsed.path or '').split('?', 1)[0].split('#', 1)[0]
    else:
        candidate_path = candidate.split('?', 1)[0].split('#', 1)[0]

    candidate_path = candidate_path.replace('\\', '/').strip()
    if not candidate_path:
        return None

    raw_path = Path(candidate_path)
    stripped_path = Path(candidate_path.lstrip('/'))

    candidate_paths = []
    if raw_path.is_absolute() or candidate_path.startswith('/'):
        candidate_paths.append(ROOT / stripped_path)
    else:
        candidate_paths.append(text_file.parent / raw_path)
        candidate_paths.append(ROOT / raw_path)

    for base_path in candidate_paths:
        if base_path.suffix.lower() != '.webp':
            continue
        stem = base_path.with_suffix('')
        for ext in ORIG_EXTS:
            orig = stem.with_suffix(ext)
            if orig.exists() and orig.stat().st_size > 0:
                return ext[1:]

    return None



deleted_webp = 0
for p in ROOT.rglob('*.webp'):
    stem = p.with_suffix('')
    has_original = any(stem.with_suffix(ext).exists() for ext in ORIG_EXTS)
    if has_original:
        try:
            p.unlink()
            deleted_webp += 1
        except OSError:
            pass


updated_files = 0
updated_refs = 0
removed_lazy = 0


webp_ref_pattern = re.compile(
    r'(?P<q>["\'`\(])(?P<path>[^"\'`\)]+?)\.webp(?P<suf>(?:\?[^"\'`\)]*)?)(?P<q2>["\'`\)])',
    re.IGNORECASE,
)

encoded_webp_pattern = re.compile(
    r'url\((?P<q>&quot;|&#34;)(?P<path>[^"&]+?)\.webp(?P<suf>(?:\?[^"&]*)?)(?P=q)\)',
    re.IGNORECASE,
)

srcset_webp_pattern = re.compile(
    r'(?P<path>[^"\'`\(),\s<>]+?)\.webp(?P<suf>(?:\?[^"\'`\(),\s<>]*)?)(?P<descriptor>\s+[0-9.]+[wx])',
    re.IGNORECASE,
)

for p in ROOT.rglob('*'):
    if not (p.is_file() and p.suffix.lower() in TEXT_EXTS):
        continue

    try:
        original = p.read_text(encoding='utf-8')
    except UnicodeDecodeError:
        continue

    changed = [0]

    def repl_basic(m):
        ext = find_original_for_webp(m.group('path') + '.webp', p)
        if ext:
            changed[0] += 1
            return f"{m.group('q')}{m.group('path')}.{ext}{m.group('suf')}{m.group('q2')}"
        return m.group(0)

    content = webp_ref_pattern.sub(repl_basic, original)

    def repl_encoded(m):
        ext = find_original_for_webp(m.group('path') + '.webp', p)
        if ext:
            changed[0] += 1
            return f"url({m.group('q')}{m.group('path')}.{ext}{m.group('suf')}{m.group('q')})"
        return m.group(0)

    content = encoded_webp_pattern.sub(repl_encoded, content)

    def repl_srcset(m):
        ext = find_original_for_webp(m.group('path') + '.webp', p)
        if ext:
            changed[0] += 1
            return f"{m.group('path')}.{ext}{m.group('suf')}{m.group('descriptor')}"
        return m.group(0)

    content = srcset_webp_pattern.sub(repl_srcset, content)

    
    content2, lazy_count = re.subn(
        r'<img\s+loading\s*=\s*["\']lazy["\']\s*',
        '<img ',
        content,
        flags=re.IGNORECASE,
    )

    if content2 != original:
        p.write_text(content2, encoding='utf-8', newline='')
        updated_files += 1
        updated_refs += changed[0]
        removed_lazy += lazy_count

print(f'Deleted webp files: {deleted_webp}')
print(f'Updated text files: {updated_files}')
print(f'Reverted references: {updated_refs}')
print(f'Removed loading=lazy: {removed_lazy}')
