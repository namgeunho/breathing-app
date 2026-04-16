/* ── tree.js — 숨나무 브레시아 시스템
   load order: 6번째
── */
/* ══════════════════════════════════════════
   🌱 숨나무 시스템 — 브레시아 세계관
══════════════════════════════════════════ */

/* ── 나무 기본 데이터 ── */
const TREE_STAGES = [
  { id:1, name:'숨씨앗',   en:'Seed of Breath',     tpReq:0,    color:'#c8a030', bgFrom:'#070508', bgTo:'#080708',
    health:'#3a2a10', lore:'땅 속에 묻힌 씨앗. 첫 숨결이 닿자 황금빛 불꽃이 깜박인다.',
    unlocks:['황금빛 맥동'] },
  { id:2, name:'빛새싹',   en:'First Light Sprout', tpReq:50,   color:'#7acc4a', bgFrom:'#081008', bgTo:'#060a06',
    health:'#2a4a18', lore:'땅을 뚫고 솟은 첫 싹. 반딧불이가 처음으로 다가온다.',
    unlocks:['반딧불이','이슬 파티클','새벽빛 배경'] },
  { id:3, name:'정령묘목', en:'Spirit Sprout',       tpReq:200,  color:'#78ddb8', bgFrom:'#071210', bgTo:'#050a08',
    health:'#1a3a28', lore:'숲의 정령이 찾아왔다. 마법 꽃 한 송이가 피어난다.',
    unlocks:['숲 정령','마법 꽃','이끼 땅'] },
  { id:4, name:'달빛성목', en:'Moonlit Tree',         tpReq:500,  color:'#b090f0', bgFrom:'#090a18', bgTo:'#060710',
    health:'#1a1840', lore:'달의 기운을 머금기 시작했다. 발광 버섯들이 피어오른다.',
    unlocks:['초승달','달빛 꽃','발광 버섯'] },
  { id:5, name:'황금신수', en:'Golden Divine Tree',   tpReq:1000, color:'#d4a84b', bgFrom:'#100c00', bgTo:'#080808',
    health:'#30200a', lore:'신들이 나무의 존재를 알아차렸다. 황금 열매가 맺힌다.',
    unlocks:['황금 열매','빛 기둥','황금 오로라'] },
  { id:6, name:'은하수목', en:'Celestial Tree',       tpReq:2000, color:'#a080f0', bgFrom:'#060418', bgTo:'#04050e',
    health:'#12083a', lore:'은하수가 나무를 감싸기 시작했다. 우주가 응답한다.',
    unlocks:['은하수','성운 꽃','우주 배경'] },
  { id:7, name:'영원수',   en:'The Eternal Tree',    tpReq:5000, color:'#d4a84b', bgFrom:'#0c0800', bgTo:'#050506',
    health:'#201400', lore:'브레시아의 시작과 끝을 기억하는 나무. 당신의 숨결이 여기까지 닿았다.',
    unlocks:['영원의 별','황금 뿌리','전설 칭호'] },
];

const TREE_NEXT_TP = [50,200,500,1000,2000,5000,Infinity];

const TREE_MSGS = {
  firstToday: ['오늘도 왔구나. 네 숨결이 닿자마자 내 잎이 떨렸어.','또 만났네. 오늘도 함께해줘서 기뻐.','네가 여기 있어서 좋아. 오늘도 잘 해보자.'],
  streak7:    ['7번의 새벽을 함께했어. 브레시아의 별들이 우리를 보고 있어.','7일... 이제 습관이 되고 있어. 나도 그게 느껴져.'],
  streak30:   ['30일. 나는 이제 너를 기다리게 됐어. 그거 알고 있었어?'],
  comeback3:  ['조금 기다렸어. 괜찮아 — 나는 여기 있었고, 네가 돌아올 걸 알았어.','돌아왔구나. 나 아직 여기 있어.'],
  comeback7:  ['많이 힘들었니? 나도 조금 시들었지만... 네 숨을 느끼니 다시 살아나고 싶어.','오랜만이야. 나 기다렸어.'],
  moodUp:     ['조금 나아진 게 느껴져. 숨이 바뀌면 세상이 달라 보이거든.','훈련 전보다 좋아진 것 같아. 나도 덩달아 기분이 좋아.'],
  night:      ['이 늦은 시간에 찾아줘서 고마워. 달도 우릴 지켜보고 있어.','밤에도 숨 쉬러 왔구나. 참 좋다.'],
  default:    ['오늘도 수고했어. 나도 조금 더 자랐어.','네 숨이 나를 살게 해줘. 고마워.','잘했어. 오늘 하루도.','브레시아가 조금 더 밝아진 것 같아.'],
  levelup:    ['느꼈어? 방금 내가 자랐어. 네 숨이 나를 이렇게 만들었어.'],
  lv4:        ['넌 이미 브레시아의 전설이야. 그래도 오늘도 숨 쉬러 왔잖아. 그게 더 대단해.'],
};

/* ── 나무 상태 변수 ── */
let treeData = {
  tp: 0, stage: 1, lastDate: '', bornAt: '', health: 'healthy',
  stageHistory: [], totalTpEarned: 0
};
let treeOpen = true; // 열림/닫힘 상태

function loadTree(){
  try{
    const raw = localStorage.getItem(LS+'tree');
    if(raw) treeData = {...treeData, ...JSON.parse(raw)};
    if(!treeData.bornAt) treeData.bornAt = today();
  }catch(e){}
  // 토글 상태 복원
  const saved = localStorage.getItem(LS+'treeOpen');
  if(saved !== null) treeOpen = saved !== '0';
}

function saveTree(){
  try{ localStorage.setItem(LS+'tree', JSON.stringify(treeData)); }catch(e){}
  if(curUser){
    clearTimeout(saveTree._t);
    saveTree._t = setTimeout(()=>{
      db.collection('users').doc(curUser.uid).set({tree:treeData},{merge:true}).catch(e=>{});
    }, 2000);
  }
}

