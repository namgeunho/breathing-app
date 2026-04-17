let running=false,raf=null,phase=0,phaseTime=0,totalElapsed=0,cyclesDone=0,lastTs=null;
let isPaused=false;
let calYear,calMonth,selDate=null;
let records={},memos={};
let soundOn=true,audioCtx=null,prevPI=-1,settingsOpen=false;
let bgmOn=false,bgmNode=null,bgmGain=null;
let curSfx='basic',curBgm='forest';
let sfxVolume=60,bgmVolume=40; 
let screenOff=false,lastResult=null;
let curMode='program',selPI=0;
let tempPresets=[],tempManSt={},tempSelPI=-1;
let userName='사용자',userPhoto=null,curTheme='black';
let curPage='train';
let curUser = null; 
let SFX_LIST=[
{id:'basic',name:'기본',type:'sfx'},
{id:'soft',name:'부드러운',type:'sfx'},
{id:'deep',name:'깊은',type:'sfx'},
{id:'bell',name:'종소리',type:'sfx'},
{id:'whisper',name:'자연',type:'sfx'}
];
let BGM_LIST=[
{id:'forest',name:'숲속',type:'bgm'},
{id:'rain',name:'빗소리',type:'bgm'},
{id:'ocean',name:'파도',type:'bgm'},
{id:'white',name:'화이트노이즈',type:'bgm'},
{id:'zen',name:'젠',type:'bgm'}
];
async function loadSounds(){
try{
const snap=await db.collection('sounds').get();
if(snap.empty) return; 
const all=snap.docs.map(d=>({id:d.id,...d.data()})).filter(d=>d.active!==false);
const sfx=all.filter(d=>d.type==='sfx').sort((a,b)=>(a.order||0)-(b.order||0));
const bgm=all.filter(d=>d.type==='bgm').sort((a,b)=>(a.order||0)-(b.order||0));
if(sfx.length) SFX_LIST=sfx;
if(bgm.length) BGM_LIST=bgm;
if(!SFX_LIST.find(s=>s.id===curSfx)) curSfx=SFX_LIST[0].id;
if(!BGM_LIST.find(b=>b.id===curBgm)) curBgm=BGM_LIST[0].id;
renderSfxChips();
renderBgmChips();
}catch(e){
console.log('사운드 로드 실패 (기본값 사용):', e.message);
}
}
const defPresets=[
{name:'초급', inhale:4, holdIn:0, exhale:4, holdOut:0, duration:3, soundOn:true, bgmOn:false},
{name:'중급', inhale:5, holdIn:2, exhale:6, holdOut:0, duration:5, soundOn:true, bgmOn:false},
{name:'고급', inhale:6, holdIn:4, exhale:8, holdOut:2, duration:10, soundOn:true, bgmOn:false},
{name:'스트레스', inhale:4, holdIn:4, exhale:4, holdOut:4, duration:5, soundOn:true, bgmOn:true},
{name:'활력', inhale:6, holdIn:2, exhale:4, holdOut:0, duration:5, soundOn:true, bgmOn:false},
{name:'수면', inhale:4, holdIn:7, exhale:8, holdOut:0, duration:10, soundOn:false, bgmOn:true},
{name:'커스텀', inhale:0, holdIn:0, exhale:0, holdOut:0, duration:5, soundOn:true, bgmOn:false},
{name:'커스텀', inhale:0, holdIn:0, exhale:0, holdOut:0, duration:5, soundOn:true, bgmOn:false},
{name:'커스텀', inhale:0, holdIn:0, exhale:0, holdOut:0, duration:5, soundOn:true, bgmOn:false}
];
let presets=defPresets.map(p=>({...p}));
const manSt={inhale:4,holdIn:4,exhale:4,holdOut:0};
const pGrads=[
'radial-gradient(circle,#FFD700 15%,rgba(255,215,0,0.45) 58%,transparent 100%)', 
'radial-gradient(circle,#FFD700 15%,rgba(255,215,0,0.45) 58%,transparent 100%)', 
'radial-gradient(circle,#FFD700 15%,rgba(255,215,0,0.45) 58%,transparent 100%)', 
'radial-gradient(circle,#FFD700 15%,rgba(255,215,0,0.45) 58%,transparent 100%)', 
];
const dGrad='radial-gradient(circle,#FFD700 15%,rgba(255,215,0,0.25) 58%,transparent 100%)';
const dNames=['일','월','화','수','목','금','토'];
const mNames=['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
const LS='breath5_';
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;});