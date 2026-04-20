// ★ 관리자 이메일 목록 — 여기에 본인 이메일 추가
const ADMIN_EMAILS = [''];

const firebaseConfig = {
apiKey: "AIzaSyAuKsnJixQbgwYudA6tpJyNO9IXmxHwg-0",
authDomain: "breathing-app-f51cb.firebaseapp.com",
projectId: "breathing-app-f51cb",
storageBucket: "breathing-app-f51cb.firebasestorage.app",
messagingSenderId: "967554724404",
appId: "1:967554724404:web:0e5cc0ec05a6e92bba5061"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({prompt:'select_account'});
let analytics = null;
try{ analytics = firebase.analytics(); }catch(e){ console.log('Analytics 비활성화:', e.message); }
function logEvent(name, params){
try{ if(analytics) analytics.logEvent(name, params||{}); }catch(e){}
}
let _banners = [];
async function loadBanner() {
try {
const snap = await db.collection('banners').get();
if (snap.empty) return;
const now = Date.now();
_banners = snap.docs
.map(d => d.data())
.filter(d => {
if (!d.imageUrl) return false;
if (d.active === false) return false; 
if (d.expireAt) {
const exp = d.expireAt.toDate ? d.expireAt.toDate().getTime() : new Date(d.expireAt).getTime();
if (exp < now) return false;
}
return true;
})
.sort((a,b) => ((b.createdAt&&b.createdAt.seconds)||0) - ((a.createdAt&&a.createdAt.seconds)||0))
.slice(0, 3);
if (_banners.length) renderBanners();
} catch(e) { console.log('배너 로드 실패:', e.message); }
}
function renderBanners() {
const wrap = document.getElementById('bannerWrap');
if (!_banners.length) {
wrap.style.display='none';
return;
}
wrap.style.display='flex';
const imgs = _banners.map(data => {
const img = `<img class="bnimg" src="${data.imageUrl}" alt="배너">`;
return `<div class="bn-item">${data.url ? `<a href="${data.url}" target="_blank" rel="noopener">${img}</a>` : img}</div>`;
}).join('');
wrap.innerHTML = imgs;
}
let _notices = [];
async function loadNotices() {
try {
const snap = await db.collection('notices').orderBy('createdAt','desc').get();
_notices = snap.docs.map(d => ({ id: d.id, ...d.data() }));
} catch(e) { console.log('공지 로드 실패:', e); }
}

// 팝업 공지 노출 (앱 접속 시 자동 호출)
function showPopupNoticeIfNeeded(){
if(!_notices || !_notices.length) return;
// 팝업 플래그가 켜진 공지만 필터
const popups = _notices.filter(n => n.popup === true);
if(!popups.length) return;
// 중요(pinned) 우선, 그다음 최신순 (이미 createdAt desc로 정렬되어 옴)
popups.sort((a,b)=>{
if((b.pinned?1:0)-(a.pinned?1:0)) return (b.pinned?1:0)-(a.pinned?1:0);
return (b.createdAt?.seconds||0)-(a.createdAt?.seconds||0);
});
const target = popups[0];
if(!target || !target.id) return;
// "오늘 하루 보지 않기" 체크
const dismissKey = 'dismissedPopup_' + target.id;
const dismissedDate = localStorage.getItem(dismissKey);
const today = new Date();
const todayStr = today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
if(dismissedDate === todayStr) return; // 오늘 이미 닫음
// 이미 열려있는 팝업 있으면 중복 방지
if(document.getElementById('popupNoticeOverlay')) return;
// 팝업 생성
const overlay = document.createElement('div');
overlay.id = 'popupNoticeOverlay';
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:popupFadeIn .3s;';
const contentHtml = typeof renderContent === 'function' ? renderContent(target.content||'') : (target.content||'').replace(/</g,'&lt;').replace(/\n/g,'<br>');
const imageHtml = target.imageUrl ? `<div style="margin:-6px -22px 14px;"><img src="${target.imageUrl}" style="width:100%;display:block;max-height:280px;object-fit:cover;"></div>` : '';
const linkLabel = (target.linkLabel && target.linkLabel.trim()) ? target.linkLabel.replace(/</g,'&lt;') : '자세히 보기 →';
const linkBtnHtml = target.linkUrl ? `<a href="${target.linkUrl}" target="_blank" rel="noopener" class="pn-btn pn-btn-primary" style="text-decoration:none;text-align:center;display:inline-flex;align-items:center;justify-content:center;">${linkLabel}</a>` : '';
overlay.innerHTML = `
<style>
@keyframes popupFadeIn{from{opacity:0}to{opacity:1}}
@keyframes popupSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
#popupNoticeBox .pn-btn{flex:1;padding:12px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:background .15s;}
#popupNoticeBox .pn-btn-primary{background:var(--accent,#d4a84b);color:#fff;}
#popupNoticeBox .pn-btn-primary:hover{opacity:.9;}
#popupNoticeBox .pn-btn-outline{background:transparent;color:var(--text2);border:1px solid var(--bg3);}
#popupNoticeBox .pn-btn-outline:hover{background:var(--bg2);}
#popupNoticeBox .pn-btn-confirm{background:transparent;color:var(--text);border:1px solid var(--bg3);}
#popupNoticeBox .pn-btn-confirm:hover{background:var(--bg2);}
</style>
<div id="popupNoticeBox" style="background:var(--bg);border:1px solid var(--bd);border-radius:14px;max-width:480px;width:100%;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;animation:popupSlideUp .35s;">
<div style="padding:22px 22px 16px;overflow-y:auto;flex:1;">
${target.pinned?'<div style="color:#d4a84b;font-size:12px;font-weight:500;margin-bottom:8px;">📌 중요 공지</div>':'<div style="color:var(--text2);font-size:12px;margin-bottom:8px;">🔔 공지사항</div>'}
<div style="font-size:17px;font-weight:600;color:var(--text);margin-bottom:14px;line-height:1.4;">${(target.title||'').replace(/</g,'&lt;')}</div>
${imageHtml}
<div style="font-size:14px;color:var(--text);line-height:1.7;">${contentHtml}</div>
</div>
<div style="padding:12px 22px 22px;display:flex;gap:8px;border-top:1px solid var(--bd);flex-wrap:wrap;">
${linkBtnHtml ? `<div style="display:flex;width:100%;margin-bottom:4px;">${linkBtnHtml}</div>` : ''}
<button class="pn-btn pn-btn-outline" id="popupNoticeDismiss">오늘 하루 보지 않기</button>
<button class="pn-btn pn-btn-confirm" id="popupNoticeClose">확인</button>
</div>
</div>
`;
document.body.appendChild(overlay);
const close = ()=>{
overlay.style.opacity='0';
overlay.style.transition='opacity .25s';
setTimeout(()=>overlay.remove(), 250);
};
document.getElementById('popupNoticeClose').addEventListener('click', close);
document.getElementById('popupNoticeDismiss').addEventListener('click', ()=>{
try{ localStorage.setItem(dismissKey, todayStr); }catch(e){}
close();
});
// 오버레이 바깥 클릭 시 닫기 (세션 단위, dismiss 처리 안 함)
overlay.addEventListener('click', (e)=>{
if(e.target === overlay) close();
});
}

// ═══════════════════════════════════════════════════════
// 홈화면 설치 유도 팝업 (환경별 맞춤 안내)
// ═══════════════════════════════════════════════════════
function detectInstallEnv(){
const ua = navigator.userAgent;
// 이미 PWA로 설치됨
if(window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return 'installed';
if(window.navigator.standalone === true) return 'installed';
// 카카오톡 인앱
if(/KAKAOTALK/i.test(ua)) return 'kakao';
// 네이버 인앱
if(/NAVER\(inapp/i.test(ua)) return 'naver';
// 인스타/페북 인앱
if(/Instagram|FBAN|FBAV/i.test(ua)) return 'social';
// iOS Safari (CriOS/FxiOS/EdgiOS 등은 제외)
if(/iPad|iPhone|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua)) return 'ios_safari';
// iOS 다른 브라우저
if(/iPad|iPhone|iPod/i.test(ua)) return 'ios_other';
// Android Chrome/Samsung/Edge (deferredInstall 이벤트가 떠있는 경우)
if(typeof deferredInstall !== 'undefined' && deferredInstall) return 'android_chrome';
// 기타 (PC Chrome, 웨일, 파이어폭스 등)
return 'other';
}

function openInChrome(){
const url = location.href;
const ua = navigator.userAgent;
const uaL = ua.toLowerCase();
if(/android/.test(uaL)){
// 카카오톡 인앱: 카카오 전용 외부 브라우저 스킴
if(/kakaotalk/i.test(ua)){
location.href = 'kakaotalk://web/openExternal?url=' + encodeURIComponent(url);
return;
}
// 네이버 인앱: googlechrome 스킴 → intent 폴백
if(/naver/i.test(ua)){
location.href = 'googlechrome://navigate?url=' + encodeURIComponent(url);
setTimeout(()=>{
const hostAndPath = url.replace(/^https?:\/\//,'');
location.href = 'intent://' + hostAndPath + '#Intent;scheme=https;package=com.android.chrome;end';
},800);
return;
}
// 기타 Android: intent 스킴
const hostAndPath = url.replace(/^https?:\/\//,'');
location.href = 'intent://' + hostAndPath + '#Intent;scheme=https;package=com.android.chrome;end';
// 실패 폴백
setTimeout(()=>{
if(document.visibilityState==='visible'){
try{
navigator.clipboard.writeText(url);
alert('크롬이 설치되어 있지 않거나 차단됐어요.\nURL이 복사됐으니 Chrome에 붙여넣어 주세요.');
}catch(e){
prompt('아래 URL을 복사해서 Chrome에서 열어주세요:', url);
}
}
},2500);
} else if(/iphone|ipad|ipod/.test(uaL)){
const chromeUrl = url.replace(/^https?/,'googlechrome');
location.href = chromeUrl;
setTimeout(()=>{
if(document.visibilityState==='visible'){
try{ navigator.clipboard.writeText(url); alert('Chrome 앱이 없거나 열 수 없어요.\nURL이 복사됐어요.'); }
catch(e){ prompt('아래 URL을 복사해서 Chrome 또는 Safari에서 열어주세요:', url); }
}
},1500);
} else {
alert('Android 또는 iOS에서만 자동 전환이 가능합니다.\n브라우저 앱을 직접 열어 주세요.');
}
}

function showInstallPromptIfNeeded(){
// 팝업 공지가 이미 떠있으면 스킵 (겹침 방지)
if(document.getElementById('popupNoticeOverlay')) return;
if(document.getElementById('installPromptOverlay')) return;
const env = detectInstallEnv();
// 이미 설치됐으면 노출 안 함 + 영구 저장
if(env === 'installed'){
try{ localStorage.setItem('brethin_installed','1'); }catch(e){}
return;
}
// 이미 설치 완료 플래그 있으면 노출 안 함
try{ if(localStorage.getItem('brethin_installed')==='1') return; }catch(e){}
// 7일 쿨다운 체크
try{
const last = localStorage.getItem('installPromptDismissed');
if(last){
const diffDays = (Date.now() - parseInt(last)) / (86400000);
if(diffDays < 7) return;
}
}catch(e){}
// 환경별 컨텐츠 구성
let title = '📱 브레스인을 홈화면에 추가하세요!';
let bodyHtml = '';
let mainBtnHtml = '';

if(env === 'android_chrome'){
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">Chrome 브라우저로 접속해주셨네요!<br>아래 버튼을 누르면 홈화면에 바로 추가할 수 있어요.<br><br>앱처럼 편하게, 오프라인에서도 사용 가능합니다. ✨</div>`;
mainBtnHtml = `<button class="pn-btn pn-btn-primary" id="installPromptMainBtn">🏠 홈화면에 추가하기</button>`;
}
else if(env === 'ios_safari'){
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">Safari에서 아래 순서대로 진행해주세요.</div>
<div style="margin-top:16px;display:flex;flex-direction:column;gap:10px;">
<div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(212,168,75,0.15);color:#d4a84b;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">1</div><div style="font-size:13px;color:var(--text);line-height:1.6;">하단의 <b>공유 버튼(⬆️)</b> 을 탭하세요</div></div>
<div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(212,168,75,0.15);color:#d4a84b;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">2</div><div style="font-size:13px;color:var(--text);line-height:1.6;"><b>'홈 화면에 추가'</b> 를 탭하세요</div></div>
<div style="display:flex;align-items:flex-start;gap:10px;"><div style="flex-shrink:0;width:22px;height:22px;border-radius:50%;background:rgba(212,168,75,0.15);color:#d4a84b;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">3</div><div style="font-size:13px;color:var(--text);line-height:1.6;">오른쪽 상단 <b>'추가'</b> 버튼을 탭하면 완료! 🎉</div></div>
</div>`;
}
else if(env === 'ios_other'){
title = '⚠️ Safari에서 열어주세요';
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">iPhone/iPad에서 홈화면 추가는 <b>Safari 브라우저</b>에서만 가능해요.<br><br>현재 URL을 복사해서 Safari에서 붙여넣어 주세요.</div>`;
mainBtnHtml = `<button class="pn-btn pn-btn-primary" id="installPromptMainBtn">📋 URL 복사하기</button>`;
}
else if(env === 'kakao'){
title = '⚠️ 카카오톡에서는 설치가 어려워요';
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">카카오톡 내부 브라우저에서는 홈화면 추가가 불가능합니다.<br><br>아래 버튼으로 Chrome에서 열어주세요.<br><br><span style="color:var(--text2);font-size:12px;">또는 우측 상단 메뉴(⋮) → '다른 브라우저로 열기' 선택</span></div>`;
mainBtnHtml = `<button class="pn-btn pn-btn-primary" id="installPromptMainBtn">🔗 Chrome에서 열기 (Android)</button>`;
}
else if(env === 'naver'){
title = '⚠️ 네이버 앱에서는 설치가 어려워요';
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">네이버 인앱 브라우저에서는 홈화면 추가가 불가능합니다.<br><br>아래 버튼으로 Chrome에서 열어주세요.<br><br><span style="color:var(--text2);font-size:12px;">또는 우측 하단 메뉴 → 'Chrome으로 열기' 선택</span></div>`;
mainBtnHtml = `<button class="pn-btn pn-btn-primary" id="installPromptMainBtn">🔗 Chrome에서 열기 (Android)</button>`;
}
else if(env === 'social'){
title = '⚠️ 인앱 브라우저에서는 설치가 어려워요';
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">현재 브라우저에서는 홈화면 추가가 불가능합니다.<br><br>Chrome 또는 Safari에서 열어주세요.</div>`;
mainBtnHtml = `<button class="pn-btn pn-btn-primary" id="installPromptMainBtn">🔗 Chrome에서 열기 (Android)</button>`;
}
else {
// 기타 (웨일, 파이어폭스, PC 등)
bodyHtml = `<div style="font-size:14px;color:var(--text);line-height:1.7;">사용 중인 브라우저의 메뉴에서 <b>'홈 화면에 추가'</b> 를 선택해 주세요.</div>
<div style="margin-top:14px;padding:12px;background:var(--bg2);border-radius:8px;font-size:12px;color:var(--text2);line-height:1.8;">
<div><b>Whale</b> · 메뉴 → 홈 화면에 추가</div>
<div><b>Firefox</b> · 메뉴 → 홈 화면에 추가</div>
<div><b>PC Chrome</b> · 주소창 오른쪽 설치 아이콘(⊕) 클릭</div>
</div>`;
}
// 팝업 생성
const overlay = document.createElement('div');
overlay.id = 'installPromptOverlay';
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:popupFadeIn .3s;';
overlay.innerHTML = `
<style>
@keyframes popupFadeIn{from{opacity:0}to{opacity:1}}
@keyframes popupSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
#installPromptBox .pn-btn{flex:1;padding:12px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;border:none;transition:background .15s;}
#installPromptBox .pn-btn-primary{background:var(--accent,#d4a84b);color:#fff;}
#installPromptBox .pn-btn-primary:hover{opacity:.9;}
#installPromptBox .pn-btn-outline{background:transparent;color:var(--text2);border:1px solid var(--bg3);}
#installPromptBox .pn-btn-outline:hover{background:var(--bg2);}
#installPromptBox .pn-btn-confirm{background:transparent;color:var(--text);border:1px solid var(--bg3);}
#installPromptBox .pn-btn-confirm:hover{background:var(--bg2);}
</style>
<div id="installPromptBox" style="background:var(--bg);border:1px solid var(--bd);border-radius:14px;max-width:480px;width:100%;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;animation:popupSlideUp .35s;">
<div style="padding:22px 22px 16px;overflow-y:auto;flex:1;">
<div style="color:#d4a84b;font-size:12px;font-weight:500;margin-bottom:8px;">📱 앱 설치 안내</div>
<div style="font-size:17px;font-weight:600;color:var(--text);margin-bottom:14px;line-height:1.4;">${title}</div>
${bodyHtml}
</div>
<div style="padding:12px 22px 22px;display:flex;gap:8px;border-top:1px solid var(--bd);flex-wrap:wrap;">
${mainBtnHtml ? `<div style="display:flex;width:100%;margin-bottom:4px;">${mainBtnHtml}</div>` : ''}
<button class="pn-btn pn-btn-outline" id="installPromptDismiss">7일 동안 보지 않기</button>
<button class="pn-btn pn-btn-confirm" id="installPromptClose">닫기</button>
</div>
</div>
`;
document.body.appendChild(overlay);
const close = ()=>{
overlay.style.opacity='0';
overlay.style.transition='opacity .25s';
setTimeout(()=>overlay.remove(), 250);
};
document.getElementById('installPromptClose').addEventListener('click', close);
document.getElementById('installPromptDismiss').addEventListener('click', ()=>{
try{ localStorage.setItem('installPromptDismissed', String(Date.now())); }catch(e){}
close();
});
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) close(); });
// 메인 버튼 동작 분기
const mainBtn = document.getElementById('installPromptMainBtn');
if(mainBtn){
mainBtn.addEventListener('click', async ()=>{
if(env === 'android_chrome'){
if(typeof triggerInstall === 'function'){
await triggerInstall();
// 성공 시 appinstalled 이벤트가 처리할 것
} else if(typeof deferredInstall !== 'undefined' && deferredInstall){
deferredInstall.prompt();
const r = await deferredInstall.userChoice;
if(r.outcome === 'accepted'){
try{ localStorage.setItem('brethin_installed','1'); }catch(e){}
deferredInstall = null;
}
}
close();
}
else if(env === 'kakao' || env === 'naver' || env === 'social'){
openInChrome();
}
else if(env === 'ios_other'){
try{
await navigator.clipboard.writeText(location.href);
mainBtn.textContent = '✅ 복사 완료! Safari에서 붙여넣기';
mainBtn.disabled = true;
setTimeout(close, 1500);
}catch(e){
prompt('아래 URL을 복사해서 Safari에서 열어주세요:', location.href);
}
}
});
}
}

// PWA 설치 완료 감지 (설치 후 다시 안 뜨도록)
window.addEventListener('appinstalled', ()=>{
try{ localStorage.setItem('brethin_installed','1'); }catch(e){}
});

let _guide = null;
async function loadGuide() {
try {
const snap = await db.collection('guide').limit(1).get();
if (!snap.empty) _guide = snap.docs[0].data();
} catch(e) { console.log('가이드 로드 실패:', e); }
}
let _columns = [];
let _bookmarks = JSON.parse(localStorage.getItem('breath5_bookmarks')||'[]');
let colFilter = 'all';
let colSearchQuery = '';
let colPage = 1;
const COL_PAGE_SIZE = 4;
function saveBookmarks(){
localStorage.setItem('breath5_bookmarks',JSON.stringify(_bookmarks));
if(curUser){
clearTimeout(saveBookmarks._t);
saveBookmarks._t=setTimeout(()=>{if(typeof saveUserData==='function')saveUserData();},2000);
}
}
function isBookmarked(id){return _bookmarks.includes(id);}
function toggleBookmark(id){
if(!curUser){
openAuthModal('로그인하면 북마크가 저장됩니다 🔖\n어떤 기기에서도 저장한 칼럼을 볼 수 있어요.');
return;
}
if(isBookmarked(id))_bookmarks=_bookmarks.filter(b=>b!==id);
else _bookmarks.push(id);
saveBookmarks();
}
function setColFilter(f){
colFilter=f;
colPage=1;
document.querySelectorAll('.col-tb-btn').forEach(b=>b.classList.remove('act'));
const btn=document.getElementById(f==='all'?'colBtnAll':'colBtnBookmark');
if(btn)btn.classList.add('act');
renderColList();
}
function openSearch(){
document.getElementById('colSearchWrap').style.display='flex';
document.getElementById('colToolbarBtns').style.display='none';
setTimeout(()=>document.getElementById('colSearchInput').focus(),50);
}
function closeSearch(){
colSearchQuery='';
colPage=1;
document.getElementById('colSearchWrap').style.display='none';
document.getElementById('colToolbarBtns').style.display='flex';
document.getElementById('colSearchInput').value='';
renderColList();
}
function filterColumns(){
colSearchQuery=document.getElementById('colSearchInput').value.trim().toLowerCase();
colPage=1;
renderColList();
}
function loadMoreCols(){
const prevCount=(colPage-1)*COL_PAGE_SIZE;
colPage++;
renderColList();
const cards=document.getElementById('colList').querySelectorAll('.col-card');
if(cards[prevCount])cards[prevCount].scrollIntoView({behavior:'smooth',block:'start'});
}
function renderColList(){
const list=document.getElementById('colList');
let cols=_columns;
if(colFilter==='bookmark')cols=cols.filter(c=>isBookmarked(c.id));
if(colSearchQuery)cols=cols.filter(c=>(c.title||'').toLowerCase().includes(colSearchQuery)||(c.content||'').toLowerCase().includes(colSearchQuery));
if(!cols.length){
list.innerHTML=`<div class="nb"><div style="font-size:28px;margin-bottom:10px;">✍️</div><div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:6px;">${colFilter==='bookmark'?'북마크된 칼럼이 없습니다':'등록된 칼럼이 없습니다'}</div></div>`;
return;
}
const visible=cols.slice(0,colPage*COL_PAGE_SIZE);
const hasMore=visible.length<cols.length;
list.innerHTML=visible.map(c=>{
const idx=_columns.indexOf(c);
const thumb=c.thumbUrl?`<img class="col-thumb" src="${c.thumbUrl}" alt="" onerror="this.outerHTML='<div class=\'col-thumb-empty\'><span class=\'col-thumb-brand\'>BRETHIN</span></div>'">`:`<div class="col-thumb-empty"><span class="col-thumb-brand">BRETHIN</span></div>`;
const excerpt=(c.content||'').replace(/\[img:[^\]]+\]/g,'').replace(/https?:\/\/\S+/g,'').trim().substring(0,120);
const bm=isBookmarked(c.id);
return `<div class="col-card" onclick="showColDetail(${idx})">
${thumb}
<div class="col-info">
${c.category?`<div class="col-cat">${eh(c.category)}</div>`:''}
<div class="col-title">${eh(c.title)}</div>
<div class="col-excerpt">${eh(excerpt)}</div>
<div class="col-meta">
<span class="col-date">${fmtDate(c.createdAt)}</span>
<span class="col-views"><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2.5"/></svg>${c.views||0}</span>
${bm?`<svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" stroke="currentColor" stroke-width="1.5" style="color:var(--warning);"><path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z"/></svg>`:''}
</div>
</div>
</div>`;
}).join('')+(hasMore?`<button onclick="loadMoreCols()" style="width:100%;padding:12px;margin-top:4px;font-size:13px;font-weight:500;border-radius:10px;border:0.5px solid var(--bd2);background:transparent;color:var(--text2);cursor:pointer;font-family:inherit;">더보기 (${cols.length-visible.length}개 남음)</button>`:'');
}
async function loadColumns() {
const spinner=document.getElementById('colSpinner');
colPage=1;
try {
const snap=await db.collection('columns').get();
_columns=snap.docs
.map(d=>({id:d.id,...d.data()}))
.sort((a,b)=>((b.createdAt&&b.createdAt.seconds)||0)-((a.createdAt&&a.createdAt.seconds)||0));
spinner.style.display='none';
const btn=document.getElementById('colBtnAll');
if(btn)btn.classList.add('act');
renderColList();
} catch(e){
console.error('칼럼 로드 실패:', e);
if(spinner) spinner.textContent='불러오기 실패 ('+e.code+'): 네트워크 및 Firestore 규칙을 확인해주세요.';
}
}
async function showColDetail(i) {
const c=_columns[i];
try{await db.collection('columns').doc(c.id).update({views:(c.views||0)+1});c.views=(c.views||0)+1;}catch(e){}
const appUrl=window.location.href.split('?')[0];
const bm=isBookmarked(c.id);
const thumbHtml=c.thumbUrl&&c.thumbUrl.startsWith('http')
?`<img src="${c.thumbUrl}" alt="" style="width:100%;border-radius:10px;object-fit:cover;max-height:200px;margin-bottom:1.25rem;display:block;">`:'';
const cs = c.columnistSnap;
const columnistHtml = cs && cs.name ? `
<div style="margin-top:1.5rem;padding:14px 16px;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;cursor:pointer;" onclick="showColumnistPage('${eh(cs.name||'')}')">
<div style="font-size:10px;font-weight:600;color:var(--text3);letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px;">칼럼리스트</div>
<div style="display:flex;align-items:center;gap:12px;">
<div style="width:44px;height:44px;border-radius:50%;background:var(--bg3);flex-shrink:0;overflow:hidden;border:1px solid var(--bd);">
${cs.photoUrl?`<img src="${cs.photoUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`:
`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:20px;">👤</div>`}
</div>
<div style="flex:1;min-width:0;">
<div style="font-size:14px;font-weight:600;color:var(--text);">${eh(cs.name)}${cs.nickname?` <span style="font-size:12px;color:var(--text3);font-weight:400;">@${eh(cs.nickname)}</span>`:''}</div>
${cs.bio?`<div style="font-size:12px;color:var(--text2);margin-top:2px;">${eh(cs.bio)}</div>`:''}
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:6px;">
${cs.blog?`<a href="${eh(cs.blog)}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>📝</span> 블로그</a>`:''}
${cs.insta?`<a href="${cs.insta.startsWith('http')?eh(cs.insta):'https://instagram.com/'+cs.insta.replace('@','')}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>📸</span> 인스타그램</a>`:''}
${cs.youtube?`<a href="${eh(cs.youtube)}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>▶️</span> 유튜브</a>`:''}
</div>
</div>
</div>
</div>` : '';
document.getElementById('colDetailContent').innerHTML=`
<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;">
<div style="flex:1;">
${c.category?`<div class="col-cat" style="margin-bottom:6px;">${eh(c.category)}</div>`:''}
<div style="font-size:20px;font-weight:700;color:var(--text);line-height:1.3;">${eh(c.title)}</div>
</div>
<button class="col-bm-btn${bm?' bookmarked':''}" id="bmBtn" onclick="toggleBmBtn(${i})" style="flex-shrink:0;margin-left:10px;margin-top:2px;">
<svg width="18" height="18" viewBox="0 0 16 16" fill="${bm?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z"/></svg>
</button>
</div>
${c.subtitle?`<div style="font-size:14px;color:var(--text2);margin-bottom:12px;">${eh(c.subtitle)}</div>`:''}
<div style="display:flex;align-items:center;gap:10px;font-size:12px;color:var(--text3);margin-bottom:1.25rem;">
<span>${fmtDate(c.createdAt)}</span>
<span style="display:flex;align-items:center;gap:3px;"><svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2.5"/></svg>${c.views||0}</span>
</div>
${thumbHtml}
<div class="col-body" style="line-height:1.8;">${renderContent(c.content)}</div>
${columnistHtml}
<div style="display:flex;justify-content:flex-end;padding-top:1rem;border-top:0.5px solid var(--bd);margin-top:1rem;">
<button class="col-action-btn" onclick="shareCol('${eh(c.title)}','${appUrl}?col=${c.id}')">
<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg>
공유하기
</button>
</div>`;
document.getElementById('colListView').style.display='none';
document.getElementById('colDetailView').style.display='block';
}
function toggleBmBtn(i){
const c=_columns[i];toggleBookmark(c.id);
const bm=isBookmarked(c.id);
const btn=document.getElementById('bmBtn');
if(btn){
btn.className='col-bm-btn'+(bm?' bookmarked':'');
btn.innerHTML=`<svg width="18" height="18" viewBox="0 0 16 16" fill="${bm?'currentColor':'none'}" stroke="currentColor" stroke-width="1.5"><path d="M4 2h8a1 1 0 0 1 1 1v11l-5-3-5 3V3a1 1 0 0 1 1-1z"/></svg>`;
}
showToast(bm?'북마크에 추가됐어요!':'북마크가 해제됐어요');
}
async function shareCol(title,url){
const text=`들숨과 날숨 사이, 나를 만나는 브레스인\nBRETHIN 🌿`;
try{if(navigator.share)await navigator.share({title,text,url});else{await navigator.clipboard.writeText(title+'\n'+text+'\n'+url);showToast('링크가 복사됐어요!');}
giveShareBonus('column');}catch(e){if(e.name!=='AbortError')showToast('공유를 취소했어요');}
}
function closeColDetail(){
document.getElementById('colListView').style.display='block';
document.getElementById('colDetailView').style.display='none';
renderColList();
}
let _columnistName='';
let columnistPage=1;
function renderColumnistList(){
const cols=_columns.filter(c=>c.columnistSnap&&c.columnistSnap.name===_columnistName);
const visible=cols.slice(0,columnistPage*COL_PAGE_SIZE);
const hasMore=visible.length<cols.length;
const listHtml=cols.length?visible.map(c=>{
const idx=_columns.indexOf(c);
const thumb=c.thumbUrl?`<img class="col-thumb" src="${c.thumbUrl}" alt="" onerror="this.outerHTML='<div class=\'col-thumb-empty\'><span class=\'col-thumb-brand\'>BRETHIN</span></div>'">`:`<div class="col-thumb-empty"><span class="col-thumb-brand">BRETHIN</span></div>`;
const excerpt=(c.content||'').replace(/\[img:[^\]]+\]/g,'').replace(/https?:\/\/\S+/g,'').trim().substring(0,120);
return `<div class="col-card" onclick="showColDetail(${idx});document.getElementById('colColumnistView').style.display='none';document.getElementById('colDetailView').style.display='block';">
${thumb}
<div class="col-info">
${c.category?`<div class="col-cat">${eh(c.category)}</div>`:''}
<div class="col-title">${eh(c.title)}</div>
<div class="col-excerpt">${eh(excerpt)}</div>
<div class="col-meta">
<span class="col-date">${fmtDate(c.createdAt)}</span>
<span class="col-views"><svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2.5"/></svg>${c.views||0}</span>
</div>
</div>
</div>`;
}).join('')+(hasMore?`<button onclick="loadMoreColumnist()" style="width:100%;padding:12px;margin-top:4px;font-size:13px;font-weight:500;border-radius:10px;border:0.5px solid var(--bd2);background:transparent;color:var(--text2);cursor:pointer;font-family:inherit;">더보기 (${cols.length-visible.length}개 남음)</button>`:''):`<div class="nb"><div style="font-size:13px;color:var(--text2);">등록된 칼럼이 없습니다</div></div>`;
document.getElementById('colColumnistList').innerHTML=listHtml;
}
function loadMoreColumnist(){
const cols=_columns.filter(c=>c.columnistSnap&&c.columnistSnap.name===_columnistName);
const prevCount=columnistPage*COL_PAGE_SIZE;
columnistPage++;
renderColumnistList();
const cards=document.getElementById('colColumnistList').querySelectorAll('.col-card');
if(cards[prevCount])cards[prevCount].scrollIntoView({behavior:'smooth',block:'start'});
}
function showColumnistPage(name){
_columnistName=name;
columnistPage=1;
const cols=_columns.filter(c=>c.columnistSnap&&c.columnistSnap.name===name);
const cs=cols.length?cols[0].columnistSnap:null;
if(!cs)return;
const profileHtml=`
<div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:16px;margin-bottom:1.25rem;">
<div style="display:flex;align-items:center;gap:12px;">
<div style="width:56px;height:56px;border-radius:50%;background:var(--bg3);flex-shrink:0;overflow:hidden;border:1px solid var(--bd);">
${cs.photoUrl?`<img src="${eh(cs.photoUrl)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">`:`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:24px;">👤</div>`}
</div>
<div style="flex:1;min-width:0;">
<div style="font-size:16px;font-weight:700;color:var(--text);">${eh(cs.name)}${cs.nickname?` <span style="font-size:13px;color:var(--text3);font-weight:400;">@${eh(cs.nickname)}</span>`:''}</div>
${cs.bio?`<div style="font-size:13px;color:var(--text2);margin-top:4px;">${eh(cs.bio)}</div>`:''}
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:8px;">
${cs.blog?`<a href="${eh(cs.blog)}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>📝</span> 블로그</a>`:''}
${cs.insta?`<a href="${cs.insta.startsWith('http')?eh(cs.insta):'https://instagram.com/'+cs.insta.replace('@','')}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>📸</span> 인스타그램</a>`:''}
${cs.youtube?`<a href="${eh(cs.youtube)}" target="_blank" style="font-size:12px;color:var(--info);display:flex;align-items:center;gap:3px;"><span>▶️</span> 유튜브</a>`:''}
</div>
</div>
</div>
</div>
<div style="font-size:12px;font-weight:600;color:var(--text2);letter-spacing:0.04em;margin-bottom:10px;">게시된 칼럼 ${cols.length}편</div>
<div id="colColumnistList"></div>`;
document.getElementById('colColumnistContent').innerHTML=profileHtml;
renderColumnistList();
document.getElementById('colDetailView').style.display='none';
document.getElementById('colListView').style.display='none';
document.getElementById('colColumnistView').style.display='block';
}
function closeColumnistPage(){
document.getElementById('colColumnistView').style.display='none';
document.getElementById('colDetailView').style.display='block';
}
function fmtDate(ts) {
if (!ts) return '';
const d = ts.toDate ? ts.toDate() : new Date(ts);
return d.getFullYear() + '.' + String(d.getMonth()+1).padStart(2,'0') + '.' + String(d.getDate()).padStart(2,'0');
}
function renderContent(text) {
if (!text) return '';
const lines = text.split('\n');
return lines.map(line => {
const trimmed = line.trim();
const imgTag = trimmed.match(/^\[img:(https?:\/\/[^\]]+)\]$/);
if (imgTag) {
return `<img src="${imgTag[1]}" alt="이미지" style="width:100%;border-radius:8px;margin:8px 0;display:block;">`;
}
if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(trimmed)) {
return `<img src="${trimmed}" alt="이미지" style="width:100%;border-radius:8px;margin:8px 0;display:block;">`;
}
return `<span>${eh(line)}</span>`;
}).join('<br>');
}