/* ── app_core.js — save/load, 유틸, 설정, 유저바, 렌더링
   load order: 3번째
── */

function save(){
  try{
    localStorage.setItem(LS+'pp',JSON.stringify(presets));localStorage.setItem(LS+'mode',curMode);localStorage.setItem(LS+'pi',selPI);localStorage.setItem(LS+'dur',document.getElementById('duration').value);localStorage.setItem(LS+'rec',JSON.stringify(records));localStorage.setItem(LS+'memo',JSON.stringify(memos));localStorage.setItem(LS+'name',userName);localStorage.setItem(LS+'ms',JSON.stringify(manSt));if(userPhoto&&!userPhoto.startsWith('http'))localStorage.setItem(LS+'photo',userPhoto);else localStorage.removeItem(LS+'photo');localStorage.setItem(LS+'theme',curTheme);localStorage.setItem(LS+'sfx',curSfx);localStorage.setItem(LS+'bgmOn',bgmOn?'1':'0');localStorage.setItem(LS+'bgm',curBgm);localStorage.setItem(LS+'page',curPage);localStorage.setItem(LS+'sfxVol',sfxVolume);localStorage.setItem(LS+'bgmVol',bgmVolume);
  }catch(e){}
  if(curUser){
    clearTimeout(save._t);
    save._t=setTimeout(saveUserData, 2000);
  }
}
function load(){try{
  // 프리셋 버전 체크 — 이름이 바뀐 경우 기본값으로 초기화
  const pp=localStorage.getItem(LS+'pp');
  if(pp){
    const saved=JSON.parse(pp);
    // 저장된 프리셋 이름이 새 기본값과 다르면 초기화
    const newNames=defPresets.map(p=>p.name).join(',');
    const savedNames=saved.map(p=>p.name).join(',');
    if(savedNames===newNames) presets=saved;
    // 이름이 다르면 defPresets 유지 (초기화)
  }
  const m=localStorage.getItem(LS+'mode');if(m)curMode=m;
  const pi=localStorage.getItem(LS+'pi');if(pi!==null)selPI=parseInt(pi);
  if(selPI<0)selPI=0; // 최소 0 보장
  const d=localStorage.getItem(LS+'dur');if(d){document.getElementById('duration').value=d;document.getElementById('durationVal').textContent=d+'분';}
  const r=localStorage.getItem(LS+'rec');if(r)records=JSON.parse(r);
  const mo=localStorage.getItem(LS+'memo');if(mo)memos=JSON.parse(mo);
  const n=localStorage.getItem(LS+'name');if(n)userName=n;
  const ms=localStorage.getItem(LS+'ms');if(ms)Object.assign(manSt,JSON.parse(ms));
  const ph=localStorage.getItem(LS+'photo');if(ph)userPhoto=ph;
  const th=localStorage.getItem(LS+'theme');if(th)curTheme=th;
  const sfx=localStorage.getItem(LS+'sfx');if(sfx)curSfx=sfx;
  const bOn=localStorage.getItem(LS+'bgmOn');if(bOn)bgmOn=bOn==='1';
  const bgm=localStorage.getItem(LS+'bgm');if(bgm)curBgm=bgm;
  const pg=localStorage.getItem(LS+'page');if(pg)curPage=pg;
  const sv=localStorage.getItem(LS+'sfxVol');if(sv)sfxVolume=parseInt(sv);
  const bv=localStorage.getItem(LS+'bgmVol');if(bv)bgmVolume=parseInt(bv);
}catch(e){}}

function fmt(s){const m=Math.floor(s/60),ss=Math.floor(s%60);return m+':'+(ss<10?'0':'')+ss;}
function today(){const d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());}
function p2(n){return String(n).padStart(2,'0');}
function dk(y,m,d){return y+'-'+p2(m+1)+'-'+p2(d);}
function nt(){const n=new Date();return n.getHours()+':'+p2(n.getMinutes());}
function fl(key){const[y,m,d]=key.split('-');return y+'년 '+parseInt(m)+'월 '+parseInt(d)+'일';}
function eh(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function applyTheme(t){curTheme=t;document.body.setAttribute('data-theme',t);}
function calcStreak(){let s=0;const t=new Date();for(let i=0;i<365;i++){const d=new Date(t);d.setDate(d.getDate()-i);const k=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());if(records[k]&&records[k].length>0)s++;else break;}return s;}

