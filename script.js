document.addEventListener('DOMContentLoaded', () => {
    let z = 10;
    let dragData = null;
    const originalContent = {};

    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.icon');
    const windows = document.querySelectorAll('.window');
    const startMenu = document.getElementById('startMenu');

    // -------------------------
    // Drag function (shared)
    // -------------------------
    function startDrag(element, offsetX, offsetY) {
        dragData = { element, offsetX, offsetY };
        element.style.zIndex = ++z;
    }

    document.addEventListener('mousemove', e => {
        if (!dragData) return;
        const el = dragData.element;
        const newX = Math.max(0, Math.min(e.clientX - dragData.offsetX, desktop.offsetWidth - el.offsetWidth));
        const newY = Math.max(0, Math.min(e.clientY - dragData.offsetY, desktop.offsetHeight - el.offsetHeight));
        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => dragData = null);

    // -------------------------
    // Icon drag
    // -------------------------
    icons.forEach(icon => {
        icon.addEventListener('mousedown', e => {
            startDrag(icon, e.clientX - icon.offsetLeft, e.clientY - icon.offsetTop);
        });
    });

    // -------------------------
    // Window drag (title bar)
    // -------------------------
    windows.forEach(win => {
        const titlebar = win.querySelector('.titlebar');
        titlebar.addEventListener('mousedown', e => {
            startDrag(win, e.clientX - win.offsetLeft, e.clientY - win.offsetTop);
            e.preventDefault();
        });
    });

    // -------------------------
    // Open/close windows with editable notepad
    // -------------------------
    window.openWin = id => {
        const w = document.getElementById(id);
        w.style.display = 'block';
        w.style.zIndex = ++z;

        // Track original content for unsaved changes
        const notepad = w.querySelector('.notepad');
        if (notepad && !(id in originalContent)) {
            originalContent[id] = notepad.innerText;
        }
    };

    window.closeWin = id => {
        const w = document.getElementById(id);
        const notepad = w.querySelector('.notepad');

        if (notepad && originalContent[id] && notepad.innerText !== originalContent[id]) {
            const filename = w.querySelector('.titlebar').innerText.replace('X','').trim();
            const save = confirm(`Save changes to ${filename}?`);
            if (save) {
                originalContent[id] = notepad.innerText;
            } else {
                notepad.innerText = originalContent[id];
            }
        }

        w.style.display = 'none';
    };

    // -------------------------
    // Start menu
    // -------------------------
    window.toggleStart = () => {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    };

    window.openFromStart = id => {
        openWin(id);
        toggleStart();
    };

    desktop.addEventListener('click', e => {
        // Only collapse start menu if clicking on desktop, not windows
        if (!e.target.closest('.window')) {
            startMenu.style.display = 'none';
        }
    });

    // -------------------------
    // Clock
    // -------------------------
    function updateClock() {
        const d = new Date();
        document.getElementById('clock').innerText =
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();
});
