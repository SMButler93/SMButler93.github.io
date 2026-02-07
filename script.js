document.addEventListener('DOMContentLoaded', () => {
    let z = 10; // global z-index for stacking
    let dragData = null; // stores the element being dragged and offsets

    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.icon');
    const windows = document.querySelectorAll('.window');
    const startMenu = document.getElementById('startMenu');

    // -----------------------------
    // Drag functionality for icons
    // -----------------------------
    icons.forEach(icon => {
        icon.addEventListener('mousedown', e => {
            // bring to front
            icon.style.zIndex = ++z;

            dragData = {
                element: icon,
                offsetX: e.clientX - icon.offsetLeft,
                offsetY: e.clientY - icon.offsetTop
            };
            e.preventDefault();
        });
    });

    // -----------------------------
    // Drag functionality for windows
    // -----------------------------
    windows.forEach(win => {
        const titlebar = win.querySelector('.titlebar');

        titlebar.addEventListener('mousedown', e => {
            // bring to front
            win.style.zIndex = ++z;

            dragData = {
                element: win,
                offsetX: e.clientX - win.offsetLeft,
                offsetY: e.clientY - win.offsetTop
            };
            e.preventDefault();
        });
    });

    // -----------------------------
    // Mouse move and release
    // -----------------------------
    document.addEventListener('mousemove', e => {
        if (dragData) {
            let newX = e.clientX - dragData.offsetX;
            let newY = e.clientY - dragData.offsetY;

            // constrain to desktop
            const rect = desktop.getBoundingClientRect();
            const el = dragData.element;
            newX = Math.max(0, Math.min(newX, rect.width - el.offsetWidth));
            newY = Math.max(0, Math.min(newY, rect.height - el.offsetHeight));

            dragData.element.style.left = newX + 'px';
            dragData.element.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        dragData = null;
    });

    // -----------------------------
    // Open/close windows
    // -----------------------------
    window.openWin = function(id) {
        const w = document.getElementById(id);
        w.style.display = 'block';
        w.style.zIndex = ++z;
    }

    window.closeWin = function(id) {
        document.getElementById(id).style.display = 'none';
    }

    // -----------------------------
    // Start menu toggle
    // -----------------------------
    window.toggleStart = function() {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    }

    window.openFromStart = function(id) {
        openWin(id);
        toggleStart();
    }

    // -----------------------------
    // Clock update
    // -----------------------------
    setInterval(() => {
        const d = new Date();
        document.getElementById('clock').innerText = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);

    // -----------------------------
    // Close start menu when clicking desktop
    // -----------------------------
    desktop.addEventListener('click', () => {
        startMenu.style.display = 'none';
    });
});
