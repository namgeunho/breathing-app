(function(){
const ua=navigator.userAgent.toLowerCase();
const isInApp=/kakaotalk|kakaostory|naver|instagram|fbios|fb_iab|fban|line|wechat|micromessenger/.test(ua);
if(!isInApp) return;
const banner=document.getElementById('inappBanner');
if(banner){
banner.style.display='block';
setTimeout(()=>{
const h=banner.offsetHeight;
const wrap=document.querySelector('.wrap');
if(wrap) wrap.style.paddingTop=`calc(env(safe-area-inset-top,0px) + ${h}px)`;
},50);
}
})();
function openInChrome(){
const url=window.location.href;
const ua=navigator.userAgent;
const uaL=ua.toLowerCase();
if(/android/.test(uaL)){
// 카카오톡 인앱: 카카오 전용 외부 브라우저 스킴 우선 시도
if(/kakaotalk/i.test(ua)){
window.location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(url);
return;
}
// 네이버 인앱: 크롬 직접 실행 스킴 먼저 시도 → 실패 시 intent 폴백
if(/naver/i.test(ua)){
window.location.href='googlechrome://navigate?url='+encodeURIComponent(url);
setTimeout(()=>{
// 아직 페이지에 있으면 intent 스킴으로 재시도
const hostAndPath=url.replace(/^https?:\/\//,'');
window.location.href='intent://'+hostAndPath+'#Intent;scheme=https;package=com.android.chrome;end';
},800);
return;
}
// 인스타/페북 등 기타 인앱: intent 스킴 우선
const hostAndPath=url.replace(/^https?:\/\//,'');
window.location.href='intent://'+hostAndPath+'#Intent;scheme=https;package=com.android.chrome;end';
// 폴백: 일정 시간 후에도 안 열리면 URL 복사 안내
setTimeout(()=>{
if(document.visibilityState==='visible'){
try{
navigator.clipboard.writeText(url);
if(typeof showToast==='function'){
showToast('크롬이 설치 안 된 것 같아요. URL을 복사했어요.');
} else {
alert('크롬이 설치되어 있지 않거나 차단됐어요.\nURL이 복사됐으니 Chrome에 붙여넣어 주세요.');
}
}catch(e){
prompt('아래 URL을 복사해서 Chrome에서 열어주세요:', url);
}
}
},2500);
} else if(/iphone|ipad|ipod/.test(uaL)){
// iOS: googlechrome 스킴
const chromeUrl=url.replace(/^https?/,'googlechrome');
window.location.href=chromeUrl;
setTimeout(()=>{
if(document.visibilityState==='visible'){
try{ navigator.clipboard.writeText(url); alert('Chrome 앱이 없거나 열 수 없어요.\nURL이 복사됐어요.'); }
catch(e){ prompt('아래 URL을 복사해서 Chrome 또는 Safari에서 열어주세요:', url); }
}
},1500);
} else {
window.open(url,'_blank');
}
}
function closeInappBanner(){
const banner=document.getElementById('inappBanner');
if(banner){
banner.style.display='none';
const wrap=document.querySelector('.wrap');
if(wrap) wrap.style.paddingTop='';
}
}
function confirmResetData(){
const body=document.getElementById('configSub');
const back=`<button class="cbk" onclick="showSub('profile')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="10,3 4,8 10,13"/></svg> 사용자 정보</button>`;
body.innerHTML=back+`
<div class="cfmb" style="border:1.5px solid var(--warning-bd);background:var(--warning-bg);border-radius:12px;padding:1.5rem;margin-top:8px;">
<div style="font-size:32px;margin-bottom:12px;">⚠️</div>
<div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:8px;">모든 정보를 초기화할까요?</div>
<div class="cfmm" style="color:var(--text2);">훈련 기록, 메모, 감정 기록, 설정이<br>모두 삭제됩니다.<br><strong>이 작업은 되돌릴 수 없습니다.</strong></div>
<div class="cfmbs">
<button class="bdng" onclick="doResetData()">초기화하기</button>
<button onclick="showSub('profile')">취소</button>
</div>
</div>`;
}
function doResetData(){
const LS='breath5_';
['pp','mode','pi','dur','rec','memo','name','ms','photo','theme','sfx','bgmOn','bgm',
'sfxVol','bgmVol','page','bookmarks','tree','treeOpen','maxLv','tpLog'].forEach(k=>localStorage.removeItem(LS+k));
records={};memos={};userName='사용자';userPhoto=null;
selPI=0;curMode='program';
presets=defPresets.map(p=>({...p}));
treeData={tp:0,stage:1,lastDate:'',bornAt:'',health:'healthy',stageHistory:[],totalTpEarned:0};
if(curUser){
db.collection('users').doc(curUser.uid).set({
records:{},memos:{},userName:'사용자',
presets:defPresets.map(p=>({...p})),
tree:{tp:0,stage:1,lastDate:'',bornAt:'',health:'healthy',stageHistory:[],totalTpEarned:0},
tpLog:{},
maxLv:0,
updatedAt:firebase.firestore.FieldValue.serverTimestamp()
}).catch(e=>console.log(e));
}
save();
renderUserBar();
renderTree();
closeSub();
showToast('모든 정보가 초기화됐어요.');
}
function confirmWithdraw(){
const body=document.getElementById('configSub');
const back=`<button class="cbk" onclick="showSub('profile')"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="10,3 4,8 10,13"/></svg> 사용자 정보</button>`;
const loginMsg=curUser?'':'<div style="font-size:13px;color:var(--danger);margin-top:8px;">※ 비로그인 상태입니다. 로컬 데이터만 삭제됩니다.</div>';
body.innerHTML=back+`
<div class="cfmb" style="border:1.5px solid var(--danger-bd);background:var(--danger-bg);border-radius:12px;padding:1.5rem;margin-top:8px;">
<div style="font-size:32px;margin-bottom:12px;">🚨</div>
<div style="font-size:16px;font-weight:700;color:var(--danger);margin-bottom:8px;">정말 탈퇴하시겠어요?</div>
<div class="cfmm" style="color:var(--text2);">계정과 모든 데이터가<br>영구적으로 삭제됩니다.<br><strong>절대 복구할 수 없습니다.</strong></div>
${loginMsg}
<div class="cfmbs">
<button class="bdng" onclick="doWithdraw()">탈퇴하기</button>
<button onclick="showSub('profile')">취소</button>
</div>
</div>`;
}
async function doWithdraw(){
try{
if(curUser){
await db.collection('users').doc(curUser.uid).delete();
await curUser.delete();
}
const LS='breath5_';
['pp','mode','pi','dur','rec','memo','name','ms','photo','theme','sfx','bgmOn','bgm','sfxVol','bgmVol','page','bookmarks'].forEach(k=>localStorage.removeItem(LS+k));
records={};memos={};userName='사용자';userPhoto=null;curUser=null;
closeSub();
showPage('train',null);
showToast('탈퇴가 완료됐어요. 이용해 주셔서 감사합니다.');
}catch(e){
if(e.code==='auth/requires-recent-login'){
showToast('보안을 위해 다시 로그인 후 탈퇴해 주세요.');
await auth.signOut();
openAuthModal('탈퇴를 위해 다시 로그인해 주세요.');
} else {
showToast('탈퇴 처리 중 오류가 발생했어요: '+e.message);
}
}
}
async function inviteFriend(){
const appUrl=window.location.href.split('?')[0];
const text=`들숨과 날숨 사이, 나를 만나는 브레스인\n\n호흡 훈련 앱 BRETHIN을 같이 해봐요 🌿`;
try{
if(navigator.share) await navigator.share({title:'BRETHIN - 호흡 훈련',text,url:appUrl});
else{ await navigator.clipboard.writeText(text+'\n'+appUrl); showToast('링크가 복사됐어요!'); }
giveShareBonus('invite');
}catch(e){ if(e.name!=='AbortError') showToast('공유를 취소했어요'); }
}
async function signInGoogle(){
const btn = document.querySelector('.auth-btn-google');
if(btn){ btn.disabled=true; btn.style.opacity='0.6'; }
try{
await auth.signInWithPopup(googleProvider);
closeAuthModal();
}catch(e){
if(
e.code==='auth/popup-blocked' ||
e.code==='auth/operation-not-supported-in-this-environment' ||
e.code==='auth/popup-closed-by-user' === false && e.message && e.message.includes('popup')
){
try{
await auth.signInWithRedirect(googleProvider);
}catch(e2){
showToast('로그인을 시작합니다...');
}
} else if(
e.code!=='auth/popup-closed-by-user' &&
e.code!=='auth/cancelled-popup-request'
){
showToast('로그인 실패. 다시 시도해주세요.');
console.error('로그인 에러:', e.code, e.message);
}
} finally {
if(btn){ btn.disabled=false; btn.style.opacity=''; }
}
}
async function signOut(){
await auth.signOut();
showToast('로그아웃됐어요.');
showPage('train',null);
}
// ── 세션 관리 ──────────────────────────────────────────────

function getDeviceSessionId(){
  const LS_KEY = 'breath5_sessionId';
  let sid = localStorage.getItem(LS_KEY);
  if(!sid){
    sid = 'dev_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
    localStorage.setItem(LS_KEY, sid);
  }
  return sid;
}

async function checkSession(uid){
  try{
    const ref = db.collection('users').doc(uid);
    const snap = await ref.get();
    if(!snap.exists){
      // 첫 로그인 - 세션 등록
      await ref.set({sessionId: getDeviceSessionId()}, {merge: true});
      return false;
    }
    const data = snap.data();
    const savedSession = data.sessionId;
    const mySession = getDeviceSessionId();
    if(savedSession && savedSession !== mySession){
      // 다른 기기 세션 감지 → 팝업 표시
      const overlay = document.getElementById('sessionOverlay');
      if(overlay) overlay.style.display = 'flex';
      return true; // 충돌
    } else {
      // 내 세션으로 갱신
      await ref.set({sessionId: mySession}, {merge: true});
      return false;
    }
  }catch(e){
    console.log('세션 체크 오류:', e);
    return false;
  }
}

async function switchSession(){
  try{
    const mySession = getDeviceSessionId();
    const ref = db.collection('users').doc(curUser.uid);
    await ref.set({sessionId: mySession}, {merge: true});
    const overlay = document.getElementById('sessionOverlay');
    if(overlay) overlay.style.display = 'none';
    showToast('이 기기로 전환됐어요 ✅');
    syncUserData._skip = false;
    await syncUserData();
  }catch(e){
    showToast('전환 중 오류가 발생했어요');
  }
}

async function handleSessionLogout(){
  const overlay = document.getElementById('sessionOverlay');
  if(overlay) overlay.style.display = 'none';
  await auth.signOut();
  showToast('로그아웃됐어요');
}

function openAuthModal(msg){
const sub=document.getElementById('authSubMsg');
if(msg&&sub) sub.textContent=msg;
document.getElementById('authOverlay').style.display='flex';
}
function closeAuthModal(){
document.getElementById('authOverlay').style.display='none';
}
async function syncUserData(){
if(!curUser) return;
if(syncUserData._skip){syncUserData._skip=false;return;}
// 세션 체크
const sessionConflict = await checkSession(curUser.uid);
if(sessionConflict) return;
const ref=db.collection('users').doc(curUser.uid);
try{
const snap=await ref.get();
if(snap.exists){
const d=snap.data();
if(d.records) records=d.records;
if(d.memos) memos=d.memos;
if(d.presets) presets=d.presets;
if(d.tree) treeData={...treeData,...d.tree};
if(d.bookmarks){
try{
const local=JSON.parse(localStorage.getItem(LS+'bookmarks')||'[]');
const merged=[...new Set([...d.bookmarks,...local])];
localStorage.setItem(LS+'bookmarks',JSON.stringify(merged));
if(typeof _bookmarks!=='undefined'){_bookmarks.length=0;merged.forEach(v=>_bookmarks.push(v));}
}catch(e){}
}
if(d.tpLog){
try{localStorage.setItem(LS+'tpLog',JSON.stringify(d.tpLog));}catch(e){}
}
if(d.settings){
const st=d.settings;
if(st.theme){curTheme=st.theme;applyTheme(curTheme);}
if(st.sfx) curSfx=st.sfx;
if(st.bgm) curBgm=st.bgm;
if(st.bgmOn!==undefined) bgmOn=st.bgmOn;
if(st.sfxVol!==undefined) sfxVolume=st.sfxVol;
if(st.bgmVol!==undefined) bgmVolume=st.bgmVol;
}
if(d.maxLv!==undefined){
const localMax=getMaxAchievedLv();
const serverMax=d.maxLv;
const merged=Math.max(localMax,serverMax);
if(merged>0) localStorage.setItem(LS+'maxLv',merged);
}
userName=d.userName||'사용자';
userPhoto=d.userPhoto||curUser.photoURL||null;
save();
} else {
await ref.set({
records, memos, userName,
userPhoto: userPhoto||'',
presets: presets.map(p=>({...p})),
maxLv: getMaxAchievedLv(),
settings:{theme:curTheme,sfx:curSfx,bgmOn:bgmOn,bgm:curBgm,sfxVol:sfxVolume,bgmVol:bgmVolume},
createdAt: firebase.firestore.FieldValue.serverTimestamp()
});
}
renderUserBar();
renderTree();
if(curPage==='calendar'){renderCal();updateCalSt();}
if(curPage==='config') renderConfigMain();
}catch(e){console.log('유저 데이터 동기화 실패:',e);}
}
async function saveUserData(){
if(!curUser) return;
try{
// tpLog 중복 제거 (완전 동일한 항목만 제거, 같은 날 여러 번 훈련은 유지)
let tpLog={};
try{
const raw=localStorage.getItem(LS+'tpLog');
if(raw){
const log=JSON.parse(raw);
Object.keys(log).forEach(date=>{
const seen=new Set();
tpLog[date]=log[date].filter((e,i)=>{
const k=e.type+'|'+e.label+'|'+e.tp+'|'+i;
if(seen.has(k)) return false;
seen.add(k);
return true;
});
});
localStorage.setItem(LS+'tpLog',JSON.stringify(tpLog));
}
}catch(e){}
await db.collection('users').doc(curUser.uid).set({
records, memos, userName,
userPhoto: userPhoto&&!userPhoto.startsWith('http')?'':userPhoto||'',
presets: presets.map(p=>({...p})),
maxLv: getMaxAchievedLv(),
bookmarks: (()=>{try{return JSON.parse(localStorage.getItem(LS+'bookmarks')||'[]')}catch(e){return []}})(),
tpLog: tpLog,
settings:{
theme: curTheme,
sfx: curSfx,
bgmOn: bgmOn,
bgm: curBgm,
sfxVol: sfxVolume,
bgmVol: bgmVolume,
},
updatedAt: firebase.firestore.FieldValue.serverTimestamp()
},{merge:true});
}catch(e){ console.log('저장 실패:',e); }
}
let calViewMode='calendar';
let graphYear,graphMonth;
function setCalView(mode){
calViewMode=mode;
document.getElementById('calViewBtn').classList.toggle('active',mode==='calendar');
document.getElementById('graphViewBtn').classList.toggle('active',mode==='graph');
document.getElementById('calendarView').style.display=mode==='calendar'?'block':'none';
document.getElementById('graphView').style.display=mode==='graph'?'block':'none';
if(mode==='calendar'){
updateCalSt();
} else {
renderGraph();
}
}
function changeGraphMonth(dir){
if(graphMonth===undefined){graphYear=new Date().getFullYear();graphMonth=new Date().getMonth();}
graphMonth+=dir;
if(graphMonth<0){graphMonth=11;graphYear--;}
if(graphMonth>11){graphMonth=0;graphYear++;}
renderGraph();
}
function renderGraph(){
if(graphYear===undefined){graphYear=new Date().getFullYear();graphMonth=new Date().getMonth();}
document.getElementById('graphTitle').textContent=graphYear+'년 '+mNames[graphMonth];
const dim=new Date(graphYear,graphMonth+1,0).getDate();
const data=[];let maxVal=0;
for(let d=1;d<=dim;d++){
const key=dk(graphYear,graphMonth,d);
const recs=records[key]||[];
const total=recs.reduce((s,r)=>s+r.duration,0);
data.push({d,total,key});
if(total>maxVal)maxVal=total;
}
const barH=140;
const barsHtml=data.map(({d,total,key})=>{
const h=maxVal>0?Math.round((total/maxVal)*barH):0;
const isToday=key===today();
return `<div class="graph-bar-col">
<div class="graph-val" style="${isToday?'color:var(--warning);font-weight:700;':''}">${total>0?total:''}</div>
<div class="graph-bar${total>0?' has-data':''}" style="height:${h||2}px;${isToday?'opacity:1;background:var(--warning);':'opacity:0.7;'}"></div>
<div class="graph-label" style="${isToday?'color:var(--warning);font-weight:600;':''}">${d}</div>
</div>`;
}).join('');
const totalDays=data.filter(x=>x.total>0).length;
const totalMin=data.reduce((s,x)=>s+x.total,0);
const avgMin=totalDays>0?Math.round(totalMin/totalDays*10)/10:0;
document.getElementById('totalDays').textContent=totalDays;
document.getElementById('totalDays').nextElementSibling.textContent='이달 훈련일';
document.getElementById('totalMinutes').textContent=Math.round(totalMin);
document.getElementById('totalMinutes').nextElementSibling.textContent='총 훈련(분)';
document.getElementById('streakDays').textContent=avgMin;
document.getElementById('streakDays').nextElementSibling.textContent='일평균(분)';
document.getElementById('graphCanvas').innerHTML=`
<div class="graph-wrap" id="graphWrap"><div class="graph-bar-wrap">${barsHtml}</div></div>
<div style="font-size:11px;color:var(--text3);text-align:center;margin-top:4px;">막대 높이 = 해당일 총 훈련 시간(분)</div>`;
if(!document.getElementById('graphDayPanel')){
const panel = document.createElement('div');
panel.id = 'graphDayPanel';
panel.className = 'graph-day-panel';
document.getElementById('graphCanvas').after(panel);
}
renderGraphDayPanel(today());
setTimeout(()=>{
document.querySelectorAll('.graph-bar-col').forEach(col=>{
col.style.cursor='pointer';
col.addEventListener('click', function(){
document.querySelectorAll('.graph-bar-col').forEach(c=>c.classList.remove('graph-bar-sel'));
this.classList.add('graph-bar-sel');
const d = this.querySelector('.graph-label').textContent;
const key = dk(graphYear, graphMonth, parseInt(d));
renderGraphDayPanel(key);
});
});
const now = new Date();
if(graphYear===now.getFullYear()&&graphMonth===now.getMonth()){
const cols = document.querySelectorAll('.graph-bar-col');
if(cols[now.getDate()-1]) cols[now.getDate()-1].classList.add('graph-bar-sel');
}
},60);
const now=new Date();
if(graphYear===now.getFullYear()&&graphMonth===now.getMonth()){
setTimeout(()=>{
const wrap=document.getElementById('graphWrap');
if(!wrap) return;
const cols=wrap.querySelectorAll('.graph-bar-col');
const todayIdx=now.getDate()-1;
const col=cols[todayIdx];
if(!col) return;
const colLeft=col.offsetLeft;
const colW=col.offsetWidth;
const wrapW=wrap.offsetWidth;
wrap.scrollLeft=colLeft-(wrapW/2)+(colW/2);
},50);
}
}
const EMOTIONS=['아주나쁨','나쁨','보통','좋음','아주좋음'];
function renderGraphDayPanel(key){
const panel = document.getElementById('graphDayPanel');
if(!panel) return;
const recs = records[key]||[];
const memoData = memos[key]||{};
const memo = typeof memoData==='string'?memoData:(memoData.text||'');
const preMood = typeof memoData==='object'?memoData.preMood||'':'';
const postMood = typeof memoData==='object'?memoData.postMood||'':'';
const dateLabel = fl(key);
const isToday = key===today();
const hasMemoData = !!(memo||preMood||postMood);
const tpEntries=getDayTPLog(key);
let html = `<div class="gdp-header"><span class="gdp-date">${dateLabel}${isToday?' <span class="gdp-today-badge">오늘</span>':''}</span></div>`;
// 1. 훈련 기록 — 접기/펼치기 박스
if(recs.length>0){
const total = recs.reduce((s,r)=>s+r.duration,0);
const recId='recGBox_'+key.replace(/-/g,'');
html+=`<div class="gdp-section-label">훈련 기록</div>`;
html+=`<div style="background:var(--bg2);border:0.5px solid var(--bd);border-radius:12px;overflow:hidden;margin-bottom:12px;">`;
html+=`<div onclick="var d=document.getElementById('${recId}');var open=d.style.display!=='none';d.style.display=open?'none':'block';this.querySelector('.tp-arr').style.transform=open?'rotate(0deg)':'rotate(180deg)'" style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;cursor:pointer;">`;
html+=`<span style="font-size:13px;font-weight:600;color:var(--text);">총 훈련시간</span>`;
html+=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:13px;font-weight:600;color:var(--info);">총 ${Math.round(total)}분 훈련</span><span class="tp-arr" style="font-size:11px;color:var(--text3);transition:transform 0.2s;display:inline-block;">▼</span></div>`;
html+=`</div>`;
html+=`<div id="${recId}" style="display:none;border-top:0.5px solid var(--bd);padding:4px 0 4px;">`;
recs.forEach((r,i)=>{
const lv=r.level?`<span class="bg bga" style="font-size:10px;padding:1px 5px;margin-left:4px;">${r.level}</span>`:'';
html+=`<div class="gdp-rec" style="padding:7px 16px;"><div class="gdp-rec-left"><span class="gdp-rec-num">${i+1}회차</span>${lv}<span class="gdp-rec-pattern">들숨${r.inhale}·날숨${r.exhale}</span></div><div class="gdp-rec-right"><span class="bg bbl" style="font-size:11px;">${r.duration}분</span><span class="bg bgn" style="font-size:11px;">${r.cycles}회</span></div></div>`;
});
html+=`</div></div>`;
} else if(recs.length===0&&!hasMemoData&&tpEntries.length===0){
panel.innerHTML=`<div class="gdp-header"><span class="gdp-date">${dateLabel}${isToday?' <span class="gdp-today-badge">오늘</span>':''}</span></div><div class="gdp-empty">이 날의 기록이 없어요</div>`;
return;
} else {
html+=`<div class="gdp-empty">훈련 기록이 없어요</div>`;
}
// 2. 오늘 적립 TP — 훈련기록 바로 아래
if(tpEntries.length>0){
const totalTP=tpEntries.reduce((s,e)=>s+e.tp,0);
const tpId='tpGBox_'+key.replace(/-/g,'');
html+=`<div class="gdp-section-label">오늘 적립 TP</div>`;
html+=`<div style="background:var(--bg2);border:0.5px solid var(--bd);border-radius:12px;overflow:hidden;margin-bottom:12px;">`;
html+=`<div onclick="var d=document.getElementById('${tpId}');var open=d.style.display!=='none';d.style.display=open?'none':'block';this.querySelector('.tp-arr').style.transform=open?'rotate(0deg)':'rotate(180deg)'" style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;cursor:pointer;">`;
html+=`<span style="font-size:13px;font-weight:600;color:var(--text);">합계</span>`;
html+=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;color:var(--success);">+${totalTP} TP</span><span class="tp-arr" style="font-size:11px;color:var(--text3);transition:transform 0.2s;display:inline-block;">▼</span></div>`;
html+=`</div>`;
html+=`<div id="${tpId}" style="display:none;border-top:0.5px solid var(--bd);padding:4px 16px 8px;">`;
tpEntries.forEach(e=>{html+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:0.5px solid var(--bg3);font-size:12px;"><span style="color:var(--text2);">${e.label}</span><span style="color:var(--success);font-weight:600;">+${e.tp} TP</span></div>`;});
html+=`</div></div>`;
}
// 3. 감정 · 메모 (구분선 제거)
if(hasMemoData){
html+=`<div class="gdp-section-label">감정 · 메모</div>`;
if(preMood||postMood){
html+=`<div class="gdp-mood">`;
if(preMood) html+=`<span class="gdp-mood-item">훈련 전 <strong>${preMood}</strong></span>`;
if(preMood&&postMood) html+=`<span class="gdp-mood-arrow">→</span>`;
if(postMood) html+=`<span class="gdp-mood-item">훈련 후 <strong>${postMood}</strong></span>`;
html+=`</div>`;
}
if(memo) html+=`<div class="gdp-memo">${eh(memo)}</div>`;
html+=`<div class="gdp-actions" style="justify-content:flex-end;margin-top:12px;">
<div style="display:flex;gap:8px;"><button class="bsm" onclick="editMemoFromGraph('${key}')">수정</button><button class="bsm bdng" onclick="delMemoFromGraph('${key}')">삭제</button></div>
</div>`;
}
// 하단 버튼 3개 (기록 또는 메모 있을 때)
const hasContent = recs.length>0 || hasMemoData;
if(hasContent){
html+=`<div style="display:flex;gap:8px;margin-top:14px;">
<button class="bsave" style="flex:1;justify-content:center;" onclick="saveDetailImage()"><svg style="width:14px;height:14px;" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v8M5 7l3 3 3-3M2 12v2h12v-2" stroke-linecap="round" stroke-linejoin="round"/></svg> 이미지 저장</button>
<button class="bshr" style="flex:1;justify-content:center;" onclick="shareDetailRecord()"><svg style="width:14px;height:14px;" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg> 공유하기</button>
<button style="flex:1;" onclick="setCalView('calendar')">닫기</button>
</div>`;
}
panel.innerHTML = html;
}
function editMemoFromGraph(key){
setCalView('calendar');
setTimeout(()=>{selD(key);editMemo(key);}, 150);
}
async function delMemoFromGraph(key){
await delMemo(key);
renderGraphDayPanel(key);
}
function renderDB(key){
const body=document.getElementById('detailBody');
const recs=records[key]||[];
const memoData=memos[key]||{};
const memo=typeof memoData==='string'?memoData:(memoData.text||'');
const preMood=typeof memoData==='object'?memoData.preMood||'':'';
const postMood=typeof memoData==='object'?memoData.postMood||'':'';
const tpEntries=getDayTPLog(key);
let html='';
// 1. 훈련 기록 — 접기/펼치기 박스
if(recs.length>0){
const total=recs.reduce((s,r)=>s+r.duration,0);
const recId='recBox_'+key.replace(/-/g,'');
html+=`<div class="gdp-section-label">훈련 기록</div>`;
html+=`<div style="background:var(--bg2);border:0.5px solid var(--bd);border-radius:12px;overflow:hidden;margin-bottom:12px;">`;
html+=`<div onclick="var d=document.getElementById('${recId}');var open=d.style.display!=='none';d.style.display=open?'none':'block';this.querySelector('.tp-arr').style.transform=open?'rotate(0deg)':'rotate(180deg)'" style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;cursor:pointer;">`;
html+=`<span style="font-size:13px;font-weight:600;color:var(--text);">총 훈련시간</span>`;
html+=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:13px;font-weight:600;color:var(--info);">총 ${Math.round(total)}분 훈련</span><span class="tp-arr" style="font-size:11px;color:var(--text3);transition:transform 0.2s;display:inline-block;">▼</span></div>`;
html+=`</div>`;
html+=`<div id="${recId}" style="display:none;border-top:0.5px solid var(--bd);padding:4px 0 4px;">`;
recs.forEach((r,i)=>{
const lv=r.level?`<span class="bg bga" style="font-size:10px;padding:1px 5px;margin-left:4px;">${r.level}</span>`:'';
html+=`<div class="gdp-rec" style="padding:7px 16px;"><div class="gdp-rec-left"><span class="gdp-rec-num">${i+1}회차</span>${lv}<span class="gdp-rec-pattern">들숨${r.inhale}·날숨${r.exhale}</span></div><div class="gdp-rec-right"><span class="bg bbl" style="font-size:11px;">${r.duration}분</span><span class="bg bgn" style="font-size:11px;">${r.cycles}사이클</span></div></div>`;
});
html+=`</div></div>`;
} else {
html+=`<div class="gdp-empty">훈련 기록이 없어요</div>`;
}
// 2. 오늘 적립 TP — 훈련기록 바로 아래
if(tpEntries.length>0){
const totalTP=tpEntries.reduce((s,e)=>s+e.tp,0);
const tpId='tpBox_'+key.replace(/-/g,'');
html+=`<div class="gdp-section-label">오늘 적립 TP</div>`;
html+=`<div style="background:var(--bg2);border:0.5px solid var(--bd);border-radius:12px;overflow:hidden;margin-bottom:12px;">`;
html+=`<div onclick="var d=document.getElementById('${tpId}');var open=d.style.display!=='none';d.style.display=open?'none':'block';this.querySelector('.tp-arr').style.transform=open?'rotate(0deg)':'rotate(180deg)'" style="display:flex;justify-content:space-between;align-items:center;padding:13px 16px;cursor:pointer;">`;
html+=`<span style="font-size:13px;font-weight:600;color:var(--text);">합계</span>`;
html+=`<div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;font-weight:700;color:var(--success);">+${totalTP} TP</span><span class="tp-arr" style="font-size:11px;color:var(--text3);transition:transform 0.2s;display:inline-block;">▼</span></div>`;
html+=`</div>`;
html+=`<div id="${tpId}" style="display:none;border-top:0.5px solid var(--bd);padding:4px 16px 8px;">`;
tpEntries.forEach(e=>{html+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:0.5px solid var(--bg3);font-size:12px;"><span style="color:var(--text2);">${e.label}</span><span style="color:var(--success);font-weight:600;">+${e.tp} TP</span></div>`;});
html+=`</div></div>`;
}
// 3. 감정 · 메모 (구분선 제거)
if(memo||preMood||postMood){
html+=`<div class="gdp-section-label">감정 · 메모</div>`;
if(preMood||postMood){
html+=`<div class="gdp-mood">`;
if(preMood) html+=`<span class="gdp-mood-item">훈련 전 <strong>${preMood}</strong></span>`;
if(preMood&&postMood) html+=`<span class="gdp-mood-arrow">→</span>`;
if(postMood) html+=`<span class="gdp-mood-item">훈련 후 <strong>${postMood}</strong></span>`;
html+=`</div>`;
}
if(memo) html+=`<div class="gdp-memo">${eh(memo)}</div>`;
html+=`<div class="gdp-actions" style="justify-content:flex-end;margin-top:12px;">
<div style="display:flex;gap:8px;"><button class="bsm" onclick="editMemo('${key}')">수정</button><button class="bsm bdng" onclick="delMemo('${key}')">삭제</button></div>
</div>`;
} else {
html+=`<div class="gdp-section-label">감정 · 메모</div>
<div class="emotion-row"><div class="emotion-lbl">훈련 전 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn" data-type="pre" onclick="selEmo(this,'pre')">${e}</button>`).join('')}</div></div>
<div class="emotion-row"><div class="emotion-lbl">훈련 후 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn" data-type="post" onclick="selEmo(this,'post')">${e}</button>`).join('')}</div></div>
<textarea class="mi" id="memoInput" placeholder="오늘의 컨디션, 소감을 적어보세요..."></textarea>
<div style="display:flex;gap:8px;justify-content:flex-end;align-items:center;">
<button class="bsm bp" onclick="saveMemo('${key}')">저장</button>
</div>`;
}
body.innerHTML=html;
// detailTPBox 숨김 (TP는 body 안으로 통합)
const tpBox=document.getElementById('detailTPBox');
if(tpBox){tpBox.style.display='none';tpBox.innerHTML='';}
// 하단 버튼 표시 (훈련기록 또는 메모가 있을 때)
const actionBtns=document.getElementById('detailActionBtns');
if(actionBtns){
const hasContent=(recs.length>0)||(memo||preMood||postMood);
actionBtns.style.display=hasContent?'block':'none';
}
}
function selEmo(btn,type){
const group=btn.closest('.emotion-btns');
group.querySelectorAll('.emo-btn').forEach(b=>b.classList.remove('sel-emo'));
btn.classList.add('sel-emo');
btn.dataset.type=type;
}

// ── 캘린더 기록 하단 버튼 함수들 ──────────────────────────────

function getDetailStats(key){
const recs=records[key]||[];
const totalMin=Math.round(recs.reduce((s,r)=>s+r.duration,0));
const tpEntries=getDayTPLog(key);
const totalTP=tpEntries.reduce((s,e)=>s+e.tp,0);
const streak=calcStreak();
let pattern='';
if(recs.length>0){
const r=recs[0];
const parts=[];
if(r.inhale) parts.push('들숨'+r.inhale+'s');
if(r.holdIn) parts.push('참기'+r.holdIn+'s');
if(r.exhale) parts.push('날숨'+r.exhale+'s');
if(r.holdOut) parts.push('비우기'+r.holdOut+'s');
pattern=parts.join(' · ');
}
return {totalMin,totalTP,streak,pattern};
}

async function saveDetailImage(){
if(!selDate){showToast('날짜를 선택해 주세요');return;}
const card=document.getElementById('detailShareCard');
if(!card){showToast('이미지를 만들 수 없어요');return;}
const stats=getDetailStats(selDate);
card.querySelector('#dsc-date').textContent=fl(selDate);
card.querySelector('#dsc-min').textContent=stats.totalMin;
card.querySelector('#dsc-tp').textContent=stats.totalTP;
card.querySelector('#dsc-streak').textContent=stats.streak;
card.querySelector('#dsc-pattern').textContent=stats.pattern||'BRETHIN 호흡 훈련';
const now=new Date();
const dateStr=now.getFullYear()+String(now.getMonth()+1).padStart(2,'0')+String(now.getDate()).padStart(2,'0');
const filename=`BRETHIN_기록_${dateStr}.png`;
showToast('이미지를 만들고 있어요...');
try{
const canvas=await html2canvas(card,{scale:2,useCORS:true,backgroundColor:null});
const blob=await new Promise(res=>canvas.toBlob(res,'image/png'));
if(!blob){showToast('이미지 생성에 실패했어요');return;}
const file=new File([blob],filename,{type:'image/png'});
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;
if(isIOS&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
try{await navigator.share({files:[file],title:'BRETHIN 훈련 기록'});showToast('이미지가 저장됐어요 📸');}
catch(e){if(e.name!=='AbortError')showToast('저장을 취소했어요');}
return;
}
const url=URL.createObjectURL(blob);
const a=document.createElement('a');a.href=url;a.download=filename;
document.body.appendChild(a);a.click();document.body.removeChild(a);
setTimeout(()=>URL.revokeObjectURL(url),1000);
showToast('이미지가 저장됐어요 📸');
}catch(e){showToast('이미지 저장에 실패했어요');}
}

async function shareDetailRecord(){
if(!selDate){showToast('날짜를 선택해 주세요');return;}
const stats=getDetailStats(selDate);
const appUrl=window.location.href.split('?')[0];
const text='BRETHIN 훈련 기록 📅 '+fl(selDate)+'\n'
  +'⏱️ 누적 훈련시간 '+stats.totalMin+'분\n'
  +'✨ 누적 적립 TP '+stats.totalTP+' TP\n'
  +'🔥 연속 달성 '+stats.streak+'일\n'
  +'\n들숨과 날숨 사이, 나를 만나는 브레스인\nBRETHIN 🌿';
try{
if(navigator.share) await navigator.share({title:'BRETHIN 훈련 기록',text:text,url:appUrl});
else{await navigator.clipboard.writeText(text+'\n'+appUrl);showToast('기록이 복사됐어요!');}
giveShareBonus('record');
}catch(e){if(e.name!=='AbortError')showToast('공유를 취소했어요');}
}

function closeDetail(){
selDate=null;
const titleEl=document.getElementById('detailTitle');
const bodyEl=document.getElementById('detailBody');
const xBtn=document.getElementById('xBtn');
const actionBtns=document.getElementById('detailActionBtns');
if(titleEl) titleEl.textContent='날짜를 선택해 주세요';
if(bodyEl) bodyEl.innerHTML='<div class="gdp-empty" style="text-align:left;">날짜를 클릭하면 기록과 메모를 확인할 수 있어요</div>';
if(xBtn) xBtn.style.display='none';
if(actionBtns) actionBtns.style.display='none';
renderCal();
}

async function shareRecord(key){
const recs=records[key]||[];
const memoData=memos[key]||{};
const memo=typeof memoData==='string'?memoData:(memoData.text||'');
const preMood=typeof memoData==='object'?memoData.preMood||'':'';
const postMood=typeof memoData==='object'?memoData.postMood||'':'';
const total=recs.reduce((s,r)=>s+r.duration,0);
const appUrl=window.location.href.split('?')[0];
const lines=[`BRETHIN 훈련 기록 - 📅 ${fl(key)}`,`⏱️ 총 ${Math.round(total)}분 훈련 · ${recs.length}회차`];
if(preMood||postMood) lines.push(`💭 ${preMood?'훈련 전 '+preMood:''}${preMood&&postMood?' → ':''}${postMood?'훈련 후 '+postMood:''}`);
if(memo) lines.push(`💬 ${memo}`);
lines.push(`\n들숨과 날숨 사이, 나를 만나는 브레스인\nBRETHIN 🌿`);
const text=lines.join('\n');
try{
if(navigator.share) await navigator.share({title:'BRETHIN 훈련 기록',text,url:appUrl});
else{ await navigator.clipboard.writeText(text+'\n'+appUrl); showToast('기록이 복사됐어요!'); }
giveShareBonus('record');
}catch(e){ if(e.name!=='AbortError') showToast('공유를 취소했어요'); }
}
function saveMemo(key){
const i=document.getElementById('memoInput');if(!i)return;
const v=i.value.trim();
const preBtn=document.querySelector('.emotion-btns .emo-btn.sel-emo[data-type="pre"]');
const postBtn=document.querySelector('.emotion-btns .emo-btn.sel-emo[data-type="post"]');
const preMood=preBtn?preBtn.textContent:'';
const postMood=postBtn?postBtn.textContent:'';
// 기존 감정값 저장
const prevMemo=memos[key]||{};
const prevPreMood=typeof prevMemo==='object'?prevMemo.preMood||'':'';
const prevPostMood=typeof prevMemo==='object'?prevMemo.postMood||'':'';
if(v||preMood||postMood) memos[key]={text:v,preMood,postMood};
else delete memos[key];
save();
// 감정 개선 보너스 — 오늘 날짜이고 훈련 기록이 있을 때만
if(key===today()&&curUser&&records[key]&&records[key].length>0){
const emoVals={'아주나쁨':1,'나쁨':2,'보통':3,'좋음':4,'아주좋음':5};
const wasImproved=(emoVals[prevPostMood]||0)>(emoVals[prevPreMood]||0);
const isImproved=(emoVals[postMood]||0)>(emoVals[preMood]||0);
if(isImproved&&!wasImproved){
// 새로 감정 개선됨 → 기존 mood 항목 먼저 제거 후 보너스 지급 (이중 적립 방지)
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
if(!tpLog[key])tpLog[key]=[];
// 기존 mood 항목 차감 후 제거
const prevMoodItems=tpLog[key].filter(e=>e.type==='mood');
prevMoodItems.forEach(e=>{treeData.tp=Math.max(0,treeData.tp-e.tp);treeData.totalTpEarned=Math.max(0,treeData.totalTpEarned-e.tp);});
tpLog[key]=tpLog[key].filter(e=>e.type!=='mood');
const emoBonuses=[3,3,5,8,12,15,20];
const bonus=emoBonuses[(treeData.stage||1)-1]||3;
treeData.tp+=bonus;
treeData.totalTpEarned+=bonus;
const newStage=getTreeStageFromTP(treeData.tp);
if(newStage>treeData.stage){treeData.stageHistory.push({stage:newStage,date:key});}
treeData.stage=newStage;
saveTree();renderTree();
// tpLog에 기록
tpLog[key].push({type:'mood',label:'감정 개선 보너스',tp:bonus});
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
showToast(`🌿 감정이 개선됐어요! +${bonus} TP 획득 (로그:${(tpLog[key]||[]).length}건)`);
const st=TREE_STAGES[treeData.stage-1];
if(st)spawnTreeParticles(st.color);
const hasR2=records[key]&&records[key].length>0;
document.getElementById('xBtn').style.display=(hasR2||true)?'flex':'none';
updateCalDot(key);
renderDB(key);
return;
} else if(!isImproved&&wasImproved){
// 기존에 개선됐었는데 수정 후 개선 안 됨 → 보너스 회수
const emoBonuses=[3,3,5,8,12,15,20];
const bonus=emoBonuses[(treeData.stage||1)-1]||3;
treeData.tp=Math.max(0,treeData.tp-bonus);
treeData.totalTpEarned=Math.max(0,treeData.totalTpEarned-bonus);
treeData.stage=getTreeStageFromTP(treeData.tp);
saveTree();renderTree();
// tpLog에서 감정 보너스 제거
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
if(tpLog[key])tpLog[key]=tpLog[key].filter(e=>e.type!=='mood');
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
}
}
const hasR=records[key]&&records[key].length>0;
const hasM=!!memos[key];
document.getElementById('xBtn').style.display=(hasR||hasM)?'flex':'none';
updateCalDot(key);
renderDB(key);
}
function updateCalDot(key){
const cells=document.querySelectorAll('#calGrid .cc');
const[y,m,d]=key.split('-');
const day=parseInt(d);
const fd=new Date(parseInt(y),parseInt(m)-1,1).getDay();
const cellIdx=fd+day-1;
const cell=cells[cellIdx];
if(!cell)return;
const oldDr=cell.querySelector('.dr');
if(oldDr)oldDr.remove();
const hasR=records[key]&&records[key].length>0;
const hasM=memos[key]&&(typeof memos[key]==='string'?memos[key]:(memos[key].text||memos[key].preMood||memos[key].postMood));
if(hasR||hasM){
const dr=document.createElement('div');dr.className='dr';
if(hasR){const dot=document.createElement('div');dot.className='dot dg';dr.appendChild(dot);}
if(hasM){const dot=document.createElement('div');dot.className='dot da';dr.appendChild(dot);}
cell.appendChild(dr);
}
}
function editMemo(key){
const memoData=memos[key]||{};
const memo=typeof memoData==='string'?memoData:(memoData.text||'');
const preMood=typeof memoData==='object'?memoData.preMood||'':'';
const postMood=typeof memoData==='object'?memoData.postMood||'':'';
let html=`<div class="sl3">감정 · 메모</div>
<div class="emotion-row"><div class="emotion-lbl">훈련 전 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn${preMood===e?' sel-emo':''}" data-type="pre" onclick="selEmo(this,'pre')">${e}</button>`).join('')}</div></div>
<div class="emotion-row"><div class="emotion-lbl">훈련 후 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn${postMood===e?' sel-emo':''}" data-type="post" onclick="selEmo(this,'post')">${e}</button>`).join('')}</div></div>
<textarea class="mi" id="memoInput">${eh(memo)}</textarea>
<div style="display:flex;gap:8px;justify-content:flex-end;">
<button class="bsm" onclick="renderDB('${key}')">취소</button>
<button class="bsm bp" onclick="saveMemo('${key}')">저장</button>
</div>`;
document.getElementById('detailBody').innerHTML=html;
}
async function delMemo(key){
// 감정 개선 보너스 회수 (localStorage + Firebase 병합)
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
// Firebase에도 없으면 서버에서 가져옴
if(curUser&&!tpLog[key]){
try{const snap=await db.collection('users').doc(curUser.uid).get();if(snap.exists&&snap.data().tpLog)tpLog=snap.data().tpLog;}catch(e){}
}
if(tpLog[key]){
const moodItems=tpLog[key].filter(e=>e.type==='mood');
moodItems.forEach(e=>{treeData.tp=Math.max(0,treeData.tp-e.tp);treeData.totalTpEarned=Math.max(0,treeData.totalTpEarned-e.tp);});
if(moodItems.length){
tpLog[key]=tpLog[key].filter(e=>e.type!=='mood');
treeData.stage=getTreeStageFromTP(treeData.tp);
saveTree();renderTree();
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
}
}
delete memos[key];save();if(curUser){await saveUserData();}renderCal();renderDB(key);
}
function askDeleteDay(){if(!selDate)return;document.getElementById('detailBody').innerHTML=`<div class="cfmb"><div class="cfmm"><strong>${fl(selDate)}</strong>의<br>훈련 기록을 삭제하시겠습니까?</div><div class="cfmbs"><button class="bdng" onclick="confirmDel()">네</button><button onclick="selD('${selDate}')">아니오</button></div></div>`;}
async function confirmDel(){
const dateToDelete=selDate;
delete records[dateToDelete];
delete memos[dateToDelete];
// tpLog: 로컬 우선, 없으면 서버에서 가져옴
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
if(curUser&&!tpLog[dateToDelete]){
try{const snap=await db.collection('users').doc(curUser.uid).get();if(snap.exists&&snap.data().tpLog)tpLog=snap.data().tpLog;}catch(e){}
}
if(tpLog[dateToDelete]){
const dayTP=tpLog[dateToDelete].reduce((s,e)=>s+e.tp,0);
treeData.tp=Math.max(0,treeData.tp-dayTP);
treeData.totalTpEarned=Math.max(0,treeData.totalTpEarned-dayTP);
treeData.stage=getTreeStageFromTP(treeData.tp);
saveTree();
}
delete tpLog[dateToDelete];
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
selDate=null;
save();
if(curUser){
showToast('삭제 중...');
syncUserData._skip=true;
await saveUserData();
showToast('삭제됐어요');
}
renderCal();updateCalSt();
document.getElementById('detailTitle').textContent='날짜를 선택해 주세요';
document.getElementById('detailBody').innerHTML='<div class="gdp-empty" style="text-align:left;">날짜를 클릭하면 기록과 메모를 확인할 수 있어요</div>';
document.getElementById('xBtn').style.display='none';
const tb=document.getElementById('detailTPBox');if(tb){tb.style.display='none';tb.innerHTML='';}
}
function changeMonth(dir){calMonth+=dir;if(calMonth<0){calMonth=11;calYear--;}if(calMonth>11){calMonth=0;calYear++;}selDate=null;renderCal();document.getElementById('detailTitle').textContent='날짜를 선택해 주세요';document.getElementById('detailBody').innerHTML='<div class="em">날짜를 클릭하면 기록과 메모를 확인할 수 있어요</div>';document.getElementById('xBtn').style.display='none';const tb=document.getElementById('detailTPBox');if(tb){tb.style.display='none';tb.innerHTML='';}}
function updateCalSt(){
const keys=Object.keys(records);
document.getElementById('totalDays').textContent=keys.length;
document.getElementById('totalDays').nextElementSibling.textContent='총 훈련일';
let total=0;keys.forEach(k=>records[k].forEach(r=>total+=r.duration));
document.getElementById('totalMinutes').textContent=Math.round(total);
document.getElementById('totalMinutes').nextElementSibling.textContent='총 훈련(분)';
document.getElementById('streakDays').textContent=calcStreak();
document.getElementById('streakDays').nextElementSibling.textContent='연속 달성일';
}
if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
let wakeLock=null;
async function requestWakeLock(){if(!('wakeLock'in navigator))return;try{wakeLock=await navigator.wakeLock.request('screen');}catch(e){}}
async function releaseWakeLock(){if(wakeLock){try{await wakeLock.release();}catch(e){}wakeLock=null;}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running)requestWakeLock();});
load();
loadTree();
checkTreeDemotion();
applyTheme(curTheme);
document.getElementById('modeProgram').className='mb'+(curMode==='program'?' active':'');
document.getElementById('modeManual').className='mb'+(curMode==='manual'?' active':'');
renderSBody();updateSum();
renderTree();
const _initPage = curPage||'train';
const _ub = document.getElementById('userBar');
if(_initPage==='calendar'){ _ub.style.display='flex'; renderUserBar(); }
else if(_ub){ _ub.style.display='none'; }
document.getElementById('circle').style.background=dGrad;
document.getElementById('remainDisplay').textContent=fmt(parseInt(document.getElementById('duration').value)*60);
setSound(soundOn);
renderSfxChips();
document.getElementById('sfxVol').value=sfxVolume;
document.getElementById('sfxVolVal').textContent=sfxVolume;
document.getElementById('bgmOn').className=bgmOn?'on':'off';
document.getElementById('bgmOff').className=bgmOn?'off':'on';
document.getElementById('bgmSection').style.display=bgmOn?'block':'none';
renderBgmChips();
document.getElementById('bgmVol').value=bgmVolume;
document.getElementById('bgmVolVal').textContent=bgmVolume;
if(curPage&&curPage!=='train'){
if(curPage==='calendar') {}
else showPage(curPage,null);
}
Promise.all([loadBanner(),loadNotices(),loadColumns(),loadGuide(),loadSounds()]).then(()=>{
const ub=document.getElementById('userBar');
if(ub.style.display!=='none') renderUserBar();
const params=new URLSearchParams(window.location.search);
const colId=params.get('col');
if(colId){
const idx=_columns.findIndex(c=>c.id===colId);
if(idx>=0){
showPage('column',null);
setTimeout(()=>showColDetail(idx),100);
}
}
// 팝업 공지 노출 (다른 UI가 뜬 뒤 잠깐 뒤에)
setTimeout(()=>{ if(typeof showPopupNoticeIfNeeded==='function') showPopupNoticeIfNeeded(); }, 600);
// 설치 유도 팝업 (팝업 공지가 없거나 닫은 뒤 자연스럽게 노출)
setTimeout(()=>{ if(typeof showInstallPromptIfNeeded==='function') showInstallPromptIfNeeded(); }, 3000);
}).catch(e=>console.log('Firebase 로드 오류:',e));