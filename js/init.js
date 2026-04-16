/* ── init.js — Auth 상태 감지, 앱 초기화
   load order: 8번째 (마지막)
── */

/* ── Auth 상태 감지 (초기화 완료 후 등록) ── */
// redirect 로그인 결과 처리 — 모바일에서 Google 페이지 후 돌아왔을 때
auth.getRedirectResult().then(result=>{
  if(result && result.user){
    closeAuthModal();
    showToast('로그인됐어요! 🌿');
  }
}).catch(e=>{
  if(e.code && e.code !== 'auth/no-current-user'){
    console.log('redirect 결과 에러:', e.code, e.message);
    // credential 에러는 무시 (정상 흐름)
    if(e.code !== 'auth/credential-already-in-use'){
      showToast('로그인 중 오류가 발생했어요.');
    }
  }
});

auth.onAuthStateChanged(user=>{
  curUser=user;
  if(user){
    if(!userName||userName==='사용자') userName=user.displayName||'사용자';
    if(!userPhoto&&user.photoURL) userPhoto=user.photoURL;
    syncUserData();
    if(curPage==='calendar') showPage('calendar',null);
  }
  // DOM 안전하게 접근
  try{
    const ub=document.getElementById('userBar');
    if(ub&&curPage==='calendar'){
      ub.style.display='flex';
      renderUserBar();
    } else if(ub){
      ub.style.display='none';
    }
    if(curPage==='config') renderConfigMain();
    // 로그인/로그아웃 모두 나무 상태 갱신
    renderTree();
  }catch(e){}
});

/* ── Analytics ── */
logEvent('app_open');
window.addEventListener('appinstalled',()=>{ logEvent('pwa_installed'); });
