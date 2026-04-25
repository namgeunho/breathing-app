// 기존 localStorage rec/memo 잔여 데이터 정리 (서버 전용으로 전환)
(function(){try{localStorage.removeItem('breath5_rec');localStorage.removeItem('breath5_memo');}catch(e){}})();
auth.getRedirectResult().then(result=>{
if(result && result.user){
closeAuthModal();
showToast('로그인됐어요! 🌿');
}
}).catch(e=>{
if(e.code && e.code !== 'auth/no-current-user'){
console.log('redirect 결과 에러:', e.code, e.message);
if(e.code !== 'auth/credential-already-in-use'){
showToast('로그인 중 오류가 발생했어요.');
}
}
});
auth.onAuthStateChanged(async user=>{
curUser=user;
if(user){
if(!userName||userName==='사용자') userName=user.displayName||'사용자';
await syncUserData();
if(curPage==='calendar') showPage('calendar',null);
}
try{
const ub=document.getElementById('userBar');
if(ub&&curPage==='calendar'){
ub.style.display='flex';
renderUserBar();
} else if(ub){
ub.style.display='none';
}
if(curPage==='config') renderConfigMain();
renderTree();
}catch(e){}
});
logEvent('app_open');
window.addEventListener('appinstalled',()=>{ logEvent('pwa_installed'); });