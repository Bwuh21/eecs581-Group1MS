document.querySelectorAll('.draggable').forEach(img => {
    let offsetX, offsetY, isDragging = false;

    img.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - img.offsetLeft;
        offsetY = e.clientY - img.offsetTop;
        img.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            img.style.left = (e.clientX - offsetX) + 'px';
            img.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        img.style.cursor = 'grab';
    });
});