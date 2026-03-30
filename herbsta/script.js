document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('leaves-container');

    const leafImages = [
        'leaf.png',
        'leaf1.png',
        'leaf2.png',
        'leaf3.png',
        'leaf4.png',
        'leaf5.png'
    ];

    function createLeaf() {
        const leaf = document.createElement('img');
        leaf.src = leafImages[Math.floor(Math.random() * leafImages.length)];
        leaf.classList.add('leaf');

        leaf.style.left = Math.random() * 100 + 'vw';
        leaf.style.width = 20 + Math.random() * 40 + 'px';
        leaf.style.animationDuration = '6s'; 

        container.appendChild(leaf);

        
        setTimeout(() => {
            leaf.remove();
        }, 6000);
    }

  
    const intervalId = setInterval(createLeaf, 300);

    setTimeout(() => {
        clearInterval(intervalId);
    }, 10000);

  
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('img');

    document.querySelectorAll('.image-row img').forEach(img => {
        img.addEventListener('click', () => {
            lightboxImage.src = img.src;
            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        lightboxImage.src = '';
    });
});