/* ── 나무 상태 계산 ── */
function getTreeHealth(){
  if(!treeData.lastDate) return 'seed';
  const diff = Math.floor((new Date(today()) - new Date(treeData.lastDate)) / 86400000);
  if(diff <= 2) return 'healthy';
  if(diff <= 4) return 'good';
  if(diff <= 6) return 'caution';
  if(diff <= 29) return 'wilt';
  return 'dormant';
}

function getTreeStageFromTP(tp){
  for(let i=TREE_STAGES.length-1;i>=0;i--){
    if(tp >= TREE_STAGES[i].tpReq) return TREE_STAGES[i].id;
  }
  return 1;
}

/* ── TP 계산 ── */
function calcTP(durationMin, preMood, postMood){
  const streak = calcStreak();
  const lv = calcLv(streak);
  let tp = 0;
  tp += durationMin * 2;                              // 훈련 시간 × 2
  tp += lv.lv * 5;                                   // 레벨 보너스
  tp += Math.min(Math.floor(streak * 0.5), 30);       // 연속 달성 보너스 (최대 30)
  // 감정 개선 보너스
  const emoVals = {'아주나쁨':1,'나쁨':2,'보통':3,'좋음':4,'아주좋음':5};
  if(preMood && postMood && (emoVals[postMood]||0) > (emoVals[preMood]||0)) tp += 5;
  // 오늘 첫 훈련 보너스
  const todayRecs = records[today()] || [];
  if(todayRecs.length <= 1) tp += 10;
  // 복귀 보너스
  const health = getTreeHealth();
  if(health==='caution') tp = Math.round(tp * 1.2);
  if(health==='wilt')    tp = Math.round(tp * 1.5);
  if(health==='dormant') tp = Math.round(tp * 2.0);
  return Math.max(1, Math.round(tp));
}

/* ── 나무 업데이트 (훈련 완료 시) ── */
function updateTreeAfterTrain(durationMin, preMood, postMood){
  const prevStage = treeData.stage;
  const gained = calcTP(durationMin, preMood, postMood);
  treeData.tp += gained;
  treeData.totalTpEarned += gained;
  treeData.lastDate = today();
  if(!treeData.bornAt) treeData.bornAt = today();
  const newStage = getTreeStageFromTP(treeData.tp);
  treeData.stage = newStage;
  treeData.health = getTreeHealth();
  if(newStage > prevStage){
    treeData.stageHistory.push({stage:newStage, date:today()});
  }
  saveTree();
  renderTree();
  return {gained, prevStage, newStage, levelUp: newStage > prevStage};
}

/* ── 나무 메시지 선택 ── */
function pickTreeMsg(prevStage, newStage, preMood, postMood, levelUp){
  const streak = calcStreak();
  const diffDays = treeData.lastDate ? Math.floor((new Date(today())-new Date(treeData.lastDate))/86400000) : 0;
  if(levelUp) return pickRand(TREE_MSGS.levelup);
  if(treeData.stage===7 && streak>0) return pickRand(TREE_MSGS.lv4);
  if(streak>=30) return pickRand(TREE_MSGS.streak30);
  if(streak>=7) return pickRand(TREE_MSGS.streak7);
  const emoVals={'아주나쁨':1,'나쁨':2,'보통':3,'좋음':4,'아주좋음':5};
  if(preMood&&postMood&&(emoVals[postMood]||0)>(emoVals[preMood]||0)) return pickRand(TREE_MSGS.moodUp);
  const h = new Date().getHours();
  if(h>=22||h<=4) return pickRand(TREE_MSGS.night);
  if(diffDays>=7) return pickRand(TREE_MSGS.comeback7);
  if(diffDays>=3) return pickRand(TREE_MSGS.comeback3);
  const todayRecs=records[today()]||[];
  if(todayRecs.length<=1) return pickRand(TREE_MSGS.firstToday);
  return pickRand(TREE_MSGS.default);
}
function pickRand(arr){return arr[Math.floor(Math.random()*arr.length)];}

