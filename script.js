let z=10;

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