/* ── 레벨 계산 (한 단계 강등 방식) ──
   7일 이상 미훈련 시 최고 달성 레벨에서 1단계 강등 (최저 레벨0)
   강등 이후 재훈련 시 현재 연속일 기준으로 다시 상승 가능
*/
function getMaxAchievedLv(){
  // 전체 기록에서 최장 연속 달성일을 기반으로 최고 레벨 계산
  try{
    const saved = localStorage.getItem(LS+'maxLv');
    if(saved !== null) return parseInt(saved);
  }catch(e){}
  return 0;
}
function updateMaxLv(lv){
  try{
    const cur = getMaxAchievedLv();
    if(lv > cur) localStorage.setItem(LS+'maxLv', lv);
  }catch(e){}
}

function calcLv(s){
  const LV_DEF = [
    {lv:0, name:'레벨 0', desc:`레벨1까지 ${10-s}일`, next:10,  fill:'#888780', cls:'lv0'},
    {lv:1, name:'레벨 1', desc:`레벨2까지 ${20-s}일`, next:20,  fill:'#185fa5', cls:'lv1'},
    {lv:2, name:'레벨 2', desc:`레벨3까지 ${40-s}일`, next:40,  fill:'#639922', cls:'lv2'},
    {lv:3, name:'레벨 3', desc:`레벨4까지 ${80-s}일`, next:80,  fill:'#BA7517', cls:'lv3'},
    {lv:4, name:'레벨 4', desc:'마스터!',              next:null, fill:'linear-gradient(90deg,#7F77DD,#D4537E)', cls:'lv4'},
  ];

  // 현재 연속일 기준 자연 레벨
  let naturalLv = 0;
  if(s >= 80) naturalLv = 4;
  else if(s >= 40) naturalLv = 3;
  else if(s >= 20) naturalLv = 2;
  else if(s >= 10) naturalLv = 1;

  // 최고 달성 레벨 갱신
  updateMaxLv(naturalLv);

  // 마지막 훈련일 확인
  const t = new Date(); let lastGap = 999;
  for(let i=0;i<365;i++){
    const d=new Date(t);d.setDate(d.getDate()-i);
    const k=d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
    if(records[k]&&records[k].length>0){lastGap=i;break;}
  }

  // 7일 이상 미훈련: 최고 달성 레벨에서 1단계 강등
  if(lastGap >= 7){
    const maxLv = getMaxAchievedLv();
    const demotedLv = Math.max(0, maxLv - 1);
    const def = LV_DEF[demotedLv];
    return {
      ...def,
      lv: demotedLv,
      desc: `${demotedLv < maxLv ? `강등됨 (최고 레벨${maxLv})` : '훈련을 재개해보세요'}`,
      demoted: true,
    };
  }

  // 정상 레벨 반환
  const def = LV_DEF[naturalLv];
  return {
    ...def,
    lv: naturalLv,
    desc: naturalLv === 4 ? '마스터!' :
          naturalLv === 3 ? `레벨4까지 ${80-s}일` :
          naturalLv === 2 ? `레벨3까지 ${40-s}일` :
          naturalLv === 1 ? `레벨2까지 ${20-s}일` :
                            `레벨1까지 ${10-s}일`,
  };
}
function avHtml(sz,fsz,fb){if(userPhoto)return`<img src="${userPhoto}" alt="" style="width:${sz}px;height:${sz}px;border-radius:50%;object-fit:cover;">`;return`<span style="font-size:${fsz}px;">${eh(fb)}</span>`;}
function renderUserBar(){
  const s=calcStreak();const lv=calcLv(s);const ini=userName.substring(0,2);
  const lvSt={lv0:'background:var(--bg2);color:var(--text2)',lv1:'background:#e6f1fb;color:#185fa5',lv2:'background:#eaf3de;color:#3b6d11',lv3:'background:#faeeda;color:#854f0b',lv4:'background:linear-gradient(90deg,#7F77DD,#D4537E);color:#fff'};
  const nxt=lv.next?`목표 ${lv.next}일`:'최고 등급';
  const authBtn=curUser
    ? `<button class="ub-login-btn" onclick="signOut()"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 8H2M6 5l-3 3 3 3"/><path d="M6 2h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6"/></svg>로그아웃</button>`
    : `<button class="ub-login-btn" onclick="openAuthModal()"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8h8M10 5l3 3-3 3"/><path d="M10 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h6"/></svg>로그인</button>`;
  document.getElementById('userBar').innerHTML=`<div class="uba">${avHtml(28,11,ini)}</div><div class="ubi"><div class="ubn">${eh(userName)}</div></div><div class="ubd"></div><div class="ubi"><div class="ubv">${s}일</div><div class="ubl">연속 달성</div></div><div class="ubd"></div><div class="ubi"><span class="ubb" style="${lvSt[lv.cls]||lvSt.lv0}">${lv.name}</span><div class="ubl" style="margin-top:2px;">${nxt}</div></div>${authBtn}`;
}