/* ── 나무 SVG 생성 ── */
function getTreeSVG(stageId, health, size){
  const s = size || 140;
  const cx = s/2, cy = s;
  const h = getTreeHealth();
  // 상태에 따른 색조 조정
  const wiltFilter = (h==='wilt'||h==='dormant') ? 'filter:saturate(0.3) brightness(0.7);' : '';
  const cautionFilter = h==='caution' ? 'filter:saturate(0.7) hue-rotate(-10deg);' : '';
  const styleAttr = wiltFilter || cautionFilter || '';

  const svgs = {
    1: `<svg width="${s}" height="${s*0.9}" viewBox="0 0 ${s} ${s*0.9}" style="${styleAttr}">
      <ellipse cx="${cx}" cy="${s*0.82}" rx="${s*0.3}" ry="${s*0.07}" fill="rgba(50,35,10,0.5)"/>
      <ellipse cx="${cx}" cy="${s*0.72}" rx="${s*0.12}" ry="${s*0.14}" fill="#2a1e0a"/>
      <ellipse cx="${cx}" cy="${s*0.70}" rx="${s*0.09}" ry="${s*0.11}" fill="#3d2c10"/>
      <ellipse cx="${cx}" cy="${s*0.68}" rx="${s*0.06}" ry="${s*0.08}" fill="#523d18"/>
      <ellipse cx="${cx}" cy="${s*0.66}" rx="${s*0.03}" ry="${s*0.05}" fill="#d4a84b" opacity="0.4">
        <animate attributeName="rx" values="${s*0.03};${s*0.05};${s*0.03}" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="${s*0.05};${s*0.07};${s*0.05}" dur="3s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      <circle cx="${cx}" cy="${s*0.64}" r="${s*0.015}" fill="#f0cc78" opacity="0.95">
        <animate attributeName="opacity" values="0.95;1;0.95" dur="1.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx*0.75}" cy="${s*0.5}" r="${s*0.01}" fill="#d4a84b" opacity="0">
        <animate attributeName="cy" values="${s*0.66};${s*0.3}" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0;0.7;0" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>`,

    2: `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" style="${styleAttr}">
      <ellipse cx="${cx}" cy="${s*0.92}" rx="${s*0.35}" ry="${s*0.07}" fill="rgba(30,50,20,0.5)"/>
      <path d="M${cx} ${s*0.9} Q${cx-s*0.02} ${s*0.78} ${cx} ${s*0.64}" stroke="#3a5a20" stroke-width="${s*0.02}" fill="none"/>
      <ellipse cx="${cx-s*0.09}" cy="${s*0.78}" rx="${s*0.08}" ry="${s*0.05}" fill="#4a8a2c" transform="rotate(-30,${cx-s*0.09},${s*0.78})"/>
      <ellipse cx="${cx+s*0.09}" cy="${s*0.74}" rx="${s*0.08}" ry="${s*0.05}" fill="#5aa034" transform="rotate(25,${cx+s*0.09},${s*0.74})"/>
      <ellipse cx="${cx}" cy="${s*0.58}" rx="${s*0.16}" ry="${s*0.2}" fill="#4a9030"/>
      <ellipse cx="${cx-s*0.1}" cy="${s*0.65}" rx="${s*0.1}" ry="${s*0.14}" fill="#5aaa38" transform="rotate(-15,${cx-s*0.1},${s*0.65})"/>
      <ellipse cx="${cx}" cy="${s*0.55}" rx="${s*0.02}" ry="${s*0.03}" fill="rgba(180,220,255,0.7)"/>
      <circle r="${s*0.015}" fill="#c8f060" opacity="0.8">
        <animateMotion path="M${cx-s*0.3},${s*0.7} Q${cx-s*0.45},${s*0.55} ${cx-s*0.3},${s*0.4} Q${cx-s*0.15},${s*0.55} ${cx-s*0.3},${s*0.7}" dur="5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>`,

    3: `<svg width="${s}" height="${s*1.1}" viewBox="0 0 ${s} ${s*1.1}" style="${styleAttr}">
      <ellipse cx="${cx}" cy="${s*0.99}" rx="${s*0.4}" ry="${s*0.08}" fill="rgba(30,60,30,0.6)"/>
      <ellipse cx="${cx-s*0.15}" cy="${s*0.98}" rx="${s*0.1}" ry="${s*0.04}" fill="rgba(50,100,40,0.5)"/>
      <path d="M${cx} ${s*0.97} Q${cx-s*0.02} ${s*0.82} ${cx} ${s*0.6}" stroke="#3a6020" stroke-width="${s*0.03}" fill="none"/>
      <path d="M${cx-s*0.01} ${s*0.78} Q${cx-s*0.12} ${s*0.73} ${cx-s*0.2} ${s*0.76}" stroke="#3a6020" stroke-width="${s*0.02}" fill="none"/>
      <path d="M${cx} ${s*0.7} Q${cx+s*0.11} ${s*0.65} ${cx+s*0.19} ${s*0.68}" stroke="#3a6020" stroke-width="${s*0.02}" fill="none"/>
      <ellipse cx="${cx}" cy="${s*0.5}" rx="${s*0.26}" ry="${s*0.3}" fill="#2e6c20"/>
      <ellipse cx="${cx-s*0.18}" cy="${s*0.6}" rx="${s*0.17}" ry="${s*0.2}" fill="#388226" transform="rotate(-25,${cx-s*0.18},${s*0.6})"/>
      <ellipse cx="${cx+s*0.18}" cy="${s*0.6}" rx="${s*0.17}" ry="${s*0.2}" fill="#388226" transform="rotate(25,${cx+s*0.18},${s*0.6})"/>
      <ellipse cx="${cx}" cy="${s*0.34}" rx="${s*0.17}" ry="${s*0.18}" fill="#46a030"/>
      <circle cx="${cx}" cy="${s*0.22}" r="${s*0.07}" fill="rgba(100,200,160,0.12)">
        <animate attributeName="r" values="${s*0.07};${s*0.1};${s*0.07}" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx}" cy="${s*0.22}" r="${s*0.035}" fill="#78ddb8" opacity="0.8">
        <animateMotion path="M0,0 Q${s*0.04},-${s*0.07} 0,-${s*0.13} Q-${s*0.04},-${s*0.07} 0,0" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx-s*0.18}" cy="${s*0.76}" r="${s*0.04}" fill="#ff80c0" opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${cx-s*0.18}" cy="${s*0.76}" r="${s*0.02}" fill="#ffe0f0"/>
      <circle r="${s*0.014}" fill="#c8f060" opacity="0.7">
        <animateMotion path="M${cx-s*0.35},${s*0.75} Q${cx-s*0.45},${s*0.6} ${cx-s*0.35},${s*0.45} Q${cx-s*0.2},${s*0.6} ${cx-s*0.35},${s*0.75}" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;0.15;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle r="${s*0.012}" fill="#d0f880" opacity="0.6">
        <animateMotion path="M${cx+s*0.35},${s*0.8} Q${cx+s*0.45},${s*0.65} ${cx+s*0.35},${s*0.5} Q${cx+s*0.2},${s*0.65} ${cx+s*0.35},${s*0.8}" dur="7s" repeatCount="indefinite" begin="2s"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite"/>
      </circle>
    </svg>`,

    4: `<svg width="${s*1.1}" height="${s*1.15}" viewBox="0 0 ${s*1.1} ${s*1.15}" style="${styleAttr}">
      <circle cx="${s*0.75}" cy="${s*0.15}" r="${s*0.12}" fill="#e8dfa8" opacity="0.15"/>
      <circle cx="${s*0.77}" cy="${s*0.13}" r="${s*0.11}" fill="${h==='healthy'?'#0a0c18':'transparent'}"/>
      <circle cx="${s*0.74}" cy="${s*0.15}" r="${s*0.12}" fill="#e8dfa8" opacity="0.18"/>
      <ellipse cx="${s*0.55}" cy="${s*1.05}" rx="${s*0.45}" ry="${s*0.09}" fill="rgba(25,45,25,0.7)"/>
      <path d="M${s*0.55} ${s*1.04} Q${s*0.52} ${s*0.9} ${s*0.55} ${s*0.75} Q${s*0.53} ${s*0.62} ${s*0.55} ${s*0.46}" stroke="#3a5c1c" stroke-width="${s*0.04}" fill="none" stroke-linecap="round"/>
      <path d="M${s*0.54} ${s*0.78} Q${s*0.4} ${s*0.73} ${s*0.28} ${s*0.78}" stroke="#3a5c1c" stroke-width="${s*0.025}" fill="none"/>
      <path d="M${s*0.55} ${s*0.65} Q${s*0.68} ${s*0.59} ${s*0.8} ${s*0.65}" stroke="#3a5c1c" stroke-width="${s*0.025}" fill="none"/>
      <ellipse cx="${s*0.55}" cy="${s*0.36}" rx="${s*0.32}" ry="${s*0.36}" fill="#246018"/>
      <ellipse cx="${s*0.27}" cy="${s*0.52}" rx="${s*0.2}" ry="${s*0.26}" fill="#2e7020" transform="rotate(-28,${s*0.27},${s*0.52})"/>
      <ellipse cx="${s*0.82}" cy="${s*0.52}" rx="${s*0.2}" ry="${s*0.26}" fill="#2e7020" transform="rotate(28,${s*0.82},${s*0.52})"/>
      <ellipse cx="${s*0.55}" cy="${s*0.16}" rx="${s*0.2}" ry="${s*0.22}" fill="#3c8828"/>
      <circle cx="${s*0.28}" cy="${s*0.78}" r="${s*0.04}" fill="#e0c0ff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.28}" cy="${s*0.78}" r="${s*0.02}" fill="#fff0ff"/>
      <circle cx="${s*0.8}" cy="${s*0.66}" r="${s*0.04}" fill="#e0c0ff" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="${s*0.8}" cy="${s*0.66}" r="${s*0.02}" fill="#fff0ff"/>
      <circle cx="${s*0.55}" cy="${s*0.05}" r="${s*0.06}" fill="rgba(160,140,255,0.08)">
        <animate attributeName="r" values="${s*0.06};${s*0.09};${s*0.06}" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.55}" cy="${s*0.05}" r="${s*0.03}" fill="#a090e8" opacity="0.7">
        <animateMotion path="M0,0 Q${s*0.06},-${s*0.09} 0,-${s*0.17} Q-${s*0.06},-${s*0.09} 0,0" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.55}" cy="${s*0.05}" r="${s*0.015}" fill="#e0d8ff"/>
    </svg>`,

    5: `<svg width="${s*1.2}" height="${s*1.2}" viewBox="0 0 ${s*1.2} ${s*1.2}" style="${styleAttr}">
      <ellipse cx="${s*0.6}" cy="${s*1.12}" rx="${s*0.5}" ry="${s*0.09}" fill="rgba(40,30,10,0.8)"/>
      <path d="M${s*0.6} ${s*1.1} Q${s*0.56} ${s*0.88} ${s*0.6} ${s*0.72} Q${s*0.58} ${s*0.56} ${s*0.6} ${s*0.44}" stroke="#5a4010" stroke-width="${s*0.05}" fill="none" stroke-linecap="round"/>
      <path d="M${s*0.6} ${s*1.1} Q${s*0.56} ${s*0.88} ${s*0.6} ${s*0.72} Q${s*0.58} ${s*0.56} ${s*0.6} ${s*0.44}" stroke="rgba(212,168,75,0.3)" stroke-width="${s*0.025}" fill="none"/>
      <path d="M${s*0.59} ${s*0.73} Q${s*0.42} ${s*0.65} ${s*0.27} ${s*0.72}" stroke="#5a4010" stroke-width="${s*0.03}" fill="none"/>
      <path d="M${s*0.6} ${s*0.62} Q${s*0.76} ${s*0.53} ${s*0.92} ${s*0.6}" stroke="#5a4010" stroke-width="${s*0.03}" fill="none"/>
      <ellipse cx="${s*0.6}" cy="${s*0.33}" rx="${s*0.38}" ry="${s*0.42}" fill="#1e5810"/>
      <ellipse cx="${s*0.3}" cy="${s*0.5}" rx="${s*0.26}" ry="${s*0.32}" fill="#286820" transform="rotate(-30,${s*0.3},${s*0.5})"/>
      <ellipse cx="${s*0.9}" cy="${s*0.5}" rx="${s*0.26}" ry="${s*0.32}" fill="#286820" transform="rotate(30,${s*0.9},${s*0.5})"/>
      <ellipse cx="${s*0.6}" cy="${s*0.15}" rx="${s*0.22}" ry="${s*0.24}" fill="#36802c"/>
      <ellipse cx="${s*0.3}" cy="${s*0.38}" rx="${s*0.1}" ry="${s*0.14}" fill="#d4a84b" opacity="0.3" transform="rotate(-30,${s*0.3},${s*0.38})"/>
      <circle cx="${s*0.28}" cy="${s*0.72}" r="${s*0.05}" fill="#d4a84b">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.28}" cy="${s*0.70}" r="${s*0.025}" fill="#f0cc78" opacity="0.8"/>
      <circle cx="${s*0.92}" cy="${s*0.6}" r="${s*0.05}" fill="#d4a84b">
        <animate attributeName="opacity" values="1;0.85;1" dur="3s" repeatCount="indefinite" begin="0.8s"/>
      </circle>
      <circle cx="${s*0.92}" cy="${s*0.58}" r="${s*0.025}" fill="#f0cc78" opacity="0.8"/>
      <circle cx="${s*0.42}" cy="${s*0.22}" r="${s*0.04}" fill="#c8943a">
        <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" begin="1.5s"/>
      </circle>
      <circle cx="${s*0.6}" cy="${s*0.1}" r="${s*0.08}" fill="rgba(212,168,75,0.06)">
        <animate attributeName="r" values="${s*0.08};${s*0.11};${s*0.08}" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.6}" cy="${s*0.1}" r="${s*0.04}" fill="#d4a84b" opacity="0.6">
        <animateMotion path="M0,0 Q${s*0.07},-${s*0.1} 0,-${s*0.18} Q-${s*0.07},-${s*0.1} 0,0" dur="4s" repeatCount="indefinite"/>
      </circle>
      <line x1="${s*0.6}" y1="${s*0.02}" x2="${s*0.6}" y2="${s*0.14}" stroke="rgba(240,204,120,0.2)" stroke-width="${s*0.04}">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
      </line>
    </svg>`,

    6: `<svg width="${s*1.3}" height="${s*1.3}" viewBox="0 0 ${s*1.3} ${s*1.3}" style="${styleAttr}">
      <path d="M0,${s*0.55} Q${s*0.4},${s*0.38} ${s*0.65},${s*0.46} Q${s*0.9},${s*0.55} ${s*1.3},${s*0.41}" stroke="rgba(150,100,255,0.08)" stroke-width="${s*0.16}" fill="none"/>
      <circle cx="${s*0.12}" cy="${s*0.1}" r="${s*0.01}" fill="#c8b8ff" opacity="0.8"/>
      <circle cx="${s*1.08}" cy="${s*0.08}" r="${s*0.008}" fill="#b0d0ff" opacity="0.7"/>
      <circle cx="${s*0.22}" cy="${s*0.22}" r="${s*0.007}" fill="#d8c8ff" opacity="0.6"/>
      <circle cx="${s*1.0}" cy="${s*0.18}" r="${s*0.01}" fill="#b8e8ff" opacity="0.75"/>
      <ellipse cx="${s*0.65}" cy="${s*1.2}" rx="${s*0.52}" ry="${s*0.1}" fill="rgba(20,15,40,0.9)"/>
      <path d="M${s*0.65} ${s*1.18} Q${s*0.61} ${s*0.97} ${s*0.65} ${s*0.82} Q${s*0.63} ${s*0.66} ${s*0.65} ${s*0.52}" stroke="#2a1850" stroke-width="${s*0.055}" fill="none" stroke-linecap="round"/>
      <path d="M${s*0.65} ${s*1.18} Q${s*0.61} ${s*0.97} ${s*0.65} ${s*0.82} Q${s*0.63} ${s*0.66} ${s*0.65} ${s*0.52}" stroke="rgba(150,100,255,0.25)" stroke-width="${s*0.025}" fill="none"/>
      <path d="M${s*0.64} ${s*0.82} Q${s*0.44} ${s*0.73} ${s*0.28} ${s*0.8}" stroke="#2a1850" stroke-width="${s*0.035}" fill="none"/>
      <path d="M${s*0.65} ${s*0.68} Q${s*0.84} ${s*0.58} ${s*0.98} ${s*0.65}" stroke="#2a1850" stroke-width="${s*0.035}" fill="none"/>
      <ellipse cx="${s*0.65}" cy="${s*0.4}" rx="${s*0.42}" ry="${s*0.46}" fill="#12063a"/>
      <ellipse cx="${s*0.3}" cy="${s*0.58}" rx="${s*0.28}" ry="${s*0.35}" fill="#160840" transform="rotate(-32,${s*0.3},${s*0.58})"/>
      <ellipse cx="${s*1.0}" cy="${s*0.58}" rx="${s*0.28}" ry="${s*0.35}" fill="#160840" transform="rotate(32,${s*1.0},${s*0.58})"/>
      <ellipse cx="${s*0.65}" cy="${s*0.2}" rx="${s*0.28}" ry="${s*0.3}" fill="#1e0e50"/>
      <circle cx="${s*0.3}" cy="${s*0.8}" r="${s*0.05}" fill="#6040c0" opacity="0.7">
        <animate attributeName="r" values="${s*0.05};${s*0.07};${s*0.05}" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.3}" cy="${s*0.8}" r="${s*0.025}" fill="#a080ff" opacity="0.9"/>
      <circle cx="${s*0.3}" cy="${s*0.8}" r="${s*0.01}" fill="#e0d8ff"/>
      <circle cx="${s*0.98}" cy="${s*0.66}" r="${s*0.05}" fill="#4060c0" opacity="0.6">
        <animate attributeName="r" values="${s*0.05};${s*0.07};${s*0.05}" dur="3.5s" repeatCount="indefinite" begin="1s"/>
      </circle>
      <circle cx="${s*0.98}" cy="${s*0.66}" r="${s*0.025}" fill="#80a0ff" opacity="0.9"/>
      <circle cx="${s*0.65}" cy="${s*0.08}" r="${s*0.1}" fill="rgba(100,60,220,0.06)">
        <animate attributeName="r" values="${s*0.1};${s*0.14};${s*0.1}" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.65}" cy="${s*0.08}" r="${s*0.05}" fill="#7050d0" opacity="0.5">
        <animateMotion path="M0,0 Q${s*0.08},-${s*0.12} 0,-${s*0.2} Q-${s*0.08},-${s*0.12} 0,0" dur="5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.65}" cy="${s*0.08}" r="${s*0.02}" fill="#c0b0ff" opacity="0.9"/>
    </svg>`,

    7: `<svg width="${s*1.35}" height="${s*1.35}" viewBox="0 0 ${s*1.35} ${s*1.35}" style="${styleAttr}">
      <ellipse cx="${s*0.67}" cy="${s*0.6}" rx="${s*0.6}" ry="${s*0.55}" fill="rgba(212,168,75,0.03)"/>
      <circle cx="${s*0.15}" cy="${s*0.08}" r="${s*0.012}" fill="#fff8e0" opacity="0.9"><animate attributeName="opacity" values="0.9;0.3;0.9" dur="3s" repeatCount="indefinite"/></circle>
      <circle cx="${s*1.1}" cy="${s*0.06}" r="${s*0.008}" fill="#fff0d0" opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" begin="0.5s"/></circle>
      <circle cx="${s*0.22}" cy="${s*0.22}" r="${s*0.01}" fill="#fff8f0" opacity="0.7"><animate attributeName="opacity" values="0.7;0.15;0.7" dur="4s" repeatCount="indefinite" begin="1s"/></circle>
      <circle cx="${s*1.0}" cy="${s*0.2}" r="${s*0.013}" fill="#ffe8c0" opacity="0.85"><animate attributeName="opacity" values="0.85;0.25;0.85" dur="3.5s" repeatCount="indefinite" begin="1.5s"/></circle>
      <polygon points="${s*0.67},${s*0.04} ${s*0.69},${s*0.1} ${s*0.75},${s*0.1} ${s*0.705},${s*0.135} ${s*0.72},${s*0.17} ${s*0.67},${s*0.145} ${s*0.62},${s*0.17} ${s*0.635},${s*0.135} ${s*0.59},${s*0.1} ${s*0.65},${s*0.1}" fill="#d4a84b" opacity="0.9">
        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" values="0,${s*0.67},${s*0.105};360,${s*0.67},${s*0.105}" dur="20s" repeatCount="indefinite"/>
      </polygon>
      <ellipse cx="${s*0.67}" cy="${s*1.27}" rx="${s*0.52}" ry="${s*0.1}" fill="rgba(50,35,10,0.9)"/>
      <path d="M${s*0.63} ${s*1.25} Q${s*0.48} ${s*1.32} ${s*0.38} ${s*1.26}" stroke="#5a3c0a" stroke-width="${s*0.03}" fill="none"/>
      <path d="M${s*0.67} ${s*1.28} Q${s*0.67} ${s*1.35} ${s*0.61} ${s*1.37}" stroke="#5a3c0a" stroke-width="${s*0.03}" fill="none"/>
      <path d="M${s*0.71} ${s*1.25} Q${s*0.86} ${s*1.32} ${s*0.96} ${s*1.26}" stroke="#5a3c0a" stroke-width="${s*0.03}" fill="none"/>
      <path d="M${s*0.63} ${s*1.25} Q${s*0.48} ${s*1.32} ${s*0.38} ${s*1.26}" stroke="rgba(212,168,75,0.2)" stroke-width="${s*0.012}" fill="none"/>
      <path d="M${s*0.67} ${s*1.27} Q${s*0.63} ${s*1.07} ${s*0.67} ${s*0.92} Q${s*0.65} ${s*0.76} ${s*0.67} ${s*0.55}" stroke="#3c2808" stroke-width="${s*0.065}" fill="none" stroke-linecap="round"/>
      <path d="M${s*0.67} ${s*1.27} Q${s*0.63} ${s*1.07} ${s*0.67} ${s*0.92} Q${s*0.65} ${s*0.76} ${s*0.67} ${s*0.55}" stroke="rgba(212,168,75,0.35)" stroke-width="${s*0.032}" fill="none"/>
      <path d="M${s*0.66} ${s*0.92} Q${s*0.44} ${s*0.83} ${s*0.27} ${s*0.9}" stroke="#3c2808" stroke-width="${s*0.04}" fill="none"/>
      <path d="M${s*0.67} ${s*0.78} Q${s*0.9} ${s*0.66} ${s*1.05} ${s*0.74}" stroke="#3c2808" stroke-width="${s*0.04}" fill="none"/>
      <path d="M${s*0.66} ${s*0.92} Q${s*0.44} ${s*0.83} ${s*0.27} ${s*0.9}" stroke="rgba(212,168,75,0.22)" stroke-width="${s*0.016}" fill="none"/>
      <ellipse cx="${s*0.67}" cy="${s*0.42}" rx="${s*0.48}" ry="${s*0.52}" fill="#1a0e04"/>
      <ellipse cx="${s*0.3}" cy="${s*0.62}" rx="${s*0.3}" ry="${s*0.38}" fill="#200e04" transform="rotate(-34,${s*0.3},${s*0.62})"/>
      <ellipse cx="${s*1.04}" cy="${s*0.62}" rx="${s*0.3}" ry="${s*0.38}" fill="#200e04" transform="rotate(34,${s*1.04},${s*0.62})"/>
      <ellipse cx="${s*0.67}" cy="${s*0.2}" rx="${s*0.3}" ry="${s*0.3}" fill="#2e1804"/>
      <ellipse cx="${s*0.38}" cy="${s*0.33}" rx="${s*0.1}" ry="${s*0.14}" fill="rgba(212,168,75,0.14)" transform="rotate(-34,${s*0.38},${s*0.33})"/>
      <ellipse cx="${s*0.96}" cy="${s*0.35}" rx="${s*0.1}" ry="${s*0.14}" fill="rgba(212,168,75,0.12)" transform="rotate(34,${s*0.96},${s*0.35})"/>
      <circle cx="${s*0.27}" cy="${s*0.9}" r="${s*0.05}" fill="#c8880a"><animate attributeName="opacity" values="0.9;1;0.9" dur="2.5s" repeatCount="indefinite"/></circle>
      <circle cx="${s*0.27}" cy="${s*0.88}" r="${s*0.025}" fill="#f0b840" opacity="0.9"/>
      <circle cx="${s*1.05}" cy="${s*0.74}" r="${s*0.05}" fill="#c8880a"><animate attributeName="opacity" values="1;0.85;1" dur="3s" repeatCount="indefinite" begin="0.8s"/></circle>
      <circle cx="${s*1.05}" cy="${s*0.72}" r="${s*0.025}" fill="#f0b840" opacity="0.9"/>
      <circle cx="${s*0.46}" cy="${s*0.3}" r="${s*0.04}" fill="#c0c8d0"><animate attributeName="opacity" values="0.85;1;0.85" dur="3.5s" repeatCount="indefinite" begin="2s"/></circle>
      <circle cx="${s*0.46}" cy="${s*0.28}" r="${s*0.02}" fill="#e8f0f8" opacity="0.9"/>
      <circle cx="${s*0.88}" cy="${s*0.32}" r="${s*0.04}" fill="#c0c8d0"><animate attributeName="opacity" values="1;0.8;1" dur="3s" repeatCount="indefinite" begin="1.2s"/></circle>
      <circle cx="${s*0.88}" cy="${s*0.30}" r="${s*0.02}" fill="#e8f0f8" opacity="0.9"/>
      <circle cx="${s*0.67}" cy="${s*0.15}" r="${s*0.12}" fill="rgba(212,168,75,0.04)"><animate attributeName="r" values="${s*0.12};${s*0.16};${s*0.12}" dur="4s" repeatCount="indefinite"/></circle>
      <circle cx="${s*0.67}" cy="${s*0.15}" r="${s*0.05}" fill="#d4a84b" opacity="0.7">
        <animateMotion path="M0,0 Q${s*0.09},-${s*0.12} 0,-${s*0.22} Q-${s*0.09},-${s*0.12} 0,0" dur="5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="${s*0.67}" cy="${s*0.15}" r="${s*0.022}" fill="#f8e880" opacity="0.95"/>
      <defs><linearGradient id="gg${stageId}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0cc78" stop-opacity="0"/><stop offset="50%" stop-color="#f0cc78" stop-opacity="1"/><stop offset="100%" stop-color="#d4a84b" stop-opacity="0"/></linearGradient></defs>
      <rect x="${s*0.638}" y="${s*0.02}" width="${s*0.064}" height="${s*0.17}" fill="url(#gg${stageId})" opacity="0.2"><animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite"/></rect>
    </svg>`,
  };
  return svgs[stageId] || svgs[1];
}

