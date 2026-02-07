document.addEventListener('DOMContentLoaded', () => {
    let z = 10;
    let dragData = null;
    const originalContent = {};
    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.icon');
    const startMenu = document.getElementById('startMenu');
    const taskbarWindows = document.getElementById('taskbar-windows');

    // ------------------ DRAG ------------------
    function startDrag(element, offsetX, offsetY) {
        dragData = { element, offsetX, offsetY };
        element.style.zIndex = ++z;
    }

    document.addEventListener('mousemove', e => {
        if (!dragData) return;
        const el = dragData.element;
        let newX = e.clientX - dragData.offsetX;
        let newY = e.clientY - dragData.offsetY;
        newX = Math.max(0, Math.min(newX, desktop.offsetWidth - el.offsetWidth));
        newY = Math.max(0, Math.min(newY, desktop.offsetHeight - el.offsetHeight));
        el.style.left = newX + 'px';
        el.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => dragData = null);

    // ------------------ ICONS ------------------
    icons.forEach(icon => {
        icon.addEventListener('mousedown', e => {
            startDrag(icon, e.clientX - icon.offsetLeft, e.clientY - icon.offsetTop);
        });
    });

    // ------------------ START MENU ------------------
    window.toggleStart = () => {
        startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    };

    desktop.addEventListener('click', e => {
        if (!e.target.closest('.window')) {
            startMenu.style.display = 'none';
        }
    });

    // ------------------ CLOCK ------------------
    function updateClock() {
        const d = new Date();
        document.getElementById('clock').innerText =
            d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ------------------ TEXT EDITOR ------------------
    window.openTextEditor = (filename, content) => {
        const winId = `win-${Date.now()}`;
        const win = document.createElement('div');
        win.classList.add('window');
        win.id = winId;
        win.style.top = '50px';
        win.style.left = '50px';

        win.innerHTML = `
            <div class="titlebar">
                <div class="title">${filename}</div>
                <div class="controls">
                    <span onclick="minimizeWindow('${winId}')">_</span>
                    <span onclick="maximizeWindow('${winId}')">□</span>
                    <span onclick="closeWindow('${winId}')">X</span>
                </div>
            </div>
            <div class="text-menu">
                <div>File</div><div>Edit</div><div>Sizes</div><div>Window</div>
            </div>
            <div class="window-body notepad" contenteditable="true">${content}</div>
        `;

        desktop.appendChild(win);
        makeWindowDraggable(win);
        win.style.display = 'block';
        win.style.zIndex = ++z;
        originalContent[winId] = content;

        const taskBtn = document.createElement('div');
        taskBtn.id = `task-${winId}`;
        taskBtn.innerText = filename;
        taskBtn.onclick = () => {
            win.style.display = 'block';
            win.style.zIndex = ++z;
        };
        taskbarWindows.appendChild(taskBtn);
    };

    function makeWindowDraggable(win) {
        const titlebar = win.querySelector('.titlebar');
        titlebar.addEventListener('mousedown', e => {
            startDrag(win, e.clientX - win.offsetLeft, e.clientY - win.offsetTop);
        });
    }

    window.minimizeWindow = id => {
        document.getElementById(id).style.display = 'none';
    };

    window.maximizeWindow = id => {
        const win = document.getElementById(id);
        if (win.dataset.maximized === 'true') {
            win.style.width = win.dataset.prevWidth;
            win.style.height = win.dataset.prevHeight;
            win.style.top = win.dataset.prevTop;
            win.style.left = win.dataset.prevLeft;
            win.dataset.maximized = 'false';
        } else {
            win.dataset.prevWidth = win.style.width;
            win.dataset.prevHeight = win.style.height;
            win.dataset.prevTop = win.style.top;
            win.dataset.prevLeft = win.style.left;
            win.style.width = '100%';
            win.style.height = 'calc(100% - 32px)';
            win.style.top = '0';
            win.style.left = '0';
            win.dataset.maximized = 'true';
        }
    };

    window.closeWindow = id => {
        const win = document.getElementById(id);
        const notepad = win.querySelector('.notepad');
        if (notepad && originalContent[id] && notepad.innerText !== originalContent[id]) {
            const save = confirm(`Save changes to ${win.querySelector('.title').innerText}?`);
            if (save) {
                originalContent[id] = notepad.innerText;
            } else {
                notepad.innerText = originalContent[id];
            }
        }
        win.remove();
        const taskBtn = document.getElementById(`task-${id}`);
        if (taskBtn) taskBtn.remove();
    };
});