function renderConfigMain(){const s=calcStreak();const lv=calcLv(s);const ini=userName.substring(0,2);document.getElementById('configMain').innerHTML=`
  <div class="pfc">
    <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;"><div class="av">${avHtml(56,22,ini)}</div><div><div style="font-size:17px;font-weight:500;color:var(--text);margin-bottom:6px;">${eh(userName)}</div><span class="lvb ${lv.cls}">${lv.name}</span>${curUser?`<div style="font-size:11px;color:var(--text3);margin-top:4px;">☁️ 클라우드 저장 중</div>`:''}</div></div>
    <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text2);"><span>연속 달성 ${s}일${lv.next?' / 목표 '+lv.next+'일':''}</span><span>${lv.desc}</span></div>
    ${lv.next?`<div class="lpb"><div class="lpf" style="width:${Math.min(100,Math.round((s/lv.next)*100))}%;background:${lv.fill};"></div></div>`:''}
    ${!curUser
      ? `<button class="auth-btn-google" style="margin-top:14px;" onclick="openAuthModal()"><svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Google로 로그인하기</button>`
      : `<button class="cfg-signout-btn" onclick="signOut()"><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 8H2M6 5l-3 3 3 3"/><path d="M6 2h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H6"/></svg>로그아웃</button>`
    }
  </div>

  <div class="cfg-group-label">앱 설정</div>
  <div class="dp">
    <div class="ci2" onclick="showSub('guide')"><div class="cil"><div class="cic" style="background:var(--info-bg);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--info)" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><line x1="8" y1="7" x2="8" y2="11"/><circle cx="8" cy="5" r="0.5" fill="var(--info)" stroke="none"/></svg></div><div><div class="clb">이용가이드</div><div class="csb">앱 사용 방법 안내</div></div></div><div class="car">›</div></div>
    <div class="ci2" onclick="showSub('install')"><div class="cil"><div class="cic" style="background:var(--bg2);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--text2)" stroke-width="1.5"><rect x="3" y="1" width="10" height="14" rx="2"/><line x1="8" y1="12" x2="8" y2="12.1" stroke-linecap="round" stroke-width="2"/></svg></div><div><div class="clb">홈화면에 추가</div><div class="csb">앱으로 설치하기</div></div></div><div class="car">›</div></div>
    <div class="ci2" onclick="showSub('theme')" style="border-bottom:none;"><div class="cil"><div class="cic" style="background:var(--bg2);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--text2)" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M8 2v6l4 2" stroke-width="1.5"/></svg></div><div><div class="clb">테마</div><div class="csb">${curTheme==='black'?'블랙 모드':'화이트 모드'}</div></div></div><div class="car">›</div></div>
  </div>

  <div class="cfg-group-label">내 정보</div>
  <div class="dp">
    <div class="ci2" onclick="showSub('profile')"><div class="cil"><div class="cic" style="background:var(--success-bg);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--success)" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/></svg></div><div><div class="clb">사용자 정보</div><div class="csb">${eh(userName)}</div></div></div><div class="car">›</div></div>
    <div class="ci2" onclick="showSub('grade')" style="border-bottom:none;"><div class="cil"><div class="cic" style="background:var(--warning-bg);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--warning)" stroke-width="1.5"><polygon points="8,2 10,6 14,6.5 11,9.5 11.5,14 8,12 4.5,14 5,9.5 2,6.5 6,6"/></svg></div><div><div class="clb">등급</div><div class="csb">${lv.name} · ${TREE_STAGES[treeData.stage-1]?TREE_STAGES[treeData.stage-1].name:'숨씨앗'}</div></div></div><div class="car">›</div></div>
  </div>

  <div class="cfg-group-label">고객지원</div>
  <div class="dp">
    <div class="ci2" onclick="showSub('notice')"><div class="cil"><div class="cic" style="background:var(--danger-bg);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--danger)" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="2"/><line x1="5" y1="6" x2="11" y2="6"/><line x1="5" y1="9" x2="9" y2="9"/></svg></div><div><div class="clb">공지사항</div><div class="csb">${_notices.length?_notices.length+'개의 공지':'최신 공지를 확인하세요'}</div></div></div><div class="car">›</div></div>
    <div class="ci2" onclick="showSub('cs')" style="border-bottom:none;"><div class="cil"><div class="cic" style="background:var(--success-bg);"><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--success)" stroke-width="1.5"><path d="M8 1a7 7 0 1 0 7 7"/><path d="M11 5a3 3 0 0 1-3 3"/><circle cx="13" cy="3" r="1.5" fill="var(--success)" stroke="none"/></svg></div><div><div class="clb">고객센터</div><div class="csb">문의 및 피드백</div></div></div><div class="car">›</div></div>
  </div>

  <button class="invite-btn" onclick="inviteFriend()">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="6" cy="5" r="3"/><path d="M1 14c0-3 2.2-5 5-5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
    친구에게 BRETHIN 추천하기
  </button>`;}

function showSub(menu){
  document.getElementById('configMain').style.display='none';
  document.getElementById('configSub').style.display='block';
  const sub=document.getElementById('configSub');
  const back=`<button class="cbk" onclick="closeSub()"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="10,3 4,8 10,13"/></svg> 설정</button>`;
  if(menu==='guide'){
    const html=_guide
      ? `<div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:1rem;">이용가이드</div><div class="notice-body" style="line-height:1.8;">${renderContent(_guide.content)}</div>`
      : `<div class="nb"><div style="font-size:32px;margin-bottom:12px;">📖</div><div style="font-size:16px;font-weight:500;color:var(--text);margin-bottom:6px;">이용가이드</div><div style="font-size:13px;color:var(--text2);line-height:1.6;">아직 등록된 이용가이드가 없습니다.</div></div>`;
    sub.innerHTML=back+html;
  } else if(menu==='profile'){
    const ini=userName.substring(0,2);
    sub.innerHTML=back+`
    <div class="dp" style="margin-bottom:14px;">
      <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:1rem;">사용자 정보</div>
      <div class="pua">
        <div class="ppv" id="ppv" onclick="triggerPhoto()">${avHtml(64,24,ini)}</div>
        <div class="pur"><div class="pud">사진을 탭하거나 버튼으로 변경하세요</div>
        <div class="pub"><button class="pbtn" onclick="triggerPhoto()">사진 변경</button>${userPhoto?`<button class="pbtn pdel" onclick="deletePhoto()">삭제</button>`:''}</div></div>
      </div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:4px;">닉네임</div>
      <input class="ni" id="nameInput" value="${eh(userName)}" maxlength="20" placeholder="닉네임을 입력하세요">
      <div style="font-size:11px;color:var(--text3);margin-top:6px;">로그인 전후 동일하게 유지됩니다.</div>
      <div style="display:flex;justify-content:flex-end;margin-top:12px;">
        <button class="bp bsm" onclick="saveName()">저장</button>
      </div>
    </div>

    <div class="cfg-group-label">데이터 관리</div>
    <div class="dp">
      <div class="ci2" onclick="confirmResetData()">
        <div class="cil">
          <div class="cic" style="background:var(--warning-bg);">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--warning)" stroke-width="1.5"><polyline points="1,4 1,1 4,1"/><path d="M1 4A7 7 0 1 1 2.5 9"/></svg>
          </div>
          <div><div class="clb">모든 정보 초기화</div><div class="csb">훈련 기록·메모·설정 전부 삭제</div></div>
        </div>
        <div class="car" style="color:var(--warning);">›</div>
      </div>
      <div class="ci2" style="border-bottom:none;" onclick="confirmWithdraw()">
        <div class="cil">
          <div class="cic" style="background:var(--danger-bg);">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--danger)" stroke-width="1.5"><circle cx="8" cy="5" r="3"/><path d="M2 14c0-3 2.7-5 6-5s6 2 6 5"/><line x1="12" y1="4" x2="14" y2="6"/><line x1="14" y1="4" x2="12" y2="6"/></svg>
          </div>
          <div><div class="clb" style="color:var(--danger);">회원 탈퇴</div><div class="csb">계정 및 모든 데이터 영구 삭제</div></div>
        </div>
        <div class="car" style="color:var(--danger);">›</div>
      </div>
    </div>`;
  } else if(menu==='grade'){
    const s=calcStreak();const lv=calcLv(s);
    const lvList=[{n:0,l:'레벨 0',r:'0~9일',c:'#888780'},{n:1,l:'레벨 1',r:'10일~',c:'#185fa5'},{n:2,l:'레벨 2',r:'20일~',c:'#639922'},{n:3,l:'레벨 3',r:'40일~',c:'#BA7517'},{n:4,l:'레벨 4',r:'80일~',c:'#7F77DD'}];
    // 숨나무 현재 단계
    const treeSt = TREE_STAGES[treeData.stage-1];
    const treeNextSt = TREE_STAGES[treeData.stage] || null;
    const treePct = treeNextSt
      ? Math.min(100, Math.round(((treeData.tp - treeSt.tpReq) / (treeNextSt.tpReq - treeSt.tpReq)) * 100))
      : 100;
    sub.innerHTML=back+`
    <div class="pfc" style="margin-bottom:1rem;">
      <div style="font-size:14px;color:var(--text2);margin-bottom:8px;">연속 달성 ${s}일 · ${lv.desc}</div>
      ${lv.demoted?`<div style="font-size:12px;color:var(--danger);background:var(--danger-bg);padding:8px 12px;border-radius:8px;margin-bottom:10px;">⚠️ 7일 이상 미훈련으로 한 단계 강등됐습니다. 오늘 훈련을 재개해보세요!</div>`:''}
      ${lv.next?`<div class="lpb"><div class="lpf" style="width:${Math.min(100,Math.round((s/lv.next)*100))}%;background:${lv.fill};"></div></div>`:''}
    </div>
    <div class="dp" style="margin-bottom:1.5rem;">
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px;">7일 이상 미훈련 시 최고 레벨에서 한 단계 강등됩니다.</div>
      ${lvList.map(l=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid var(--bd);"><div style="display:flex;align-items:center;gap:10px;"><div style="width:10px;height:10px;border-radius:50%;background:${l.c};"></div><div><div style="font-size:14px;font-weight:500;color:var(--text);">${l.l}</div><div style="font-size:12px;color:var(--text2);">연속 ${l.r}</div></div></div>${lv.lv===l.n?`<span style="font-size:12px;padding:3px 10px;border-radius:20px;background:var(--info-bg);color:var(--info);">현재</span>`:''}</div>`).join('')}
    </div>
    <div class="cfg-group-label">숨나무 등급</div>
    <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:14px 16px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <div>
          <div style="font-size:16px;font-weight:600;color:${treeSt.color};">${treeSt.name}</div>
          <div style="font-size:11px;color:var(--text3);font-family:'JetBrains Mono',monospace;margin-top:2px;">${treeSt.en}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:600;color:var(--text);">${treeData.tp.toLocaleString()} TP</div>
          <div style="font-size:11px;color:var(--text3);">${treeNextSt ? `다음까지 ${(treeNextSt.tpReq-treeData.tp).toLocaleString()} TP` : '최고 단계'}</div>
        </div>
      </div>
      <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden;">
        <div style="height:100%;width:${treePct}%;background:${treeSt.color};border-radius:2px;transition:width .6s;"></div>
      </div>
      ${treeNextSt?`<div style="font-size:11px;color:var(--text3);margin-top:6px;">다음 단계: <span style="color:${treeNextSt.color};">${treeNextSt.name}</span> (연속 ${treeNextSt.reqDay}일+ · ${treeNextSt.reqMin}분+)</div>`:''}
    </div>
    <div class="dp">
      <div style="font-size:13px;color:var(--text2);margin-bottom:12px;">숨나무는 꾸준한 훈련으로 성장합니다.</div>
      ${TREE_STAGES.map(st=>`
        <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid var(--bd);">
          <div style="display:flex;align-items:center;gap:10px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${st.color};flex-shrink:0;"></div>
            <div>
              <div style="font-size:14px;font-weight:500;color:${treeData.stage>=st.id?st.color:'var(--text2)'};">${st.name}</div>
              <div style="font-size:11px;color:var(--text3);">${st.tpReq===0?'시작':st.tpReq.toLocaleString()+' TP'}${st.reqDay?` · 연속 ${st.reqDay}일+`:''}</div>
            </div>
          </div>
          ${treeData.stage===st.id?`<span style="font-size:12px;padding:3px 10px;border-radius:20px;background:var(--info-bg);color:var(--info);">현재</span>`:treeData.stage>st.id?`<span style="font-size:12px;color:var(--text3);">✓ 달성</span>`:''}
        </div>`).join('')}
    </div>`;
  } else if(menu==='theme'){
    sub.innerHTML=back+`<div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:1rem;">테마 선택</div>
      <div class="theme-grid">
        <div class="theme-card${curTheme==='white'?' act-t':''}" id="tw" onclick="selTheme('white')">
          <div class="tp tp-w"><div class="tp-circle"></div><div style="display:flex;flex-direction:column;gap:3px;"><div class="tp-bar"></div><div class="tp-bar" style="width:26px;"></div></div></div>
          <div class="theme-name">화이트</div><div class="theme-desc">밝고 깔끔한 모드</div>
        </div>
        <div class="theme-card${curTheme==='black'?' act-t':''}" id="tb" onclick="selTheme('black')">
          <div class="tp tp-b"><div class="tp-circle"></div><div style="display:flex;flex-direction:column;gap:3px;"><div class="tp-bar"></div><div class="tp-bar" style="width:26px;"></div></div></div>
          <div class="theme-name">블랙</div><div class="theme-desc">다크 그레이 모드</div>
        </div>
      </div>`;
  } else if(menu==='notice'){
    sub.innerHTML=back+`<div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:1rem;">공지사항</div>`+renderNoticesHtml();
  } else if(menu==='install'){
    sub.innerHTML=back+`<div class="is"><div class="it">안드로이드 설치</div><div class="id">Chrome 브라우저에서 아래 버튼을 눌러 홈화면에 바로 추가할 수 있어요.</div><button class="ibt" id="androidBtn" onclick="triggerInstall()">홈화면에 추가하기</button><div style="margin-top:10px;font-size:12px;color:var(--text2);">비활성 상태라면 Chrome 메뉴(⋮) → "홈 화면에 추가"를 눌러주세요.</div></div><div class="is"><div class="it">아이폰 설치 방법</div><div class="id">Safari 브라우저에서 아래 순서대로 진행해 주세요.</div><div class="istep"><div class="isn">1</div><div class="ist">Safari에서 이 페이지를 열어주세요</div></div><div class="istep"><div class="isn">2</div><div class="ist">하단 <span>공유 버튼 (□↑)</span> 을 탭하세요</div></div><div class="istep"><div class="isn">3</div><div class="ist"><span>홈 화면에 추가</span> 를 탭하세요</div></div><div class="istep"><div class="isn">4</div><div class="ist">오른쪽 상단 <span>추가</span> 버튼을 탭하면 완료!</div></div></div>`;
    const btn=document.getElementById('androidBtn');if(!deferredInstall){btn.disabled=true;btn.textContent='Chrome에서 접속해 주세요';}
  } else if(menu==='cs'){
    sub.innerHTML=back+`
    <div style="font-size:15px;font-weight:500;color:var(--text);margin-bottom:1rem;">고객센터</div>
    <div class="dp" style="margin-bottom:14px;">
      <div class="ci2" onclick="window.location.href='mailto:support@brethin.app'">
        <div class="cil">
          <div class="cic" style="background:var(--info-bg);">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="var(--info)" stroke-width="1.5"><rect x="1" y="3" width="14" height="10" rx="2"/><polyline points="1,4 8,9 15,4"/></svg>
          </div>
          <div><div class="clb">이메일 문의</div><div class="csb">support@brethin.app</div></div>
        </div>
        <div class="car">›</div>
      </div>
      <div class="ci2" style="border-bottom:none;" onclick="window.open('https://open.kakao.com/','_blank')">
        <div class="cil">
          <div class="cic" style="background:#FEE500;border-radius:8px;">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="#3A1D1D" stroke="none"><path d="M8 1.5C4.134 1.5 1 4.02 1 7.1c0 1.92 1.14 3.61 2.87 4.67l-.73 2.72a.3.3 0 0 0 .44.34L6.7 12.8A8.3 8.3 0 0 0 8 12.7c3.866 0 7-2.52 7-5.6S11.866 1.5 8 1.5z"/></svg>
          </div>
          <div><div class="clb">카카오톡 문의</div><div class="csb">카카오 채널 바로가기</div></div>
        </div>
        <div class="car">›</div>
      </div>
    </div>
    <div class="dp">
      <div style="padding:14px 0 10px;">
        <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px;">앱 버전</div>
        <div style="font-size:13px;color:var(--text2);">BRETHIN v1.0.0</div>
      </div>
      <div style="padding:10px 0;border-top:0.5px solid var(--bd);">
        <div style="font-size:14px;font-weight:500;color:var(--text);margin-bottom:6px;">운영 시간</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.7;">평일 10:00 ~ 18:00<br>주말 및 공휴일 제외</div>
      </div>
    </div>`;
  }
}
function selTheme(t){applyTheme(t);save();document.querySelectorAll('.theme-card').forEach(c=>c.classList.remove('act-t'));const el=document.getElementById(t==='white'?'tw':'tb');if(el)el.classList.add('act-t');renderConfigMain();}
function closeSub(){document.getElementById('configMain').style.display='block';document.getElementById('configSub').style.display='none';renderConfigMain();}
function triggerPhoto(){document.getElementById('photoFileInput').click();}
function handlePhotoUpload(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{userPhoto=ev.target.result;save();renderUserBar();const p=document.getElementById('ppv');if(p)p.innerHTML=`<img src="${userPhoto}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;">`;};r.readAsDataURL(f);e.target.value='';}
function deletePhoto(){userPhoto=null;save();renderUserBar();}
function saveName(){const i=document.getElementById('nameInput');if(!i)return;const v=i.value.trim();if(v){userName=v;save();renderUserBar();closeSub();}}
async function triggerInstall(){if(!deferredInstall)return;deferredInstall.prompt();const r=await deferredInstall.userChoice;if(r.outcome==='accepted')deferredInstall=null;}

/* ── Audio ── */