<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>ScottOS 95</title>
<style>
/* ---- GLOBAL RESET ---- */
*{box-sizing:border-box;user-select:none;font-family:"MS Sans Serif",Tahoma,Arial,sans-serif}
html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#008080}

/* ---- DESKTOP ---- */
#desktop{position:relative;width:100%;height:100%;padding:16px}
.icon{width:72px;text-align:center;color:#fff;font-size:12px;cursor:pointer;position:absolute}
.icon img{width:32px;height:32px;display:block;margin:0 auto 4px}

/* ---- TASKBAR ---- */
#taskbar{position:absolute;bottom:0;left:0;width:100%;height:32px;background:#c0c0c0;border-top:2px solid #fff;border-left:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;display:flex;align-items:center;padding:2px}
#startBtn{background:#c0c0c0;border:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;padding:2px 8px;font-weight:bold;cursor:pointer;margin-right:4px}
#clock{margin-left:auto;margin-right:8px;font-size:12px}

/* ---- START MENU ---- */
#startMenu{position:absolute;bottom:34px;left:2px;width:220px;background:#c0c0c0;border:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;display:none}
.start-header{background:#000080;color:#fff;padding:6px;font-weight:bold}
.start-item{padding:6px;border-top:1px solid #808080;cursor:pointer}
.start-item:hover{background:#000080;color:#fff}

/* ---- WINDOW SYSTEM ---- */
.window{position:absolute;width:420px;background:#c0c0c0;border:2px solid #fff;border-right:2px solid #404040;border-bottom:2px solid #404040;display:none}
.titlebar{background:linear-gradient(to right,#000080,#0000a0);color:#fff;padding:4px;font-size:12px;display:flex;justify-content:space-between;align-items:center;cursor:move}
.controls span{display:inline-block;width:16px;height:16px;background:#c0c0c0;border:1px solid #404040;color:#000;text-align:center;line-height:14px;font-weight:bold;cursor:pointer;margin-left:2px}
.window-body{background:#fff;padding:8px;font-size:12px;height:260px;overflow:auto}

/* ---- NOTEPAD ---- */
.notepad{font-family:Courier New,monospace;white-space:pre-wrap}

/* ---- ICON POSITIONS ---- */
#icon-about{top:20px;left:20px}
#icon-skills{top:100px;left:20px}
#icon-projects{top:180px;left:20px}
#icon-exp{top:260px;left:20px}
#icon-recycle{bottom:60px;right:20px}

</style>
</head>
<body>

<div id="desktop">
  <!-- DESKTOP ICONS -->
  <div class="icon" id="icon-about" ondblclick="openWin('aboutWin')">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpi/P//PwMlgImBQjDwHxh4gDEwMDA8YIABBgAAMNQx8gNIBZQAAAABJRU5ErkJggg=="/>
    AboutMe.txt
  </div>

  <div class="icon" id="icon-skills" ondblclick="openWin('skillsWin')">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpi/P//PwMlgImBQjDwHxh4gDEwMDA8YIABBgAAMNQx8gNIBZQAAAABJRU5ErkJggg=="/>
    Skills.txt
  </div>

  <div class="icon" id="icon-projects" ondblclick="openWin('projectsWin')">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpi/P//PwMlgImBQjDwHxh4gDEwMDA8YIABBgAAMNQx8gNIBZQAAAABJRU5ErkJggg=="/>
    Projects
  </div>

  <div class="icon" id="icon-exp" ondblclick="openWin('expWin')">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpi/P//PwMlgImBQjDwHxh4gDEwMDA8YIABBgAAMNQx8gNIBZQAAAABJRU5ErkJggg=="/>
    Experience.txt
  </div>

  <div class="icon" id="icon-recycle">
    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAANFJREFUeNpi/P//PwMlgImBQjDwHxh4gDEwMDA8YIABBgAAMNQx8gNIBZQAAAABJRU5ErkJggg=="/>
    Recycle Bin
  </div>

</div>

<!-- WINDOWS -->
<div class="window" id="aboutWin" style="top:80px;left:120px">
  <div class="titlebar">AboutMe.txt<div class="controls"><span onclick="closeWin('aboutWin')">X</span></div></div>
  <div class="window-body notepad">
Hi, I'm Scott Butler.

Backend-focused .NET Software Engineer.

Specialising in:
- C# / .NET
- EF Core
- PostgreSQL
- Clean Architecture
- API Design

I build systems that prioritise:
- correctness
- maintainability
- clarity
- long-term scalability

This portfolio is a simulated Windows 95 OS environment.
  </div>
</div>

<div class="window" id="skillsWin" style="top:120px;left:180px">
  <div class="titlebar">Skills.txt<div class="controls"><span onclick="closeWin('skillsWin')">X</span></div></div>
  <div class="window-body notepad">
Languages:
- C#
- SQL
- TypeScript

Frameworks:
- .NET
- EF Core
- ASP.NET Core

Concepts:
- Clean Architecture
- DDD principles
- Async/await
- Dependency Injection
- Unit Testing

Tools:
- Rider
- GitHub
- Docker
- PostgreSQL
  </div>
</div>

<div class="window" id="projectsWin" style="top:140px;left:240px">
  <div class="titlebar">Projects<div class="controls"><span onclick="closeWin('projectsWin')">X</span></div></div>
  <div class="window-body">
  <b>Teczter</b><br>
  Enterprise backend system<br><br>
  <b>PortfolioOS</b><br>
  Interactive OS-based portfolio<br><br>
  <b>Legacy Migration API</b><br>
  Third-party integration system
  </div>
</div>

<div class="window" id="expWin" style="top:160px;left:300px">
  <div class="titlebar">Experience.txt<div class="controls"><span onclick="closeWin('expWin')">X</span></div></div>
  <div class="window-body notepad">
Software Engineer (.NET)

Background:
- Former teacher
- Self-taught developer
- Backend specialist

Experience:
- API development
- System migrations
- Clean architecture systems
- Enterprise backend design
  </div>
</div>

<!-- TASKBAR -->
<div id="taskbar">
  <div id="startBtn" onclick="toggleStart()">Start</div>
  <div id="clock"></div>
</div>

<!-- START MENU -->
<div id="startMenu">
  <div class="start-header">ScottOS 95</div>
  <div class="start-item" onclick="openFromStart('aboutWin')">AboutMe.txt</div>
  <div class="start-item" onclick="openFromStart('skillsWin')">Skills.txt</div>
  <div class="start-item" onclick="openFromStart('projectsWin')">Projects</div>
  <div class="start-item" onclick="openFromStart('expWin')">Experience.txt</div>
</div>

<script>
let z=10;
function openWin(id){const w=document.getElementById(id);w.style.display='block';w.style.zIndex=++z}
function closeWin(id){document.getElementById(id).style.display='none'}
function toggleStart(){const m=document.getElementById('startMenu');m.style.display=m.style.display==='block'?'none':'block'}
function openFromStart(id){openWin(id);toggleStart()}

// Clock
setInterval(()=>{
 const d=new Date();
 document.getElementById('clock').innerText=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
},1000);
</script>

</body>
</html>
