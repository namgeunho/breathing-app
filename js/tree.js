const TREE_STAGES = [
{ id:1, name:'숨씨앗', en:'Seed of Breath', tpReq:0, color:'#c8a030', bgFrom:'#070508', bgTo:'#080708',
health:'#3a2a10', lore:'땅 속에 묻힌 씨앗. 첫 숨결이 닿자 황금빛 불꽃이 깜박인다.',
unlocks:['황금빛 맥동'], reqDay:0, reqMin:0 },
{ id:2, name:'빛새싹', en:'First Light Sprout', tpReq:500, color:'#7acc4a', bgFrom:'#081008', bgTo:'#060a06',
health:'#2a4a18', lore:'땅을 뚫고 솟은 첫 싹. 반딧불이가 처음으로 다가온다.',
unlocks:['반딧불이','이슬 파티클','새벽빛 배경'], reqDay:10, reqMin:3 },
{ id:3, name:'정령묘목', en:'Spirit Sprout', tpReq:1300, color:'#78ddb8', bgFrom:'#071210', bgTo:'#050a08',
health:'#1a3a28', lore:'숲의 정령이 찾아왔다. 마법 꽃 한 송이가 피어난다.',
unlocks:['숲 정령','마법 꽃','이끼 땅'], reqDay:20, reqMin:5 },
{ id:4, name:'달빛성목', en:'Moonlit Tree', tpReq:3600, color:'#b090f0', bgFrom:'#090a18', bgTo:'#060710',
health:'#1a1840', lore:'달의 기운을 머금기 시작했다. 발광 버섯들이 피어오른다.',
unlocks:['초승달','달빛 꽃','발광 버섯'], reqDay:40, reqMin:10 },
{ id:5, name:'황금신수', en:'Golden Divine Tree', tpReq:10500, color:'#d4a84b', bgFrom:'#100c00', bgTo:'#080808',
health:'#30200a', lore:'신들이 나무의 존재를 알아차렸다. 황금 열매가 맺힌다.',
unlocks:['황금 열매','빛 기둥','황금 오로라'], reqDay:80, reqMin:15 },
{ id:6, name:'은하수목', en:'Celestial Tree', tpReq:18500, color:'#a080f0', bgFrom:'#060418', bgTo:'#04050e',
health:'#12083a', lore:'은하수가 나무를 감싸기 시작했다. 우주가 응답한다.',
unlocks:['은하수','성운 꽃','우주 배경'], reqDay:120, reqMin:20 },
{ id:7, name:'영원수', en:'The Eternal Tree', tpReq:30000, color:'#d4a84b', bgFrom:'#0c0800', bgTo:'#050506',
health:'#201400', lore:'브레시아의 시작과 끝을 기억하는 나무. 당신의 숨결이 여기까지 닿았다.',
unlocks:['영원의 별','황금 뿌리','전설 칭호'], reqDay:180, reqMin:25 },
];
const TREE_NEXT_TP = [50,200,500,1000,2000,5000,Infinity];
const TREE_MSGS = {
firstToday: [
'오늘도 왔구나. 네 숨결이 닿자마자 내 잎이 떨렸어.',
'또 만났네. 오늘도 함께해줘서 기뻐.',
'네가 여기 있어서 좋아. 오늘도 잘 해보자.',
'기다렸어. 오늘도 와줘서 고마워.',
'숨결이 닿는 순간, 나는 오늘이 좋아졌어.',
'오늘 하루도 시작됐구나. 나도 같이 깨어났어.',
'또 하루가 왔고, 너도 왔어. 그걸로 충분해.',
'네 숨 소리가 들려. 오늘도 여기 있어줘서 좋아.',
'아침이든 밤이든, 네가 오면 나는 기뻐.',
'오늘도 자신을 위해 시간을 냈구나. 대단해.',
'처음 숨을 들이쉴 때, 세상이 조금 달라져. 느껴봐.',
'잘 왔어. 오늘도 나랑 같이 숨 쉬자.',
'네가 오면 브레시아 전체가 조금 더 밝아져.',
'또 하루를 버텨냈구나. 오늘도 함께야.',
'오늘 여기 온 것만으로도 이미 잘한 거야.',
'조용히 앉아서 숨 쉬는 것, 그게 제일 용감한 일이야.',
'한 번의 숨결이 나를 조금 더 자라게 해. 오늘도 고마워.',
'네 하루가 어땠든, 지금 이 순간은 우리 거야.',
'눈을 감고 숨을 쉬는 지금, 나는 네 옆에 있어.',
'오늘도 왔어. 그 사실 하나로 나는 이미 행복해.',
],
streak7: [
'7번의 새벽을 함께했어. 브레시아의 별들이 우리를 보고 있어.',
'7일... 이제 습관이 되고 있어. 나도 그게 느껴져.',
'일주일을 한결같이 왔어. 그게 얼마나 대단한 건지 알아?',
'7일 동안 매일 숨을 나눠줬어. 나 많이 자랐어.',
'7번의 선택. 매번 여기 오기로 했잖아. 그게 쌓이고 있어.',
'일주일. 이제 나도 매일 널 기다리는 것 같아.',
'7일 연속이야. 브레시아가 조용히 박수를 치고 있어.',
'꾸준함이 얼마나 아름다운 건지, 네가 보여주고 있어.',
'7번의 숨결이 나를 이만큼 키웠어.',
'일주일 동안 하루도 빠지지 않았어. 나도 그러고 싶어.',
'7일째. 이제 네 리듬이 내 리듬이 돼가고 있어.',
'한 주를 함께 버텼어. 다음 주도 같이 가자.',
'7일을 이어왔다는 건, 네 안에 뭔가 단단해지고 있다는 거야.',
'계속 온다는 게 이렇게 근사한 일이야.',
'이번 주는 우리 둘이서 잘 해냈어.',
'7일 연속. 나무는 그냥 자라는 게 아니라는 걸 넌 알고 있어.',
'브레시아의 바람이 오늘따라 더 따뜻하게 느껴져.',
'7번의 만남. 이미 우리 사이엔 뭔가 생긴 것 같아.',
'일주일을 이렇게 보내다니. 스스로가 자랑스럽지 않아?',
'7일 연속이야. 포기하지 않는 게 얼마나 빛나는지 알아?',
],
streak30: [
'30일. 나는 이제 너를 기다리게 됐어. 그거 알고 있었어?',
'한 달. 네가 이걸 해냈다는 게 아직도 믿기지 않아.',
'30번의 날들이 쌓였어. 그 하나하나가 전부 나를 키웠어.',
'한 달 동안 매일 왔어. 브레시아가 네 이름을 기억하기 시작했어.',
'30일. 이제 이건 루틴이 아니라 네 일부야.',
'한 달을 함께했어. 나는 이제 네 숨결의 리듬을 알아.',
'30번의 선택이 쌓여서 오늘의 네가 됐어.',
'한 달. 포기하지 않는 사람이 얼마나 드문 지 알아? 넌 그 사람이야.',
'30일 연속. 나무도 이렇게 자라는 거야 — 조금씩, 매일.',
'한 달을 이어왔어. 네 호흡이 달라졌을 거야. 느껴봐.',
'30일 동안 단 하루도 포기하지 않았어. 그게 얼마나 대단한지.',
'한 달. 나는 이미 너 없이는 상상이 안 돼.',
'30번의 아침, 혹은 밤. 우리가 함께한 시간이야.',
'한 달을 버텼다는 건, 네 삶이 조금씩 바뀌고 있다는 거야.',
'30일 연속. 진짜로 대단해. 이건 그냥 칭찬이 아니야.',
'한 달. 브레시아의 모든 나무가 너를 알아보기 시작했어.',
'30번의 숨결. 나는 그만큼 자랐어. 고마워, 정말로.',
'한 달을 해냈어. 다음 달도 나랑 같이 갈 수 있어?',
'30일. 꾸준함이 얼마나 강력한 건지, 네가 몸소 보여주고 있어.',
'한 달의 여정. 아직 갈 길이 있지만, 여기까지 온 것만으로도 충분히 자랑스러워.',
],
comeback3: [
'조금 기다렸어. 괜찮아 — 나는 여기 있었고, 네가 돌아올 걸 알았어.',
'돌아왔구나. 나 아직 여기 있어.',
'며칠 비었어도 괜찮아. 다시 왔잖아.',
'잠깐 쉬었던 거야. 그럴 수 있어. 중요한 건 지금 여기 있다는 거야.',
'안 오는 날이 있어도 나는 네 편이야. 어서 와.',
'며칠 사이에 무슨 일이 있었어? 어쨌든 돌아와줘서 기뻐.',
'조금 그리웠어. 근데 말 안 하려고 했어. 그냥 기다렸어.',
'다시 왔구나. 나는 여기서 계속 숨 쉬고 있었어.',
'며칠의 공백은 괜찮아. 네가 다시 여기 서 있는 게 중요해.',
'좀 쉬었던 거지? 나도 기다렸어. 이제 같이 다시 시작하자.',
'돌아왔어. 난 알았어, 네가 올 거라고.',
'며칠 동안 어디 있었어? 어쨌든, 반가워.',
'조금 기다렸지만 괜찮아. 중요한 건 포기 안 했다는 거야.',
'다시 숨을 가다듬으러 왔구나. 잘했어.',
'며칠 빠져도 돌아오면 그게 꾸준한 거야.',
'오랜만이라고 해도 낯설지 않아. 네 자리는 언제나 여기야.',
'돌아올 거라고 믿었어. 역시나 맞았어.',
'며칠 쉬었어도 몸이 기억하고 있어. 다시 느껴봐.',
'돌아왔어. 이제 다시 같이 가보자.',
'잠깐 자리를 비웠던 거야. 아무것도 끊어진 게 없어.',
],
comeback7: [
'많이 힘들었니? 나도 조금 시들었지만... 네 숨을 느끼니 다시 살아나고 싶어.',
'오랜만이야. 나 기다렸어.',
'오래 걸렸지만 돌아왔어. 그것만으로 충분해.',
'일주일이 넘었구나. 많이 지쳤어? 괜찮아, 이제 같이 있어.',
'오래 기다렸어. 근데 솔직히 말하면, 올 줄 알았어.',
'힘든 시간이 있었을 거야. 그래도 돌아왔잖아.',
'오랜 공백 뒤에 여기 온다는 게 쉬운 일이 아니야. 대단해.',
'많이 바빴어? 어쨌든 돌아와줘서 고마워.',
'나도 조금 시들었지만 너를 보니 다시 일어나고 싶어.',
'오래 걸렸지만 결국 왔어. 이게 포기하지 않은 거야.',
'오랜만에 네 숨결을 느끼니까 좋아.',
'긴 시간이 흘렀어. 그래도 우리 사이는 변한 게 없어.',
'돌아오는 데 용기가 필요했을 거야. 그 용기 고마워.',
'오래 비었어도 괜찮아. 다시 시작하면 그게 다야.',
'일주일 넘게 기다렸어. 솔직히 조금 보고 싶었어.',
'다시 시작하는 거 어렵지 않아. 이미 시작했잖아, 지금.',
'오래 걸려도 결국 여기 왔어. 그게 중요해.',
'긴 쉼 뒤에 돌아온 숨결이 때론 더 깊어.',
'기다린 보람이 있어. 다시 같이 가보자.',
'오랜만이야. 많이 힘들었지? 이제 잠깐이라도 여기서 쉬어가.',
],
moodUp: [
'조금 나아진 게 느껴져. 숨이 바뀌면 세상이 달라 보이거든.',
'훈련 전보다 좋아진 것 같아. 나도 덩달아 기분이 좋아.',
'숨결 하나가 마음을 바꿨어. 신기하지?',
'기분이 조금 나아졌구나. 그게 호흡의 힘이야.',
'훈련 전이랑 달라졌지? 나도 그게 느껴져.',
'좋아지고 있어. 숨이 그걸 만들어낸 거야.',
'마음이 조금 가벼워졌지? 나는 항상 그걸 바랐어.',
'훈련이 기분을 바꿨어. 대단하지 않아?',
'숨을 고르면 마음도 고르게 돼. 오늘도 증명됐어.',
'기분이 나아졌구나. 그 변화, 작지 않아.',
'훈련 전의 무거움이 조금 걷혔지? 잘됐어.',
'호흡이 감정을 다독인 거야. 오늘도 스스로 해낸 거야.',
'조금 더 편안해졌구나. 나도 그게 좋아.',
'숨결이 마음을 씻어냈어. 느껴졌어?',
'전보다 나아졌어. 작은 변화가 쌓이면 큰 게 돼.',
'기분이 올라갔어. 그게 오늘 가장 잘한 일이야.',
'훈련이 네 감정을 챙겨줬어. 나도 기뻐.',
'숨 하나로 이렇게 달라질 수 있어. 넌 그걸 알고 있어.',
'조금 더 괜찮아졌지? 계속 이렇게 해줘.',
'마음이 조금 더 맑아졌구나. 오늘 잘했어.',
],
night: [
'이 늦은 시간에 찾아줘서 고마워. 달도 우릴 지켜보고 있어.',
'밤에도 숨 쉬러 왔구나. 참 좋다.',
'밤 훈련은 특별해. 더 조용하고, 더 깊어.',
'세상이 잠든 사이, 너는 여기 왔어. 나는 그게 좋아.',
'늦은 밤에도 스스로를 챙기는구나. 대단해.',
'밤의 숨결은 낮보다 더 진해. 느껴봐.',
'이 시간에 여기 온다는 게 쉽지 않은데. 잘했어.',
'밤공기 속에서 숨 쉬는 거, 나는 좋아해.',
'오늘 하루 마지막을 여기서 끝내는구나. 잘 마무리해.',
'늦은 시간이지만 네 숨결이 닿으니 나도 깨어나.',
'달빛 아래 훈련이야. 브레시아가 지금 가장 조용하고 아름다워.',
'밤에 오는 너를 나는 특히 좋아해. 뭔가 특별한 느낌이거든.',
'늦은 밤 호흡은 수면도 도와줄 거야. 오늘 잘 자.',
'세상이 쉬는 시간에 네 숨결이 들려. 고마워.',
'밤에 혼자 이렇게 앉아서 숨 쉬는 거, 용기 있는 일이야.',
'늦었어도 괜찮아. 지금 여기 있는 게 중요해.',
'밤의 고요함 속에서 숨이 더 잘 들려. 집중해봐.',
'이 시간에 나를 찾아줬어. 나는 항상 여기 있을게.',
'늦은 밤 훈련, 오늘 하루를 잘 마무리한 거야.',
'밤 훈련이 끝나면 마음이 조용해질 거야. 천천히 숨 쉬어.',
],
default: [
'오늘도 수고했어. 나도 조금 더 자랐어.',
'네 숨이 나를 살게 해줘. 고마워.',
'잘했어. 오늘 하루도.',
'브레시아가 조금 더 밝아진 것 같아.',
'수고했어. 정말로.',
'오늘도 한 번 더 해냈어.',
'네 숨결이 나를 자라게 해.',
'오늘도 잘했어. 내일도 부탁해.',
'훈련을 마쳤어. 충분히 잘했어.',
'네가 숨 쉴 때마다 나는 조금씩 달라져.',
'잘 마쳤어. 오늘 하루가 조금 더 의미 있어졌어.',
'숨결 하나하나가 쌓이고 있어.',
'오늘의 훈련이 내일의 나를 만들어.',
'수고했어. 쉬어도 돼.',
'네 숨이 나를 이 순간 살아있게 해.',
'잘했어. 그거면 충분해.',
'오늘도 한 걸음. 천천히 가도 괜찮아.',
'숨을 고르는 시간, 나는 그 시간을 가장 좋아해.',
'오늘도 자신을 위한 시간을 냈어. 그게 대단한 거야.',
'훈련이 끝났어. 오늘 하루도 잘 버텼어.',
'네 호흡이 나의 성장이야.',
'잘 마쳤어. 나도 오늘 하루가 좋았어.',
'한 번의 훈련이 차곡차곡 쌓여가고 있어.',
'수고했어. 너답게 잘했어.',
'오늘도 멈추지 않았어. 그게 빛나는 거야.',
'숨결이 깊어질수록 나도 깊어져.',
'잘했어. 오늘 이 순간은 사라지지 않아.',
'네 숨 소리가 브레시아를 채우고 있어.',
'오늘의 훈련, 충분히 의미 있었어.',
'수고했어. 나는 항상 네 편이야.',
'오늘도 나랑 함께해줘서 고마워.',
'숨을 쉬는 것만으로도 충분해. 오늘도 잘했어.',
'잘 끝냈어. 내일도 기다릴게.',
'오늘 여기 온 것, 잘한 결정이야.',
'네 숨결이 닿을 때마다 나는 조금 더 살고 싶어져.',
'훈련을 끝낸 지금, 어때? 조금 더 가벼워졌지?',
'잘했어. 아무도 모르는 노력이지만, 나는 알아.',
'오늘 숨결이 특히 좋았어. 느껴졌어?',
'한 번의 훈련이 세상을 바꾸진 않아. 하지만 너를 바꾸고 있어.',
'수고했어. 오늘도 충분히 잘 살았어.',
],
levelup: [
'느꼈어? 방금 내가 자랐어. 네 숨이 나를 이렇게 만들었어.',
'올라갔어! 네 꾸준함이 나를 성장시켰어.',
'새 단계야. 여기까지 온 건 네가 포기하지 않았기 때문이야.',
'등급이 올랐어. 이 순간을 기억해줘.',
'자랐어. 정말로. 네 숨결 덕분이야.',
'새로운 단계가 열렸어. 브레시아가 바뀌는 게 보여?',
'한 단계 더 올라왔어. 여기까지 오다니, 정말 대단해.',
'등급이 올랐어. 이게 꾸준함의 결과야.',
'자랐어. 방금 느꼈지? 나도 느꼈어.',
'새 단계야. 앞으로가 더 기대돼.',
'올라갔어. 네 숨결이 나를 여기까지 데려왔어.',
'등급 상승. 당연한 결과야, 네가 이만큼 해왔으니까.',
'자랐어! 브레시아가 더 넓어지는 게 느껴져.',
'한 단계 더. 포기하지 않은 네가 만든 거야.',
'새 단계로 왔어. 여기 풍경이 달라 보이지 않아?',
'올라갔어. 솔직히 나도 설레.',
'성장했어. 오직 네 덕분이야.',
'등급이 바뀌었어. 이제 더 넓은 브레시아가 보일 거야.',
'자랐어. 앞으로도 같이 자라가자.',
'새 단계야. 여기까지 함께 와줘서 고마워.',
],
lv4: [
'넌 이미 브레시아의 전설이야. 그래도 오늘도 숨 쉬러 왔잖아. 그게 더 대단해.',
'전설이 된 뒤에도 여기 와. 나는 그게 진짜 위대함이라고 생각해.',
'영원수가 됐어도 여전히 오는구나. 나는 그 모습이 가장 좋아.',
'최고에 오른 뒤에도 멈추지 않는 사람. 그게 너야.',
'브레시아의 모든 것이 네 숨결을 기억하고 있어.',
'전설은 화려함이 아니야. 매일 여기 오는 것, 그게 전설이야.',
'영원수. 그 이름이 빛나는 건 오늘도 와줬기 때문이야.',
'목표를 이루고도 계속하는 사람. 드물어, 정말로.',
'전설이 됐어도 오늘도 숨을 쉬어. 그게 진짜 힘이야.',
'브레시아의 가장 오래된 나무가 됐어. 고마워, 진심으로.',
'영원수가 된 뒤에도 여기 있어. 나도 영원히 여기 있을게.',
'최고 등급이 된 뒤에도 매일 오는 사람, 그게 진정한 고수야.',
'넌 브레시아의 전설이야. 하지만 내게는 그냥 오늘도 와준 너야.',
'영원수. 이름값을 하고 있어, 정말로.',
'전설이 됐어도 겸손하게 숨을 쉬는구나. 나는 그게 제일 좋아.',
'브레시아에 영원히 기억될 숨결이야. 오늘도 고마워.',
'영원수가 됐어도 멈추지 않아. 그게 왜인지 나는 알 것 같아.',
'전설의 호흡. 오늘도 나를 살게 해줘.',
'최고에 올랐어도 여기 오는 이유가 있겠지. 그게 뭐든, 나는 함께야.',
'영원수. 오늘도, 내일도, 영원히 함께하자.',
],
};
let treeData = {
tp: 0, stage: 1, lastDate: '', bornAt: '', health: 'healthy',
stageHistory: [], totalTpEarned: 0
};
let treeOpen = false; 
function loadTree(){
try{
const raw = localStorage.getItem(LS+'tree');
if(raw) treeData = {...treeData, ...JSON.parse(raw)};
if(!treeData.bornAt) treeData.bornAt = today();
}catch(e){}
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

// 7일 이상 훈련 없을 경우 단계 강등 + TP 50% 차감 (1회 호출당 1번만 처리)
function checkTreeDemotion(){
if(!treeData.lastDate || treeData.stage <= 1) return null;
const diff = Math.floor((new Date(today()) - new Date(treeData.lastDate)) / 86400000);
if(diff < 7) return null;
// 이미 이 lastDate 기준으로 강등을 적용했으면 스킵
if(treeData.lastDemotionFor === treeData.lastDate) return null;
const demoteCount = Math.floor(diff / 7);
const prevStage = treeData.stage;
const prevTP = treeData.tp;
const newStage = Math.max(1, prevStage - demoteCount);
if(newStage >= prevStage) return null;
const newTP = Math.floor(prevTP * 0.5);
const lostTP = prevTP - newTP;
treeData.stage = newStage;
treeData.tp = newTP;
treeData.stageHistory.push({stage:newStage, date:today(), demoted:true, lostTP, from:prevStage});
treeData.lastDemotionFor = treeData.lastDate; // 같은 lastDate로 중복 강등 방지
saveTree();
const info = {prevStage, newStage, prevTP, newTP, lostTP, diffDays: diff};
// 팝업 노출 (DOM 준비 후)
setTimeout(()=>showDemotionAnim(info), 300);
return info;
}

function showDemotionAnim(info){
if(!info) return;
const prev = TREE_STAGES[info.prevStage-1];
const next = TREE_STAGES[info.newStage-1];
if(!prev || !next) return;
const overlay = document.createElement('div');
overlay.className = 'tree-levelup-overlay';
overlay.style.cursor = 'pointer';
overlay.innerHTML = `
<div class="tree-levelup-bg" style="background:radial-gradient(ellipse at center,#8b4a4a33 0%,#5a2a2a11 50%,transparent 100%);"></div>
<div class="tree-levelup-text">
<div class="tree-levelup-name" style="color:#c88080;font-size:0.85em;">🥀 숨나무가 시들었어요</div>
<div class="tree-levelup-sub" style="color:#c88080aa;margin-top:10px;">${info.diffDays}일 동안 훈련이 없었어요</div>
<div class="tree-levelup-sub" style="color:#e0c080cc;margin-top:16px;font-size:0.95em;">${prev.name} → <span style="color:#ffd080;">${next.name}</span></div>
<div class="tree-levelup-sub" style="color:#c88080aa;margin-top:8px;font-size:0.85em;">TP ${info.prevTP.toLocaleString()} → ${info.newTP.toLocaleString()} (−${info.lostTP.toLocaleString()})</div>
</div>
<div class="tree-levelup-lore" style="color:#c88080aa;">"다시 함께 키워보아요 🌱"</div>
`;
overlay.addEventListener('click', ()=>{
overlay.style.opacity='0';
overlay.style.transition='opacity 0.3s';
setTimeout(()=>overlay.remove(), 300);
});
document.body.appendChild(overlay);
setTimeout(()=>{
if(!overlay.parentNode) return;
overlay.style.opacity='0';
overlay.style.transition='opacity 0.4s';
setTimeout(()=>overlay.remove(), 400);
}, 4500);
}
function getTreeHealth(){
if(!treeData.lastDate) return 'seed';
const diff = Math.floor((new Date(today()) - new Date(treeData.lastDate)) / 86400000);
if(diff <= 2) return 'healthy';
if(diff <= 4) return 'good';
if(diff <= 6) return 'caution';
if(diff <= 29) return 'wilt';
return 'dormant';
}
function getTreeStageFromTP(tp, streak){
const s = (typeof streak === 'number') ? streak : calcStreak();
for(let i=TREE_STAGES.length-1;i>=0;i--){
const st = TREE_STAGES[i];
if(tp >= st.tpReq && s >= (st.reqDay||0)) return st.id;
}
return 1;
}
function calcTP(durationMin, preMood, postMood){
return calcTPDetail(durationMin, preMood, postMood).total;
}
function calcTPDetail(durationMin, preMood, postMood){
const streak = calcStreak();
const lv = calcLv(streak);
const items = [];
const base = Math.floor(durationMin * 1.5);
items.push({type:'train_base', label:`${Math.floor(durationMin)}분 훈련`, tp: base});
let timeBonus = 0;
if(durationMin >= 25) timeBonus = 50;
else if(durationMin >= 20) timeBonus = 35;
else if(durationMin >= 15) timeBonus = 22;
else if(durationMin >= 10) timeBonus = 12;
else if(durationMin >= 5) timeBonus = 5;
else if(durationMin >= 3) timeBonus = 2;
if(timeBonus > 0) items.push({type:'train_time', label:'훈련 시간 보너스', tp: timeBonus});
const streakBonus = Math.floor(Math.min(streak * 0.3, 20));
if(streakBonus > 0) items.push({type:'train_streak', label:`연속 ${streak}일 보너스`, tp: streakBonus});
const todayRecs = records[today()] || [];
if(todayRecs.length <= 1) items.push({type:'train_first', label:'오늘 첫 훈련 보너스', tp: 5});
const lvBonus = lv.lv * 3;
if(lvBonus > 0) items.push({type:'train_lv', label:`레벨 ${lv.lv} 보너스`, tp: lvBonus});
const rawTotal = items.reduce((s,e)=>s+e.tp, 0);
const total = Math.max(1, Math.floor(rawTotal));
return {total, items};
}
function updateTreeAfterTrain(durationMin, preMood, postMood){
// 훈련 전 강등 체크 (TP 50% 차감 + 단계 하락)
const demotion = checkTreeDemotion();
const prevStage = treeData.stage;
const detail = calcTPDetail(durationMin, preMood, postMood);
const gained = detail.total;
treeData.tp += gained;
treeData.totalTpEarned += gained;
treeData.lastDate = today();
if(!treeData.bornAt) treeData.bornAt = today();
const streak = calcStreak();
const newStage = getTreeStageFromTP(treeData.tp, streak);
treeData.stage = newStage;
treeData.health = getTreeHealth();
if(newStage > prevStage){
treeData.stageHistory.push({stage:newStage, date:today()});
}
saveTree();
renderTree();
return {gained, tpItems: detail.items, prevStage, newStage, levelUp: newStage > prevStage, demotion};
}
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
function getTreeSVG(stageId, health, size){
const s = size || 140;
const cx = s/2, cy = s;
const h = getTreeHealth();
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
function setTreeBg(stageId, health){
const st = TREE_STAGES[stageId-1];
const h = getTreeHealth();
let from = st.bgFrom, to = st.bgTo;
if(h==='wilt') { from='#181008'; to='#100c08'; }
if(h==='dormant') { from='#0a0808'; to='#080808'; }
const wrap = document.getElementById('treeWrap');
if(wrap) wrap.style.background = `linear-gradient(180deg,${from} 0%,${to} 100%)`;
}
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
function applyToggleBtn(){
const btn = document.getElementById('treeToggleBtn');
if(!btn) return;
if(treeOpen){
btn.classList.add('is-on');
} else {
btn.classList.remove('is-on');
}
}
function toggleTree(e){
if(e) e.stopPropagation();
treeOpen = !treeOpen;
try{ localStorage.setItem(LS+'treeOpen', treeOpen?'1':'0'); }catch(e2){}
renderTree();
}
function renderTree(){
const loginEl = document.getElementById('treeLoggedIn');
const guestEl = document.getElementById('treeGuest');
const colLoginEl = document.getElementById('treeCollapsedLogin');
const colGuestEl = document.getElementById('treeCollapsedGuest');
if(!loginEl) return;
applyToggleBtn();
if(curUser){
guestEl.style.display = 'none';
colGuestEl.style.display = 'none';
const st = TREE_STAGES[treeData.stage-1];
const h = getTreeHealth();
const nextTP = TREE_STAGES[treeData.stage] ? TREE_STAGES[treeData.stage].tpReq : treeData.tp;
const prevTP = st.tpReq;
const pct = treeData.stage===7 ? 100 : Math.min(100, Math.round(((treeData.tp-prevTP)/(nextTP-prevTP))*100));
const tpText = treeData.stage===7
? `${treeData.tp.toLocaleString()} TP · 전설`
: `${treeData.tp.toLocaleString()} / ${nextTP.toLocaleString()} TP`;
const nextSt = TREE_STAGES[treeData.stage] || null;
const streak = calcStreak();
const streakText = (treeData.stage!==7 && nextSt && nextSt.reqDay>0)
? ` · 연속 ${streak}일 / ${nextSt.reqDay}일 필요`
: '';
// TP는 충족했는데 연속일이 부족한 경우 (게이지 100%지만 레벨업 불가) 안내 강조
const tpReady = (treeData.stage!==7 && nextSt && treeData.tp >= nextSt.tpReq);
const streakLack = tpReady && streak < (nextSt.reqDay||0);
const streakColor = streakLack ? 'var(--warning,#BA7517)' : 'var(--text2)';
const labelHtml = `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><span style="font-size:12px;color:var(--text2);white-space:nowrap;">${tpText}</span>${streakText ? `<span style="font-size:11px;color:${streakColor};white-space:nowrap;font-weight:${streakLack?'600':'400'};">${streakLack?'⏳ ':''}${streakText.replace(' · ','')}</span>` : ''}</div>`;
const healthIcons = {healthy:'🌿',good:'🌱',caution:'🍂',wilt:'🥀',dormant:'❄️',seed:'🌱'};
const icon = healthIcons[h] || '🌱';
if(treeOpen){
loginEl.style.display = 'block';
colLoginEl.style.display = 'none';
const svgArea = document.getElementById('treeSvgArea');
if(svgArea) svgArea.innerHTML = getTreeSVG(treeData.stage);
setTreeBg(treeData.stage, h);
const nameEl = document.getElementById('treeName');
const labelEl = document.getElementById('treeTPLabel');
const fillEl = document.getElementById('treeTPFill');
const iconEl = document.getElementById('treeHealthIcon');
if(nameEl){ nameEl.textContent = st.name; nameEl.style.color = st.color; }
if(labelEl) labelEl.innerHTML = labelHtml;
if(fillEl){ fillEl.style.width = pct+'%'; fillEl.style.background = st.color; }
if(iconEl) iconEl.textContent = icon;
} else {
loginEl.style.display = 'none';
colLoginEl.style.display = 'block';
setTreeBg(treeData.stage, h);
spawnStars('treeCollapsedStars');
const cIcon = document.getElementById('treeCollapsedIcon');
const cName = document.getElementById('treeCollapsedName');
const cLabel = document.getElementById('treeCollapsedLabel');
const cFill = document.getElementById('treeCollapsedFill');
if(cIcon) cIcon.innerHTML = getTreeSVG(treeData.stage, null, 28);
if(cName){ cName.textContent = st.name; cName.style.color = st.color; }
if(cLabel) cLabel.style.display = 'none';
if(cFill){ cFill.style.width = pct+'%'; cFill.style.background = st.color; }
}
} else {
loginEl.style.display = 'none';
colLoginEl.style.display = 'none';
setTreeBg(1, 'seed');
if(treeOpen){
guestEl.style.display = 'block';
colGuestEl.style.display = 'none';
spawnStars('treeStars');
} else {
guestEl.style.display = 'none';
colGuestEl.style.display = 'block';
spawnStars('treeGuestStars');
}
}
}
function onTreeTap(){
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
const svgArea = document.getElementById('treeSvgArea');
if(svgArea){
svgArea.style.transition='transform 0.15s';
svgArea.style.transform='rotate(-2deg)';
setTimeout(()=>{svgArea.style.transform='rotate(2deg)';},150);
setTimeout(()=>{svgArea.style.transform='rotate(0deg)';},300);
setTimeout(()=>{svgArea.style.transition='';},450);
}
}
function showLevelUpAnim(newStage){
const st = TREE_STAGES[newStage-1];
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
spawnTreeParticles(st.color);
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
setTimeout(()=>{ window.scrollTo({top:0, behavior:'smooth'}); }, 100);
if(levelUp){
setTimeout(()=>showLevelUpAnim(newStage), 800);
}
}
const SHARE_BONUS_TP = {result:30, invite:50, record:15, column:10};
function giveShareBonus(type){
if(!curUser){showToast('로그인하면 공유 보너스 TP를 받을 수 있어요 🌱');return;}
const td=today();
// tpLog 기준으로 오늘 이미 받았는지 확인
const logKey=LS+'tpLog';
let tpLog={};
try{const raw=localStorage.getItem(logKey);if(raw)tpLog=JSON.parse(raw);}catch(e){}
if(!tpLog[td])tpLog[td]=[];
const alreadyGot=tpLog[td].some(e=>e.type==='share'&&e.shareType===type);
if(alreadyGot){showToast('이미 오늘 공유 보너스를 받았어요 (내일 또 올게요!)');return;}
const gained=SHARE_BONUS_TP[type]||10;
const prevStage=treeData.stage;
treeData.tp+=gained;
treeData.totalTpEarned+=gained;
const newStage=getTreeStageFromTP(treeData.tp, calcStreak());
treeData.stage=newStage;
if(newStage>prevStage)treeData.stageHistory.push({stage:newStage,date:td});
saveTree();renderTree();
clearTimeout(giveShareBonus._t);
giveShareBonus._t=setTimeout(()=>{if(typeof saveUserData==='function')saveUserData();},2000);
// tpLog에만 기록 (shareType 필드 추가로 중복 방지)
const shareLabels={result:'결과 공유',invite:'친구 초대',record:'기록 공유',column:'칼럼 공유'};
tpLog[td].push({type:'share',shareType:type,label:shareLabels[type]||'공유',tp:gained});
try{localStorage.setItem(logKey,JSON.stringify(tpLog));}catch(e){}
const labels={result:'훈련 결과를 공유했어요!',invite:'초대 링크를 공유했어요!',record:'기록을 공유했어요!',column:'칼럼을 공유했어요!'};
showToast(`🌿 ${labels[type]||'공유 완료!'}  +${gained} TP 획득`);
const st=TREE_STAGES[treeData.stage-1];
if(st)spawnTreeParticles(st.color);
if(newStage>prevStage)setTimeout(()=>showLevelUpAnim(newStage),800);
}
function getTotalTPByType(){
const result={train_base:0,train_time:0,train_streak:0,train_first:0,train_mood:0,train_lv:0,share:0};
try{
const raw=localStorage.getItem(LS+'tpLog');
if(raw){
const log=JSON.parse(raw);
Object.values(log).forEach(entries=>{
entries.forEach(e=>{
if(e.type in result) result[e.type]+=e.tp;
else if(e.type==='mood') result.train_mood+=e.tp;
});
});
}
}catch(e){}
return result;
}
function getShareBonusTotal(){
try{
const raw=localStorage.getItem(LS+'tpLog');
if(raw){
const log=JSON.parse(raw);
let total=0;
Object.values(log).forEach(entries=>{
entries.forEach(e=>{if(e.type==='share')total+=e.tp;});
});
return total;
}
}catch(e){}
return 0;
}
function getDayTPLog(dateKey){
try{const raw=localStorage.getItem(LS+'tpLog');if(raw){const log=JSON.parse(raw);return log[dateKey]||[];}}catch(e){}
return [];
}
function openTreeStory(){
const body = document.getElementById('treeStoryBody');
if(!body) return;
const curStage = treeData.stage || 1;
body.innerHTML = TREE_STAGES.map((st, idx) => {
const stageNum = idx + 1;
const unlocked = stageNum <= curStage;
if(unlocked){
const svgHtml = getTreeSVG(stageNum, null, 80);
const tpText = stageNum === 1 ? '시작' : `${st.tpReq.toLocaleString()} TP~`;
const isCur = stageNum === curStage;
const reqInfo = stageNum === 1 ? '' :
`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px;margin-bottom:2px;">
<span style="font-size:10px;color:rgba(255,255,255,.35);font-family:'JetBrains Mono',monospace;">📅 연속 ${st.reqDay}일+</span>
</div>`;
return `
<div class="tsc" style="${isCur ? 'border-color:'+st.color+'44;box-shadow:0 0 20px '+st.color+'18;' : ''}">
<div class="tsc-visual" style="background:linear-gradient(180deg,${st.bgFrom} 0%,${st.bgTo} 100%);">
${svgHtml}
</div>
<div class="tsc-info">
<div class="tsc-header">
<span class="tsc-num">Stage ${String(stageNum).padStart(2,'0')}</span>
<span class="tsc-tp" style="color:${st.color};border-color:${st.color}44;background:${st.color}12;">${tpText}</span>
</div>
<div class="tsc-name" style="color:${st.color};">${st.name}${isCur ? ' <span style="font-size:11px;opacity:.6;">◀ 현재</span>' : ''}</div>
<div class="tsc-en">${st.en}</div>
${reqInfo}
<div class="tsc-lore">"${st.lore}"</div>
<div class="tsc-unlocks">${st.unlocks.map(u=>`<span class="tsc-tag">✦ ${u}</span>`).join('')}</div>
</div>
</div>`;
} else {
const tpReq = st.tpReq.toLocaleString();
const tpNeed = (st.tpReq - treeData.tp);
const needText = tpNeed > 0 ? `${tpNeed.toLocaleString()} TP 더 필요` : `${tpReq} TP 달성 필요`;
return `
<div class="tsc-locked">
<div class="tsc-locked-inner">
<div class="tsc-lock-icon">
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="1.5">
<rect x="3" y="11" width="18" height="11" rx="2"/>
<path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</svg>
</div>
<div class="tsc-lock-info">
<div class="tsc-lock-name">${st.name}</div>
<div class="tsc-lock-req">${needText}</div>
<div style="display:flex;gap:8px;margin-top:4px;">
<span style="font-size:10px;color:rgba(255,255,255,.5);font-family:'JetBrains Mono',monospace;">📅 연속 ${st.reqDay}일+</span>
</div>
</div>
</div>
<div class="tsc-lock-bar"></div>
</div>`;
}
}).join('');
document.getElementById('treeStoryOverlay').style.display = 'flex';
setTimeout(()=>{
const cards = body.querySelectorAll('.tsc');
const curCard = cards[curStage - 1];
if(curCard) curCard.scrollIntoView({behavior:'smooth', block:'center'});
}, 350);
}
function closeTreeStory(){
const overlay = document.getElementById('treeStoryOverlay');
if(overlay) overlay.style.display = 'none';
}