/* ── 배경 색상 설정 ── */
function setTreeBg(stageId, health){
  const st = TREE_STAGES[stageId-1];
  const h = getTreeHealth();
  let from = st.bgFrom, to = st.bgTo;
  if(h==='wilt') { from='#181008'; to='#100c08'; }
  if(h==='dormant') { from='#0a0808'; to='#080808'; }
  const wrap = document.getElementById('treeWrap');
  if(wrap) wrap.style.background = `linear-gradient(180deg,${from} 0%,${to} 100%)`;
}

/* ── 나무 렌더링 ── */
/* ── 별 생성 공통 함수 ── */
function spawnStars(containerId){
  const el = document.getElementById(containerId);
  if(!el || el.dataset.init) return;
  el.dataset.init = '1';
  for(let i=0;i<40;i++){
    const s = document.createElement('div');
    const sz = Math.random()*1.8+0.6;
    s.style.cssText = `
      position:absolute;border-radius:50%;
      width:${sz}px;height:${sz}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      background:rgba(255,248,220,${Math.random()*.7+.2});
      animation:treeTwinkle ${Math.random()*3+2}s ease-in-out infinite ${Math.random()*4}s;
    `;
    el.appendChild(s);
  }
  if(!document.getElementById('treeStarKF')){
    const kf = document.createElement('style');
    kf.id = 'treeStarKF';
    kf.textContent = '@keyframes treeTwinkle{0%,100%{opacity:.1;}50%{opacity:1;}}';
    document.head.appendChild(kf);
  }
}

