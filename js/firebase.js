/* ── firebase.js — Firebase 초기화, 데이터 로드, 칼럼/배너/공지
   load order: 1번째
── */

/* ── Firebase 초기화 ── */
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

/* ── Analytics (선택적 - measurementId 설정 후 활성화) ── */
let analytics = null;
try{ analytics = firebase.analytics(); }catch(e){ console.log('Analytics 비활성화:', e.message); }

/* ── Analytics 이벤트 로깅 ── */
function logEvent(name, params){
  try{ if(analytics) analytics.logEvent(name, params||{}); }catch(e){}
}

/* ── Firebase 데이터 로드 ── */
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
        if (d.active === false) return false; // 숨김 제외
        if (d.expireAt) {
          const exp = d.expireAt.toDate ? d.expireAt.toDate().getTime() : new Date(d.expireAt).getTime();
          if (exp < now) return false;
        }
        return true;
      })
      .sort((a,b) => (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0))
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

function saveBookmarks(){localStorage.setItem('breath5_bookmarks',JSON.stringify(_bookmarks));}
function isBookmarked(id){return _bookmarks.includes(id);}
function toggleBookmark(id){
  if(isBookmarked(id))_bookmarks=_bookmarks.filter(b=>b!==id);
  else _bookmarks.push(id);
  saveBookmarks();
}
function setColFilter(f){
  colFilter=f;
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
  document.getElementById('colSearchWrap').style.display='none';
  document.getElementById('colToolbarBtns').style.display='flex';
  document.getElementById('colSearchInput').value='';
  renderColList();
}
function filterColumns(){
  colSearchQuery=document.getElementById('colSearchInput').value.trim().toLowerCase();
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
  list.innerHTML=cols.map(c=>{
    const idx=_columns.indexOf(c);
    const thumb=c.thumbUrl?`<img class="col-thumb" src="${c.thumbUrl}" alt="">`:`<div class="col-thumb-empty">사진없음</div>`;
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
  }).join('');
}
async function loadColumns() {
  const spinner=document.getElementById('colSpinner');
  try {
    const snap=await db.collection('columns').get();
    _columns=snap.docs
      .map(d=>({id:d.id,...d.data()}))
      .sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
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
  // 대표이미지 (thumbUrl이 http로 시작하는 경우만 표시)
  const thumbHtml=c.thumbUrl&&c.thumbUrl.startsWith('http')
    ?`<img src="${c.thumbUrl}" alt="" style="width:100%;border-radius:10px;object-fit:cover;max-height:200px;margin-bottom:1.25rem;display:block;">`:'';
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
    <div style="display:flex;justify-content:flex-end;padding-top:1rem;border-top:0.5px solid var(--bd);margin-top:1.5rem;">
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
  try{if(navigator.share)await navigator.share({title,text,url});else{await navigator.clipboard.writeText(title+'\n'+text+'\n'+url);showToast('링크가 복사됐어요!');}}catch(e){if(e.name!=='AbortError')showToast('공유를 취소했어요');}
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

/* ── 본문 렌더링 (이미지 태그 지원) ──
   관리자에서 [img:https://...] 형식으로 삽입하면 이미지로 표시
   또는 한 줄 전체가 http로 시작하는 이미지 URL이면 자동 인식 */
function renderContent(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map(line => {
    const trimmed = line.trim();
    // [img:URL] 형식
    const imgTag = trimmed.match(/^\[img:(https?:\/\/[^\]]+)\]$/);
    if (imgTag) {
      return `<img src="${imgTag[1]}" alt="이미지" style="width:100%;border-radius:8px;margin:8px 0;display:block;">`;
    }
    // 단독 이미지 URL (jpg, png, gif, webp로 끝나는)
    if (/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(trimmed)) {
      return `<img src="${trimmed}" alt="이미지" style="width:100%;border-radius:8px;margin:8px 0;display:block;">`;
    }
    // 일반 텍스트
    return `<span>${eh(line)}</span>`;
  }).join('<br>');
}

