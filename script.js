document.addEventListener('DOMContentLoaded', () => {
    let z = 10;
    let dragData = null;
    const desktop = document.getElementById('desktop');
    const icons = document.querySelectorAll('.icon');

    icons.forEach(icon => {
        icon.addEventListener('mousedown', e => {
            dragData = {
                icon: icon,
                offsetX: e.clientX - icon.offsetLeft,
                offsetY: e.clientY - icon.offsetTop
            };
            icon.style.zIndex = ++z;
            e.preventDefault();
        });
    });

    document.addEventListener('mousemove', e => {
        if (dragData) {
            let x = e.clientX - dragData.offsetX;
            let y = e.clientY - dragData.offsetY;

            const rect = desktop.getBoundingClientRect();
            x = Math.max(0, Math.min(x, rect.width - dragData.icon.offsetWidth));
            y = Math.max(0, Math.min(y, rect.height - dragData.icon.offsetHeight));

            dragData.icon.style.left = x + 'px';
            dragData.icon.style.top = y + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        dragData = null;
    });

    desktop.addEventListener('click', () => {
        const startMenu = document.getElementById('startMenu');
        startMenu.style.display = 'none';
    });

    window.openWin = function(id){
        const w = document.getElementById(id);
        w.style.display='block';
        w.style.zIndex = ++z;
    }

    window.closeWin = function(id){
        document.getElementById(id).style.display='none';
    }

    window.toggleStart = function(){
        const m = document.getElementById('startMenu');
        m.style.display = m.style.display==='block'?'none':'block';
    }

    window.openFromStart = function(id){
        openWin(id);
        toggleStart();
    }

    // Clock
    setInterval(()=>{
        const d = new Date();
        document.getElementById('clock').innerText = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
    }, 1000);
});
