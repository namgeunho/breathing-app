/* ── init.js — Auth 상태 감지, 앱 초기화
   load order: 8번째 (마지막)
── */

/* ── Auth 상태 감지 (초기화 완료 후 등록) ── */
// redirect 로그인 결과 처리
auth.getRedirectResult().then(result=>{
  if(result&&result.user) closeAuthModal();
}).catch(e=>{ if(e.code) console.log('redirect 결과:',e.code); });

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
    if(ub&&(curPage==='train'||curPage==='calendar')){
      ub.style.display='flex';
      renderUserBar();
    }
    if(curPage==='config') renderConfigMain();
    // 로그인/로그아웃 모두 나무 상태 갱신
    renderTree();
  }catch(e){}
});

/* ── Analytics ── */
logEvent('app_open');
window.addEventListener('appinstalled',()=>{ logEvent('pwa_installed'); });
