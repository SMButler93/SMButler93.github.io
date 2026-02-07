let z = 10;
let dragData = null;

function openWin(id){
    const w = document.getElementById(id);
    w.style.display='block';
    w.style.zIndex=++z;
}

function closeWin(id){
    document.getElementById(id).style.display='none';
}

function toggleStart(){
    const m = document.getElementById('startMenu');
    m.style.display = m.style.display==='block'?'none':'block';
}

function openFromStart(id){
    openWin(id);
    toggleStart();
}

setInterval(()=>{
    const d=new Date();
    document.getElementById('clock').innerText = d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
},1000);

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

        const desktop = document.getElementById('desktop');
        const rect = desktop.getBoundingClientRect();
        x = Math.max(0, Math.min(x, rect.width - dragData.icon.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - dragData.icon.offsetHeight));

        dragData.icon.style.left = x + 'px';
        dragData.icon.style.top = y + 'px';
    }
});

document.addEventListener('mouseup', e => {
    dragData = null;
});
