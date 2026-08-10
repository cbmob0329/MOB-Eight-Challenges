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
  {no:5,key:"stack",title:"グラグラモブくん",sub:"10秒で何体積めるか"},
  {no:6,key:"breakdance",title:"1990世界大会",sub:"4択から1990を見抜く"},
  {no:7,key:"crisis",title:"モブくん危機一髪",sub:"3体で足元エネルギーを連続回避"},
  {no:8,key:"factory",title:"モブくん人形大人気",sub:"10秒で箱詰め・封印を量産"},
  {no:9,key:"catcher",title:"モブくんキャッチャー",sub:"多種モブくんをUFOキャッチ"},
  {no:10,key:"tidy",title:"モブくん整理整頓",sub:"7体を見本の部屋へ近づける"},
  {no:11,key:"ski",title:"モブくんスキージャンプ",sub:"踏切タイミングで最大1km"},
  {no:12,key:"slot",title:"モブくんスロット",sub:"キャラクタースロットでコイン勝負"},
  {no:13,key:"rope",title:"モブ跳び",sub:"横から走ってくるモブくんを飛び越える"},
  {no:14,key:"pk",title:"モブくんPK",sub:"10本のシュートを止める"},
  {no:15,key:"rhythm",title:"モブくんリズムタップ",sub:"TAP表示のタイミングに合わせる"},
  {no:16,key:"cut",title:"モブくんカットゲーム",sub:"指定%を感覚で切り分ける"},
  {no:17,key:"climb",title:"モブくん木登り",sub:"中央タップで10秒登る"},
  {no:18,key:"errand",title:"お使いモブくん",sub:"1000円を10秒で使い切る"},
  {no:19,key:"dontHitMob",title:"モブくんを叩かないで",sub:"モグラだけを叩く10秒勝負"},
  {no:20,key:"mobStop",title:"モブくんストップ",sub:"棒のギリギリで止める"}
];