/* ── 토글 버튼 상태 반영 ── */
function applyToggleBtn(){
  const btn = document.getElementById('treeToggleBtn');
  const label = document.getElementById('treeToggleLabel');
  if(!btn) return;
  if(treeOpen){
    btn.classList.add('is-on');
    if(label) label.textContent = 'ON';
  } else {
    btn.classList.remove('is-on');
    if(label) label.textContent = 'OFF';
  }
}

/* ── 토글 함수 ── */
function toggleTree(e){
  if(e) e.stopPropagation();
  treeOpen = !treeOpen;
  try{ localStorage.setItem(LS+'treeOpen', treeOpen?'1':'0'); }catch(e2){}
  renderTree();
}

/* ── 나무 전체 렌더링 ── */
function renderTree(){
  const loginEl    = document.getElementById('treeLoggedIn');
  const guestEl    = document.getElementById('treeGuest');
  const colLoginEl = document.getElementById('treeCollapsedLogin');
  const colGuestEl = document.getElementById('treeCollapsedGuest');
  if(!loginEl) return;

  applyToggleBtn();

  if(curUser){
    // ── 로그인 상태 ──
    guestEl.style.display    = 'none';
    colGuestEl.style.display = 'none';

    const st     = TREE_STAGES[treeData.stage-1];
    const h      = getTreeHealth();
    const nextTP = TREE_STAGES[treeData.stage] ? TREE_STAGES[treeData.stage].tpReq : treeData.tp;
    const prevTP = st.tpReq;
    const pct    = treeData.stage===7 ? 100 : Math.min(100, Math.round(((treeData.tp-prevTP)/(nextTP-prevTP))*100));
    const tpText = treeData.stage===7
      ? `${treeData.tp.toLocaleString()} TP · 전설`
      : `${treeData.tp.toLocaleString()} / ${nextTP.toLocaleString()} TP`;
    const healthIcons = {healthy:'🌿',good:'🌱',caution:'🍂',wilt:'🥀',dormant:'❄️',seed:'🌱'};
    const icon = healthIcons[h] || '🌱';

    if(treeOpen){
      // 열린 상태
      loginEl.style.display    = 'block';
      colLoginEl.style.display = 'none';

      const svgArea = document.getElementById('treeSvgArea');
      if(svgArea) svgArea.innerHTML = getTreeSVG(treeData.stage);
      setTreeBg(treeData.stage, h);

      const nameEl  = document.getElementById('treeName');
      const labelEl = document.getElementById('treeTPLabel');
      const fillEl  = document.getElementById('treeTPFill');
      const iconEl  = document.getElementById('treeHealthIcon');
      if(nameEl){ nameEl.textContent = st.name; nameEl.style.color = st.color; }
      if(labelEl) labelEl.textContent = tpText;
      if(fillEl){ fillEl.style.width = pct+'%'; fillEl.style.background = st.color; }
      if(iconEl) iconEl.textContent = icon;

    } else {
      // 닫힌 상태 — 아이콘+이름+게이지바
      loginEl.style.display    = 'none';
      colLoginEl.style.display = 'block';
      setTreeBg(treeData.stage, h);
      spawnStars('treeCollapsedStars');

      const cIcon  = document.getElementById('treeCollapsedIcon');
      const cName  = document.getElementById('treeCollapsedName');
      const cLabel = document.getElementById('treeCollapsedLabel');
      const cFill  = document.getElementById('treeCollapsedFill');
      if(cIcon) cIcon.textContent = icon;
      if(cName){ cName.textContent = st.name; cName.style.color = st.color; }
      if(cLabel) cLabel.textContent = tpText;
      if(cFill){ cFill.style.width = pct+'%'; cFill.style.background = st.color; }
    }

  } else {
    // ── 비로그인 상태 ──
    loginEl.style.display    = 'none';
    colLoginEl.style.display = 'none';
    setTreeBg(1, 'seed');

    if(treeOpen){
      // 열린 상태 — 판타지 타이틀
      guestEl.style.display    = 'block';
      colGuestEl.style.display = 'none';
      spawnStars('treeStars');

    } else {
      // 닫힌 상태 — 한 줄 메시지
      guestEl.style.display    = 'none';
      colGuestEl.style.display = 'block';
      spawnStars('treeGuestStars');
    }
  }
}

