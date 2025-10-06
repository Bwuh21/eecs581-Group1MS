/**
 * Author: Reem Fatima, Pashia Vang, Alejandro Sandoval, Liam Aga, Jorge Trujillo, Aiden Barnard
 * Authors Part 2: Maren Proplesch, Muhammad Ibrahim, Zach Corbin, Saurav Renju, Nick Grieco, Muhammad Abdulla. 
 * Creation Date: 2025-10-01
 * File: draggable.js
 * Description: Handles draggable stickers on the main screen.
 * Inputs/Outputs:
 *   - None
 * Responsibilities:
 *   - Handles draggable stickers on the main screen
 */

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
