const items = Array.from(document.querySelectorAll('.item'));
let current = Math.floor(items.length / 2);
const spacing = 70;

let isDragging = false;
let startX = 0;
let dragOffset = 0;

const carousel = document.querySelector('.carousel');

function render(offset = 0) {
    const floatingCenter = current - offset / spacing;

    items.forEach((item, i) => {
        const diff = i - floatingCenter;

        const maxX = 300;
        let x = diff * spacing;
        if (x > maxX) x = maxX;
        if (x < -maxX) x = -maxX;

        const scale = 1.25 - Math.min(Math.abs(diff) * 0.25, 0.4);
        const rotate = diff * 5;
        const z = Math.round(100 - Math.abs(diff) * 10);

        const opacity = 1 - Math.min(Math.abs(diff) * 0.1, 0.3);

        item.style.transform = `
            translate(-50%, -50%)
            translateX(${x}px)
            scale(${scale})
            rotate(${rotate}deg)
        `;
        item.style.zIndex = z;
        item.style.opacity = opacity;
    });

    requestAnimationFrame(() => render(dragOffset));
}

// initial render
render();

// --- Drag / Swipe ---
carousel.addEventListener('pointerdown', e => {
    isDragging = true;
    startX = e.clientX || e.touches?.[0].clientX;
    carousel.style.cursor = 'grabbing';
});

carousel.addEventListener('pointermove', e => {
    if (!isDragging) return;
    const currentX = e.clientX || e.touches?.[0].clientX;
    dragOffset = currentX - startX;
    render(dragOffset);
});

carousel.addEventListener('pointerup', e => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';

    const deltaIndex = -dragOffset / spacing;
    current += Math.round(deltaIndex);
    current = Math.max(0, Math.min(items.length - 1, current));

    dragOffset = 0;
    render();
});

carousel.addEventListener('pointerleave', () => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    dragOffset = 0;
    render();
});

// --- TAP SUPPORT ---
items.forEach((item, index) => {
    item.addEventListener('click', () => {
        current = index; // set clicked item as center
        dragOffset = 0;
        render();
    });
});