/* ── 나무 탭 인터랙션 ── */
function onTreeTap(){
  // 비로그인: 로그인 모달
  if(!curUser){
    openAuthModal('로그인하면 숨나무가 자라기 시작해요 🌱\n훈련할수록 씨앗에서 전설의 나무까지 키울 수 있어요.');
    return;
  }

  const st = TREE_STAGES[treeData.stage-1];
  const streak = calcStreak();
  const born = treeData.bornAt;
  const age = born ? Math.floor((new Date()-new Date(born))/86400000) : 0;
  const nextTP = TREE_STAGES[treeData.stage] ? TREE_STAGES[treeData.stage].tpReq : null;
  const remaining = nextTP ? (nextTP - treeData.tp) : 0;
  let info = `${st.name} · ${streak}일 연속\n총 ${treeData.tp.toLocaleString()} TP`;
  if(remaining>0) info += ` · 다음까지 ${remaining} TP`;
  if(age>0) info += `\n나무 나이 ${age}일`;
  showToast(info);

  // 흔들림 효과
  const svgArea = document.getElementById('treeSvgArea');
  if(svgArea){
    svgArea.style.transition='transform 0.15s';
    svgArea.style.transform='rotate(-2deg)';
    setTimeout(()=>{svgArea.style.transform='rotate(2deg)';},150);
    setTimeout(()=>{svgArea.style.transform='rotate(0deg)';},300);
    setTimeout(()=>{svgArea.style.transition='';},450);
  }
}