const MODES={
  solo4:{name:"4人 個人戦",short:"プレイヤー4人",participants:["p1","p2","p3","p4"],team:false,points:[5,3,1,0]},
  solo8:{name:"8人 個人戦",short:"プレイヤー4人 + CPU4人",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  tag:{name:"2対2 タッグ",short:"P1・P2 VS P3・P4",participants:["p1","p2","p3","p4"],team:true,points:[5,3,1,0],teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  humansVsCpu:{name:"4人 VS CPU4人",short:"PLAYER TEAM VS CPU TEAM",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:true,points:[10,8,6,4,3,2,1,0],teams:{A:["p1","p2","p3","p4"],B:["c5","c6","c7","c8"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  score4:{name:"100点 スコアバトル",short:"各ゲーム0〜100点の合計勝負",participants:["p1","p2","p3","p4"],team:false,points:[],performance:true},

  soloCpu7:{name:"1人 VS CPU7人",short:"PLAYER 1人 + CPU7人",participants:["p1","c2","c3","c4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},

  scoreTag:{
    name:"100点 タッグバトル",
    short:"P1・P2 VS P3・P4 / 各ゲーム0〜100点",
    participants:["p1","p2","p3","p4"],
    team:true,
    points:[],
    performance:true,
    teams:{A:["p1","p2"],B:["p3","p4"]},
    teamNames:{A:"P1 + P2",B:"P3 + P4"}
  },

  free:{name:"1人フリープレイ",short:"好きなゲームだけ遊ぶ",participants:["p1"],team:false,points:[0]}
};

let state=freshState();
let audioCtx=null;
let activeAnimation=null;
let countdownSerial=0;
let activeCountdownLayer=null;

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
      crisis:{},factory:{},catcher:{},tidy:{},ski:{},slot:{},rope:{},pk:{},rhythm:{},cut:{},climb:{},errand:{},dontHitMob:{},mobStop:{}
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
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
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
  cancelCountdown();
  renderHome();
});
resetBtn.addEventListener("click",()=>{
  cancelActiveAnimation();
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
  cancelCountdown();
  state=freshState();
  screen.innerHTML=`
    <section class="hero">
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>20 MINI<br>GAMES</h1><p>20種のミニゲーム。各モードでNORMALかCUSTOMを選んで遊べます。</p></div>
      <div class="hero-mark">MOB</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>MODE SELECT</h3><span class="tag">7 MODES</span></div>
      <div class="mode-grid">
        <button class="mode-card" data-mode="solo4"><span class="mode-no">MODE 01</span><b>4人 個人戦</b><span>プレイヤー1〜4で個人順位を競う</span></button>
        <button class="mode-card" data-mode="solo8"><span class="mode-no">MODE 02</span><b>8人 個人戦</b><span>プレイヤー4人 + CPU4人</span></button>
        <button class="mode-card" data-mode="tag"><span class="mode-no">MODE 03</span><b>2対2 タッグ</b><span>P1・P2 VS P3・P4</span></button>
        <button class="mode-card" data-mode="humansVsCpu"><span class="mode-no">MODE 04</span><b>4人 VS CPU4人</b><span>PLAYER TEAM VS CPU TEAM</span></button>
        <button class="mode-card score-mode-card" data-mode="score4"><span class="mode-no">MODE 05</span><b>100点 スコアバトル</b><span>各ゲーム0〜100点 / 選択ゲーム数で最大点が変化</span></button>
        <button class="mode-card" data-mode="soloCpu7"><span class="mode-no">MODE 06</span><b>1人 VS CPU7人</b><span>P1ひとりでCPU7人に挑戦</span></button>
        <button class="mode-card score-mode-card" data-mode="scoreTag"><span class="mode-no">MODE 07</span><b>100点 タッグバトル</b><span>P1・P2 VS P3・P4 / 得点合計勝負</span></button>
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
  initTotals();
  renderPlayStyleSelect();
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
        <small>GAME 1 → 20 を順番にプレイ</small>
      </button>
      <button id="customStyle" class="style-select-card custom" type="button">
        <span>CUSTOM</span>
        <b>自由にゲーム選択</b>
        <small>重複OK / 3〜10ゲーム</small>
      </button>
    </div>

    <section class="panel flat">
      <h3>20 MINI GAMES</h3>
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
      <div><b>モブくんリズムタップ</b><span>リズム精度0〜100</span></div>
      <div><b>モブくんカットゲーム</b><span>3回の誤差から0〜100</span></div>
      <div><b>モブくん木登り</b><span>700m以上=100 / 0m=0</span></div>
      <div><b>お使いモブくん</b><span>残金0円=100 / 10円=90 / 100円以上=0</span></div>
      <div><b>モブくんを叩かないで</b><span>モグラ12体以上=100 / MOBを叩くと終了</span></div>
      <div><b>モブくんストップ</b><span>右端ギリギリ=100 / 落下=0</span></div>
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

    <section class="panel flat"><h3>PLAY ORDER</h3><p class="lead">プレイヤー1 → 2 → 3 → 4${cpus().length?" → CPUは高速処理":""}</p></section>
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
    "TAP表示とのタイミング精度0〜100点",
    "3回のカット精度を0〜100点化",
    "700m以上=100点 / 0m=0点",
    "残金0円=100点 / 残金10円=90点 / 残金100円以上=0点",
    "モグラ12体以上=100点 / 0体=0点",
    "棒の端に近いほど高得点 / 落下=0点"
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
    rules=`<li>4人のモブくんが4拍ジャンプしてテンポを提示。</li><li>お手本のリズムを見た後はカウントダウンなし。</li><li>本番前にも4人が4拍ジャンプ。</li><li>押すべきキャラにTAP表示が出るので、その瞬間に近いほど高得点。</li><li>全3ROUND、後半ほど少し速くなり順番が長くなります。</li>`;
  }else if(index===15){
    rules=`<li>「右側を○%残せ！」と表示。</li><li>長い棒を縦スワイプしてカット。</li><li>右側に残った割合と指定%の誤差を判定。</li><li>3回の平均精度で0〜100点。</li>`;
  }else if(index===16){
    rules=`<li>3・2・1後、10秒間木登り。</li><li>短いゲージのマーカーが左右へ移動。</li><li>中央に近い時ほど1タップで大きく登ります。</li><li>700m以上で100点。</li>`;
  }else if(index===17){
    rules=`<li>1000円を持って3・2・1スタート。</li><li>食材・お菓子など100種類から毎回30商品。</li><li>3円〜250円の商品をタップ購入。</li><li>10秒で1000円ぴったり使い切れば100点。</li>`;
  }else if(index===18){
    rules=`<li>3・2・1後、9個の穴からモグラが出現。</li><li>1〜6体が一気に出ることがあります。</li><li>モグラをタップすると+1。</li><li>モグラと一緒にモブくんが混ざって出ることもあります。</li><li>モブくんを1回でも叩いたらその場で終了。</li><li>10秒。モグラ12体以上で100点。</li>`;
  }else{
    rules=`<li>横長の棒の左端にモブくん。</li><li>モブくんを左へ引っ張り、離すと発射。</li><li>引っ張る距離が長いほど遠くへ進みます。</li><li>右端ギリギリで止めるほど高得点。</li><li>棒から落ちたら0点。</li>`;
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
    if(gameIndex===0)startReaction(p,humanIndex);
    else if(gameIndex===1)startMemory(p,humanIndex);
    else if(gameIndex===2)startPuzzle(p,humanIndex);
    else if(gameIndex===3)startLaunch(p,humanIndex);
    else if(gameIndex===4)startStack(p,humanIndex);
    else if(gameIndex===5)startGanbareMob(p,humanIndex);
    else if(gameIndex===6)startCrisis(p,humanIndex);
    else if(gameIndex===7)startFactory(p,humanIndex);
    else if(gameIndex===8)startCatcher(p,humanIndex);
    else if(gameIndex===9)startTidy(p,humanIndex);
    else if(gameIndex===10)startSkiJump(p,humanIndex);
    else if(gameIndex===11)startMobSlot(p,humanIndex);
    else if(gameIndex===12)startJumpRope(p,humanIndex);
    else if(gameIndex===13)startPK(p,humanIndex);
    else if(gameIndex===14)startRhythmTap(p,humanIndex);
    else if(gameIndex===15)startCutGame(p,humanIndex);
    else if(gameIndex===16)startTreeClimb(p,humanIndex);
    else if(gameIndex===17)startErrand(p,humanIndex);
    else if(gameIndex===18)startDontHitMob(p,humanIndex);
    else startMobStop(p,humanIndex);
  },{once:true});
}

async function countdown(label="COUNTDOWN"){
  cancelCountdown();
  const serial=++countdownSerial;

  const layer=document.createElement("div");
  layer.className="countdown-layer";
  layer.innerHTML=`<div class="count-label">${label}</div><div class="count-number">3</div>`;
  document.body.appendChild(layer);
  activeCountdownLayer=layer;

  const n=layer.querySelector(".count-number");

  for(const v of [3,2,1]){
    if(serial!==countdownSerial||!layer.isConnected)return false;

    n.textContent=v;
    beep(310+(3-v)*85,80);
    await wait(620);
  }

  if(serial!==countdownSerial||!layer.isConnected)return false;

  n.textContent="GO!";
  beep(710,100);
  await wait(300);

  if(serial!==countdownSerial||!layer.isConnected)return false;

  layer.remove();
  if(activeCountdownLayer===layer)activeCountdownLayer=null;
  return true;
}

function playBadge(humanIndex){
  return state.freePlay ? "SOLO" : `${humanIndex+1}/${humans().length}`;
}

// GAME 1 -------------------------------------------------
async function startReaction(p,humanIndex){
  gameFit();
  screen.innerHTML=`<section class="reaction-stage"><div><span class="kicker">${esc(p.name)}</span><h2>反射神経</h2></div><div id="reactionZone" class="reaction-zone"><div class="wait-dots">•••</div></div><p class="hint">モブくんが出た瞬間にタップ。0.0001秒単位で表示します。</p></section>`;
  await countdown();
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
async function startMemory(p,humanIndex){
  gameFit();
  const ids=shuffle(Array.from({length:10},(_,i)=>i+1));const seq=shuffle([...ids]);let input=0,active=false;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>記憶力ゲーム</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="memory-status"><div class="stat-box"><span>PHASE</span><b id="memPhase">WATCH</b></div><div class="stat-box"><span>CORRECT</span><b id="memCount">0 / 10</b></div></div><div id="memoryBoard" class="memory-board">${ids.map(id=>`<button type="button" class="memory-tile" data-id="${id}"><img src="icon/${String(id).padStart(2,"0")}.png" alt="icon ${id}" onerror="this.style.visibility='hidden'"></button>`).join("")}</div><p id="memHint" class="hint">3・2・1のあと、光る順番を覚えてください。</p>`;
  const board=document.getElementById("memoryBoard"),phase=document.getElementById("memPhase"),count=document.getElementById("memCount"),hint=document.getElementById("memHint");const tile=id=>board.querySelector(`[data-id="${id}"]`);
  await countdown("WATCH");
  for(const id of seq){if(!document.body.contains(board))return;tile(id).classList.add("showing");beep(400+id*18,55,.018);await wait(390);tile(id).classList.remove("showing");await wait(125)}
  phase.textContent="READY";hint.textContent="次の3・2・1のあと、同じ順番でタップ。";await wait(300);await countdown("TAP");phase.textContent="TAP";hint.textContent="光った順にタップしてください。";active=true;
  board.addEventListener("pointerdown",async e=>{const t=e.target.closest(".memory-tile");if(!t||!active)return;const id=Number(t.dataset.id);if(id===seq[input]){t.classList.add("correct");setTimeout(()=>t.classList.remove("correct"),170);beep(730,45,.02);input++;count.textContent=`${input} / 10`;if(input===10){active=false;state.records.memory[p.id]=10;await wait(240);recordScreen(1,p,humanIndex,`10<small>/10</small>`)}}else{active=false;t.classList.add("wrong");beep(170,160,.03);state.records.memory[p.id]=input;hint.textContent="MISS";await wait(430);recordScreen(1,p,humanIndex,`${input}<small>/10</small>`)}});
}

// GAME 3 -------------------------------------------------
async function startPuzzle(p,humanIndex){
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

  await countdown("NUMBER 12");
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
async function startLaunch(p,humanIndex){
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
async function startStack(p,humanIndex){
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
    stackLayer.innerHTML=stacked.map((it,i)=>`<div class="stack-piece placed" style="left:${it.x-pieceW/2}px;bottom:${baseBottom+i*pieceH}px;transform:rotate(${it.rot}deg)"></div>`).join("");
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
    active={x:clamp(sw*.5+rand(-sw*.16,sw*.16),pieceW/2+8,sw-pieceW/2-8),y:58};

    if(waitingDock)waitingDock.classList.add("active");
    activeLayer.innerHTML=`<div id="activeStackPiece" class="stack-piece active v8-active visible-waiting-mob" role="button" aria-label="待機中のモブくん" style="left:${active.x-pieceW/2}px;top:${active.y}px"></div>`;
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
    stacked.push({x:localX,rot:clamp(offset*.075+towerWobbleRot*.16,-6,6)});
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
  await countdown("10 SECOND STACK");
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

async function startGanbareMob(p,humanIndex){
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

  await countdown("1990");
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
async function startCrisis(p,humanIndex){
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

  await countdown("LOW ENERGY");
  if(!document.body.contains(stage))return;
  runWave();
}

// GAME 8 -------------------------------------------------
async function startFactory(p,humanIndex){
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

  await countdown("FACTORY");
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
async function startCatcher(p,humanIndex){
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

async function startTidy(p,humanIndex){
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

  await countdown("TIDY ROOM");
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

async function startSkiJump(p,humanIndex){
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

  await countdown("SKI JUMP");
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

async function startMobSlot(p,humanIndex){
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

  await countdown("SLOT");
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
async function startJumpRope(p,humanIndex){
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
    const fromRight=Math.random()<.62;
    const slow=Math.random()<.16;

    const normalSpeed=Math.min(1760,520+count*46);
    const speed=slow?rand(290,460):normalSpeed*rand(.92,1.08);
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

  await countdown("MOB JUMP");
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
async function startPK(p,humanIndex){
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

  await countdown("PK");
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
function makeRhythmPattern(round){
  const settings=[
    {count:4,beat:680},
    {count:5,beat:590},
    {count:6,beat:510}
  ];

  const cfg=settings[round];

  return {
    chars:Array.from({length:cfg.count},()=>randi(0,3)),
    beat:cfg.beat
  };
}

async function startRhythmTap(p,humanIndex){
  gameFit();

  let totalScore=0;
  let totalEvents=0;

  screen.innerHTML=`<div class="rhythm-shell rhythm-shell-v88">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんリズムタップ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="rhythm-hud">
      <div><span>ROUND</span><b id="rhythmRound">1 / 3</b></div>
      <div><span>SCORE</span><b id="rhythmScore">0</b></div>
    </div>

    <div id="rhythmCharacters" class="rhythm-characters rhythm-row-v88">
      ${[1,2,3,4].map((id,i)=>`
        <button class="rhythm-mob rhythm-mob-v88" data-rhythm="${i}" type="button" style="background-image:url('icon/${String(id).padStart(2,"0")}.png')">
          <span class="rhythm-tap-badge">TAP</span>
        </button>`).join("")}
    </div>

    <div id="rhythmMessage" class="rhythm-message">WATCH</div>
  </div>`;

  const area=document.getElementById("rhythmCharacters");
  const mobs=[...screen.querySelectorAll(".rhythm-mob")];
  const roundEl=document.getElementById("rhythmRound");
  const scoreEl=document.getElementById("rhythmScore");
  const message=document.getElementById("rhythmMessage");

  function bounceOne(index,cls="bounce"){
    const mob=mobs[index];
    mob.classList.remove("bounce","tap-bounce","group-bounce");
    void mob.offsetWidth;
    mob.classList.add(cls);
    setTimeout(()=>mob.classList.remove(cls),190);
  }

  function clearTapCues(){
    mobs.forEach(m=>m.classList.remove("tap-cue","cue-hit","cue-miss"));
  }

  async function fourBeatCountIn(beat,label){
    message.textContent=label;

    for(let n=1;n<=4;n++){
      mobs.forEach(mob=>{
        mob.classList.remove("group-bounce");
        void mob.offsetWidth;
        mob.classList.add("group-bounce");
        setTimeout(()=>mob.classList.remove("group-bounce"),190);
      });

      message.textContent=`${n} / 4`;
      beep(440,42,.012);

      // 4拍目のあとに余計な1拍を待たない。
      // これで4回目のジャンプ直後に次のフェーズへ移る。
      if(n<4)await wait(beat);
    }
  }

  async function playSample(pattern){
    message.textContent="WATCH";

    for(let i=0;i<pattern.chars.length;i++){
      bounceOne(pattern.chars[i],"bounce");
      beep(520+pattern.chars[i]*60,40,.012);

      // 全て完全に同じ一定テンポ。
      if(i<pattern.chars.length-1)await wait(pattern.beat);
    }
  }

  async function waitForTimedTap(target,cueTime,windowMs){
    return new Promise(resolve=>{
      let resolved=false;

      const finish=(score,hitMob=null)=>{
        if(resolved)return;
        resolved=true;
        clearTimeout(timeout);
        area.removeEventListener("pointerdown",handler);

        mobs[target].classList.remove("tap-cue");

        if(hitMob!==null){
          const hit=mobs[hitMob];
          hit.classList.add(score>0?"cue-hit":"cue-miss");
          setTimeout(()=>hit.classList.remove("cue-hit","cue-miss"),150);
        }

        resolve(score);
      };

      const handler=e=>{
        const btn=e.target.closest(".rhythm-mob");
        if(!btn)return;
        e.preventDefault();

        const char=Number(btn.dataset.rhythm);

        // 本番では「実際にタップした時だけ」キャラクターが跳ねる。
        bounceOne(char,"tap-bounce");

        if(char!==target){
          beep(180,40,.012);
          finish(0,char);
          return;
        }

        const error=Math.abs(performance.now()-cueTime);

        // TAP表示の瞬間に近いほど高得点。
        // 0ms=100 / 60ms≈90 / 120ms≈75 / 200ms≈50 / 300ms≈20
        const timingScore=clamp(
          Math.round(100-Math.pow(error/300,.82)*80),
          0,100
        );

        beep(560+timingScore*3.2,32,.012);
        finish(timingScore,char);
      };

      area.addEventListener("pointerdown",handler,{passive:false});
      const timeout=setTimeout(()=>finish(0,null),windowMs);
    });
  }

  async function playUserTurn(pattern){
    clearTapCues();
    message.textContent="YOUR TURN";

    let roundScore=0;
    const turnStart=performance.now();

    for(let i=0;i<pattern.chars.length;i++){
      // Cue times are absolute, so user response speed cannot change the tempo.
      const targetTime=turnStart+i*pattern.beat;
      const waitToCue=Math.max(0,targetTime-performance.now());

      if(waitToCue>0)await wait(waitToCue);

      const target=pattern.chars[i];
      const targetMob=mobs[target];
      const cueTime=performance.now();

      clearTapCues();
      targetMob.classList.add("tap-cue");

      // IMPORTANT: no automatic bounce here.
      // It only jumps if the user actually taps it.

      const inputWindow=Math.min(360,pattern.beat*.68);
      const eventStart=performance.now();
      const eventScore=await waitForTimedTap(target,cueTime,inputWindow);
      const spent=performance.now()-eventStart;

      roundScore+=eventScore;
      totalScore+=eventScore;
      totalEvents++;
      scoreEl.textContent=Math.round(totalScore/Math.max(1,totalEvents));

      // Keep the next cue on the same exact beat even if the player tapped early.
      const nextTime=turnStart+(i+1)*pattern.beat;
      if(i<pattern.chars.length-1){
        const rest=Math.max(0,nextTime-performance.now());
        if(rest>0)await wait(rest);
      }
    }

    clearTapCues();
    return Math.round(roundScore/pattern.chars.length);
  }

  for(let round=0;round<3;round++){
    roundEl.textContent=`${round+1} / 3`;
    const pattern=makeRhythmPattern(round);

    mobs.forEach(b=>b.disabled=true);

    // Round opening only.
    const ok=await countdown(`ROUND ${round+1}`);
    if(!ok||!document.body.contains(area))return;

    await fourBeatCountIn(pattern.beat,"SAMPLE BEAT");
    await playSample(pattern);

    // お手本後はカウントダウン無し。
    // 1拍だけ間を置いて本番用の4拍へ。その4拍目の直後に即スタート。
    await wait(pattern.beat);
    await fourBeatCountIn(pattern.beat,"YOUR BEAT");

    mobs.forEach(b=>b.disabled=false);
    const roundResult=await playUserTurn(pattern);
    mobs.forEach(b=>b.disabled=true);

    message.textContent=`ROUND ${round+1} ${roundResult}pt`;
    await wait(500);
  }

  const score=clamp(Math.round(totalScore/Math.max(1,totalEvents)),0,100);
  state.records.rhythm[p.id]=score;
  recordScreen(14,p,humanIndex,`${score}<small>pt</small>`,`SEQUENCE TIMING`);
}

// GAME 16 -------------------------------------------------
async function startCutGame(p,humanIndex){
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
async function startTreeClimb(p,humanIndex){
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
  </div>`;

  const timeEl=document.getElementById("climbTime");
  const distanceEl=document.getElementById("climbDistance");
  const world=document.getElementById("climbWorld");
  const mob=document.getElementById("climbMob");
  const gauge=document.getElementById("climbGauge");
  const marker=document.getElementById("climbMarker");

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
    if(now-lastTap<145)return;
    lastTap=now;

    const centerError=Math.abs(markerPos-.5)/.5;
    const quality=clamp(1-centerError,0,1);
    const gain=3+quality*25;

    distance+=gain;
    distanceEl.textContent=`${distance.toFixed(0)}m`;

    const y=distance*2.0;
    mob.style.bottom=`${45+y}px`;
    world.style.transform=`translateY(${Math.max(0,y-190)}px)`;

    gauge.classList.remove("hit");
    void gauge.offsetWidth;
    gauge.classList.add("hit");

    beep(400+quality*500,35,.015);
  },{passive:false});

  await countdown("CLIMB");
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

async function startErrand(p,humanIndex){
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

  await countdown("SHOPPING");
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
async function startDontHitMob(p,humanIndex){
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

  const ok=await countdown("DON'T HIT MOB");
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

async function startMobStop(p,humanIndex){
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

  await countdown("MOB STOP");
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



function recordScreen(gameIndex,p,humanIndex,main,sub=""){
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
  const chance=[0.12,0.10,0.14,0.16,0.12,0.13,0.14,0.12,0.15,0.12,0.14,0.13,0.13,0.14,0.12,0.12,0.13,0.12,0.13,0.14][gameIndex] ?? 0.12;
  return Math.random()<chance;
}

function simulateOneCpu(gameIndex,p){
  const ultra=cpuUltraDraw(gameIndex);
  state.cpuTier[`${state.roundIndex}:${p.id}`]=ultra?"SUPER":"STRONG";

  if(gameIndex===0){
    const bias={c5:8,c6:2,c7:12,c8:0}[p.id]||0;
    state.records.reaction[p.id]=ultra?randi(72,112):clamp(randi(125,230)+bias,118,245);
  }else if(gameIndex===1){
    const base={c5:9,c6:9,c7:8,c8:10}[p.id]||9;
    state.records.memory[p.id]=ultra?10:clamp(base+randi(-1,1),7,10);
  }else if(gameIndex===2){
    state.records.puzzle[p.id]=ultra?randi(1950,2350):randi(2500,4450);
  }else if(gameIndex===3){
    state.records.launch[p.id]=Math.round((ultra?rand(1840,2000):rand(1280,1900))*10);
  }else if(gameIndex===4){
    state.records.stack[p.id]=ultra?randi(23,31):randi(12,25);
  }else if(gameIndex===5){
    state.records.breakdance[p.id]=ultra?1:randi(1,12);
  }else if(gameIndex===6){
    state.records.crisis[p.id]=ultra?randi(24,34):randi(13,26);
  }else if(gameIndex===7){
    state.records.factory[p.id]=ultra?randi(25,32):randi(16,27);
  }else if(gameIndex===8){
    state.records.catcher[p.id]=ultra?randi(10,16):randi(4,12);
  }else if(gameIndex===9){
    state.records.tidy[p.id]=ultra?randi(93,100):randi(58,88);
  }else if(gameIndex===10){
    state.records.ski[p.id]=Math.round((ultra?rand(925,1000):rand(560,930))*10);
  }else if(gameIndex===11){
    state.records.slot[p.id]=ultra?randi(2900,4300):randi(1650,3300);
  }else if(gameIndex===12){
    state.records.rope[p.id]=ultra?randi(31,40):randi(18,32);
  }else if(gameIndex===13){
    state.records.pk[p.id]=ultra?randi(9,10):randi(5,9);
  }else if(gameIndex===14){
    state.records.rhythm[p.id]=ultra?randi(93,100):randi(65,92);
  }else if(gameIndex===15){
    state.records.cut[p.id]=ultra?randi(94,100):randi(60,92);
  }else if(gameIndex===16){
    state.records.climb[p.id]=Math.round((ultra?rand(690,830):rand(390,720))*10);
  }else if(gameIndex===17){
    state.records.errand[p.id]=ultra?randi(990,1000):randi(760,995);
  }else if(gameIndex===18){
    state.records.dontHitMob[p.id]=ultra?randi(12,16):randi(6,13);
  }else{
    state.records.mobStop[p.id]=ultra?randi(92,100):randi(48,94);
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
  if(gameIndex===14)return clamp(Math.round(v),0,100);
  if(gameIndex===15)return clamp(Math.round(v),0,100);
  if(gameIndex===16)return clamp(Math.round((v/10)/700*100),0,100);
  if(gameIndex===17)return clamp(Math.round(v-900),0,100);
  if(gameIndex===18)return clamp(Math.round(v/12*100),0,100);
  return clamp(Math.round(v),0,100);
}

function rankRecords(gameIndex){
  const key=GAMES[gameIndex].key,records=state.records[key],ascRaw=(gameIndex===0||gameIndex===2||gameIndex===5);
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
  if(gameIndex===14)return `${v}pt`;
  if(gameIndex===15)return `${v}pt`;
  if(gameIndex===16)return `${(v/10).toFixed(1)}m`;
  if(gameIndex===17)return `¥${v}使用`;
  if(gameIndex===18)return `${v}体`;
  return `${v}pt`;
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
