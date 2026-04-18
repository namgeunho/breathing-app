let countdownRaf=null;
function startCountdown(cb){
let n=5;
const phaseLabel=document.getElementById('phaseLabel');
const timerLabel=document.getElementById('timerLabel');
phaseLabel.textContent='준비';
timerLabel.textContent='잠시 후 시작됩니다';
document.getElementById('startBtn').textContent='취소';
function showNum(num){
const old=document.getElementById('cdNum');
if(old)old.remove();
if(num<=0){countdownRaf=null;cb();return;}
const el=document.createElement('div');
el.id='cdNum';el.className='countdown-num';
el.textContent=num;
document.getElementById('circle').parentNode.appendChild(el);
n--;
countdownRaf=setTimeout(()=>showNum(n),1000);
}
showNum(n);
}
function cancelCountdown(){
if(countdownRaf){clearTimeout(countdownRaf);countdownRaf=null;}
const el=document.getElementById('cdNum');if(el)el.remove();
if(!running && !isPaused){
document.getElementById('phaseLabel').textContent='준비';
document.getElementById('timerLabel').textContent='시작 버튼을 눌러주세요';
document.getElementById('startBtn').textContent='시작';
}
}
function startStop(){
try{getACtx().resume();}catch(e){}
if(countdownRaf){ cancelCountdown(); return; }
if(running){
running=false;
isPaused=true;
cancelAnimationFrame(raf);
raf=null;
lastTs=null;
releaseWakeLock();
stopBgm();
document.getElementById('startBtn').textContent='계속';
document.getElementById('phaseLabel').textContent='일시정지';
if(screenOff) document.getElementById('blackScreen').classList.remove('active');
logEvent('training_paused',{elapsed:Math.round(totalElapsed)});
} else if(isPaused){
isPaused=false;
running=true;
lastTs=null;
requestWakeLock();
startBgm();
document.getElementById('startBtn').textContent='일시정지';
if(screenOff) document.getElementById('blackScreen').classList.add('active');
raf=requestAnimationFrame(tick);
} else {
if(settingsOpen) cancelSettings();
prevPI=-1;
startCountdown(()=>{
const el=document.getElementById('cdNum'); if(el) el.remove();
running=true;
lastTs=null;
isPaused=false;
requestWakeLock();
startBgm();
document.getElementById('startBtn').textContent='일시정지';
if(screenOff) document.getElementById('blackScreen').classList.add('active');
raf=requestAnimationFrame(tick);
const s=getAS();
logEvent('training_start',{
mode:curMode,
preset:curMode==='program'?presets[selPI>=0?selPI:0].name:'manual',
inhale:s.inhale, exhale:s.exhale,
duration:parseInt(document.getElementById('duration').value)
});
});
}
}
function resetAll(){
running=false;isPaused=false;
cancelAnimationFrame(raf);
cancelCountdown();
releaseWakeLock();stopBgm();
phase=0;phaseTime=0;totalElapsed=0;cyclesDone=0;lastTs=null;prevPI=-1;
document.getElementById('blackScreen').classList.remove('active');
screenOff=false;document.getElementById('screenOffBtn').className='ib';
const tSec=parseInt(document.getElementById('duration').value)*60;
document.getElementById('mainArea').style.display='block';
document.getElementById('completeArea').style.display='none';
const treeMsg=document.getElementById('treeCompleteMsg');
if(treeMsg) treeMsg.style.display='none';
document.getElementById('phaseLabel').textContent='준비';
document.getElementById('timerLabel').textContent='시작 버튼을 눌러주세요';
document.getElementById('startBtn').textContent='시작';
document.getElementById('cycleCount').textContent='0';
document.getElementById('progressFill').style.width='0%';
document.getElementById('elapsedDisplay').textContent='0:00';
document.getElementById('remainDisplay').textContent=fmt(tSec);
document.getElementById('circle').style.transform='translate(-50%,-50%) scale(1)';
document.getElementById('circle').style.background=dGrad;
}
function toggleScreenOff(){screenOff=!screenOff;const btn=document.getElementById('screenOffBtn');if(screenOff){btn.className='ib ascr';if(running)document.getElementById('blackScreen').classList.add('active');}else{btn.className='ib';document.getElementById('blackScreen').classList.remove('active');}}
function exitBlackScreen(){screenOff=false;document.getElementById('screenOffBtn').className='ib';document.getElementById('blackScreen').classList.remove('active');}
async function shareResult(){
const card=document.getElementById('completeCard');
const appUrl=window.location.href.split('?')[0];
const r=lastResult;
const shareText=`들숨과 날숨 사이, 나를 만나는 브레스인\nBRETHIN 🌿`;
try{
const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:null});
const blob=await new Promise(res=>canvas.toBlob(res,'image/png'));
const file=new File([blob],'호흡훈련.png',{type:'image/png'});
if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
await navigator.share({title:'호흡 훈련 완료!',text:shareText,files:[file],url:appUrl});
giveShareBonus('result');
} else if(navigator.share){
await navigator.share({title:'호흡 훈련 완료!',text:shareText,url:appUrl});
giveShareBonus('result');
} else {
await navigator.clipboard.writeText(shareText+'\n'+appUrl);
showToast('공유 내용이 복사됐어요!');
giveShareBonus('result');
}
}catch(e){
if(e.name!=='AbortError')showToast('공유를 취소했어요');
}
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2800);}
function showPage(id,el){
if(id==='calendar'&&!curUser){
openAuthModal('로그인하면 훈련 기록이 저장되고\n어떤 기기에서도 이어서 사용할 수 있어요.');
return;
}
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
document.getElementById('page-'+id).classList.add('active');
if(el)el.classList.add('active');
else{document.querySelectorAll('.tab').forEach(t=>{if(t.getAttribute('onclick')&&t.getAttribute('onclick').includes("'"+id+"'"))t.classList.add('active');});}
const ub=document.getElementById('userBar');
curPage=id;save();
if(id==='calendar'){ub.style.display='flex';renderUserBar();}
else{ub.style.display='none';}
logEvent('page_view',{page:id});
if(id==='calendar'){renderCal();updateCalSt();}
if(id==='config'){document.getElementById('configMain').style.display='block';document.getElementById('configSub').style.display='none';renderConfigMain();}
}
function hasMemo(key){
const m=memos[key];
if(!m) return false;
if(typeof m==='string') return m.trim().length>0;
return !!(m.text||m.preMood||m.postMood);
}
function renderCal(){const now=new Date();if(calYear===undefined){calYear=now.getFullYear();calMonth=now.getMonth();}document.getElementById('calTitle').textContent=calYear+'년 '+mNames[calMonth];const grid=document.getElementById('calGrid');grid.innerHTML='';dNames.forEach(d=>{const el=document.createElement('div');el.className='dn';el.textContent=d;grid.appendChild(el);});const fd=new Date(calYear,calMonth,1).getDay();const dim=new Date(calYear,calMonth+1,0).getDate();const tk=today();for(let i=0;i<fd;i++){const el=document.createElement('div');el.className='cc empty';grid.appendChild(el);}for(let d=1;d<=dim;d++){const key=dk(calYear,calMonth,d);const el=document.createElement('div');el.className='cc';if(key===tk)el.classList.add('today');if(key===selDate)el.classList.add('sel');const num=document.createElement('div');num.className='cn';num.textContent=d;el.appendChild(num);const hasR=records[key]&&records[key].length>0;const hasM=hasMemo(key);if(hasR||hasM){const dr=document.createElement('div');dr.className='dr';if(hasR){const dot=document.createElement('div');dot.className='dot dg';dr.appendChild(dot);}if(hasM){const dot=document.createElement('div');dot.className='dot da';dr.appendChild(dot);}el.appendChild(dr);}el.addEventListener('click',()=>selD(key));grid.appendChild(el);}}
function selD(key){selDate=key;renderCal();document.getElementById('detailTitle').textContent=fl(key);const hasR=records[key]&&records[key].length>0;document.getElementById('xBtn').style.display=(hasR||hasMemo(key))?'flex':'none';renderDB(key);}
function goHome(){showPage('train',null);}