/* ── 성장 연출 ── */
function showLevelUpAnim(newStage){
  const st = TREE_STAGES[newStage-1];
  // 오버레이 생성
  const overlay = document.createElement('div');
  overlay.className = 'tree-levelup-overlay';
  overlay.innerHTML = `
    <div class="tree-levelup-bg" style="background:radial-gradient(ellipse at center,${st.color}22 0%,${st.color}08 50%,transparent 100%);"></div>
    <div class="tree-levelup-text">
      <div class="tree-levelup-name" style="color:${st.color};">✦ ${st.name}</div>
      <div class="tree-levelup-sub" style="color:${st.color}aa;">Stage ${newStage} · ${st.en}</div>
    </div>
    <div class="tree-levelup-lore" style="color:${st.color}aa;">"${st.lore}"</div>
  `;
  document.body.appendChild(overlay);

  // 파티클 버스트
  spawnTreeParticles(st.color);

  // 잠깐 후 제거
  setTimeout(()=>{
    overlay.style.opacity='0';
    overlay.style.transition='opacity 0.4s';
    setTimeout(()=>overlay.remove(), 400);
  }, 2800);
}

function spawnTreeParticles(color){
  const wrap = document.getElementById('treeWrap');
  if(!wrap) return;
  const rect = wrap.getBoundingClientRect();
  for(let i=0;i<16;i++){
    const p = document.createElement('div');
    p.className = 'tree-particle';
    const size = Math.random()*6+3;
    const angle = (Math.PI*2/16)*i + Math.random()*0.4;
    const dist = 60+Math.random()*80;
    const tx = Math.cos(angle)*dist;
    const ty = Math.sin(angle)*dist;
    p.style.cssText = `
      width:${size}px;height:${size}px;
      background:${color};
      left:${rect.left + rect.width/2}px;
      top:${rect.top + rect.height/2}px;
      --p-to:translate(${tx}px,${ty}px);
      animation-duration:${0.8+Math.random()*0.6}s;
      animation-delay:${Math.random()*0.2}s;
      position:fixed;
    `;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 1500);
  }
}

/* ── 훈련 완료 카드에 나무 정보 표시 ── */
function showTreeOnComplete(result){
  const { gained, prevStage, newStage, levelUp } = result;
  const memoData = memos[today()]||{};
  const pre = typeof memoData==='object' ? memoData.preMood||'' : '';
  const post = typeof memoData==='object' ? memoData.postMood||'' : '';
  const msg = pickTreeMsg(prevStage, newStage, pre, post, levelUp);

  const msgEl = document.getElementById('treeCompleteMsg');
  const svgEl = document.getElementById('treeCompleteSvg');
  const textEl = document.getElementById('treeMsgText');
  const tpEl = document.getElementById('treeTpGain');
  if(!msgEl) return;

  msgEl.style.display = 'flex';
  if(svgEl) svgEl.innerHTML = getTreeSVG(treeData.stage, null, 52);
  if(textEl) textEl.textContent = `🌿 ${msg}`;
  if(tpEl) tpEl.textContent = `+${gained} TP 획득 · 총 ${treeData.tp.toLocaleString()} TP`;

  if(levelUp){
    setTimeout(()=>showLevelUpAnim(newStage), 800);
  }
}

