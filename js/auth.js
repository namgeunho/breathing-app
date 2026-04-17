/* ── auth.js — 인앱감지, 초기화/탈퇴, 로그인, Firestore 동기화
   load order: 7번째
── */
/* ── 인앱 브라우저 감지 및 크롬 유도 ── */
(function(){
  const ua=navigator.userAgent.toLowerCase();
  // 카카오톡, 네이버, 인스타, 페이스북 인앱 브라우저 감지
  const isInApp=/kakaotalk|kakaostory|naver|instagram|fbios|fb_iab|fban|line|wechat|micromessenger/.test(ua);
  if(!isInApp) return;
  const banner=document.getElementById('inappBanner');
  if(banner){
    banner.style.display='block';
    // 배너 높이만큼 wrap에 padding-top 추가
    setTimeout(()=>{
      const h=banner.offsetHeight;
      const wrap=document.querySelector('.wrap');
      if(wrap) wrap.style.paddingTop=`calc(env(safe-area-inset-top,0px) + ${h}px)`;
    },50);
  }
})();

function openInChrome(){
  const url=window.location.href;
  const ua=navigator.userAgent.toLowerCase();
  if(/android/.test(ua)){
    // 안드로이드: intent 스킴으로 크롬 강제 실행
    const intentUrl='intent://'+url.replace(/^https?:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end';
    window.location.href=intentUrl;
  } else if(/iphone|ipad|ipod/.test(ua)){
    // iOS: 크롬 URL 스킴으로 열기 시도
    const chromeUrl=url.replace(/^https?/,'googlechrome');
    const iframe=document.createElement('iframe');
    iframe.style.display='none';
    iframe.src=chromeUrl;
    document.body.appendChild(iframe);
    setTimeout(()=>{
      document.body.removeChild(iframe);
      // 크롬이 설치 안 돼 있으면 Safari로 fallback
      window.location.href=url;
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

/* ── 데이터 초기화 ── */
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
  // localStorage 초기화
  const LS='breath5_';
  ['pp','mode','pi','dur','rec','memo','name','ms','photo','theme','sfx','bgmOn','bgm','sfxVol','bgmVol','page','bookmarks'].forEach(k=>localStorage.removeItem(LS+k));
  // 메모리 초기화
  records={};memos={};userName='사용자';userPhoto=null;
  selPI=0;curMode='program';
  presets=defPresets.map(p=>({...p}));
  // Firestore 동기화
  if(curUser){
    db.collection('users').doc(curUser.uid).set({
      records:{},memos:{},userName:'사용자',
      presets:defPresets.map(p=>({...p})),
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    }).catch(e=>console.log(e));
  }
  save();
  renderUserBar();
  closeSub();
  showToast('모든 정보가 초기화됐어요.');
}

/* ── 회원 탈퇴 ── */
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
    // Firestore 유저 데이터 삭제
    if(curUser){
      await db.collection('users').doc(curUser.uid).delete();
      // Firebase Auth 계정 삭제
      await curUser.delete();
    }
    // localStorage 전부 초기화
    const LS='breath5_';
    ['pp','mode','pi','dur','rec','memo','name','ms','photo','theme','sfx','bgmOn','bgm','sfxVol','bgmVol','page','bookmarks'].forEach(k=>localStorage.removeItem(LS+k));
    records={};memos={};userName='사용자';userPhoto=null;curUser=null;
    closeSub();
    showPage('train',null);
    showToast('탈퇴가 완료됐어요. 이용해 주셔서 감사합니다.');
  }catch(e){
    if(e.code==='auth/requires-recent-login'){
      // 재로그인 필요
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
  }catch(e){ if(e.name!=='AbortError') showToast('공유를 취소했어요'); }
}

/* ── Google 로그인 / 로그아웃 ── */
async function signInGoogle(){
  const btn = document.querySelector('.auth-btn-google');
  if(btn){ btn.disabled=true; btn.style.opacity='0.6'; }
  try{
    // popup 방식 — 모바일 포함 대부분 작동 (사용자 제스처 직후 호출 시)
    await auth.signInWithPopup(googleProvider);
    closeAuthModal();
  }catch(e){
    // popup 차단/미지원 시 redirect fallback
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

/* ── 로그인 모달 ── */
function openAuthModal(msg){
  const sub=document.getElementById('authSubMsg');
  if(msg&&sub) sub.textContent=msg;
  document.getElementById('authOverlay').style.display='flex';
}
function closeAuthModal(){
  document.getElementById('authOverlay').style.display='none';
}

/* ── Firestore 유저 데이터 동기화 ── */
async function syncUserData(){
  if(!curUser) return;
  const ref=db.collection('users').doc(curUser.uid);
  try{
    const snap=await ref.get();
    if(snap.exists){
      const d=snap.data();
      if(d.records) records=d.records;
      if(d.memos) memos=d.memos;
      if(d.presets) presets=d.presets;
      if(d.tree) treeData={...treeData,...d.tree};
      // maxLv: 서버와 로컬 중 더 높은 값 유지
      if(d.maxLv !== undefined){
        const localMax = getMaxAchievedLv();
        const serverMax = d.maxLv;
        const merged = Math.max(localMax, serverMax);
        if(merged > 0) localStorage.setItem(LS+'maxLv', merged);
      }
      if(!userName||userName==='사용자'){
        userName=d.userName||curUser.displayName||'사용자';
      }
      if(!userPhoto){
        userPhoto=d.userPhoto||null;
        if(!userPhoto&&curUser.photoURL) userPhoto=curUser.photoURL;
      }
      save();
    } else {
      await ref.set({
        records, memos, userName,
        userPhoto: userPhoto||'',
        presets: presets.map(p=>({...p})),
        maxLv: getMaxAchievedLv(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    renderUserBar();
    renderTree();
    if(curPage==='calendar'){renderCal();updateCalSt();}
    if(curPage==='config') renderConfigMain();
  }catch(e){ console.log('유저 데이터 동기화 실패:',e); }
}

async function saveUserData(){
  if(!curUser) return;
  try{
    await db.collection('users').doc(curUser.uid).set({
      records, memos, userName,
      userPhoto: userPhoto&&!userPhoto.startsWith('http')?'':userPhoto||'',
      presets: presets.map(p=>({...p})),
      maxLv: getMaxAchievedLv(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
  }catch(e){ console.log('저장 실패:',e); }
}

/* ── Auth 상태 감지 ── */
let calViewMode='calendar';
let graphYear,graphMonth;

function setCalView(mode){
  calViewMode=mode;
  document.getElementById('calViewBtn').classList.toggle('active',mode==='calendar');
  document.getElementById('graphViewBtn').classList.toggle('active',mode==='graph');
  document.getElementById('calendarView').style.display=mode==='calendar'?'block':'none';
  document.getElementById('graphView').style.display=mode==='graph'?'block':'none';
  if(mode==='calendar'){
    // 캘린더 뷰 통계: 전체 누적
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
      <div class="graph-val">${total>0?total:''}</div>
      <div class="graph-bar${total>0?' has-data':''}" style="height:${h||2}px;${isToday?'opacity:1;':'opacity:0.7;'}"></div>
      <div class="graph-label" style="${isToday?'color:var(--info);font-weight:600;':''}">${d}</div>
    </div>`;
  }).join('');
  // 이달 통계
  const totalDays=data.filter(x=>x.total>0).length;
  const totalMin=data.reduce((s,x)=>s+x.total,0);
  const avgMin=totalDays>0?Math.round(totalMin/totalDays*10)/10:0;
  // 상단 통계칸을 이달 기준으로 교체
  document.getElementById('totalDays').textContent=totalDays;
  document.getElementById('totalDays').nextElementSibling.textContent='이달 훈련일';
  document.getElementById('totalMinutes').textContent=Math.round(totalMin);
  document.getElementById('totalMinutes').nextElementSibling.textContent='총 훈련(분)';
  document.getElementById('streakDays').textContent=avgMin;
  document.getElementById('streakDays').nextElementSibling.textContent='일평균(분)';
  document.getElementById('graphCanvas').innerHTML=`
    <div class="graph-wrap" id="graphWrap"><div class="graph-bar-wrap">${barsHtml}</div></div>
    <div style="font-size:11px;color:var(--text3);text-align:center;margin-top:4px;">막대 높이 = 해당일 총 훈련 시간(분)</div>`;

  // 그래프 하단 — 선택일 상세 (기본: 오늘)
  if(!document.getElementById('graphDayPanel')){
    const panel = document.createElement('div');
    panel.id = 'graphDayPanel';
    panel.className = 'graph-day-panel';
    document.getElementById('graphCanvas').after(panel);
  }
  renderGraphDayPanel(today());

  // 막대 클릭 → 해당일 상세
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
    // 오늘 막대 선택 표시
    const now = new Date();
    if(graphYear===now.getFullYear()&&graphMonth===now.getMonth()){
      const cols = document.querySelectorAll('.graph-bar-col');
      if(cols[now.getDate()-1]) cols[now.getDate()-1].classList.add('graph-bar-sel');
    }
  },60);

  // 오늘이 이달이면 오늘 막대를 화면 중앙으로 스크롤
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

  let html = `<div class="gdp-header">
    <span class="gdp-date">${dateLabel}${isToday?' <span class="gdp-today-badge">오늘</span>':''}</span>
  </div>`;

  // 훈련 기록
  if(recs.length>0){
    const total = recs.reduce((s,r)=>s+r.duration,0);
    html += `<div class="gdp-section-label">훈련 기록</div>`;
    recs.forEach((r,i)=>{
      const lv = r.level?`<span class="bg bga" style="font-size:10px;padding:1px 5px;margin-left:4px;">${r.level}</span>`:'';
      html += `<div class="gdp-rec">
        <div class="gdp-rec-left">
          <span class="gdp-rec-num">${i+1}회차</span>${lv}
          <span class="gdp-rec-pattern">들숨${r.inhale}·날숨${r.exhale}</span>
        </div>
        <div class="gdp-rec-right">
          <span class="bg bbl" style="font-size:11px;">${r.duration}분</span>
          <span class="bg bgn" style="font-size:11px;">${r.cycles}회</span>
        </div>
      </div>`;
    });
    html += `<div class="gdp-total">총 ${Math.round(total)}분 훈련</div>`;
  } else {
    html += `<div class="gdp-empty">훈련 기록이 없어요</div>`;
  }

  // 감정·메모
  if(hasMemoData){
    html += `<div class="gdp-divider"></div><div class="gdp-section-label">감정 · 메모</div>`;
    if(preMood||postMood){
      html += `<div class="gdp-mood">`;
      if(preMood) html += `<span class="gdp-mood-item">훈련 전 <strong>${preMood}</strong></span>`;
      if(preMood&&postMood) html += `<span class="gdp-mood-arrow">→</span>`;
      if(postMood) html += `<span class="gdp-mood-item">훈련 후 <strong>${postMood}</strong></span>`;
      html += `</div>`;
    }
    if(memo) html += `<div class="gdp-memo">${eh(memo)}</div>`;
    // 공유/수정/삭제 버튼
    html += `<div class="gdp-actions">
      <button class="bsm bshr" onclick="shareRecord('${key}')">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg>
        공유
      </button>
      <button class="bsm" onclick="editMemoFromGraph('${key}')">수정</button>
      <button class="bsm bdng" onclick="delMemoFromGraph('${key}')">삭제</button>
    </div>`;
  } else if(recs.length===0){
    html = `<div class="gdp-header"><span class="gdp-date">${dateLabel}${isToday?' <span class="gdp-today-badge">오늘</span>':''}</span></div>
      <div class="gdp-empty">이 날의 기록이 없어요</div>`;
  } else {
    // 훈련 기록은 있지만 메모 없음 — 공유만 표시
    html += `<div class="gdp-actions">
      <button class="bsm bshr" onclick="shareRecord('${key}')">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg>
        공유
      </button>
    </div>`;
  }

  panel.innerHTML = html;
}

// 그래프 패널에서 메모 수정 — 캘린더 탭으로 이동 후 해당 날짜 열기
function editMemoFromGraph(key){
  setCalView('calendar');
  setTimeout(()=>selD(key), 100);
}
function delMemoFromGraph(key){
  delMemo(key);
  renderGraphDayPanel(key);
}

function renderDB(key){
  const body=document.getElementById('detailBody');
  const recs=records[key]||[];
  const memoData=memos[key]||{};
  const memo=typeof memoData==='string'?memoData:(memoData.text||'');
  const preMood=typeof memoData==='object'?memoData.preMood||'':'';
  const postMood=typeof memoData==='object'?memoData.postMood||'':'';
  let html='';
  if(recs.length>0){
    html+='<div class="sl3">훈련 기록</div>';
    recs.forEach((r,i)=>{
      const lv=r.level?`<span class="bg bga" style="font-size:11px;padding:2px 6px;margin-left:4px;">${r.level}</span>`:'';
      html+=`<div class="ti"><div class="tl2"><div class="tn">${i+1}회차 · ${r.time}${lv}</div><div class="ts">들숨${r.inhale}/멈춤${r.holdIn}/날숨${r.exhale}/멈춤${r.holdOut}</div></div><div class="bgs"><span class="bg bbl">${r.duration}분</span><span class="bg bgn">${r.cycles}사이클</span></div></div>`;
    });
  } else { html+='<div class="em">훈련 기록이 없어요</div>'; }
  html+='<div class="cdiv"></div>';
  if(memo||preMood||postMood){
    // 저장된 메모 보기
    html+=`<div class="sl3">감정 · 메모</div>`;
    if(preMood)html+=`<div style="font-size:12px;color:var(--text2);margin-bottom:4px;">훈련 전: <strong>${preMood}</strong></div>`;
    if(postMood)html+=`<div style="font-size:12px;color:var(--text2);margin-bottom:8px;">훈련 후: <strong>${postMood}</strong></div>`;
    if(memo)html+=`<div class="mb2">${eh(memo)}</div>`;
    html+=`<div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;">
      <button class="bsm bshr" onclick="shareRecord('${key}')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg> 공유</button>
      <button class="bsm" onclick="editMemo('${key}')">수정</button>
      <button class="bsm bdng" onclick="delMemo('${key}')">삭제</button>
    </div>`;
  } else {
    // 메모 입력 폼
    html+=`<div class="sl3">감정 · 메모</div>
    <div class="emotion-row"><div class="emotion-lbl">훈련 전 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn" onclick="selEmo(this,'pre')">${e}</button>`).join('')}</div></div>
    <div class="emotion-row"><div class="emotion-lbl">훈련 후 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn" onclick="selEmo(this,'post')">${e}</button>`).join('')}</div></div>
    <textarea class="mi" id="memoInput" placeholder="오늘의 컨디션, 소감을 적어보세요..."></textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      ${recs.length>0?`<button class="bsm bshr" onclick="shareRecord('${key}')"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="13" r="1.5"/><circle cx="3" cy="8" r="1.5"/><line x1="10.6" y1="3.9" x2="4.4" y2="7.1"/><line x1="10.6" y1="12.1" x2="4.4" y2="8.9"/></svg> 공유</button>`:''}
      <button class="bsm bp" onclick="saveMemo('${key}')">저장</button>
    </div>`;
  }
  body.innerHTML=html;
}

function selEmo(btn,type){
  const group=btn.closest('.emotion-btns');
  group.querySelectorAll('.emo-btn').forEach(b=>b.classList.remove('sel-emo'));
  btn.classList.add('sel-emo');
  btn.dataset.type=type;
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
  }catch(e){ if(e.name!=='AbortError') showToast('공유를 취소했어요'); }
}
function saveMemo(key){
  const i=document.getElementById('memoInput');if(!i)return;
  const v=i.value.trim();
  const preBtn=document.querySelector('.emotion-btns .emo-btn.sel-emo[data-type="pre"]');
  const postBtn=document.querySelector('.emotion-btns .emo-btn.sel-emo[data-type="post"]');
  const preMood=preBtn?preBtn.textContent:'';
  const postMood=postBtn?postBtn.textContent:'';
  if(v||preMood||postMood) memos[key]={text:v,preMood,postMood};
  else delete memos[key];
  save();
  const hasR=records[key]&&records[key].length>0;
  const hasM=!!memos[key];
  document.getElementById('xBtn').style.display=(hasR||hasM)?'flex':'none';
  // 캘린더 전체 재렌더 대신 해당 날짜 dot만 업데이트
  updateCalDot(key);
  renderDB(key);
}

function updateCalDot(key){
  // 해당 날짜 셀 찾아서 dot만 갱신
  const cells=document.querySelectorAll('#calGrid .cc');
  const[y,m,d]=key.split('-');
  const day=parseInt(d);
  const fd=new Date(parseInt(y),parseInt(m)-1,1).getDay();
  const cellIdx=fd+day-1+7; // 요일 헤더 7개 이후
  const cell=cells[cellIdx];
  if(!cell)return;
  // 기존 dot 제거
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
    <div class="emotion-row"><div class="emotion-lbl">훈련 전 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn${preMood===e?' sel-emo':''}" onclick="selEmo(this,'pre')">${e}</button>`).join('')}</div></div>
    <div class="emotion-row"><div class="emotion-lbl">훈련 후 상태</div><div class="emotion-btns">${EMOTIONS.map(e=>`<button class="emo-btn${postMood===e?' sel-emo':''}" onclick="selEmo(this,'post')">${e}</button>`).join('')}</div></div>
    <textarea class="mi" id="memoInput">${eh(memo)}</textarea>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button class="bsm" onclick="renderDB('${key}')">취소</button>
      <button class="bsm bp" onclick="saveMemo('${key}')">저장</button>
    </div>`;
  document.getElementById('detailBody').innerHTML=html;
}
function delMemo(key){delete memos[key];save();renderCal();renderDB(key);}
function askDeleteDay(){if(!selDate)return;document.getElementById('detailBody').innerHTML=`<div class="cfmb"><div class="cfmm"><strong>${fl(selDate)}</strong>의<br>훈련 기록을 삭제하시겠습니까?</div><div class="cfmbs"><button class="bdng" onclick="confirmDel()">네</button><button onclick="selD('${selDate}')">아니오</button></div></div>`;}
function confirmDel(){delete records[selDate];delete memos[selDate];selDate=null;save();renderCal();updateCalSt();document.getElementById('detailTitle').textContent='날짜를 선택해 주세요';document.getElementById('detailBody').innerHTML='<div class="em">날짜를 클릭하면 기록과 메모를 확인할 수 있어요</div>';document.getElementById('xBtn').style.display='none';}
function changeMonth(dir){calMonth+=dir;if(calMonth<0){calMonth=11;calYear--;}if(calMonth>11){calMonth=0;calYear++;}selDate=null;renderCal();document.getElementById('detailTitle').textContent='날짜를 선택해 주세요';document.getElementById('detailBody').innerHTML='<div class="em">날짜를 클릭하면 기록과 메모를 확인할 수 있어요</div>';document.getElementById('xBtn').style.display='none';}
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

/* ── Wake Lock ── */
let wakeLock=null;
async function requestWakeLock(){if(!('wakeLock'in navigator))return;try{wakeLock=await navigator.wakeLock.request('screen');}catch(e){}}
async function releaseWakeLock(){if(wakeLock){try{await wakeLock.release();}catch(e){}wakeLock=null;}}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&running)requestWakeLock();});

load();
loadTree();
applyTheme(curTheme);
document.getElementById('modeProgram').className='mb'+(curMode==='program'?' active':'');
document.getElementById('modeManual').className='mb'+(curMode==='manual'?' active':'');
renderSBody();updateSum();
// 숨나무 초기 렌더
renderTree();

// 초기 유저바 표시 (훈련/기록 탭일 때만)
const _initPage = curPage||'train';
const _ub = document.getElementById('userBar');
if(_initPage==='train'||_initPage==='calendar'){ _ub.style.display='flex'; renderUserBar(); }
else{ _ub.style.display='none'; }
document.getElementById('circle').style.background=dGrad;
document.getElementById('remainDisplay').textContent=fmt(parseInt(document.getElementById('duration').value)*60);

/* 효과음 UI 초기화 */
setSound(soundOn);
renderSfxChips();
document.getElementById('sfxVol').value=sfxVolume;
document.getElementById('sfxVolVal').textContent=sfxVolume;
/* 배경음 UI 초기화 */
document.getElementById('bgmOn').className=bgmOn?'on':'off';
document.getElementById('bgmOff').className=bgmOn?'off':'on';
document.getElementById('bgmSection').style.display=bgmOn?'block':'none';
renderBgmChips();
document.getElementById('bgmVol').value=bgmVolume;
document.getElementById('bgmVolVal').textContent=bgmVolume;

/* 새로고침 시 마지막 페이지 복원 */
if(curPage&&curPage!=='train'){
  // 기록 탭이었을 경우 비로그인이면 훈련으로 대체 (로그인 후 처리)
  if(curPage==='calendar') {/* auth 상태 확인 후 처리 */}
  else showPage(curPage,null);
}

/* Firebase 데이터 비동기 로드 */
Promise.all([loadBanner(),loadNotices(),loadColumns(),loadGuide(),loadSounds()]).then(()=>{
  const ub=document.getElementById('userBar');
  if(ub.style.display!=='none') renderUserBar();

  // 딥링크 처리: ?col=칼럼ID 로 접근 시 해당 칼럼 바로 열기
  const params=new URLSearchParams(window.location.search);
  const colId=params.get('col');
  if(colId){
    const idx=_columns.findIndex(c=>c.id===colId);
    if(idx>=0){
      // 칼럼 탭으로 이동 후 해당 칼럼 열기
      showPage('column',null);
      setTimeout(()=>showColDetail(idx),100);
    }
  }
}).catch(e=>console.log('Firebase 로드 오류:',e));
