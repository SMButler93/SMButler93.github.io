document.addEventListener('DOMContentLoaded', () => {
    let z = 10;
    let dragData = null;
    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.icon');
    const startMenu = document.getElementById('startMenu');
    const taskbarWindows = document.getElementById('taskbar-windows');

    // ------------------ IN-MEMORY FILE SYSTEM ------------------
    const fileSystem = {
        'README.TXT': document.getElementById('readmeContent').innerText,
        'My Computer Info.TXT': 'System: ScottOS 95\nCPU: 1.0 GHz JS Processor\nMemory: 256 MB JS RAM'
    };

    const ICON_WIDTH = 72, ICON_HEIGHT = 72, ICON_PADDING = 16;

    function layoutIcons() {
        let x = ICON_PADDING, y = ICON_PADDING;
        const maxHeight = desktop.offsetHeight;
        icons.forEach(icon => {
            icon.style.left = x + 'px';
            icon.style.top = y + 'px';
            y += ICON_HEIGHT + ICON_PADDING;
            if (y + ICON_HEIGHT > maxHeight - 32) {
                y = ICON_PADDING;
                x += ICON_WIDTH + ICON_PADDING;
            }
        });
    }
    layoutIcons();
    window.addEventListener('resize', layoutIcons);

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

    icons.forEach(icon => {
        icon.addEventListener('mousedown', e => {
            startDrag(icon, e.clientX - icon.offsetLeft, e.clientY - icon.offsetTop);
        });
    });

    // ------------------ START MENU ------------------
    window.toggleStart = () => startMenu.style.display = startMenu.style.display === 'block' ? 'none' : 'block';
    desktop.addEventListener('click', e => { if(!e.target.closest('.window')) startMenu.style.display='none'; });

    // ------------------ CLOCK ------------------
    function updateClock() {
        const d = new Date();
        document.getElementById('clock').innerText =
            d.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ------------------ DIALOG BOX ------------------
    function createDialog(title, message, buttons = [{text:'OK', callback:null}]) {
        const dialog = document.createElement('div');
        dialog.className = 'window dialog';
        dialog.style.top='100px';
        dialog.style.left='100px';
        dialog.style.width='300px';
        dialog.style.height='150px';
        dialog.innerHTML = `
            <div class="titlebar">
                <div class="title">${title}</div>
                <div class="controls"><span onclick="this.closest('.dialog').remove()">X</span></div>
            </div>
            <div class="window-body" style="padding:8px;">${message}</div>
            <div style="display:flex; justify-content:flex-end; gap:4px; padding:4px;">
                ${buttons.map((b,i)=>`<button id="dlg-btn-${i}">${b.text}</button>`).join('')}
            </div>`;
        desktop.appendChild(dialog);
        dialog.style.zIndex = ++z;
        buttons.forEach((b,i)=>document.getElementById(`dlg-btn-${i}`).onclick = () => {
            if(b.callback) b.callback();
            dialog.remove();
        });
    }

    // ------------------ TEXT EDITOR ------------------
    const openWindows = {}; // maps windowId -> filename

    window.openTextEditor = (filename, content=null) => {
        if (!filename.endsWith('.TXT')) {
            // Non-text files (e.g. My Computer)
            if (filename==='My Computer Info.TXT') openSystemInfoWindow();
            return;
        }

        const winId = `win-${Date.now()}`;
        const win = document.createElement('div');
        win.classList.add('window');
        win.id = winId;
        win.style.top='50px';
        win.style.left='50px';
        const fileContent = content ?? (fileSystem[filename] ?? '');
        openWindows[winId] = filename;

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
                <div class="menu" data-menu="file">File
                    <div class="dropdown">
                        <div onclick="newFile('${winId}')">New</div>
                        <div onclick="saveFile('${winId}')">Save</div>
                        <div onclick="closeWindow('${winId}')">Exit</div>
                    </div>
                </div>
                <div class="menu" data-menu="edit">Edit
                    <div class="dropdown">
                        <div onclick="document.getElementById('${winId}').querySelector('.notepad').execCommand('cut')">Cut</div>
                        <div onclick="document.getElementById('${winId}').querySelector('.notepad').execCommand('copy')">Copy</div>
                        <div onclick="document.getElementById('${winId}').querySelector('.notepad').execCommand('paste')">Paste</div>
                        <div onclick="document.getElementById('${winId}').querySelector('.notepad').execCommand('selectAll')">Select All</div>
                    </div>
                </div>
                <div class="menu" data-menu="sizes">Sizes
                    <div class="dropdown">
                        <div onclick="setFontSize('${winId}', 12)">12px</div>
                        <div onclick="setFontSize('${winId}', 14)">14px</div>
                        <div onclick="setFontSize('${winId}', 16)">16px</div>
                        <div onclick="setFontSize('${winId}', 18)">18px</div>
                    </div>
                </div>
                <div class="menu" data-menu="window">Window
                    <div class="dropdown">
                        <div onclick="minimizeWindow('${winId}')">Minimize</div>
                        <div onclick="maximizeWindow('${winId}')">Maximize</div>
                        <div onclick="closeWindow('${winId}')">Close</div>
                    </div>
                </div>
            </div>
            <div class="window-body notepad" contenteditable="true">${fileContent}</div>
        `;
        desktop.appendChild(win);
        makeWindowDraggable(win);
        win.style.display='block';
        win.style.zIndex=++z;

        // Taskbar
        const taskBtn=document.createElement('div');
        taskBtn.id=`task-${winId}`;
        taskBtn.innerText=filename;
        taskBtn.onclick=()=>{
            win.style.display='block';
            win.style.zIndex=++z;
        };
        taskbarWindows.appendChild(taskBtn);

        // Menu hover
        win.querySelectorAll('.menu').forEach(menu=>{
            menu.addEventListener('mouseenter',()=>menu.querySelector('.dropdown').style.display='block');
            menu.addEventListener('mouseleave',()=>menu.querySelector('.dropdown').style.display='none');
        });
    };

    function openSystemInfoWindow() {
        const winId = `win-${Date.now()}`;
        const win = document.createElement('div');
        win.classList.add('window');
        win.id=winId;
        win.style.top='50px';
        win.style.left='50px';
        win.innerHTML=`
            <div class="titlebar">
                <div class="title">My Computer</div>
                <div class="controls">
                    <span onclick="closeWindow('${winId}')">X</span>
                </div>
            </div>
            <div class="window-body">
                <strong>System Information:</strong><br>
                CPU: 1 GHz JS CPU<br>
                RAM: 256 MB<br>
                OS: ScottOS 95<br>
                User: Scott
            </div>
        `;
        desktop.appendChild(win);
        makeWindowDraggable(win);
        win.style.display='block';
        win.style.zIndex=++z;

        const taskBtn=document.createElement('div');
        taskBtn.id=`task-${winId}`;
        taskBtn.innerText='My Computer';
        taskBtn.onclick=()=>{win.style.display='block';win.style.zIndex=++z};
        taskbarWindows.appendChild(taskBtn);
    }

    function makeWindowDraggable(win){
        const titlebar=win.querySelector('.titlebar');
        titlebar.addEventListener('mousedown',e=>{
            startDrag(win, e.clientX-win.offsetLeft, e.clientY-win.offsetTop);
        });
    }

    window.minimizeWindow=id=>document.getElementById(id).style.display='none';
    window.maximizeWindow=id=>{
        const win=document.getElementById(id);
        if(win.dataset.maximized==='true'){
            win.style.width=win.dataset.prevWidth;
            win.style.height=win.dataset.prevHeight;
            win.style.top=win.dataset.prevTop;
            win.style.left=win.dataset.prevLeft;
            win.dataset.maximized='false';
        }else{
            win.dataset.prevWidth=win.style.width;
            win.dataset.prevHeight=win.style.height;
            win.dataset.prevTop=win.style.top;
            win.dataset.prevLeft=win.style.left;
            win.style.width='100%';
            win.style.height='calc(100% - 32px)';
            win.style.top='0';
            win.style.left='0';
            win.dataset.maximized='true';
        }
    };

    window.closeWindow=id=>{
        const win=document.getElementById(id);
        const filename=openWindows[id];
        const notepad=win.querySelector('.notepad');
        if(filename && notepad && fileSystem[filename]!==notepad.innerText){
            createDialog('Notepad',`Save changes to ${filename}?`,[
                {text:'Yes',callback:()=>{fileSystem[filename]=notepad.innerText; win.remove(); document.getElementById(`task-${id}`).remove();}},
                {text:'No',callback:()=>{win.remove(); document.getElementById(`task-${id}`).remove();}},
                {text:'Cancel',callback:null}
            ]);
            return;
        }
        win.remove();
        const taskBtn=document.getElementById(`task-${id}`);
        if(taskBtn) taskBtn.remove();
    };

    // ------------------ TEXT EDITOR HELPERS ------------------
    window.newFile=id=>{
        const win=document.getElementById(id);
        const notepad=win.querySelector('.notepad');
        notepad.innerText='';
    };
    window.saveFile=id=>{
        const win=document.getElementById(id);
        const filename=openWindows[id];
        const notepad=win.querySelector('.notepad');
        if(filename){
            fileSystem[filename]=notepad.innerText;
            createDialog('Notepad','File saved successfully.');
        }
    };
    window.setFontSize=(id,size)=>document.getElementById(id).querySelector('.notepad').style.fontSize=size+'px';
});
