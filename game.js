(()=>{
"use strict";

const screen=document.getElementById("screen");
const homeBtn=document.getElementById("homeBtn");
const resetBtn=document.getElementById("resetBtn");

// ------------------------------
// Zoom / double-tap restrictions
// ------------------------------
document.addEventListener("dblclick",e=>e.preventDefault(),{passive:false});
document.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});
document.addEventListener("gesturechange",e=>e.preventDefault(),{passive:false});
document.addEventListener("gestureend",e=>e.preventDefault(),{passive:false});
document.addEventListener("touchmove",e=>{if(e.touches&&e.touches.length>1)e.preventDefault();},{passive:false});
document.addEventListener("contextmenu",e=>e.preventDefault(),{passive:false});
document.addEventListener("dragstart",e=>e.preventDefault(),{passive:false});
document.addEventListener("selectstart",e=>e.preventDefault(),{passive:false});
document.addEventListener("copy",e=>e.preventDefault(),{passive:false});
document.addEventListener("cut",e=>e.preventDefault(),{passive:false});

const PLAYERS=[
  {id:"p1",no:1,name:"プレイヤー1",cpu:false,img:"play/01.png"},
  {id:"p2",no:2,name:"プレイヤー2",cpu:false,img:"play/02.png"},
  {id:"p3",no:3,name:"プレイヤー3",cpu:false,img:"play/03.png"},
  {id:"p4",no:4,name:"プレイヤー4",cpu:false,img:"play/04.png"},

  // 1 PLAYER VS CPU7 用の追加CPU。
  // 専用play画像を増やさなくても動くよう、既存iconをアバターに利用。
  {id:"c2",no:2,name:"CPUモブ02",cpu:true,img:"icon/02.png"},
  {id:"c3",no:3,name:"CPUモブ03",cpu:true,img:"icon/03.png"},
  {id:"c4",no:4,name:"CPUモブ04",cpu:true,img:"icon/04.png"},

  {id:"c5",no:5,name:"モブイタリアン",cpu:true,img:"play/05.PNG"},
  {id:"c6",no:6,name:"モブ中華店主",cpu:true,img:"play/06.PNG"},
  {id:"c7",no:7,name:"モブティラノ",cpu:true,img:"play/07.PNG"},
  {id:"c8",no:8,name:"モブスーパーマン",cpu:true,img:"play/08.PNG"}
];

const GAMES=[
  {no:1,key:"reaction",title:"反射神経",sub:"モブくんが出た瞬間をタップ"},
  {no:2,key:"memory",title:"記憶力ゲーム",sub:"10枚の点灯順を記憶"},
  {no:3,key:"puzzle",title:"ナンバープレート12",sub:"1〜12を順番に消すタイムアタック"},
  {no:4,key:"launch",title:"フィギュア飛ばし",sub:"感覚で狙う最大2000m"},
  {no:5,key:"stack",title:"グラグラモブくん",sub:"10秒で色々なモブくんを積む"},
  {no:6,key:"breakdance",title:"1990世界大会",sub:"4択から1990を見抜く"},
  {no:7,key:"crisis",title:"モブくん危機一髪",sub:"3体で足元エネルギーを連続回避"},
  {no:8,key:"factory",title:"モブくん人形大人気",sub:"10秒で箱詰め・封印を量産"},
  {no:9,key:"catcher",title:"モブくんキャッチャー",sub:"多種モブくんをUFOキャッチ"},
  {no:10,key:"tidy",title:"モブくん整理整頓",sub:"7体を見本の部屋へ近づける"},
  {no:11,key:"ski",title:"モブくんスキージャンプ",sub:"踏切タイミングで最大1km"},
  {no:12,key:"slot",title:"モブくんスロット",sub:"キャラクタースロットでコイン勝負"},
  {no:13,key:"rope",title:"モブ跳び",sub:"左右から走るモブくんを飛び越える"},
  {no:14,key:"pk",title:"モブくんPK",sub:"10本のシュートを止める"},
  {no:15,key:"rhythm",title:"モブくん椅子取りゲーム",sub:"♪が消えた瞬間に椅子をタップ"},
  {no:16,key:"cut",title:"モブくんカットゲーム",sub:"指定%を感覚で切り分ける"},
  {no:17,key:"climb",title:"モブくん木登り",sub:"中央を狙って10秒登る"},
  {no:18,key:"errand",title:"お使いモブくん",sub:"1000円を10秒で使い切る"},
  {no:19,key:"dontHitMob",title:"モブくんを叩かないで",sub:"モグラだけを叩く10秒勝負"},
  {no:20,key:"mobStop",title:"モブくんストップ",sub:"棒のギリギリで止める"},
  {no:21,key:"overlap",title:"重なる瞬間を狙え！",sub:"2つの円を10秒以内に重ねる"},
  {no:22,key:"shutter",title:"モブくんシャッターチャンス",sub:"ジャンプの頂点を撮影"},
  {no:23,key:"cup",title:"コップ限界チャレンジ",sub:"表面張力ギリギリまで注ぐ"},
  {no:24,key:"darts",title:"ダーツ1投勝負",sub:"縦・横ゲージの中央を狙う"},
  {no:25,key:"parachute",title:"モブくんとパラシュート",sub:"開くタイミングで着地点を狙う"},
  {no:26,key:"mobCount",title:"モブくんは何人？",sub:"3秒で人数を見抜く"},
  {no:27,key:"brake",title:"急ブレーキ",sub:"障害物ギリギリで瞬間停止"},
  {no:28,key:"feint",title:"フェイント反射神経",sub:"見た目が同じ本物のGO!を待つ"},
  {no:29,key:"bomb",title:"爆弾チキンレース",sub:"0.000秒直前でSTOP"},
  {no:30,key:"overlapMaster",title:"重なりマスター",sub:"4つの円を同時に重ねる"},
  {no:31,key:"jumpingMob",title:"ジャンピングモブくん",sub:"ホッピングで台を乗り継ぐ"},
  {no:32,key:"heroMaybe",title:"モブくんは勇者かも",sub:"10秒で勇者を育てる"},
  {no:33,key:"popularGame",title:"あの人気者のゲーム",sub:"モブくんでモグラ踏み"},
  {no:34,key:"planetEnergy",title:"この星を..！",sub:"3回チャージして高層ビルを貫く"},
  {no:35,key:"painter",title:"モブくんは画家志望",sub:"猫の顔型を1回で綺麗になぞる"},
  {no:36,key:"bikeJump",title:"バイクでジャンピング",sub:"約3秒走って巨大ジャンプ台へ"},
  {no:37,key:"trampoline",title:"ダイナミックトラポリン",sub:"3回連続で跳ねて3回目が記録"},
  {no:38,key:"mobTrain",title:"モブくん列車出発進行！",sub:"5秒で線路を描いてゴールへ"},
  {no:39,key:"giantMob",title:"巨大モブくん大進撃",sub:"1.000秒を刻みながらビル破壊"},
  {no:40,key:"wizardMob",title:"魔法使いモブくん",sub:"闇の炎を円で囲んで町を守る"},
  {no:41,key:"brawlerMob",title:"モブくんは喧嘩番長",sub:"30人を倒すまでのタイムアタック"},
  {no:42,key:"summonerMob",title:"モブくんは召喚師",sub:"広く描いて超火力の中央オート無双"},
  {no:43,key:"blackjackMob",title:"ブラックジャックの決戦",sub:"動く13枚を追って21を作る"},
  {no:44,key:"mobIssen",title:"モブくん一閃",sub:"3回の一閃 合計300ポイント"},
  {no:45,key:"crowEscape",title:"カラスから逃げろ！",sub:"4体のカラスから20秒逃げ切る"},
  {no:46,key:"dancingMob",title:"ダンシングモブくん",sub:"7秒で描いた絵と一緒に踊る"},
  {no:47,key:"guardianMob",title:"モブくんはガーディアン",sub:"7秒で描いた城で巨大エネルギーを防ぐ"},
  {no:48,key:"mob50m",title:"モブくん50m走",sub:"左足・右足を交互に連打"},
  {no:49,key:"sniperMob",title:"モブくんはスナイパー",sub:"超遠距離ターゲットへ4発勝負"}
];

const MODES={
  solo4:{name:"4人 個人戦",short:"プレイヤー4人",participants:["p1","p2","p3","p4"],team:false,points:[5,3,1,0]},
  solo8:{name:"8人 個人戦",short:"プレイヤー4人 + CPU4人",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  tag:{name:"2対2 タッグ",short:"P1・P2 VS P3・P4",participants:["p1","p2","p3","p4"],team:true,points:[5,3,1,0],teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  humansVsCpu:{name:"4人 VS CPU4人",short:"PLAYER TEAM VS CPU TEAM",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:true,points:[10,8,6,4,3,2,1,0],teams:{A:["p1","p2","p3","p4"],B:["c5","c6","c7","c8"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  score4:{name:"100点 スコアバトル",short:"各ゲーム0〜100点の合計勝負",participants:["p1","p2","p3","p4"],team:false,points:[],performance:true},
  soloCpu7:{name:"1人 VS CPU7人",short:"PLAYER 1人 + CPU7人",participants:["p1","c2","c3","c4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  scoreCpu7:{name:"1人 VS CPU7人 100点",short:"PLAYER 1人 + CPU7人 / 各ゲーム0〜100点",participants:["p1","c2","c3","c4","c5","c6","c7","c8"],team:false,points:[],performance:true},
  scoreTag:{name:"100点 タッグバトル",short:"P1・P2 VS P3・P4 / 各ゲーム0〜100点",participants:["p1","p2","p3","p4"],team:true,points:[],performance:true,teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  customMix:{name:"人数自由バトル",short:"PLAYER / CPUを自由設定",participants:["p1","c2"],team:false,points:[3,0]},
  free:{name:"1人フリープレイ",short:"好きなゲームだけ遊ぶ",participants:["p1"],team:false,points:[0]}
};

let state=freshState();
let audioCtx=null;
let activeAnimation=null;
let countdownSerial=0;
let activeCountdownLayer=null;
let activeGameRunId=0;
let activeGameIndex=-1;
let gameSessionActive=false;

function freshState(){
  return {
    modeKey:null,
    gameIndex:0,
    freePlay:false,
    freeGameIndex:null,
    playStyle:null,
    playlist:[],
    roundIndex:0,
    records:{
      reaction:{},memory:{},puzzle:{},launch:{},stack:{},breakdance:{},
      crisis:{},factory:{},catcher:{},tidy:{},ski:{},slot:{},rope:{},pk:{},rhythm:{},cut:{},climb:{},errand:{},dontHitMob:{},mobStop:{},overlap:{},shutter:{},cup:{},darts:{},parachute:{},mobCount:{},brake:{},feint:{},bomb:{},overlapMaster:{},jumpingMob:{},heroMaybe:{},popularGame:{},planetEnergy:{},painter:{},bikeJump:{},trampoline:{},mobTrain:{},giantMob:{},wizardMob:{},brawlerMob:{},summonerMob:{},blackjackMob:{},mobIssen:{},crowEscape:{},dancingMob:{},guardianMob:{},mob50m:{},sniperMob:{}
    },
    total:{},
    roundPoints:[],
    cpuTier:{}
  };
}
function pById(id){return PLAYERS.find(p=>p.id===id)}
function mode(){return state.modeKey?MODES[state.modeKey]:null}
function participants(){return mode()?mode().participants.map(pById):[]}
function humans(){return participants().filter(p=>!p.cpu)}
function cpus(){return participants().filter(p=>p.cpu)}
function wait(ms){
  const capturedRun=gameSessionActive?activeGameRunId:null;

  return new Promise(resolve=>{
    setTimeout(()=>{
      // A wait started by a game that has since been abandoned must never
      // resume the old game's async flow and overwrite a newer screen.
      if(
        capturedRun!==null&&
        (
          !gameSessionActive||
          capturedRun!==activeGameRunId
        )
      )return;

      resolve();
    },ms);
  });
}
function rand(min,max){return min+Math.random()*(max-min)}
function randi(min,max){return Math.floor(rand(min,max+1))}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function beep(freq=480,ms=65,vol=.025){try{if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(audioCtx.destination);o.start();setTimeout(()=>o.stop(),ms)}catch(e){}}
function cancelActiveAnimation(){if(activeAnimation){cancelAnimationFrame(activeAnimation);activeAnimation=null}}
function cancelCountdown(){
  countdownSerial++;
  if(activeCountdownLayer&&activeCountdownLayer.isConnected)activeCountdownLayer.remove();
  activeCountdownLayer=null;
}
function invalidateGameRun(){
  gameSessionActive=false;
  activeGameIndex=-1;
  activeGameRunId++;
  cancelCountdown();
}
function beginGameRun(gameIndex=-1){
  gameSessionActive=true;
  activeGameIndex=gameIndex;
  activeGameRunId++;
  return activeGameRunId;
}
function isGameRunValid(runId){
  return gameSessionActive&&runId===activeGameRunId;
}
function gameTop(){requestAnimationFrame(()=>{try{window.scrollTo(0,0)}catch(e){};screen.scrollTop=0;});}
function gameFit(){
  screen.classList.add("gameplay-fit");
  gameTop();
}
function clearGameFit(){
  screen.classList.remove("gameplay-fit");
}
function imgTag(p,cls="avatar"){return `<img draggable="false" class="${cls}" src="${p.img}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">`}

homeBtn.addEventListener("click",()=>{
  cancelActiveAnimation();
  invalidateGameRun();
  renderHome();
});
resetBtn.addEventListener("click",()=>{
  cancelActiveAnimation();
  invalidateGameRun();
  if(state.freePlay && state.freeGameIndex!==null){startFreeGame(state.freeGameIndex);return;}

  if(state.modeKey){
    const k=state.modeKey;
    const style=state.playStyle;
    const list=[...state.playlist];

    state=freshState();
    state.modeKey=k;
    state.playStyle=style;
    state.playlist=list;
    state.roundIndex=0;
    initTotals();

    if(list.length)renderModeLobby();
    else renderPlayStyleSelect();
  }else renderHome();
});

function renderHome(){
  clearGameFit();
  cancelActiveAnimation();
  invalidateGameRun();
  state=freshState();
  screen.innerHTML=`
    <section class="hero">
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>49 MINI<br>GAMES</h1><p>49種のミニゲーム。各モードでNORMALかCUSTOMを選んで遊べます。</p></div>
      <div class="hero-mark">MOB</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>MODE SELECT</h3><span class="tag">9 MODES</span></div>
      <div class="mode-grid">
        <button class="mode-card" data-mode="solo4"><span class="mode-no">MODE 01</span><b>4人 個人戦</b><span>プレイヤー1〜4で個人順位を競う</span></button>
        <button class="mode-card" data-mode="solo8"><span class="mode-no">MODE 02</span><b>8人 個人戦</b><span>プレイヤー4人 + CPU4人</span></button>
        <button class="mode-card" data-mode="tag"><span class="mode-no">MODE 03</span><b>2対2 タッグ</b><span>P1・P2 VS P3・P4</span></button>
        <button class="mode-card" data-mode="humansVsCpu"><span class="mode-no">MODE 04</span><b>4人 VS CPU4人</b><span>PLAYER TEAM VS CPU TEAM</span></button>
        <button class="mode-card score-mode-card" data-mode="score4"><span class="mode-no">MODE 05</span><b>100点 スコアバトル</b><span>各ゲーム0〜100点 / 選択ゲーム数で最大点が変化</span></button>
        <button class="mode-card" data-mode="soloCpu7"><span class="mode-no">MODE 06</span><b>1人 VS CPU7人</b><span>P1ひとりでCPU7人に挑戦</span></button>
        <button class="mode-card score-mode-card" data-mode="scoreTag"><span class="mode-no">MODE 07</span><b>100点 タッグバトル</b><span>P1・P2 VS P3・P4 / 得点合計勝負</span></button>
        <button class="mode-card score-mode-card" data-mode="scoreCpu7"><span class="mode-no">MODE 08</span><b>1人 VS CPU7人 100点</b><span>P1ひとりでCPU7人とスコア勝負</span></button>
        <button class="mode-card mix-mode-card" data-mode="customMix"><span class="mode-no">MODE 09</span><b>人数自由バトル</b><span>PLAYERとCPUを合計8人まで自由設定</span></button>
      </div>
    </section>
    <section class="panel free-play-panel">
      <div class="panel-head"><div><span class="kicker mini">1 PLAYER</span><h3>好きなゲームを1人で遊ぶ</h3></div><span class="tag">FREE PLAY</span></div>
      <p class="note">順位・ポイントなし。プレイヤー1で好きなゲームだけ遊べます。</p>
      <div class="free-game-grid">
        ${GAMES.map((g,i)=>`<button class="free-game-card" data-free-game="${i}"><span>GAME ${g.no}</span><b>${g.title}</b><small>${g.sub}</small></button>`).join("")}
      </div>
    </section>
    <section class="panel flat"><h3>MINI GAMES</h3><div class="game-list">${GAMES.map(g=>`<div class="game-row"><div class="game-no">${g.no}</div><div><b>${g.title}</b><br><span>${g.sub}</span></div><span>GAME ${g.no}</span></div>`).join("")}</div></section>`;
  screen.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>selectMode(b.dataset.mode)));
  screen.querySelectorAll("[data-free-game]").forEach(b=>b.addEventListener("click",()=>startFreeGame(Number(b.dataset.freeGame))));
}

function startFreeGame(gameIndex){
  state=freshState();
  state.modeKey="free";
  state.freePlay=true;
  state.freeGameIndex=gameIndex;
  state.gameIndex=gameIndex;
  initTotals();
  showGameIntro(gameIndex);
}

function selectMode(key){
  state=freshState();
  state.modeKey=key;
  if(key==="customMix"){
    renderMixSetup();
    return;
  }
  initTotals();
  renderPlayStyleSelect();
}
function renderMixSetup(){
  clearGameFit();
  let humanCount=1,cpuCount=1;
  const humanIds=["p1","p2","p3","p4"];
  const cpuIds=["c2","c3","c4","c5","c6","c7","c8"];
  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">MODE 09</span><h2>人数自由バトル</h2><p class="lead">PLAYERとCPUを自由に設定。合計最大8人。</p></div><div class="game-badge"><span id="mixTotal">2</span>/8</div></div>
    <section class="panel mix-setup-panel">
      <div class="mix-counter"><div><span>PLAYER</span><b id="mixHumans">1</b></div><div class="mix-buttons"><button data-mix="h-">−</button><button data-mix="h+">＋</button></div></div>
      <div class="mix-counter cpu"><div><span>CPU</span><b id="mixCpus">1</b></div><div class="mix-buttons"><button data-mix="c-">−</button><button data-mix="c+">＋</button></div></div>
      <p class="note">PLAYERは1〜4人。CPUは0〜7人。合計2〜8人で対戦できます。</p>
    </section>
    <section class="panel flat"><h3>ENTRY PREVIEW</h3><div id="mixPreview" class="player-grid"></div></section>
    <button id="mixDecide" class="primary">この人数で決定</button>`;
  const hEl=document.getElementById("mixHumans"),cEl=document.getElementById("mixCpus"),tEl=document.getElementById("mixTotal"),preview=document.getElementById("mixPreview"),decide=document.getElementById("mixDecide");
  const redraw=()=>{
    const total=humanCount+cpuCount;
    hEl.textContent=humanCount;cEl.textContent=cpuCount;tEl.textContent=total;
    const ids=[...humanIds.slice(0,humanCount),...cpuIds.slice(0,cpuCount)];
    preview.innerHTML=ids.map(id=>{const p=pById(id);return `<div class="player-card ${p.cpu?"team-cpu":"team-human"}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>${p.cpu?"CPU":`PLAYER ${p.no}`}</span></div></div>`}).join("");
    decide.disabled=total<2||total>8;
  };
  screen.querySelectorAll("[data-mix]").forEach(b=>b.addEventListener("click",()=>{
    const k=b.dataset.mix;
    if(k==="h-")humanCount=Math.max(1,humanCount-1);
    if(k==="h+")humanCount=Math.min(4,humanCount+1);
    if(k==="c-")cpuCount=Math.max(0,cpuCount-1);
    if(k==="c+")cpuCount=Math.min(7,cpuCount+1);
    if(humanCount+cpuCount>8){if(k==="h+")humanCount--;if(k==="c+")cpuCount--;}
    redraw();
  }));
  decide.addEventListener("click",()=>{
    const total=humanCount+cpuCount;if(total<2||total>8)return;
    MODES.customMix.participants=[...humanIds.slice(0,humanCount),...cpuIds.slice(0,cpuCount)];
    MODES.customMix.points=pointsForCount(total);
    MODES.customMix.short=`PLAYER ${humanCount}人 + CPU ${cpuCount}人`;
    state.modeKey="customMix";initTotals();renderPlayStyleSelect();
  });
  redraw();gameTop();
}
function initTotals(){participants().forEach(p=>state.total[p.id]=0)}
function teamOf(id){
  if(!mode().team)return "";
  return mode().teams.A.includes(id)?"A":"B";
}
function teamName(id){
  if(!mode().team)return pById(id).cpu?"CPU":"PLAYER";
  return mode().teamNames[teamOf(id)];
}
function pointsText(){return mode().points.map((p,i)=>`${i+1}位 ${p}`).join(" / ")}
function roundGameIndex(){return state.playlist[state.roundIndex] ?? state.gameIndex}
function roundCount(){return state.freePlay?1:state.playlist.length}
function maxScoreTotal(){return roundCount()*100}
function pointsForCount(n){
  const table={2:[3,0],3:[4,2,0],4:[5,3,1,0],5:[7,5,3,1,0],6:[8,6,4,2,1,0],7:[9,7,5,3,2,1,0],8:[10,8,6,4,3,2,1,0]};
  return table[n]||Array.from({length:n},(_,i)=>Math.max(0,n-i-1));
}
function currentRoundLabel(){return state.freePlay?"SOLO":`ROUND ${state.roundIndex+1} / ${roundCount()}`}



function renderPlayStyleSelect(){
  clearGameFit();
  const m=mode();
  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">PLAY STYLE</span><h2>${m.name}</h2><p class="lead">${m.short}</p></div>
      <div class="game-badge">${m.participants.length}人</div>
    </div>

    <div class="style-select-grid">
      <button id="normalStyle" class="style-select-card normal" type="button">
        <span>NORMAL</span>
        <b>順番に全種目</b>
        <small>GAME 1 → 49 を順番にプレイ</small>
      </button>
      <button id="customStyle" class="style-select-card custom" type="button">
        <span>CUSTOM</span>
        <b>自由にゲーム選択</b>
        <small>重複OK / 3〜10ゲーム</small>
      </button>
    </div>

    <section class="panel flat">
      <h3>49 MINI GAMES</h3>
      <div class="compact-game-grid">
        ${GAMES.map(g=>`<div><b>${g.no}</b><span>${g.title}</span></div>`).join("")}
      </div>
    </section>
  `;
  gameTop();

  document.getElementById("normalStyle").addEventListener("click",()=>{
    state.playStyle="normal";
    state.playlist=GAMES.map((_,i)=>i);
    state.roundIndex=0;
    renderModeLobby();
  });

  document.getElementById("customStyle").addEventListener("click",()=>{
    state.playStyle="custom";
    state.playlist=[];
    state.roundIndex=0;
    renderCustomPicker();
  });
}

function renderCustomPicker(){
  clearGameFit();
  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">CUSTOM</span><h2>ゲームを選択</h2><p class="lead">同じゲームを何回選んでもOK。3〜10個まで。</p></div>
      <div class="game-badge"><span id="customCount">${state.playlist.length}</span>/10</div>
    </div>

    <section class="panel custom-order-panel">
      <div class="panel-head"><h3>PLAY ORDER</h3><span class="tag">3〜10</span></div>
      <div id="customOrder" class="custom-order"></div>
      <div class="custom-actions">
        <button id="undoCustom" class="secondary small-btn" type="button">1つ戻す</button>
        <button id="clearCustom" class="secondary small-btn" type="button">全消去</button>
      </div>
    </section>

    <section class="panel">
      <h3>追加するゲーム</h3>
      <div class="custom-game-grid">
        ${GAMES.map((g,i)=>`<button class="custom-game-add" data-add-game="${i}" type="button"><span>GAME ${g.no}</span><b>${g.title}</b><small>タップで追加</small></button>`).join("")}
      </div>
    </section>

    <button id="customDecide" class="primary" type="button">この内容で決定</button>
  `;

  const order=document.getElementById("customOrder");
  const count=document.getElementById("customCount");
  const decide=document.getElementById("customDecide");

  const redraw=()=>{
    order.innerHTML=state.playlist.length
      ? state.playlist.map((idx,pos)=>`<button class="custom-order-chip" data-remove-pos="${pos}" type="button"><span>${pos+1}</span>${GAMES[idx].title}<small>×</small></button>`).join("")
      : `<p class="note">まだ選択されていません。</p>`;
    count.textContent=state.playlist.length;
    decide.disabled=state.playlist.length<3||state.playlist.length>10;
    decide.textContent=state.playlist.length<3
      ? `あと${3-state.playlist.length}個選択`
      : `この${state.playlist.length}ゲームで決定`;

    order.querySelectorAll("[data-remove-pos]").forEach(b=>b.addEventListener("click",()=>{
      state.playlist.splice(Number(b.dataset.removePos),1);
      redraw();
    }));
  };

  screen.querySelectorAll("[data-add-game]").forEach(b=>b.addEventListener("click",()=>{
    if(state.playlist.length>=10)return;
    state.playlist.push(Number(b.dataset.addGame));
    beep(620,35,.015);
    redraw();
  }));

  document.getElementById("undoCustom").addEventListener("click",()=>{
    state.playlist.pop();
    redraw();
  });
  document.getElementById("clearCustom").addEventListener("click",()=>{
    state.playlist=[];
    redraw();
  });
  decide.addEventListener("click",()=>{
    if(state.playlist.length<3||state.playlist.length>10)return;
    state.roundIndex=0;
    renderModeLobby();
  });

  redraw();
  gameTop();
}

function renderModeLobby(){
  clearGameFit();
  const m=mode();
  const scoreRules=`
    <div class="score-rule-grid">
      <div><b>反射神経</b><span>0.150秒以下=100 / 0.300秒=50 / 0.500秒以上=0</span></div>
      <div><b>記憶力</b><span>正解数 × 10点</span></div>
      <div><b>ナンバープレート12</b><span>2.50秒=100 / 6.00秒以上=0</span></div>
      <div><b>フィギュア飛ばし</b><span>2000m=100 / 0m=0</span></div>
      <div><b>グラグラモブくん</b><span>30体以上=100 / 0体=0</span></div>
      <div><b>1990世界大会</b><span>世界1位=100 / 40位=0</span></div>
      <div><b>モブくん危機一髪</b><span>20回以上=100 / 0回=0</span></div>
      <div><b>モブくん人形大人気</b><span>25箱以上=100 / 0箱=0</span></div>
      <div><b>モブくんキャッチャー</b><span>1体=10 / 10体以上=100</span></div>
      <div><b>モブくん整理整頓</b><span>一致率0〜100%=そのまま点数</span></div>
      <div><b>モブくんスキージャンプ</b><span>1000m=100 / 200m以下=0</span></div>
      <div><b>モブくんスロット</b><span>3000コイン以上=100 / 1000以下=0</span></div>
      <div><b>モブ跳び</b><span>30回以上=100 / 0回=0</span></div>
      <div><b>モブくんPK</b><span>10セーブ=100 / 1セーブ=10</span></div>
      <div><b>モブくん椅子取りゲーム</b><span>ベスト反応0.180秒以下=100</span></div>
      <div><b>モブくんカットゲーム</b><span>3回の誤差から0〜100</span></div>
      <div><b>モブくん木登り</b><span>700m以上=100 / 0m=0</span></div>
      <div><b>お使いモブくん</b><span>残金0円=100 / 10円=90 / 100円以上=0</span></div>
      <div><b>モブくんを叩かないで</b><span>モグラ12体以上=100 / MOBを叩くと終了</span></div>
      <div><b>モブくんストップ</b><span>右端ギリギリ=100 / 落下=0</span></div>
      <div><b>重なる瞬間を狙え！</b><span>一致率100%=100点</span></div>
      <div><b>モブくんシャッターチャンス</b><span>頂点誤差0秒=100 / 0.15秒以上=0</span></div>
      <div><b>コップ限界チャレンジ</b><span>限界ギリギリ=100 / あふれたら0</span></div>
      <div><b>ダーツ1投勝負</b><span>中心=100 / 外周=0</span></div>
      <div><b>モブくんとパラシュート</b><span>中央着地=100 / 激突=0</span></div>
      <div><b>モブくんは何人？</b><span>正解=100 / 誤差1人=75</span></div>
      <div><b>急ブレーキ</b><span>衝突せず0m差=100 / 衝突=0</span></div>
      <div><b>フェイント反射神経</b><span>0.150秒以下=100 / フェイント押し=0</span></div>
      <div><b>爆弾チキンレース</b><span>5.000秒→0.000秒 / 0秒直前ほど100点</span></div>
      <div><b>重なりマスター</b><span>4円一致100%=100点</span></div>
      <div><b>ジャンピングモブくん</b><span>500m以上=100点</span></div>
      <div><b>モブくんは勇者かも</b><span>勇者ポイントがそのまま0〜100点</span></div>
      <div><b>あの人気者のゲーム</b><span>20体踏みつけ=100点</span></div>
      <div><b>この星を..！</b><span>100km=100点</span></div>
      <div><b>モブくんは画家志望</b><span>猫輪郭一致率100%=100点</span></div>
      <div><b>バイクでジャンピング</b><span>2000m=100点</span></div>
      <div><b>ダイナミックトラポリン</b><span>3回目2000m=100点</span></div>
      <div><b>モブくん列車出発進行！</b><span>2.80秒以下=100点 / 衝突=0点</span></div>
      <div><b>巨大モブくん大進撃</b><span>30棟=100点</span></div>
      <div><b>魔法使いモブくん</b><span>闇炎20個消去=100点</span></div>
      <div><b>モブくんは喧嘩番長</b><span>30KO 10秒以内=100点</span></div>
      <div><b>モブくんは召喚師</b><span>500体KO=100点</span></div>
      <div><b>ブラックジャックの決戦</b><span>21=100点</span></div>
      <div><b>モブくん一閃</b><span>3回合計300pt=100点</span></div>
      <div><b>カラスから逃げろ！</b><span>20秒生存=100点</span></div>
      <div><b>ダンシングモブくん</b><span>描画評価1〜100点</span></div>
      <div><b>モブくんはガーディアン</b><span>残耐久率1〜100点 / 全壊0点</span></div>
      <div><b>モブくん50m走</b><span>4.50秒以下=100 / 12.50秒以上=0</span></div>
      <div><b>モブくんはスナイパー</b><span>1発25点 / 4発100点</span></div>
    </div>`;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">${state.playStyle==="custom"?"CUSTOM":"NORMAL"}</span><h2>${m.name}</h2><p class="lead">${m.short}</p></div>
      <div class="game-badge">${state.playlist.length}戦</div>
    </div>

    <section class="panel">
      <div class="panel-head"><h3>ENTRY</h3><span class="tag">${m.performance?"SCORE BATTLE":m.team?"TEAM BATTLE":"INDIVIDUAL"}</span></div>
      <div class="player-grid">
        ${participants().map(p=>`<div class="player-card ${m.team?(teamOf(p.id)==="A"?"team-a":"team-b"):(p.cpu?"team-cpu":"team-human")}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>${p.cpu?"CPU":`PLAYER ${p.no}`}${m.team?` / ${teamName(p.id)}`:""}</span></div></div>`).join("")}
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h3>GAME ORDER</h3><span class="tag">${state.playlist.length} GAMES</span></div>
      <div class="lobby-playlist">
        ${state.playlist.map((idx,i)=>`<div><span>${i+1}</span><b>${GAMES[idx].title}</b></div>`).join("")}
      </div>
    </section>

    ${m.performance
      ? `<section class="panel score-rule-panel"><h3>0〜100 SCORE RULE</h3>${scoreRules}<p class="note" style="margin-top:9px">選んだ${state.playlist.length}ゲームの合計点で順位を決定。最大${maxScoreTotal()}点。</p></section>`
      : `<section class="panel"><h3>POINT RULE</h3><div class="point-strip">${m.points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div><p class="note" style="margin-top:9px">同記録は同着。同着時は同順位ポイント。</p></section>`}

    <section class="panel flat"><h3>PLAY ORDER</h3><p class="lead">${humans().map(p=>esc(p.name)).join(" → ")}${cpus().length?" → CPUは高速処理":""}</p></section>
    <button id="modeStart" class="primary">START</button>
  `;
  gameTop();
  document.getElementById("modeStart").addEventListener("click",()=>{
    state.roundIndex=0;
    showGameIntro(state.playlist[0]);
  });
}

function scoreRuleForGame(index){
  return [
    "0.150秒以下=100点 / 0.300秒=50点 / 0.500秒以上=0点",
    "正解数×10点 / 10枚正解=100点",
    "2.50秒=100点 / 6.00秒以上=0点",
    "2000m=100点 / 0m=0点",
    "30体以上=100点 / 0体=0点",
    "世界1位=100点 / 世界40位=0点",
    "20回以上=100点 / 0回=0点",
    "25箱以上=100点 / 0箱=0点",
    "景品価値10以上=100点 / 0=0点",
    "見本との一致率がそのまま0〜100点",
    "1000m=100点 / 200m以下=0点",
    "3000コイン以上=100点 / 1000コイン以下=0点",
    "30体回避=100点 / 0体=0点",
    "10本セーブ=100点 / 1本=10点",
    "0.180秒以下=100点 / 0.210秒≈90点 / 0.300秒≈55点",
    "3回のカット精度を0〜100点化",
    "700m以上=100点 / 0m=0点",
    "残金0円=100点 / 残金10円=90点 / 残金100円以上=0点",
    "モグラ12体以上=100点 / 0体=0点",
    "棒の端に近いほど高得点 / 落下=0点",
    "一致率100%=100点 / 0%=0点",
    "頂点誤差0秒=100点 / 0.150秒以上=0点",
    "限界ギリギリ=100点 / あふれたら0点",
    "中心距離0%=100点 / 外周100%=0点",
    "！から3.000秒後が100点 / 誤差1.000秒以上=0点",
    "正解=100点 / 誤差1人=75 / 2人=50 / 3人=25",
    "停止差0m=100点 / 10m以上または衝突=0点",
    "0.150秒以下=100点 / 0.300秒=50点 / フェイント押し=0点",
    "チキンスコア10000=100点 / 爆発=0点",
    "4円一致率100%=100点 / TIME UP=0点",
    "500m以上=100点 / 0m=0点",
    "勇者ポイント0〜100がそのまま得点",
    "20体以上=100点 / 0体=0点",
    "100km到達=100点 / 0km=0点",
    "猫の顔型との一致率100%=100点",
    "2000m=100点 / 0m=0点",
    "3回目2000m=100点 / 0m=0点",
    "2.80秒以下=100点 / 6.00秒以上または衝突=0点",
    "30棟破壊=100点 / 0棟=0点",
    "闇の炎20個消去=100点 / 0個=0点",
    "30人撃破タイム / 10.00秒以内=100点 / 25.00秒=0点",
    "黒スライム500体撃破=100点 / 0体=0点",
    "21=100点 / 22→1、23→2の循環ルール",
    "3回合計300pt=100点 / 0pt=0点",
    "20.00秒生存=100点 / 0秒=0点",
    "描いた量・広がり・複雑さから1〜100点",
    "残った総耐久率が1〜100点 / 全壊してモブくん被弾=0点",
    "4.50秒以下=100点 / 12.50秒以上=0点",
    "1発命中=25点 / 4発命中=100点"
  ][index];
}

function showGameIntro(index){
  clearGameFit();
  state.gameIndex=index;
  const g=GAMES[index];
  let rules="";

  if(index===0){
    rules=`<li>READY? → 3・2・1 → ランダム待機。</li><li>モブくんが大きく出た瞬間にタップ。</li><li>0.001秒単位で計測。</li>`;
  }else if(index===1){
    rules=`<li>記憶力ゲームの10キャラクターが順番に光ります。</li><li>同じ順番でタップ。間違えた時点で終了。</li>`;
  }else if(index===2){
    rules=`<li>1〜12をランダム配置。</li><li>1 → 12の順番だけ入力可能。</li><li>12を消した瞬間のタイム。</li>`;
  }else if(index===3){
    rules=`<li>高速横ゲージ → 円形ゲージ。</li><li>横ゲージの両端約10%は「？」で隠れます。</li><li>最大2000m。</li>`;
  }else if(index===4){
    rules=`<li>1体ずつつかんで積みます。</li><li>10秒。時間が経つほど風が強化。</li>`;
  }else if(index===5){
    rules=`<li>10秒間の4択。</li><li>左上・右上・左下・右下のどこか1つだけが1990。</li><li>1990=1周、5連続でBONUS +1周、罠は-1周。</li><li>15周以上で世界1位級。</li>`;
  }else if(index===6){
    rules=`<li>3体を少し近めの横一列に配置。</li><li>足元の小さいエネルギーをP1 → P2 → P3が順番にジャンプ。</li><li>成功するほど急激に高速化。</li>`;
  }else if(index===7){
    rules=`<li>ベルトコンベアの箱を10秒で完成。</li><li>人形入り箱へさらに人形を入れると不良品として破棄。</li>`;
  }else if(index===8){
    rules=`<li>高速アーム幅ゲージをタップで停止。</li><li>広く止めるほど取りやすい。</li><li>左右位置と降下深度で本当にアーム内にいる景品だけを取得。</li><li>レア景品は1体で3体分。</li>`;
  }else if(index===9){
    rules=`<li>上が毎回ランダムな見本、下が操作エリア。</li><li>7体は最初に中央へ集まっています。</li><li>自動吸着なし。10秒で見本へ近づけます。</li><li>判定はシビア。</li>`;
  }else if(index===10){
    rules=`<li>3・2・1で長いスロープを滑走。</li><li>黄色いJUMPリップ付近だけジャンプ可能。</li><li>押さない・遅すぎると0mで落下。</li><li>最大1000m。</li>`;
  }else if(index===11){
    rules=`<li>1000コイン開始 / 1回100コイン / 10秒。</li><li>記憶力ゲームの10キャラクターがリールに登場。</li><li>最初の2リールはかなり揃いやすく、3つ目が勝負。</li><li>同じキャラクター3つで配当。</li>`;
  }else if(index===12){
    rules=`<li>3・2・1後、左右どちらからも様々なモブくんが走ってきます。</li><li>ジャンプ中の連打は無効。着地してから次のジャンプが可能。</li><li>相手と重なる瞬間に十分な高さまで跳べていないと接触終了。</li><li>基本はどんどん高速化。たまに遅いモブくんも混ざります。</li><li>30体回避で100点。</li>`;
  }else if(index===13){
    rules=`<li>3・2・1後、様々なモブくんが合計10本シュート。</li><li>左スワイプ / 中央タップ / 右スワイプでセーブ。</li><li>基本速度は少し遅め。たまに高速シュートが混ざります。</li><li>10本全部止めれば100点。</li>`;
  }else if(index===14){
    rules=`<li>プレイヤー1人 + CPU4人で椅子取り反射勝負。</li><li>中央の椅子の周りで♪が流れている間は待機。</li><li><strong>♪が消えた瞬間</strong>に中央の椅子をタップ。</li><li>早押しはFOUL。</li><li>全2回。1回目はCPU最速が約0.30秒、2回目は約0.21秒が勝負ライン。</li><li>2回のうち<strong>良かったタイム</strong>を最終記録にします。</li>`;
  }else if(index===15){
    rules=`<li>「右側を○%残せ！」と表示。</li><li>長い棒を縦スワイプしてカット。</li><li>右側に残った割合と指定%の誤差を判定。</li><li>3回の平均精度で0〜100点。</li>`;
  }else if(index===16){
    rules=`<li>3・2・1後、10秒間木登り。</li><li>短いゲージのマーカーが左右へ移動。</li><li>中央に近い時ほど1タップで大きく登ります。</li><li>700m以上で100点。</li>`;
  }else if(index===17){
    rules=`<li>1000円を持って3・2・1スタート。</li><li>食材・お菓子など100種類から毎回30商品。</li><li>3円〜250円の商品をタップ購入。</li><li>10秒で1000円ぴったり使い切れば100点。</li>`;
  }else if(index===18){
    rules=`<li>3・2・1後、9個の穴からモグラが出現。</li><li>1〜6体が一気に出ることがあります。</li><li>モグラをタップすると+1。</li><li>モグラと一緒にモブくんが混ざって出ることもあります。</li><li>モブくんを1回でも叩いたらその場で終了。</li><li>10秒。モグラ12体以上で100点。</li>`;
  }else if(index===19){
    rules=`<li>横長の棒の左端にモブくん。</li><li>モブくんを左へ引っ張り、離すと発射。</li><li>引っ張る距離が長いほど遠くへ進みます。</li><li>右端ギリギリで止めるほど高得点。</li><li>棒から落ちたら0点。</li>`;
  }else if(index===20){
    rules=`<li>3・2・1で2つの円が毎回ランダムな速度・振幅・向きで左右移動。</li><li>10秒以内に完全に重なる瞬間をタップ。</li><li>毎プレイ必ず違う動きですが、どこかで完全一致するタイミングがあります。</li><li>円の重なり面積を0.1%単位で計算。TIME UPは0点。</li>`;
  }else if(index===21){
    rules=`<li>最初に3・2・1で見本ジャンプを1回確認。</li><li>次の3・2・1で本番。カメラのファインダー・フォーカス枠・露出表示が出ます。</li><li>モブくんが一番高い瞬間にシャッターを切ります。</li><li>撮影時はフラッシュではなくシャッター幕・フォーカス固定・撮影写真の演出。</li><li>頂点との時間誤差を記録。0.000秒に近いほど高得点。</li>`;
  }else if(index===22){
    rules=`<li>3・2・1後、水が自動で注がれます。</li><li>操作はSTOPだけ。</li><li>表面張力でコップの縁より少し上まで耐えます。</li><li>限界ギリギリほど高得点。あふれたら0点。</li>`;
  }else if(index===23){
    rules=`<li>的は固定。</li><li>3・2・1後、縦ゲージの中央ラインでSTOP。</li><li>続けて横ゲージの中央ラインでSTOP。</li><li>2軸から命中地点を決定。中心からの距離が小さいほど上位。</li>`;
  }else if(index===24){
    rules=`<li>3・2・1後、モブくんが高空から落下。</li><li>途中で中央に「！」が出ます。</li><li><strong>！が出てから3.000秒後</strong>にパラシュートを開くと中央へ着地。</li><li>3.000秒との時間誤差が小さいほど高得点。</li><li>遅れすぎると地面激突。カメラはモブくんを追跡。</li>`;
  }else if(index===25){
    rules=`<li>3・2・1後、21〜30体のモブくんを3秒表示。</li><li>消えた後、21〜30から人数を回答。</li><li>正解で100点。誤差が小さいほど高得点。</li>`;
  }else if(index===26){
    rules=`<li>3・2・1後、モブくんの車が高速走行。</li><li>突然障害物が出現。</li><li>BRAKEをタップした瞬間に車はピタッと停止。</li><li>衝突せず障害物ギリギリほど高得点。</li><li>カメラが車を追尾。</li>`;
  }else if(index===27){
    rules=`<li>3・2・1後にREADY。</li><li>G0 / G00 / NOW / MOVE / GO?などのフェイント。</li><li>本物のGO!もフェイントと同じ色・同じ演出。</li><li>本物だけを見分けて素早くタップ。フェイント押しは0点。</li>`;
  }else if(index===28){
    rules=`<li>3・2・1後、爆弾が5.000秒から0.000秒へカウント。</li><li>好きなタイミングでSTOP。</li><li>0.000秒に近いほど高得点。</li><li>0秒を超えたら爆発して0点。</li>`;
  }else if(index===29){
    rules=`<li>「重なる瞬間を狙え！」のMASTER版。</li><li>4つの円がそれぞれ別の速度で左右移動。</li><li>10秒以内に4つ全部が重なる瞬間をタップ。</li><li>4円の広がりから一致率を計算。100.0%を狙います。</li>`;
  }else if(index===30){
    rules=`<li>3・2・1後10秒。</li><li>モブくんはバネのホッピングマシーンに乗っています。</li><li>← →で左右移動、JUMPでジャンプ。</li><li>ランダムに並ぶ台を乗り継いで上へ。高い台ほど横幅が短くなります。</li><li>長距離はカメラが上方向へ追跡。500m以上で100点。</li>`;
  }else if(index===31){
    rules=`<li>「あなたは、、勇者様！？」のナレーションから3・2・1。</li><li>10秒間、4つの項目から1つを選び続けます。</li><li>選ぶたび4項目が全部入れ替わり、同じ項目は再登場しません。</li><li>強化と罠が合計50種。必ず1つ以上は強化。</li><li>勇者シリーズは高得点。弱点・呪いなどは弱体化。</li>`;
  }else if(index===32){
    rules=`<li>3・2・1後10秒の横スクロールアクション。</li><li>← →で移動、JUMPでジャンプ。</li><li>モグラは最大4体。上から踏むと+1体、倒すと1体リポップ。</li><li>カメラはモブくんを左右に追跡。</li><li>20体踏みつけで100点。</li>`;
  }else if(index===33){
    rules=`<li>3・2・1後、円形ゲージでエネルギーを3回チャージ。</li><li>中の玉が最大まで膨らみ、外周ゲージと同じ大きさになった瞬間をタップ。</li><li>3回の合計精度で最終エネルギーサイズが決定。最大時は画面いっぱい近くまで巨大化しカメラが引きます。</li><li>「放つ！」でエネルギーが頭上へ上がってから右へ発射。</li><li>カメラが追跡し、高層ビルを破壊しながら最大100km進みます。</li>`;
  }else if(index===34){
    rules=`<li>3・2・1後、猫の顔型を指で1周なぞります。</li><li>1回勝負。線への近さ・輪郭をどれだけ覆えたか・始点と終点のつながりを判定。</li><li>青い線が自分の描いた軌跡。</li><li>猫の輪郭との一致率がそのまま記録になります。</li>`;
  }else if(index===35){
    rules=`<li>3・2・1後、まず約3秒間高速走行。</li><li>その後、大きなジャンプ台が前方から見えてきます。</li><li>ジャンプ台中央の太いCENTERラインにバイクが来た瞬間をタップ。</li><li>中央とのタイミング誤差が小さいほど遠くへ飛びます。</li><li>ジャンプ後はカメラが追跡。最高2000m。</li>`;
  }else if(index===36){
    rules=`<li>3・2・1後、モブくんが高いところからトランポリンへ落下。</li><li>着地するとトランポリンが深く沈み、その状態で横ゲージが出ます。</li><li>STOPするまでモブくんは沈んだまま。動くマーカーを中央で止めるほど高精度。</li><li>1回目最大500m、2回目最大1000m、3回目最大2000m。</li><li>前の回で失った%は次の回へ累積。正式記録は3回目の高さです。</li>`;
  }else if(index===37){
    rules=`<li>3・2・1後、5秒間だけ線路を描けます。</li><li>列車が乗っている左側の短い線路から、右側のGOAL旗まで線をつなぎます。</li><li>岩・水・木を避けて線を描いてください。</li><li>GOAL周辺には障害物が出ない安全エリアがあります。</li><li>5秒後にGO！ 障害物にぶつかると0点。ゴールタイムを競います。</li>`;
  }else if(index===38){
    rules=`<li>巨大モブくんが自動で進撃し、高層ビルを次々破壊します。</li><li>エネルギーは100から開始。</li><li>円形エネルギーのストップウォッチを<strong>1.000秒ピッタリ</strong>でタップ。</li><li>1.000秒との誤差×100だけエネルギー減少。例：0.500秒差なら-50。</li><li>エネルギーが0になるまでに破壊したビル数が記録。30棟=100点。</li>`;
  }else if(index===39){
    rules=`<li>田舎町へ闇の炎が降ってきます。前バージョンより少し遅くし、円で囲む余裕を増やしています。小さなモブくん達は逃げ回っています。</li><li>闇の炎の周りを指で円形に囲むと、魔法のステッキが反応して炎を消します。</li><li>民も低確率で小さなエネルギー弾を撃ち、闇の炎をほんの少しだけ減速させます。</li><li>大きな闇の炎も出現。大きい炎は遅め。炎を消せなくてもモブくんに当たらなければ継続。</li><li>10秒勝負。20個消去=100点。後半ほど落下速度・数・同時出現数が上がります。</li>`;
  }else if(index===40){
    rules=`<li>黒モブくん30人を全員倒すまでのタイムアタック。</li><li>左右には移動限界があります。敵は基本的に教室のドアからテンポよく登場し、1波で最大10人。</li><li>27人目までは通常の黒モブくん。最後の3人は「他のクラスの番長」で10回攻撃しないと倒せません。</li><li>敵もたまに攻撃。HPダメージはありませんが、食らうと少し吹き飛ばされます。</li><li>必殺PUNCHは10KOで解禁、ゲーム中1回だけ。番長も一撃。10.00秒以内=100点。</li>`;
  }else if(index===41){
    rules=`<li>最初の7秒で、画面の大部分を使ってモンスターを自由に描きます。</li><li>眼も含めて全部自分で描きます。戦闘開始時は元の描画・枠・召喚師表示をすべて消し、描いた召喚獣だけが残ります。</li><li>描いたサイズを統一せず、その大きさのまま中央から戦闘開始。</li><li>普段は部位攻撃・ジャンプ・高速移動・分身などで連続攻撃。時々、巨大エネルギー・炎ブレス・落雷・レーザー・メテオなどの一掃技を使用。</li><li>左右から大量の黒スライムが襲来する10秒オート無双。500体KO=100点。</li>`;
  }else if(index===42){
    rules=`<li>1〜13のモブくんカード13枚を最初に表向きで確認。</li><li>3・2・1後、5秒間カードがランダムに位置をシャッフル。</li><li>最後の1秒はカードが暗くなって「？」だけになりますが、位置移動は続きます。</li><li>終了後、まず2枚選択。選んだカードはその場で必ず表向きになり、数字とモブくんを確認できます。</li><li>21でなければ「もう1枚」か「FINISH」。22→1、23→2の循環方式。</li>`;
  }else if(index===43){
    rules=`<li>巨大な木が上から3回落下します。</li><li>木の中央には白いCENTER帯。画面中央のSLASHライン通過時にタップ。</li><li>1回ごとに0〜100点。木は真っ二つになり強い一閃演出。</li><li>3回の合計ポイントが正式記録。最大300pt。</li>`;
  }else if(index===44){
    rules=`<li>ランダム配置された空飛ぶ4体のカラスから20秒逃げ切るゲーム。</li><li>← →とJUMPのみ。2段ジャンプ可能。5段階に配置された大量のテーブル・木箱を上へ登れます。</li><li>カラスの当たり判定は見た目よりかなり小さく、実際に接触するくらい近づいた時だけ捕まります。</li><li>カラスは障害物を貫通。5秒で同速、8秒以降はプレイヤーより速いが、急旋回とブレーキが苦手。</li>`;
  }else if(index===45){
    rules=`<li>7秒間、中央のモブくんの周りに盛り上がる絵を好きなだけ描きます。</li><li>時間終了で「レッツ、ダンシング！」。モブくんが跳ねたり走ったり回ったりしてダンス。</li><li>自分が描いた線もそれぞれ跳ねる・回る・揺れるなど別々に動きます。</li><li>線の量だけでなく、画面への広がり・ストローク数・複雑さを評価して1〜100点。</li>`;
  }else if(index===46){
    rules=`<li>7秒でモブくんを守るお城・タワー・壁などを自由にたくさん描きます。</li><li>終了すると「魔王の攻撃だ！」。右から超巨大円形エネルギーが飛来。</li><li>描いた建造物ごとにサイズ・線量・形から耐久力を自動計算。耐久0になった建造物は崩壊。</li><li>1つだけ描いた場合は耐え切れば100点、全壊なら0点の勝負。複数なら残った総耐久率で1〜100点。</li><li>全部壊れるとエネルギーがモブくんへ直撃して0点。</li>`;
  }else if(index===47){
    rules=`<li>3・2・1で50m走スタート。</li><li>LEFT FOOT → RIGHT FOOT → LEFT FOOT…と左右の足ボタンを必ず交互に連打。</li><li>正しい足入力ごとに前進。同じ足を連続で押しても進みません。</li><li>目安は最速4.5秒、普通6.5秒、ゆっくり12.5秒。50m到達タイムを競います。</li>`;
  }else{
    rules=`<li>かなり遠距離の狙撃。プレイヤーもターゲットも小さく表示されます。</li><li>右端付近のターゲットは上下に揺れます。揺れは10段階から毎回ランダムで、ゲーム中は変化しません。</li><li>画面をタップすると、その地点へ弾を1発だけ発射。弾が飛んでいる間は次を撃てません。</li><li>弾は4発。命中1発=25点、4発全て命中で100点。</li>`;
  }
  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">${currentRoundLabel()}</span><h2>${g.title}</h2><p class="lead">${g.sub}</p></div>
      <div class="game-badge">G${g.no}</div>
    </div>
    <section class="panel"><h3>RULE</h3><ul class="rules">${rules}</ul></section>
    ${state.freePlay
      ? `<section class="panel flat free-play-note"><h3>1 PLAYER FREE PLAY</h3><p class="lead">このゲームだけ遊びます。</p></section>`
      : mode().performance
        ? `<section class="panel flat score-intro"><h3>SCORE</h3><div class="score-big-rule">${scoreRuleForGame(index)}</div></section>`
        : `<section class="panel flat"><h3>POINT</h3><div class="point-strip">${mode().points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div></section>`}
    <button id="introStart" class="primary">${state.freePlay?"READY? へ":"プレイヤー1 READY? へ"}</button>
  `;
  gameTop();
  document.getElementById("introStart").addEventListener("click",()=>humanReady(index,0));
}

function humanReady(gameIndex,humanIndex){
  clearGameFit();
  const list=humans();
  if(humanIndex>=list.length){
    return cpus().length ? simulateCpuThenResult(gameIndex) : finishGame(gameIndex);
  }

  const p=list[humanIndex],g=GAMES[gameIndex];

  screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">
    ${imgTag(p,"ready-avatar")}
    <span class="kicker">${currentRoundLabel()}</span>
    <div class="ready-big">READY?</div>
    <div class="ready-name">${esc(p.name)}</div>
    <div class="ready-sub">${state.freePlay?"1 PLAYER FREE PLAY":(mode().team?teamName(p.id):`PLAYER ${p.no}`)}</div>
    <button id="readyBtn" class="primary">準備OK</button>
  </div></div>`;
  gameTop();

  document.getElementById("readyBtn").addEventListener("click",()=>{
    const runId=beginGameRun(gameIndex);

    if(gameIndex===0)startReaction(p,humanIndex,runId);
    else if(gameIndex===1)startMemory(p,humanIndex,runId);
    else if(gameIndex===2)startPuzzle(p,humanIndex,runId);
    else if(gameIndex===3)startLaunch(p,humanIndex,runId);
    else if(gameIndex===4)startStack(p,humanIndex,runId);
    else if(gameIndex===5)startGanbareMob(p,humanIndex,runId);
    else if(gameIndex===6)startCrisis(p,humanIndex,runId);
    else if(gameIndex===7)startFactory(p,humanIndex,runId);
    else if(gameIndex===8)startCatcher(p,humanIndex,runId);
    else if(gameIndex===9)startTidy(p,humanIndex,runId);
    else if(gameIndex===10)startSkiJump(p,humanIndex,runId);
    else if(gameIndex===11)startMobSlot(p,humanIndex,runId);
    else if(gameIndex===12)startJumpRope(p,humanIndex,runId);
    else if(gameIndex===13)startPK(p,humanIndex,runId);
    else if(gameIndex===14)startMusicalChairs(p,humanIndex,runId);
    else if(gameIndex===15)startCutGame(p,humanIndex,runId);
    else if(gameIndex===16)startTreeClimb(p,humanIndex,runId);
    else if(gameIndex===17)startErrand(p,humanIndex,runId);
    else if(gameIndex===18)startDontHitMob(p,humanIndex,runId);
    else if(gameIndex===19)startMobStop(p,humanIndex,runId);
    else if(gameIndex===20)startOverlapMoment(p,humanIndex,runId);
    else if(gameIndex===21)startShutterChance(p,humanIndex,runId);
    else if(gameIndex===22)startCupLimit(p,humanIndex,runId);
    else if(gameIndex===23)startDartsOneShot(p,humanIndex,runId);
    else if(gameIndex===24)startParachute(p,humanIndex,runId);
    else if(gameIndex===25)startMobCount(p,humanIndex,runId);
    else if(gameIndex===26)startEmergencyBrake(p,humanIndex,runId);
    else if(gameIndex===27)startFeintReaction(p,humanIndex,runId);
    else if(gameIndex===28)startBombChicken(p,humanIndex,runId);
    else if(gameIndex===29)startOverlapMaster(p,humanIndex,runId);
    else if(gameIndex===30)startJumpingMob(p,humanIndex,runId);
    else if(gameIndex===31)startHeroMaybe(p,humanIndex,runId);
    else if(gameIndex===32)startPopularGame(p,humanIndex,runId);
    else if(gameIndex===33)startPlanetEnergy(p,humanIndex,runId);
    else if(gameIndex===34)startPainterMob(p,humanIndex,runId);
    else if(gameIndex===35)startBikeJump(p,humanIndex,runId);
    else if(gameIndex===36)startDynamicTrampoline(p,humanIndex,runId);
    else if(gameIndex===37)startMobTrain(p,humanIndex,runId);
    else if(gameIndex===38)startGiantMob(p,humanIndex,runId);
    else if(gameIndex===39)startWizardMob(p,humanIndex,runId);
    else if(gameIndex===40)startBrawlerMob(p,humanIndex,runId);
    else if(gameIndex===41)startSummonerMob(p,humanIndex,runId);
    else if(gameIndex===42)startBlackjackMob(p,humanIndex,runId);
    else if(gameIndex===43)startMobIssen(p,humanIndex,runId);
    else if(gameIndex===44)startCrowEscape(p,humanIndex,runId);
    else if(gameIndex===45)startDancingMob(p,humanIndex,runId);
    else if(gameIndex===46)startGuardianMob(p,humanIndex,runId);
    else if(gameIndex===47)startMob50m(p,humanIndex,runId);
    else startSniperMob(p,humanIndex,runId);
  },{once:true});
}

async function countdown(label="COUNTDOWN",runId=activeGameRunId){
  if(!isGameRunValid(runId))return false;

  cancelCountdown();
  const serial=++countdownSerial;

  if(!isGameRunValid(runId))return false;

  const layer=document.createElement("div");
  layer.className="countdown-layer";
  layer.innerHTML=`<div class="count-label">${label}</div><div class="count-number">3</div>`;
  document.body.appendChild(layer);
  activeCountdownLayer=layer;

  const n=layer.querySelector(".count-number");

  for(const v of [3,2,1]){
    if(
      serial!==countdownSerial||
      !layer.isConnected||
      !isGameRunValid(runId)
    )return false;

    n.textContent=v;
    beep(310+(3-v)*85,80);
    await wait(620);
  }

  if(
    serial!==countdownSerial||
    !layer.isConnected||
    !isGameRunValid(runId)
  )return false;

  n.textContent="GO!";
  beep(710,100);
  await wait(300);

  if(
    serial!==countdownSerial||
    !layer.isConnected||
    !isGameRunValid(runId)
  )return false;

  layer.remove();
  if(activeCountdownLayer===layer)activeCountdownLayer=null;
  return true;
}

function playBadge(humanIndex){
  return state.freePlay ? "SOLO" : `${humanIndex+1}/${humans().length}`;
}

// GAME 1 -------------------------------------------------
async function startReaction(p,humanIndex,runId){
  gameFit();
  screen.innerHTML=`<section class="reaction-stage"><div><span class="kicker">${esc(p.name)}</span><h2>反射神経</h2></div><div id="reactionZone" class="reaction-zone"><div class="wait-dots">•••</div></div><p class="hint">モブくんが出た瞬間にタップ。0.0001秒単位で表示します。</p></section>`;
  if(!(await countdown("COUNTDOWN",runId)))return;
  const zone=document.getElementById("reactionZone");
  if(!zone)return;
  await wait(rand(650,1900));
  if(!document.body.contains(zone))return;

  const btn=document.createElement("button");
  btn.type="button";
  btn.className="mob-button mob-character-button";
  const reactionIcon=randi(1,10);
  btn.innerHTML=`<img draggable="false" src="icon/${String(reactionIcon).padStart(2,"0")}.png" alt="モブくん">`;
  zone.innerHTML="";
  zone.appendChild(btn);

  const t0=performance.now();
  btn.addEventListener("pointerdown",()=>{
    const ms=Math.max(.1,performance.now()-t0);
    state.records.reaction[p.id]=ms;
    beep(870,100);
    recordScreen(0,p,humanIndex,`${(ms/1000).toFixed(4)}<small>秒</small>`);
  },{once:true});
}

// GAME 2 -------------------------------------------------
async function startMemory(p,humanIndex,runId){
  gameFit();
  const ids=shuffle(Array.from({length:10},(_,i)=>i+1));const seq=shuffle([...ids]);let input=0,active=false;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>記憶力ゲーム</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="memory-status"><div class="stat-box"><span>PHASE</span><b id="memPhase">WATCH</b></div><div class="stat-box"><span>CORRECT</span><b id="memCount">0 / 10</b></div></div><div id="memoryBoard" class="memory-board">${ids.map(id=>`<button type="button" class="memory-tile" data-id="${id}"><img src="icon/${String(id).padStart(2,"0")}.png" alt="icon ${id}" onerror="this.style.visibility='hidden'"></button>`).join("")}</div><p id="memHint" class="hint">3・2・1のあと、光る順番を覚えてください。</p>`;
  const board=document.getElementById("memoryBoard"),phase=document.getElementById("memPhase"),count=document.getElementById("memCount"),hint=document.getElementById("memHint");const tile=id=>board.querySelector(`[data-id="${id}"]`);
  if(!(await countdown("WATCH",runId)))return;
  for(const id of seq){if(!document.body.contains(board))return;tile(id).classList.add("showing");beep(400+id*18,55,.018);await wait(390);tile(id).classList.remove("showing");await wait(125)}
  phase.textContent="READY";hint.textContent="次の3・2・1のあと、同じ順番でタップ。";await wait(300);if(!isGameRunValid(runId))return;if(!(await countdown("TAP",runId)))return;phase.textContent="TAP";hint.textContent="光った順にタップしてください。";active=true;
  board.addEventListener("pointerdown",async e=>{const t=e.target.closest(".memory-tile");if(!t||!active)return;const id=Number(t.dataset.id);if(id===seq[input]){t.classList.add("correct");setTimeout(()=>t.classList.remove("correct"),170);beep(730,45,.02);input++;count.textContent=`${input} / 10`;if(input===10){active=false;state.records.memory[p.id]=10;await wait(240);recordScreen(1,p,humanIndex,`10<small>/10</small>`)}}else{active=false;t.classList.add("wrong");beep(170,160,.03);state.records.memory[p.id]=input;hint.textContent="MISS";await wait(430);recordScreen(1,p,humanIndex,`${input}<small>/10</small>`)}});
}

// GAME 3 -------------------------------------------------
async function startPuzzle(p,humanIndex,runId){
  gameFit();
  const slots=shuffle(Array.from({length:12},(_,i)=>i+1));
  let next=1;
  let finished=false;
  let t0=0;

  screen.innerHTML=`<div class="number-game-shell">
    <div class="number-game-top">
      <div><span class="kicker">${esc(p.name)}</span><h2>ナンバー12</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>
    <div class="number-puzzle-wrap">
      <div class="puzzle-meta number-meta">
        <div class="stat-box"><span>TIME</span><b id="numTime">0.00</b></div>
        <div class="stat-box"><span>NEXT</span><b id="numNext">1</b></div>
      </div>
      <div id="numberBoard" class="number-board prestart">
        ${slots.map((num,slot)=>{
          const col=slot%4,row=Math.floor(slot/4);
          const x=(col/3)*100,y=(row/2)*100;
          return `<button type="button" class="number-tile locked" data-num="${num}" aria-label="${num}" style="--px:${x}%;--py:${y}%"><span>${num}</span></button>`;
        }).join("")}
      </div>
      <p id="numHint" class="hint number-hint">3・2・1のあと 1 から順番にタップ。</p>
    </div>
  </div>`;
  gameTop();

  const board=document.getElementById("numberBoard");
  const timeEl=document.getElementById("numTime");
  const nextEl=document.getElementById("numNext");
  const hint=document.getElementById("numHint");

  const updateLocks=()=>{
    board.querySelectorAll(".number-tile").forEach(tile=>{
      const n=Number(tile.dataset.num);
      const canPress=!finished && !tile.classList.contains("cleared") && n===next;
      tile.classList.toggle("locked",!canPress);
      tile.disabled=!canPress;
    });
  };

  if(!(await countdown("NUMBER 12",runId)))return;
  if(!document.body.contains(board))return;

  board.classList.remove("prestart");
  updateLocks();
  t0=performance.now();

  const tick=()=>{
    if(finished)return;
    timeEl.textContent=((performance.now()-t0)/1000).toFixed(2);
    activeAnimation=requestAnimationFrame(tick);
  };
  activeAnimation=requestAnimationFrame(tick);

  board.addEventListener("pointerdown",e=>{
    const tile=e.target.closest(".number-tile");
    if(!tile||finished||tile.disabled)return;

    e.preventDefault();
    const num=Number(tile.dataset.num);
    if(num!==next)return;

    tile.disabled=true;
    tile.classList.remove("locked");
    tile.classList.add("cleared");
    beep(560+next*18,38,.018);

    if(next===12){
      finished=true;
      cancelActiveAnimation();
      const ms=Math.max(1,Math.round(performance.now()-t0));
      state.records.puzzle[p.id]=ms;
      nextEl.textContent="CLEAR";
      hint.textContent="12 COMPLETE!";
      board.querySelectorAll(".number-tile").forEach(t=>t.disabled=true);
      beep(940,130,.04);
      setTimeout(()=>recordScreen(2,p,humanIndex,`${(ms/1000).toFixed(2)}<small>秒</small>`,`1 → 12 COMPLETE`),360);
      return;
    }

    next++;
    nextEl.textContent=next;
    hint.textContent=`次は ${next}`;
    updateLocks();
  },{passive:false});
}

// GAME 4 -------------------------------------------------
async function startLaunch(p,humanIndex,runId){
  gameFit();
  let linear=0,circle=0,phase="linear",start=performance.now();
  const linearPeriod=rand(350,430);

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>フィギュア飛ばし</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
  <div class="gauge-wrap">
    <section id="linearCard" class="gauge-card">
      <div class="gauge-title">1. 高速 横長ゲージ <span id="linearScore">タップでSTOP</span></div>
      <div id="linearGauge" class="linear-gauge blind-gauge">
        <div id="linearMarker" class="linear-marker"></div>
        <div class="linear-blind left">?</div>
        <div class="linear-blind right">?</div>
      </div>
      <p class="blind-help">両端の最後約10%は見えません。感覚でSTOP。</p>
    </section>

    <section id="circleCard" class="gauge-card disabled">
      <div class="gauge-title">2. 円形ゲージ <span id="circleScore">WAIT</span></div>
      <div id="circleGauge" class="circle-gauge" role="button" aria-label="円形ゲージを止める">
        <div class="circle-max-zone"><b>MAX</b><span>100</span></div>
        <div class="circle-ring"></div>
        <div id="circleNeedle" class="circle-needle"></div>
        <div class="circle-center"><span>POWER</span><b id="circleLive">--</b></div>
      </div>
    </section>
    <p class="hint">横は見えない両端、円は上のMAXを狙う。最大2000m。</p>
  </div>`;

  const lg=document.getElementById("linearGauge"),lm=document.getElementById("linearMarker"),
        lc=document.getElementById("linearCard"),ls=document.getElementById("linearScore"),
        cg=document.getElementById("circleGauge"),needle=document.getElementById("circleNeedle"),
        live=document.getElementById("circleLive"),cc=document.getElementById("circleCard"),
        cs=document.getElementById("circleScore");

  function linearAnim(now){
    if(phase!=="linear")return;
    const t=(now-start)/linearPeriod;
    const pos=(Math.sin(t*Math.PI*2-Math.PI/2)+1)/2*100;
    lm.style.left=`${pos}%`;
    lm.dataset.pos=pos.toFixed(3);
    activeAnimation=requestAnimationFrame(linearAnim);
  }

  function beginCircle(){
    phase="circle";
    cancelActiveAnimation();
    lc.classList.add("disabled");
    cc.classList.remove("disabled");
    cs.textContent="タップでSTOP";
    start=performance.now();
    beep(660,70);
    activeAnimation=requestAnimationFrame(circleAnim);
  }

  function stopLinear(e){
    if(phase!=="linear")return;
    if(e)e.preventDefault();
    const pos=Number(lm.dataset.pos||50);
    linear=clamp(Math.round(Math.abs(pos-50)*2),0,100);
    ls.textContent=`${linear}%`;
    beginCircle();
  }

  function circleAnim(now){
    if(phase!=="circle")return;
    const angle=((now-start)/1080*360)%360;
    const distToMax=Math.min(angle,360-angle);
    const score=clamp(Math.round(100-(distToMax/180)*100),0,100);
    needle.style.transform=`rotate(${angle}deg)`;
    needle.dataset.score=String(score);
    live.textContent=`${score}%`;
    activeAnimation=requestAnimationFrame(circleAnim);
  }

  function stopCircle(e){
    if(phase!=="circle")return;
    if(e)e.preventDefault();
    circle=clamp(Number(needle.dataset.score||0),0,100);
    phase="done";
    cancelActiveAnimation();
    cs.textContent=`${circle}% STOP`;
    live.textContent=`${circle}%`;
    cc.classList.add("stopped");
    beep(760,80);
    setTimeout(()=>launchAnimation(p,humanIndex,(linear+circle)/2,linear,circle),300);
  }

  activeAnimation=requestAnimationFrame(linearAnim);
  lg.addEventListener("pointerdown",stopLinear,{passive:false});
  cg.addEventListener("pointerdown",stopCircle,{passive:false});
}

async function launchAnimation(p,humanIndex,power,linear,circle){
  const maxMeters=2000;
  const target=Math.round(Math.pow(power/100,1.55)*maxMeters*10)/10;
  const pxPerM=2.45;
  const targetX=128+target*pxPerM;
  const worldWidth=128+maxMeters*pxPerM+420;

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">POWER ${power.toFixed(1)}%</span><h2>FLY!</h2><p class="lead">横 ${linear}% / 円 ${circle}%</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
  <div class="flight-card"><div class="flight-hud"><div><span>REALTIME DISTANCE</span><b id="distance">0.0 m</b></div><div><span>MAX</span><b>2000m</b></div></div>
    <div id="viewport" class="flight-viewport"><div id="world" class="flight-world" style="width:${worldWidth}px"><div class="ground-line"></div>
      ${Array.from({length:11},(_,i)=>`<div class="meter-mark" style="left:${128+i*200*pxPerM}px"><span>${i*200}m</span></div>`).join("")}
      <div class="power-orb"></div><div id="stick" class="power-stick"></div><img draggable="false" id="figure" class="figure" src="icon/01.png" alt="figure" onerror="this.style.visibility='hidden'">
    </div></div></div>`;

  const viewport=document.getElementById("viewport"),world=document.getElementById("world"),figure=document.getElementById("figure"),stick=document.getElementById("stick"),distance=document.getElementById("distance");
  stick.classList.add("strike");beep(140,120,.035);await wait(420);beep(860,90,.03);
  const duration=3000+power*9,start=performance.now();
  function easeOutCubic(t){return 1-Math.pow(1-t,3)}
  function flight(now){
    const raw=clamp((now-start)/duration,0,1),e=easeOutCubic(raw),x=128+(targetX-128)*e,meters=(x-128)/pxPerM,arc=Math.sin(raw*Math.PI)*Math.min(150,40+power*1.12);
    figure.style.left=`${x}px`;figure.style.bottom=`${76+arc}px`;figure.style.transform=`rotate(${raw*1900}deg)`;distance.textContent=`${Math.min(target,meters).toFixed(1)} m`;
    const vw=viewport.clientWidth,cam=Math.max(0,x-vw*.42);world.style.transform=`translateX(${-cam}px)`;
    if(raw<1)activeAnimation=requestAnimationFrame(flight);else{activeAnimation=null;state.records.launch[p.id]=Math.round(target*10);setTimeout(()=>recordScreen(3,p,humanIndex,`${target.toFixed(1)}<small>m</small>`,`POWER ${power.toFixed(1)}% / MAX 2000m`),400)}
  }
  activeAnimation=requestAnimationFrame(flight);
}

// GAME 5 -------------------------------------------------
async function startStack(p,humanIndex,runId){
  gameFit();
  let count=0;
  let active=null;
  let pointerId=null;
  let dragging=false;
  let dropping=false;
  let finished=false;
  let towerWobbleX=0;
  let towerWobbleRot=0;
  let handWobbleX=0;
  let handWobbleRot=0;
  let wobbleRAF=null;
  let timerRAF=null;
  let endAt=0;

  const pieceW=68,pieceH=50,baseBottom=32,stacked=[];

  screen.innerHTML=`<div class="stack-game-shell">
    <div class="stack-topline">
      <div><span class="kicker">${esc(p.name)}</span><h2>グラグラモブくん</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="stack-wrap">
      <div class="stack-hud stack-hud-v8">
        <div class="stat-box"><span>STACK</span><b id="stackCount">0</b></div>
        <div class="stat-box"><span>TIME</span><b id="stackTime">10.00</b></div>
        <div class="stat-box wind-box"><span>WIND</span><b id="windValue">0%</b><i><em id="windFill"></em></i></div>
      </div>

      <div id="stackStage" class="stack-stage">
        <div id="stackCallout" class="stack-callout"></div>
        <div class="stack-sky-label">HOLD / MOVE / RELEASE</div>
        <div id="stackWaitingDock" class="stack-waiting-dock">
          <span>NEXT MOB</span>
          <div class="stack-waiting-mob"></div>
        </div>
        <div class="wind-lines"><i></i><i></i><i></i></div>

        <div id="towerWorld" class="tower-world">
          <div id="stackLayer" class="stack-layer"></div>
          <div class="tower-base"></div>
        </div>

        <div id="activeLayer" class="active-layer"></div>
      </div>

      <p id="stackHint" class="hint">1体ずつ。つかんで移動 → 離してDROP。10秒勝負。</p>
    </div>
  </div>`;
  gameTop();

  const stage=document.getElementById("stackStage"),
        world=document.getElementById("towerWorld"),
        stackLayer=document.getElementById("stackLayer"),
        activeLayer=document.getElementById("activeLayer"),
        countEl=document.getElementById("stackCount"),
        timeEl=document.getElementById("stackTime"),
        windEl=document.getElementById("windValue"),
        windFill=document.getElementById("windFill"),
        hint=document.getElementById("stackHint"),
        callout=document.getElementById("stackCallout"),
        waitingDock=document.getElementById("stackWaitingDock");

  function stageWidth(){return stage.clientWidth}
  function progress(){
    if(!endAt)return 0;
    return clamp(1-(endAt-performance.now())/10000,0,1);
  }
  function windPercent(){return Math.round(progress()*100)}
  function windAmp(){return 1.4+progress()*17}
  function handAmp(){return 2.4+progress()*8+Math.max(0,count-10)*.10}
  function requiredOverlapRatio(){
    return clamp(.22+progress()*.15+Math.max(0,count-12)*.006,.22,.48);
  }
  function cameraShift(){
    const top=baseBottom+(count+1)*pieceH;
    return Math.max(0,top-(stage.clientHeight-145));
  }
  function updateCamera(){
    world.style.transition="transform .18s ease";
    world.style.transform=`translateY(${cameraShift()}px)`;
  }
  function topLocalX(){return count===0?stageWidth()/2:stacked[stacked.length-1].x}
  function topVisualX(){return topLocalX()+towerWobbleX}
  function landingBottom(){return baseBottom+count*pieceH}
  function activeEl(){return document.getElementById("activeStackPiece")}

  function renderStack(){
    stackLayer.innerHTML=stacked.map((it,i)=>`<div class="stack-piece placed mob-variety" style="--mob-img:url('icon/${String(it.icon||1).padStart(2,"0")}.png');left:${it.x-pieceW/2}px;bottom:${baseBottom+i*pieceH}px;transform:rotate(${it.rot}deg)"></div>`).join("");
    countEl.textContent=count;
    updateCamera();
  }

  function showCallout(text,kind="good"){
    callout.className=`stack-callout show ${kind}`;
    callout.textContent=text;
    setTimeout(()=>{if(callout.textContent===text)callout.className="stack-callout"},430);
  }

  function spawnPiece(){
    if(finished||performance.now()>=endAt)return;
    dragging=false;
    dropping=false;
    pointerId=null;
    handWobbleX=0;
    handWobbleRot=0;

    const sw=stageWidth();
    const icon=randi(1,10);
    active={x:clamp(sw*.5+rand(-sw*.16,sw*.16),pieceW/2+8,sw-pieceW/2-8),y:58,icon};

    if(waitingDock){
      waitingDock.classList.add("active");
      const waitMob=waitingDock.querySelector(".stack-waiting-mob");
      if(waitMob)waitMob.style.setProperty("--wait-mob",`url('icon/${String(icon).padStart(2,"0")}.png')`);
    }
    activeLayer.innerHTML=`<div id="activeStackPiece" class="stack-piece active v8-active visible-waiting-mob mob-variety" role="button" aria-label="待機中のモブくん" style="--mob-img:url('icon/${String(icon).padStart(2,"0")}.png');left:${active.x-pieceW/2}px;top:${active.y}px"></div>`;
  }

  function setActiveX(clientX){
    if(!active)return;
    const rect=stage.getBoundingClientRect();
    active.x=clamp(clientX-rect.left,pieceW/2+5,rect.width-pieceW/2-5);
    const el=activeEl();
    if(el)el.style.left=`${active.x-pieceW/2}px`;
  }

  function startWobble(){
    const started=performance.now();

    const frame=now=>{
      if(finished)return;

      const t=now-started;
      const amp=windAmp();
      const wp=windPercent();

      windEl.textContent=`${wp}%`;
      windFill.style.width=`${wp}%`;

      towerWobbleX=Math.sin(t/(300-wp*1.15))*amp*.55 + Math.sin(t/580)*amp*.22;
      towerWobbleRot=Math.sin(t/440)*Math.min(4.0,amp*.18);

      stackLayer.style.transform=`translateX(${towerWobbleX}px) rotate(${towerWobbleRot}deg)`;

      if(dragging&&active){
        const ha=handAmp();
        handWobbleX=Math.sin(t/68)*ha+Math.sin(t/39)*ha*.26;
        handWobbleRot=Math.sin(t/82)*Math.min(11,3+wp*.07);
        const el=activeEl();
        if(el)el.style.transform=`translateX(${handWobbleX}px) rotate(${handWobbleRot}deg) scale(1.045)`;
      }else{
        handWobbleX=0;
        handWobbleRot=0;
      }

      wobbleRAF=requestAnimationFrame(frame);
    };
    wobbleRAF=requestAnimationFrame(frame);
  }

  async function collapseToBottom(direction=1){
    stackLayer.classList.add(direction>=0?"tower-collapse-right":"tower-collapse-left");
    world.style.transition="transform .75s cubic-bezier(.2,.7,.2,1)";
    world.style.transform="translateY(0px)";
    await wait(820);
  }

  async function releasePiece(){
    if(!active||dropping||finished)return;
    dropping=true;
    dragging=false;

    const dropX=active.x+handWobbleX;
    const targetX=topVisualX();
    const distance=Math.abs(dropX-targetX);
    const ratio=Math.max(0,pieceW-distance)/pieceW;
    const need=requiredOverlapRatio();

    const stageH=stage.clientHeight;
    const targetTop=stageH-(landingBottom()+pieceH)+cameraShift();
    const el=activeEl();
    if(!el)return;

    active.x=dropX;
    el.style.left=`${dropX-pieceW/2}px`;
    el.style.transform=`rotate(${handWobbleRot*.22}deg)`;

    const startTop=parseFloat(el.style.top)||58;
    const dropStart=performance.now();
    const dropDur=220;

    await new Promise(resolve=>{
      const fall=now=>{
        const t=clamp((now-dropStart)/dropDur,0,1);
        const e=1-Math.pow(1-t,3);
        el.style.top=`${startTop+(targetTop-startTop)*e}px`;
        if(t<1)requestAnimationFrame(fall);else resolve();
      };
      requestAnimationFrame(fall);
    });

    if(ratio<need){
      showCallout("BREAK!","bad");
      beep(150,220,.04);
      el.classList.add(dropX>=targetX?"fall-right":"fall-left");
      await wait(180);
      await collapseToBottom(dropX>=targetX?1:-1);
      finishStack();
      return;
    }

    const localX=dropX-towerWobbleX;
    const offset=dropX-targetX;
    stacked.push({x:localX,rot:clamp(offset*.075+towerWobbleRot*.16,-6,6),icon:active.icon});
    count++;
    active=null;
    activeLayer.innerHTML="";
    if(waitingDock)waitingDock.classList.remove("active");
    renderStack();
    beep(760,45,.022);

    if(ratio>=.78)showCallout("PERFECT!","perfect");
    else if(ratio>=.52)showCallout("GOOD!","good");
    else showCallout("SAFE!","safe");

    await wait(90);
    spawnPiece();
  }

  function finishStack(){
    if(finished)return;
    finished=true;
    if(wobbleRAF)cancelAnimationFrame(wobbleRAF);
    if(timerRAF)cancelAnimationFrame(timerRAF);
    activeLayer.innerHTML="";
    if(waitingDock)waitingDock.classList.remove("active");
    state.records.stack[p.id]=count;
    setTimeout(()=>recordScreen(4,p,humanIndex,`${count}<small>体</small>`,`10 SECOND STACK`),170);
  }

  stage.addEventListener("pointerdown",e=>{
    const el=e.target.closest("#activeStackPiece");
    if(!el||dropping||finished)return;
    e.preventDefault();
    e.stopPropagation();

    dragging=true;
    pointerId=e.pointerId;
    try{stage.setPointerCapture(pointerId)}catch(_){}
    setActiveX(e.clientX);
    el.classList.add("grabbed");
  },{passive:false});

  stage.addEventListener("pointermove",e=>{
    if(!dragging||e.pointerId!==pointerId||dropping||finished)return;
    e.preventDefault();
    e.stopPropagation();
    setActiveX(e.clientX);
  },{passive:false});

  const release=e=>{
    if(!dragging||e.pointerId!==pointerId||dropping||finished)return;
    e.preventDefault();
    e.stopPropagation();
    const el=activeEl();
    if(el)el.classList.remove("grabbed");
    releasePiece();
  };
  stage.addEventListener("pointerup",release,{passive:false});
  stage.addEventListener("pointercancel",release,{passive:false});
  stage.addEventListener("contextmenu",e=>e.preventDefault(),{passive:false});
  stage.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});

  renderStack();
  startWobble();
  if(!(await countdown("10 SECOND STACK",runId)))return;
  if(!document.body.contains(stage))return;

  endAt=performance.now()+10000;
  spawnPiece();

  const timer=now=>{
    if(finished)return;
    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);
    if(left<=0){
      finishStack();
      return;
    }
    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 6 -------------------------------------------------
const NINETEEN90_DECOYS=[
  {name:"1991"},{name:"1989",trap:true},{name:"2000",trap:true},{name:"1909",trap:true},{name:"1999",trap:true},
  {name:"1992"},{name:"1998"},{name:"1900"},{name:"1910"},{name:"1980"},{name:"2001"},{name:"1099"},
  {name:"1995"},{name:"1996"},{name:"1997"},{name:"1993"},{name:"1994"},{name:"1890"},{name:"2090"},{name:"2002"}
];
const WORLD_COUNTRIES=["アメリカ","日本","ロシア","ウクライナ","韓国","フランス","ドイツ","ベネズエラ","ブラジル","カナダ","イギリス","イタリア","スペイン","ポルトガル","オランダ","ベルギー","スイス","オーストリア","ポーランド","チェコ","スロバキア","ハンガリー","ルーマニア","ブルガリア","ギリシャ","トルコ","ジョージア","カザフスタン","モンゴル","中国","台湾","香港","タイ","ベトナム","フィリピン","インドネシア","マレーシア","シンガポール","インド","オーストラリア","ニュージーランド","メキシコ","アルゼンチン","チリ","コロンビア","ペルー","南アフリカ","エジプト","モロッコ","ケニア"];
const COUNTRY_1990_BIAS={"アメリカ":5.2,"日本":4.8,"ロシア":4.5,"ウクライナ":4.2,"韓国":3.9,"フランス":3.5,"ドイツ":3.2,"ベネズエラ":3.0};

function build1990WorldRanking(laps){
  const strong=Object.keys(COUNTRY_1990_BIAS);
  const others=shuffle(WORLD_COUNTRIES.filter(x=>!strong.includes(x))).slice(0,31);
  const countries=[...strong,...others];
  const entries=countries.map(name=>({
    name,
    score:rand(7,28)+(COUNTRY_1990_BIAS[name]||rand(-.5,1.8)),
    mob:false
  }));

  // V8.7: 4択化に合わせて15周以上を世界1位確定ラインへ。
  let mobScore;
  if(laps>=15){
    const currentBest=Math.max(...entries.map(e=>e.score));
    mobScore=currentBest+4+rand(0,2);
  }else if(laps>=12){
    const currentBest=Math.max(...entries.map(e=>e.score));
    mobScore=currentBest-rand(0,3.2);
  }else{
    mobScore=10+laps*1.45+rand(-1.1,1.1);
  }

  entries.push({name:"MOB",score:mobScore,mob:true});
  entries.sort((a,b)=>b.score-a.score);
  entries.forEach((e,i)=>e.rank=i+1);
  return entries;
}

async function startGanbareMob(p,humanIndex,runId){
  gameFit();

  let hits=0,streak=0,bonus=0,penalty=0;
  let targetIndex=0;
  let currentChoices=[];
  let running=false,finished=false,pairLocked=false,endAt=0;

  screen.innerHTML=`<div class="ganbare-shell n1990-shell">
    <div class="ganbare-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>1990世界大会</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="ganbare-hud n1990-hud">
      <div class="ganbare-time"><span>TIME</span><b id="ganbareTime">10.00</b></div>
      <div class="ganbare-count"><span>1990</span><b id="hitCount">0周</b></div>
      <div class="ganbare-count"><span>STREAK</span><b id="streakCount">0</b></div>
    </div>

    <div id="n1990Grid" class="n1990-grid">
      ${[0,1,2,3].map(i=>`<button class="n1990-choice4" data-choice="${i}" type="button"><b>1990</b></button>`).join("")}
    </div>

    <div class="ganbare-message">
      <b id="ganbareMessage">4つの中から1990を探せ</b>
      <span>5連続で BONUS +1周 / 罠は -1周</span>
    </div>
  </div>`;

  const timeEl=document.getElementById("ganbareTime");
  const hitEl=document.getElementById("hitCount");
  const streakEl=document.getElementById("streakCount");
  const msg=document.getElementById("ganbareMessage");
  const grid=document.getElementById("n1990Grid");
  const buttons=[...grid.querySelectorAll(".n1990-choice4")];

  function finalLaps(){
    return Math.max(0,hits+bonus-penalty);
  }

  function newChoices(){
    const decoys=shuffle(NINETEEN90_DECOYS).slice(0,3);
    targetIndex=randi(0,3);
    currentChoices=[];
    let di=0;

    for(let i=0;i<4;i++){
      if(i===targetIndex){
        currentChoices.push({name:"1990",target:true});
      }else{
        currentChoices.push({...decoys[di++],target:false});
      }
    }

    buttons.forEach((btn,i)=>{
      btn.querySelector("b").textContent=currentChoices[i].name;
      btn.classList.remove("picked","wrong","bonus");
      btn.disabled=false;
    });

    pairLocked=false;
  }

  function pick(index){
    if(!running||finished||pairLocked)return;
    pairLocked=true;

    const choice=currentChoices[index];
    const btn=buttons[index];

    if(choice.target){
      hits++;
      streak++;
      btn.classList.add("picked");

      let bonusNow=false;
      if(streak%5===0){
        bonus++;
        bonusNow=true;
        btn.classList.add("bonus");
        beep(920,85,.03);
      }else{
        beep(680,45,.018);
      }

      msg.textContent=bonusNow
        ? `5連続！ BONUS +1 / ${finalLaps()}周`
        : `1990！ ${finalLaps()}周`;
    }else{
      streak=0;
      btn.classList.add("wrong");

      if(choice.trap){
        penalty++;
        msg.textContent=`${choice.name} は罠 -1 / ${finalLaps()}周`;
        beep(150,100,.025);
      }else{
        msg.textContent=`${choice.name} MISS / ${finalLaps()}周`;
        beep(260,55,.018);
      }
    }

    hitEl.textContent=`${finalLaps()}周`;
    streakEl.textContent=streak;

    buttons.forEach(b=>b.disabled=true);
    setTimeout(()=>{
      if(running&&!finished)newChoices();
    },78);
  }

  grid.addEventListener("pointerdown",e=>{
    const btn=e.target.closest(".n1990-choice4");
    if(!btn)return;
    e.preventDefault();
    pick(Number(btn.dataset.choice));
  },{passive:false});

  if(!(await countdown("1990",runId)))return;
  if(!document.body.contains(grid))return;

  running=true;
  endAt=performance.now()+10000;
  newChoices();

  const timer=now=>{
    if(!running||finished)return;

    const ms=Math.max(0,endAt-now);
    timeEl.textContent=(ms/1000).toFixed(2);

    if(ms<=0){
      running=false;
      finished=true;
      buttons.forEach(b=>b.disabled=true);
      timeEl.textContent="0.00";
      beep(210,190,.035);

      const laps=finalLaps();
      const ranking=build1990WorldRanking(laps);
      const mob=ranking.find(x=>x.mob);
      state.records.breakdance[p.id]=mob.rank;

      setTimeout(()=>show1990Summary(p,humanIndex,{
        hits,bonus,penalty,laps,ranking,rank:mob.rank
      }),240);
      return;
    }

    activeAnimation=requestAnimationFrame(timer);
  };
  activeAnimation=requestAnimationFrame(timer);
}

function show1990Summary(p,humanIndex,data){
  clearGameFit();
  screen.innerHTML=`<div class="ganbare-transition n1990-summary"><span class="kicker">1990 COMPLETE</span><h2>モブくんは世界大会で<br><strong>1990を${data.laps}周</strong>披露した</h2>
    <div class="ganbare-summary"><div><span>1990 HIT</span><b>${data.hits}</b></div><div><span>5 STREAK BONUS</span><b>+${data.bonus}</b></div><div><span>TRAP</span><b>-${data.penalty}</b></div></div>
    <button id="worldRankingBtn" class="primary">世界ランキングを見る</button></div>`;gameTop();
  document.getElementById("worldRankingBtn").addEventListener("click",()=>show1990WorldRanking(p,humanIndex,data),{once:true});
}

function show1990WorldRanking(p,humanIndex,data){
  clearGameFit();
  screen.innerHTML=`<div class="world-ranking-shell"><div class="world-title"><div><span class="kicker">1990 WORLD CHAMPIONSHIP</span><h2>WORLD RANKING</h2></div><div class="mob-rank-badge">MOB<br><b>${data.rank}位</b></div></div>
    <div class="world-ranking-list">${data.ranking.map(e=>`<div class="world-row ${e.mob?"mob":""}"><span class="world-place">${e.rank}</span><b>${e.name}</b><small>${e.mob?`1990 ${data.laps}周`:"COUNTRY"}</small></div>`).join("")}</div>
    <div class="world-sticky"><button id="worldResultBtn" class="primary">結果を見る</button></div></div>`;gameTop();
  document.getElementById("worldResultBtn").addEventListener("click",()=>show1990Final(p,humanIndex,data.laps,data.rank),{once:true});
}

function show1990Final(p,humanIndex,laps,rank){
  clearGameFit();
  const tail=state.freePlay?`<button id="gAgain" class="primary">同じゲームをもう一度</button><div style="height:8px"></div><button id="gHome" class="secondary">メインメニューへ</button>`:`<button id="gNext" class="primary">${humanIndex+1<humans().length?"次のプレイヤー":cpus().length?"CPU高速処理へ":"GAME 6 RESULT"}</button>`;
  screen.innerHTML=`<div class="ganbare-final"><span class="kicker">FINAL MESSAGE</span><div class="ganbare-final-rank">${rank}<small>位</small></div><h2>モブくんは世界大会で1990を<strong>${laps}周</strong>披露し、<br><strong>${rank}位</strong>という成績を収めた。</h2>${tail}</div>`;gameTop();
  if(state.freePlay){document.getElementById("gAgain").addEventListener("click",()=>startFreeGame(5));document.getElementById("gHome").addEventListener("click",renderHome)}else document.getElementById("gNext").addEventListener("click",()=>humanReady(5,humanIndex+1));
}

// GAME 7 -------------------------------------------------
async function startCrisis(p,humanIndex,runId){
  gameFit();

  let wave=0;
  let finished=false;
  let waveRAF=null;
  const dodgeUntil=[0,0,0];

  screen.innerHTML=`<div class="crisis-shell crisis-shell-v83">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん危機一髪</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="crisis-hud">
      <div><span>ALL DODGE</span><b id="crisisCount">0</b></div>
      <div><span>SPEED</span><b id="crisisSpeed">1.0x</b></div>
      <div id="incomingBox" class="incoming-box"><span>ENERGY</span><b>WAIT</b></div>
    </div>

    <div id="crisisStage" class="crisis-stage crisis-stage-v83">
      <div class="crisis-distance-markers"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="crisis-ground-line"></div>

      <div id="energyApproach" class="energy-approach">
        <span>INCOMING</span><b>› › ›</b>
      </div>

      <div id="lowEnergy" class="low-energy low-energy-v83"><i></i></div>

      <div class="crisis-mob-row crisis-mob-row-v83">
        ${[0,1,2].map(i=>`<button class="crisis-mob low-jump-mob v83-jumper" data-mob="${i}" type="button" aria-label="モブくん${i+1}">
          <span>P${i+1}</span>
        </button>`).join("")}
      </div>
    </div>

    <p id="crisisHint" class="hint">INCOMINGを見て準備。小さい足元エネルギーをP1 → P2 → P3が順番にジャンプ。</p>
  </div>`;

  const stage=document.getElementById("crisisStage");
  const energy=document.getElementById("lowEnergy");
  const approach=document.getElementById("energyApproach");
  const incomingBox=document.getElementById("incomingBox");
  const countEl=document.getElementById("crisisCount");
  const speedEl=document.getElementById("crisisSpeed");
  const hint=document.getElementById("crisisHint");
  const mobs=[...stage.querySelectorAll(".crisis-mob")];

  mobs.forEach((mob,i)=>mob.addEventListener("pointerdown",e=>{
    if(finished)return;
    e.preventDefault();

    const now=performance.now();
    dodgeUntil[i]=now+560;

    mob.classList.remove("dodge");
    void mob.offsetWidth;
    mob.classList.add("dodge");
    beep(610+i*55,32,.012);
  },{passive:false}));

  async function runWave(){
    if(finished)return;

    const stageRect=stage.getBoundingClientRect();
    const stageW=stage.clientWidth;
    const mobCenters=mobs.map(m=>{
      const r=m.getBoundingClientRect();
      return r.left-stageRect.left+r.width/2;
    });

    const speed=Math.min(1800,340+wave*70);
    const startX=-220;
    const endX=stageW+90;
    const totalDistance=endX-startX;
    const duration=totalDistance/speed*1000;
    const crossed=[false,false,false];
    const safe=[false,false,false];

    speedEl.textContent=`${(speed/340).toFixed(1)}x`;
    energy.className="low-energy low-energy-v83";
    energy.style.opacity="1";
    energy.style.transform=`translateX(${startX}px)`;

    incomingBox.classList.add("warn");
    incomingBox.querySelector("b").textContent="IN!";
    approach.classList.add("show");
    hint.textContent="INCOMING… まだ遠い。タイミングを見て準備！";
    beep(330,55,.012);

    await wait(Math.max(420,820-wave*12));

    approach.classList.remove("show");
    incomingBox.classList.remove("warn");
    incomingBox.querySelector("b").textContent="GO";
    hint.textContent="ENERGY GO! P1 → P2 → P3";

    const start=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        if(finished){resolve();return}

        const t=clamp((now-start)/duration,0,1);
        const x=startX+totalDistance*t;
        energy.style.transform=`translateX(${x}px)`;

        for(let i=0;i<3;i++){
          if(crossed[i])continue;

          if(x>=mobCenters[i]-10){
            crossed[i]=true;
            const isSafe=dodgeUntil[i]>=now;
            safe[i]=isSafe;

            if(!isSafe){
              finished=true;
              mobs[i].classList.add("hurt");
              energy.classList.add("hit");
              hint.textContent=`P${i+1}が足元エネルギーに被弾！`;
              beep(145,230,.04);
              resolve();
              return;
            }
          }
        }

        if(t>=1){
          resolve();
          return;
        }
        waveRAF=requestAnimationFrame(frame);
      };
      waveRAF=requestAnimationFrame(frame);
    });

    if(finished){
      state.records.crisis[p.id]=wave;
      await wait(430);
      recordScreen(6,p,humanIndex,`${wave}<small>回</small>`,`LOW ENERGY DODGE`);
      return;
    }

    if(safe.every(Boolean)){
      wave++;
      countEl.textContent=wave;
      energy.classList.add("clear");
      incomingBox.querySelector("b").textContent="CLEAR";
      hint.textContent=`ALL DODGE ${wave}!`;
      beep(880,75,.025);

      await wait(Math.max(45,175-wave*5));
      runWave();
    }
  }

  if(!(await countdown("LOW ENERGY",runId)))return;
  if(!document.body.contains(stage))return;
  runWave();
}

// GAME 8 -------------------------------------------------
async function startFactory(p,humanIndex,runId){
  gameFit();
  let completed=0;
  let discarded=0;
  let current=null;
  let carrying=false;
  let finished=false;
  let timerRAF=null;
  let endAt=0;
  let boxLocked=false;

  screen.innerHTML=`<div class="factory-shell">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん人形大人気</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>

    <div class="factory-hud factory-hud-v81">
      <div><span>TIME</span><b id="factoryTime">10.00</b></div>
      <div><span>COMPLETE</span><b id="factoryCount">0</b></div>
      <div><span>DISCARD</span><b id="discardCount">0</b></div>
    </div>

    <div class="factory-room">
      <button id="mobStock" class="mob-stock" type="button">
        <span class="stock-pile">${Array.from({length:9},()=>`<i></i>`).join("")}</span>
        <b>MOB DOLL</b><small>人形を1体持つ</small>
      </button>

      <div class="factory-machine">
        <div class="factory-belt">
          <div class="belt-line"></div>

          <div id="trashBin" class="factory-trash">
            <b>NG</b><span>DISCARD</span>
          </div>

          <div id="factoryBox" class="factory-box">
            <span class="box-logo">MOB</span>
            <div class="box-doll"></div>
            <div class="box-extra-doll"></div>
            <div class="box-stamp">OK</div>
            <div class="box-ng-stamp">NG</div>
          </div>

          <div class="ghost-box g1">MOB</div>
          <div class="ghost-box g2">MOB</div>
        </div>
      </div>
    </div>

    <p id="factoryHint" class="hint">人形入り箱にもう1体入れると不良品！箱ごと破棄されます。</p>
  </div>`;
  gameTop();

  const timeEl=document.getElementById("factoryTime");
  const countEl=document.getElementById("factoryCount");
  const discardEl=document.getElementById("discardCount");
  const stock=document.getElementById("mobStock");
  const box=document.getElementById("factoryBox");
  const hint=document.getElementById("factoryHint");

  const dollEl=box.querySelector(".box-doll");
  const extraEl=box.querySelector(".box-extra-doll");
  const okStamp=box.querySelector(".box-stamp");
  const ngStamp=box.querySelector(".box-ng-stamp");

  function resetVisuals(){
    box.className="factory-box enter";
    extraEl.style.display="none";
    okStamp.style.display="none";
    ngStamp.style.display="none";
  }

  function spawnBox(){
    if(finished)return;

    current={
      prefilled:Math.random()<.47,
      filled:false,
      sealed:false,
      discarded:false
    };
    carrying=false;
    boxLocked=false;
    stock.classList.remove("carrying","warning");
    resetVisuals();

    dollEl.style.display=current.prefilled?"block":"none";
    hint.textContent=current.prefilled
      ?"すでに人形入り！箱だけタップで完成。余計な人形を入れると破棄。"
      :"空箱！右上のモブくん → 箱 → 箱でもう一度封。";

    setTimeout(()=>box.classList.remove("enter"),110);
  }

  stock.addEventListener("pointerdown",e=>{
    if(finished||!current||boxLocked||carrying)return;
    e.preventDefault();

    carrying=true;
    stock.classList.add("carrying");
    beep(590,32,.014);

    if(current.prefilled||current.filled){
      stock.classList.add("warning");
      hint.textContent="その箱にはもうモブくんがいる！入れたら箱ごと破棄！";
    }else{
      hint.textContent="モブくんを持った！箱をタップ。";
    }
  },{passive:false});

  async function discardBox(){
    if(boxLocked||finished)return;
    boxLocked=true;
    current.discarded=true;
    carrying=false;
    stock.classList.remove("carrying","warning");

    discarded++;
    discardEl.textContent=discarded;

    extraEl.style.display="block";
    ngStamp.style.display="grid";
    box.classList.add("reject-shake");
    hint.textContent="2体入れた！不良品！箱ごと破棄！";
    beep(145,180,.04);

    await wait(260);
    box.classList.remove("reject-shake");
    box.classList.add("reject-trash");

    await wait(460);
    spawnBox();
  }

  box.addEventListener("pointerdown",e=>{
    if(finished||!current||current.sealed||current.discarded||boxLocked)return;
    e.preventDefault();

    // If the box already contains a doll and the player is carrying another,
    // the whole box becomes a rejected product.
    if(carrying&&(current.prefilled||current.filled)){
      discardBox();
      return;
    }

    // Box already has a doll: one tap seals it.
    if(current.prefilled||current.filled){
      current.sealed=true;
      boxLocked=true;
      okStamp.style.display="grid";
      box.classList.add("sealed");
      completed++;
      countEl.textContent=completed;
      beep(850,42,.02);
      hint.textContent="COMPLETE!";

      setTimeout(()=>{
        box.classList.add("exit");
        setTimeout(spawnBox,95);
      },70);
      return;
    }

    // Empty box + carried doll = insert.
    if(carrying){
      current.filled=true;
      carrying=false;
      stock.classList.remove("carrying","warning");
      dollEl.style.display="block";
      box.classList.add("filled");
      hint.textContent="人形IN！もう一度箱をタップして封。";
      beep(690,32,.015);
    }else{
      hint.textContent="空箱です。先に右上のモブくんをタップ！";
      box.classList.add("need-doll");
      setTimeout(()=>box.classList.remove("need-doll"),180);
    }
  },{passive:false});

  function finishFactory(){
    if(finished)return;
    finished=true;
    if(timerRAF)cancelAnimationFrame(timerRAF);
    state.records.factory[p.id]=completed;
    recordScreen(7,p,humanIndex,`${completed}<small>箱</small>`,`DISCARD ${discarded}`);
  }

  if(!(await countdown("FACTORY",runId)))return;
  if(!document.body.contains(box))return;

  endAt=performance.now()+10000;
  spawnBox();

  const timer=now=>{
    if(finished)return;
    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finishFactory();
      return;
    }
    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 9 -------------------------------------------------
async function startCatcher(p,humanIndex,runId){
  gameFit();

  let phase="width";
  let craneX=.56;
  let craneY=22;
  let armOpen=.55;
  let widthRAF=null;
  let animRAF=null;
  const dolls=[];

  // Many prizes using the same 10 character assets as the memory game.
  // icon 08/09/10 are rare prizes and count as 3 normal dolls each.
  const clusterCenters=shuffle([.22,.38,.55,.71,.85]).map((x,i)=>({
    x:clamp(x+rand(-.018,.018),.15,.90),
    y:.884+rand(-.012,.012)
  }));

  let dollId=0;
  clusterCenters.forEach((c,clusterIndex)=>{
    const amount=randi(11,15);

    for(let i=0;i<amount;i++){
      const ring=i<4?.018:i<9?.044:.073;
      const angle=rand(0,Math.PI*2);

      const rare=Math.random()<.11;
      const icon=rare?randi(8,10):randi(1,7);

      dolls.push({
        x:clamp(c.x+Math.cos(angle)*rand(.004,ring),.10,.93),
        y:clamp(c.y+Math.sin(angle)*rand(.004,ring*.68),.79,.96),
        rot:rand(-32,32),
        id:dollId++,
        cluster:clusterIndex,
        icon,
        value:rare?3:1,
        rare
      });
    }
  });

  for(let i=0;i<10;i++){
    const rare=Math.random()<.08;
    const icon=rare?randi(8,10):randi(1,7);

    dolls.push({
      x:rand(.12,.92),
      y:rand(.83,.95),
      rot:rand(-32,32),
      id:dollId++,
      cluster:-1,
      icon,
      value:rare?3:1,
      rare
    });
  }

  screen.innerHTML=`<div class="catcher-shell ufo-catcher-shell v84-catcher">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんキャッチャー</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="ufo-cabinet">
      <div class="ufo-marquee"><span>★</span><b>MOB CATCHER</b><span>★</span></div>

      <div class="ufo-glass-wrap">
        <div class="ufo-side-post left"></div>
        <div class="ufo-side-post right"></div>
        <div class="ufo-top-beam"></div>

        <div id="catcherStage" class="catcher-stage ufo-glass v84-ufo-glass">
          <div class="ufo-back-logo">MOB</div>
          <div class="ufo-prize-floor"></div>

          <div class="catcher-chute ufo-chute">
            <b>PRIZE</b><span id="chuteCount">0</span>
          </div>

          <div id="dollPile" class="catcher-dolls ufo-prize-pile">
            ${dolls.map(d=>`<i class="catcher-doll ufo-prize ${d.rare?"rare":""}" data-id="${d.id}" data-value="${d.value}" style="left:${d.x*100}%;top:${d.y*100}%;transform:translate(-50%,-50%) rotate(${d.rot}deg);background-image:url('icon/${String(d.icon).padStart(2,"0")}.png')"><em>${d.rare?"★3":""}</em></i>`).join("")}
          </div>

          <div id="crane" class="crane ufo-crane v84-crane" style="left:${craneX*100}%">
            <div class="ufo-trolley"><i></i><i></i></div>
            <div id="craneCable" class="crane-cable ufo-cable" style="height:${craneY}px"></div>

            <div id="craneHead" class="crane-head ufo-head" style="top:${craneY}px">
              <div class="ufo-head-light"></div>
              <div id="armLeft" class="crane-arm ufo-arm left"><i></i></div>
              <div id="armRight" class="crane-arm ufo-arm right"><i></i></div>
              <div id="heldDolls" class="held-dolls"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="ufo-control-panel v84-ufo-panel">
        <button id="armGauge" class="arm-stop-gauge" type="button" aria-label="アーム幅を止める">
          <span id="armGaugeFill"></span>
          <i id="armGaugeMarker"></i>
          <b>SET</b>
        </button>

        <div class="catcher-controls ufo-controls v84-controls">
          <button id="craneLeft" class="move" type="button" disabled>◀</button>
          <button id="craneRight" class="move" type="button" disabled>▶</button>
          <button id="craneDrop" class="drop" type="button" disabled>降下</button>
          <button id="craneStop" class="stop" type="button" disabled>STOP</button>
        </div>
      </div>
    </div>

    <p id="catcherHint" class="hint">ARM SET → 位置 → 降下 → STOP</p>
  </div>`;

  const stage=document.getElementById("catcherStage");
  const crane=document.getElementById("crane");
  const cable=document.getElementById("craneCable");
  const head=document.getElementById("craneHead");
  const leftArm=document.getElementById("armLeft");
  const rightArm=document.getElementById("armRight");
  const heldLayer=document.getElementById("heldDolls");
  const gauge=document.getElementById("armGauge");
  const gaugeFill=document.getElementById("armGaugeFill");
  const gaugeMarker=document.getElementById("armGaugeMarker");
  const leftBtn=document.getElementById("craneLeft");
  const rightBtn=document.getElementById("craneRight");
  const dropBtn=document.getElementById("craneDrop");
  const stopBtn=document.getElementById("craneStop");
  const hint=document.getElementById("catcherHint");
  const chuteCount=document.getElementById("chuteCount");

  function renderCrane(){
    crane.style.left=`${craneX*100}%`;
    cable.style.height=`${craneY}px`;
    head.style.top=`${craneY}px`;

    const angle=22+armOpen*42;
    const spread=8+armOpen*20;
    leftArm.style.transform=`rotate(${-angle}deg) translateX(${-spread*.12}px)`;
    rightArm.style.transform=`rotate(${angle}deg) translateX(${spread*.12}px)`;
  }

  function move(dx){
    if(phase!=="position")return;
    craneX=clamp(craneX+dx,.14,.91);
    renderCrane();
    beep(460,22,.009);
  }

  leftBtn.addEventListener("pointerdown",e=>{e.preventDefault();move(-.055)},{passive:false});
  rightBtn.addEventListener("pointerdown",e=>{e.preventDefault();move(.055)},{passive:false});

  // The arm-width gauge is the decision. No percentage or explanation text.
  const widthStart=performance.now();
  const widthAnim=now=>{
    if(phase!=="width")return;

    const t=(now-widthStart)/420;
    const pos=(Math.sin(t*Math.PI*2-Math.PI/2)+1)/2;
    armOpen=.27+pos*.62;

    gaugeFill.style.width=`${pos*100}%`;
    gaugeMarker.style.left=`${pos*100}%`;
    renderCrane();

    widthRAF=requestAnimationFrame(widthAnim);
  };
  widthRAF=requestAnimationFrame(widthAnim);

  gauge.addEventListener("pointerdown",e=>{
    if(phase!=="width")return;
    e.preventDefault();

    phase="position";
    if(widthRAF)cancelAnimationFrame(widthRAF);
    gauge.classList.add("locked");
    gauge.querySelector("b").textContent="LOCK";

    leftBtn.disabled=false;
    rightBtn.disabled=false;
    dropBtn.disabled=false;
    hint.textContent="◀ ▶ で位置 → 降下";
    beep(690,55,.018);
  },{passive:false});

  dropBtn.addEventListener("pointerdown",e=>{
    if(phase!=="position")return;
    e.preventDefault();

    phase="descending";
    leftBtn.disabled=true;
    rightBtn.disabled=true;
    dropBtn.disabled=true;
    stopBtn.disabled=false;
    hint.textContent="STOP";

    const start=performance.now();
    const frame=now=>{
      if(phase!=="descending")return;

      const t=(now-start)/1000;
      craneY=clamp(22+t*175,22,300);
      renderCrane();

      if(craneY>=300){
        stopCatch();
        return;
      }
      animRAF=requestAnimationFrame(frame);
    };
    animRAF=requestAnimationFrame(frame);
  },{passive:false});

  stopBtn.addEventListener("pointerdown",e=>{
    e.preventDefault();
    stopCatch();
  },{passive:false});

  function calculateGrip(){
    const stageRect=stage.getBoundingClientRect();
    const headRect=head.getBoundingClientRect();
    const stageW=stageRect.width;
    const stageH=stageRect.height;

    const headCenterX=headRect.left-stageRect.left+headRect.width/2;
    const headBottom=headRect.bottom-stageRect.top;

    // The grab envelope moves with the actual claw.
    const clawX=headCenterX/stageW;
    const clawY=(headBottom+48)/stageH;

    // Wider gauge = wider real catch envelope and higher capacity.
    const widthQuality=clamp((armOpen-.27)/.62,0,1);
    const radiusX=.030+widthQuality*.105;
    const radiusY=.046+widthQuality*.020;

    // The prize mound sits near the bottom. Depth still matters strongly.
    const idealDepth=.875;
    const depthQuality=clamp(1-Math.abs(clawY-idealDepth)/.135,0,1);

    const candidates=dolls.map(d=>{
      const nx=(d.x-clawX)/radiusX;
      const ny=(d.y-clawY)/radiusY;
      const ellipse=nx*nx+ny*ny;
      const inside=ellipse<=1;
      const quality=inside?clamp(1-Math.sqrt(ellipse),0,1):-1;
      return {...d,quality};
    }).filter(d=>d.quality>=0).sort((a,b)=>b.quality-a.quality);

    // Wide is better, but only if the claw is actually over a dense pile and at the right depth.
    const capacity=clamp(Math.round(1+widthQuality*9),1,10);
    const usable=Math.max(0,Math.floor(capacity*(.22+.78*depthQuality)));

    // Very shallow/deep stops can genuinely get 0.
    let held=candidates.filter(d=>d.quality>=.08+(1-depthQuality)*.34).slice(0,usable);

    if(depthQuality<.18)held=[];

    const heldIds=new Set(held.map(d=>d.id));
    const slipped=candidates.filter(d=>!heldIds.has(d.id)).slice(0,8).map(d=>({
      ...d,
      el:stage.querySelector(`.catcher-doll[data-id="${d.id}"]`),
      side:d.x<clawX?-1:1
    }));

    held=held.map(d=>({
      ...d,
      el:stage.querySelector(`.catcher-doll[data-id="${d.id}"]`)
    }));

    return {
      held,
      slipped,
      depthQuality,
      widthQuality,
      nearby:candidates.length
    };
  }

  function attachRealHeldDolls(held){
    heldLayer.innerHTML="";

    held.forEach((item,i)=>{
      const el=item.el;
      if(!el)return;

      const cols=Math.min(4,Math.max(1,held.length));
      const col=i%cols;
      const row=Math.floor(i/cols);
      const left=50+(col-(cols-1)/2)*17;
      const top=35+row*17+(i%2?4:0);

      el.className=`held-doll ${item.rare?"rare":""}`;
      el.style.left=`${left}%`;
      el.style.top=`${top}px`;
      el.style.transform="";
      el.style.setProperty("--r",`${rand(-14,14)}deg`);
      el.style.setProperty("background-image",`url("icon/${String(item.icon).padStart(2,"0")}.png")`,"important");
      heldLayer.appendChild(el);
    });
  }

  async function stopCatch(){
    if(phase!=="descending")return;

    phase="closing";
    if(animRAF)cancelAnimationFrame(animRAF);
    stopBtn.disabled=true;

    const grip=calculateGrip();
    const held=grip.held;
    const caught=held.length;
    const prizeValue=held.reduce((s,d)=>s+(d.value||1),0);
    const rareCount=held.filter(d=>d.rare).length;

    hint.textContent=caught
      ? `${caught} GET / VALUE ${prizeValue}`
      : (grip.nearby===0?"NO PRIZE":"MISS");

    grip.slipped.forEach(item=>{
      if(!item.el)return;
      item.el.classList.add(item.side<0?"ufo-slip-left":"ufo-slip-right");
    });

    const lockedOpen=armOpen;
    const closeStart=performance.now();

    await new Promise(resolve=>{
      const close=now=>{
        const t=clamp((now-closeStart)/540,0,1);
        const fakeOpen=lockedOpen*(1-t)+.065*t;
        const angle=22+fakeOpen*42;
        const spread=8+fakeOpen*20;

        leftArm.style.transform=`rotate(${-angle}deg) translateX(${-spread*.12}px)`;
        rightArm.style.transform=`rotate(${angle}deg) translateX(${spread*.12}px)`;

        if(t<1)requestAnimationFrame(close);
        else resolve();
      };
      requestAnimationFrame(close);
    });

    attachRealHeldDolls(held);

    if(caught)beep(720,60,.02);
    else beep(170,100,.02);

    phase="lifting";
    const liftStart=performance.now();
    const startY=craneY;

    await new Promise(resolve=>{
      const lift=now=>{
        const t=clamp((now-liftStart)/760,0,1);
        const e=1-Math.pow(1-t,3);
        craneY=startY+(38-startY)*e;
        renderCrane();

        if(t<1)requestAnimationFrame(lift);
        else resolve();
      };
      requestAnimationFrame(lift);
    });

    phase="returning";
    const returnStart=performance.now();
    const startX=craneX;

    await new Promise(resolve=>{
      const back=now=>{
        const t=clamp((now-returnStart)/900,0,1);
        const e=1-Math.pow(1-t,3);
        craneX=startX+(.17-startX)*e;
        renderCrane();

        if(t<1)requestAnimationFrame(back);
        else resolve();
      };
      requestAnimationFrame(back);
    });

    phase="release";
    hint.textContent="OPEN";

    const openStart=performance.now();
    await new Promise(resolve=>{
      const open=now=>{
        const t=clamp((now-openStart)/410,0,1);
        const fakeOpen=.065+lockedOpen*t;
        const angle=22+fakeOpen*42;
        const spread=8+fakeOpen*20;

        leftArm.style.transform=`rotate(${-angle}deg) translateX(${-spread*.12}px)`;
        rightArm.style.transform=`rotate(${angle}deg) translateX(${spread*.12}px)`;

        if(t>.26)heldLayer.classList.add("release");

        if(t<1)requestAnimationFrame(open);
        else resolve();
      };
      requestAnimationFrame(open);
    });

    chuteCount.textContent=prizeValue;
    beep(caught?900:210,100,.03);

    state.records.catcher[p.id]=prizeValue;
    await wait(470);
    recordScreen(
      8,p,humanIndex,
      `${prizeValue}<small> VALUE</small>`,
      caught===0?"MISS":`${caught}体GET${rareCount?` / RARE ${rareCount}`:""}`
    );
  }

  renderCrane();
}

// GAME 10 -------------------------------------------------
const TIDY_ANCHORS=[
  {x:.18,y:.23},{x:.36,y:.23},{x:.58,y:.23},{x:.80,y:.23},
  {x:.16,y:.50},{x:.36,y:.50},{x:.58,y:.50},{x:.82,y:.50},
  {x:.20,y:.78},{x:.39,y:.80},{x:.60,y:.79},{x:.80,y:.80},
  {x:.30,y:.63},{x:.70,y:.64}
];

function tidyFurniture(){
  return `<div class="tidy-shelf"></div>
    <div class="tidy-table"><i></i><i></i></div>
    <div class="tidy-rug"></div>
    <div class="tidy-box"></div>`;
}

function generateTidyTargets(){
  return shuffle(TIDY_ANCHORS).slice(0,7).map(a=>({
    x:clamp(a.x+rand(-.025,.025),.08,.92),
    y:clamp(a.y+rand(-.018,.018),.10,.90)
  }));
}

function generateTidyStart(){
  const center=[
    [.43,.42],[.50,.42],[.57,.42],
    [.46,.50],[.54,.50],
    [.47,.58],[.55,.58]
  ];

  return center.map(([x,y])=>({
    x:clamp(x+rand(-.012,.012),.08,.92),
    y:clamp(y+rand(-.012,.012),.10,.90)
  }));
}

function tidySimilarity(positions,targets){
  const n=7;
  const full=1<<n;
  const dp=new Array(full).fill(Infinity);
  dp[0]=0;

  const pop=new Uint8Array(full);
  for(let i=1;i<full;i++)pop[i]=pop[i>>1]+(i&1);

  for(let mask=0;mask<full;mask++){
    const k=pop[mask];
    if(k>=n||!Number.isFinite(dp[mask]))continue;

    const pos=positions[k];
    for(let j=0;j<n;j++){
      if(mask&(1<<j))continue;

      const t=targets[j];
      const d=Math.hypot(pos.x-t.x,pos.y-t.y);
      const next=mask|(1<<j);
      const cost=dp[mask]+d;

      if(cost<dp[next])dp[next]=cost;
    }
  }

  const avg=dp[full-1]/n;
  return clamp(Math.round((1-avg/.205)*100),0,100);
}

async function startTidy(p,humanIndex,runId){
  gameFit();

  const targets=generateTidyTargets();
  let positions=generateTidyStart();
  let dragging=null;
  let pointerId=null;
  let finished=false;
  let timerRAF=null;
  let endAt=0;

  screen.innerHTML=`<div class="tidy-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん整理整頓</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="tidy-hud">
      <div><span>TIME</span><b id="tidyTime">10.00</b></div>
      <div><span>MATCH</span><b id="tidyScore">${tidySimilarity(positions,targets)}%</b></div>
    </div>

    <div class="tidy-room-stack">
      <div class="tidy-room-label"><b>見本</b><span>REFERENCE</span></div>
      <div class="tidy-room reference">
        ${tidyFurniture()}
        ${targets.map(t=>`<div class="tidy-mob static" style="left:${t.x*100}%;top:${t.y*100}%"></div>`).join("")}
      </div>

      <div class="tidy-room-label"><b>自分の部屋</b><span>DRAG 7 MOB</span></div>
      <div id="tidyPlayRoom" class="tidy-room play">
        ${tidyFurniture()}
        ${positions.map((t,i)=>`<div class="tidy-mob movable" data-tidy="${i}" style="left:${t.x*100}%;top:${t.y*100}%"></div>`).join("")}
      </div>
    </div>

    <p id="tidyHint" class="hint">自動吸着なし。見本を見ながら自分の感覚で置いてください。</p>
  </div>`;

  const room=document.getElementById("tidyPlayRoom");
  const timeEl=document.getElementById("tidyTime");
  const scoreEl=document.getElementById("tidyScore");
  const hint=document.getElementById("tidyHint");

  function updateScore(){
    scoreEl.textContent=`${tidySimilarity(positions,targets)}%`;
  }

  function setPosition(index,clientX,clientY){
    const rect=room.getBoundingClientRect();
    const x=clamp((clientX-rect.left)/rect.width,.06,.94);
    const y=clamp((clientY-rect.top)/rect.height,.08,.94);

    positions[index]={x,y};

    const el=room.querySelector(`[data-tidy="${index}"]`);
    if(el){
      el.style.left=`${x*100}%`;
      el.style.top=`${y*100}%`;
    }
  }

  room.addEventListener("pointerdown",e=>{
    const mob=e.target.closest(".tidy-mob.movable");
    if(!mob||finished)return;

    e.preventDefault();
    dragging=Number(mob.dataset.tidy);
    pointerId=e.pointerId;
    mob.classList.add("dragging");

    try{mob.setPointerCapture(pointerId)}catch(_){}
    setPosition(dragging,e.clientX,e.clientY);
  },{passive:false});

  room.addEventListener("pointermove",e=>{
    if(dragging===null||e.pointerId!==pointerId||finished)return;
    e.preventDefault();
    setPosition(dragging,e.clientX,e.clientY);
  },{passive:false});

  const release=e=>{
    if(dragging===null||e.pointerId!==pointerId||finished)return;
    e.preventDefault();

    const index=dragging;
    const el=room.querySelector(`[data-tidy="${index}"]`);
    if(el)el.classList.remove("dragging");

    // No snap / no auto correction.
    dragging=null;
    pointerId=null;
    updateScore();
  };

  room.addEventListener("pointerup",release,{passive:false});
  room.addEventListener("pointercancel",release,{passive:false});

  function finishTidy(){
    if(finished)return;
    finished=true;
    if(timerRAF)cancelAnimationFrame(timerRAF);

    const score=tidySimilarity(positions,targets);
    state.records.tidy[p.id]=score;
    hint.textContent=`MATCH ${score}%`;

    room.querySelectorAll(".tidy-mob").forEach(el=>el.style.pointerEvents="none");

    setTimeout(()=>recordScreen(9,p,humanIndex,`${score}<small>%</small>`,score===100?"PERFECT ROOM":"ROOM MATCH"),240);
  }

  if(!(await countdown("TIDY ROOM",runId)))return;
  if(!document.body.contains(room))return;

  endAt=performance.now()+10000;

  const timer=now=>{
    if(finished)return;

    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finishTidy();
      return;
    }
    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 11 -------------------------------------------------
function skiDistanceFromTiming(deltaMs){
  const a=Math.abs(deltaMs);

  // Called only inside the actual takeoff window.
  if(a<=25)return 1000-(a/25)*45;          // 955–1000m
  if(a<=55)return 955-((a-25)/30)*105;     // 850–955m
  if(a<=95)return 850-((a-55)/40)*180;     // 670–850m
  if(a<=135)return 670-((a-95)/40)*210;    // 460–670m
  return 460-((a-135)/45)*240;             // 220–460m
}

function skiTimingLabel(deltaMs){
  const a=Math.abs(deltaMs);
  if(a<=25)return "PERFECT";
  if(a<=55)return "GREAT";
  if(a<=95)return "GOOD";
  return deltaMs<0?"EARLY":"LATE";
}

async function startSkiJump(p,humanIndex,runId){
  gameFit();

  let running=false;
  let resolved=false;
  let startTime=0;
  let runRAF=null;
  let earlyTapLock=0;

  const idealTime=2500;          // Jumper center reaches the yellow JUMP lip.
  const validEarly=180;          // Earliest valid takeoff.
  const validLate=165;           // Latest valid takeoff.
  const failTime=idealTime+185;  // After this the jumper physically falls.
  const worldWidth=5200;
  const runStartX=70;
  const takeoffX=720;
  const pxPerM=4.15;

  screen.innerHTML=`<div class="ski-shell ski-shell-v84">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんスキージャンプ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="ski-hud">
      <div><span>TIMING</span><b id="skiTiming">WAIT</b></div>
      <div><span>DISTANCE</span><b id="skiDistance">0.0m</b></div>
    </div>

    <button id="skiStage" class="ski-stage ski-stage-v84" type="button">
      <div id="skiCameraWorld" class="ski-camera-world" style="width:${worldWidth}px">
        <div class="ski-sky-lines"><i></i><i></i><i></i><i></i></div>

        <div class="ski-start-platform"></div>
        <div class="ski-slope-main"></div>
        <div class="ski-slope-edge"></div>
        <div class="ski-takeoff-lip"><b>JUMP</b></div>

        <div class="ski-flight-ground"></div>
        ${[0,200,400,600,800,1000].map(m=>`<div class="ski-world-meter" style="left:${takeoffX+m*pxPerM}px"><i></i><span>${m}m</span></div>`).join("")}

        <div id="skiJumper" class="ski-jumper ski-jumper-v84">
          <div class="ski-mob"></div>
          <div class="ski-board b1"></div>
          <div class="ski-board b2"></div>
        </div>
      </div>

      <div id="skiFlyCallout" class="ski-fly-callout">FLY!</div>
      <div id="skiNoJumpCallout" class="ski-nojump-callout">NOT YET</div>
    </button>

    <p id="skiHint" class="hint">黄色いJUMPリップに来た瞬間だけジャンプできます。</p>
  </div>`;

  const stage=document.getElementById("skiStage");
  const world=document.getElementById("skiCameraWorld");
  const jumper=document.getElementById("skiJumper");
  const timingEl=document.getElementById("skiTiming");
  const distanceEl=document.getElementById("skiDistance");
  const hint=document.getElementById("skiHint");
  const flyCallout=document.getElementById("skiFlyCallout");
  const noJumpCallout=document.getElementById("skiNoJumpCallout");

  function cameraFollow(x,ratio=.40){
    const vw=stage.clientWidth;
    const lead=vw*ratio;
    const camera=Math.max(0,Math.min(worldWidth-vw,x-lead));
    world.style.transform=`translateX(${-camera}px)`;
  }

  function renderRun(elapsed){
    // Reach the visible JUMP lip exactly at idealTime.
    const t=clamp(elapsed/idealTime,0,1);
    const x=runStartX+t*(takeoffX-runStartX);
    const y=68+t*202;

    jumper.style.left=`${x}px`;
    jumper.style.top=`${y}px`;
    jumper.style.transform=`translate(-50%,-50%) rotate(${15+t*17}deg)`;

    cameraFollow(x,.40);
  }

  async function fallOff(){
    if(resolved)return;
    resolved=true;
    running=false;
    if(runRAF)cancelAnimationFrame(runRAF);

    timingEl.textContent="NO JUMP";
    hint.textContent="踏切できず落下！";
    distanceEl.textContent="0.0m";
    beep(145,180,.035);

    const startX=takeoffX+10;
    const startY=272;
    const fallStart=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        const t=clamp((now-fallStart)/900,0,1);
        const x=startX+t*170;
        const y=startY+t*t*260;

        jumper.style.left=`${x}px`;
        jumper.style.top=`${y}px`;
        jumper.style.transform=`translate(-50%,-50%) rotate(${32+t*130}deg)`;
        cameraFollow(x,.38);

        if(t<1)requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

    state.records.ski[p.id]=0;
    await wait(220);
    recordScreen(10,p,humanIndex,`0.0<small>m</small>`,`NO JUMP`);
  }

  async function resolveJump(delta){
    if(resolved)return;

    resolved=true;
    running=false;
    if(runRAF)cancelAnimationFrame(runRAF);

    const meters=Math.round(clamp(skiDistanceFromTiming(delta),220,1000)*10)/10;
    const label=skiTimingLabel(delta);

    timingEl.textContent=label;
    hint.textContent=`${label} / ${Math.abs(Math.round(delta))}ms`;
    flyCallout.classList.add("show");

    beep(label==="PERFECT"?980:label==="GREAT"?830:label==="GOOD"?700:360,90,.028);

    const targetX=takeoffX+meters*pxPerM;
    const flightStart=performance.now();
    const flightDuration=1750+meters*1.15;
    const startY=270;
    const landingY=326;

    await new Promise(resolve=>{
      const frame=now=>{
        const t=clamp((now-flightStart)/flightDuration,0,1);
        const ease=1-Math.pow(1-t,2.05);
        const x=takeoffX+(targetX-takeoffX)*ease;

        const arc=Math.sin(t*Math.PI)*(135+meters*.18);
        const y=startY+(landingY-startY)*t-arc;

        jumper.style.left=`${x}px`;
        jumper.style.top=`${y}px`;
        jumper.style.transform=`translate(-50%,-50%) rotate(${7+t*27}deg)`;

        const currentMeters=Math.min(meters,Math.max(0,(x-takeoffX)/pxPerM));
        distanceEl.textContent=`${currentMeters.toFixed(1)}m`;
        cameraFollow(x,.34);

        if(t>.16)flyCallout.classList.remove("show");

        if(t<1)requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

    jumper.classList.add("land");
    distanceEl.textContent=`${meters.toFixed(1)}m`;
    state.records.ski[p.id]=Math.round(meters*10);

    await wait(420);
    recordScreen(10,p,humanIndex,`${meters.toFixed(1)}<small>m</small>`,`${label} / MAX 1000m`);
  }

  stage.addEventListener("pointerdown",e=>{
    if(!running||resolved)return;
    e.preventDefault();

    const elapsed=performance.now()-startTime;
    const delta=elapsed-idealTime;

    // Pressing somewhere in the middle of the slope cannot launch anymore.
    if(delta<-validEarly){
      const now=performance.now();
      if(now>=earlyTapLock){
        earlyTapLock=now+230;
        timingEl.textContent="WAIT";
        noJumpCallout.classList.remove("show");
        void noJumpCallout.offsetWidth;
        noJumpCallout.classList.add("show");
        setTimeout(()=>noJumpCallout.classList.remove("show"),180);
        beep(230,30,.008);
      }
      return;
    }

    // Once past the actual lip, it is too late and the jumper falls.
    if(delta>validLate){
      fallOff();
      return;
    }

    resolveJump(delta);
  },{passive:false});

  if(!(await countdown("SKI JUMP",runId)))return;
  if(!document.body.contains(stage))return;

  running=true;
  startTime=performance.now();

  const run=now=>{
    if(!running||resolved)return;

    const elapsed=now-startTime;

    if(elapsed<=idealTime){
      renderRun(elapsed);
    }else{
      // Roll slightly beyond the lip while waiting for the very small late window.
      const late=clamp((elapsed-idealTime)/(failTime-idealTime),0,1);
      const x=takeoffX+late*22;
      const y=270+late*13;
      jumper.style.left=`${x}px`;
      jumper.style.top=`${y}px`;
      jumper.style.transform=`translate(-50%,-50%) rotate(${32+late*9}deg)`;
      cameraFollow(x,.40);
    }

    if(elapsed>=failTime){
      fallOff();
      return;
    }

    runRAF=requestAnimationFrame(run);
  };
  runRAF=requestAnimationFrame(run);
}

// GAME 12 -------------------------------------------------
const SLOT_SYMBOLS=Array.from({length:10},(_,i)=>({
  key:`C${i+1}`,
  icon:i+1,
  rare:i>=7
}));

function slotPayout(keys){
  if(!(keys[0]===keys[1]&&keys[1]===keys[2]))return {mult:0,label:"MISS"};

  const index=Number(keys[0].slice(1));

  if(index===10)return {mult:8,label:"JACKPOT ×8"};
  if(index>=8)return {mult:5,label:"RARE ×5"};
  if(index>=6)return {mult:3,label:"SPECIAL ×3"};
  return {mult:2,label:"MATCH ×2"};
}

async function startMobSlot(p,humanIndex,runId){
  gameFit();

  let coins=1000;
  let running=false;
  let finished=false;
  let spinActive=false;
  let stopIndex=0;
  let timerRAF=null;
  let endAt=0;
  let reelRAF=null;
  let reelStart=0;
  let visible=[0,1,2];
  let stopped=[null,null,null];
  let targetIndex=0;

  screen.innerHTML=`<div class="mob-slot-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんスロット</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="slot-hud">
      <div><span>TIME</span><b id="slotTime">10.00</b></div>
      <div><span>COIN</span><b id="slotCoins">1000</b></div>
    </div>

    <div class="slot-machine">
      <div class="slot-top">SLOT</div>

      <div class="slot-reels slot-reels-v88">
        ${[0,1,2].map(i=>`
          <div class="slot-reel slot-reel-v88" data-reel="${i}">
            <div class="slot-reel-track" id="slotTrack${i}">
              <div class="slot-peek top" id="slotPrev${i}"></div>
              <div class="slot-symbol mob-symbol" id="slotSymbol${i}"></div>
              <div class="slot-peek bottom" id="slotNext${i}"></div>
            </div>
            <i class="slot-center-line top"></i>
            <i class="slot-center-line bottom"></i>
          </div>`).join("")}
      </div>

      <div id="slotResult" class="slot-result">READY</div>
      <button id="slotMainBtn" class="slot-main-button" type="button">SPIN</button>
    </div>

    <div class="slot-paytable character-paytable">
      <span><i style="background-image:url('icon/01.png')"></i><b>×2</b></span>
      <span><i style="background-image:url('icon/06.png')"></i><b>×3</b></span>
      <span><i style="background-image:url('icon/08.png')"></i><b>×5</b></span>
      <span><i style="background-image:url('icon/10.png')"></i><b>×8</b></span>
    </div>
  </div>`;

  const timeEl=document.getElementById("slotTime");
  const coinsEl=document.getElementById("slotCoins");
  const resultEl=document.getElementById("slotResult");
  const mainBtn=document.getElementById("slotMainBtn");
  const symbolEls=[0,1,2].map(i=>document.getElementById(`slotSymbol${i}`));
  const prevEls=[0,1,2].map(i=>document.getElementById(`slotPrev${i}`));
  const nextEls=[0,1,2].map(i=>document.getElementById(`slotNext${i}`));
  const trackEls=[0,1,2].map(i=>document.getElementById(`slotTrack${i}`));

  function symbolImage(index){
    const s=SLOT_SYMBOLS[(index+SLOT_SYMBOLS.length)%SLOT_SYMBOLS.length];
    return `url("icon/${String(s.icon).padStart(2,"0")}.png")`;
  }

  function renderReel(reelIndex,symbolIndex,fraction=.5){
    const total=SLOT_SYMBOLS.length;
    const current=(symbolIndex+total)%total;
    const prev=(current-1+total)%total;
    const next=(current+1)%total;
    const s=SLOT_SYMBOLS[current];

    const center=symbolEls[reelIndex];
    center.className=`slot-symbol mob-symbol ${s.rare?"rare":""}`;
    center.textContent="";
    center.style.backgroundImage=symbolImage(current);

    prevEls[reelIndex].style.backgroundImage=symbolImage(prev);
    nextEls[reelIndex].style.backgroundImage=symbolImage(next);

    // Small continuous vertical offset makes the reel visibly roll.
    const offset=(fraction-.5)*34;
    trackEls[reelIndex].style.transform=`translateY(${offset}px)`;
  }

  function chooseTargetIndex(){
    const r=Math.random();
    if(r<.62)return randi(0,4);
    if(r<.84)return randi(5,6);
    if(r<.96)return randi(7,8);
    return 9;
  }

  function spinReels(now){
    if(!spinActive)return;

    const elapsed=now-reelStart;

    for(let i=stopIndex;i<3;i++){
      const speed=72+i*10;
      const raw=elapsed/speed+i*1.7;
      const base=Math.floor(raw);
      const fraction=raw-base;
      visible[i]=base%SLOT_SYMBOLS.length;
      renderReel(i,visible[i],fraction);
    }

    reelRAF=requestAnimationFrame(spinReels);
  }

  function beginSpin(){
    if(!running||finished||spinActive||coins<100)return;

    coins-=100;
    coinsEl.textContent=coins;
    spinActive=true;
    stopIndex=0;
    stopped=[null,null,null];
    targetIndex=chooseTargetIndex();
    resultEl.textContent="-";
    resultEl.classList.remove("win");
    mainBtn.textContent="STOP 1";
    mainBtn.classList.add("stopping");

    reelStart=performance.now();
    reelRAF=requestAnimationFrame(spinReels);
    beep(420,40,.012);
  }

  async function stopCurrent(){
    if(!running||finished)return;

    if(!spinActive){
      beginSpin();
      return;
    }

    let idx=visible[stopIndex];

    // 最初の2リールはほぼ狙いキャラへ揃う。
    if(stopIndex===0&&Math.random()<.995){
      idx=targetIndex;
    }else if(stopIndex===1&&Math.random()<.985){
      idx=targetIndex;
    }else if(stopIndex===2&&Math.random()<.36){
      idx=targetIndex;
    }

    visible[stopIndex]=idx;
    stopped[stopIndex]=idx;
    renderReel(stopIndex,idx,.5);
    beep(620+stopIndex*90,45,.018);

    stopIndex++;

    if(stopIndex<3){
      mainBtn.textContent=`STOP ${stopIndex+1}`;
      return;
    }

    spinActive=false;
    if(reelRAF)cancelAnimationFrame(reelRAF);

    const keys=stopped.map(i=>SLOT_SYMBOLS[i].key);
    const payout=slotPayout(keys);

    if(payout.mult>0){
      const win=100*payout.mult;
      coins+=win;
      coinsEl.textContent=coins;
      resultEl.textContent=`${payout.label} +${win}`;
      resultEl.classList.add("win");
      beep(payout.mult>=8?980:payout.mult>=5?860:740,100,.03);
    }else{
      resultEl.textContent="MISS";
      resultEl.classList.remove("win");
      beep(180,65,.012);
    }

    mainBtn.classList.remove("stopping");
    mainBtn.textContent="SPIN";
    await wait(70);
  }

  mainBtn.addEventListener("pointerdown",e=>{
    e.preventDefault();
    stopCurrent();
  },{passive:false});

  function finishSlot(){
    if(finished)return;
    finished=true;
    running=false;

    if(timerRAF)cancelAnimationFrame(timerRAF);
    if(reelRAF)cancelAnimationFrame(reelRAF);

    mainBtn.disabled=true;
    state.records.slot[p.id]=coins;

    setTimeout(()=>recordScreen(
      11,p,humanIndex,
      `${coins}<small> COIN</small>`,
      coins>1000?`+${coins-1000}`:coins===1000?"±0":`${coins-1000}`
    ),220);
  }

  renderReel(0,0,.5);
  renderReel(1,1,.5);
  renderReel(2,2,.5);

  if(!(await countdown("SLOT",runId)))return;
  if(!document.body.contains(mainBtn))return;

  running=true;
  endAt=performance.now()+10000;

  const timer=now=>{
    if(finished)return;

    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finishSlot();
      return;
    }

    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 13 -------------------------------------------------
async function startJumpRope(p,humanIndex,runId){
  gameFit();

  let count=0;
  let finished=false;
  let jumpStart=0;
  const jumpDuration=520;
  let animRAF=null;
  let incoming=null;
  let nextSpawnAt=0;

  screen.innerHTML=`<div class="mob-jump-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブ跳び</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="rope-hud">
      <div><span>DODGE</span><b id="ropeCount">0</b></div>
      <div><span>SPEED</span><b id="ropeSpeed">1.0x</b></div>
    </div>

    <button id="mobJumpStage" class="mob-jump-stage" type="button">
      <div class="mob-jump-ground"></div>
      <div id="jumpPlayer" class="jump-player"></div>
      <div id="incomingRunner" class="incoming-runner"></div>
      <div id="mobJumpReady" class="mob-jump-ready">READY</div>
    </button>

    <p id="ropeHint" class="hint">左右から来るモブくんを、1回ずつ正確にジャンプ。</p>
  </div>`;

  const stage=document.getElementById("mobJumpStage");
  const player=document.getElementById("jumpPlayer");
  const runner=document.getElementById("incomingRunner");
  const ready=document.getElementById("mobJumpReady");
  const countEl=document.getElementById("ropeCount");
  const speedEl=document.getElementById("ropeSpeed");
  const hint=document.getElementById("ropeHint");

  function jumpHeight(now){
    if(!jumpStart)return 0;

    const t=(now-jumpStart)/jumpDuration;
    if(t<0||t>=1){
      jumpStart=0;
      player.classList.remove("jump-active");
      player.style.transform="translateX(-50%) translateY(0)";
      return 0;
    }

    const height=Math.sin(t*Math.PI)*96;
    player.style.transform=`translateX(-50%) translateY(${-height}px)`;
    return height;
  }

  stage.addEventListener("pointerdown",e=>{
    if(finished)return;
    e.preventDefault();

    const now=performance.now();

    // 空中での連打は完全無効。着地するまで次のジャンプは出ない。
    if(jumpStart&&now-jumpStart<jumpDuration)return;

    jumpStart=now;
    player.classList.add("jump-active");
    beep(640,28,.012);
  },{passive:false});

  function spawn(now){
    const stageW=stage.clientWidth;
    const fromRight=Math.random()<.68;
    // 左から来る時は必ずSLOW。右からもたまにSLOWが混ざる。
    const slow=!fromRight||Math.random()<.10;

    const normalSpeed=Math.min(1840,540+count*48);
    const speed=slow?rand(285,430):normalSpeed*rand(.94,1.08);
    const icon=randi(1,10);

    incoming={
      x:fromRight?stageW+68:-78,
      speed,
      direction:fromRight?-1:1,
      icon,
      passed:false,
      slow
    };

    runner.style.display="block";
    runner.style.backgroundImage=`url("icon/${String(icon).padStart(2,"0")}.png")`;
    runner.className=`incoming-runner ${fromRight?"from-right":"from-left"} ${slow?"slow":""}`;
    runner.style.transform=`translateX(${incoming.x}px) scaleX(${fromRight?1:-1})`;

    speedEl.textContent=slow?"SLOW":`${(speed/520).toFixed(1)}x`;
    hint.textContent=fromRight
      ? (slow?"右からSLOW MOB":"右から来る！")
      : (slow?"左からSLOW MOB":"左から来る！");
  }

  function finish(){
    if(finished)return;
    finished=true;
    if(animRAF)cancelAnimationFrame(animRAF);

    state.records.rope[p.id]=count;
    setTimeout(()=>recordScreen(12,p,humanIndex,`${count}<small>体</small>`,`MOB JUMP`),320);
  }

  if(!(await countdown("MOB JUMP",runId)))return;
  if(!document.body.contains(stage))return;

  nextSpawnAt=performance.now()+1050;
  ready.textContent="GO!";
  ready.classList.add("go");
  setTimeout(()=>ready.classList.remove("go"),430);

  let last=performance.now();

  const frame=now=>{
    if(finished)return;

    const dt=Math.min(32,now-last);
    last=now;

    const height=jumpHeight(now);

    if(!incoming&&now>=nextSpawnAt){
      spawn(now);
    }

    if(incoming){
      incoming.x+=incoming.direction*incoming.speed*dt/1000;
      runner.style.transform=`translateX(${incoming.x}px) scaleX(${incoming.direction<0?1:-1})`;

      const stageRect=stage.getBoundingClientRect();
      const playerRect=player.getBoundingClientRect();
      const runnerRect=runner.getBoundingClientRect();

      const playerCenter=(playerRect.left+playerRect.right)/2-stageRect.left;
      const runnerCenter=(runnerRect.left+runnerRect.right)/2-stageRect.left;
      const horizontalGap=Math.abs(playerCenter-runnerCenter);

      // 判定は「タイマーが生きているか」ではなく、実際のジャンプ高さ。
      // 連打で常時無敵にはできない。
      const collisionZone=horizontalGap<46;

      if(collisionZone&&!incoming.passed){
        if(height>=44){
          incoming.passed=true;
          count++;
          countEl.textContent=count;
          hint.textContent=`CLEAR ${count}!`;
          beep(850,42,.018);
        }else{
          runner.classList.add("hit");
          player.classList.add("hurt");
          hint.textContent="HIT!";
          beep(145,180,.035);
          finish();
          return;
        }
      }

      const stageW=stage.clientWidth;
      const goneRight=incoming.direction>0&&incoming.x>stageW+95;
      const goneLeft=incoming.direction<0&&incoming.x<-95;

      if(goneRight||goneLeft){
        incoming=null;
        runner.style.display="none";

        // 後半ほど次が早い。時々かなり短い間隔も来る。
        const baseGap=Math.max(105,620-count*16);
        const gap=Math.random()<.18?baseGap*.55:baseGap;
        nextSpawnAt=now+gap;
      }
    }

    animRAF=requestAnimationFrame(frame);
  };

  animRAF=requestAnimationFrame(frame);
}

// GAME 14 -------------------------------------------------
async function startPK(p,humanIndex,runId){
  gameFit();

  let shot=0;
  let saves=0;
  let active=false;
  let chosen=null;
  let gestureStart=null;

  screen.innerHTML=`<div class="pk-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんPK</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="pk-hud">
      <div><span>SHOT</span><b id="pkShot">0 / 10</b></div>
      <div><span>SAVE</span><b id="pkSave">0</b></div>
    </div>

    <div id="pkField" class="pk-field pk-field-v88">
      <div class="pk-goal">
        <div class="pk-net"></div>
        <div id="pkKeeper" class="pk-keeper"></div>
        <div id="pkBall" class="pk-ball"></div>
      </div>
      <div id="pkShooter" class="pk-shooter"></div>

      <div class="pk-gesture-guide">
        <span>← SWIPE</span>
        <b>TAP</b>
        <span>SWIPE →</span>
      </div>
    </div>

    <p id="pkHint" class="hint">左へスワイプ / 中央はタップ / 右へスワイプ。</p>
  </div>`;

  const field=document.getElementById("pkField");
  const shotEl=document.getElementById("pkShot");
  const saveEl=document.getElementById("pkSave");
  const keeper=document.getElementById("pkKeeper");
  const ball=document.getElementById("pkBall");
  const shooter=document.getElementById("pkShooter");
  const hint=document.getElementById("pkHint");

  function chooseKeeper(dir){
    if(!active||chosen!==null)return;
    chosen=dir;

    keeper.className="pk-keeper";
    keeper.classList.add(`dive-${dir}`);
    beep(dir===1?660:560,35,.012);
  }

  field.addEventListener("pointerdown",e=>{
    if(!active||chosen!==null)return;
    e.preventDefault();
    gestureStart={x:e.clientX,y:e.clientY,id:e.pointerId,time:performance.now()};
    try{field.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  field.addEventListener("pointerup",e=>{
    if(!active||chosen!==null||!gestureStart||gestureStart.id!==e.pointerId)return;
    e.preventDefault();

    const dx=e.clientX-gestureStart.x;
    const dy=e.clientY-gestureStart.y;
    const dist=Math.hypot(dx,dy);

    if(Math.abs(dx)>=34&&Math.abs(dx)>Math.abs(dy)*.65){
      chooseKeeper(dx<0?0:2);
    }else if(dist<28){
      chooseKeeper(1);
    }

    gestureStart=null;
  },{passive:false});

  field.addEventListener("pointercancel",()=>{gestureStart=null},{passive:false});

  if(!(await countdown("PK",runId)))return;
  if(!document.body.contains(ball))return;

  for(shot=1;shot<=10;shot++){
    active=false;
    chosen=null;
    gestureStart=null;
    keeper.className="pk-keeper";
    ball.className="pk-ball";
    ball.style.transform="translate(-50%,0)";
    ball.style.opacity="1";

    const shooterIcon=randi(1,10);
    shooter.style.backgroundImage=`url("icon/${String(shooterIcon).padStart(2,"0")}.png")`;
    shotEl.textContent=`${shot} / 10`;
    hint.textContent=`SHOT ${shot} READY`;

    await wait(480+rand(100,300));

    const dir=randi(0,2);
    shooter.classList.remove("kick");
    void shooter.offsetWidth;
    shooter.classList.add("kick");

    hint.textContent="KICK!";
    beep(360,35,.012);
    active=true;

    const targetX=[-92,0,92][dir];

    // 平均は見切れる速度を確保。たまにV8.9相当の高速シュート。
    const speedRoll=Math.random();
    const shotDuration=speedRoll<.14
      ? rand(270,315)
      : speedRoll<.38
        ? rand(350,420)
        : rand(445,560);

    hint.textContent=shotDuration<325?"FAST SHOT!":"KICK!";

    const start=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        const t=clamp((now-start)/shotDuration,0,1);
        ball.style.transform=`translate(calc(-50% + ${targetX*t}px),${-150*t}px) scale(${1-.2*t})`;

        if(t<1)requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });

    active=false;
    const saved=chosen===dir;

    if(saved){
      saves++;
      saveEl.textContent=saves;
      hint.textContent="SAVE!";
      ball.classList.add("saved");
      beep(880,70,.025);
    }else{
      hint.textContent="GOAL";
      ball.classList.add("goal");
      beep(170,80,.02);
    }

    await wait(370);
  }

  state.records.pk[p.id]=saves;
  recordScreen(13,p,humanIndex,`${saves}<small>/10</small>`,`PK SAVE`);
}

// GAME 15 -------------------------------------------------
function musicalChairCpuTimes(round){
  if(round===0){
    const fastest=rand(285,325);
    return shuffle([
      fastest,
      fastest+rand(28,72),
      fastest+rand(70,125),
      fastest+rand(115,180)
    ]);
  }

  const fastest=rand(198,225);
  return shuffle([
    fastest,
    fastest+rand(22,58),
    fastest+rand(55,100),
    fastest+rand(95,150)
  ]);
}

async function startMusicalChairs(p,humanIndex,runId){
  gameFit();

  let walkRAF=null;
  const roundTimes=[];
  const roundRanks=[];
  const cpuPlayers=[
    {name:"CPU 1",icon:2},
    {name:"CPU 2",icon:3},
    {name:"CPU 3",icon:4},
    {name:"CPU 4",icon:5}
  ];

  screen.innerHTML=`<div class="chair-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん椅子取りゲーム</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="chair-hud">
      <div><span>ROUND</span><b id="chairRound">1 / 2</b></div>
      <div><span>BEST</span><b id="chairBest">--</b></div>
    </div>

    <div id="chairArena" class="chair-arena">
      <div id="musicRing" class="music-ring">
        ${Array.from({length:12},(_,i)=>`<span style="--i:${i};--delay:${(i%6)*-.13}s">♪</span>`).join("")}
      </div>

      <button id="chairButton" class="chair-button" type="button" aria-label="椅子">
        <span class="chair-back"></span>
        <span class="chair-seat"></span>
        <i class="chair-leg l1"></i>
        <i class="chair-leg l2"></i>
      </button>

      <div class="chair-racers">
        <div class="chair-racer player" data-chair-player="1">
          <i style="background-image:url('${p.img}')"></i>
          <b>YOU</b>
          <em id="chairYouTime">--</em>
        </div>

        ${cpuPlayers.map((cpu,i)=>`
          <div class="chair-racer cpu" data-chair-cpu="${i}">
            <i style="background-image:url('icon/${String(cpu.icon).padStart(2,"0")}.png')"></i>
            <b>${cpu.name}</b>
            <em>--</em>
          </div>`).join("")}
      </div>

      <div id="chairMessage" class="chair-message">♪ MUSIC ♪</div>
      <div id="chairWinnerCall" class="chair-winner-call"></div>
    </div>

    <div id="chairRoundResult" class="chair-round-result">
      <div class="chair-result-card">
        <span id="chairResultLabel">ROUND 1 RESULT</span>
        <strong id="chairResultTime">0.300s</strong>
        <div id="chairResultRank">1 / 5</div>
        <button id="chairNext" class="primary" type="button">NEXT</button>
      </div>
    </div>

    <div id="chairFinalResult" class="chair-final-result">
      <div class="chair-final-card">
        <span>FINAL RESULT</span>

        <div class="chair-final-rounds">
          <div>
            <small>1回目</small>
            <b id="chairFinalR1">--</b>
            <em id="chairFinalRank1">--</em>
          </div>
          <div>
            <small>2回目</small>
            <b id="chairFinalR2">--</b>
            <em id="chairFinalRank2">--</em>
          </div>
        </div>

        <p>あなたの最高記録は</p>
        <strong id="chairFinalBest">0.000秒！</strong>

        <button id="chairFinalNext" class="primary" type="button">NEXT</button>
      </div>
    </div>
  </div>`;

  const arena=document.getElementById("chairArena");
  const musicRing=document.getElementById("musicRing");
  const chair=document.getElementById("chairButton");
  const roundEl=document.getElementById("chairRound");
  const bestEl=document.getElementById("chairBest");
  const message=document.getElementById("chairMessage");
  const winnerCall=document.getElementById("chairWinnerCall");
  const youTimeEl=document.getElementById("chairYouTime");

  const playerEl=arena.querySelector("[data-chair-player]");
  const cpuEls=[...arena.querySelectorAll("[data-chair-cpu]")];

  const overlay=document.getElementById("chairRoundResult");
  const resultLabel=document.getElementById("chairResultLabel");
  const resultTime=document.getElementById("chairResultTime");
  const resultRank=document.getElementById("chairResultRank");
  const nextBtn=document.getElementById("chairNext");

  const finalOverlay=document.getElementById("chairFinalResult");
  const finalR1=document.getElementById("chairFinalR1");
  const finalR2=document.getElementById("chairFinalR2");
  const finalRank1=document.getElementById("chairFinalRank1");
  const finalRank2=document.getElementById("chairFinalRank2");
  const finalBest=document.getElementById("chairFinalBest");
  const finalNext=document.getElementById("chairFinalNext");

  const allRacers=[playerEl,...cpuEls];
  function stopChairWalk(){
    if(walkRAF)cancelAnimationFrame(walkRAF);
    walkRAF=null;
    allRacers.forEach(el=>el.classList.remove("walking"));
  }
  function startChairWalk(){
    stopChairWalk();
    const began=performance.now();
    allRacers.forEach(el=>el.classList.add("walking"));
    const walk=now=>{
      if(!isGameRunValid(runId))return;
      const w=arena.clientWidth,h=arena.clientHeight,cx=w*.5,cy=h*.46;
      const rx=Math.min(w*.34,148),ry=Math.min(h*.28,108);
      allRacers.forEach((el,i)=>{
        const a=(now-began)/1150+i*Math.PI*2/allRacers.length;
        el.style.left=`${cx+Math.cos(a)*rx}px`;
        el.style.top=`${cy+Math.sin(a)*ry}px`;
        el.style.right="auto";el.style.bottom="auto";
        el.style.transform="translate(-50%,-50%)";
      });
      walkRAF=requestAnimationFrame(walk);
    };
    walkRAF=requestAnimationFrame(walk);
  }

  function clearSeated(){
    playerEl.classList.remove("seated","winner");
    cpuEls.forEach(el=>el.classList.remove("seated","winner","arrived"));
  }

  function seatWinner(winner){
    clearSeated();

    let el=null;

    if(winner.you){
      el=playerEl;
    }else if(winner.index!==undefined){
      el=cpuEls[winner.index];
    }

    if(!el)return;

    el.classList.add("winner","seated");
    winnerCall.textContent=`${winner.name} GET CHAIR!`;
    winnerCall.classList.remove("show");
    void winnerCall.offsetWidth;
    winnerCall.classList.add("show");

    chair.classList.add("occupied");
    message.textContent=`${winner.name} が座った！`;
    message.className="chair-message winner-message";

    beep(980,100,.03);
  }

  function waitForRoundNext(){
    return new Promise(resolve=>{
      nextBtn.onclick=()=>{
        overlay.classList.remove("show");
        nextBtn.onclick=null;
        resolve();
      };
    });
  }

  function waitForFinalNext(){
    return new Promise(resolve=>{
      finalNext.onclick=()=>{
        finalOverlay.classList.remove("show");
        finalNext.onclick=null;
        resolve();
      };
    });
  }

  async function playRound(round){
    if(!isGameRunValid(runId))return null;

    clearSeated();
    chair.classList.remove("occupied");

    roundEl.textContent=`${round+1} / 2`;
    message.textContent="♪ MUSIC ♪";
    message.className="chair-message playing";

    winnerCall.textContent="";
    winnerCall.classList.remove("show");

    musicRing.classList.remove("stopped");

    chair.classList.remove("ready","pressed","foul","winner");

    youTimeEl.textContent="--";

    cpuEls.forEach(el=>{
      el.classList.remove("winner","arrived","seated");
      el.querySelector("em").textContent="--";
    });

    const ok=await countdown(`ROUND ${round+1}`,runId);
    if(!ok||!isGameRunValid(runId))return null;
    startChairWalk();

    let stopped=false;
    let stopAt=0;
    let resolved=false;
    let falseStart=false;

    const cpuTimes=musicalChairCpuTimes(round);

    const musicInterval=setInterval(()=>{
      if(!isGameRunValid(runId)||stopped){
        clearInterval(musicInterval);
        return;
      }

      beep(430+randi(-40,55),34,.008);
    },330);

    const playerResultPromise=new Promise(resolve=>{
      const finish=value=>{
        if(resolved)return;

        resolved=true;
        chair.removeEventListener("pointerdown",onTap);
        resolve(value);
      };

      const onTap=e=>{
        e.preventDefault();

        if(!isGameRunValid(runId)){
          finish(null);
          return;
        }

        if(!stopped){
          falseStart=true;
          chair.classList.add("foul");
          message.textContent="FOUL!";
          message.className="chair-message foul";
          beep(140,160,.035);
          finish(999);
          return;
        }

        const ms=Math.max(.1,performance.now()-stopAt);

        chair.classList.add("pressed");
        youTimeEl.textContent=`${(ms/1000).toFixed(3)}s`;

        beep(860,70,.022);
        finish(ms);
      };

      chair.addEventListener("pointerdown",onTap,{passive:false});
    });

    const musicDuration=rand(2200,4200);
    const musicStart=performance.now();

    while(performance.now()-musicStart<musicDuration){
      if(!isGameRunValid(runId)){
        clearInterval(musicInterval);
        return null;
      }

      await wait(40);
    }

    if(!isGameRunValid(runId)){
      clearInterval(musicInterval);
      return null;
    }

    stopped=true;
    stopAt=performance.now();
    stopChairWalk();

    clearInterval(musicInterval);

    musicRing.classList.add("stopped");
    chair.classList.add("ready");

    message.textContent="STOP!";
    message.className="chair-message stopped";

    beep(930,65,.02);

    cpuTimes.forEach((ms,i)=>{
      setTimeout(()=>{
        if(!isGameRunValid(runId))return;

        cpuEls[i].classList.add("arrived");
        cpuEls[i].querySelector("em").textContent=`${(ms/1000).toFixed(3)}s`;
      },ms);
    });

    const playerMs=await Promise.race([
      playerResultPromise,
      new Promise(resolve=>setTimeout(()=>resolve(1200),1200))
    ]);

    if(!isGameRunValid(runId)||playerMs===null)return null;

    const effectivePlayer=playerMs;

    if(effectivePlayer>=1200){
      youTimeEl.textContent="1.200s";
      message.textContent="TOO LATE";
    }

    const ranking=[
      {name:"YOU",ms:effectivePlayer,you:true},
      ...cpuTimes.map((ms,i)=>({
        name:`CPU ${i+1}`,
        ms,
        you:false,
        index:i
      }))
    ].sort((a,b)=>a.ms-b.ms);

    const rank=ranking.findIndex(x=>x.you)+1;
    const winner=ranking[0];

    roundTimes.push(effectivePlayer);
    roundRanks.push(rank);

    const best=Math.min(...roundTimes);
    bestEl.textContent=`${(best/1000).toFixed(3)}s`;

    // First show who actually got the chair.
    seatWinner(winner);

    // Let the winner sitting animation be visible before showing player's result.
    await wait(900);

    if(!isGameRunValid(runId))return null;

    resultLabel.textContent=`ROUND ${round+1} YOUR RESULT`;
    resultTime.textContent=falseStart
      ? "FOUL"
      : `${(effectivePlayer/1000).toFixed(3)}s`;

    resultRank.textContent=`あなたは ${rank} / 5`;

    nextBtn.textContent=round===0
      ? "ROUND 2"
      : "FINAL RESULT";

    overlay.classList.add("show");

    await waitForRoundNext();

    return effectivePlayer;
  }

  const r1=await playRound(0);
  if(r1===null||!isGameRunValid(runId))return;

  const r2=await playRound(1);
  if(r2===null||!isGameRunValid(runId))return;

  const best=Math.min(r1,r2);
  state.records.rhythm[p.id]=best;

  finalR1.textContent=`${(r1/1000).toFixed(3)}秒`;
  finalR2.textContent=`${(r2/1000).toFixed(3)}秒`;

  finalRank1.textContent=`${roundRanks[0]} / 5`;
  finalRank2.textContent=`${roundRanks[1]} / 5`;

  finalBest.textContent=`${(best/1000).toFixed(3)}秒！`;

  finalOverlay.classList.add("show");
  beep(900,120,.032);

  await waitForFinalNext();

  if(!isGameRunValid(runId))return;

  recordScreen(
    14,p,humanIndex,
    `${(best/1000).toFixed(3)}<small>秒</small>`,
    `あなたの最高記録`
  );
}

// GAME 16 -------------------------------------------------
async function startCutGame(p,humanIndex,runId){
  gameFit();

  const scores=[];
  const errors=[];

  screen.innerHTML=`<div class="cut-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんカットゲーム</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="cut-hud">
      <div><span>ROUND</span><b id="cutRound">1 / 3</b></div>
      <div><span>SCORE</span><b id="cutScore">0</b></div>
    </div>

    <div class="cut-target" id="cutTarget">右を 50% 残せ！</div>

    <div id="cutArea" class="cut-area">
      <div id="cutBar" class="cut-bar">
        <div id="cutLeftPiece" class="cut-left-piece"></div>
        <div id="cutRemain" class="cut-remain"></div>
        <div id="cutKnife" class="cut-knife"></div>
        <div id="cutImpact" class="cut-impact">CUT!</div>
      </div>
      <div class="cut-swipe-guide">↑ SWIPE ↑</div>
    </div>

    <div id="cutResult" class="cut-result">縦スワイプでCUT</div>

    <div id="cutResultOverlay" class="cut-result-overlay">
      <div class="cut-result-card">
        <span id="cutResultRound">ROUND 1</span>
        <strong id="cutResultScore">100</strong>
        <div id="cutResultMain">指定 50% / 残り 50%</div>
        <b id="cutResultError">誤差 0%</b>
        <button id="cutNextBtn" class="primary" type="button">NEXT</button>
      </div>
    </div>
  </div>`;

  const area=document.getElementById("cutArea");
  const bar=document.getElementById("cutBar");
  const remain=document.getElementById("cutRemain");
  const leftPiece=document.getElementById("cutLeftPiece");
  const knife=document.getElementById("cutKnife");
  const impact=document.getElementById("cutImpact");
  const targetEl=document.getElementById("cutTarget");
  const resultEl=document.getElementById("cutResult");
  const roundEl=document.getElementById("cutRound");
  const scoreEl=document.getElementById("cutScore");

  const overlay=document.getElementById("cutResultOverlay");
  const overlayRound=document.getElementById("cutResultRound");
  const overlayScore=document.getElementById("cutResultScore");
  const overlayMain=document.getElementById("cutResultMain");
  const overlayError=document.getElementById("cutResultError");
  const nextBtn=document.getElementById("cutNextBtn");

  function waitForNext(){
    return new Promise(resolve=>{
      nextBtn.onclick=()=>{
        overlay.classList.remove("show");
        nextBtn.onclick=null;
        beep(520,30,.01);
        resolve();
      };
    });
  }

  for(let round=0;round<3;round++){
    const target=randi(18,82);
    let startPoint=null;
    let done=false;

    roundEl.textContent=`${round+1} / 3`;
    targetEl.textContent=`右を ${target}% 残せ！`;
    resultEl.textContent="縦スワイプでCUT";
    remain.style.left="0";
    remain.style.width="100%";
    remain.classList.remove("cut-right-kick");
    leftPiece.style.width="0";
    leftPiece.classList.remove("cut-left-fall");
    knife.style.display="none";
    knife.classList.remove("slash");
    impact.classList.remove("show");

    // カウントダウン無し。指定%が表示されたらすぐ切れる。
    await wait(180);

    const result=await new Promise(resolve=>{
      const down=e=>{
        if(done)return;
        e.preventDefault();
        startPoint={x:e.clientX,y:e.clientY,id:e.pointerId};
      };

      const up=e=>{
        if(done||!startPoint||e.pointerId!==startPoint.id)return;
        e.preventDefault();

        const dy=Math.abs(e.clientY-startPoint.y);
        if(dy<35){
          startPoint=null;
          return;
        }

        done=true;
        const rect=bar.getBoundingClientRect();
        const x=clamp(e.clientX-rect.left,0,rect.width);
        const cutPercent=x/rect.width*100;
        const rightRemain=100-cutPercent;
        resolve({cutPercent,rightRemain});
      };

      area.addEventListener("pointerdown",down,{passive:false,once:false});
      area.addEventListener("pointerup",up,{passive:false,once:false});
      area.addEventListener("pointercancel",()=>{startPoint=null},{passive:false,once:false});
    });

    const error=Math.abs(result.rightRemain-target);
    const roundScore=clamp(Math.round(100-error*10),0,100);

    errors.push(error);
    scores.push(roundScore);

    knife.style.display="block";
    knife.style.left=`${result.cutPercent}%`;
    knife.classList.add("slash");

    leftPiece.style.width=`${result.cutPercent}%`;
    remain.style.left=`${result.cutPercent}%`;
    remain.style.width=`${100-result.cutPercent}%`;

    // カット位置を見せてから左右が分離。
    impact.style.left=`${result.cutPercent}%`;
    impact.classList.add("show");
    bar.classList.remove("cut-shake");
    void bar.offsetWidth;
    bar.classList.add("cut-shake");
    leftPiece.classList.add("cut-left-fall");
    remain.classList.add("cut-right-kick");
    beep(760,45,.024);
    await wait(430);

    const avg=Math.round(scores.reduce((a,b)=>a+b,0)/scores.length);
    scoreEl.textContent=avg;
    resultEl.textContent=`残り ${result.rightRemain.toFixed(1)}%`;

    overlayRound.textContent=`ROUND ${round+1} RESULT`;
    overlayScore.textContent=`${roundScore} pt`;
    overlayMain.textContent=`指定 ${target}% / 実際 ${result.rightRemain.toFixed(1)}%`;
    overlayError.textContent=`誤差 ${error.toFixed(1)}%`;
    nextBtn.textContent=round<2?"NEXT":"FINAL";
    overlay.classList.add("show");

    beep(roundScore>=90?880:roundScore>=60?650:250,65,.018);

    // NEXTを押すまで絶対に次へ進まない。
    await waitForNext();
  }

  const score=Math.round(scores.reduce((a,b)=>a+b,0)/3);
  state.records.cut[p.id]=score;
  recordScreen(15,p,humanIndex,`${score}<small>pt</small>`,`平均誤差 ${(errors.reduce((a,b)=>a+b,0)/3).toFixed(1)}%`);
}

// GAME 17 -------------------------------------------------
async function startTreeClimb(p,humanIndex,runId){
  gameFit();

  let distance=0;
  let finished=false;
  let markerRAF=null;
  let timerRAF=null;
  let markerPos=.5;
  let endAt=0;
  let lastTap=0;

  screen.innerHTML=`<div class="climb-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん木登り</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="climb-hud">
      <div><span>TIME</span><b id="climbTime">10.00</b></div>
      <div><span>HEIGHT</span><b id="climbDistance">0m</b></div>
    </div>

    <div class="climb-view">
      <div id="climbWorld" class="climb-world">
        <div class="climb-tree"></div>
        <div id="climbMob" class="climb-mob"></div>
        ${Array.from({length:12},(_,i)=>`<span class="climb-mark" style="bottom:${i*90+30}px">${i*50}m</span>`).join("")}
      </div>
    </div>

    <button id="climbGauge" class="climb-gauge" type="button">
      <i class="climb-center"></i>
      <b id="climbMarker"></b>
    </button>
    <div id="climbFeedback" class="climb-feedback">CENTER = UP / EDGE = DOWN</div>
  </div>`;

  const timeEl=document.getElementById("climbTime");
  const distanceEl=document.getElementById("climbDistance");
  const world=document.getElementById("climbWorld");
  const mob=document.getElementById("climbMob");
  const gauge=document.getElementById("climbGauge");
  const marker=document.getElementById("climbMarker");
  const feedback=document.getElementById("climbFeedback");

  const gaugeStart=performance.now();

  const animateMarker=now=>{
    if(finished)return;
    const elapsed=now-gaugeStart;
    markerPos=(Math.sin(elapsed/620*Math.PI*2)+1)/2;
    marker.style.left=`${markerPos*100}%`;
    markerRAF=requestAnimationFrame(animateMarker);
  };

  gauge.addEventListener("pointerdown",e=>{
    if(finished)return;
    e.preventDefault();

    const now=performance.now();
    if(now-lastTap<170)return;
    lastTap=now;

    const centerError=Math.abs(markerPos-.5)/.5;
    const quality=clamp(1-centerError,0,1);
    let delta=0,label="";
    // V9.8: green / useful zone widened so CENTER is easier to hit.
    if(quality>=.84){delta=34;label="PERFECT +34m";}
    else if(quality>=.68){delta=24;label="GREAT +24m";}
    else if(quality>=.54){delta=13;label="GOOD +13m";}
    else if(quality>=.40){delta=4;label="SAFE +4m";}
    else{delta=-(5+(0.40-quality)*18);label=`SLIP ${Math.round(delta)}m`;}

    distance=Math.max(0,distance+delta);
    distanceEl.textContent=`${distance.toFixed(0)}m`;
    feedback.textContent=label;
    feedback.className=`climb-feedback ${delta<0?"down":quality>=.9?"perfect":"up"}`;

    const y=distance*2.0;
    mob.style.bottom=`${45+y}px`;
    world.style.transform=`translateY(${Math.max(0,y-190)}px)`;

    gauge.classList.remove("hit");
    void gauge.offsetWidth;
    gauge.classList.add("hit");

    beep(delta<0?180:400+quality*500,35,.015);
  },{passive:false});

  if(!(await countdown("CLIMB",runId)))return;
  if(!document.body.contains(gauge))return;

  endAt=performance.now()+10000;
  markerRAF=requestAnimationFrame(animateMarker);

  const timer=now=>{
    if(finished)return;

    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finished=true;
      if(markerRAF)cancelAnimationFrame(markerRAF);
      state.records.climb[p.id]=Math.round(distance*10);
      recordScreen(16,p,humanIndex,`${distance.toFixed(1)}<small>m</small>`,`TREE CLIMB`);
      return;
    }

    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 18 -------------------------------------------------
const ERRAND_ITEMS=[
  ["にんじん",78],["じゃがいも",66],["たまねぎ",54],["ねぎ",39],["キャベツ",118],["レタス",126],["トマト",98],["きゅうり",43],["ピーマン",57],["なす",69],
  ["ほうれん草",105],["大根",88],["もやし",24],["しいたけ",132],["えのき",79],["しめじ",108],["りんご",125],["みかん",73],["バナナ",64],["ぶどう",198],
  ["いちご",238],["レモン",47],["桃",186],["梨",154],["牛乳",188],["卵",218],["チーズ",246],["ヨーグルト",128],["バター",232],["豆腐",63],
  ["納豆",84],["食パン",148],["ロールパン",137],["うどん",58],["そば",89],["ラーメン",116],["パスタ",143],["米",250],["カレー粉",174],["ツナ缶",169],
  ["コーン缶",122],["サバ缶",209],["海苔",111],["梅干し",96],["味噌",189],["しょうゆ",155],["お酢",101],["砂糖",133],["塩",37],["こしょう",82],
  ["ポテトチップス",152],["チョコ",128],["クッキー",116],["キャンディ",53],["ガム",35],["グミ",92],["せんべい",109],["ドーナツ",147],["プリン",137],["ゼリー",94],
  ["アイス",168],["ラムネ",61],["ビスケット",76],["マシュマロ",114],["カステラ",189],["まんじゅう",133],["大福",145],["たい焼き",172],["団子",97],["どら焼き",158],
  ["ジュース",117],["お茶",92],["水",83],["炭酸水",106],["コーヒー",148],["紅茶",139],["ココア",176],["スポーツ飲料",161],["サイダー",127],["オレンジジュース",184],
  ["のり弁",248],["おにぎり",118],["サンドイッチ",229],["コロッケ",83],["唐揚げ",236],["ソーセージ",207],["ハム",193],["ちくわ",74],["かまぼこ",164],["餃子",218],
  ["ミント",3],["小ねぎ",12],["輪ゴム",7],["飴1個",9],["駄菓子",18],["小袋ソース",11],["小袋醤油",6],["ふりかけ",28],["梅1個",21],["小袋ナッツ",33]
];

async function startErrand(p,humanIndex,runId){
  gameFit();

  let remaining=1000;
  let finished=false;
  let timerRAF=null;
  let endAt=0;

  const items=shuffle(ERRAND_ITEMS).slice(0,30).map((x,i)=>({
    id:i,name:x[0],price:x[1],bought:false
  }));

  screen.innerHTML=`<div class="errand-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>お使いモブくん</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="errand-hud">
      <div><span>TIME</span><b id="errandTime">10.00</b></div>
      <div><span>WALLET</span><b id="errandMoney">¥1000</b></div>
    </div>

    <div id="errandGrid" class="errand-grid">
      ${items.map(it=>`<button class="errand-item" data-item="${it.id}" type="button">
        <span>${esc(it.name)}</span><b>¥${it.price}</b>
      </button>`).join("")}
    </div>

    <p id="errandHint" class="hint">残金を¥0にできればPERFECT。</p>
  </div>`;

  const grid=document.getElementById("errandGrid");
  const timeEl=document.getElementById("errandTime");
  const moneyEl=document.getElementById("errandMoney");
  const hint=document.getElementById("errandHint");

  grid.addEventListener("pointerdown",e=>{
    const btn=e.target.closest(".errand-item");
    if(!btn||finished||btn.disabled)return;
    e.preventDefault();

    const item=items[Number(btn.dataset.item)];
    if(!item||item.bought)return;

    if(item.price>remaining){
      btn.classList.add("too-expensive");
      hint.textContent="お金が足りない！";
      beep(180,45,.012);
      setTimeout(()=>btn.classList.remove("too-expensive"),170);
      return;
    }

    item.bought=true;
    remaining-=item.price;
    btn.disabled=true;
    btn.classList.add("bought");
    moneyEl.textContent=`¥${remaining}`;
    hint.textContent=remaining===0?"PERFECT ¥0!":`残り ¥${remaining}`;
    beep(650,30,.012);

    if(remaining===0){
      grid.querySelectorAll("button").forEach(b=>b.disabled=true);
    }
  },{passive:false});

  if(!(await countdown("SHOPPING",runId)))return;
  if(!document.body.contains(grid))return;

  endAt=performance.now()+10000;

  const finish=()=>{
    if(finished)return;
    finished=true;
    if(timerRAF)cancelAnimationFrame(timerRAF);

    const spent=1000-remaining;
    state.records.errand[p.id]=spent;
    recordScreen(17,p,humanIndex,`¥${spent}<small>使用</small>`,`残り ¥${remaining}`);
  };

  const timer=now=>{
    if(finished)return;

    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finish();
      return;
    }

    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}


// GAME 19 -------------------------------------------------
async function startDontHitMob(p,humanIndex,runId){
  gameFit();

  let hits=0;
  let finished=false;
  let timerRAF=null;
  let waveTimer=null;
  let endAt=0;
  const active=new Map();

  screen.innerHTML=`<div class="dont-hit-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんを叩かないで</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="dont-hit-hud">
      <div><span>TIME</span><b id="dontHitTime">10.00</b></div>
      <div><span>MOLE</span><b id="dontHitCount">0</b></div>
    </div>

    <div id="moleBoard" class="mole-board">
      ${Array.from({length:9},(_,i)=>`
        <button class="mole-hole" data-hole="${i}" type="button">
          <div class="mole-hole-dark"></div>
          <div class="mole-actor"></div>
        </button>`).join("")}
    </div>

    <p id="dontHitHint" class="hint">モグラだけ叩く。2〜6体が一気に出て、モブくんが混ざることもあります。</p>
  </div>`;

  const board=document.getElementById("moleBoard");
  const timeEl=document.getElementById("dontHitTime");
  const countEl=document.getElementById("dontHitCount");
  const hint=document.getElementById("dontHitHint");
  const holes=[...board.querySelectorAll(".mole-hole")];

  function clearHole(index){
    const entry=active.get(index);
    if(!entry)return;

    const el=entry.el;
    el.classList.remove("show","mole","mob","hit");
    el.style.backgroundImage="";
    active.delete(index);
  }

  function clearAll(){
    [...active.keys()].forEach(clearHole);
  }

  function scheduleWave(delay=null){
    if(finished)return;

    clearTimeout(waveTimer);

    const d=delay??Math.max(190,470-hits*8+randi(-55,70));
    waveTimer=setTimeout(spawnWave,d);
  }

  function spawnWave(){
    if(finished)return;

    clearAll();

    const roll=Math.random();

    // 多数同時出現をかなり増やす。
    // 1体15% / 2体22% / 3体24% / 4体18% / 5体13% / 6体8%
    const actorCount=
      roll<.15?1:
      roll<.37?2:
      roll<.61?3:
      roll<.79?4:
      roll<.92?5:6;

    const holeIndexes=shuffle([0,1,2,3,4,5,6,7,8]).slice(0,actorCount);

    // 2体以上の波ではかなりの確率で「モグラ + モブくん」が同時に出る。
    const forceMixed=actorCount>=2&&Math.random()<.48;
    const forcedMobSlots=new Set();

    if(forceMixed){
      forcedMobSlots.add(randi(0,actorCount-1));

      // 4体以上の大波では、たまにモブくんが2体混ざる。
      if(actorCount>=4&&Math.random()<.24){
        let second=randi(0,actorCount-1);
        while(forcedMobSlots.has(second))second=randi(0,actorCount-1);
        forcedMobSlots.add(second);
      }
    }

    holeIndexes.forEach((index,slotIndex)=>{
      const hole=holes[index];
      const el=hole.querySelector(".mole-actor");

      const isMob=forcedMobSlots.has(slotIndex)||Math.random()<.12;
      const type=isMob?"mob":"mole";

      el.classList.add("show",type);

      if(isMob){
        const icon=randi(1,10);
        el.style.backgroundImage=`url("icon/${String(icon).padStart(2,"0")}.png")`;
      }

      active.set(index,{type,el});
    });

    const visibleFor=Math.max(300,730-hits*10+randi(-55,85));

    waveTimer=setTimeout(()=>{
      clearAll();
      scheduleWave(55);
    },visibleFor);
  }

  function finish(reason="TIME"){
    if(finished)return;
    finished=true;

    if(timerRAF)cancelAnimationFrame(timerRAF);
    clearTimeout(waveTimer);
    holes.forEach(h=>h.disabled=true);

    state.records.dontHitMob[p.id]=hits;

    setTimeout(()=>recordScreen(
      18,p,humanIndex,
      `${hits}<small>体</small>`,
      reason==="MOB"?"MOBを叩いて終了":"10 SEC COMPLETE"
    ),280);
  }

  board.addEventListener("pointerdown",e=>{
    const hole=e.target.closest(".mole-hole");
    if(!hole||finished)return;
    e.preventDefault();

    const index=Number(hole.dataset.hole);
    const entry=active.get(index);

    if(!entry)return;

    if(entry.type==="mob"){
      entry.el.classList.add("hit");
      hint.textContent="MOB HIT! END!";
      beep(130,220,.04);
      finish("MOB");
      return;
    }

    hits++;
    countEl.textContent=hits;
    entry.el.classList.add("hit");
    hint.textContent=`MOLE ${hits}!`;
    beep(720,32,.014);

    setTimeout(()=>clearHole(index),85);

    // If all visible moles were cleared, bring the next wave a little sooner.
    const remainingMoles=[...active.values()].filter(v=>v.type==="mole").length;
    if(remainingMoles<=1){
      clearTimeout(waveTimer);
      waveTimer=setTimeout(()=>{
        clearAll();
        scheduleWave(35);
      },115);
    }
  },{passive:false});

  const ok=await countdown("DON'T HIT MOB",runId);
  if(!ok||!document.body.contains(board))return;

  endAt=performance.now()+10000;
  scheduleWave(260);

  const timer=now=>{
    if(finished)return;

    const left=Math.max(0,endAt-now);
    timeEl.textContent=(left/1000).toFixed(2);

    if(left<=0){
      finish("TIME");
      return;
    }

    timerRAF=requestAnimationFrame(timer);
  };
  timerRAF=requestAnimationFrame(timer);
}

// GAME 20 -------------------------------------------------
function mobStopScore(remainingRatio,fell){
  if(fell)return 0;

  const pct=remainingRatio*100;

  if(pct<=2)return 100;
  if(pct<=5)return Math.round(100-(pct-2)/3*10);
  if(pct<=10)return Math.round(90-(pct-5)/5*15);
  if(pct<=20)return Math.round(75-(pct-10)/10*25);
  if(pct<=45)return Math.round(50-(pct-20)/25*50);
  return 0;
}

async function startMobStop(p,humanIndex,runId){
  gameFit();

  let dragging=false;
  let pointerId=null;
  let startClientX=0;
  let pull=0;
  let launched=false;
  let animRAF=null;

  screen.innerHTML=`<div class="mob-stop-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんストップ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="mob-stop-hud">
      <div><span>PULL</span><b id="mobStopPullState">READY</b></div>
      <div><span>EDGE</span><b id="mobStopEdge">--</b></div>
    </div>

    <div id="mobStopStage" class="mob-stop-stage">
      <div class="mob-stop-launch-zone"></div>

      <div id="mobStopBar" class="mob-stop-bar">
        <i class="mob-stop-edge-line"></i>
        <span class="mob-stop-danger">EDGE</span>
      </div>

      <div id="mobStopMob" class="mob-stop-mob"></div>
      <div id="mobStopPullLine" class="mob-stop-pull-line"></div>
      <div id="mobStopMessage" class="mob-stop-message">← PULL</div>
    </div>

    <p class="hint">モブくんを左へ引っ張って離す。右端から落とさずギリギリを狙う。</p>
  </div>`;

  const stage=document.getElementById("mobStopStage");
  const bar=document.getElementById("mobStopBar");
  const mob=document.getElementById("mobStopMob");
  const pullLine=document.getElementById("mobStopPullLine");
  const pullStateEl=document.getElementById("mobStopPullState");
  const edgeEl=document.getElementById("mobStopEdge");
  const message=document.getElementById("mobStopMessage");

  if(!(await countdown("MOB STOP",runId)))return;
  if(!document.body.contains(stage))return;

  const stageRect=stage.getBoundingClientRect();
  const barRect=bar.getBoundingClientRect();
  const barStart=barRect.left-stageRect.left+14;
  const barEnd=barRect.right-stageRect.left-14;
  const trackLength=barEnd-barStart;
  const maxPull=Math.min(135,stage.clientWidth*.25);

  let mobX=barStart;

  function renderMob(){
    mob.style.left=`${mobX}px`;
  }

  function setPull(px){
    pull=clamp(px,0,maxPull);
    mobX=barStart-pull;

    pullStateEl.textContent=pull>8?"HOLD":"READY";
    pullLine.style.left=`${mobX}px`;
    pullLine.style.width=`${barStart-mobX}px`;

    renderMob();
  }

  mob.addEventListener("pointerdown",e=>{
    if(launched)return;
    e.preventDefault();

    dragging=true;
    pointerId=e.pointerId;
    startClientX=e.clientX+pull;
    mob.classList.add("dragging");

    try{mob.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  mob.addEventListener("pointermove",e=>{
    if(!dragging||e.pointerId!==pointerId||launched)return;
    e.preventDefault();

    const newPull=startClientX-e.clientX;
    setPull(newPull);
  },{passive:false});

  const release=e=>{
    if(!dragging||e.pointerId!==pointerId||launched)return;
    e.preventDefault();

    dragging=false;
    mob.classList.remove("dragging");

    if(pull<10){
      setPull(0);
      message.textContent="もっと左へ引っ張る";
      return;
    }

    launch();
  };

  mob.addEventListener("pointerup",release,{passive:false});
  mob.addEventListener("pointercancel",e=>{
    if(dragging){
      dragging=false;
      mob.classList.remove("dragging");
      setPull(0);
    }
  },{passive:false});

  function launch(){
    launched=true;
    message.textContent="GO!";
    pullStateEl.textContent="SHOT";
    beep(520,45,.018);

    const power=pull/maxPull;

    // Pull distance directly determines launch velocity.
    // Strong pulls can overshoot the right edge.
    let velocity=.30+power*1.48; // px/ms
    const friction=.00215;       // px/ms²
    let last=performance.now();

    // Start exactly at bar's left edge when released.
    mobX=barStart;
    pullLine.style.width="0";

    const frame=now=>{
      const dt=Math.min(28,now-last);
      last=now;

      mobX+=velocity*dt;
      velocity=Math.max(0,velocity-friction*dt);

      renderMob();

      const remaining=barEnd-mobX;
      edgeEl.textContent=remaining>=0?`${Math.max(0,remaining).toFixed(0)}px`:"FALL";

      if(mobX>barEnd+32){
        if(animRAF)cancelAnimationFrame(animRAF);
        fallResult();
        return;
      }

      if(velocity<=.015){
        stopResult();
        return;
      }

      animRAF=requestAnimationFrame(frame);
    };

    animRAF=requestAnimationFrame(frame);
  }

  async function fallResult(){
    message.textContent="FALL!";
    edgeEl.textContent="0 pt";
    mob.classList.add("fall");
    beep(135,200,.04);

    state.records.mobStop[p.id]=0;

    await wait(520);
    recordScreen(19,p,humanIndex,`0<small>pt</small>`,`FALL`);
  }

  async function stopResult(){
    if(animRAF)cancelAnimationFrame(animRAF);

    const remaining=Math.max(0,barEnd-mobX);
    const ratio=remaining/trackLength;
    const score=mobStopScore(ratio,false);

    edgeEl.textContent=`${remaining.toFixed(0)}px`;
    message.textContent=score===100?"PERFECT!":score>=90?"GREAT!":score>=70?"GOOD":"STOP";

    mob.classList.add("stopped");
    beep(score>=95?920:score>=75?720:430,80,.024);

    state.records.mobStop[p.id]=score;

    await wait(500);
    recordScreen(19,p,humanIndex,`${score}<small>pt</small>`,`EDGE ${remaining.toFixed(0)}px`);
  }

  setPull(0);
}



// GAME 21 -------------------------------------------------
function circleOverlapPercent(distance,radius){
  if(distance<=0)return 100;
  if(distance>=radius*2)return 0;
  const d=distance,r=radius;
  const area=2*r*r*Math.acos(d/(2*r))-.5*d*Math.sqrt(Math.max(0,4*r*r-d*d));
  return clamp(area/(Math.PI*r*r)*100,0,100);
}

async function startOverlapMoment(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let done=false;
  let startAt=0;
  let endAt=0;

  screen.innerHTML=`<div class="overlap-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>重なる瞬間を狙え！</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="overlap-hud overlap-hud-two">
      <div><span>MATCH</span><b id="overlapLive">---</b></div>
      <div><span>TIME</span><b id="overlapTime">10.00</b></div>
    </div>

    <button id="overlapStage" class="overlap-stage" type="button">
      <div id="overlapA" class="overlap-circle a"><img src="icon/01.png" draggable="false"></div>
      <div id="overlapB" class="overlap-circle b"><img src="icon/02.png" draggable="false"></div>
      <div class="overlap-center-line"></div>
      <div class="overlap-tap">TAP</div>
    </button>

    <p class="hint">毎回違う動き。10秒以内に完全一致を狙う。</p>
  </div>`;

  const stage=document.getElementById('overlapStage');
  const a=document.getElementById('overlapA');
  const b=document.getElementById('overlapB');
  const live=document.getElementById('overlapLive');
  const timeEl=document.getElementById('overlapTime');

  if(!(await countdown('MATCH',runId)))return;
  if(!isGameRunValid(runId)||!stage.isConnected)return;

  startAt=performance.now();
  endAt=startAt+10000;

  const radius=46;
  const targetAt=startAt+rand(2200,7800);
  const f1=rand(2.25,5.15);
  const f2=rand(2.55,5.75);
  const amp1=rand(.66,.96);
  const amp2=rand(.64,.98);
  const dir1=Math.random()<.5?-1:1;
  const dir2=Math.random()<.5?-1:1;

  function pos(now){
    const w=stage.clientWidth;
    const range=Math.max(60,w/2-radius-18);
    const dt=(now-targetAt)/1000;

    return [
      w/2+Math.sin(dt*f1)*range*amp1*dir1,
      w/2+Math.sin(dt*f2)*range*amp2*dir2
    ];
  }

  function finish(pct,label='MATCH RATE'){
    if(done)return;

    done=true;
    if(raf)cancelAnimationFrame(raf);

    state.records.overlap[p.id]=pct;
    live.textContent=`${pct.toFixed(1)}%`;
    stage.classList.add('locked');

    beep(pct>=99?980:pct>=95?760:430,90,.025);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          20,p,humanIndex,
          `${pct.toFixed(1)}<small>%</small>`,
          label
        );
      }
    },480);
  }

  function frame(now){
    if(done||!isGameRunValid(runId))return;

    const rem=endAt-now;

    if(rem<=0){
      timeEl.textContent='0.00';
      finish(0,'TIME UP');
      return;
    }

    timeEl.textContent=(rem/1000).toFixed(2);

    const [x1,x2]=pos(now);
    a.style.left=`${x1}px`;
    b.style.left=`${x2}px`;

    raf=requestAnimationFrame(frame);
  }

  stage.addEventListener('pointerdown',e=>{
    if(done||!isGameRunValid(runId))return;

    e.preventDefault();

    const [x1,x2]=pos(performance.now());
    a.style.left=`${x1}px`;
    b.style.left=`${x2}px`;

    const pct=Math.round(
      circleOverlapPercent(
        Math.abs(x1-x2),
        radius
      )*10
    )/10;

    finish(
      pct,
      pct===100
        ? 'PERFECT OVERLAP'
        : 'MATCH RATE'
    );
  },{passive:false});

  raf=requestAnimationFrame(frame);
}

// GAME 22 -------------------------------------------------// GAME 22 -------------------------------------------------
async function startShutterChance(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let shotDone=false;

  screen.innerHTML=`<div class="shutter-shell shutter-v111">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんシャッターチャンス</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="shutter-camera-body">
      <div class="shutter-camera-top">
        <span>AF-C</span>
        <b id="shutterCameraMode">PREVIEW</b>
        <span>ISO 400</span>
      </div>

      <div class="shutter-stage" id="shutterStage">
        <div class="shutter-ground"></div>
        <div class="shutter-grid g1"></div>
        <div class="shutter-grid g2"></div>
        <div class="shutter-grid g3"></div>
        <div class="shutter-grid g4"></div>

        <div id="shutterFocus" class="shutter-focus-box">
          <i></i><i></i><i></i><i></i>
        </div>

        <div id="shutterMob" class="shutter-mob" style="background-image:url('${p.img}')"></div>

        <div class="shutter-view-data left">1/500<br>F2.8</div>
        <div class="shutter-view-data right">RAW<br>50mm</div>

        <div id="shutterCurtain" class="shutter-curtain">
          <i class="top"></i><i class="bottom"></i>
        </div>

        <div id="shutterSnap" class="shutter-snap-v111">CLICK!</div>

        <div id="shutterPhoto" class="shutter-photo-v111">
          <div id="shutterPhotoMob" class="shutter-photo-mob" style="background-image:url('${p.img}')"></div>
          <span>CAPTURED</span>
        </div>
      </div>

      <div class="shutter-exposure">
        <i></i><i></i><b>0</b><i></i><i></i>
      </div>
    </div>

    <div class="shutter-status" id="shutterStatus">まずは見本</div>
    <button id="cameraBtn" class="camera-button camera-button-v111" type="button" disabled>
      <span class="camera-lens-icon"></span>
      SHUTTER
    </button>
  </div>`;

  const mob=document.getElementById('shutterMob');
  const status=document.getElementById('shutterStatus');
  const camera=document.getElementById('cameraBtn');
  const focus=document.getElementById('shutterFocus');
  const modeText=document.getElementById('shutterCameraMode');
  const curtain=document.getElementById('shutterCurtain');
  const snap=document.getElementById('shutterSnap');
  const photo=document.getElementById('shutterPhoto');
  const photoMob=document.getElementById('shutterPhotoMob');

  function animateJump(height,duration){
    return new Promise(resolve=>{
      const start=performance.now();
      const apex=start+duration/2;

      function frame(now){
        if(!isGameRunValid(runId)){
          resolve(null);
          return;
        }

        const t=clamp((now-start)/duration,0,1);
        const y=Math.sin(Math.PI*t)*height;

        mob.style.transform=
          `translate(-50%,${-y}px) rotate(${Math.sin(t*Math.PI)*4}deg)`;

        if(t<1){
          raf=requestAnimationFrame(frame);
        }else{
          mob.style.transform='translate(-50%,0)';
          resolve({apex});
        }
      }

      raf=requestAnimationFrame(frame);
    });
  }

  function cameraCapture(error,currentY){
    focus.classList.add('locked');
    modeText.textContent='AF LOCK';

    curtain.classList.remove('snap');
    void curtain.offsetWidth;
    curtain.classList.add('snap');

    snap.classList.remove('show');
    void snap.offsetWidth;
    snap.classList.add('show');

    photoMob.style.transform=
      `translate(-50%,${-currentY*.34}px)`;

    photo.classList.remove('show');
    void photo.offsetWidth;
    photo.classList.add('show');

    beep(
      error<=25?980:
      error<=70?760:
      420,
      60,.024
    );
  }

  const height=rand(115,195);
  const duration=rand(1080,1420);

  if(!(await countdown('SAMPLE',runId)))return;

  status.textContent='見本ジャンプ / ファインダーで高さを覚える';
  modeText.textContent='PREVIEW';

  await animateJump(height,duration);

  if(!isGameRunValid(runId))return;

  status.textContent='同じジャンプが本番！';
  await wait(360);

  if(!(await countdown('SHUTTER',runId)))return;

  const start=performance.now();
  const apex=start+duration/2;

  camera.disabled=false;
  modeText.textContent='LIVE';
  status.textContent='頂点でSHUTTER！';

  camera.addEventListener('pointerdown',e=>{
    if(shotDone||!isGameRunValid(runId))return;

    e.preventDefault();

    shotDone=true;
    camera.disabled=true;

    const now=performance.now();
    const error=Math.abs(now-apex);
    const t=clamp((now-start)/duration,0,1);
    const y=Math.sin(Math.PI*t)*height;

    cameraCapture(error,y);

    state.records.shutter[p.id]=error;

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          21,p,humanIndex,
          `${(error/1000).toFixed(3)}<small>秒</small>`,
          `CAMERA / 頂点との誤差`
        );
      }
    },760);
  },{passive:false});

  await new Promise(resolve=>{
    function frame(now){
      if(!isGameRunValid(runId)){
        resolve();
        return;
      }

      const t=clamp((now-start)/duration,0,1);
      const y=Math.sin(Math.PI*t)*height;

      mob.style.transform=`translate(-50%,${-y}px)`;
      focus.style.transform=`translate(-50%,${-y*.18}px)`;

      if(t<1&&!shotDone){
        raf=requestAnimationFrame(frame);
      }else{
        resolve();
      }
    }

    raf=requestAnimationFrame(frame);
  });

  if(!shotDone&&isGameRunValid(runId)){
    shotDone=true;
    camera.disabled=true;

    const error=duration/2;
    state.records.shutter[p.id]=error;
    modeText.textContent='NO SHOT';

    recordScreen(
      21,p,humanIndex,
      `${(error/1000).toFixed(3)}<small>秒</small>`,
      `NO SHOT`
    );
  }
}

// GAME 23 -------------------------------------------------
async function startCupLimit(p,humanIndex,runId){
  gameFit();
  let raf=null,done=false,start=0;
  screen.innerHTML=`<div class="cup-shell">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>コップ限界チャレンジ</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="cup-scene"><div class="cup-stream"></div><div id="cupGlass" class="cup-glass"><div id="cupWater" class="cup-water"></div><img src="icon/01.png" draggable="false"></div><div id="cupSpill" class="cup-spill"></div></div>
    <div id="cupMsg" class="cup-msg">STOPだけで勝負</div>
    <button id="cupStop" class="cup-stop" type="button">STOP</button>
  </div>`;
  const water=document.getElementById('cupWater'),spill=document.getElementById('cupSpill'),stop=document.getElementById('cupStop'),msg=document.getElementById('cupMsg');
  if(!(await countdown('WATER',runId)))return;
  start=performance.now();
  function level(now){return .18+(now-start)/4300*.90}
  function render(now){
    if(done||!isGameRunValid(runId))return;
    const lv=level(now);water.style.setProperty('--fill',`${Math.min(lv,1.075)*100}%`);water.classList.toggle('bulge',lv>1);
    if(lv>=1.062){done=true;stop.disabled=true;spill.classList.add('show');msg.textContent='OVERFLOW!';beep(140,200,.04);state.records.cup[p.id]=0;setTimeout(()=>{if(isGameRunValid(runId))recordScreen(22,p,humanIndex,`0<small>pt</small>`,`OVERFLOW`)},560);return;}
    raf=requestAnimationFrame(render);
  }
  stop.addEventListener('pointerdown',e=>{
    if(done||!isGameRunValid(runId))return;e.preventDefault();done=true;if(raf)cancelAnimationFrame(raf);stop.disabled=true;
    const lv=level(performance.now());
    const target=1.048;
    let score=lv<=target?clamp((lv-.72)/(target-.72)*100,0,100):clamp(100-(lv-target)/(.062-target)*100,0,100);
    score=Math.round(score*10)/10;state.records.cup[p.id]=score;water.style.setProperty('--fill',`${Math.min(lv,1.06)*100}%`);water.classList.toggle('bulge',lv>1);
    msg.textContent=score>=98?'SURFACE TENSION!':score>=85?'GREAT!':'STOP';beep(score>=98?980:score>=85?760:430,85,.025);
    setTimeout(()=>{if(isGameRunValid(runId))recordScreen(22,p,humanIndex,`${score.toFixed(1)}<small>pt</small>`,`WATER ${(lv*100).toFixed(1)}%`)},480);
  },{passive:false});
  raf=requestAnimationFrame(render);
}

// GAME 24 -------------------------------------------------
async function startDartsOneShot(p,humanIndex,runId){
  gameFit();
  let phase='vertical',v=.5,h=.5,raf=null,start=0,done=false;
  screen.innerHTML=`<div class="darts-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>ダーツ1投勝負</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="darts-main"><div id="dartTarget" class="dart-target"><i></i><i></i><i></i><b></b><div class="dart-target-cross v"></div><div class="dart-target-cross h"></div><div id="dartHit" class="dart-hit">✦</div></div>
      <div class="darts-gauges"><div class="dart-v"><span>VERTICAL</span><div class="dart-vtrack"><i class="dart-gauge-center"></i><b id="dartVMark"></b></div></div><div class="dart-h"><span>HORIZONTAL</span><div class="dart-htrack"><i class="dart-gauge-center"></i><b id="dartHMark"></b></div></div></div></div>
    <div id="dartPhase" class="dart-phase">VERTICAL / CENTER STOP</div><button id="dartStop" class="dart-stop" type="button">STOP</button></div>`;
  const target=document.getElementById('dartTarget'),vm=document.getElementById('dartVMark'),hm=document.getElementById('dartHMark'),phaseEl=document.getElementById('dartPhase'),stop=document.getElementById('dartStop'),hit=document.getElementById('dartHit');
  if(!(await countdown('DARTS',runId)))return;start=performance.now();
  function vals(now){const t=(now-start)/1000;return {vv:(Math.sin(t*5.4)+1)/2,hh:(Math.sin(t*6.25+1.2)+1)/2};}
  function frame(now){if(done||!isGameRunValid(runId))return;const x=vals(now);if(phase==='vertical')v=x.vv;else h=x.hh;vm.style.top=`${(phase==='vertical'?x.vv:v)*100}%`;hm.style.left=`${(phase==='horizontal'?x.hh:h)*100}%`;raf=requestAnimationFrame(frame)}
  stop.addEventListener('pointerdown',e=>{if(done||!isGameRunValid(runId))return;e.preventDefault();const x=vals(performance.now());if(phase==='vertical'){v=x.vv;phase='horizontal';phaseEl.textContent='HORIZONTAL / CENTER STOP';beep(590,45,.015);return;}h=x.hh;done=true;if(raf)cancelAnimationFrame(raf);stop.disabled=true;
    const nx=(h-.5)*2,ny=(v-.5)*2,dist=Math.sqrt(nx*nx+ny*ny)*100,record=Math.round(dist*10)/10;
    state.records.darts[p.id]=record;
    hit.style.left=`${clamp(50+nx*42,4,96)}%`;
    hit.style.top=`${clamp(50+ny*42,4,96)}%`;
    hit.classList.add('show');
    phaseEl.textContent=record<=5?'BULL!':record<=20?'GREAT!':'HIT';
    beep(record<=5?980:record<=20?760:430,90,.025);

    // Show the actual impact point first, then zoom the dartboard.
    setTimeout(()=>{
      if(!isGameRunValid(runId))return;
      target.classList.add('result-zoom');
      phaseEl.textContent=`刺さった場所を確認 / ${record.toFixed(1)}%`;
    },260);

    setTimeout(()=>{
      if(isGameRunValid(runId))recordScreen(23,p,humanIndex,`${record.toFixed(1)}<small>%</small>`,`CENTER DISTANCE`);
    },1450)},{passive:false});
  raf=requestAnimationFrame(frame);
}

// GAME 25 -------------------------------------------------
async function startParachute(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let done=false;
  let deployed=false;
  let start=0;
  let warningShown=false;
  let warningMoment=0;
  let deployedAt=0;
  let timingErrorMs=0;

  const worldH=2050;
  const groundY=1830;
  const warningAt=2200;
  const idealAfterWarning=3000;
  const crashLate=1450;
  const wind=Math.random()<.5?-1:1;
  let centerX=0;

  screen.innerHTML=`<div class="para-shell para-v101">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんとパラシュート</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="para-hud">
      <span>TARGET</span><b>! + 3.000 sec</b>
    </div>

    <button id="paraStage" class="para-stage" type="button">
      <div id="paraWorld" class="para-world" style="height:${worldH}px">
        <div class="para-cloud c1">☁</div>
        <div class="para-cloud c2">☁</div>
        <div class="para-cloud c3">☁</div>
        <div class="para-target">CENTER</div>
        <div class="para-ground"></div>

        <div id="paraMob" class="para-mob" style="background-image:url('${p.img}')">
          <div class="para-canopy"></div>
        </div>
      </div>

      <div id="paraDanger" class="para-danger para-danger-v101">
        <strong>!</strong>
        <span id="paraDangerTimer">3.000</span>
      </div>

      <div id="paraTiming" class="para-timing-v101">! が出たら3秒数える</div>
      <div class="para-tap">TAP = PARACHUTE</div>
    </button>
  </div>`;

  const stage=document.getElementById('paraStage');
  const world=document.getElementById('paraWorld');
  const mob=document.getElementById('paraMob');
  const danger=document.getElementById('paraDanger');
  const dangerTimer=document.getElementById('paraDangerTimer');
  const timing=document.getElementById('paraTiming');

  centerX=stage.clientWidth/2;
  mob.style.left=`${centerX}px`;

  if(!(await countdown('PARACHUTE',runId)))return;
  start=performance.now();

  function camera(y){
    const vh=stage.clientHeight;
    const cam=clamp(y-vh*.40,0,worldH-vh);
    world.style.transform=`translateY(${-cam}px)`;
  }

  function finishCrash(){
    if(done)return;
    done=true;
    state.records.parachute[p.id]=9999;
    mob.classList.add('crash');
    danger.classList.add('show','late');
    timing.textContent='GROUND CRASH';
    beep(130,220,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(24,p,humanIndex,`0<small>pt</small>`,`GROUND CRASH`);
      }
    },650);
  }

  stage.addEventListener('pointerdown',e=>{
    if(done||deployed||!isGameRunValid(runId))return;
    e.preventDefault();

    const elapsed=performance.now()-start;

    if(!warningShown){
      // Tapping before ! is a huge early miss, but still visually deploys.
      warningMoment=start+warningAt;
    }

    const targetMoment=(warningShown?warningMoment:(start+warningAt))+idealAfterWarning;
    const now=performance.now();

    if(now>targetMoment+crashLate){
      finishCrash();
      return;
    }

    timingErrorMs=Math.abs(now-targetMoment);
    deployedAt=elapsed;
    deployed=true;

    danger.classList.remove('show');
    mob.classList.add('open');

    timing.textContent=`3.000秒との誤差 ${(timingErrorMs/1000).toFixed(3)}秒`;
    beep(timingErrorMs<=40?990:timingErrorMs<=180?760:520,80,.025);
  },{passive:false});

  function frame(now){
    if(done||!isGameRunValid(runId))return;

    const elapsed=now-start;
    const targetMoment=start+warningAt+idealAfterWarning;

    if(!deployed){
      const fallTotal=warningAt+idealAfterWarning+crashLate;
      const pr=clamp(elapsed/fallTotal,0,1);
      const y=95+pr*(groundY-115);

      mob.style.left=`${centerX}px`;
      mob.style.top=`${y}px`;
      camera(y);

      if(elapsed>=warningAt&&!warningShown){
        warningShown=true;
        warningMoment=now;
        danger.classList.add('show');
        timing.textContent='ここから3.000秒！';
        beep(980,100,.035);
      }

      if(warningShown){
        const sinceWarning=now-warningMoment;
        const remaining=idealAfterWarning-sinceWarning;
        dangerTimer.textContent=remaining>=0
          ? (remaining/1000).toFixed(3)
          : `+${Math.abs(remaining/1000).toFixed(3)}`;

        if(Math.abs(remaining)<=70)danger.classList.add('perfect-window');
        else danger.classList.remove('perfect-window');

        if(sinceWarning>idealAfterWarning+crashLate){
          finishCrash();
          return;
        }
      }

      raf=requestAnimationFrame(frame);
      return;
    }

    // Perfect 3.000 sec => exact center.
    // Earlier/later deployment creates symmetric landing error.
    const signedError=(performance.now()-(warningMoment+idealAfterWarning));
    const absErr=Math.abs(signedError);

    const maxOffset=stage.clientWidth*.40;
    const offsetPx=clamp(absErr/1000*stage.clientWidth*.24,0,maxOffset);

    const dir=signedError<0?wind:-wind;
    const finalX=centerX+dir*offsetPx;

    const startY=95+clamp(deployedAt/(warningAt+idealAfterWarning+crashLate),0,1)*(groundY-115);
    const landDuration=1450;
    const lt=clamp((elapsed-deployedAt)/landDuration,0,1);
    const y=startY+(groundY-startY)*lt;
    const x=centerX+(finalX-centerX)*lt;

    mob.style.left=`${x}px`;
    mob.style.top=`${y}px`;
    camera(y);

    if(lt>=1){
      done=true;

      const errorMs=timingErrorMs;
      const centerMeters=errorMs/1000*22;
      state.records.parachute[p.id]=Math.round(errorMs*10)/10;

      mob.classList.add('landed');

      if(errorMs<=20){
        timing.textContent='PERFECT CENTER!';
        beep(1040,120,.035);
      }else{
        timing.textContent=`CENTER誤差 ${centerMeters.toFixed(1)}m`;
        beep(errorMs<=150?880:errorMs<=450?680:420,90,.025);
      }

      setTimeout(()=>{
        if(isGameRunValid(runId)){
          recordScreen(
            24,p,humanIndex,
            `${(errorMs/1000).toFixed(3)}<small>秒</small>`,
            errorMs<=20?'PERFECT CENTER':'3.000 SEC ERROR'
          );
        }
      },650);
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 26 -------------------------------------------------// GAME 26 -------------------------------------------------
async function startMobCount(p,humanIndex,runId){
  gameFit();
  const answer=randi(21,30);
  screen.innerHTML=`<div class="countmob-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんは何人？</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div id="countMobStage" class="countmob-stage"></div><div id="countMobChoices" class="countmob-choices hidden">${Array.from({length:10},(_,i)=>21+i).map(n=>`<button data-count="${n}" type="button">${n}</button>`).join('')}</div><div id="countMobMsg" class="countmob-msg">3秒表示</div></div>`;
  const stage=document.getElementById('countMobStage'),choices=document.getElementById('countMobChoices'),msg=document.getElementById('countMobMsg');
  if(!(await countdown('COUNT',runId)))return;if(!isGameRunValid(runId))return;
  const cells=shuffle(Array.from({length:30},(_,i)=>i)).slice(0,answer);
  stage.innerHTML=cells.map((cell,i)=>{const col=cell%6,row=Math.floor(cell/6),icon=1+(i%10);return `<img draggable="false" src="icon/${String(icon).padStart(2,'0')}.png" style="left:${7+col*17+rand(-2,2)}%;top:${9+row*19+rand(-2,2)}%;transform:translate(-50%,-50%) rotate(${rand(-12,12)}deg)">`}).join('');
  msg.textContent='3秒で数えよう！';await wait(3000);if(!isGameRunValid(runId))return;stage.innerHTML='<div class="countmob-gone">?</div>';choices.classList.remove('hidden');msg.textContent='何人いた？';
  choices.addEventListener('pointerdown',e=>{const btn=e.target.closest('[data-count]');if(!btn||!isGameRunValid(runId))return;e.preventDefault();const pick=Number(btn.dataset.count),err=Math.abs(pick-answer);state.records.mobCount[p.id]=err;choices.querySelectorAll('button').forEach(b=>b.disabled=true);msg.textContent=err===0?`正解！ ${answer}人`:`正解 ${answer}人 / あなた ${pick}人`;beep(err===0?960:err===1?720:360,90,.025);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(25,p,humanIndex,err===0?`PERFECT`:`±${err}<small>人</small>`,`ANSWER ${answer}`)},600)},{passive:false},{once:true});
}

// GAME 27 -------------------------------------------------
async function startEmergencyBrake(p,humanIndex,runId){
  gameFit();
  let raf=null,done=false,obstacleVisible=false,last=0,carX=120,speed=520,obstacleX=9999;
  const worldW=3600;
  screen.innerHTML=`<div class="brake-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>急ブレーキ</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="brake-hud"><span>SPEED</span><b id="brakeSpeed">FAST</b></div><div id="brakeStage" class="brake-stage"><div id="brakeWorld" class="brake-world" style="width:${worldW}px"><div class="brake-road"></div><div id="brakeCar" class="brake-car"><img src="icon/01.png" draggable="false"></div><div id="brakeObstacle" class="brake-obstacle">!</div></div><div id="brakeAlert" class="brake-alert">DRIVE</div></div><button id="brakeBtn" class="brake-button" type="button">BRAKE</button></div>`;
  const stage=document.getElementById('brakeStage'),world=document.getElementById('brakeWorld'),car=document.getElementById('brakeCar'),obs=document.getElementById('brakeObstacle'),alert=document.getElementById('brakeAlert'),btn=document.getElementById('brakeBtn'),speedEl=document.getElementById('brakeSpeed');
  if(!(await countdown('DRIVE',runId)))return;last=performance.now();const revealAt=last+rand(1050,1850);
  function camera(){const vw=stage.clientWidth,cam=clamp(carX-vw*.28,0,worldW-vw);world.style.transform=`translateX(${-cam}px)`}
  function finishCrash(){if(done)return;done=true;state.records.brake[p.id]=999;car.classList.add('crash');alert.textContent='CRASH!';beep(120,220,.04);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(26,p,humanIndex,`0<small>pt</small>`,`CRASH`)},560)}
  btn.addEventListener('pointerdown',e=>{if(done||!obstacleVisible||!isGameRunValid(runId))return;e.preventDefault();const front=carX+58;if(front>=obstacleX){finishCrash();return;}done=true;if(raf)cancelAnimationFrame(raf);speed=0;speedEl.textContent='0';car.classList.add('braking','instant-stop');const gap=Math.max(0,(obstacleX-front)/10),rec=Math.round(gap*10)/10;state.records.brake[p.id]=rec;alert.textContent=gap<=1?'PERFECT STOP!':'STOP!';beep(gap<=1?980:gap<=4?720:420,90,.025);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(26,p,humanIndex,`${rec.toFixed(1)}<small>m</small>`,`INSTANT STOP GAP`)},520)},{passive:false});
  function frame(now){if(done||!isGameRunValid(runId))return;const dt=Math.min(32,now-last)/1000;last=now;if(!obstacleVisible&&now>=revealAt){obstacleVisible=true;obstacleX=carX+rand(300,350);obs.style.left=`${obstacleX}px`;obs.classList.add('show');alert.textContent='障害物！';beep(890,80,.025)}carX+=speed*dt;car.style.left=`${carX}px`;camera();if(obstacleVisible&&carX+58>=obstacleX){finishCrash();return;}raf=requestAnimationFrame(frame)}
  raf=requestAnimationFrame(frame);
}

// GAME 28 -------------------------------------------------// GAME 28 -------------------------------------------------
async function startFeintReaction(p,humanIndex,runId){
  gameFit();
  let live=false,done=false,goAt=0;
  const fakes=['G0','G00','NOW','MOVE','GO?','G O','READY!','GOGO'];
  screen.innerHTML=`<div class="feint-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>フェイント反射神経</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><button id="feintStage" class="feint-stage" type="button"><img src="icon/01.png" draggable="false"><strong id="feintWord">READY</strong><span>本物のGO!だけタップ</span></button></div>`;
  const stage=document.getElementById('feintStage'),word=document.getElementById('feintWord');
  if(!(await countdown('READY',runId)))return;
  stage.addEventListener('pointerdown',e=>{if(done||!isGameRunValid(runId))return;e.preventDefault();if(!live){done=true;state.records.feint[p.id]=999;word.textContent='FOUL!';stage.classList.add('foul');beep(140,180,.04);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(27,p,humanIndex,`FOUL`,`フェイントを押した`)},550);return;}done=true;const ms=performance.now()-goAt;state.records.feint[p.id]=ms;word.textContent=`${(ms/1000).toFixed(4)}s`;stage.classList.add('hit');beep(ms<=180?980:ms<=260?720:420,85,.025);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(27,p,humanIndex,`${(ms/1000).toFixed(4)}<small>秒</small>`,`TRUE GO REACTION`)},520)},{passive:false});
  const showPrompt=text=>{word.textContent=text;word.classList.remove('pop');void word.offsetWidth;word.classList.add('pop');beep(390,35,.01)};
  const n=randi(2,5);for(let i=0;i<n;i++){if(!isGameRunValid(runId)||done)return;await wait(rand(480,900));if(done)return;showPrompt(fakes[randi(0,fakes.length-1)]);}
  if(!isGameRunValid(runId)||done)return;await wait(rand(550,1100));if(!isGameRunValid(runId)||done)return;live=true;goAt=performance.now();showPrompt('GO!');
}

// GAME 29 -------------------------------------------------// GAME 29 -------------------------------------------------
async function startBombChicken(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let done=false;
  let start=0;

  const LIMIT=5000;

  screen.innerHTML=`<div class="bomb-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>爆弾チキンレース</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="bomb-stage">
      <div id="bombMob" class="bomb-mob"><img src="icon/01.png" draggable="false"></div>
      <div id="bigBomb" class="big-bomb">💣</div>
      <div id="bombTime" class="bomb-time">5.000</div>
      <div id="bombScore" class="bomb-score">SCORE 0</div>
    </div>

    <button id="bombStop" class="bomb-stop" type="button">STOP</button>
  </div>`;

  const bomb=document.getElementById('bigBomb');
  const timeEl=document.getElementById('bombTime');
  const scoreEl=document.getElementById('bombScore');
  const stop=document.getElementById('bombStop');

  if(!(await countdown('CHICKEN',runId)))return;

  start=performance.now();

  function finishExplosion(){
    if(done)return;

    done=true;
    stop.disabled=true;
    state.records.bomb[p.id]=0;

    bomb.classList.add('explode');
    timeEl.textContent='0.000';
    scoreEl.textContent='BOOM! 0';

    beep(110,260,.045);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          28,p,humanIndex,
          `0<small>pt</small>`,
          `EXPLOSION`
        );
      }
    },650);
  }

  stop.addEventListener('pointerdown',e=>{
    if(done||!isGameRunValid(runId))return;

    e.preventDefault();

    const elapsed=performance.now()-start;
    const remaining=LIMIT-elapsed;

    if(remaining<=0){
      finishExplosion();
      return;
    }

    done=true;

    if(raf)cancelAnimationFrame(raf);
    stop.disabled=true;

    const score=clamp(
      Math.floor(elapsed/LIMIT*10000),
      0,9999
    );

    state.records.bomb[p.id]=score;

    timeEl.textContent=(remaining/1000).toFixed(3);
    scoreEl.textContent=`SCORE ${score}`;

    bomb.classList.add('stopped');

    beep(
      score>=9900?1000:
      score>=9500?780:
      430,
      90,.025
    );

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          28,p,humanIndex,
          `${score}<small>pt</small>`,
          `${(remaining/1000).toFixed(3)}秒残し`
        );
      }
    },560);
  },{passive:false});

  function frame(now){
    if(done||!isGameRunValid(runId))return;

    const rem=LIMIT-(now-start);

    if(rem<=0){
      finishExplosion();
      return;
    }

    timeEl.textContent=(rem/1000).toFixed(3);
    scoreEl.textContent=
      `SCORE ${Math.floor((LIMIT-rem)/LIMIT*10000)}`;

    bomb.classList.toggle('danger',rem<850);

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 30 -------------------------------------------------
async function startOverlapMaster(p,humanIndex,runId){
  gameFit();
  let raf=null,done=false,startAt=0,endAt=0,targetAt=0;
  screen.innerHTML=`<div class="overlap-shell master-overlap-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>重なりマスター</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="overlap-hud overlap-hud-two"><div><span>4 MATCH</span><b id="masterLive">---</b></div><div><span>TIME</span><b id="masterTime">10.00</b></div></div><button id="masterStage" class="overlap-stage master-stage" type="button">${[1,2,3,4].map((n,i)=>`<div id="masterC${i}" class="overlap-circle master c${i}"><img src="icon/0${n}.png" draggable="false"></div>`).join('')}<div class="overlap-center-line"></div><div class="overlap-tap">MASTER TAP</div></button><p class="hint">4つ全部が重なる瞬間を狙う。</p></div>`;
  const stage=document.getElementById('masterStage'),circles=[0,1,2,3].map(i=>document.getElementById(`masterC${i}`)),live=document.getElementById('masterLive'),timeEl=document.getElementById('masterTime');
  if(!(await countdown('MASTER',runId)))return;if(!isGameRunValid(runId))return;
  startAt=performance.now();endAt=startAt+10000;targetAt=startAt+rand(2300,4100);const radius=40,freq=[2.15,3.05,3.95,4.85],amps=[.96,.82,.70,.90];
  function positions(now){const w=stage.clientWidth,range=Math.max(70,w/2-radius-16),dt=(now-targetAt)/1000;return freq.map((f,i)=>w/2+Math.sin(dt*f)*range*amps[i]);}
  function finish(pct,label){if(done)return;done=true;if(raf)cancelAnimationFrame(raf);state.records.overlapMaster[p.id]=pct;live.textContent=`${pct.toFixed(1)}%`;stage.classList.add('locked');beep(pct>=99?1000:pct>=94?760:430,90,.025);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(29,p,humanIndex,`${pct.toFixed(1)}<small>%</small>`,label)},500)}
  function frame(now){if(done||!isGameRunValid(runId))return;const rem=endAt-now;if(rem<=0){timeEl.textContent='0.00';finish(0,'TIME UP');return;}timeEl.textContent=(rem/1000).toFixed(2);const xs=positions(now);circles.forEach((c,i)=>c.style.left=`${xs[i]}px`);raf=requestAnimationFrame(frame)}
  stage.addEventListener('pointerdown',e=>{if(done||!isGameRunValid(runId))return;e.preventDefault();const xs=positions(performance.now());circles.forEach((c,i)=>c.style.left=`${xs[i]}px`);const spread=Math.max(...xs)-Math.min(...xs),pct=Math.round(circleOverlapPercent(spread,radius)*10)/10;finish(pct,pct>=99.95?'MASTER PERFECT':'4 CIRCLE MATCH')},{passive:false});
  raf=requestAnimationFrame(frame);
}

// GAME 31 -------------------------------------------------
async function startJumpingMob(p,humanIndex,runId){
  gameFit();
  let raf=null,timerRAF=null,finished=false,leftHeld=false,rightHeld=false,grounded=true,last=0,endAt=0,maxY=58,playerX=0,playerY=58,vy=0,jumpCount=0;
  const worldH=4300,gravity=1280,baseJumpV=870;
  screen.innerHTML=`<div class="jumpup-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>ジャンピングモブくん</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="jumpup-hud"><div><span>TIME</span><b id="jumpupTime">10.00</b></div><div><span>HEIGHT</span><b id="jumpupHeight">0m</b></div></div><div id="jumpupView" class="jumpup-view"><div id="jumpupWorld" class="jumpup-world" style="height:${worldH}px"><div id="jumpupPlatforms"></div><div id="jumpupPlayer" class="jumpup-player" style="background-image:url('${p.img}')"><i></i></div></div></div><div class="jumpup-controls"><button id="jumpLeft" type="button">←</button><button id="jumpBtn" class="jump-main" type="button">JUMP</button><button id="jumpRight" type="button">→</button></div></div>`;
  const view=document.getElementById('jumpupView'),world=document.getElementById('jumpupWorld'),layer=document.getElementById('jumpupPlatforms'),player=document.getElementById('jumpupPlayer'),timeEl=document.getElementById('jumpupTime'),heightEl=document.getElementById('jumpupHeight'),left=document.getElementById('jumpLeft'),right=document.getElementById('jumpRight'),jump=document.getElementById('jumpBtn');
  const sw=view.clientWidth,platforms=[];let y=28,x=sw/2;
  for(let i=0;i<36;i++){
    // V9.9: much narrower platforms. Later platforms become tiny.
    const width=Math.max(18,78-i*1.72);
    if(i===0){x=sw/2;y=28}
    else{
      y+=rand(92,132);
      x=clamp(x+rand(-142,142),width/2+7,sw-width/2-7);
    }
    platforms.push({x,y,w:width,h:12});
  }
  layer.innerHTML=platforms.map((pl,i)=>`<div class="jumpup-platform" style="left:${pl.x-pl.w/2}px;bottom:${pl.y}px;width:${pl.w}px"><span>${i}</span></div>`).join('');
  playerX=platforms[0].x;playerY=platforms[0].y+platforms[0].h;
  function controlsHold(el,setter){el.addEventListener('pointerdown',e=>{e.preventDefault();setter(true)},{passive:false});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>setter(false),{passive:false}));}
  controlsHold(left,v=>leftHeld=v);controlsHold(right,v=>rightHeld=v);
  jump.addEventListener('pointerdown',e=>{
    if(finished||!grounded||!isGameRunValid(runId))return;
    e.preventDefault();
    jumpCount++;
    grounded=false;

    // Every jump boosts both vertical reach and horizontal travel speed.
    vy=Math.min(1240,baseJumpV+jumpCount*27);

    player.classList.add('spring');
    jump.textContent=`JUMP ×${jumpCount}`;
    beep(640+Math.min(260,jumpCount*12),35,.014);
    setTimeout(()=>player.classList.remove('spring'),150);
  },{passive:false});
  function camera(){const vh=view.clientHeight,cam=clamp(playerY-vh*.46,0,worldH-vh);world.style.transform=`translateY(${cam}px)`}
  function finish(label='TIME UP'){if(finished)return;finished=true;if(raf)cancelAnimationFrame(raf);if(timerRAF)cancelAnimationFrame(timerRAF);const meters=Math.round(maxY/2);state.records.jumpingMob[p.id]=meters;setTimeout(()=>{if(isGameRunValid(runId))recordScreen(30,p,humanIndex,`${meters}<small>m</small>`,label)},350)}
  if(!(await countdown('HOPPING',runId)))return;endAt=performance.now()+10000;last=performance.now();
  function frame(now){if(finished||!isGameRunValid(runId))return;const dt=Math.min(28,now-last)/1000;last=now;
    const prevY=playerY;
    const move=(rightHeld?1:0)-(leftHeld?1:0);
    const moveSpeed=Math.min(575,335+jumpCount*11);
    playerX=clamp(playerX+move*moveSpeed*dt,20,sw-20);if(!grounded){vy-=gravity*dt;playerY+=vy*dt;if(vy<=0){let landed=null;for(const pl of platforms){const top=pl.y+pl.h;if(prevY>=top&&playerY<=top&&Math.abs(playerX-pl.x)<pl.w/2+9){landed=pl;break;}}if(landed){playerY=landed.y+landed.h;vy=0;grounded=true;beep(760,25,.01);}}}maxY=Math.max(maxY,playerY);heightEl.textContent=`${Math.round(maxY/2)}m`;player.style.left=`${playerX}px`;player.style.bottom=`${playerY}px`;camera();if(playerY<-70){finish('FALL');return;}raf=requestAnimationFrame(frame)}
  function timer(now){if(finished||!isGameRunValid(runId))return;const rem=endAt-now;timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);if(rem<=0){finish('10 SEC');return;}timerRAF=requestAnimationFrame(timer)}
  raf=requestAnimationFrame(frame);timerRAF=requestAnimationFrame(timer);
}

// GAME 32 -------------------------------------------------
const HERO_BOOSTS=[
  ['勇者の剣',10],['勇者の盾',8],['勇者の兜',7],['勇者の鎧',9],['勇者の靴',7],
  ['勇者の指輪',11],['勇者のマント',8],['勇者の聖杯',11],['勇者の宝玉',10],['勇者の紋章',9],
  ['炎魔法',4],['氷魔法',4],['雷魔法',5],['風魔法',3],['光魔法',6],
  ['回復魔法',4],['集中する',3],['仲間を信じる',3],['剣の稽古',4],['体力づくり',3],
  ['宝箱を調べる',4],['古代文字を読む',5],['ドラゴン研究',5],['魔王研究',6],['聖なる祈り',5]
];

const HERO_TRAPS=[
  ['やきもち焼き',-10],['チルしたい人',-8],['ちょっと昼寝',-7],['旅先グルメ',-6],['寄り道の達人',-7],
  ['きれいなキノコ',-10],['怪しい近道',-11],['無料の宝箱',-12],['謎のドリンク',-9],['ふわふわベッド',-8],
  ['炎弱点',-9],['氷弱点',-9],['雷弱点',-8],['闇弱点',-10],['方向音痴',-8],
  ['空腹',-7],['偽物の聖剣',-13],['笑顔のミミック',-12],['おしゃれ優先',-7],['荷物が多い',-6],
  ['魔王と記念撮影',-12],['ドラゴンに挨拶',-10],['呪われたお守り',-13],['勇者じゃない疑惑',-8],['今日は休む',-11]
];

function heroResultText(score){
  if(score<=30)return 'スライムにも勝てなかった、、';
  if(score<=50)return 'なんとかスライムは倒せたようだ';
  if(score<=60)return 'ゴーレムと殴り合えたようだ';
  if(score<=70)return 'ドラゴンを手懐けたようだ';
  if(score<=80)return '魔王の側近を倒したようだ';
  if(score<=90)return 'まさか、、本当に勇者かも？';
  if(score<=99)return '魔王との死闘は伝説となりそうだ';
  return 'なんと魔王を撃破した‼︎';
}

async function startHeroMaybe(p,humanIndex,runId){
  gameFit();

  let score=5;
  let finished=false;
  let endAt=0;
  let timerRAF=null;
  let wheelRAF=null;
  let wheelStarted=performance.now();

  const boosts=HERO_BOOSTS.map(x=>({name:x[0],val:x[1],good:true}));
  const traps=HERO_TRAPS.map(x=>({name:x[0],val:x[1],good:false}));
  const usedHeroItems=new Set();
  let current=[];

  screen.innerHTML=`<div class="hero-maybe-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは勇者かも</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="hero-maybe-hud">
      <div><span>TIME</span><b id="heroTime">10.00</b></div>
      <div><span>POWER</span><b id="heroScore">5</b></div>
    </div>

    <div class="hero-maybe-scene">
      <div class="hero-maybe-mob" style="background-image:url('${p.img}')"></div>
      <div id="heroNarration" class="hero-narration">あなたは、、勇者様！？</div>
    </div>

    <div id="heroChoices" class="hero-choice-wheel">
      <div class="hero-wheel-ring"></div>
      <div class="hero-wheel-hub">?</div>
      ${[0,1,2,3].map(i=>`<button data-hero="${i}" class="hero-option-wheel" type="button"><span>???</span></button>`).join('')}
    </div>

    <div id="heroAdventure" class="hero-adventure hidden">
      <strong>モブくんは冒険に向かった！</strong>
      <button id="heroSeeResult" class="primary">結果を見る</button>
    </div>

    <div id="heroResultOverlay" class="hero-result-overlay">
      <div class="hero-result-card">
        <span>勇者ポイント</span>
        <strong id="heroFinalScore">0</strong>
        <p id="heroFinalText"></p>
        <button id="heroRecord" class="primary">NEXT</button>
      </div>
    </div>
  </div>`;

  const timeEl=document.getElementById('heroTime');
  const scoreEl=document.getElementById('heroScore');
  const choices=document.getElementById('heroChoices');
  const choiceBtns=[...choices.querySelectorAll('[data-hero]')];
  const narr=document.getElementById('heroNarration');
  const adventure=document.getElementById('heroAdventure');
  const see=document.getElementById('heroSeeResult');
  const overlay=document.getElementById('heroResultOverlay');
  const finalScore=document.getElementById('heroFinalScore');
  const finalText=document.getElementById('heroFinalText');
  const recordBtn=document.getElementById('heroRecord');

  function positionWheel(now){
    if(finished||!isGameRunValid(runId))return;

    const rect=choices.getBoundingClientRect();
    const radius=Math.max(62,Math.min(rect.width,rect.height)*.33);
    const angle=(now-wheelStarted)/9000*Math.PI*2;

    choiceBtns.forEach((btn,i)=>{
      const a=angle+i*Math.PI/2-Math.PI/2;
      const x=rect.width/2+Math.cos(a)*radius;
      const y=rect.height/2+Math.sin(a)*radius;

      // Only the position travels around the wheel; text stays upright.
      btn.style.left=`${x}px`;
      btn.style.top=`${y}px`;
    });

    wheelRAF=requestAnimationFrame(positionWheel);
  }

  function drawFour(){
    if(finished)return;

    const availableBoosts=boosts.filter(x=>!usedHeroItems.has(x.name));
    const availableTraps=traps.filter(x=>!usedHeroItems.has(x.name));

    // Much harder: usually exactly one safe/positive option.
    const roll=Math.random();
    const boostCount=roll<.66?1:roll<.94?2:3;
    const opts=[];

    shuffle(availableBoosts).slice(0,boostCount).forEach(x=>opts.push(x));
    shuffle(availableTraps).slice(0,4-opts.length).forEach(x=>opts.push(x));

    // If one pool is exhausted, fill from remaining unused items.
    const allUnused=shuffle([...availableBoosts,...availableTraps]);
    for(const item of allUnused){
      if(opts.length>=4)break;
      if(!opts.some(o=>o.name===item.name))opts.push(item);
    }

    current=shuffle(opts);

    choiceBtns.forEach((btn,i)=>{
      const item=current[i];
      btn.disabled=!item;
      btn.classList.remove('picked');
      btn.innerHTML=`<span>${item?item.name:'---'}</span>`;
    });
  }

  choices.addEventListener('pointerdown',e=>{
    const btn=e.target.closest('[data-hero]');
    if(!btn||finished||!isGameRunValid(runId))return;
    e.preventDefault();

    const it=current[Number(btn.dataset.hero)];
    if(!it)return;

    usedHeroItems.add(it.name);
    score=clamp(score+it.val,0,100);
    scoreEl.textContent=score;

    // Do not expose + / - values. Only the item name and current total are shown.
    narr.textContent=it.name;

    btn.classList.add('picked');
    choiceBtns.forEach(b=>b.disabled=true);

    beep(it.val>0?690:250,45,.014);

    setTimeout(()=>{
      if(isGameRunValid(runId)&&!finished)drawFour();
    },310);
  },{passive:false});

  await wait(1050);
  if(!isGameRunValid(runId))return;
  if(!(await countdown('HERO',runId)))return;

  narr.textContent='どれを選ぶ？';
  drawFour();

  wheelStarted=performance.now();
  wheelRAF=requestAnimationFrame(positionWheel);

  endAt=performance.now()+10000;

  function finish(){
    if(finished)return;
    finished=true;
    if(wheelRAF)cancelAnimationFrame(wheelRAF);
    choiceBtns.forEach(b=>b.disabled=true);
    state.records.heroMaybe[p.id]=score;
    narr.textContent='モブくんは冒険に向かった！';
    adventure.classList.remove('hidden');
  }

  see.addEventListener('click',()=>{
    finalScore.textContent=score;
    finalText.textContent=heroResultText(score);
    overlay.classList.add('show');
    beep(score===100?1000:score>=80?820:500,100,.025);
  });

  recordBtn.addEventListener('click',()=>{
    overlay.classList.remove('show');
    if(isGameRunValid(runId)){
      recordScreen(31,p,humanIndex,`${score}<small>pt</small>`,heroResultText(score));
    }
  });

  function timer(now){
    if(finished||!isGameRunValid(runId))return;
    const rem=endAt-now;
    timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);
    if(rem<=0){finish();return;}
    timerRAF=requestAnimationFrame(timer);
  }

  timerRAF=requestAnimationFrame(timer);
}

// GAME 33 -------------------------------------------------
async function startPopularGame(p,humanIndex,runId){
  gameFit();let raf=null,timerRAF=null,finished=false,leftHeld=false,rightHeld=false,grounded=true,last=0,endAt=0,kills=0,playerX=150,playerY=54,vy=0;const worldW=3400,groundY=54,gravity=980,jumpV=500,moles=[];
  screen.innerHTML=`<div class="popular-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>あの人気者のゲーム</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="popular-hud"><div><span>TIME</span><b id="popularTime">10.00</b></div><div><span>STOMP</span><b id="popularKills">0</b></div></div><div id="popularView" class="popular-view"><div id="popularWorld" class="popular-world" style="width:${worldW}px">
      <div class="popular-sky-decor">
        ${Array.from({length:10},(_,i)=>`<span class="popular-cloud" style="left:${140+i*330}px;top:${28+(i%3)*42}px">☁</span>`).join('')}
        ${Array.from({length:8},(_,i)=>`<span class="popular-hill" style="left:${180+i*430}px"></span>`).join('')}
        ${Array.from({length:12},(_,i)=>`<span class="popular-bush" style="left:${90+i*285}px"></span>`).join('')}
        ${Array.from({length:9},(_,i)=>`<span class="popular-block" style="left:${280+i*360}px;bottom:${150+(i%2)*74}px"></span>`).join('')}
      </div>
      <div class="popular-ground"><i></i></div>
      <div id="popularMoles"></div>
      <div id="popularPlayer" class="popular-player figure-mob-player" style="background-image:url('icon/01.png')"></div>
    </div></div><div class="popular-controls"><button id="popularLeft">←</button><button id="popularJump" class="jump">JUMP</button><button id="popularRight">→</button></div></div>`;
  const view=document.getElementById('popularView'),world=document.getElementById('popularWorld'),moleLayer=document.getElementById('popularMoles'),player=document.getElementById('popularPlayer'),timeEl=document.getElementById('popularTime'),killEl=document.getElementById('popularKills'),left=document.getElementById('popularLeft'),right=document.getElementById('popularRight'),jump=document.getElementById('popularJump');
  function hold(el,set){el.addEventListener('pointerdown',e=>{e.preventDefault();set(true)},{passive:false});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>set(false),{passive:false}));}hold(left,v=>leftHeld=v);hold(right,v=>rightHeld=v);
  jump.addEventListener('pointerdown',e=>{if(finished||!grounded||!isGameRunValid(runId))return;e.preventDefault();grounded=false;vy=jumpV;beep(620,30,.012)},{passive:false});
  function spawnMole(slot){const vw=view.clientWidth;let x=clamp(playerX+rand(-vw*.75,vw*.95),90,worldW-90);if(Math.abs(x-playerX)<110)x=clamp(x+(Math.random()<.5?-1:1)*180,90,worldW-90);moles[slot]={x,vx:rand(30,55)*(Math.random()<.5?-1:1),alive:true};}
  for(let i=0;i<4;i++)spawnMole(i);
  function renderMoles(){moleLayer.innerHTML=moles.map((m,i)=>m&&m.alive?`<div class="popular-mole" data-mole="${i}" style="left:${m.x}px"></div>`:'').join('')}
  function camera(){const vw=view.clientWidth,cam=clamp(playerX-vw*.34,0,worldW-vw);world.style.transform=`translateX(${-cam}px)`}
  function finish(){if(finished)return;finished=true;if(raf)cancelAnimationFrame(raf);if(timerRAF)cancelAnimationFrame(timerRAF);state.records.popularGame[p.id]=kills;setTimeout(()=>{if(isGameRunValid(runId))recordScreen(32,p,humanIndex,`${kills}<small>体</small>`,`MOLE STOMP`)},300)}
  if(!(await countdown('STOMP',runId)))return;endAt=performance.now()+10000;last=performance.now();
  function frame(now){if(finished||!isGameRunValid(runId))return;const dt=Math.min(30,now-last)/1000;last=now;const move=(rightHeld?1:0)-(leftHeld?1:0);playerX=clamp(playerX+move*235*dt,30,worldW-30);if(!grounded){vy-=gravity*dt;playerY+=vy*dt;if(playerY<=groundY){playerY=groundY;vy=0;grounded=true;}}for(let i=0;i<moles.length;i++){const m=moles[i];if(!m||!m.alive)continue;m.x+=m.vx*dt;if(m.x<55||m.x>worldW-55)m.vx*=-1;const dx=Math.abs(playerX-m.x),moleTop=groundY+38;if(dx<40&&vy<0&&playerY<=moleTop+18&&playerY>=moleTop-15){m.alive=false;kills++;killEl.textContent=kills;playerY=moleTop+4;vy=285;grounded=false;beep(850,35,.016);setTimeout(()=>{if(!finished&&isGameRunValid(runId)){spawnMole(i);renderMoles()}},90);}}player.style.left=`${playerX}px`;player.style.bottom=`${playerY}px`;renderMoles();camera();raf=requestAnimationFrame(frame)}
  function timer(now){if(finished||!isGameRunValid(runId))return;const rem=endAt-now;timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);if(rem<=0){finish();return;}timerRAF=requestAnimationFrame(timer)}raf=requestAnimationFrame(frame);timerRAF=requestAnimationFrame(timer);
}


// GAME 34 -------------------------------------------------
async function startPlanetEnergy(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let finished=false;
  let phaseStart=0;
  let pulseScale=.18;
  let chargeRound=0;
  let finalCharge=0;
  const charges=[];

  screen.innerHTML=`<div class="planet-shell planet-v100">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>この星を..！</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="planet-hud">
      <div><span>CHARGE</span><b id="planetRound">1 / 3</b></div>
      <div><span>ENERGY</span><b id="planetEnergyValue">0%</b></div>
      <div><span>DISTANCE</span><b id="planetDistance">-- km</b></div>
    </div>

    <div id="planetStage" class="planet-stage-v100">
      <div class="planet-space-bg">
        <i class="planet-star s1"></i><i class="planet-star s2"></i><i class="planet-star s3"></i>
        <i class="planet-star s4"></i><i class="planet-star s5"></i><i class="planet-star s6"></i>
        <div class="planet-moon"></div>
      </div>

      <div id="planetCamera" class="planet-camera-v100">
        <div id="planetWorld" class="planet-world-v100">
          <div class="planet-city-ground-v100"></div>
          <div id="planetBuildings" class="planet-buildings-v100"></div>

          <div id="planetMob" class="planet-mob-v100" style="background-image:url('icon/01.png')"></div>

          <div id="planetOrb" class="planet-orb-v100">
            <div class="planet-orb-core"></div>
            <div class="planet-orb-ring r1"></div>
            <div class="planet-orb-ring r2"></div>
            <div class="planet-orb-ring r3"></div>
            <i class="planet-orb-spark sp1"></i>
            <i class="planet-orb-spark sp2"></i>
            <i class="planet-orb-spark sp3"></i>
            <i class="planet-orb-spark sp4"></i>
          </div>
        </div>
      </div>

      <div id="planetGauge" class="planet-gauge-v100">
        <div id="planetPulse" class="planet-pulse-v100"></div>
        <div class="planet-gauge-ring-v100"></div>
        <span>MAX</span>
      </div>

      <div id="planetChargeText" class="planet-charge-text-v100">MAXの瞬間をタップ</div>
      <div id="planetCinematicText" class="planet-cinematic-text"></div>
    </div>

    <button id="planetChargeTap" class="planet-charge-button" type="button">CHARGE TAP</button>
    <button id="planetFire" class="planet-fire-button hidden" type="button">放つ！</button>
  </div>`;

  const stage=document.getElementById('planetStage');
  const camera=document.getElementById('planetCamera');
  const world=document.getElementById('planetWorld');
  const buildingLayer=document.getElementById('planetBuildings');
  const mob=document.getElementById('planetMob');
  const orb=document.getElementById('planetOrb');
  const gauge=document.getElementById('planetGauge');
  const pulse=document.getElementById('planetPulse');
  const roundEl=document.getElementById('planetRound');
  const energyEl=document.getElementById('planetEnergyValue');
  const distanceEl=document.getElementById('planetDistance');
  const chargeText=document.getElementById('planetChargeText');
  const cinematicText=document.getElementById('planetCinematicText');
  const chargeBtn=document.getElementById('planetChargeTap');
  const fireBtn=document.getElementById('planetFire');

  const worldW=7200;
  world.style.width=`${worldW}px`;

  // City is present from the beginning. No screen transition.
  const buildings=[];
  let bx=720;
  for(let i=0;i<29;i++){
    const w=randi(72,138);
    const h=randi(155,380);
    buildings.push({x:bx,w,h,destroyed:false});
    bx+=randi(190,265);
  }

  buildingLayer.innerHTML=buildings.map((b,i)=>`
    <div class="planet-building-v100 b${i%5}" style="left:${b.x}px;width:${b.w}px;height:${b.h}px">
      <div class="planet-windows-v100"></div>
      <div class="planet-roof-v100"></div>
    </div>`).join('');

  const buildingEls=[...buildingLayer.children];

  function showCinematic(text,ms=650){
    cinematicText.textContent=text;
    cinematicText.classList.remove('show');
    void cinematicText.offsetWidth;
    cinematicText.classList.add('show');
    setTimeout(()=>cinematicText.classList.remove('show'),ms);
  }

  function pulseFrame(now){
    if(finished||chargeRound>=3||!isGameRunValid(runId))return;

    const elapsed=now-phaseStart;
    // Faster pulse than V9.9: 0.94 sec per cycle.
    const phase=(elapsed%940)/940;
    pulseScale=.14+.86*(.5-.5*Math.cos(phase*Math.PI*2));
    pulse.style.transform=`translate(-50%,-50%) scale(${pulseScale})`;

    raf=requestAnimationFrame(pulseFrame);
  }

  function startChargeRound(){
    if(!isGameRunValid(runId))return;

    chargeBtn.disabled=false;
    roundEl.textContent=`${chargeRound+1} / 3`;
    chargeText.textContent=`CHARGE ${chargeRound+1} / 3 — MAXを狙え`;

    phaseStart=performance.now();
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(pulseFrame);
  }

  function applyFinalOrbSize(){
    const rect=stage.getBoundingClientRect();

    // MAX really fills almost the entire stage.
    const maxDiameter=Math.min(rect.width*.97,rect.height*.91);
    const minDiameter=82;
    const normalized=Math.pow(finalCharge/100,1.38);
    const diameter=minDiameter+(maxDiameter-minDiameter)*normalized;

    orb.style.width=`${diameter}px`;
    orb.style.height=`${diameter}px`;

    // The orb stays above MOB, never overlapping him.
    const mobTop=mob.offsetTop;
    const desiredCenterY=Math.max(diameter/2+12,mobTop-diameter/2-18);
    orb.style.top=`${desiredCenterY}px`;
    orb.style.left=`${mob.offsetLeft+mob.offsetWidth/2}px`;

    orb.classList.add('charged');

    if(finalCharge>=88)stage.classList.add('huge-energy');
    if(finalCharge>=97)stage.classList.add('max-energy');

    // On huge charge the city / MOB camera pulls out, while orb remains dominant.
    const pull=clamp((finalCharge-82)/18,0,1);
    const sceneScale=1-pull*.27;
    camera.style.setProperty('--planet-camera-scale',sceneScale.toFixed(3));

    showCinematic(
      finalCharge>=97?'この星を..！':finalCharge>=90?'超巨大エネルギー':'ENERGY READY',
      900
    );
  }

  chargeBtn.addEventListener('pointerdown',e=>{
    if(finished||chargeRound>=3||chargeBtn.disabled||!isGameRunValid(runId))return;
    e.preventDefault();

    chargeBtn.disabled=true;
    if(raf)cancelAnimationFrame(raf);

    const pct=clamp(pulseScale*100,0,100);
    charges.push(pct);

    chargeText.textContent=`${pct.toFixed(1)}%`;
    beep(pct>=98?1060:pct>=92?850:540,80,.025);

    chargeRound++;

    const currentAvg=charges.reduce((a,b)=>a+b,0)/charges.length;
    energyEl.textContent=`${currentAvg.toFixed(1)}%`;

    if(chargeRound<3){
      setTimeout(()=>{
        if(isGameRunValid(runId))startChargeRound();
      },520);
      return;
    }

    finalCharge=charges.reduce((a,b)=>a+b,0)/3;
    energyEl.textContent=`${finalCharge.toFixed(1)}%`;

    gauge.classList.add('finished');
    pulse.style.opacity='0';
    chargeBtn.classList.add('hidden');

    applyFinalOrbSize();

    fireBtn.classList.remove('hidden');
    chargeText.textContent='エネルギーをそのまま放て！';

    beep(finalCharge>=97?1100:780,150,.035);
  },{passive:false});

  async function launchEnergy(){
    if(finished||!isGameRunValid(runId))return;

    fireBtn.disabled=true;
    fireBtn.classList.add('hidden');
    gauge.classList.add('launching');
    chargeText.textContent='';

    showCinematic('放て！！',650);
    beep(980,120,.04);

    // Same charged orb rises a little, then flies right. It is never replaced.
    orb.classList.add('launch-ready');
    await wait(420);

    if(!isGameRunValid(runId))return;

    stage.classList.add('flight-mode');
    orb.classList.add('flying');

    const vw=stage.clientWidth;
    const vh=stage.clientHeight;
    const orbDiameter=orb.getBoundingClientRect().width;

    const distanceKm=Math.round(Math.pow(finalCharge/100,2.0)*1000)/10;
    const travelPx=distanceKm/100*(worldW-850);

    let startX=parseFloat(orb.style.left)||mob.offsetLeft+mob.offsetWidth/2;
    let energyX=startX;
    const startTop=parseFloat(orb.style.top)||110;

    // High energy receives even more camera pull-out, making MOB truly tiny.
    const chargePull=clamp((finalCharge-72)/28,0,1);
    const flightScale=1-chargePull*.38;
    camera.style.setProperty('--planet-camera-scale',flightScale.toFixed(3));

    if(finalCharge>=96){
      mob.classList.add('bean-size');
    }

    const start=performance.now();
    const duration=1150+distanceKm/100*3600;

    await new Promise(resolve=>{
      const fly=now=>{
        if(!isGameRunValid(runId)){resolve();return;}

        const t=clamp((now-start)/duration,0,1);
        const eased=1-Math.pow(1-t,2.05);

        energyX=startX+travelPx*eased;

        orb.style.left=`${energyX}px`;
        // Slight cinematic wave, but remains high above the city.
        orb.style.top=`${startTop+Math.sin(t*Math.PI*3)*10}px`;

        const km=distanceKm*eased;
        distanceEl.textContent=`${km.toFixed(1)} km`;

        const radius=orbDiameter*.45;

        buildings.forEach((b,i)=>{
          if(b.destroyed)return;

          const center=b.x+b.w/2;
          if(Math.abs(center-energyX)<radius+b.w*.42){
            b.destroyed=true;
            buildingEls[i].classList.add('destroyed');
            buildingEls[i].style.setProperty('--break-dir',Math.random()<.5?-1:1);
            beep(135+randi(0,95),30,.008);

            const debris=document.createElement('i');
            debris.className='planet-debris-burst';
            debris.style.left=`${center}px`;
            debris.style.bottom=`${46+b.h*.38}px`;
            world.appendChild(debris);
            setTimeout(()=>debris.remove(),650);
          }
        });

        // Camera follows the exact same orb.
        const scaledVw=vw/flightScale;
        const camX=clamp(energyX-scaledVw*.39,0,worldW-scaledVw);
        camera.style.setProperty('--planet-cam-x',`${-camX}px`);

        if(t<1){
          requestAnimationFrame(fly);
        }else{
          resolve();
        }
      };
      requestAnimationFrame(fly);
    });

    if(!isGameRunValid(runId))return;

    finished=true;
    state.records.planetEnergy[p.id]=distanceKm;
    distanceEl.textContent=`${distanceKm.toFixed(1)} km`;

    stage.classList.add('impact-finish');
    showCinematic(
      distanceKm>=99.9?'100.0 km!!':`${distanceKm.toFixed(1)} km!!`,
      1000
    );

    beep(distanceKm>=99?1080:distanceKm>=80?900:650,160,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          33,p,humanIndex,
          `${distanceKm.toFixed(1)}<small>km</small>`,
          `ENERGY ${finalCharge.toFixed(1)}%`
        );
      }
    },1150);
  }

  fireBtn.addEventListener('pointerdown',e=>{
    e.preventDefault();
    launchEnergy();
  },{passive:false});

  if(!(await countdown('ENERGY',runId)))return;
  startChargeRound();
}

// GAME 35 -------------------------------------------------
function painterTraceScore(points,targetPath){
  if(points.length<16)return 0;

  const samples=[];
  const total=targetPath.getTotalLength();
  const sampleCount=150;

  for(let i=0;i<sampleCount;i++){
    const pt=targetPath.getPointAtLength(total*i/(sampleCount-1));
    samples.push({x:pt.x,y:pt.y});
  }

  let distSum=0;

  for(const p of points){
    let best=9999;
    for(const t of samples){
      const d=Math.hypot(p.x-t.x,p.y-t.y);
      if(d<best)best=d;
    }
    distSum+=best;
  }

  const avgDist=distSum/points.length;
  const accuracy=clamp(100-avgDist*5.0,0,100);

  let covered=0;
  for(const t of samples){
    let best=9999;
    for(const p of points){
      const d=Math.hypot(p.x-t.x,p.y-t.y);
      if(d<best)best=d;
    }
    if(best<=13.5)covered++;
  }
  const coverage=covered/sampleCount*100;

  let strokeLen=0;
  for(let i=1;i<points.length;i++){
    strokeLen+=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);
  }
  const lengthScore=clamp(100-Math.abs(strokeLen-total)/total*100,0,100);

  const closeDist=Math.hypot(
    points[0].x-points[points.length-1].x,
    points[0].y-points[points.length-1].y
  );
  const closure=clamp(100-closeDist/75*100,0,100);

  return clamp(
    accuracy*.50+
    coverage*.32+
    lengthScore*.10+
    closure*.08,
    0,100
  );
}

async function startPainterMob(p,humanIndex,runId){
  gameFit();

  let drawing=false;
  let used=false;
  let pointerId=null;
  let points=[];

  screen.innerHTML=`<div class="painter-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは画家志望</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="painter-hud">
      <div><span>CHANCE</span><b>1回</b></div>
      <div><span>MATCH</span><b id="painterScore">--</b></div>
    </div>

    <div id="painterStage" class="painter-stage">
      <div class="painter-paper">
        <svg id="painterSvg" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
          <path id="catGuide" class="cat-guide"
            d="M70 205
               C48 187 42 153 54 120
               L43 62
               L96 87
               C124 69 176 69 204 87
               L257 62
               L246 120
               C258 153 252 187 230 205
               C209 228 181 239 150 239
               C119 239 91 228 70 205 Z"></path>
          <polyline id="painterStroke" class="painter-stroke" points=""></polyline>
        </svg>

        <div class="cat-face-detail">
          <i class="cat-eye e1"></i>
          <i class="cat-eye e2"></i>
          <i class="cat-nose"></i>
          <i class="cat-whisker w1"></i><i class="cat-whisker w2"></i>
          <i class="cat-whisker w3"></i><i class="cat-whisker w4"></i>
        </div>
      </div>

      <div class="painter-mob" style="background-image:url('icon/01.png')">
        <span class="painter-brush"></span>
      </div>

      <div id="painterMessage" class="painter-message">猫の輪郭を1周なぞる</div>
    </div>
  </div>`;

  const stage=document.getElementById('painterStage');
  const svg=document.getElementById('painterSvg');
  const guide=document.getElementById('catGuide');
  const stroke=document.getElementById('painterStroke');
  const scoreEl=document.getElementById('painterScore');
  const message=document.getElementById('painterMessage');

  function localPoint(e){
    const rect=svg.getBoundingClientRect();
    return {
      x:(e.clientX-rect.left)/rect.width*300,
      y:(e.clientY-rect.top)/rect.height*300
    };
  }

  function renderStroke(){
    stroke.setAttribute(
      'points',
      points.map(pt=>`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
    );
  }

  stage.addEventListener('pointerdown',e=>{
    if(used||drawing||!isGameRunValid(runId))return;
    e.preventDefault();

    used=true;
    drawing=true;
    pointerId=e.pointerId;
    points=[localPoint(e)];
    message.textContent='そのまま1周！';

    try{stage.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();

    const pt=localPoint(e);
    const prev=points[points.length-1];

    if(!prev||Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.0){
      points.push(pt);
      renderStroke();
    }
  },{passive:false});

  async function finishDraw(e){
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();

    drawing=false;

    const score=painterTraceScore(points,guide);
    const rounded=Math.round(score*10)/10;

    scoreEl.textContent=`${rounded.toFixed(1)}%`;
    state.records.painter[p.id]=rounded;

    guide.classList.add('judged');
    stroke.classList.add(score>=90?'excellent':score>=75?'good':'rough');

    message.textContent=score>=95
      ? '天才画家！？'
      : score>=85
        ? 'かなり猫！'
        : score>=70
          ? '猫に見える！'
          : '個性的な猫！';

    beep(score>=95?1040:score>=85?850:score>=70?650:380,100,.03);

    await wait(800);

    if(isGameRunValid(runId)){
      recordScreen(
        34,p,humanIndex,
        `${rounded.toFixed(1)}<small>%</small>`,
        `CAT TRACE`
      );
    }
  }

  stage.addEventListener('pointerup',finishDraw,{passive:false});
  stage.addEventListener('pointercancel',finishDraw,{passive:false});

  if(!(await countdown('PAINT',runId)))return;
  message.textContent='1回勝負！ 猫の輪郭をなぞる';
}

// GAME 36 -------------------------------------------------
async function startBikeJump(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let done=false;
  let started=false;
  let rampAnnounced=false;

  const worldW=11600;
  const speed=610;
  const rampCenter=2400;
  const rampWidth=420;
  const rampLeft=rampCenter-rampWidth/2;
  const rampRight=rampCenter+rampWidth/2;
  const roadY=78;

  let bikeX=80;

  screen.innerHTML=`<div class="bike-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>バイクでジャンピング</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="bike-hud">
      <div><span>TIMING</span><b id="bikeTiming">READY</b></div>
      <div><span>DISTANCE</span><b id="bikeDistance">0m</b></div>
    </div>

    <button id="bikeStage" class="bike-stage" type="button">
      <div id="bikeWorld" class="bike-world" style="width:${worldW}px">
        <div class="bike-sky">
          ${Array.from({length:22},(_,i)=>`<i class="bike-cloud" style="left:${180+i*480}px;top:${25+(i%3)*44}px">☁</i>`).join('')}
          ${Array.from({length:24},(_,i)=>`<i class="bike-hill" style="left:${120+i*460}px"></i>`).join('')}
        </div>

        <div class="bike-road"></div>

        <div id="bikeRamp" class="bike-ramp bike-ramp-v102"
          style="left:${rampLeft}px;width:${rampWidth}px">
          <div class="bike-ramp-line"></div>
          <span>CENTER</span>
          <i class="bike-ramp-arrow a1">▲</i>
          <i class="bike-ramp-arrow a2">▲</i>
        </div>

        <div id="bikeRider" class="bike-rider">
          <div class="bike-mob" style="background-image:url('icon/01.png')"></div>
          <div class="bike-body"></div>
          <i class="bike-wheel w1"></i>
          <i class="bike-wheel w2"></i>
        </div>
      </div>

      <div id="bikeMessage" class="bike-message">まずは高速走行…</div>
    </button>
  </div>`;

  const stage=document.getElementById('bikeStage');
  const world=document.getElementById('bikeWorld');
  const rider=document.getElementById('bikeRider');
  const timingEl=document.getElementById('bikeTiming');
  const distanceEl=document.getElementById('bikeDistance');
  const message=document.getElementById('bikeMessage');

  rider.style.left=`${bikeX}px`;
  rider.style.bottom=`${roadY}px`;

  if(!(await countdown('BIKE JUMP',runId)))return;

  started=true;
  timingEl.textContent='--';
  message.textContent='';

  stage.addEventListener('pointerdown',e=>{
    if(done||!started||!isGameRunValid(runId))return;
    e.preventDefault();

    const visibleThreshold=rampLeft-stage.clientWidth*.96;

    if(bikeX<visibleThreshold){
      message.textContent='';
      beep(210,45,.012);
      return;
    }

    done=true;
    if(raf)cancelAnimationFrame(raf);

    const errorPx=Math.abs(bikeX-rampCenter);
    const accuracy=clamp(100-errorPx/2.10,0,100);
    const distance=Math.round(2000*Math.pow(accuracy/100,1.38)*10)/10;

    timingEl.textContent=`${accuracy.toFixed(1)}%`;
    distanceEl.textContent=`${distance.toFixed(1)}m`;

    if(errorPx<=7)message.textContent='PERFECT CENTER!!';
    else if(errorPx<=30)message.textContent='GREAT TAKE OFF!';
    else if(errorPx<=85)message.textContent='GOOD JUMP!';
    else message.textContent='JUMP!';

    beep(accuracy>=97?1040:accuracy>=85?820:accuracy>=60?620:360,85,.03);

    const rampProgress=clamp((bikeX-rampLeft)/rampWidth,0,1);
    const startY=roadY+rampProgress*118;

    rider.style.bottom=`${startY}px`;

    const startX=bikeX;
    const travelPx=distance/2000*(worldW-rampCenter-850);
    const startTime=performance.now();
    const duration=1050+distance/2000*3000;
    const peak=145+distance/2000*590;

    state.records.bikeJump[p.id]=distance;

    const fly=now=>{
      if(!isGameRunValid(runId))return;

      const t=clamp((now-startTime)/duration,0,1);
      const eased=1-Math.pow(1-t,1.7);
      const x=startX+travelPx*eased;
      const y=startY+Math.sin(t*Math.PI)*peak;

      rider.style.left=`${x}px`;
      rider.style.bottom=`${y}px`;
      rider.style.transform=`rotate(${Math.sin(t*Math.PI)*-10}deg)`;

      distanceEl.textContent=`${(distance*eased).toFixed(1)}m`;

      const cam=clamp(x-stage.clientWidth*.24,0,worldW-stage.clientWidth);
      world.style.transform=`translateX(${-cam}px)`;

      if(t<1){
        raf=requestAnimationFrame(fly);
      }else{
        rider.classList.add('land');
        distanceEl.textContent=`${distance.toFixed(1)}m`;

        setTimeout(()=>{
          if(isGameRunValid(runId)){
            recordScreen(
              35,p,humanIndex,
              `${distance.toFixed(1)}<small>m</small>`,
              `TAKE OFF ${accuracy.toFixed(1)}%`
            );
          }
        },700);
      }
    };

    raf=requestAnimationFrame(fly);
  },{passive:false});

  let last=performance.now();

  function run(now){
    if(done||!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    bikeX+=speed*dt;
    rider.style.left=`${bikeX}px`;

    // The bike physically rides UP the ramp instead of passing in front of a background shape.
    if(bikeX>=rampLeft&&bikeX<=rampRight){
      const rp=clamp((bikeX-rampLeft)/rampWidth,0,1);
      rider.style.bottom=`${roadY+rp*150}px`;
      rider.style.transform=`rotate(-20deg)`;
    }else if(bikeX<rampLeft){
      rider.style.bottom=`${roadY}px`;
      rider.style.transform='rotate(0deg)';
    }

    // Keep rider further left so more of the upcoming course is visible.
    const cam=clamp(bikeX-stage.clientWidth*.18,0,worldW-stage.clientWidth);
    world.style.transform=`translateX(${-cam}px)`;

    const timeToRamp=(rampLeft-(bikeX+stage.clientWidth*.72))/speed;

    if(!rampAnnounced&&timeToRamp<=0){
      rampAnnounced=true;
      message.textContent='CENTERでTAP！';
      timingEl.textContent='CENTER!';
      beep(760,70,.022);
    }else if(!rampAnnounced){
      message.textContent='';
      timingEl.textContent='--';
    }

    if(bikeX>rampRight+110){
      done=true;
      state.records.bikeJump[p.id]=0;
      timingEl.textContent='MISS';
      message.textContent='ジャンプ台を通過！';

      setTimeout(()=>{
        if(isGameRunValid(runId)){
          recordScreen(35,p,humanIndex,`0<small>m</small>`,`MISS TAKE OFF`);
        }
      },650);
      return;
    }

    raf=requestAnimationFrame(run);
  }

  raf=requestAnimationFrame(run);
}

// GAME 37 -------------------------------------------------
async function startDynamicTrampoline(p,humanIndex,runId){
  gameFit();

  const baseHeights=[500,1000,2000];

  let cumulativePenalty=0;
  let finalHeight=0;
  let stageRAF=null;

  screen.innerHTML=`<div class="tramp-shell tramp-v111">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>ダイナミックトラポリン</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="tramp-hud">
      <div><span>JUMP</span><b id="trampRound">1 / 3</b></div>
      <div><span>MOMENTUM</span><b id="trampMomentum">100%</b></div>
      <div><span>HEIGHT</span><b id="trampHeight">0m</b></div>
    </div>

    <div id="trampStage" class="tramp-stage tramp-stage-v111">
      <div id="trampWorld" class="tramp-world">
        <div class="tramp-sky-lines"></div>
        <div id="trampMob" class="tramp-mob tramp-mob-v111" style="background-image:url('icon/01.png')"></div>
        <div id="trampBed" class="tramp-bed tramp-bed-v111">
          <div class="tramp-net"></div>
          <i class="tramp-leg l1"></i>
          <i class="tramp-leg l2"></i>
        </div>
      </div>

      <div id="trampGaugeWrap" class="tramp-gauge-v111 hidden">
        <div class="tramp-gauge-label">CENTERでSTOP</div>
        <div class="tramp-gauge-track">
          <i class="tramp-gauge-center"></i>
          <i id="trampGaugeMarker" class="tramp-gauge-marker"></i>
        </div>
        <button id="trampStop" type="button">STOP</button>
      </div>

      <div id="trampMessage" class="tramp-message">カウントダウン後に上から落下！</div>
    </div>
  </div>`;

  const stage=document.getElementById('trampStage');
  const world=document.getElementById('trampWorld');
  const mob=document.getElementById('trampMob');
  const bed=document.getElementById('trampBed');
  const gaugeWrap=document.getElementById('trampGaugeWrap');
  const marker=document.getElementById('trampGaugeMarker');
  const stopBtn=document.getElementById('trampStop');
  const roundEl=document.getElementById('trampRound');
  const momentumEl=document.getElementById('trampMomentum');
  const heightEl=document.getElementById('trampHeight');
  const message=document.getElementById('trampMessage');

  function setCompressed(on){
    mob.classList.toggle('compressed',on);
    bed.classList.toggle('compressed',on);

    mob.style.bottom=on?'48px':'95px';
    bed.style.transform=
      on
        ? 'translateX(-50%) scaleY(.30)'
        : 'translateX(-50%) scaleY(1)';
  }

  async function animateInitialDrop(){
    const start=performance.now();
    const duration=920;
    const topY=Math.max(390,stage.clientHeight*.96);

    mob.style.bottom=`${topY}px`;
    message.textContent='落ちてくる！';

    await new Promise(resolve=>{
      const frame=now=>{
        if(!isGameRunValid(runId)){resolve();return;}

        const t=clamp((now-start)/duration,0,1);
        const eased=t*t;
        const y=topY+(48-topY)*eased;

        mob.style.bottom=`${y}px`;
        mob.style.transform=`translateX(-50%) rotate(${Math.sin(t*Math.PI)*7}deg)`;

        if(t<1){
          stageRAF=requestAnimationFrame(frame);
        }else{
          mob.style.transform='translateX(-50%)';
          setCompressed(true);
          stage.classList.add('tramp-impact-v111');
          setTimeout(()=>stage.classList.remove('tramp-impact-v111'),240);
          resolve();
        }
      };

      stageRAF=requestAnimationFrame(frame);
    });
  }

  function gaugeRound(round){
    return new Promise(resolve=>{
      let done=false;
      let raf=null;
      const start=performance.now();
      const speed=round===0?1.06:round===1?1.20:1.34;

      roundEl.textContent=`${round+1} / 3`;
      gaugeWrap.classList.remove('hidden');
      message.textContent=`${round+1}回目 / 沈んだまま中央を狙え！`;
      setCompressed(true);

      function currentPosition(now){
        const phase=(now-start)/1000*speed*Math.PI*2;
        return .5+.5*Math.sin(phase);
      }

      function stopGauge(){
        if(done||!isGameRunValid(runId))return;

        done=true;
        if(raf)cancelAnimationFrame(raf);

        const pos=currentPosition(performance.now());
        marker.style.left=`${pos*100}%`;

        const dist=Math.abs(pos-.5)/.5;

        // Easy-to-read gauge: edge still keeps 45%, center is broad.
        const rawPct=clamp(
          100-Math.pow(dist,1.45)*35,
          65,100
        );

        const inheritedBefore=cumulativePenalty;
        const effectivePct=clamp(
          rawPct-inheritedBefore,
          0,100
        );

        cumulativePenalty+=100-rawPct;

        const height=Math.round(
          baseHeights[round]*
          effectivePct/100*
          10
        )/10;

        if(round===2)finalHeight=height;

        momentumEl.textContent=`${effectivePct.toFixed(1)}%`;
        heightEl.textContent=`${height.toFixed(1)}m`;

        message.textContent=
          rawPct>=98
            ? `PERFECT ${rawPct.toFixed(1)}%！`
            : `${rawPct.toFixed(1)}% → 勢い ${effectivePct.toFixed(1)}%`;

        beep(
          rawPct>=98?1030:
          rawPct>=90?840:
          620,
          70,.02
        );

        setTimeout(()=>{
          gaugeWrap.classList.add('hidden');
          resolve({rawPct,effectivePct,height});
        },250);
      }

      stopBtn.onpointerdown=e=>{
        e.preventDefault();
        stopGauge();
      };

      const frame=now=>{
        if(done||!isGameRunValid(runId))return;

        const pos=currentPosition(now);
        marker.style.left=`${pos*100}%`;
        raf=requestAnimationFrame(frame);
      };

      raf=requestAnimationFrame(frame);
    });
  }

  async function bounceFlight(height,round){
    setCompressed(false);

    const visualMax=
      round===2
        ? Math.min(2500,240+height*1.10)
        : Math.min(1280,210+height*.84);

    const duration=
      round===2
        ? 1700
        : 980+round*170;

    const start=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        if(!isGameRunValid(runId)){resolve();return;}

        const t=clamp((now-start)/duration,0,1);
        const arc=Math.sin(t*Math.PI);
        const y=95+arc*visualMax;

        mob.style.bottom=`${y}px`;
        heightEl.textContent=`${(height*arc).toFixed(0)}m`;

        const vh=stage.clientHeight;
        const cam=Math.max(0,y-vh*.44);
        world.style.transform=`translateY(${cam}px)`;

        if(t<1){
          stageRAF=requestAnimationFrame(frame);
        }else{
          world.style.transform='translateY(0px)';
          setCompressed(true);
          heightEl.textContent=`${height.toFixed(1)}m`;
          resolve();
        }
      };

      stageRAF=requestAnimationFrame(frame);
    });
  }

  if(!(await countdown('TRAMPOLINE',runId)))return;

  await animateInitialDrop();
  if(!isGameRunValid(runId))return;

  for(let round=0;round<3;round++){
    const result=await gaugeRound(round);
    if(!isGameRunValid(runId))return;

    await bounceFlight(result.height,round);
    if(!isGameRunValid(runId))return;
  }

  state.records.trampoline[p.id]=finalHeight;

  message.textContent=
    finalHeight>=1950
      ? 'DYNAMIC PERFECT!!'
      : `3rd JUMP ${finalHeight.toFixed(1)}m`;

  beep(
    finalHeight>=1900?1080:
    finalHeight>=1400?900:
    650,
    150,.04
  );

  await wait(550);

  if(isGameRunValid(runId)){
    recordScreen(
      36,p,humanIndex,
      `${finalHeight.toFixed(1)}<small>m</small>`,
      `3rd JUMP / GAUGE`
    );
  }
}

// GAME 38 -------------------------------------------------
async function startMobTrain(p,humanIndex,runId){
  gameFit();

  let drawing=false;
  let drawingOpen=false;
  let pointerId=null;
  let points=[];
  let trainRAF=null;
  let drawRAF=null;

  screen.innerHTML=`<div class="train-shell train-v107">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん列車出発進行！</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="train-hud">
      <div><span>DRAW</span><b id="trainDrawTime">5.0</b></div>
      <div><span>GOAL TIME</span><b id="trainGoalTime">--</b></div>
    </div>

    <div id="trainStage" class="train-stage">
      <div class="train-grass train-grass-v107"></div>

      <svg id="trainSvg" class="train-svg">
        <polyline id="trainLine" points="" class="train-line"></polyline>
      </svg>

      <div id="trainObstacles"></div>

      <div id="trainStartRail" class="train-start-rail">
        <i></i><i></i><i></i><i></i>
      </div>

      <div id="trainGoal" class="train-goal">
        <i class="train-goal-pole"></i>
        <b>GOAL</b>
      </div>

      <div id="mobTrain" class="mob-train">
        <div class="train-engine">
          <span class="train-window" style="background-image:url('icon/01.png')"></span>
          <i class="train-smoke"></i>
        </div>
        <i class="train-wheel tw1"></i>
        <i class="train-wheel tw2"></i>
      </div>

      <div id="trainMessage" class="train-message">列車から旗まで線を描く</div>
      <div id="trainGoPop" class="train-go-pop">GO!</div>
    </div>
  </div>`;

  const stage=document.getElementById('trainStage');
  const svg=document.getElementById('trainSvg');
  const line=document.getElementById('trainLine');
  const obstacleLayer=document.getElementById('trainObstacles');
  const startRail=document.getElementById('trainStartRail');
  const goalEl=document.getElementById('trainGoal');
  const train=document.getElementById('mobTrain');
  const drawTimeEl=document.getElementById('trainDrawTime');
  const goalTimeEl=document.getElementById('trainGoalTime');
  const message=document.getElementById('trainMessage');
  const goPop=document.getElementById('trainGoPop');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  const startPt={
    x:34,
    y:h*rand(.62,.78)
  };

  const goalPt={
    x:w-34,
    y:h*rand(.25,.56)
  };

  points=[startPt];

  startRail.style.left=`${startPt.x-30}px`;
  startRail.style.top=`${startPt.y-10}px`;

  train.style.left=`${startPt.x}px`;
  train.style.top=`${startPt.y}px`;

  goalEl.style.left=`${goalPt.x}px`;
  goalEl.style.top=`${goalPt.y}px`;

  // Dense randomized map, but everything remains visible in one screen.
  const goalSafeRadius=Math.max(78,w*.17);
  const startSafeRadius=74;
  const obsData=[];
  const obstacleTypes=['rock','tree','water'];
  const desired=randi(14,18);

  // Hidden guaranteed route corridor.
  // Obstacles are never placed directly on this route, so every map has at least one solution.
  const safeRoute=[
    startPt,
    {x:w*.34,y:h*rand(.28,.72)},
    {x:w*.66,y:h*rand(.28,.72)},
    goalPt
  ];

  function pointToSegmentDistance(px,py,a,b){
    const vx=b.x-a.x;
    const vy=b.y-a.y;
    const len2=vx*vx+vy*vy||1;
    const t=clamp(((px-a.x)*vx+(py-a.y)*vy)/len2,0,1);
    const qx=a.x+vx*t;
    const qy=a.y+vy*t;
    return Math.hypot(px-qx,py-qy);
  }

  function nearSafeRoute(o){
    for(let i=1;i<safeRoute.length;i++){
      if(
        pointToSegmentDistance(
          o.x,o.y,
          safeRoute[i-1],
          safeRoute[i]
        )<o.r+25
      )return true;
    }
    return false;
  }

  let attempts=0;

  while(obsData.length<desired&&attempts<420){
    attempts++;

    const type=obstacleTypes[randi(0,obstacleTypes.length-1)];
    const r=
      type==='water'
        ? rand(17,23)
        : rand(14,21);

    const o={
      x:rand(w*.13,w*.87),
      y:rand(h*.20,h*.80),
      r,
      type
    };

    if(Math.hypot(o.x-goalPt.x,o.y-goalPt.y)<=goalSafeRadius)continue;
    if(Math.hypot(o.x-startPt.x,o.y-startPt.y)<=startSafeRadius)continue;
    if(nearSafeRoute(o))continue;

    if(
      obsData.some(q=>
        Math.hypot(o.x-q.x,o.y-q.y)<
        o.r+q.r+17
      )
    )continue;

    obsData.push(o);
  }

  obstacleLayer.innerHTML=obsData.map((o,i)=>`
    <div class="train-obstacle ${o.type}"
      data-ob="${i}"
      style="
        left:${o.x}px;
        top:${o.y}px;
        width:${o.r*2}px;
        height:${o.r*2}px
      ">
      ${o.type==='rock'?'◆':o.type==='tree'?'♣':'≈'}
    </div>
  `).join('');

  function renderLine(){
    line.setAttribute(
      'points',
      points
        .map(pt=>`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
        .join(' ')
    );
  }

  renderLine();

  function localPoint(e){
    const rect=stage.getBoundingClientRect();

    return {
      x:clamp(e.clientX-rect.left,5,w-5),
      y:clamp(e.clientY-rect.top,5,h-5)
    };
  }

  stage.addEventListener('pointerdown',e=>{
    if(
      !drawingOpen||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    const pt=localPoint(e);
    const last=points[points.length-1];

    if(Math.hypot(pt.x-last.x,pt.y-last.y)>55){
      message.textContent='線の続きから描いて！';
      beep(190,45,.01);
      return;
    }

    drawing=true;
    pointerId=e.pointerId;

    try{stage.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(
      !drawing||
      e.pointerId!==pointerId||
      !drawingOpen
    )return;

    e.preventDefault();

    const pt=localPoint(e);
    const prev=points[points.length-1];

    if(Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.8){
      points.push(pt);
      renderLine();
    }
  },{passive:false});

  stage.addEventListener('pointerup',e=>{
    if(e.pointerId===pointerId)drawing=false;
  },{passive:false});

  stage.addEventListener('pointercancel',e=>{
    if(e.pointerId===pointerId)drawing=false;
  },{passive:false});

  if(!(await countdown('DRAW RAIL',runId)))return;

  drawingOpen=true;
  message.textContent='5秒！ 障害物を避けて旗へ！';

  const drawStart=performance.now();

  await new Promise(resolve=>{
    const timer=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const rem=5000-(now-drawStart);
      drawTimeEl.textContent=(Math.max(0,rem)/1000).toFixed(1);

      if(rem<=0){
        drawingOpen=false;
        drawing=false;
        resolve();
        return;
      }

      drawRAF=requestAnimationFrame(timer);
    };

    drawRAF=requestAnimationFrame(timer);
  });

  if(!isGameRunValid(runId))return;

  drawTimeEl.textContent='0.0';

  const last=points[points.length-1];
  const reachesGoal=
    Math.hypot(
      last.x-goalPt.x,
      last.y-goalPt.y
    )<=50;

  if(reachesGoal){
    points.push(goalPt);
    renderLine();
  }

  if(points.length<3){
    state.records.mobTrain[p.id]=99999;
    message.textContent='線路がない！';

    beep(150,170,.03);

    await wait(600);

    if(isGameRunValid(runId)){
      recordScreen(
        37,p,humanIndex,
        `0<small>pt</small>`,
        `NO RAIL`
      );
    }

    return;
  }

  goPop.classList.add('show');
  message.textContent='出発進行！';

  beep(880,100,.03);

  await wait(300);

  if(!isGameRunValid(runId))return;

  const cumulative=[0];
  let totalLen=0;

  for(let i=1;i<points.length;i++){
    totalLen+=Math.hypot(
      points[i].x-points[i-1].x,
      points[i].y-points[i-1].y
    );

    cumulative.push(totalLen);
  }

  const trainSpeed=126;
  const goStart=performance.now();
  let collided=false;

  function pointAtDistance(d){
    if(d<=0)return {...points[0],angle:0};

    for(let i=1;i<cumulative.length;i++){
      if(d<=cumulative[i]){
        const segLen=
          cumulative[i]-cumulative[i-1]||
          1;

        const t=
          (d-cumulative[i-1])/
          segLen;

        const a=points[i-1];
        const b=points[i];

        return {
          x:a.x+(b.x-a.x)*t,
          y:a.y+(b.y-a.y)*t,
          angle:
            Math.atan2(
              b.y-a.y,
              b.x-a.x
            )*
            180/
            Math.PI
        };
      }
    }

    const a=points[points.length-2];
    const b=points[points.length-1];

    return {
      x:b.x,
      y:b.y,
      angle:
        Math.atan2(
          b.y-a.y,
          b.x-a.x
        )*
        180/
        Math.PI
    };
  }

  function hitsObstacle(pt){
    for(const o of obsData){
      const dx=pt.x-o.x;
      const dy=pt.y-o.y;

      if(o.type==='water'){
        if(
          (dx/(o.r*1.18))**2+
          (dy/(o.r*.72))**2<
          1
        )return o;

      }else if(Math.hypot(dx,dy)<o.r+8){
        return o;
      }
    }

    return null;
  }

  await new Promise(resolve=>{
    const move=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const elapsed=now-goStart;
      const d=Math.min(
        totalLen,
        elapsed/1000*trainSpeed
      );

      const pt=pointAtDistance(d);

      train.style.left=`${pt.x}px`;
      train.style.top=`${pt.y}px`;
      train.style.transform=
        `translate(-50%,-50%) rotate(${pt.angle}deg)`;

      goalTimeEl.textContent=
        (elapsed/1000).toFixed(2);

      const hit=hitsObstacle(pt);

      if(hit){
        collided=true;
        train.classList.add('crashed');

        message.textContent=
          hit.type==='water'
            ? '水に落ちた！'
            : hit.type==='tree'
              ? '木に激突！'
              : '岩に激突！';

        beep(135,220,.04);
        resolve();
        return;
      }

      if(d>=totalLen){
        resolve();
        return;
      }

      trainRAF=requestAnimationFrame(move);
    };

    trainRAF=requestAnimationFrame(move);
  });

  if(!isGameRunValid(runId))return;

  const elapsedMs=performance.now()-goStart;

  if(collided||!reachesGoal){
    state.records.mobTrain[p.id]=99999;

    if(!collided){
      message.textContent='旗まで線が届いていない！';
    }

    await wait(600);

    if(isGameRunValid(runId)){
      recordScreen(
        37,p,humanIndex,
        `0<small>pt</small>`,
        collided?'COLLISION':'NO GOAL'
      );
    }

    return;
  }

  const recordMs=Math.round(elapsedMs);
  state.records.mobTrain[p.id]=recordMs;

  train.classList.add('goal');
  message.textContent='GOAL!!';
  goalTimeEl.textContent=
    (recordMs/1000).toFixed(2);

  beep(1040,130,.035);

  await wait(650);

  if(isGameRunValid(runId)){
    recordScreen(
      37,p,humanIndex,
      `${(recordMs/1000).toFixed(2)}<small>秒</small>`,
      `GOAL TIME`
    );
  }
}

// GAME 39 -------------------------------------------------
async function startGiantMob(p,humanIndex,runId){
  gameFit();

  let raf=null;
  let finished=false;
  let energy=100;
  let destroyed=0;
  let giantX=145;
  let cycleStart=0;
  let lastFrame=0;
  let lastStep=-1;

  const worldW=6900;
  const moveSpeed=270;

  screen.innerHTML=`<div class="giant-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>巨大モブくん大進撃</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="giant-hud">
      <div><span>ENERGY</span><b id="giantEnergy">100.0</b></div>
      <div><span>BREAK</span><b id="giantBreak">0棟</b></div>
    </div>

    <button id="giantStage" class="giant-stage" type="button">
      <div id="giantWorld" class="giant-world" style="width:${worldW}px">
        <div class="giant-sky">
          ${Array.from({length:18},(_,i)=>`<i class="giant-cloud" style="left:${180+i*390}px;top:${26+(i%3)*43}px">☁</i>`).join('')}
        </div>

        <div class="giant-ground"></div>
        <div id="giantBuildings" class="giant-buildings"></div>

        <div id="giantMob" class="giant-mob">
          <div class="giant-figure" style="background-image:url('icon/01.png')"></div>
          <div class="giant-step-wave"></div>
        </div>
      </div>

      <div id="giantEnergyClock" class="giant-energy-clock">
        <div class="giant-clock-ring"></div>
        <div id="giantClockNeedle" class="giant-clock-needle"></div>
        <div class="giant-clock-center">
          <small>TARGET</small>
          <b>1.000</b>
        </div>
      </div>

      <div id="giantTiming" class="giant-timing">1.000秒でTAP！</div>
      <div id="giantImpact" class="giant-impact"></div>
    </button>
  </div>`;

  const stage=document.getElementById('giantStage');
  const world=document.getElementById('giantWorld');
  const giant=document.getElementById('giantMob');
  const buildingLayer=document.getElementById('giantBuildings');
  const energyEl=document.getElementById('giantEnergy');
  const breakEl=document.getElementById('giantBreak');
  const needle=document.getElementById('giantClockNeedle');
  const timing=document.getElementById('giantTiming');
  const impact=document.getElementById('giantImpact');

  const buildings=[];
  let bx=510;

  for(let i=0;i<30;i++){
    const width=randi(78,128);
    const height=randi(125,300);

    buildings.push({
      x:bx,
      w:width,
      h:height,
      destroyed:false
    });

    bx+=randi(150,205);
  }

  buildingLayer.innerHTML=buildings.map((b,i)=>`
    <div class="giant-building gb${i%5}"
      style="left:${b.x}px;width:${b.w}px;height:${b.h}px">
      <div class="giant-windows"></div>
    </div>`).join('');

  const buildingEls=[...buildingLayer.children];

  function popImpact(text){
    impact.textContent=text;
    impact.classList.remove('show');
    void impact.offsetWidth;
    impact.classList.add('show');
  }

  function stopGame(reason){
    if(finished)return;
    finished=true;

    state.records.giantMob[p.id]=destroyed;

    giant.classList.add('stopped');
    timing.textContent=reason;
    needle.style.transform='translateX(-50%) rotate(0deg)';

    beep(destroyed>=30?1040:destroyed>=18?820:480,150,.035);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          38,p,humanIndex,
          `${destroyed}<small>棟</small>`,
          `ENERGY ${energy.toFixed(1)}`
        );
      }
    },850);
  }

  stage.addEventListener('pointerdown',e=>{
    if(finished||!isGameRunValid(runId))return;
    e.preventDefault();

    const now=performance.now();
    const elapsed=now-cycleStart;
    const errorMs=Math.abs(elapsed-1000);

    // V10.5 difficulty:
    // 0〜14 destroyed: base penalty ×4
    // once 15 buildings have been destroyed: ×8
    const penaltyMultiplier=destroyed>=15?8:4;
    const loss=clamp((errorMs/10)*penaltyMultiplier,0,100);

    energy=clamp(energy-loss,0,100);
    energyEl.textContent=energy.toFixed(1);

    timing.textContent=
      errorMs<=15
        ? 'PERFECT 1.000!'
        : `誤差 ${(errorMs/1000).toFixed(3)}秒 / ×${penaltyMultiplier} / -${loss.toFixed(1)}`;

    popImpact(errorMs<=15?'PERFECT!':`-${loss.toFixed(1)}`);

    beep(errorMs<=15?1030:errorMs<=90?820:errorMs<=260?610:290,55,.018);

    if(energy<=0){
      stopGame('ENERGY 0');
      return;
    }

    // Stopwatch immediately starts the next 1-second challenge.
    cycleStart=now;
  },{passive:false});

  if(!(await countdown('GIANT MOB',runId)))return;

  cycleStart=performance.now();
  lastFrame=cycleStart;

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(32,now-lastFrame)/1000;
    lastFrame=now;

    giantX+=moveSpeed*dt;
    giant.style.left=`${giantX}px`;

    const cycleElapsed=now-cycleStart;

    // One full rotation = exactly 1.000 second.
    needle.style.transform=
      `translateX(-50%) rotate(${cycleElapsed/1000*360}deg)`;

    if(cycleElapsed>=2000){
      energy=0;
      energyEl.textContent='0.0';
      stopGame('2.000秒経過 / ENERGY 0');
      return;
    }

    const stepIndex=Math.floor(now/310);

    if(stepIndex!==lastStep){
      lastStep=stepIndex;
      giant.classList.remove('thump');
      void giant.offsetWidth;
      giant.classList.add('thump');
    }

    buildings.forEach((b,i)=>{
      if(b.destroyed)return;

      const buildingCenter=b.x+b.w/2;

      if(giantX+78>=buildingCenter){
        b.destroyed=true;
        destroyed++;
        breakEl.textContent=`${destroyed}棟`;

        buildingEls[i].style.setProperty(
          '--giant-break-dir',
          Math.random()<.5?-1:1
        );
        buildingEls[i].classList.add('destroyed');

        const dust=document.createElement('i');
        dust.className='giant-debris';
        dust.style.left=`${buildingCenter}px`;
        dust.style.bottom=`${52+b.h*.24}px`;
        world.appendChild(dust);

        setTimeout(()=>dust.remove(),620);

        beep(125+randi(0,80),25,.006);
      }
    });

    const cam=clamp(
      giantX-stage.clientWidth*.32,
      0,
      worldW-stage.clientWidth
    );
    world.style.transform=`translateX(${-cam}px)`;

    if(destroyed>=buildings.length){
      stopGame('CITY CLEAR!');
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



// GAME 40 -------------------------------------------------
function wizardCircleQuality(points,flameX,flameY){
  if(points.length<14)return 0;

  let cx=0,cy=0;
  for(const pt of points){cx+=pt.x;cy+=pt.y}
  cx/=points.length;
  cy/=points.length;

  const radii=points.map(pt=>Math.hypot(pt.x-cx,pt.y-cy));
  const avgR=radii.reduce((a,b)=>a+b,0)/radii.length;

  if(avgR<25||avgR>105)return 0;

  const radialDev=
    radii.reduce((s,r)=>s+Math.abs(r-avgR),0)/
    radii.length/
    avgR;

  let totalAngle=0;
  let netAngle=0;
  let prev=Math.atan2(points[0].y-cy,points[0].x-cx);

  for(let i=1;i<points.length;i++){
    const a=Math.atan2(points[i].y-cy,points[i].x-cx);
    let d=a-prev;
    while(d>Math.PI)d-=Math.PI*2;
    while(d<-Math.PI)d+=Math.PI*2;
    totalAngle+=Math.abs(d);
    netAngle+=d;
    prev=a;
  }

  const coverage=clamp(totalAngle/(Math.PI*2),0,1);
  const direction=totalAngle>0?Math.abs(netAngle)/totalAngle:0;
  const flameCenterError=Math.hypot(flameX-cx,flameY-cy);
  const centerScore=clamp(1-flameCenterError/(avgR*.72),0,1);
  const roundScore=clamp(1-radialDev/.40,0,1);

  return clamp(
    coverage*.38+
    direction*.15+
    centerScore*.30+
    roundScore*.17,
    0,1
  );
}

async function startWizardMob(p,humanIndex,runId){
  gameFit();

  let finished=false;
  let kills=0;
  let startTime=0;
  let lastSpawn=0;
  let nextCitizenShot=0;
  let flameId=0;
  let raf=null;
  let drawing=false;
  let pointerId=null;
  let trace=[];

  const flames=[];
  const villagers=[];

  screen.innerHTML=`<div class="wizard-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>魔法使いモブくん</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="wizard-hud">
      <div><span>TIME</span><b id="wizardTime">10.0</b></div>
      <div><span>DISPEL</span><b id="wizardKills">0</b></div>
    </div>

    <div id="wizardStage" class="wizard-stage">
      <div class="wizard-town-bg">
        <div class="wizard-mountain m1"></div>
        <div class="wizard-mountain m2"></div>
        <div class="wizard-house h1"><i></i></div>
        <div class="wizard-house h2"><i></i></div>
        <div class="wizard-house h3"><i></i></div>
        <div class="wizard-fence"></div>
      </div>

      <div id="wizardVillagers"></div>
      <div id="wizardFlames"></div>

      <svg id="wizardTraceSvg" class="wizard-trace-svg">
        <polyline id="wizardTrace" points="" class="wizard-trace"></polyline>
      </svg>

      <div class="wizard-caster">
        <div class="wizard-caster-mob" style="background-image:url('icon/01.png')"></div>
        <div class="wizard-wand"><i></i></div>
      </div>

      <div id="wizardMessage" class="wizard-message">闇の炎を円で囲め！</div>
      <div id="wizardBurst" class="wizard-burst"></div>
    </div>
  </div>`;

  const stage=document.getElementById('wizardStage');
  const flameLayer=document.getElementById('wizardFlames');
  const villagerLayer=document.getElementById('wizardVillagers');
  const svg=document.getElementById('wizardTraceSvg');
  const traceLine=document.getElementById('wizardTrace');
  const timeEl=document.getElementById('wizardTime');
  const killsEl=document.getElementById('wizardKills');
  const message=document.getElementById('wizardMessage');
  const burst=document.getElementById('wizardBurst');

  const sw=stage.clientWidth;
  const sh=stage.clientHeight;
  svg.setAttribute('viewBox',`0 0 ${sw} ${sh}`);

  function spawnVillagers(){
    const count=5;
    for(let i=0;i<count;i++){
      const el=document.createElement('div');
      el.className='wizard-villager';
      el.style.backgroundImage=`url('icon/${String((i%9)+2).padStart(2,'0')}.png')`;

      const v={
        el,
        x:55+i*(sw-110)/(count-1),
        y:sh-randi(58,86),
        speed:rand(24,42)*(i%2?1:-1),
        phase:Math.random()*Math.PI*2
      };

      el.style.left=`${v.x}px`;
      el.style.top=`${v.y}px`;

      villagerLayer.appendChild(el);
      villagers.push(v);
    }
  }

  function spawnFlame(now,progress){
    const el=document.createElement('div');
    el.className='wizard-dark-flame';
    el.innerHTML='<i></i><b></b>';

    const big=Math.random()<(0.15+progress*.12);
    if(big)el.classList.add('giant');

    const size=big?rand(78,108):rand(40,64);

    // Keep enough empty space on both sides to physically draw a full circle.
    // The flame itself can never spawn flush against the screen edge.
    const circleMargin=Math.min(
      sw*.34,
      size*.55+(big?82:66)
    );
    const x=rand(
      circleMargin,
      sw-circleMargin
    );

    const f={
      id:++flameId,
      el,
      x,
      y:-size*.75,
      size,
      // Giant flames are deliberately slower and easier to read,
      // while normal flames stay fast.
      vy:big
        ? rand(76,105)+progress*68
        : rand(142,190)+progress*145,
      drift:rand(-28,28),
      dead:false,
      big,
      slowUntil:0
    };

    el.style.width=`${size}px`;
    el.style.height=`${size*1.28}px`;

    flameLayer.appendChild(el);
    flames.push(f);

    lastSpawn=now;
  }

  function removeFlame(f,magic=false){
    if(f.dead)return;
    f.dead=true;

    if(magic){
      f.el.classList.add('dispelled');
      kills++;
      killsEl.textContent=kills;

      burst.style.left=`${f.x}px`;
      burst.style.top=`${f.y}px`;
      burst.classList.remove('show');
      void burst.offsetWidth;
      burst.classList.add('show');

      message.textContent='DISPEL!';
      beep(900+randi(0,120),55,.018);

      setTimeout(()=>f.el.remove(),260);
    }else{
      f.el.remove();
    }
  }

  function citizenEnergyShot(now){
    const alive=flames.filter(f=>!f.dead);
    if(!alive.length||!villagers.length)return;

    const target=alive
      .map(f=>({
        f,
        danger:sh-f.y
      }))
      .sort((a,b)=>a.danger-b.danger)[0]?.f;

    if(!target)return;

    const shooter=villagers[randi(0,villagers.length-1)];

    const orb=document.createElement('i');
    orb.className='wizard-citizen-orb';

    const dx=target.x-shooter.x;
    const dy=target.y-shooter.y;

    orb.style.left=`${shooter.x}px`;
    orb.style.top=`${shooter.y}px`;
    orb.style.setProperty('--wizard-shot-x',`${dx}px`);
    orb.style.setProperty('--wizard-shot-y',`${dy}px`);

    stage.appendChild(orb);

    setTimeout(()=>{
      orb.remove();

      if(!target.dead){
        // Only a small gameplay assist: 13% slowdown for 0.72 sec.
        target.slowUntil=performance.now()+720;
        target.el.classList.remove('citizen-slow');
        void target.el.offsetWidth;
        target.el.classList.add('citizen-slow');
      }
    },360);

    beep(470,28,.005);

    // Deliberately infrequent.
    nextCitizenShot=now+rand(1900,2900);
  }

  function failGame(){
    if(finished)return;
    finished=true;

    state.records.wizardMob[p.id]=kills;
    message.textContent='モブくんに当たった！';
    stage.classList.add('wizard-fail');
    beep(130,220,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          39,p,humanIndex,
          `${kills}<small>個</small>`,
          `DARK FIRE DISPEL`
        );
      }
    },750);
  }

  function localPoint(e){
    const r=stage.getBoundingClientRect();
    return {
      x:clamp(e.clientX-r.left,0,sw),
      y:clamp(e.clientY-r.top,0,sh)
    };
  }

  function drawTrace(){
    traceLine.setAttribute(
      'points',
      trace.map(pt=>`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(' ')
    );
  }

  stage.addEventListener('pointerdown',e=>{
    if(finished||drawing||!isGameRunValid(runId))return;
    e.preventDefault();

    drawing=true;
    pointerId=e.pointerId;
    trace=[localPoint(e)];
    drawTrace();

    try{stage.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();

    const pt=localPoint(e);
    const prev=trace[trace.length-1];

    if(!prev||Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.4){
      trace.push(pt);
      drawTrace();
    }
  },{passive:false});

  function finishCircle(e){
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();

    drawing=false;

    let target=null;
    let best=0;

    for(const f of flames){
      if(f.dead)continue;

      const q=wizardCircleQuality(trace,f.x,f.y);
      if(q>best){
        best=q;
        target=f;
      }
    }

    if(target&&best>=.66){
      removeFlame(target,true);
    }else{
      message.textContent='もっと円く囲もう！';
      beep(250,40,.009);
    }

    trace=[];
    traceLine.setAttribute('points','');
  }

  stage.addEventListener('pointerup',finishCircle,{passive:false});
  stage.addEventListener('pointercancel',finishCircle,{passive:false});

  if(!(await countdown('MAGIC',runId)))return;

  spawnVillagers();
  startTime=performance.now();
  lastSpawn=startTime-700;
  nextCitizenShot=startTime+rand(1300,2200);

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const elapsed=now-startTime;
    const remaining=10000-elapsed;
    const progress=clamp(elapsed/10000,0,1);

    timeEl.textContent=(Math.max(0,remaining)/1000).toFixed(1);

    const spawnEvery=650-progress*355;

    if(now-lastSpawn>=spawnEvery&&flames.filter(f=>!f.dead).length<13){
      spawnFlame(now,progress);

      if(progress>.30&&Math.random()<(.30+progress*.28)){
        spawnFlame(now+1,progress);
      }

      if(progress>.68&&Math.random()<.28){
        spawnFlame(now+2,progress);
      }
    }

    for(const v of villagers){
      v.x+=v.speed*.016;
      if(v.x<28||v.x>sw-28)v.speed*=-1;

      v.phase+=.13;
      v.el.style.left=`${v.x}px`;
      v.el.style.transform=
        `translate(-50%,-50%) translateY(${Math.sin(v.phase)*4}px) scaleX(${v.speed<0?-1:1})`;
    }

    if(now>=nextCitizenShot){
      citizenEnergyShot(now);
    }

    for(const f of flames){
      if(f.dead)continue;

      const slowFactor=now<f.slowUntil?.87:1;
      f.y+=f.vy*.016*slowFactor;
      f.x+=f.drift*.016*slowFactor;

      f.el.style.left=`${f.x}px`;
      f.el.style.top=`${f.y}px`;

      for(const v of villagers){
        if(Math.hypot(f.x-v.x,f.y-v.y)<f.size*.42+18){
          failGame();
          return;
        }
      }

      if(f.y>sh+45){
        removeFlame(f,false);
      }
    }

    if(remaining<=0){
      finished=true;
      state.records.wizardMob[p.id]=kills;
      message.textContent='町を守り切った！';
      beep(1040,130,.035);

      setTimeout(()=>{
        if(isGameRunValid(runId)){
          recordScreen(
            39,p,humanIndex,
            `${kills}<small>個</small>`,
            `10 SECOND DISPEL`
          );
        }
      },700);
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 41 -------------------------------------------------
async function startBrawlerMob(p,humanIndex,runId){
  gameFit();

  const TARGET_KO=30;
  const NORMAL_TOTAL=27;
  const worldW=1780;
  const fieldMinX=105;
  const fieldMaxX=worldW-105;

  let finished=false;
  let kills=0;
  let normalSpawned=0;
  let bossesSpawned=false;
  let specialReady=false;
  let specialUsed=false;

  let playerX=worldW*.50;
  let moveDir=0;
  let facing=1;
  let raf=null;
  let last=0;
  let startTime=0;
  let lastWave=0;
  let enemyId=0;
  let punchReady=true;
  let knockVelocity=0;
  let knockUntil=0;

  const enemies=[];

  screen.innerHTML=`<div class="brawler-shell brawler-v110">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは喧嘩番長</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="brawler-hud brawler-hud-v110">
      <div><span>TIME</span><b id="brawlerTime">0.00</b></div>
      <div><span>KO</span><b id="brawlerKills">0 / 30</b></div>
      <div><span>SPECIAL</span><b id="brawlerSpecialText">0 / 10</b></div>
    </div>

    <div id="brawlerStage" class="brawler-stage brawler-stage-v110">
      <div id="brawlerWorld" class="brawler-world" style="width:${worldW}px">
        <div class="school-wall">
          ${Array.from({length:6},(_,i)=>`
            <div class="school-window" style="left:${145+i*290}px"></div>
            <div class="school-door brawler-door-v110" data-door="${i}" style="left:${275+i*290}px">
              <span>CLASS</span>
              <i></i>
            </div>
          `).join('')}
          <div class="school-board b1">MOB HIGH SCHOOL</div>
          <div class="school-board b2">30 KO TIME ATTACK</div>
        </div>

        <div class="school-floor"></div>

        <div class="brawler-boundary left"><b>LIMIT</b></div>
        <div class="brawler-boundary right"><b>LIMIT</b></div>

        <div id="brawlerEnemies"></div>

        <div id="brawlerPlayer" class="brawler-player">
          <div class="brawler-player-figure" style="background-image:url('icon/01.png')"></div>
          <div class="brawler-fist"></div>
        </div>

        <div id="brawlerAllyA" class="brawler-ally ally-a">
          <div class="brawler-ally-figure" style="background-image:url('icon/02.png')"></div>
          <i class="brawler-ally-fist"></i>
        </div>

        <div id="brawlerAllyB" class="brawler-ally ally-b">
          <div class="brawler-ally-figure" style="background-image:url('icon/03.png')"></div>
          <i class="brawler-ally-fist"></i>
        </div>
      </div>

      <div id="brawlerMassFx" class="brawler-mass-fx"></div>
      <div id="brawlerUltimateFx" class="brawler-ultimate-fx">
        <i class="ring r1"></i><i class="ring r2"></i><i class="ring r3"></i>
        <i class="slash s1"></i><i class="slash s2"></i><i class="slash s3"></i><i class="slash s4"></i>
        <b id="brawlerUltimateText"></b>
      </div>

      <div id="brawlerImpact" class="brawler-impact"></div>
      <div id="brawlerEntryCall" class="brawler-entry-call"></div>
      <div id="brawlerPlayerHitFx" class="brawler-player-hit-fx">BAM!</div>
    </div>

    <div class="brawler-controls">
      <button id="brawlerLeft" type="button">←</button>
      <button id="brawlerPunch" class="punch" type="button">PUNCH</button>
      <button id="brawlerSpecial" class="special" type="button" disabled>必殺<br>PUNCH</button>
      <button id="brawlerRight" type="button">→</button>
    </div>
  </div>`;

  const stage=document.getElementById('brawlerStage');
  const world=document.getElementById('brawlerWorld');
  const player=document.getElementById('brawlerPlayer');
  const allyEls=[
    document.getElementById('brawlerAllyA'),
    document.getElementById('brawlerAllyB')
  ];
  const enemyLayer=document.getElementById('brawlerEnemies');
  const timeEl=document.getElementById('brawlerTime');
  const killsEl=document.getElementById('brawlerKills');
  const specialEl=document.getElementById('brawlerSpecial');
  const specialText=document.getElementById('brawlerSpecialText');
  const massFx=document.getElementById('brawlerMassFx');
  const ultimateFx=document.getElementById('brawlerUltimateFx');
  const ultimateText=document.getElementById('brawlerUltimateText');
  const impact=document.getElementById('brawlerImpact');
  const entryCall=document.getElementById('brawlerEntryCall');
  const playerHitFx=document.getElementById('brawlerPlayerHitFx');
  const left=document.getElementById('brawlerLeft');
  const right=document.getElementById('brawlerRight');
  const punch=document.getElementById('brawlerPunch');
  const doorEls=[...world.querySelectorAll('.school-door')];

  player.style.left=`${playerX}px`;

  const allies=[
    {
      el:allyEls[0],
      x:worldW*.31,
      home:worldW*.31,
      speed:300,
      cd:720,
      lastAttack:0,
      phase:.7
    },
    {
      el:allyEls[1],
      x:worldW*.69,
      home:worldW*.69,
      speed:285,
      cd:820,
      lastAttack:0,
      phase:2.3
    }
  ];

  allies.forEach(a=>{
    a.el.style.left=`${a.x}px`;
  });

  function bindHold(btn,dir){
    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();
      moveDir=dir;
      facing=dir;
      player.classList.toggle('face-left',facing<0);

      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    },{passive:false});

    const stop=()=>{
      if(moveDir===dir)moveDir=0;
    };

    btn.addEventListener('pointerup',stop);
    btn.addEventListener('pointercancel',stop);
    btn.addEventListener('lostpointercapture',stop);
  }

  bindHold(left,-1);
  bindHold(right,1);

  function updateSpecial(){
    if(!specialUsed&&kills>=10){
      specialReady=true;
    }

    specialEl.disabled=specialUsed||!specialReady;
    specialEl.classList.toggle('ready',!specialUsed&&specialReady);
    specialEl.classList.toggle('used',specialUsed);

    specialText.textContent=
      specialUsed
        ? 'USED'
        : specialReady
          ? 'READY ×1'
          : `${Math.min(10,kills)} / 10`;
  }

  function showEntry(text){
    entryCall.textContent=text;
    entryCall.classList.remove('show');
    void entryCall.offsetWidth;
    entryCall.classList.add('show');
  }

  function popImpact(text,x=stage.clientWidth*.5){
    impact.textContent=text;
    impact.style.left=`${clamp(x,60,stage.clientWidth-60)}px`;

    impact.classList.remove('show');
    void impact.offsetWidth;
    impact.classList.add('show');
  }

  function showMassFx(count){
    if(count<=1)return;

    massFx.innerHTML=`
      <i class="mring m1"></i>
      <i class="mring m2"></i>
      <i class="speed l1"></i>
      <i class="speed l2"></i>
      <i class="speed l3"></i>
      <b>${count>=5?`MULTI ×${count}!`:`${count} HIT!`}</b>
    `;

    massFx.classList.remove('show');
    void massFx.offsetWidth;
    massFx.classList.add('show');

    stage.classList.remove('brawler-mass-shake');
    void stage.offsetWidth;
    stage.classList.add('brawler-mass-shake');
  }

  function showUltimateFx(count){
    ultimateText.textContent=`ULTIMATE ${count} HIT!!`;

    ultimateFx.classList.remove('show');
    void ultimateFx.offsetWidth;
    ultimateFx.classList.add('show');

    stage.classList.remove('brawler-ultimate-shake');
    void stage.offsetWidth;
    stage.classList.add('brawler-ultimate-shake');

    showEntry('一撃必殺・全方位ぶっ飛ばし！！');
  }

  function openDoorNear(x){
    const idx=clamp(
      Math.round((x-275)/290),
      0,
      doorEls.length-1
    );

    const door=doorEls[idx];

    if(door){
      door.classList.remove('open');
      void door.offsetWidth;
      door.classList.add('open');
    }
  }

  function createEnemy({
    boss=false,
    source='door',
    x=null
  }={}){
    const now=performance.now();

    if(x===null){
      if(source==='door'){
        const doorIndex=randi(0,doorEls.length-1);
        x=275+doorIndex*290+rand(-18,18);
        openDoorNear(x);
      }else{
        x=rand(fieldMinX+90,fieldMaxX-90);
      }
    }

    const el=document.createElement('div');
    el.className='brawler-enemy';

    if(boss)el.classList.add('class-boss');
    if(source==='door')el.classList.add('door-in');

    el.style.backgroundImage=
      `url('icon/${String(randi(1,10)).padStart(2,'0')}.png')`;

    const size=
      boss
        ? rand(104,124)
        : (
            Math.random()<.16
              ? rand(82,98)
              : rand(52,74)
          );

    const hp=boss?10:1;

    const enemy={
      id:++enemyId,
      el,
      x,
      y:64,
      width:size,
      hp,
      maxHp:hp,
      boss,
      dead:false,
      entryLock:now+(boss?500:250),
      speed:boss?rand(92,110):rand(112,148),
      lastAttack:0,
      nextAttack:now+rand(900,1800)
    };

    el.style.width=`${size}px`;
    el.style.height=`${size*1.08}px`;
    el.style.left=`${x}px`;
    el.style.bottom=`${enemy.y}px`;

    if(boss){
      el.innerHTML=`
        <span class="brawler-boss-title">他のクラスの番長</span>
        <span class="brawler-boss-hp">10 / 10</span>
      `;
    }

    enemyLayer.appendChild(el);
    enemies.push(enemy);

    return enemy;
  }

  function spawnNormalWave(now){
    if(normalSpawned>=NORMAL_TOTAL)return;

    const remaining=NORMAL_TOTAL-normalSpawned;
    const count=Math.min(remaining,randi(5,10));

    for(let i=0;i<count;i++){
      // Door entry is the basic pattern.
      const source='door';
      createEnemy({boss:false,source});
      normalSpawned++;
    }

    lastWave=now;
    showEntry(`${count}人！ 教室から来るぞ！`);
  }

  function spawnBosses(){
    if(bossesSpawned)return;

    bossesSpawned=true;

    const bossDoorIndexes=[1,3,4];
    const bossXs=bossDoorIndexes.map(i=>275+i*290);

    bossXs.forEach((x,i)=>{
      setTimeout(()=>{
        if(!isGameRunValid(runId)||finished)return;

        const e=createEnemy({
          boss:true,
          source:'door',
          x
        });

        openDoorNear(x);
        e.entryLock=performance.now()+500;
      },i*180);
    });

    showEntry('FINAL 3 / 他のクラスの番長！！');
    beep(510,150,.035);
  }

  function updateBossHp(enemy){
    if(!enemy.boss)return;

    const hpEl=enemy.el.querySelector('.brawler-boss-hp');

    if(hpEl){
      hpEl.textContent=
        `${Math.max(0,enemy.hp)} / ${enemy.maxHp}`;
    }
  }

  function hitEnemy(enemy,dir,{
    ultimate=false,
    fanIndex=0
  }={}){
    if(enemy.dead)return;

    if(ultimate){
      enemy.hp=0;
    }else{
      enemy.hp--;
    }

    updateBossHp(enemy);

    if(enemy.hp>0){
      enemy.el.classList.remove('boss-hurt');
      void enemy.el.offsetWidth;
      enemy.el.classList.add('boss-hurt');

      enemy.el.style.setProperty(
        '--hurt-dir',
        dir
      );

      popImpact(
        enemy.boss
          ? `${enemy.hp} HIT 残り`
          : 'HIT!'
      );

      beep(enemy.boss?260:220,28,.008);
      return;
    }

    defeatEnemy(
      enemy,
      dir,
      ultimate,
      fanIndex
    );
  }

  function defeatEnemy(enemy,dir,ultimate=false,fanIndex=0){
    if(enemy.dead)return;

    enemy.dead=true;
    kills++;
    killsEl.textContent=`${kills} / ${TARGET_KO}`;

    const arcRoll=(Math.random()+fanIndex*.121)%1;

    let flyX;
    let flyY;
    let spin;

    if(ultimate){
      const xSign=fanIndex%2===0?-1:1;
      const ySign=fanIndex%4<2?-1:1;

      flyX=xSign*rand(520,860);
      flyY=ySign*rand(250,540);
      spin=(fanIndex%2===0?-1:1)*rand(1800,3100);

    }else{
      flyX=dir*rand(285,470);
      flyY=
        arcRoll<.38
          ? rand(-300,-205)
          : arcRoll<.76
            ? rand(-215,-125)
            : rand(-135,-62);

      spin=dir*rand(800,1450);
    }

    enemy.el.style.setProperty('--fly-x',`${flyX}px`);
    enemy.el.style.setProperty('--fly-y',`${flyY}px`);
    enemy.el.style.setProperty('--fly-spin',`${spin}deg`);

    enemy.el.classList.add(
      ultimate
        ? 'ultimate-hit'
        : 'hit'
    );

    setTimeout(()=>enemy.el.remove(),ultimate?860:610);

    updateSpecial();

    if(kills>=TARGET_KO){
      finishClear();
    }
  }

  function playerKnockback(enemy){
    if(finished)return;

    const dir=playerX<enemy.x?-1:1;

    knockVelocity=dir*(enemy.boss?520:365);
    knockUntil=performance.now()+(enemy.boss?270:215);

    player.classList.remove('enemy-hit');
    void player.offsetWidth;
    player.classList.add('enemy-hit');

    playerHitFx.style.left=`${stage.clientWidth*.50}px`;
    playerHitFx.classList.remove('show');
    void playerHitFx.offsetWidth;
    playerHitFx.classList.add('show');

    beep(enemy.boss?145:180,55,.02);
  }

  function enemyAttack(enemy,now){
    if(enemy.dead||now<enemy.entryLock)return;
    if(now<enemy.nextAttack)return;
    if(Math.abs(enemy.x-playerX)>82)return;

    enemy.nextAttack=now+rand(
      enemy.boss?780:1100,
      enemy.boss?1250:1900
    );

    enemy.el.classList.remove('enemy-attacking');
    void enemy.el.offsetWidth;
    enemy.el.classList.add('enemy-attacking');

    setTimeout(()=>{
      if(
        !enemy.dead&&
        !finished&&
        isGameRunValid(runId)&&
        Math.abs(enemy.x-playerX)<102
      ){
        playerKnockback(enemy);
      }
    },125);
  }

  function updateAllies(now,dt){
    allies.forEach((ally,index)=>{
      ally.phase+=dt*(4.1+index*.35);

      const target=enemies
        .filter(e=>!e.dead)
        .map(e=>({
          e,
          d:Math.abs(e.x-ally.x),
          bossPenalty:e.boss?85:0
        }))
        .sort((a,b)=>
          (a.d+a.bossPenalty)-
          (b.d+b.bossPenalty)
        )[0]?.e;

      let desired=
        ally.home+
        Math.sin(ally.phase)*95;

      if(target&&Math.abs(target.x-ally.x)<360){
        desired=
          target.x+
          (target.x<ally.x?48:-48);
      }

      ally.x+=clamp(
        clamp(desired,fieldMinX,fieldMaxX)-ally.x,
        -ally.speed*dt,
        ally.speed*dt
      );

      const dir=
        target
          ? target.x<ally.x?-1:1
          : 1;

      ally.el.style.left=`${ally.x}px`;
      ally.el.classList.toggle('face-left',dir<0);

      if(
        target&&
        Math.abs(target.x-ally.x)<=165&&
        now-ally.lastAttack>=ally.cd
      ){
        ally.lastAttack=now;

        ally.el.classList.remove('attacking');
        void ally.el.offsetWidth;
        ally.el.classList.add('attacking');

        hitEnemy(
          target,
          target.x<ally.x?-1:1,
          {ultimate:false,fanIndex:index+3}
        );
      }
    });
  }

  function doPunch(){
    if(
      finished||
      !punchReady||
      !isGameRunValid(runId)
    )return;

    punchReady=false;

    player.classList.remove('punching');
    void player.offsetWidth;
    player.classList.add('punching');

    const candidates=enemies
      .filter(e=>!e.dead)
      .map(e=>({
        e,
        dx:(e.x-playerX)*facing,
        distance:Math.abs(e.x-playerX)
      }))
      .filter(o=>o.dx>=-48&&o.dx<=285)
      .sort((a,b)=>a.distance-b.distance);

    const victims=candidates.slice(0,7);

    if(victims.length){
      victims.forEach((o,i)=>{
        setTimeout(()=>{
          if(!o.e.dead){
            hitEnemy(
              o.e,
              facing,
              {ultimate:false,fanIndex:i}
            );
          }
        },i*14);
      });

      showMassFx(victims.length);

      popImpact(
        victims.length>=5
          ? `BAM ×${victims.length}!`
          : victims.length>=2
            ? `BAM ×${victims.length}`
            : 'BAM!'
      );

      beep(victims.length>=5?345:235,45,.016);
    }else{
      beep(145,25,.006);
    }

    setTimeout(()=>{
      punchReady=true;
    },135);
  }

  punch.addEventListener('pointerdown',e=>{
    e.preventDefault();
    doPunch();
  },{passive:false});

  specialEl.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(
      finished||
      specialUsed||
      !specialReady||
      !isGameRunValid(runId)
    )return;

    specialUsed=true;
    specialReady=false;
    updateSpecial();

    player.classList.remove('special-punching');
    void player.offsetWidth;
    player.classList.add('special-punching');

    const victims=enemies.filter(e=>!e.dead);

    showUltimateFx(victims.length);

    victims.forEach((enemy,i)=>{
      setTimeout(()=>{
        if(!enemy.dead){
          hitEnemy(
            enemy,
            enemy.x<playerX?-1:1,
            {ultimate:true,fanIndex:i}
          );
        }
      },Math.min(210,i*4));
    });

    popImpact(
      victims.length
        ? `最強必殺 ${victims.length} HIT!!`
        : 'ULTIMATE!'
    );

    beep(760,180,.05);
  },{passive:false});

  function finishClear(){
    if(finished)return;

    finished=true;

    const elapsedMs=Math.max(
      1,
      Math.round(performance.now()-startTime)
    );

    state.records.brawlerMob[p.id]=elapsedMs;

    timeEl.textContent=(elapsedMs/1000).toFixed(2);
    killsEl.textContent='30 / 30';

    showEntry(`30 KO CLEAR / ${(elapsedMs/1000).toFixed(2)}秒`);
    popImpact('CLEAR!!');

    beep(1080,160,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          40,p,humanIndex,
          `${(elapsedMs/1000).toFixed(2)}<small>秒</small>`,
          `30 KO CLEAR`
        );
      }
    },850);
  }

  if(!(await countdown('BRAWLER',runId)))return;

  startTime=performance.now();
  last=startTime;
  lastWave=startTime-1000;

  spawnNormalWave(startTime);

  showEntry('30人を最速で倒せ！');

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(32,now-last)/1000;
    last=now;

    const elapsed=now-startTime;
    timeEl.textContent=(elapsed/1000).toFixed(2);

    const knockMove=
      now<knockUntil
        ? knockVelocity
        : 0;

    if(now>=knockUntil){
      knockVelocity=0;
    }

    playerX=clamp(
      playerX+(moveDir*292+knockMove)*dt,
      fieldMinX,
      fieldMaxX
    );

    player.style.left=`${playerX}px`;

    updateAllies(now,dt);

    const activeNormals=enemies.filter(
      e=>!e.dead&&!e.boss
    ).length;

    if(
      normalSpawned<NORMAL_TOTAL&&
      activeNormals<=4&&
      now-lastWave>=520
    ){
      spawnNormalWave(now);
    }

    if(
      !bossesSpawned&&
      normalSpawned>=NORMAL_TOTAL&&
      activeNormals===0&&
      kills>=NORMAL_TOTAL
    ){
      spawnBosses();
    }

    for(const enemy of enemies){
      if(enemy.dead)continue;
      if(now<enemy.entryLock)continue;

      const dx=playerX-enemy.x;
      const dir=Math.sign(dx)||1;

      if(Math.abs(dx)>54){
        enemy.x+=dir*enemy.speed*dt;
      }

      enemy.x=clamp(
        enemy.x,
        fieldMinX+18,
        fieldMaxX-18
      );

      enemy.el.style.left=`${enemy.x}px`;
      enemy.el.style.setProperty('--enemy-face',dir);

      enemyAttack(enemy,now);
    }

    const cam=clamp(
      playerX-stage.clientWidth*.44,
      0,
      worldW-stage.clientWidth
    );

    world.style.transform=`translateX(${-cam}px)`;

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 42 -------------------------------------------------
const SUMMON_ATTACKS_V108=[
  {id:'right_hook',name:'右腕フック',role:'part',part:'handR',reach:165,hits:4,cd:410,move:'hook'},
  {id:'double_claw',name:'ダブルクロー',role:'part',part:'hands',reach:185,hits:6,cd:520,move:'claw'},
  {id:'headbutt',name:'ヘッドバット',role:'part',part:'head',reach:155,hits:5,cd:480,move:'head'},
  {id:'front_kick',name:'フロントキック',role:'part',part:'footR',reach:195,hits:5,cd:500,move:'kick'},
  {id:'sweep',name:'足払い',role:'part',part:'feet',reach:225,hits:7,cd:640,move:'sweep'},
  {id:'tail_whip',name:'テイルウィップ',role:'part',part:'tail',reach:245,hits:8,cd:650,move:'tail'},
  {id:'weapon_slash',name:'ウェポンスラッシュ',role:'part',part:'weapon',reach:270,hits:9,cd:670,move:'weapon'},
  {id:'detached_rush',name:'離れ部位ラッシュ',role:'part',part:'detached',reach:255,hits:9,cd:690,move:'detached'},

  {id:'jump_slam',name:'ジャンプスラム',role:'mobility',part:'feet',reach:255,hits:10,cd:790,move:'slam'},
  {id:'speed_dash',name:'高速ダッシュ',role:'mobility',part:'body',reach:300,hits:10,cd:690,move:'dash'},
  {id:'clone_rush',name:'瞬間分身ラッシュ',role:'mobility',part:'body',reach:300,hits:11,cd:740,move:'clone'},
  {id:'teleport_strike',name:'瞬間移動アタック',role:'mobility',part:'body',reach:285,hits:10,cd:730,move:'teleport'},
  {id:'spin_attack',name:'高速スピン',role:'mobility',part:'body',reach:245,hits:11,cd:700,move:'spin'},

  {id:'planet_energy',name:'超巨大エネルギー',role:'sweep',part:'body',reach:999,hits:22,cd:1150,move:'planet'},
  {id:'fire_breath',name:'超火炎ブレス',role:'sweep',part:'head',reach:999,hits:18,cd:980,move:'fire'},
  {id:'thunder_storm',name:'サンダーストーム',role:'sweep',part:'detached',reach:999,hits:18,cd:1050,move:'thunder'},
  {id:'energy_wave',name:'エネルギー大波',role:'sweep',part:'hands',reach:999,hits:20,cd:1020,move:'energyWave'},
  {id:'laser_sweep',name:'極太レーザー',role:'sweep',part:'weapon',reach:999,hits:19,cd:1000,move:'laser'},
  {id:'meteor_rain',name:'メテオレイン',role:'sweep',part:'detached',reach:999,hits:20,cd:1100,move:'meteor'},
  {id:'tornado',name:'巨大竜巻',role:'sweep',part:'tail',reach:999,hits:18,cd:1040,move:'tornado'},
  {id:'ice_nova',name:'アイスノヴァ',role:'sweep',part:'feet',reach:999,hits:18,cd:1060,move:'iceNova'},
  {id:'dark_sun',name:'ダークサン',role:'sweep',part:'body',reach:999,hits:21,cd:1120,move:'darkSun'},
  {id:'star_burst',name:'スターバースト',role:'sweep',part:'head',reach:999,hits:20,cd:1080,move:'starBurst'}
];

function summonStrokeStatsV107(stroke){
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,len=0;

  stroke.forEach((p,i)=>{
    minX=Math.min(minX,p.x);
    minY=Math.min(minY,p.y);
    maxX=Math.max(maxX,p.x);
    maxY=Math.max(maxY,p.y);

    if(i){
      len+=Math.hypot(
        p.x-stroke[i-1].x,
        p.y-stroke[i-1].y
      );
    }
  });

  return {
    minX,minY,maxX,maxY,
    w:Math.max(1,maxX-minX),
    h:Math.max(1,maxY-minY),
    cx:(minX+maxX)/2,
    cy:(minY+maxY)/2,
    len
  };
}

function analyzeSummonedMonsterV107(strokes,zoneW,zoneH){
  const valid=strokes.filter(s=>s.length>=2);
  const flat=valid.flat();

  if(flat.length<6){
    return {
      power:.43,
      speed:.50,
      range:.46,
      complexity:.18,
      turnDensity:.15,
      aspect:1,
      sizeNorm:.20,
      minX:zoneW*.40,
      minY:zoneH*.38,
      maxX:zoneW*.60,
      maxY:zoneH*.62,
      width:zoneW*.20,
      height:zoneH*.24,
      label:'ちいさな落書き獣',
      parts:{
        body:[],head:[],
        handL:[],handR:[],
        footL:[],footR:[],
        tail:[],weapon:[],detached:[]
      }
    };
  }

  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  let pathLen=0,totalTurn=0,turnCount=0;

  const stats=valid.map((stroke,index)=>{
    const s=summonStrokeStatsV107(stroke);

    minX=Math.min(minX,s.minX);
    minY=Math.min(minY,s.minY);
    maxX=Math.max(maxX,s.maxX);
    maxY=Math.max(maxY,s.maxY);
    pathLen+=s.len;

    for(let i=2;i<stroke.length;i++){
      const a1=Math.atan2(
        stroke[i-1].y-stroke[i-2].y,
        stroke[i-1].x-stroke[i-2].x
      );
      const a2=Math.atan2(
        stroke[i].y-stroke[i-1].y,
        stroke[i].x-stroke[i-1].x
      );

      let d=Math.abs(a2-a1);
      while(d>Math.PI)d=Math.abs(d-Math.PI*2);

      totalTurn+=d;
      turnCount++;
    }

    return {...s,index};
  });

  const bw=Math.max(12,maxX-minX);
  const bh=Math.max(12,maxY-minY);
  const aspect=bw/bh;
  const boxArea=bw*bh;
  const sizeNorm=clamp(
    Math.sqrt(boxArea/(zoneW*zoneH))/.78,
    0,1
  );

  const complexity=clamp(
    (pathLen/(2*(bw+bh)+1)-.55)/4.1,
    0,1
  );

  const turnDensity=
    turnCount
      ? clamp(totalTurn/turnCount/.90,0,1)
      : 0;

  const sizeBalance=clamp(
    1-Math.abs(sizeNorm-.55)/.58,
    0,1
  );

  const parts={
    body:[],
    head:[],
    handL:[],
    handR:[],
    footL:[],
    footR:[],
    tail:[],
    weapon:[],
    detached:[]
  };

  const centerX=(minX+maxX)/2;
  const centerY=(minY+maxY)/2;

  const longest=[...stats].sort((a,b)=>b.len-a.len)[0];
  if(longest)parts.body.push(longest.index);

  for(const s of stats){
    if(longest&&s.index===longest.index)continue;

    const nx=(s.cx-minX)/bw;
    const ny=(s.cy-minY)/bh;
    const thin=Math.max(s.w,s.h)/(Math.min(s.w,s.h)+4);
    const distFromCenter=
      Math.hypot(
        (s.cx-centerX)/bw,
        (s.cy-centerY)/bh
      );

    if(distFromCenter>.58&&s.len<Math.max(bw,bh)*.78){
      parts.detached.push(s.index);
      continue;
    }

    if(ny<.30){
      parts.head.push(s.index);
      continue;
    }

    if(ny>.72){
      if(nx<.50)parts.footL.push(s.index);
      else parts.footR.push(s.index);
      continue;
    }

    if(nx<.22){
      if(s.len>bw*.55)parts.tail.push(s.index);
      else parts.handL.push(s.index);
      continue;
    }

    if(nx>.78){
      if(thin>2.25&&s.len>bh*.35)parts.weapon.push(s.index);
      else parts.handR.push(s.index);
      continue;
    }

    if(thin>3.2&&nx>.58){
      parts.weapon.push(s.index);
      continue;
    }

    parts.body.push(s.index);
  }

  const byPos=[...stats].sort((a,b)=>a.cx-b.cx);
  const byY=[...stats].sort((a,b)=>a.cy-b.cy);

  if(!parts.head.length&&byY.length)parts.head.push(byY[0].index);
  if(!parts.footL.length&&byY.length)parts.footL.push(byY[byY.length-1].index);
  if(!parts.handL.length&&byPos.length)parts.handL.push(byPos[0].index);
  if(!parts.handR.length&&byPos.length)parts.handR.push(byPos[byPos.length-1].index);

  const power=clamp(
    .42+
    sizeBalance*.18+
    complexity*.18+
    turnDensity*.14+
    clamp(valid.length/7,0,1)*.08,
    .38,1
  );

  const speed=clamp(
    .45+
    complexity*.22+
    turnDensity*.18+
    (1-sizeNorm)*.12,
    .38,1
  );

  const range=clamp(
    .42+
    Math.min(1,Math.max(aspect,1/aspect)/2.1)*.18+
    sizeBalance*.14+
    (
      parts.tail.length+
      parts.weapon.length+
      parts.detached.length
    )*.035,
    .38,1
  );

  const labels=[];
  if(parts.weapon.length)labels.push('武器');
  if(parts.tail.length)labels.push('尻尾');
  if(parts.detached.length)labels.push('離れ部位');
  if(parts.footL.length||parts.footR.length)labels.push('脚');
  if(parts.handL.length||parts.handR.length)labels.push('腕');
  if(parts.head.length)labels.push('頭');

  return {
    power,speed,range,
    complexity,turnDensity,
    aspect,sizeNorm,
    minX,minY,maxX,maxY,
    width:bw,height:bh,
    label:labels.length
      ? labels.slice(0,3).join('・')+'型'
      : '不思議型',
    parts
  };
}

function summonHasPartV107(a,part){
  if(part==='hands'){
    return a.parts.handL.length||a.parts.handR.length;
  }

  if(part==='feet'){
    return a.parts.footL.length||a.parts.footR.length;
  }

  return (a.parts[part]||[]).length>0;
}

function summonAttackAffinityV107(atk,a){
  let score=Math.random()*.30;

  if(summonHasPartV107(a,atk.part))score+=.70;
  else score+=.08;

  if(atk.role==='part'){
    score+=a.power*.16;
    score+=a.speed*.10;
  }else if(atk.role==='mobility'){
    score+=a.speed*.21;
    score+=a.complexity*.13;
  }else{
    // Cinematic clearing attacks are always viable;
    // drawing shape only biases WHICH one is selected.
    score+=.22+a.range*.10;
    score+=a.turnDensity*.07;
  }

  if(atk.part==='weapon')score+=a.parts.weapon.length*.11;
  if(atk.part==='tail')score+=a.parts.tail.length*.11;
  if(atk.part==='detached')score+=a.parts.detached.length*.12;
  if(atk.part==='feet')score+=a.speed*.10;
  if(atk.part==='head')score+=(1-a.complexity)*.05;

  return score;
}

function chooseSummonAttacksV107(a){
  function pickRole(role){
    const pool=SUMMON_ATTACKS_V108
      .filter(atk=>atk.role===role)
      .map(atk=>({
        atk,
        score:summonAttackAffinityV107(atk,a)
      }))
      .sort((x,y)=>y.score-x.score)
      .slice(0,Math.min(6,SUMMON_ATTACKS_V108.filter(v=>v.role===role).length));

    // Random from the compatible top candidates.
    return pool[randi(0,pool.length-1)].atk;
  }

  return [
    pickRole('part'),
    pickRole('mobility'),
    pickRole('sweep')
  ];
}

async function startSummonerMob(p,humanIndex,runId){
  gameFit();

  let drawingOpen=false;
  let drawing=false;
  let pointerId=null;
  let currentStroke=null;
  let drawRAF=null;
  let battleRAF=null;
  let finished=false;
  let kills=0;
  let lastSpawn=0;
  let lastAttack=0;
  let slimeId=0;
  let startBattle=0;
  let facing=1;

  const strokes=[];
  const slimes=[];

  screen.innerHTML=`<div class="summoner-shell summoner-v107">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは召喚師</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="summoner-hud">
      <div><span>TIME</span><b id="summonTime">7.0</b></div>
      <div><span>TYPE</span><b id="summonType">???</b></div>
      <div><span>KO</span><b id="summonKills">0</b></div>
    </div>

    <div id="summonerStage" class="summoner-stage summoner-arena-v107">
      <div class="summoner-arena-bg">
        <div class="summon-gate left"></div>
        <div class="summon-gate right"></div>
        <div class="summon-ground-v107"></div>
      </div>

      <div id="summonSlimes"></div>

      <div id="summonMonster" class="summon-monster-v107 hidden">
        <svg id="summonMonsterSvg"></svg>
      </div>

      <svg id="summonDrawSvg" class="summon-draw-svg-v107"></svg>

      <div id="summonAttackFx" class="summon-attack-fx-v107"></div>
      <div id="summonHitPop" class="summon-hit-pop-v109"></div>
      <div id="summonSkillList" class="summon-skill-list-v107 hidden"></div>

      <div id="summonCaster" class="summoner-caster-v107" style="background-image:url('icon/01.png')"></div>
      <div id="summonMessage" class="summon-message">7秒で自由に描け！</div>
    </div>
  </div>`;

  const stage=document.getElementById('summonerStage');
  const drawSvg=document.getElementById('summonDrawSvg');
  const monster=document.getElementById('summonMonster');
  const monsterSvg=document.getElementById('summonMonsterSvg');
  const slimeLayer=document.getElementById('summonSlimes');
  const attackFx=document.getElementById('summonAttackFx');
  const hitPop=document.getElementById('summonHitPop');
  const skillList=document.getElementById('summonSkillList');
  const caster=document.getElementById('summonCaster');
  const timeEl=document.getElementById('summonTime');
  const typeEl=document.getElementById('summonType');
  const killsEl=document.getElementById('summonKills');
  const message=document.getElementById('summonMessage');

  const sw=stage.clientWidth;
  const sh=stage.clientHeight;
  const groundY=54;

  const zoneW=Math.min(sw*.96,430);
  const zoneH=Math.min(sh*.82,390);
  const zoneX=(sw-zoneW)/2;
  const zoneY=Math.max(8,(sh-zoneH)/2-2);

  drawSvg.style.left=`${zoneX}px`;
  drawSvg.style.top=`${zoneY}px`;
  drawSvg.style.width=`${zoneW}px`;
  drawSvg.style.height=`${zoneH}px`;
  drawSvg.setAttribute('viewBox',`0 0 ${zoneW} ${zoneH}`);

  function localPoint(e){
    const r=drawSvg.getBoundingClientRect();

    return {
      x:clamp(e.clientX-r.left,2,zoneW-2),
      y:clamp(e.clientY-r.top,2,zoneH-2)
    };
  }

  function createStrokeElement(){
    const el=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );

    el.setAttribute('class','summon-user-stroke');
    drawSvg.appendChild(el);
    return el;
  }

  drawSvg.addEventListener('pointerdown',e=>{
    if(
      !drawingOpen||
      finished||
      drawing||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    drawing=true;
    pointerId=e.pointerId;

    currentStroke={
      points:[localPoint(e)],
      el:createStrokeElement()
    };

    strokes.push(currentStroke.points);

    try{drawSvg.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  drawSvg.addEventListener('pointermove',e=>{
    if(
      !drawingOpen||
      !drawing||
      e.pointerId!==pointerId
    )return;

    e.preventDefault();

    const pt=localPoint(e);
    const prev=currentStroke.points[currentStroke.points.length-1];

    if(Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.1){
      currentStroke.points.push(pt);

      currentStroke.el.setAttribute(
        'points',
        currentStroke.points
          .map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`)
          .join(' ')
      );
    }
  },{passive:false});

  const endStroke=e=>{
    if(!drawing||e.pointerId!==pointerId)return;

    e.preventDefault();
    drawing=false;
    currentStroke=null;
  };

  drawSvg.addEventListener('pointerup',endStroke,{passive:false});
  drawSvg.addEventListener('pointercancel',endStroke,{passive:false});

  if(!(await countdown('SUMMON DRAW',runId)))return;

  drawingOpen=true;
  message.textContent='眼も含めて全部描け！';

  const drawStart=performance.now();

  await new Promise(resolve=>{
    const timer=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const rem=7000-(now-drawStart);
      timeEl.textContent=(Math.max(0,rem)/1000).toFixed(1);

      if(rem<=0){
        drawingOpen=false;
        drawing=false;
        resolve();
        return;
      }

      drawRAF=requestAnimationFrame(timer);
    };

    drawRAF=requestAnimationFrame(timer);
  });

  if(!isGameRunValid(runId))return;

  const analysis=analyzeSummonedMonsterV107(
    strokes,
    zoneW,
    zoneH
  );

  const learned=chooseSummonAttacksV107(analysis);

  typeEl.textContent=analysis.label;

  skillList.innerHTML=
    learned
      .map((a,i)=>`<span>${i+1}. ${a.name}</span>`)
      .join('');

  skillList.classList.remove('hidden');

  message.textContent=`召喚！ ${analysis.label}`;

  const battleW=Math.max(12,analysis.width);
  const battleH=Math.max(12,analysis.height);

  monster.style.width=`${battleW}px`;
  monster.style.height=`${battleH}px`;

  const monsterX=sw*.50;
  monster.style.left=`${monsterX}px`;
  monster.style.bottom=`${groundY}px`;

  const pad=5;

  monsterSvg.setAttribute(
    'viewBox',
    `${analysis.minX-pad} ${analysis.minY-pad} ${analysis.width+pad*2} ${analysis.height+pad*2}`
  );

  const reversePart={};

  Object.entries(analysis.parts).forEach(([part,indexes])=>{
    indexes.forEach(idx=>{
      if(reversePart[idx]===undefined)reversePart[idx]=part;
    });
  });

  const validStrokes=strokes.filter(s=>s.length>=2);

  monsterSvg.innerHTML=
    validStrokes.length
      ? validStrokes.map((stroke,i)=>{
          const part=reversePart[i]||'body';

          return `<g class="summon-part" data-part="${part}">
            <polyline
              class="summon-monster-stroke"
              points="${stroke.map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' ')}">
            </polyline>
          </g>`;
        }).join('')
      : `<g class="summon-part" data-part="body">
           <circle class="summon-monster-stroke" cx="50" cy="50" r="25"></circle>
         </g>`;

  drawSvg.classList.add('fade-out');

  await wait(440);

  if(!isGameRunValid(runId))return;

  // All drawing UI and the original drawing disappear now.
  drawSvg.remove();
  caster.remove();
  skillList.classList.add('hidden');

  stage.classList.add('battle');
  monster.classList.remove('hidden');

  timeEl.textContent='10.0';
  message.textContent='AUTO MUSOU 10 SEC!';

  function slimeSizePattern(progress){
    const r=Math.random();

    if(r<.14)return {kind:'tiny',size:rand(25,32)};
    if(r<.35)return {kind:'small',size:rand(35,43)};
    if(r<.67)return {kind:'normal',size:rand(47,58)};
    if(r<.88)return {kind:'large',size:rand(64,78)};

    return {
      kind:'giant',
      size:rand(88,108)+progress*5
    };
  }

  function spawnSlime(now,progress,forcedSide=null){
    if(slimes.filter(s=>!s.dead).length>=88)return;

    const side=
      forcedSide??
      (Math.random()<.5?-1:1);

    const pat=slimeSizePattern(progress);

    const el=document.createElement('div');
    el.className=`summon-slime-v107 ${pat.kind}`;

    el.style.width=`${pat.size}px`;
    el.style.height=`${pat.size*.72}px`;

    const s={
      id:++slimeId,
      el,
      x:
        side<0
          ? -pat.size*.8
          : sw+pat.size*.8,
      y:groundY+randi(-2,10),
      speed:
        (
          pat.kind==='giant'?rand(65,82):
          pat.kind==='large'?rand(84,108):
          pat.kind==='tiny'?rand(125,158):
          rand(100,138)
        )+
        progress*72,
      dead:false,
      kind:pat.kind,
      size:pat.size
    };

    el.style.left=`${s.x}px`;
    el.style.bottom=`${s.y}px`;

    slimeLayer.appendChild(el);
    slimes.push(s);

    lastSpawn=now;
  }

  function defeatSlime(s,strong=false,dir=1){
    if(s.dead)return;

    s.dead=true;
    kills++;
    killsEl.textContent=kills;

    const sizeBoost=
      s.kind==='giant'?1.30:
      s.kind==='large'?1.15:
      s.kind==='tiny'?.82:
      1;

    s.el.style.setProperty(
      '--summon-fly-x',
      `${dir*(strong?rand(360,590):rand(230,390))*sizeBoost}px`
    );

    s.el.style.setProperty(
      '--summon-fly-y',
      `${strong?rand(-330,-185):rand(-235,-100)}px`
    );

    s.el.style.setProperty(
      '--summon-fly-spin',
      `${dir*rand(620,1120)}deg`
    );

    s.el.classList.add(strong?'blast':'defeated');

    setTimeout(()=>s.el.remove(),430);
  }

  function createGhost(offset,delay){
    const ghost=monster.cloneNode(true);
    ghost.removeAttribute('id');
    ghost.className='summon-monster-ghost-v107';

    ghost.style.width=monster.style.width;
    ghost.style.height=monster.style.height;
    ghost.style.left=`${monsterX+offset}px`;
    ghost.style.bottom=monster.style.bottom;
    ghost.style.animationDelay=`${delay}ms`;

    stage.appendChild(ghost);

    setTimeout(()=>ghost.remove(),360);
  }

  function showMusouHit(count,isSweep){
    if(count<=0)return;

    hitPop.textContent=
      isSweep
        ? `一掃 ×${count}!!`
        : `×${count}`;

    hitPop.classList.remove('show','sweep');
    void hitPop.offsetWidth;
    hitPop.classList.add('show');

    if(isSweep){
      hitPop.classList.add('sweep');

      stage.classList.remove('summon-musou-shake-v109');
      void stage.offsetWidth;
      stage.classList.add('summon-musou-shake-v109');
    }
  }

  function showAttackFx(atk,dir,targetX){
    attackFx.className=
      `summon-attack-fx-v107 move-${atk.move} ${dir<0?'left':'right'} show`;

    attackFx.style.setProperty(
      '--target-x',
      `${clamp(targetX,20,sw-20)}px`
    );

    attackFx.innerHTML=
      `<b>${atk.name}</b><i></i><em></em>`;

    if(atk.move==='clone'){
      createGhost(-52,0);
      createGhost(52,45);
    }

    setTimeout(()=>{
      attackFx.className='summon-attack-fx-v107';
      attackFx.innerHTML='';
    },360);
  }

  function clearAttackClasses(){
    [...monster.classList]
      .filter(c=>c.startsWith('summon-atk-'))
      .forEach(c=>monster.classList.remove(c));
  }

  function animateMonsterAttack(atk,dir){
    clearAttackClasses();

    facing=dir;
    monster.classList.toggle('face-left',dir<0);
    monster.classList.add(`summon-atk-${atk.move}`);

    if(
      ['dash','teleport','clone'].includes(atk.move)
    ){
      const shift=dir*clamp(70+analysis.speed*85,85,150);
      monster.style.setProperty('--summon-dash-x',`${shift}px`);
    }

    setTimeout(clearAttackClasses,350);
  }

  function useAttack(atk){
    const alive=slimes.filter(s=>!s.dead);
    if(!alive.length)return;

    const nearest=
      alive
        .map(s=>({
          s,
          d:Math.abs(s.x-monsterX)
        }))
        .sort((a,b)=>a.d-b.d)[0];

    const target=nearest.s;
    const dir=target.x<monsterX?-1:1;

    const range=
      atk.reach*
      (.88+analysis.range*.30);

    const hitScale=
      atk.role==='sweep'
        ? 2.55
        : atk.role==='mobility'
          ? 2.15
          : 1.90;

    const maxHits=Math.max(
      3,
      Math.round(
        atk.hits*
        (.82+analysis.power*.58)*
        hitScale
      )
    );

    let victims;

    if(atk.role==='sweep'){
      // Sweeps deliberately clear both sides for a musou-style payoff.
      victims=[...alive]
        .sort((a,b)=>Math.abs(a.x-monsterX)-Math.abs(b.x-monsterX))
        .slice(0,maxHits);
    }else{
      victims=
        alive
          .map(s=>({
            s,
            dx:(s.x-monsterX)*dir,
            d:Math.abs(s.x-monsterX)
          }))
          .filter(o=>{
            if(['spin','slam'].includes(atk.move)){
              return o.d<=range;
            }

            return o.dx>=-35&&o.dx<=range;
          })
          .sort((a,b)=>a.d-b.d)
          .slice(0,maxHits)
          .map(o=>o.s);
    }

    // Mobility attacks can hunt down a target even if the crowd is momentarily farther away.
    if(
      !victims.length&&
      ['dash','teleport','clone','slam'].includes(atk.move)
    ){
      victims=[target];
    }

    const strong=
      analysis.power>.77||
      atk.role==='sweep'||
      ['slam','dash','teleport','weapon'].includes(atk.move);

    showMusouHit(victims.length,atk.role==='sweep');

    victims.forEach((s,i)=>{
      setTimeout(()=>{
        if(!s.dead){
          defeatSlime(
            s,
            strong,
            Math.sign(s.x-monsterX)||dir
          );
        }
      },atk.role==='sweep'?i*5:i*10);
    });

    animateMonsterAttack(atk,dir);
    showAttackFx(atk,dir,target.x);

    beep(
      atk.move==='thunder'?900:
      atk.move==='fire'?620:
      atk.move==='dash'?420:
      atk.move==='clone'?760:
      atk.move==='slam'?360:
      520,
      34,.009
    );
  }

  startBattle=performance.now();
  lastSpawn=startBattle-600;
  lastAttack=startBattle-600;

  for(let i=0;i<42;i++){
    spawnSlime(
      startBattle,
      0,
      i%2?-1:1
    );
  }

  function battle(now){
    if(finished||!isGameRunValid(runId))return;

    const elapsed=now-startBattle;
    const remaining=10000-elapsed;
    const progress=clamp(elapsed/10000,0,1);

    timeEl.textContent=(Math.max(0,remaining)/1000).toFixed(1);

    const spawnEvery=68-progress*24;

    if(now-lastSpawn>=spawnEvery){
      const count=
        progress>.58
          ? randi(7,11)
          : randi(5,9);

      for(let i=0;i<count;i++){
        spawnSlime(now,progress);
      }
    }

    const avgCd=
      learned.reduce((s,a)=>s+a.cd,0)/
      learned.length;

    const attackEvery=clamp(
      avgCd*(.76-analysis.speed*.18),
      215,520
    );

    if(now-lastAttack>=attackEvery){
      lastAttack=now;

      const part=learned.find(a=>a.role==='part');
      const mobility=learned.find(a=>a.role==='mobility');
      const sweep=learned.find(a=>a.role==='sweep');
      const roll=Math.random();

      // V10.10: normal / mobility attacks are the core.
      // Ultimate-class sweeps remain exciting because they are occasional.
      const atk=
        roll<.60
          ? part
          : roll<.90
            ? mobility
            : sweep;

      useAttack(atk||learned[randi(0,learned.length-1)]);
    }

    for(const s of slimes){
      if(s.dead)continue;

      const dx=monsterX-s.x;
      const dir=Math.sign(dx)||1;

      // They rush the fixed center from both directions.
      if(Math.abs(dx)>44){
        s.x+=dir*s.speed*.016;
      }

      s.el.style.left=`${s.x}px`;
      s.el.style.setProperty('--summon-face',dir);
    }

    if(remaining<=0){
      finished=true;

      state.records.summonerMob[p.id]=kills;

      message.textContent=`召喚獣が ${kills}体 撃破！`;

      beep(
        kills>=500?1120:
        kills>=350?930:
        kills>=200?790:
        620,
        140,.035
      );

      setTimeout(()=>{
        if(isGameRunValid(runId)){
          recordScreen(
            41,p,humanIndex,
            `${kills}<small>体</small>`,
            learned.map(a=>a.name).join(' / ')
          );
        }
      },760);

      return;
    }

    battleRAF=requestAnimationFrame(battle);
  }

  battleRAF=requestAnimationFrame(battle);
}

// GAME 43 -------------------------------------------------
function blackjackMobValue(sum){
  return ((sum-1)%21)+1;
}

async function startBlackjackMob(p,humanIndex,runId){
  gameFit();

  let finished=false;
  let shuffleRAF=null;
  let shuffleTimer=null;
  let revealHidden=false;
  let selectionOpen=false;
  let selected=[];
  let rawSum=0;

  screen.innerHTML=`<div class="blackjack-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>ブラックジャックの決戦</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="blackjack-hud">
      <div><span>TIME</span><b id="bjTime">5.0</b></div>
      <div><span>TOTAL</span><b id="bjTotal">--</b></div>
    </div>

    <div id="bjStage" class="blackjack-stage">
      <div class="blackjack-table-mark">21</div>
      <div id="bjCards" class="blackjack-cards"></div>
      <div id="bjMessage" class="blackjack-message">13枚を覚えろ！</div>
    </div>

    <div id="bjDecision" class="blackjack-decision hidden">
      <button id="bjHit" type="button">もう1枚</button>
      <button id="bjFinish" type="button">FINISH</button>
    </div>
  </div>`;

  const stage=document.getElementById('bjStage');
  const cardsLayer=document.getElementById('bjCards');
  const timeEl=document.getElementById('bjTime');
  const totalEl=document.getElementById('bjTotal');
  const message=document.getElementById('bjMessage');
  const decision=document.getElementById('bjDecision');
  const hitBtn=document.getElementById('bjHit');
  const finishBtn=document.getElementById('bjFinish');

  const numbers=shuffle(Array.from({length:13},(_,i)=>i+1));
  const cards=numbers.map((num,i)=>({
    num,
    slot:i,
    el:null
  }));

  const cols=4;
  const rows=4;
  const usableSlots=Array.from({length:16},(_,i)=>i);
  let slotPermutation=shuffle(usableSlots).slice(0,13);

  function slotPos(slot){
    const col=slot%cols;
    const row=Math.floor(slot/cols);

    return {
      x:(col+.5)/cols*100,
      y:(row+.5)/rows*100
    };
  }

  cardsLayer.innerHTML=cards.map((c,i)=>{
    const imgNo=String(((c.num-1)%10)+1).padStart(2,'0');

    return `<button class="bj-card" data-card="${i}" type="button">
      <span class="bj-number">${c.num}</span>
      <span class="bj-mob" style="background-image:url('icon/${imgNo}.png')"></span>
      <span class="bj-question">?</span>
    </button>`;
  }).join('');

  cards.forEach((c,i)=>{
    c.el=cardsLayer.querySelector(`[data-card="${i}"]`);
  });

  function applySlots(instant=false){
    cards.forEach((c,i)=>{
      const slot=slotPermutation[i];
      c.slot=slot;
      const pos=slotPos(slot);

      c.el.style.transition=instant?'none':'left .27s ease, top .27s ease, transform .16s ease';
      c.el.style.left=`${pos.x}%`;
      c.el.style.top=`${pos.y}%`;
    });
  }

  applySlots(true);

  await wait(550);

  if(!(await countdown('BLACK JACK',runId)))return;

  message.textContent='5秒シャッフル！';
  const shuffleStart=performance.now();
  let lastShuffle=shuffleStart-400;

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const elapsed=now-shuffleStart;
      const rem=5000-elapsed;

      timeEl.textContent=(Math.max(0,rem)/1000).toFixed(1);

      if(rem<=1000&&!revealHidden){
        revealHidden=true;
        cardsLayer.classList.add('hidden-cards');
        message.textContent='ラスト1秒… ？';
        beep(320,60,.014);
      }

      if(now-lastShuffle>=360){
        lastShuffle=now;
        slotPermutation=shuffle(usableSlots).slice(0,13);
        applySlots(false);
      }

      if(rem<=0){
        resolve();
        return;
      }

      shuffleRAF=requestAnimationFrame(frame);
    };

    shuffleRAF=requestAnimationFrame(frame);
  });

  if(!isGameRunValid(runId))return;

  timeEl.textContent='0.0';
  selectionOpen=true;
  message.textContent='2枚選べ！';
  cardsLayer.classList.add('selection');

  function currentValue(){
    return rawSum===0?0:blackjackMobValue(rawSum);
  }

  function finishGame(){
    if(finished)return;
    finished=true;
    selectionOpen=false;

    decision.classList.add('hidden');
    cardsLayer.classList.remove('hidden-cards');

    const value=currentValue();
    state.records.blackjackMob[p.id]=value;

    totalEl.textContent=value;
    message.textContent=value===21?'BLACK JACK 21!!':`${value} / 21`;

    cards.forEach(c=>{
      if(!selected.includes(c))c.el.classList.add('dim');
    });

    beep(value===21?1080:value>=18?820:520,130,.035);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          42,p,humanIndex,
          `${value}<small>/21</small>`,
          value===21?'BLACK JACK!':`${selected.length} CARDS`
        );
      }
    },800);
  }

  cardsLayer.addEventListener('pointerdown',e=>{
    const btn=e.target.closest('.bj-card');

    if(
      !btn||
      !selectionOpen||
      finished||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    const card=cards[Number(btn.dataset.card)];

    if(!card||selected.includes(card))return;

    if(selected.length>=3)return;

    selected.push(card);
    rawSum+=card.num;

    // Selection must reveal the actual card immediately.
    // Unselected cards remain hidden.
    btn.classList.add('selected','revealed');
    totalEl.textContent=currentValue();

    beep(620+card.num*12,45,.012);

    if(selected.length===2){
      const value=currentValue();

      if(value===21){
        finishGame();
      }else{
        selectionOpen=false;
        decision.classList.remove('hidden');
        message.textContent=`現在 ${value} / 21`;
      }
    }else if(selected.length===3){
      finishGame();
    }
  },{passive:false});

  hitBtn.addEventListener('click',()=>{
    if(finished)return;
    decision.classList.add('hidden');
    selectionOpen=true;
    message.textContent='最後の1枚を選べ！';
  });

  finishBtn.addEventListener('click',finishGame);
}

// GAME 44 -------------------------------------------------
async function startMobIssen(p,humanIndex,runId){
  gameFit();

  let round=0;
  let total=0;
  let activeRound=false;
  let roundResolve=null;
  let raf=null;
  let start=0;
  let speed=0;
  let startY=0;
  let logHeight=0;
  let bandOffset=0;

  const roundScores=[];

  screen.innerHTML=`<div class="issen-shell issen-v106">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん一閃</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="issen-hud issen-hud-v106">
      <div><span>ROUND</span><b id="issenRound">1 / 3</b></div>
      <div><span>ROUND SCORE</span><b id="issenScore">--</b></div>
      <div><span>TOTAL</span><b id="issenTotal">0</b></div>
    </div>

    <button id="issenStage" class="issen-stage" type="button">
      <div class="issen-bg">
        <div class="issen-moon"></div>
        <div class="issen-ground"></div>
        <div class="issen-bamboo b1"></div>
        <div class="issen-bamboo b2"></div>
        <div class="issen-bamboo b3"></div>
      </div>

      <div id="issenTargetLine" class="issen-target-line">
        <span>SLASH</span>
      </div>

      <div id="issenLog" class="issen-log">
        <div class="issen-log-bark"></div>
        <div class="issen-white-band">CENTER</div>
      </div>

      <div id="issenLeftPiece" class="issen-piece left"></div>
      <div id="issenRightPiece" class="issen-piece right"></div>

      <div class="issen-mob" style="background-image:url('icon/01.png')">
        <span class="issen-sword"></span>
      </div>

      <div id="issenSlashFx" class="issen-slash-fx"></div>
      <div id="issenParticles" class="issen-particles"></div>
      <div id="issenRoundPop" class="issen-round-pop"></div>
      <div id="issenMessage" class="issen-message">白いCENTERを狙え</div>
    </button>
  </div>`;

  const stage=document.getElementById('issenStage');
  const log=document.getElementById('issenLog');
  const target=document.getElementById('issenTargetLine');
  const leftPiece=document.getElementById('issenLeftPiece');
  const rightPiece=document.getElementById('issenRightPiece');
  const slashFx=document.getElementById('issenSlashFx');
  const particles=document.getElementById('issenParticles');
  const roundEl=document.getElementById('issenRound');
  const scoreEl=document.getElementById('issenScore');
  const totalEl=document.getElementById('issenTotal');
  const roundPop=document.getElementById('issenRoundPop');
  const message=document.getElementById('issenMessage');

  const sh=stage.clientHeight;
  const targetY=sh*.52;

  target.style.top=`${targetY}px`;

  function makeParticles(score){
    particles.innerHTML=Array.from(
      {length:score>=90?20:12},
      (_,i)=>{
        const angle=rand(-155,-25);
        const dist=rand(45,155);
        const dx=Math.cos(angle*Math.PI/180)*dist;
        const dy=Math.sin(angle*Math.PI/180)*dist;

        return `<i style="
          --px:${dx.toFixed(0)}px;
          --py:${dy.toFixed(0)}px;
          --r:${randi(-180,180)}deg;
          --d:${(i%4)*.025}s
        "></i>`;
      }
    ).join('');

    particles.classList.remove('show');
    void particles.offsetWidth;
    particles.classList.add('show');
  }

  function roundBanner(text){
    roundPop.textContent=text;
    roundPop.classList.remove('show');
    void roundPop.offsetWidth;
    roundPop.classList.add('show');
  }

  function resetVisual(){
    if(raf)cancelAnimationFrame(raf);

    stage.classList.remove(
      'issen-perfect',
      'issen-cut'
    );

    log.classList.remove('cut');

    leftPiece.classList.remove('show');
    rightPiece.classList.remove('show');
    slashFx.classList.remove('show');
    particles.classList.remove('show');

    log.style.opacity='1';
  }

  function finishRound(score,logTop,miss=false){
    if(!activeRound)return;

    activeRound=false;
    if(raf)cancelAnimationFrame(raf);

    roundScores.push(score);
    total+=score;

    scoreEl.textContent=score;
    totalEl.textContent=total;

    if(miss){
      message.textContent='斬れなかった！';
      roundBanner('MISS 0');
      beep(180,180,.03);

    }else{
      message.textContent=
        score===100?'完全一閃！！':
        score>=90?'一閃！！':
        score>=70?'斬！':'ズレた！';

      log.classList.add('cut');

      leftPiece.style.top=`${logTop}px`;
      rightPiece.style.top=`${logTop}px`;
      leftPiece.style.height=`${logHeight}px`;
      rightPiece.style.height=`${logHeight}px`;

      leftPiece.classList.add('show');
      rightPiece.classList.add('show');
      slashFx.classList.add('show');

      stage.classList.add(
        score>=90
          ? 'issen-perfect'
          : 'issen-cut'
      );

      makeParticles(score);
      roundBanner(`+${score}`);

      beep(
        score>=95?1080:
        score>=80?820:
        score>=55?590:
        300,
        110,.035
      );
    }

    const resolve=roundResolve;
    roundResolve=null;

    setTimeout(()=>{
      if(resolve)resolve(score);
    },650);
  }

  stage.addEventListener('pointerdown',e=>{
    if(
      !activeRound||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    const logTop=parseFloat(log.style.top)||0;
    const bandY=logTop+bandOffset;
    const errorPx=Math.abs(bandY-targetY);

    const score=
      errorPx<=2
        ? 100
        : clamp(
            Math.round(100-errorPx/1.05),
            0,100
          );

    finishRound(score,logTop,false);
  },{passive:false});

  async function runRound(roundIndex){
    resetVisual();

    round=roundIndex;
    roundEl.textContent=`${round+1} / 3`;
    scoreEl.textContent='--';

    roundBanner(`ROUND ${round+1}`);

    await wait(300);

    if(!isGameRunValid(runId))return 0;

    logHeight=Math.min(
      285,
      sh*.46
    );

    log.style.height=`${logHeight}px`;

    startY=-logHeight-40;
    bandOffset=logHeight*.50;

    // Each round feels slightly different.
    speed=rand(
      270+round*12,
      338+round*18
    );

    log.style.top=`${startY}px`;
    message.textContent='白いCENTERを狙え';

    activeRound=true;
    start=performance.now();

    return await new Promise(resolve=>{
      roundResolve=resolve;

      const frame=now=>{
        if(
          !activeRound||
          !isGameRunValid(runId)
        )return;

        const elapsed=(now-start)/1000;
        const y=startY+speed*elapsed;

        log.style.top=`${y}px`;

        if(y>sh+30){
          finishRound(
            0,
            y,
            true
          );
          return;
        }

        raf=requestAnimationFrame(frame);
      };

      raf=requestAnimationFrame(frame);
    });
  }

  if(!(await countdown('一閃',runId)))return;

  for(let i=0;i<3;i++){
    await runRound(i);

    if(!isGameRunValid(runId))return;

    if(i<2){
      await wait(180);
    }
  }

  state.records.mobIssen[p.id]=total;

  message.textContent=
    total>=285
      ? '三連一閃・極！！'
      : `3回合計 ${total}pt`;

  roundBanner(`${total} / 300`);

  beep(
    total>=285?1120:
    total>=240?900:
    650,
    160,.04
  );

  await wait(850);

  if(isGameRunValid(runId)){
    recordScreen(
      43,p,humanIndex,
      `${total}<small>pt</small>`,
      `3 SLASH TOTAL / 300`
    );
  }
}



// GAME 45 -------------------------------------------------
async function startCrowEscape(p,humanIndex,runId){
  gameFit();

  let finished=false;
  let raf=null;
  let startTime=0;
  let last=0;
  let moveDir=0;
  let jumpCount=0;

  const worldW=1500;
  const fieldMinX=78;
  const fieldMaxX=worldW-78;
  const groundY=58;
  const gravity=1180;
  const jumpV=510;
  const playerSpeed=270;

  let playerX=worldW*.50;
  let playerY=groundY;
  let vy=0;
  let grounded=true;

  const platforms=[];

  screen.innerHTML=`<div class="crow-shell crow-v110">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>カラスから逃げろ！</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="crow-hud">
      <div><span>TIME</span><b id="crowTime">0.00</b></div>
      <div><span>JUMP</span><b id="crowJump">2段OK</b></div>
    </div>

    <div id="crowStage" class="crow-stage">
      <div id="crowWorld" class="crow-world" style="width:${worldW}px">
        <div class="crow-sky-bg">
          ${Array.from({length:7},(_,i)=>`
            <i class="crow-cloud" style="left:${130+i*215}px;top:${26+(i%3)*38}px">☁</i>
          `).join('')}
          ${Array.from({length:8},(_,i)=>`
            <i class="crow-tree-bg" style="left:${80+i*195}px"></i>
          `).join('')}
        </div>

        <div class="crow-ground"></div>
        <div class="crow-boundary left"><b>STOP</b></div>
        <div class="crow-boundary right"><b>STOP</b></div>

        <div id="crowPlatformLayer" class="crow-platform-layer"></div>

        <div id="crowPlayer" class="crow-player">
          <div
            class="crow-player-figure"
            style="background-image:url('icon/01.png')">
          </div>
        </div>

        ${Array.from({length:4},(_,i)=>`
          <div id="crow${i}" class="crow-enemy">
            <img
              src="enemy/karasu.png"
              alt="karasu"
              draggable="false"
              onerror="this.onerror=null;this.src='icon/10.png'">
          </div>
        `).join('')}
      </div>

      <div id="crowWarning" class="crow-warning"></div>
      <div id="crowFeathers" class="crow-feathers"></div>
    </div>

    <div class="crow-controls">
      <button id="crowLeft" type="button">←</button>
      <button id="crowJumpBtn" class="jump" type="button">JUMP</button>
      <button id="crowRight" type="button">→</button>
    </div>
  </div>`;

  const stage=document.getElementById('crowStage');
  const world=document.getElementById('crowWorld');
  const platformLayer=document.getElementById('crowPlatformLayer');
  const player=document.getElementById('crowPlayer');
  const playerFigure=player.querySelector('.crow-player-figure');
  const crowEls=Array.from({length:4},(_,i)=>document.getElementById(`crow${i}`));
  const timeEl=document.getElementById('crowTime');
  const jumpEl=document.getElementById('crowJump');
  const warning=document.getElementById('crowWarning');
  const feathers=document.getElementById('crowFeathers');
  const leftBtn=document.getElementById('crowLeft');
  const rightBtn=document.getElementById('crowRight');
  const jumpBtn=document.getElementById('crowJumpBtn');

  // ----------------------------------------------------------
  // 5-level climbable layout
  // ----------------------------------------------------------
  const maxTop=Math.max(
    groundY+235,
    stage.clientHeight-62
  );

  const firstTop=groundY+58;
  const step=Math.max(
    43,
    (maxTop-firstTop)/4
  );

  const levelTops=Array.from(
    {length:5},
    (_,i)=>firstTop+step*i
  );

  const baseXs=[
    [145,390,650,915,1180,1370],
    [245,505,770,1035,1295],
    [145,405,670,935,1200,1380],
    [255,520,790,1060,1315],
    [150,425,700,980,1250,1385]
  ];

  levelTops.forEach((topY,level)=>{
    baseXs[level].forEach((baseX,i)=>{
      const type=(level+i)%2===0?'table':'box';
      const h=type==='table'?34:42;
      const w=
        type==='table'
          ? rand(112,152)
          : rand(82,112);

      platforms.push({
        x:clamp(
          baseX+rand(-28,28),
          fieldMinX+55,
          fieldMaxX-55
        ),
        w,
        h,
        topY,
        type,
        level
      });
    });
  });

  platformLayer.innerHTML=platforms.map((pl,i)=>`
    <div
      class="crow-platform crow-platform-v110 ${pl.type}"
      data-platform="${i}"
      data-level="${pl.level+1}"
      style="
        left:${pl.x}px;
        width:${pl.w}px;
        height:${pl.h}px;
        bottom:${pl.topY-pl.h}px
      ">
      <b class="crow-level-tag">L${pl.level+1}</b>
      ${pl.type==='table'
        ? '<i class="table-top"></i><i class="leg l1"></i><i class="leg l2"></i>'
        : '<i class="box-line b1"></i><i class="box-line b2"></i>'
      }
    </div>
  `).join('');

  function randomCrowX(){
    let x=playerX;

    for(let tries=0;tries<40;tries++){
      x=rand(fieldMinX+60,fieldMaxX-60);

      if(Math.abs(x-playerX)>205)break;
    }

    return x;
  }

  const crowState=Array.from({length:4},(_,i)=>{
    const x=randomCrowX();
    const y=rand(
      groundY+125,
      Math.max(
        groundY+165,
        stage.clientHeight-75
      )
    );

    const toward=playerX>x?1:-1;

    return {
      x,y,
      vx:toward*rand(72,118),
      vy:rand(-16,16),
      phase:Math.random()*Math.PI*2
    };
  });

  function setPlayerFacing(dir){
    if(dir===0)return;

    playerFigure.style.transform=
      dir<0
        ? 'scaleX(-1)'
        : 'scaleX(1)';
  }

  function bindHold(btn,dir){
    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();

      moveDir=dir;
      setPlayerFacing(dir);

      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    },{passive:false});

    const stop=()=>{
      if(moveDir===dir)moveDir=0;
    };

    btn.addEventListener('pointerup',stop);
    btn.addEventListener('pointercancel',stop);
    btn.addEventListener('lostpointercapture',stop);
  }

  bindHold(leftBtn,-1);
  bindHold(rightBtn,1);

  jumpBtn.addEventListener('pointerdown',e=>{
    if(
      finished||
      jumpCount>=2||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    jumpCount++;
    grounded=false;
    vy=jumpV;

    jumpEl.textContent=
      jumpCount===1
        ? 'あと1回'
        : '空中MAX';

    player.classList.remove('jump-pop');
    void player.offsetWidth;
    player.classList.add('jump-pop');

    beep(
      jumpCount===2?760:620,
      35,.012
    );
  },{passive:false});

  function crowMaxSpeed(elapsed){
    if(elapsed<5000){
      return 220+(elapsed/5000)*50;
    }

    if(elapsed<8000){
      return 270+((elapsed-5000)/3000)*55;
    }

    return 340;
  }

  function crowAccel(elapsed){
    return elapsed<5000?126:elapsed<8000?142:158;
  }

  function showWarning(text){
    warning.textContent=text;
    warning.classList.remove('show');
    void warning.offsetWidth;
    warning.classList.add('show');
  }

  function burstFeathers(x,y){
    const cam=clamp(
      playerX-stage.clientWidth*.42,
      0,
      worldW-stage.clientWidth
    );

    feathers.style.left=`${x-cam}px`;
    feathers.style.bottom=`${y}px`;

    feathers.innerHTML=Array.from({length:14},(_,i)=>`
      <i style="
        --fx:${rand(-105,105).toFixed(0)}px;
        --fy:${rand(35,125).toFixed(0)}px;
        --fr:${randi(-240,240)}deg;
        --fd:${(i%4)*.025}s
      "></i>
    `).join('');

    feathers.classList.remove('show');
    void feathers.offsetWidth;
    feathers.classList.add('show');
  }

  function finish(survivedMs,hit=false){
    if(finished)return;

    finished=true;

    const seconds=Math.min(20,survivedMs/1000);

    state.records.crowEscape[p.id]=
      Math.round(seconds*100)/100;

    timeEl.textContent=seconds.toFixed(2);

    if(hit){
      showWarning('カラスに捕まった！');
      beep(130,220,.04);
    }else{
      showWarning('20秒 ESCAPE!!');
      beep(1080,160,.04);
    }

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          44,p,humanIndex,
          `${seconds.toFixed(2)}<small>秒</small>`,
          hit?'CAUGHT':'ESCAPE!'
        );
      }
    },760);
  }

  if(!(await countdown('CROW ESCAPE',runId)))return;

  startTime=performance.now();
  last=startTime;

  crowState.forEach((c,i)=>{
    crowEls[i].style.left=`${c.x}px`;
    crowEls[i].style.bottom=`${c.y}px`;
  });

  showWarning('5段の台も使って逃げろ！');

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    const elapsed=now-startTime;

    playerX=clamp(
      playerX+moveDir*playerSpeed*dt,
      fieldMinX,
      fieldMaxX
    );

    // When walking off a platform, support ends immediately.
    if(grounded&&playerY>groundY+2){
      const support=platforms.find(pl=>
        Math.abs(playerY-pl.topY)<=2.5&&
        Math.abs(playerX-pl.x)<=pl.w/2+12
      );

      if(!support){
        grounded=false;
        vy=0;
        jumpEl.textContent=
          jumpCount<2
            ? 'あと1回'
            : '空中MAX';
      }
    }

    const prevY=playerY;

    if(!grounded){
      vy-=gravity*dt;
      playerY+=vy*dt;
    }

    if(playerY<=groundY){
      playerY=groundY;
      vy=0;
      grounded=true;
      jumpCount=0;
      jumpEl.textContent='2段OK';
    }

    // Platform collision only while descending through the top surface.
    if(vy<=0&&playerY>groundY){
      const candidates=platforms
        .filter(pl=>
          prevY>=pl.topY&&
          playerY<=pl.topY&&
          Math.abs(playerX-pl.x)<=pl.w/2+12
        )
        .sort((a,b)=>b.topY-a.topY);

      const landed=candidates[0];

      if(landed){
        playerY=landed.topY;
        vy=0;
        grounded=true;
        jumpCount=0;
        jumpEl.textContent='2段OK';
      }
    }

    player.style.left=`${playerX}px`;
    player.style.bottom=`${playerY}px`;

    const maxSpeed=crowMaxSpeed(elapsed);
    const accel=crowAccel(elapsed);

    crowState.forEach((c,i)=>{
      c.phase+=dt*4.8;

      const targetX=playerX;
      const targetY=playerY+37+Math.sin(c.phase)*6;

      const dx=targetX-c.x;
      const dy=targetY-c.y;
      const dist=Math.hypot(dx,dy)||1;

      const desiredVx=dx/dist*maxSpeed;
      const desiredVy=dy/dist*maxSpeed;

      const dvx=desiredVx-c.vx;
      const dvy=desiredVy-c.vy;
      const dv=Math.hypot(dvx,dvy)||1;

      const change=Math.min(accel*dt,dv);

      c.vx+=dvx/dv*change;
      c.vy+=dvy/dv*change;

      const sp=Math.hypot(c.vx,c.vy)||1;

      if(sp>maxSpeed){
        c.vx=c.vx/sp*maxSpeed;
        c.vy=c.vy/sp*maxSpeed;
      }

      c.x=clamp(
        c.x+c.vx*dt,
        18,
        worldW-18
      );

      c.y=clamp(
        c.y+c.vy*dt,
        groundY+24,
        stage.clientHeight-28
      );

      const el=crowEls[i];

      el.style.left=`${c.x}px`;
      el.style.bottom=`${c.y}px`;
      el.style.setProperty(
        '--crow-flip',
        c.vx>0?-1:1
      );

      // Much tighter visual hitbox than V10.9.
      // Transparent padding in karasu.png no longer causes "phantom catches".
      const hitDx=Math.abs(c.x-playerX);
      const hitDy=Math.abs(c.y-(playerY+36));

      if(
        (hitDx/14)**2+
        (hitDy/10)**2
        <1
      ){
        burstFeathers(c.x,c.y);
        finish(elapsed,true);
      }
    });

    const cam=clamp(
      playerX-stage.clientWidth*.42,
      0,
      worldW-stage.clientWidth
    );

    world.style.transform=`translateX(${-cam}px)`;

    if(elapsed>=5000&&elapsed<5050){
      showWarning('同じ速さ！');
    }

    if(elapsed>=8000&&elapsed<8050){
      showWarning('カラスが速い！');
    }

    if(elapsed>=20000){
      finish(20000,false);
      return;
    }

    timeEl.textContent=(elapsed/1000).toFixed(2);

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



// GAME 46 -------------------------------------------------
function drawingStrokeStats(stroke){
  if(!stroke||stroke.length<2){
    return {
      minX:0,minY:0,maxX:0,maxY:0,
      w:0,h:0,cx:0,cy:0,len:0,turn:0
    };
  }

  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  let len=0;
  let turn=0;

  stroke.forEach((pt,i)=>{
    minX=Math.min(minX,pt.x);
    minY=Math.min(minY,pt.y);
    maxX=Math.max(maxX,pt.x);
    maxY=Math.max(maxY,pt.y);

    if(i){
      len+=Math.hypot(
        pt.x-stroke[i-1].x,
        pt.y-stroke[i-1].y
      );
    }

    if(i>=2){
      const a1=Math.atan2(
        stroke[i-1].y-stroke[i-2].y,
        stroke[i-1].x-stroke[i-2].x
      );
      const a2=Math.atan2(
        stroke[i].y-stroke[i-1].y,
        stroke[i].x-stroke[i-1].x
      );

      let d=Math.abs(a2-a1);
      while(d>Math.PI)d=Math.abs(d-Math.PI*2);
      turn+=d;
    }
  });

  return {
    minX,minY,maxX,maxY,
    w:Math.max(1,maxX-minX),
    h:Math.max(1,maxY-minY),
    cx:(minX+maxX)/2,
    cy:(minY+maxY)/2,
    len,turn
  };
}

function scoreDancingDrawing(strokes,w,h){
  const valid=strokes.filter(s=>s.length>=2);
  if(!valid.length)return 1;

  const stats=valid.map(drawingStrokeStats);
  const totalLen=stats.reduce((sum,a)=>sum+a.len,0);
  const totalTurn=stats.reduce((sum,a)=>sum+a.turn,0);

  const cells=new Set();
  const cols=5;
  const rows=6;

  valid.flat().forEach(pt=>{
    const col=clamp(Math.floor(pt.x/w*cols),0,cols-1);
    const row=clamp(Math.floor(pt.y/h*rows),0,rows-1);

    if(!(col===2&&(row===2||row===3))){
      cells.add(`${col}:${row}`);
    }
  });

  const strokeScore=clamp(valid.length/18,0,1)*30;
  const lengthScore=clamp(totalLen/(w*8.2),0,1)*28;
  const spreadScore=clamp(cells.size/24,0,1)*27;
  const complexityScore=clamp(totalTurn/(Math.PI*28),0,1)*15;

  return clamp(
    Math.round(
      1+
      strokeScore+
      lengthScore+
      spreadScore+
      complexityScore
    ),
    1,100
  );
}

async function startDancingMob(p,humanIndex,runId){
  gameFit();

  let drawing=false;
  let drawingOpen=false;
  let pointerId=null;
  let currentStroke=null;
  let raf=null;

  const strokes=[];

  screen.innerHTML=`<div class="dance-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>ダンシングモブくん</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="dance-hud">
      <div><span>DRAW</span><b id="danceTime">7.0</b></div>
      <div><span>ART</span><b id="danceStrokeCount">0</b></div>
    </div>

    <div id="danceStage" class="dance-stage">
      <div class="dance-bg">
        <i class="dance-speaker left"></i>
        <i class="dance-speaker right"></i>
        <i class="dance-floor-line l1"></i>
        <i class="dance-floor-line l2"></i>
      </div>

      <svg id="danceSvg" class="dance-svg"></svg>

      <div id="danceMob" class="dance-mob" style="background-image:url('icon/01.png')"></div>

      <div id="danceCall" class="dance-call"></div>
      <div id="danceScorePop" class="dance-score-pop"></div>
      <div id="danceMessage" class="dance-message">モブくんの周りを盛り上げろ！</div>
    </div>
  </div>`;

  const stage=document.getElementById('danceStage');
  const svg=document.getElementById('danceSvg');
  const mob=document.getElementById('danceMob');
  const timeEl=document.getElementById('danceTime');
  const countEl=document.getElementById('danceStrokeCount');
  const call=document.getElementById('danceCall');
  const scorePop=document.getElementById('danceScorePop');
  const message=document.getElementById('danceMessage');

  const w=stage.clientWidth;
  const h=stage.clientHeight;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  function localPoint(e){
    const r=stage.getBoundingClientRect();
    return {
      x:clamp(e.clientX-r.left,3,w-3),
      y:clamp(e.clientY-r.top,3,h-3)
    };
  }

  function createStroke(){
    const el=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );

    el.classList.add('dance-user-stroke');
    svg.appendChild(el);
    return el;
  }

  stage.addEventListener('pointerdown',e=>{
    if(!drawingOpen||drawing||!isGameRunValid(runId))return;

    e.preventDefault();

    drawing=true;
    pointerId=e.pointerId;

    currentStroke={
      points:[localPoint(e)],
      el:createStroke()
    };

    strokes.push(currentStroke.points);
    countEl.textContent=strokes.length;

    try{stage.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(!drawing||e.pointerId!==pointerId||!drawingOpen)return;

    e.preventDefault();

    const pt=localPoint(e);
    const prev=currentStroke.points[currentStroke.points.length-1];

    if(Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.2){
      currentStroke.points.push(pt);

      currentStroke.el.setAttribute(
        'points',
        currentStroke.points
          .map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`)
          .join(' ')
      );
    }
  },{passive:false});

  const endStroke=e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();
    drawing=false;
    currentStroke=null;
  };

  stage.addEventListener('pointerup',endStroke,{passive:false});
  stage.addEventListener('pointercancel',endStroke,{passive:false});

  if(!(await countdown('DANCE ART',runId)))return;

  drawingOpen=true;
  const start=performance.now();

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const rem=7000-(now-start);
      timeEl.textContent=(Math.max(0,rem)/1000).toFixed(1);

      if(rem<=0){
        drawingOpen=false;
        drawing=false;
        resolve();
        return;
      }

      raf=requestAnimationFrame(frame);
    };

    raf=requestAnimationFrame(frame);
  });

  if(!isGameRunValid(runId))return;

  const score=scoreDancingDrawing(strokes,w,h);
  state.records.dancingMob[p.id]=score;

  [...svg.querySelectorAll('.dance-user-stroke')].forEach((el,i)=>{
    const g=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );

    g.classList.add(
      'dance-art-piece',
      `dance-motion-${i%6}`
    );

    el.parentNode.insertBefore(g,el);
    g.appendChild(el);
  });

  stage.classList.add('dance-performance');
  call.textContent='レッツ、ダンシング！';
  call.classList.add('show');
  message.textContent='DRAWING PARTY!!';

  beep(720,95,.026);

  await wait(650);
  if(!isGameRunValid(runId))return;

  mob.classList.add('dancing');

  await wait(3000);
  if(!isGameRunValid(runId))return;

  scorePop.textContent=`${score} POINT!`;
  scorePop.classList.add('show');

  beep(
    score>=90?1080:
    score>=70?880:
    score>=45?660:
    470,
    150,.04
  );

  await wait(700);

  if(isGameRunValid(runId)){
    recordScreen(
      45,p,humanIndex,
      `${score}<small>pt</small>`,
      `DANCE ART SCORE`
    );
  }
}

// GAME 47 -------------------------------------------------
function guardianClusterStrokes(strokes,threshold=34){
  const valid=strokes
    .map((stroke,index)=>({
      stroke,index,
      stat:drawingStrokeStats(stroke)
    }))
    .filter(x=>x.stroke.length>=2);

  const clusters=[];

  function bboxGap(a,b){
    const dx=Math.max(
      0,
      Math.max(a.minX,b.minX)-Math.min(a.maxX,b.maxX)
    );
    const dy=Math.max(
      0,
      Math.max(a.minY,b.minY)-Math.min(a.maxY,b.maxY)
    );
    return Math.hypot(dx,dy);
  }

  for(const item of valid){
    let cluster=clusters.find(c=>
      c.items.some(other=>
        bboxGap(item.stat,other.stat)<=threshold
      )
    );

    if(!cluster){
      cluster={items:[]};
      clusters.push(cluster);
    }

    cluster.items.push(item);
  }

  return clusters.map((c,id)=>{
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    let len=0;
    let turn=0;

    c.items.forEach(x=>{
      minX=Math.min(minX,x.stat.minX);
      minY=Math.min(minY,x.stat.minY);
      maxX=Math.max(maxX,x.stat.maxX);
      maxY=Math.max(maxY,x.stat.maxY);
      len+=x.stat.len;
      turn+=x.stat.turn;
    });

    const w=Math.max(1,maxX-minX);
    const h=Math.max(1,maxY-minY);
    const area=w*h;
    const verticality=clamp(h/(w+1)/2.5,0,1);

    const durability=clamp(
      Math.round(
        14+
        clamp(area/16500,0,1)*62+
        clamp(len/900,0,1)*46+
        verticality*24+
        clamp(c.items.length/6,0,1)*18+
        clamp(turn/(Math.PI*16),0,1)*12
      ),
      12,190
    );

    return {
      id,
      items:c.items,
      minX,minY,maxX,maxY,
      w,h,
      cx:(minX+maxX)/2,
      cy:(minY+maxY)/2,
      durability,
      hp:durability
    };
  });
}

async function startGuardianMob(p,humanIndex,runId){
  gameFit();

  let drawing=false;
  let drawingOpen=false;
  let pointerId=null;
  let currentStroke=null;
  let raf=null;

  const strokes=[];

  screen.innerHTML=`<div class="guardian-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはガーディアン</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="guardian-hud">
      <div><span>DRAW</span><b id="guardianTime">7.0</b></div>
      <div><span>STRUCTURE</span><b id="guardianCount">0</b></div>
      <div><span>DEFENSE</span><b id="guardianDefense">---</b></div>
    </div>

    <div id="guardianStage" class="guardian-stage">
      <div class="guardian-bg">
        <div class="guardian-mountain m1"></div>
        <div class="guardian-mountain m2"></div>
        <div class="guardian-ground"></div>
      </div>

      <div id="guardianMob" class="guardian-mob" style="background-image:url('icon/01.png')"></div>

      <svg id="guardianSvg" class="guardian-svg"></svg>

      <div id="guardianEnergy" class="guardian-energy-v111">
        <i></i><b></b>
      </div>

      <div id="guardianDebris" class="guardian-debris"></div>
      <div id="guardianCall" class="guardian-call"></div>
      <div id="guardianMessage" class="guardian-message">城・タワーを描いて守れ！</div>
    </div>
  </div>`;

  const stage=document.getElementById('guardianStage');
  const svg=document.getElementById('guardianSvg');
  const mob=document.getElementById('guardianMob');
  const energy=document.getElementById('guardianEnergy');
  const debris=document.getElementById('guardianDebris');
  const call=document.getElementById('guardianCall');
  const message=document.getElementById('guardianMessage');
  const timeEl=document.getElementById('guardianTime');
  const countEl=document.getElementById('guardianCount');
  const defenseEl=document.getElementById('guardianDefense');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  function localPoint(e){
    const r=stage.getBoundingClientRect();

    return {
      x:clamp(e.clientX-r.left,58,w-18),
      y:clamp(e.clientY-r.top,20,h-35)
    };
  }

  function createStroke(){
    const el=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );

    el.classList.add('guardian-user-stroke');
    svg.appendChild(el);
    return el;
  }

  stage.addEventListener('pointerdown',e=>{
    if(!drawingOpen||drawing||!isGameRunValid(runId))return;

    e.preventDefault();

    drawing=true;
    pointerId=e.pointerId;

    currentStroke={
      points:[localPoint(e)],
      el:createStroke()
    };

    strokes.push(currentStroke.points);

    try{stage.setPointerCapture(pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(!drawing||e.pointerId!==pointerId||!drawingOpen)return;

    e.preventDefault();

    const pt=localPoint(e);
    const prev=currentStroke.points[currentStroke.points.length-1];

    if(Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2.1){
      currentStroke.points.push(pt);

      currentStroke.el.setAttribute(
        'points',
        currentStroke.points
          .map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`)
          .join(' ')
      );
    }
  },{passive:false});

  const endStroke=e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();
    drawing=false;
    currentStroke=null;
  };

  stage.addEventListener('pointerup',endStroke,{passive:false});
  stage.addEventListener('pointercancel',endStroke,{passive:false});

  if(!(await countdown('GUARDIAN DRAW',runId)))return;

  drawingOpen=true;
  const drawStart=performance.now();

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const rem=7000-(now-drawStart);
      timeEl.textContent=(Math.max(0,rem)/1000).toFixed(1);

      if(rem<=0){
        drawingOpen=false;
        drawing=false;
        resolve();
        return;
      }

      raf=requestAnimationFrame(frame);
    };

    raf=requestAnimationFrame(frame);
  });

  if(!isGameRunValid(runId))return;

  const clusters=guardianClusterStrokes(strokes);
  countEl.textContent=clusters.length;

  const originalEls=[...svg.querySelectorAll('.guardian-user-stroke')];
  const clusterGroups=[];

  clusters.forEach(cluster=>{
    const g=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );

    g.classList.add('guardian-structure');
    g.dataset.cluster=cluster.id;

    cluster.items.forEach(item=>{
      const el=originalEls[item.index];
      if(el)g.appendChild(el);
    });

    svg.appendChild(g);
    clusterGroups[cluster.id]=g;
  });

  call.textContent='魔王の攻撃だ！';
  call.classList.add('show');
  message.textContent='超巨大エネルギー接近！！';

  beep(330,140,.035);

  await wait(700);
  if(!isGameRunValid(runId))return;

  let attackPower=145;
  const initialTotal=clusters.reduce((sum,c)=>sum+c.hp,0);

  energy.classList.add('active');

  const ordered=[...clusters].sort((a,b)=>b.cx-a.cx);

  async function moveEnergyTo(x,duration=330){
    const from=parseFloat(energy.dataset.x||String(w+125));
    const start=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        if(!isGameRunValid(runId)){resolve();return;}

        const t=clamp((now-start)/duration,0,1);
        const ease=1-Math.pow(1-t,3);
        const ex=from+(x-from)*ease;

        energy.style.left=`${ex}px`;
        energy.dataset.x=String(ex);

        if(t<1){
          raf=requestAnimationFrame(frame);
        }else{
          resolve();
        }
      };

      raf=requestAnimationFrame(frame);
    });
  }

  function breakStructure(cluster){
    const g=clusterGroups[cluster.id];
    if(!g)return;

    g.classList.add('destroyed');

    debris.style.left=`${cluster.cx}px`;
    debris.style.top=`${cluster.cy}px`;
    debris.innerHTML=Array.from({length:12},(_,i)=>`
      <i style="
        --gx:${rand(-95,95).toFixed(0)}px;
        --gy:${rand(-100,55).toFixed(0)}px;
        --gr:${randi(-180,180)}deg;
        --gd:${(i%4)*.025}s
      "></i>
    `).join('');

    debris.classList.remove('show');
    void debris.offsetWidth;
    debris.classList.add('show');

    beep(180,95,.025);
  }

  energy.style.left=`${w+125}px`;
  energy.dataset.x=String(w+125);

  for(const cluster of ordered){
    if(attackPower<=0)break;

    await moveEnergyTo(cluster.cx+20,330);
    if(!isGameRunValid(runId))return;

    const g=clusterGroups[cluster.id];
    if(g){
      g.classList.remove('hit');
      void g.getBoundingClientRect();
      g.classList.add('hit');
    }

    const damage=Math.min(cluster.hp,attackPower);
    cluster.hp-=damage;
    attackPower-=damage;

    defenseEl.textContent=
      `${Math.round(clusters.reduce((sum,c)=>sum+c.hp,0))}`;

    if(cluster.hp<=0){
      breakStructure(cluster);
      await wait(170);
      if(!isGameRunValid(runId))return;
    }else{
      energy.classList.add('blocked');
      message.textContent='防いだ！！';
      beep(880,120,.035);
      attackPower=0;
      break;
    }
  }

  const remainingTotal=clusters.reduce((sum,c)=>sum+c.hp,0);

  let score=0;

  if(!clusters.length||remainingTotal<=0){
    await moveEnergyTo(54,430);
    if(!isGameRunValid(runId))return;

    mob.classList.add('blown');
    energy.classList.add('mob-hit');
    message.textContent='全壊！ モブくん直撃！！';

    beep(120,230,.05);
    score=0;

  }else if(clusters.length===1){
    score=100;
    message.textContent='一点防御成功！ 100 POINT！';

  }else{
    score=clamp(
      Math.round(
        remainingTotal/
        Math.max(1,initialTotal)*
        100
      ),
      1,100
    );

    message.textContent=`防衛成功！ 耐久 ${score}%`;
  }

  state.records.guardianMob[p.id]=score;
  defenseEl.textContent=`${score}pt`;

  await wait(750);

  if(isGameRunValid(runId)){
    recordScreen(
      46,p,humanIndex,
      `${score}<small>pt</small>`,
      score===0
        ? 'CASTLE BREAK'
        : `${clusters.length} STRUCTURES`
    );
  }
}

// GAME 48 -------------------------------------------------
async function startMob50m(p,humanIndex,runId){
  gameFit();

  let started=false;
  let finished=false;
  let expected='L';
  let distance=0;
  let steps=0;
  let startTime=0;
  let raf=null;

  const TOTAL_STEPS=42;
  const STEP_DISTANCE=50/TOTAL_STEPS;

  screen.innerHTML=`<div class="sprint-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん50m走</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="sprint-hud">
      <div><span>TIME</span><b id="sprintTime">0.00</b></div>
      <div><span>DISTANCE</span><b id="sprintDistance">0.0m</b></div>
      <div><span>NEXT</span><b id="sprintNext">LEFT</b></div>
    </div>

    <div id="sprintStage" class="sprint-stage">
      <div class="sprint-sky"></div>

      <div class="sprint-track">
        ${[0,10,20,30,40,50].map(m=>`
          <i class="sprint-marker" style="left:${6+m/50*88}%"><b>${m}m</b></i>
        `).join('')}
        <div class="sprint-lane l1"></div>
        <div class="sprint-lane l2"></div>
      </div>

      <div id="sprintMob" class="sprint-mob" style="background-image:url('icon/01.png')"></div>

      <div id="sprintMessage" class="sprint-message">LEFT → RIGHT を交互に！</div>
    </div>

    <div class="sprint-controls">
      <button id="sprintLeftFoot" class="left-foot" type="button">LEFT<br>FOOT</button>
      <button id="sprintRightFoot" class="right-foot" type="button">RIGHT<br>FOOT</button>
    </div>
  </div>`;

  const mob=document.getElementById('sprintMob');
  const timeEl=document.getElementById('sprintTime');
  const distanceEl=document.getElementById('sprintDistance');
  const nextEl=document.getElementById('sprintNext');
  const message=document.getElementById('sprintMessage');
  const left=document.getElementById('sprintLeftFoot');
  const right=document.getElementById('sprintRightFoot');

  function updateMob(){
    const pct=clamp(distance/50,0,1);
    mob.style.left=`${6+pct*88}%`;
    distanceEl.textContent=`${Math.min(50,distance).toFixed(1)}m`;
  }

  function footTap(which){
    if(!started||finished||!isGameRunValid(runId))return;

    if(which!==expected){
      message.textContent=
        expected==='L'
          ? 'LEFT FOOT！'
          : 'RIGHT FOOT！';

      beep(170,25,.006);
      return;
    }

    steps++;
    distance=Math.min(50,steps*STEP_DISTANCE);
    expected=expected==='L'?'R':'L';

    nextEl.textContent=
      expected==='L'
        ? 'LEFT'
        : 'RIGHT';

    mob.classList.remove('step-left','step-right');
    void mob.offsetWidth;
    mob.classList.add(
      which==='L'
        ? 'step-left'
        : 'step-right'
    );

    message.textContent=
      steps%8===0
        ? 'GO! GO! GO!'
        : 'RUN!';

    updateMob();
    beep(which==='L'?430:500,18,.004);

    if(distance>=50){
      finish();
    }
  }

  left.addEventListener('pointerdown',e=>{
    e.preventDefault();
    footTap('L');
  },{passive:false});

  right.addEventListener('pointerdown',e=>{
    e.preventDefault();
    footTap('R');
  },{passive:false});

  function finish(){
    if(finished)return;

    finished=true;

    const ms=Math.max(
      1,
      Math.round(performance.now()-startTime)
    );

    state.records.mob50m[p.id]=ms;

    timeEl.textContent=(ms/1000).toFixed(2);
    distanceEl.textContent='50.0m';
    message.textContent='GOAL!!';
    mob.classList.add('goal');

    beep(ms<=5000?1080:ms<=7000?850:620,150,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          47,p,humanIndex,
          `${(ms/1000).toFixed(2)}<small>秒</small>`,
          `50m / ${steps} STEPS`
        );
      }
    },700);
  }

  if(!(await countdown('50m RUN',runId)))return;

  started=true;
  startTime=performance.now();
  message.textContent='LEFT FOOTからスタート！';

  function timer(now){
    if(finished||!isGameRunValid(runId))return;

    timeEl.textContent=
      ((now-startTime)/1000).toFixed(2);

    raf=requestAnimationFrame(timer);
  }

  raf=requestAnimationFrame(timer);
}

// GAME 49 -------------------------------------------------
async function startSniperMob(p,humanIndex,runId){
  gameFit();

  let bullets=4;
  let hits=0;
  let shotLocked=false;
  let finished=false;
  let startTime=0;
  let raf=null;

  const windLevel=randi(1,10);

  screen.innerHTML=`<div class="sniper-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはスナイパー</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="sniper-hud">
      <div><span>WIND</span><b>LEVEL ${windLevel}</b></div>
      <div><span>BULLET</span><b id="sniperBullets">●●●●</b></div>
      <div><span>SCORE</span><b id="sniperScore">0</b></div>
    </div>

    <button id="sniperStage" class="sniper-stage" type="button">
      <div class="sniper-distance-bg">
        <div class="sniper-horizon"></div>
        <i class="sniper-distance d1">100m</i>
        <i class="sniper-distance d2">300m</i>
        <i class="sniper-distance d3">500m</i>
      </div>

      <div id="sniperShooter" class="sniper-shooter" style="background-image:url('icon/01.png')">
        <i class="sniper-rifle"></i>
      </div>

      <div id="sniperTarget" class="sniper-target">
        <i></i><b>25</b>
      </div>

      <div id="sniperCross" class="sniper-crosshair">
        <i></i><i></i>
      </div>

      <div id="sniperMessage" class="sniper-message">遠い… 4発だけ。</div>
    </button>
  </div>`;

  const stage=document.getElementById('sniperStage');
  const shooter=document.getElementById('sniperShooter');
  const target=document.getElementById('sniperTarget');
  const cross=document.getElementById('sniperCross');
  const bulletEl=document.getElementById('sniperBullets');
  const scoreEl=document.getElementById('sniperScore');
  const message=document.getElementById('sniperMessage');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  const shooterX=w*.10;
  const shooterY=h*.72;
  const targetX=w*.89;

  const amplitude=10+windLevel*3.4;
  const frequency=.82+windLevel*.15;
  const baseY=h*.42;
  const phase=Math.random()*Math.PI*2;

  shooter.style.left=`${shooterX}px`;
  shooter.style.top=`${shooterY}px`;
  target.style.left=`${targetX}px`;
  target.style.top=`${baseY}px`;

  function targetY(now){
    return baseY+
      Math.sin(
        (now-startTime)/1000*
        frequency*Math.PI*2+
        phase
      )*
      amplitude;
  }

  function updateBullets(){
    bulletEl.textContent=
      '●'.repeat(bullets)+
      '○'.repeat(4-bullets);
  }

  function finish(){
    if(finished)return;

    finished=true;
    shotLocked=true;

    const score=hits*25;
    state.records.sniperMob[p.id]=score;

    message.textContent=
      hits===4
        ? 'PERFECT SNIPER!!'
        : `${hits} / 4 HIT`;

    beep(
      hits===4?1080:
      hits>=3?860:
      hits>=2?660:
      430,
      150,.04
    );

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          48,p,humanIndex,
          `${score}<small>pt</small>`,
          `${hits} / 4 HIT / WIND ${windLevel}`
        );
      }
    },700);
  }

  stage.addEventListener('pointerdown',e=>{
    if(
      finished||
      shotLocked||
      bullets<=0||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    const rect=stage.getBoundingClientRect();
    const aimX=clamp(e.clientX-rect.left,0,w);
    const aimY=clamp(e.clientY-rect.top,0,h);

    cross.style.left=`${aimX}px`;
    cross.style.top=`${aimY}px`;
    cross.classList.remove('show');
    void cross.offsetWidth;
    cross.classList.add('show');

    bullets--;
    updateBullets();
    shotLocked=true;

    const bullet=document.createElement('i');
    bullet.className='sniper-bullet-v111';

    bullet.style.left=`${shooterX}px`;
    bullet.style.top=`${shooterY}px`;
    bullet.style.setProperty('--sx',`${aimX-shooterX}px`);
    bullet.style.setProperty('--sy',`${aimY-shooterY}px`);

    stage.appendChild(bullet);

    beep(820,34,.015);

    setTimeout(()=>{
      if(!isGameRunValid(runId))return;

      bullet.remove();

      const ty=targetY(performance.now());
      const dx=Math.abs(aimX-targetX);
      const dy=Math.abs(aimY-ty);

      const hit=
        (dx/18)**2+
        (dy/17)**2
        <1;

      if(hit){
        hits++;
        scoreEl.textContent=hits*25;

        target.classList.remove('hit');
        void target.offsetWidth;
        target.classList.add('hit');

        message.textContent='HIT! +25';
        beep(1040,75,.025);
      }else{
        message.textContent='MISS...';
        beep(230,55,.01);
      }

      if(bullets<=0){
        setTimeout(finish,380);
      }else{
        shotLocked=false;
      }
    },430);
  },{passive:false});

  if(!(await countdown('SNIPER',runId)))return;

  startTime=performance.now();
  message.textContent=`WIND LEVEL ${windLevel} / TAP TO FIRE`;

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    target.style.top=`${targetY(now)}px`;
    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



function recordScreen(gameIndex,p,humanIndex,main,sub=""){
  if(
    !gameSessionActive||
    activeGameIndex!==gameIndex
  )return;

  gameSessionActive=false;
  activeGameIndex=-1;
  cancelCountdown();
  cancelActiveAnimation();
  clearGameFit();
  gameTop();
  if(state.freePlay){
    screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">${imgTag(p,"ready-avatar")}<div class="record-label">${GAMES[gameIndex].title} / SOLO RECORD</div><div class="big-record">${main}</div>${sub?`<p class="lead">${sub}</p>`:""}<button id="soloReplay" class="primary">同じゲームをもう一度</button><div style="height:8px"></div><button id="soloHome" class="secondary">メインメニューへ</button></div></div>`;
    document.getElementById("soloReplay").addEventListener("click",()=>startFreeGame(gameIndex));
    document.getElementById("soloHome").addEventListener("click",renderHome);
    return;
  }
  const more=humanIndex+1<humans().length;
  screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">${imgTag(p,"ready-avatar")}<div class="record-label">${GAMES[gameIndex].title} / RECORD</div><div class="big-record">${main}</div>${sub?`<p class="lead">${sub}</p>`:""}<button id="nextHuman" class="primary">${more?"次のプレイヤー":cpus().length?"CPU高速処理へ":`ROUND ${state.roundIndex+1} RESULT`}</button></div></div>`;
  document.getElementById("nextHuman").addEventListener("click",()=>humanReady(gameIndex,humanIndex+1));
}

// CPU ----------------------------------------------------
async function simulateCpuThenResult(gameIndex){
  clearGameFit();
  gameTop();
  const list=cpus();
  screen.innerHTML=`<div class="cpu-sim"><div class="cpu-sim-box"><span class="kicker">CPU QUICK PROCESS</span><h2>CPU RESULT</h2><p class="lead">CPUは強め。ゲームごとにまれに「超強いCPU」が抽選されます。</p><div id="cpuRows">${list.map(p=>`<div class="cpu-row" data-cpu="${p.id}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>CPU</span></div><div class="cpu-dot">•••</div></div>`).join("")}</div></div></div>`;

  for(const p of list){
    await wait(145);
    const ultra=simulateOneCpu(gameIndex,p);
    const row=screen.querySelector(`[data-cpu="${p.id}"] .cpu-dot`);
    if(row){
      row.textContent=ultra?"SUPER!":"DONE";
      row.classList.add(ultra?"super":"done");
      beep(ultra?820:470,ultra?65:30,.014);
    }
  }
  await wait(480);
  finishGame(gameIndex);
}

function cpuUltraDraw(gameIndex){
  // Game-specific draw rate. Regular values are already intentionally strong.
  const chance=[0.12,0.10,0.14,0.16,0.12,0.13,0.14,0.12,0.15,0.12,0.14,0.13,0.13,0.14,0.12,0.12,0.13,0.12,0.13,0.14,0.13,0.14,0.12,0.13,0.12,0.12,0.13,0.13,0.14,0.14,0.13,0.12,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.13,0.14,0.13][gameIndex] ?? 0.12;
  return Math.random()<chance;
}

function simulateOneCpu(gameIndex,p){
  const ultra=cpuUltraDraw(gameIndex);
  state.cpuTier[`${state.roundIndex}:${p.id}`]=ultra?"SUPER":"STRONG";

  if(gameIndex===0){
    const bias={c2:10,c3:4,c4:14,c5:8,c6:2,c7:12,c8:0}[p.id]||0;
    state.records.reaction[p.id]=ultra
      ? rand(155,185)
      : clamp(rand(185,305)+bias,180,325);
  }else if(gameIndex===1){
    const base={c5:9,c6:9,c7:8,c8:10}[p.id]||9;
    state.records.memory[p.id]=ultra?10:clamp(base+randi(-1,1),7,10);
  }else if(gameIndex===2){
    state.records.puzzle[p.id]=ultra?randi(2450,2850):randi(2900,4700);
  }else if(gameIndex===3){
    state.records.launch[p.id]=Math.round((ultra?rand(1840,2000):rand(1280,1900))*10);
  }else if(gameIndex===4){
    state.records.stack[p.id]=ultra?randi(17,20):randi(10,17);
  }else if(gameIndex===5){
    state.records.breakdance[p.id]=ultra?1:randi(1,12);
  }else if(gameIndex===6){
    state.records.crisis[p.id]=ultra?randi(22,28):randi(12,23);
  }else if(gameIndex===7){
    state.records.factory[p.id]=ultra?randi(23,28):randi(15,24);
  }else if(gameIndex===8){
    state.records.catcher[p.id]=ultra?randi(9,13):randi(4,10);
  }else if(gameIndex===9){
    state.records.tidy[p.id]=ultra?randi(88,96):randi(55,84);
  }else if(gameIndex===10){
    state.records.ski[p.id]=Math.round((ultra?rand(850,960):rand(500,850))*10);
  }else if(gameIndex===11){
    state.records.slot[p.id]=ultra?randi(2500,3400):randi(1450,2750);
  }else if(gameIndex===12){
    state.records.rope[p.id]=ultra?randi(26,33):randi(15,27);
  }else if(gameIndex===13){
    state.records.pk[p.id]=ultra?randi(8,10):randi(4,8);
  }else if(gameIndex===14){
    state.records.rhythm[p.id]=ultra?rand(175,210):rand(210,335);
  }else if(gameIndex===15){
    state.records.cut[p.id]=ultra?randi(88,97):randi(55,88);
  }else if(gameIndex===16){
    state.records.climb[p.id]=Math.round((ultra?rand(620,760):rand(340,650))*10);
  }else if(gameIndex===17){
    state.records.errand[p.id]=ultra?randi(970,1000):randi(730,985);
  }else if(gameIndex===18){
    state.records.dontHitMob[p.id]=ultra?randi(11,14):randi(5,11);
  }else if(gameIndex===19){
    state.records.mobStop[p.id]=ultra?randi(86,96):randi(42,88);
  }else if(gameIndex===20){
    state.records.overlap[p.id]=Math.round((ultra?rand(98.2,100):rand(87,98.8))*10)/10;
  }else if(gameIndex===21){
    state.records.shutter[p.id]=ultra?rand(12,32):rand(32,105);
  }else if(gameIndex===22){
    state.records.cup[p.id]=Math.round((ultra?rand(94,100):rand(62,95))*10)/10;
  }else if(gameIndex===23){
    state.records.darts[p.id]=Math.round((ultra?rand(1.5,7):rand(7,34))*10)/10;
  }else if(gameIndex===24){
    state.records.parachute[p.id]=ultra?rand(18,85):rand(80,520);
  }else if(gameIndex===25){
    state.records.mobCount[p.id]=ultra?(Math.random()<.85?0:1):randi(0,3);
  }else if(gameIndex===26){
    state.records.brake[p.id]=Math.round((ultra?rand(.2,1.4):rand(1.2,6.5))*10)/10;
  }else if(gameIndex===27){
    state.records.feint[p.id]=ultra?rand(170,205):rand(205,335);
  }else if(gameIndex===28){
    state.records.bomb[p.id]=ultra?randi(9600,9960):randi(7600,9700);
  }else if(gameIndex===29){
    state.records.overlapMaster[p.id]=Math.round((ultra?rand(95,99.7):rand(78,95.5))*10)/10;
  }else if(gameIndex===30){
    state.records.jumpingMob[p.id]=ultra?randi(430,545):randi(240,445);
  }else if(gameIndex===31){
    state.records.heroMaybe[p.id]=ultra?randi(84,98):randi(48,85);
  }else if(gameIndex===32){
    state.records.popularGame[p.id]=ultra?randi(17,23):randi(9,18);
  }else if(gameIndex===33){
    state.records.planetEnergy[p.id]=Math.round((ultra?rand(82,98):rand(38,84))*10)/10;
  }else if(gameIndex===34){
    state.records.painter[p.id]=Math.round((ultra?rand(88,97):rand(58,88))*10)/10;
  }else if(gameIndex===35){
    state.records.bikeJump[p.id]=Math.round((ultra?rand(1720,1975):rand(820,1760))*10)/10;
  }else if(gameIndex===36){
    state.records.trampoline[p.id]=Math.round((ultra?rand(1660,1965):rand(850,1690))*10)/10;
  }else if(gameIndex===37){
    state.records.mobTrain[p.id]=ultra?randi(2750,3350):randi(3300,5200);
  }else if(gameIndex===38){
    state.records.giantMob[p.id]=ultra?randi(23,30):randi(10,22);
  }else if(gameIndex===39){
    state.records.wizardMob[p.id]=ultra?randi(18,23):randi(9,18);
  }else if(gameIndex===40){
    state.records.brawlerMob[p.id]=ultra?randi(9400,12800):randi(12200,21800);
  }else if(gameIndex===41){
    state.records.summonerMob[p.id]=ultra?randi(465,555):randi(290,485);
  }else if(gameIndex===42){
    state.records.blackjackMob[p.id]=ultra?randi(19,21):randi(13,20);
  }else if(gameIndex===43){
    state.records.mobIssen[p.id]=ultra?randi(255,294):randi(165,258);
  }else if(gameIndex===44){
    state.records.crowEscape[p.id]=Math.round((ultra?rand(16.8,20):rand(7.2,17.4))*100)/100;
  }else if(gameIndex===45){
    state.records.dancingMob[p.id]=ultra?randi(91,100):randi(58,92);
  }else if(gameIndex===46){
    state.records.guardianMob[p.id]=ultra?randi(86,100):randi(42,90);
  }else if(gameIndex===47){
    state.records.mob50m[p.id]=ultra?randi(4550,5300):randi(5350,8900);
  }else{
    const cpuHits=ultra?(Math.random()<.62?4:3):randi(1,3);
    state.records.sniperMob[p.id]=cpuHits*25;
  }

  return ultra;
}

// RANKING ------------------------------------------------
function performancePoints(gameIndex,v){
  if(gameIndex===0){
    if(v<=150)return 100;
    if(v<=300)return Math.round(100-(v-150)/150*50);
    if(v<=500)return Math.round(50-(v-300)/200*50);
    return 0;
  }
  if(gameIndex===1)return clamp(Math.round(v*10),0,100);
  if(gameIndex===2)return clamp(Math.round((6000-v)/3500*100),0,100);
  if(gameIndex===3)return clamp(Math.round((v/10)/2000*100),0,100);
  if(gameIndex===4)return clamp(Math.round(v/30*100),0,100);
  if(gameIndex===5)return clamp(Math.round((40-v)/39*100),0,100);
  if(gameIndex===6)return clamp(Math.round(v/20*100),0,100);
  if(gameIndex===7)return clamp(Math.round(v/25*100),0,100);
  if(gameIndex===8)return clamp(Math.round(v/10*100),0,100);
  if(gameIndex===9)return clamp(Math.round(v),0,100);
  if(gameIndex===10)return clamp(Math.round(((v/10)-200)/800*100),0,100);
  if(gameIndex===11)return clamp(Math.round((v-1000)/2000*100),0,100);
  if(gameIndex===12)return clamp(Math.round(v/30*100),0,100);
  if(gameIndex===13)return clamp(Math.round(v*10),0,100);
  if(gameIndex===14){
    if(v<=180)return 100;
    if(v<=210)return Math.round(100-(v-180)/30*10);
    if(v<=300)return Math.round(90-(v-210)/90*35);
    if(v<=500)return Math.round(55-(v-300)/200*55);
    return 0;
  }
  if(gameIndex===15)return clamp(Math.round(v),0,100);
  if(gameIndex===16)return clamp(Math.round((v/10)/700*100),0,100);
  if(gameIndex===17)return clamp(Math.round(v-900),0,100);
  if(gameIndex===18)return clamp(Math.round(v/12*100),0,100);
  if(gameIndex===19)return clamp(Math.round(v),0,100);
  if(gameIndex===20)return clamp(Math.round(v),0,100);
  if(gameIndex===21)return clamp(Math.round(100-v/150*100),0,100);
  if(gameIndex===22)return clamp(Math.round(v),0,100);
  if(gameIndex===23)return clamp(Math.round(100-v),0,100);
  if(gameIndex===24)return v>=9000?0:clamp(Math.round(100-v/10),0,100);
  if(gameIndex===25)return [100,75,50,25,0][Math.min(4,Math.round(v))];
  if(gameIndex===26)return v>=900?0:clamp(Math.round(100-v/10*100),0,100);
  if(gameIndex===27){
    if(v>=900)return 0;
    if(v<=150)return 100;
    if(v<=300)return Math.round(100-(v-150)/150*50);
    if(v<=500)return Math.round(50-(v-300)/200*50);
    return 0;
  }
  if(gameIndex===28)return clamp(Math.round(v/100),0,100);
  if(gameIndex===29)return clamp(Math.round(v),0,100);
  if(gameIndex===30)return clamp(Math.round(v/500*100),0,100);
  if(gameIndex===31)return clamp(Math.round(v),0,100);
  if(gameIndex===32)return clamp(Math.round(v/20*100),0,100);
  if(gameIndex===33)return clamp(Math.round(v),0,100);
  if(gameIndex===34)return clamp(Math.round(v),0,100);
  if(gameIndex===35)return clamp(Math.round(v/2000*100),0,100);
  if(gameIndex===36)return clamp(Math.round(v/2000*100),0,100);
  if(gameIndex===37){
    if(v>=90000)return 0;
    if(v<=2800)return 100;
    if(v>=6000)return 0;
    return clamp(Math.round((6000-v)/3200*100),0,100);
  }
  if(gameIndex===38)return clamp(Math.round(v/30*100),0,100);
  if(gameIndex===39)return clamp(Math.round(v/20*100),0,100);
  if(gameIndex===40){
    if(v<=10000)return 100;
    if(v>=25000)return 0;
    return clamp(Math.round((25000-v)/15000*100),0,100);
  }
  if(gameIndex===41)return clamp(Math.round(v/500*100),0,100);
  if(gameIndex===42)return clamp(Math.round(v/21*100),0,100);
  if(gameIndex===43)return clamp(Math.round(v/300*100),0,100);
  if(gameIndex===44)return clamp(Math.round(v/20*100),0,100);
  if(gameIndex===45)return clamp(Math.round(v),0,100);
  if(gameIndex===46)return clamp(Math.round(v),0,100);
  if(gameIndex===47){
    if(v<=4500)return 100;
    if(v>=12500)return 0;
    return clamp(Math.round((12500-v)/8000*100),0,100);
  }
  return clamp(Math.round(v),0,100);
}

function rankRecords(gameIndex){
  const key=GAMES[gameIndex].key,records=state.records[key],ascRaw=(gameIndex===0||gameIndex===2||gameIndex===5||gameIndex===14||gameIndex===21||gameIndex===23||gameIndex===24||gameIndex===25||gameIndex===26||gameIndex===27||gameIndex===37||gameIndex===40||gameIndex===47);
  const arr=participants().map(p=>({p,value:records[p.id]}));
  if(mode().performance){
    arr.forEach(e=>e.points=performancePoints(gameIndex,e.value));
    arr.sort((a,b)=>b.points-a.points || (ascRaw?a.value-b.value:b.value-a.value));
    let last=null,lastRank=0;arr.forEach((e,i)=>{e.rank=i>0&&e.points===last?lastRank:i+1;last=e.points;lastRank=e.rank});
  }else{
    arr.sort((a,b)=>ascRaw?a.value-b.value:b.value-a.value);let last=null,lastRank=0;
    arr.forEach((e,i)=>{const same=i>0&&e.value===last;e.rank=same?lastRank:i+1;e.points=mode().points[e.rank-1]??0;last=e.value;lastRank=e.rank});
  }
  return arr;
}
function formatRecord(gameIndex,v){
  if(gameIndex===0)return `${(v/1000).toFixed(4)}秒`;
  if(gameIndex===1)return `${v}/10`;
  if(gameIndex===2)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===3)return `${(v/10).toFixed(1)}m`;
  if(gameIndex===4)return `${v}体`;
  if(gameIndex===5)return `世界${v}位`;
  if(gameIndex===6)return `${v}回`;
  if(gameIndex===7)return `${v}箱`;
  if(gameIndex===8)return `${v} VALUE`;
  if(gameIndex===9)return `${v}%`;
  if(gameIndex===10)return `${(v/10).toFixed(1)}m`;
  if(gameIndex===11)return `${v} COIN`;
  if(gameIndex===12)return `${v}回`;
  if(gameIndex===13)return `${v}/10`;
  if(gameIndex===14)return `${(v/1000).toFixed(3)}秒`;
  if(gameIndex===15)return `${v}pt`;
  if(gameIndex===16)return `${(v/10).toFixed(1)}m`;
  if(gameIndex===17)return `¥${v}使用`;
  if(gameIndex===18)return `${v}体`;
  if(gameIndex===19)return `${v}pt`;
  if(gameIndex===20)return `${Number(v).toFixed(1)}%`;
  if(gameIndex===21)return `${(v/1000).toFixed(3)}秒`;
  if(gameIndex===22)return `${Number(v).toFixed(1)}pt`;
  if(gameIndex===23)return `${Number(v).toFixed(1)}%`;
  if(gameIndex===24)return v>=9000?`CRASH`:`誤差${(v/1000).toFixed(3)}秒`;
  if(gameIndex===25)return v===0?`PERFECT`:`誤差${v}人`;
  if(gameIndex===26)return v>=900?`CRASH`:`${Number(v).toFixed(1)}m`;
  if(gameIndex===27)return v>=900?`FOUL`:`${(v/1000).toFixed(4)}秒`;
  if(gameIndex===28)return `${Math.round(v)}pt`;
  if(gameIndex===29)return `${Number(v).toFixed(1)}%`;
  if(gameIndex===30)return `${Math.round(v)}m`;
  if(gameIndex===31)return `${Math.round(v)}pt`;
  if(gameIndex===32)return `${Math.round(v)}体`;
  if(gameIndex===33)return `${Number(v).toFixed(1)}km`;
  if(gameIndex===34)return `${Number(v).toFixed(1)}%`;
  if(gameIndex===35)return `${Number(v).toFixed(1)}m`;
  if(gameIndex===36)return `${Number(v).toFixed(1)}m`;
  if(gameIndex===37)return v>=90000?`CRASH`:`${(v/1000).toFixed(2)}秒`;
  if(gameIndex===38)return `${Math.round(v)}棟`;
  if(gameIndex===39)return `${Math.round(v)}個`;
  if(gameIndex===40)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===41)return `${Math.round(v)}体`;
  if(gameIndex===42)return `${Math.round(v)}/21`;
  if(gameIndex===43)return `${Math.round(v)}/300pt`;
  if(gameIndex===44)return `${Number(v).toFixed(2)}秒`;
  if(gameIndex===45)return `${Math.round(v)}pt`;
  if(gameIndex===46)return `${Math.round(v)}pt`;
  if(gameIndex===47)return `${(v/1000).toFixed(2)}秒`;
  return `${Math.round(v)}pt`;
}

function applyPoints(gameIndex,ranked){
  const gp={};
  ranked.forEach(e=>{
    gp[e.p.id]=e.points;
    state.total[e.p.id]=(state.total[e.p.id]||0)+e.points;
  });
  state.roundPoints[state.roundIndex]=gp;
}
function competitionRankTotals(){const arr=participants().map(p=>({p,points:state.total[p.id]||0})).sort((a,b)=>b.points-a.points);let last=null,lastRank=0;arr.forEach((e,i)=>{e.rank=i>0&&e.points===last?lastRank:i+1;last=e.points;lastRank=e.rank});return arr}
function teamTotals(){if(!mode().team)return null;const sum=t=>mode().teams[t].reduce((s,id)=>s+(state.total[id]||0),0);return {A:sum("A"),B:sum("B")}}
function finishGame(gameIndex){const ranked=rankRecords(gameIndex);applyPoints(gameIndex,ranked);renderGameResult(gameIndex,ranked)}
function renderGameResult(gameIndex,ranked){
  clearGameFit();
  const totals=competitionRankTotals(),tt=teamTotals(),g=GAMES[gameIndex],scoreMode=mode().performance;
  const hasNext=state.roundIndex+1<state.playlist.length;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">ROUND ${state.roundIndex+1} COMPLETE</span><h2>${g.title} RESULT</h2></div>
      <div class="game-badge">${state.roundIndex+1}/${state.playlist.length}</div>
    </div>

    <section class="panel">
      <h3>${scoreMode?"GAME SCORE":"GAME RANKING"}</h3>
      <div class="rank-list">
        ${ranked.map(e=>rankRow(e.p,e.rank,formatRecord(gameIndex,e.value),scoreMode?`${e.points}/100 pt`:`+${e.points}pt`)).join("")}
      </div>
    </section>

    <section class="panel">
      <h3>OVERALL</h3>
      <div class="rank-list">
        ${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,scoreMode?`MAX ${maxScoreTotal()}`:(mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER")))).join("")}
      </div>
    </section>

    ${tt?`<section class="panel"><h3>TEAM TOTAL</h3><div class="team-total"><div class="team-box a"><span>${mode().teamNames.A}</span><b>${tt.A}pt</b></div><div class="team-box b"><span>${mode().teamNames.B}</span><b>${tt.B}pt</b></div></div></section>`:""}

    <button id="resultNext" class="primary">${hasNext?`NEXT / ${GAMES[state.playlist[state.roundIndex+1]].title}`:"FINAL RESULT"}</button>
  `;

  gameTop();

  document.getElementById("resultNext").addEventListener("click",()=>{
    if(hasNext){
      state.roundIndex++;
      showGameIntro(state.playlist[state.roundIndex]);
    }else{
      renderFinal();
    }
  });
}

function rankRow(p,rank,record,badge){const tier=p.cpu&&!state.freePlay?state.cpuTier[`${state.roundIndex}:${p.id}`]:null;return `<div class="rank-row"><div class="rank-place">${rank}位</div>${imgTag(p)}<div class="rank-name">${esc(p.name)}<span>${p.cpu?"CPU":`PLAYER ${p.no}`}${mode().team?` / ${teamName(p.id)}`:""}${tier==="SUPER"?" / SUPER CPU":""}</span></div><div class="rank-score"><b>${record}</b><span class="point-badge">${badge}</span></div></div>`}

function renderFinal(){
  clearGameFit();
  const totals=competitionRankTotals(),tt=teamTotals();
  let winner="";

  if(tt)winner=tt.A===tt.B?"DRAW":tt.A>tt.B?`${mode().teamNames.A} WIN!`:`${mode().teamNames.B} WIN!`;
  else winner=`${totals[0].p.name} WIN!`;

  screen.innerHTML=`
    <div class="champion">
      <small>FINAL RESULT</small>
      <strong>${esc(winner)}</strong>
      ${tt
        ? `<span>${mode().teamNames.A} ${tt.A}pt　–　${tt.B}pt ${mode().teamNames.B}</span>`
        : `<span>${mode().performance?`${state.playlist.length}ゲーム合計 / MAX ${maxScoreTotal()}pt`:`${state.playlist.length}ゲーム 総合順位`}</span>`}
    </div>

    <section class="panel">
      <h3>FINAL RANKING</h3>
      <div class="rank-list">
        ${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER"))).join("")}
      </div>
    </section>

    <section class="panel">
      <h3>GAME SCORE</h3>
      <div class="game-list">
        ${state.playlist.map((gameIdx,round)=>`<div class="game-row">
          <div class="game-no">${round+1}</div>
          <div><b>${GAMES[gameIdx].title}</b><br><span>${participants().map(p=>`${p.cpu?p.name:`P${p.no}`}:${state.roundPoints[round]?.[p.id]??0}`).join(" / ")}</span></div>
          <span>pt</span>
        </div>`).join("")}
      </div>
    </section>

    <button id="replay" class="primary">同じ内容でもう一度</button>
    <div style="height:8px"></div>
    <button id="modeChange" class="secondary">モード選択へ</button>
  `;

  gameTop();

  document.getElementById("replay").addEventListener("click",()=>{
    const k=state.modeKey;
    const style=state.playStyle;
    const list=[...state.playlist];

    state=freshState();
    state.modeKey=k;
    state.playStyle=style;
    state.playlist=list;
    state.roundIndex=0;
    initTotals();
    renderModeLobby();
  });

  document.getElementById("modeChange").addEventListener("click",renderHome);
}

renderHome();
})();
