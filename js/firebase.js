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
const COL_PAGE_SIZE = 8;
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
colPage++;
renderColList();
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
<div style="margin-top:1.5rem;padding:14px 16px;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;">
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