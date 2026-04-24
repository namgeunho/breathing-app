function getACtx(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}
function setSfxVol(v){
sfxVolume=parseInt(v);
const el=document.getElementById('sfxVolVal');if(el)el.textContent=v;
save();
}
function setBgmVol(v){
bgmVolume=parseInt(v);
const el=document.getElementById('bgmVolVal');if(el)el.textContent=v;
if(bgmAudio) bgmAudio.volume=bgmVolume/100;
if(bgmGain) bgmGain.gain.setValueAtTime(bgmVolume/100*0.1,audioCtx?audioCtx.currentTime:0);
save();
}
function tone(f,t,d,v){
try{const ctx=getACtx();const o=ctx.createOscillator();const g=ctx.createGain();
o.connect(g);g.connect(ctx.destination);o.type=t;o.frequency.setValueAtTime(f,ctx.currentTime);
const vol=v*(sfxVolume/100);
g.gain.setValueAtTime(vol,ctx.currentTime);
g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+d);
o.start(ctx.currentTime);o.stop(ctx.currentTime+d);}catch(e){}
}
function playSfxTone(sfxId,phaseName){
if(!soundOn)return;
const sfxItem=SFX_LIST.find(s=>s.id===sfxId);
if(sfxItem&&sfxItem.url){
try{
const audio=new Audio(sfxItem.url);
audio.volume=sfxVolume/100;
audio.play().catch(e=>{});
return;
}catch(e){}
}
const m={
basic:{i:[528,'sine',0.35,0.18,660,'sine',0.25,0.1,180],e:[396,'sine',0.4,0.16,330,'sine',0.3,0.1,200],h:[440,'triangle',0.2,0.08]},
soft: {i:[440,'sine',0.4,0.12,550,'sine',0.3,0.08,200],e:[330,'sine',0.5,0.1,264,'sine',0.35,0.07,220],h:[396,'sine',0.25,0.07]},
deep: {i:[220,'sine',0.4,0.2,330,'sine',0.3,0.12,150],e:[165,'sine',0.45,0.18,220,'sine',0.3,0.1,180],h:[196,'triangle',0.25,0.1]},
bell: {i:[784,'sine',0.3,0.15,1046,'sine',0.2,0.08,100],e:[659,'sine',0.35,0.12,523,'sine',0.25,0.08,120],h:[698,'triangle',0.2,0.08]},
whisper:{i:[528,'triangle',0.5,0.08,660,'triangle',0.4,0.06,200],e:[396,'triangle',0.55,0.07,330,'triangle',0.4,0.05,230],h:[440,'sine',0.3,0.05]}
};
const s=m[sfxId]||m.basic;
const k=phaseName==='들숨'?'i':phaseName==='날숨'?'e':'h';
const p=s[k];
tone(p[0],p[1],p[2],p[3]);
if(p.length>4)setTimeout(()=>tone(p[4],p[5],p[6],p[7]),p[8]);
}
function playPS(n){playSfxTone(curSfx,n);}
function playFS(){if(!soundOn)return;[0,150,300,500].forEach((d,i)=>{setTimeout(()=>tone([528,660,784,1046][i],'sine',0.5,0.15),d);});}
function setSound(on){soundOn=on;document.getElementById('soundOn').className=on?'on':'off';document.getElementById('soundOff').className=on?'off':'on';const sec=document.getElementById('sfxSection');if(sec)sec.style.display=on?'block':'none';if(on)try{getACtx().resume();}catch(e){}save();}
let bgmAudio=null; 
function startBgm(){
if(!bgmOn||bgmNode||bgmAudio)return;
const bgmItem=BGM_LIST.find(b=>b.id===curBgm);
if(bgmItem&&bgmItem.url){
try{
bgmAudio=new Audio(bgmItem.url);
bgmAudio.loop=true;
bgmAudio.volume=bgmVolume/100;
bgmAudio.play().catch(e=>console.log('bgm audio err',e));
return;
}catch(e){console.log('bgm url err',e);}
}
try{
const ctx=getACtx();ctx.resume();
bgmGain=ctx.createGain();
bgmGain.gain.setValueAtTime(bgmVolume/100*0.1,ctx.currentTime);
bgmGain.connect(ctx.destination);
const cfg={forest:{f:[180,240,320,430],t:'sine'},rain:{f:[250,500,750,1000],t:'sawtooth'},ocean:{f:[60,90,120,150],t:'sine'},white:{f:[300,700,1100,1500],t:'sawtooth'},zen:{f:[136,272,204,340],t:'sine'}};
const c=cfg[curBgm]||cfg.forest;
bgmNode=c.f.map((f,i)=>{
const o=ctx.createOscillator();const g=ctx.createGain();
o.type=c.t;
o.frequency.setValueAtTime(f,ctx.currentTime);
o.detune.setValueAtTime((i%2?3:-3)*(i+1),ctx.currentTime);
g.gain.setValueAtTime(0.015,ctx.currentTime);
o.connect(g);g.connect(bgmGain);o.start();return o;
});
}catch(e){console.log('bgm err',e);}
}
function stopBgm(){
if(bgmAudio){try{bgmAudio.pause();bgmAudio.src='';}catch(e){}bgmAudio=null;}
if(bgmNode){bgmNode.forEach(o=>{try{o.stop();}catch(e){}});bgmNode=null;}
if(bgmGain){try{bgmGain.disconnect();}catch(e){}bgmGain=null;}
}
function setBgm(on){bgmOn=on;document.getElementById('bgmOn').className=on?'on':'off';document.getElementById('bgmOff').className=on?'off':'on';const sec=document.getElementById('bgmSection');if(sec)sec.style.display=on?'block':'none';if(on&&running)startBgm();else stopBgm();save();}
function setBgmVol(v){
bgmVolume=parseInt(v);
const el=document.getElementById('bgmVolVal');if(el)el.textContent=v;
if(bgmAudio) bgmAudio.volume=bgmVolume/100;
if(bgmGain) bgmGain.gain.setValueAtTime(bgmVolume/100*0.1,audioCtx.currentTime);
save();
}
function selSfx(id){
curSfx=id;
renderSfxChips();
try{getACtx().resume().then(()=>playSfxTone(id,'들숨'));}catch(e){playSfxTone(id,'들숨');}
save();
}
let bgmPreviewTimer=null;
function selBgmTrack(id){
curBgm=id;
renderBgmChips();
if(bgmOn&&running){stopBgm();startBgm();save();return;}
stopBgm();
if(bgmPreviewTimer){clearTimeout(bgmPreviewTimer);bgmPreviewTimer=null;}
try{
const ctx=getACtx();ctx.resume();
const wasOn=bgmOn;bgmOn=true;
startBgm();
bgmPreviewTimer=setTimeout(()=>{
if(!running){stopBgm();}
bgmOn=wasOn;
},10000);
}catch(e){}
save();
}
function renderSfxChips(){const el=document.getElementById('sfxChips');if(!el)return;el.innerHTML=SFX_LIST.map(s=>`<button class="sound-chip${s.id===curSfx?' act-chip':''}" onclick="selSfx('${s.id}')">${s.name}</button>`).join('');}
function renderBgmChips(){const el=document.getElementById('bgmChips');if(!el)return;el.innerHTML=BGM_LIST.map(b=>`<button class="sound-chip${b.id===curBgm?' act-chip':''}" onclick="selBgmTrack('${b.id}')">${b.name}</button>`).join('');}
function renderNoticesHtml(){
if(!_notices.length)return`<div class="nb"><div style="font-size:32px;margin-bottom:12px;">📢</div><div style="font-size:16px;font-weight:500;color:var(--text);margin-bottom:6px;">공지사항</div><div style="font-size:13px;color:var(--text2);line-height:1.6;">현재 등록된 공지사항이 없습니다.</div></div>`;
const pinned=_notices.filter(n=>n.pinned);
const normal=_notices.filter(n=>!n.pinned);
const render=arr=>arr.map(n=>`<div class="notice-card" onclick="showNoticeDetail(${_notices.indexOf(n)})"><div class="notice-card-preview"><div style="flex:1;">${n.pinned?'<div class="notice-pin">📌 중요</div>':''}<div class="notice-title">${eh(n.title)}</div><div style="font-size:13px;color:var(--text2);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${eh((n.content||'').substring(0,40))}${(n.content||'').length>40?'…':''}</div><div class="notice-date">${fmtDate(n.createdAt)}</div></div><div class="car">›</div></div></div>`).join('');
return render(pinned)+render(normal);
}
function showNoticeDetail(idx){
const n=_notices[idx];
const sub=document.getElementById('configSub');
const back=`<button class="cbk" onclick="showSub('notice')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="10,3 4,8 10,13"/></svg> 공지사항</button>`;
const imgHtml = n.imageUrl ? `<div style="margin:0 -1rem 1rem;"><img src="${n.imageUrl}" style="width:100%;display:block;max-height:300px;object-fit:cover;border-radius:8px;"></div>` : '';
const linkLabel = (n.linkLabel && n.linkLabel.trim()) ? eh(n.linkLabel) : '자세히 보기 →';
const linkHtml = n.linkUrl ? `<div style="margin-top:1.5rem;"><a href="${n.linkUrl}" target="_blank" rel="noopener" style="display:inline-block;padding:12px 20px;background:var(--accent,#d4a84b);color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:500;">${linkLabel}</a></div>` : '';
sub.innerHTML=back+`
${n.pinned?'<div class="notice-pin" style="margin-bottom:10px;">📌 중요</div>':''}
<div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px;">${eh(n.title)}</div>
<div style="font-size:12px;color:var(--text3);margin-bottom:1.5rem;">${fmtDate(n.createdAt)}</div>
${imgHtml}
<div class="notice-body" style="line-height:1.8;">${renderContent(n.content)}</div>
${linkHtml}`;
}
function setMode(mode){
curMode=mode;
document.getElementById('modeProgram').className='mb'+(mode==='program'?' active':'');
document.getElementById('modeManual').className='mb'+(mode==='manual'?' active':'');
tempSelPI=-1; 
renderSBody();
updateSum();
}
function renderSBody(){
const body=document.getElementById('settingsBody');
if(curMode==='program'){
const g=tempPresets.map((p,i)=>{
let cls='pc';
if(i===tempSelPI) cls+=' act';
else if(i===selPI) cls+=' sel-pc';
return `<div class="${cls}" onclick="selPreset(${i})">
<div class="pcn">${eh(p.name)}</div>
<div class="pcs">${p.inhale}·${p.holdIn}·${p.exhale}·${p.holdOut}</div>
</div>`;
}).join('');
body.innerHTML=`<div class="pg">${g}</div><div id="pep"></div>`;
} else {
const s=tempManSt;
body.innerHTML=`
<div class="row"><span class="lbl">들숨</span><input type="range" id="inhale" min="1" max="60" value="${s.inhale}" step="1" oninput="onMan('inhale',this.value)"><span class="val" id="inhaleVal">${s.inhale}초</span></div>
<div class="row"><span class="lbl">멈춤(들숨)</span><input type="range" id="holdIn" min="0" max="60" value="${s.holdIn}" step="1" oninput="onMan('holdIn',this.value)"><span class="val" id="holdInVal">${s.holdIn}초</span></div>
<div class="row"><span class="lbl">날숨</span><input type="range" id="exhale" min="1" max="60" value="${s.exhale}" step="1" oninput="onMan('exhale',this.value)"><span class="val" id="exhaleVal">${s.exhale}초</span></div>
<div class="row"><span class="lbl">멈춤(날숨)</span><input type="range" id="holdOut" min="0" max="60" value="${s.holdOut}" step="1" oninput="onMan('holdOut',this.value)"><span class="val" id="holdOutVal">${s.holdOut}초</span></div>`;
}
}
function selPreset(i){
if(tempSelPI===i){
tempSelPI=-1;
renderSBody();
return;
}
tempSelPI=i;
tempPresets[i]={...presets[i]};
renderSBody();
renderPE();
}
function renderPE(){
const p=document.getElementById('pep');
if(!p)return;
const pr=tempPresets[tempSelPI];
if(!pr)return;
const isCustom=pr.name==='커스텀'||pr.inhale===0;
p.innerHTML=`<div class="pe">
<div style="font-size:12px;color:var(--text2);margin-bottom:8px;font-weight:500;">${eh(pr.name)} 편집</div>
<input class="pni" id="pni" value="${eh(pr.name)}" maxlength="8" placeholder="이름" oninput="onPN(this.value)">
<div class="row"><span class="lbl">들숨</span><input type="range" id="p-inhale" min="${isCustom?0:1}" max="60" value="${pr.inhale}" step="1" oninput="onPV('inhale',this.value)"><span class="val" id="p-inhaleVal">${pr.inhale}초</span></div>
<div class="row"><span class="lbl">멈춤(들숨)</span><input type="range" id="p-holdIn" min="0" max="60" value="${pr.holdIn}" step="1" oninput="onPV('holdIn',this.value)"><span class="val" id="p-holdInVal">${pr.holdIn}초</span></div>
<div class="row"><span class="lbl">날숨</span><input type="range" id="p-exhale" min="${isCustom?0:1}" max="60" value="${pr.exhale}" step="1" oninput="onPV('exhale',this.value)"><span class="val" id="p-exhaleVal">${pr.exhale}초</span></div>
<div class="row"><span class="lbl">멈춤(날숨)</span><input type="range" id="p-holdOut" min="0" max="60" value="${pr.holdOut}" step="1" oninput="onPV('holdOut',this.value)"><span class="val" id="p-holdOutVal">${pr.holdOut}초</span></div>
<div style="display:flex;justify-content:flex-end;margin-top:12px;">
<button class="bp bsm" style="padding:8px 22px;" onclick="savePreset()">저장하기</button>
</div>
</div>`;
}
function onPN(v){
if(tempSelPI<0)return;
tempPresets[tempSelPI].name=v;
const title=document.querySelector('#pep .pe div');
if(title)title.textContent=(v||'이름없음')+' 편집';
}
function onPV(k,v){
if(tempSelPI<0)return;
tempPresets[tempSelPI][k]=parseInt(v);
const el=document.getElementById('p-'+k+'Val');
if(el)el.textContent=v+'초';
}
function onMan(k,v){
tempManSt[k]=parseInt(v);
const el=document.getElementById(k+'Val');
if(el)el.textContent=v+'초';
}
function onDurChange(){const v=document.getElementById('duration').value;document.getElementById('durationVal').textContent=v+'분';if(!running)document.getElementById('remainDisplay').textContent=fmt(v*60);updateSum();save();}
function getAS(){
if(curMode==='program'){
const idx=selPI>=0?selPI:0;
const p=presets[idx];
return{inhale:p.inhale,holdIn:p.holdIn,exhale:p.exhale,holdOut:p.holdOut};
}
return{...manSt};
}
function updateSum(){
const s=getAS();const d=document.getElementById('duration').value;
let p='';
if(curMode==='program'){
const nm=selPI>=0?presets[selPI].name:presets[0].name;
p=`[${nm}] `;
}
p+=`들숨${s.inhale}`;if(s.holdIn>0)p+=` / 멈춤${s.holdIn}`;p+=` / 날숨${s.exhale}`;if(s.holdOut>0)p+=` / 멈춤${s.holdOut}`;p+=` · ${d}분`;
document.getElementById('cfgSummary').textContent=p;
}
function toggleSettings(){
if(!settingsOpen){
settingsOpen=true;
tempPresets=presets.map(p=>({...p}));
tempManSt={...manSt};
tempSelPI=-1;
document.getElementById('settingsPanel').className='sp open';
document.getElementById('cfgBtn').className='ib acfg';
renderSBody();
renderSfxChips();
renderBgmChips();
window.scrollTo({top:0, behavior:'smooth'});
}
}
function savePreset(){
if(tempSelPI<0)return;
presets[tempSelPI]={...tempPresets[tempSelPI]};
selPI=tempSelPI;
tempSelPI=-1;
save();
updateSum();
renderSBody(); 
showToast('저장됐어요!');
}
function saveSettings(){
if(curMode==='manual'){
Object.assign(manSt,tempManSt);
}
save();
updateSum();
settingsOpen=false;
document.getElementById('settingsPanel').className='sp';
document.getElementById('cfgBtn').className='ib';
tempPresets=[];tempManSt={};tempSelPI=-1;
}
function cancelSettings(){
settingsOpen=false;
document.getElementById('settingsPanel').className='sp';
document.getElementById('cfgBtn').className='ib';
tempPresets=[];tempManSt={};tempSelPI=-1;
}function getPL(){const s=getAS();return[{name:'들숨',dur:s.inhale,gi:0},{name:'멈춤',dur:s.holdIn,gi:1},{name:'날숨',dur:s.exhale,gi:2},{name:'멈춤',dur:s.holdOut,gi:3}].filter(x=>x.dur>0);}
function getScale(name, prog, gi, prevName){
if(name==='들숨') return 1.0 + prog * 0.8;
if(name==='날숨') return 1.8 - prog * 0.8;
if(name==='멈춤'){
if(gi===1) return 1.8;
return 1.0;
}
return 1.0;
}
function tick(ts){
if(!running)return;
if(!lastTs)lastTs=ts;
const dt=(ts-lastTs)/1000;lastTs=ts;
totalElapsed+=dt;
const tSec=parseInt(document.getElementById('duration').value)*60;
if(totalElapsed>=tSec){totalElapsed=tSec;finish();return;}
const list=getPL();if(!list.length)return;
phaseTime+=dt;
while(phaseTime>=list[phase%list.length].dur){
phaseTime -= list[phase%list.length].dur;
phase++;
if(phase>=list.length){phase=0;cyclesDone++;document.getElementById('cycleCount').textContent=cyclesDone;}
}
const ci=phase%list.length;
const cur=list[ci];
const prog=phaseTime/cur.dur; 
if(ci!==prevPI){prevPI=ci;playPS(cur.name);}
const sc=getScale(cur.name,prog,cur.gi);
const rem=Math.max(0,cur.dur-phaseTime);
document.getElementById('circle').style.transform=`translate(-50%,-50%) scale(${sc})`;
document.getElementById('circle').style.background=pGrads[cur.gi];
document.getElementById('phaseLabel').textContent=cur.name;
document.getElementById('timerLabel').textContent=Math.ceil(rem)+'초';
document.getElementById('progressFill').style.width=((totalElapsed/tSec)*100)+'%';
document.getElementById('elapsedDisplay').textContent=fmt(totalElapsed);
document.getElementById('remainDisplay').textContent=fmt(tSec-totalElapsed);
if(screenOff){
document.getElementById('bs-phase').textContent=cur.name;
document.getElementById('bs-timer').textContent=Math.ceil(rem);
document.getElementById('bs-prog-fill').style.width=((totalElapsed/tSec)*100)+'%';
document.getElementById('bs-total').textContent=fmt(totalElapsed)+' / '+fmt(tSec);
}
raf=requestAnimationFrame(tick);
}
function saveRec(){const key=today();if(!records[key])records[key]=[];const s=getAS();const nm=curMode==='program'?presets[selPI>=0?selPI:0].name:null;records[key].push({time:nt(),duration:Math.round(totalElapsed/60*10)/10,cycles:cyclesDone,inhale:s.inhale,holdIn:s.holdIn,exhale:s.exhale,holdOut:s.holdOut,mode:curMode,level:nm});save();}
function finish(){
running=false;isPaused=false;
cancelAnimationFrame(raf);playFS();stopBgm();
document.getElementById('blackScreen').classList.remove('active');
screenOff=false;document.getElementById('screenOffBtn').className='ib';
releaseWakeLock();
const s=getAS();
const nm=curMode==='program'?presets[selPI>=0?selPI:0].name:null;
lastResult={duration:Math.round(totalElapsed/60*10)/10,cycles:cyclesDone,...s,date:fl(today()),time:nt(),level:nm,earnedTP:0};
logEvent('training_complete',{mode:curMode,preset:nm||'manual',duration_min:lastResult.duration,cycles:cyclesDone});
if(curUser){
saveRec();
const treeResult=updateTreeAfterTrain(lastResult.duration,'','');
lastResult.earnedTP = treeResult.gained || 0;
// TP 로그 기록 (항목별 분리)
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
const td=today();
if(!tpLog[td])tpLog[td]=[];
// 하루 1번만 적립되어야 하는 항목
const oncePerDay=['train_streak','train_lv','train_first'];
(treeResult.tpItems||[{type:'train',label:`${Math.round(lastResult.duration)}분 훈련`,tp:treeResult.gained}]).forEach(item=>{
  if(oncePerDay.includes(item.type)){
    // 당일 tpLog에 같은 type이 이미 있으면 skip
    if(tpLog[td].some(e=>e.type===item.type)) return;
  }
  tpLog[td].push(item);
});
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
clearTimeout(finish._tpSave);
finish._tpSave=setTimeout(()=>{if(typeof saveUserData==='function')saveUserData();},2000);
showCC();
setTimeout(()=>showTreeOnComplete(treeResult), 400);
} else {
const msgEl=document.getElementById('treeCompleteMsg');
if(msgEl) msgEl.style.display='none';
showCC();
}
}
function showCC(){
document.getElementById('mainArea').style.display='none';
document.getElementById('completeArea').style.display='block';
const r=lastResult;
// 날짜+시간
const now=new Date();
const hh=now.getHours(),mm=now.getMinutes();
const ampm=hh<12?'오전':'오후';
const h12=hh%12||12;
const timeStr=`${ampm} ${h12}:${String(mm).padStart(2,'0')}`;
document.getElementById('cc-datetime').textContent=`${r.date}  ·  ${timeStr}`;
// 훈련시간/횟수/적립TP
document.getElementById('cc-duration').textContent=r.duration;
document.getElementById('cc-cycles').textContent=r.cycles;
document.getElementById('cc-tp').textContent=r.earnedTP||0;
// 패턴
let pat=r.level?`[${r.level}]  `:'';
pat+=`들숨 ${r.inhale}초`;
if(r.holdIn>0)pat+=`  ·  멈춤 ${r.holdIn}초`;
pat+=`  ·  날숨 ${r.exhale}초`;
if(r.holdOut>0)pat+=`  ·  멈춤 ${r.holdOut}초`;
document.getElementById('cc-pattern').textContent=pat;
// 캔버스 배경 그리기
const canvas=document.getElementById('ccCanvas');
if(canvas){
const ctx=canvas.getContext('2d');
const w=canvas.width,h=canvas.height,cx=w/2,cy=h/2;
ctx.clearRect(0,0,w,h);
// 별
const rng=(a,b)=>Math.random()*(b-a)+a;
for(let i=0;i<70;i++){
const x=rng(0,w),y=rng(0,h),r=rng(0.3,1.2),a=rng(0.25,0.65);
ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
ctx.fillStyle=`rgba(255,255,255,${a.toFixed(2)})`;ctx.fill();
}
// 큰 별 4개
[{x:w*0.12,y:h*0.07,r:1.7,a:0.82},{x:w*0.88,y:h*0.05,r:1.6,a:0.78},{x:w*0.14,y:h*0.39,r:1.5,a:0.72},{x:w*0.85,y:h*0.31,r:1.6,a:0.75}].forEach(s=>{
const len=s.r*5;
ctx.save();ctx.globalAlpha=s.a*0.45;ctx.strokeStyle='#fff';ctx.lineWidth=0.5;
ctx.beginPath();ctx.moveTo(s.x-len,s.y);ctx.lineTo(s.x+len,s.y);ctx.stroke();
ctx.beginPath();ctx.moveTo(s.x,s.y-len);ctx.lineTo(s.x,s.y+len);ctx.stroke();
ctx.restore();
ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
ctx.fillStyle=`rgba(255,255,255,${s.a.toFixed(2)})`;ctx.fill();
});
}
}