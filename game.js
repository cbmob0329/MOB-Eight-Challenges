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
  {id:"c5",no:5,name:"モブイタリアン",cpu:true,img:"play/05.PNG"},
  {id:"c6",no:6,name:"モブ中華店主",cpu:true,img:"play/06.PNG"},
  {id:"c7",no:7,name:"モブティラノ",cpu:true,img:"play/07.PNG"},
  {id:"c8",no:8,name:"モブスーパーマン",cpu:true,img:"play/08.PNG"}
];

const GAMES=[
  {no:1,key:"reaction",title:"反射神経",sub:"MOBを押すまでのタイム"},
  {no:2,key:"memory",title:"記憶力ゲーム",sub:"10枚の点灯順を記憶"},
  {no:3,key:"puzzle",title:"ナンバープレート12",sub:"1〜12を順番に消すタイムアタック"},
  {no:4,key:"launch",title:"フィギュア飛ばし",sub:"感覚で狙う最大2000m"},
  {no:5,key:"stack",title:"グラグラモブくん",sub:"10秒で何体積めるか"},
  {no:6,key:"breakdance",title:"1990世界大会",sub:"10秒で1990を見抜いて世界へ"},
  {no:7,key:"crisis",title:"モブくん危機一髪",sub:"3体で足元エネルギーを連続回避"},
  {no:8,key:"factory",title:"モブくん人形大人気",sub:"10秒で箱詰め・封印を量産"},
  {no:9,key:"catcher",title:"モブくんキャッチャー",sub:"位置・アーム幅・高さで景品をつかむ"},
  {no:10,key:"tidy",title:"モブくん整理整頓",sub:"7体を見本の部屋へ近づける"},
  {no:11,key:"ski",title:"モブくんスキージャンプ",sub:"踏切タイミングで最大1km"},
  {no:12,key:"slot",title:"モブくんスロット",sub:"10秒で1000コインを増やす"}
];

const MODES={
  solo4:{name:"4人 個人戦",short:"プレイヤー4人",participants:["p1","p2","p3","p4"],team:false,points:[5,3,1,0]},
  solo8:{name:"8人 個人戦",short:"プレイヤー4人 + CPU4人",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  tag:{name:"2対2 タッグ",short:"P1・P2 VS P3・P4",participants:["p1","p2","p3","p4"],team:true,points:[5,3,1,0],teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  humansVsCpu:{name:"4人 VS CPU4人",short:"PLAYER TEAM VS CPU TEAM",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:true,points:[10,8,6,4,3,2,1,0],teams:{A:["p1","p2","p3","p4"],B:["c5","c6","c7","c8"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  score4:{name:"100点 スコアバトル",short:"各ゲーム0〜100点の合計勝負",participants:["p1","p2","p3","p4"],team:false,points:[],performance:true},
  free:{name:"1人フリープレイ",short:"好きなゲームだけ遊ぶ",participants:["p1"],team:false,points:[0]}
};

let state=freshState();
let audioCtx=null;
let activeAnimation=null;

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
      crisis:{},factory:{},catcher:{},tidy:{},ski:{},slot:{}
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
function gameTop(){requestAnimationFrame(()=>{try{window.scrollTo(0,0)}catch(e){};screen.scrollTop=0;});}
function gameFit(){
  screen.classList.add("gameplay-fit");
  gameTop();
}
function clearGameFit(){
  screen.classList.remove("gameplay-fit");
}
function imgTag(p,cls="avatar"){return `<img draggable="false" class="${cls}" src="${p.img}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">`}

homeBtn.addEventListener("click",()=>{cancelActiveAnimation();renderHome()});
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
  state=freshState();
  screen.innerHTML=`
    <section class="hero">
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>12 MINI<br>GAMES</h1><p>12種のミニゲーム。各モードでNORMALかCUSTOMを選んで遊べます。</p></div>
      <div class="hero-mark">MOB</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>MODE SELECT</h3><span class="tag">5 MODES</span></div>
      <div class="mode-grid">
        <button class="mode-card" data-mode="solo4"><span class="mode-no">MODE 01</span><b>4人 個人戦</b><span>プレイヤー1〜4で個人順位を競う</span></button>
        <button class="mode-card" data-mode="solo8"><span class="mode-no">MODE 02</span><b>8人 個人戦</b><span>プレイヤー4人 + CPU4人</span></button>
        <button class="mode-card" data-mode="tag"><span class="mode-no">MODE 03</span><b>2対2 タッグ</b><span>P1・P2 VS P3・P4</span></button>
        <button class="mode-card" data-mode="humansVsCpu"><span class="mode-no">MODE 04</span><b>4人 VS CPU4人</b><span>PLAYER TEAM VS CPU TEAM</span></button>
        <button class="mode-card score-mode-card" data-mode="score4"><span class="mode-no">MODE 05</span><b>100点 スコアバトル</b><span>各ゲーム0〜100点 / 選択ゲーム数で最大点が変化</span></button>
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
        <small>GAME 1 → 12 を順番にプレイ</small>
      </button>
      <button id="customStyle" class="style-select-card custom" type="button">
        <span>CUSTOM</span>
        <b>自由にゲーム選択</b>
        <small>重複OK / 3〜10ゲーム</small>
      </button>
    </div>

    <section class="panel flat">
      <h3>12 MINI GAMES</h3>
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
    "1体=10点 / 10体以上=100点",
    "見本との一致率がそのまま0〜100点",
    "1000m=100点 / 200m以下=0点",
    "3000コイン以上=100点 / 1000コイン以下=0点"
  ][index];
}

function showGameIntro(index){
  clearGameFit();
  state.gameIndex=index;
  const g=GAMES[index];
  let rules="";

  if(index===0){
    rules=`<li>READY? → 3・2・1 → ランダム待機後、大きなMOBボタン。</li><li>0.001秒単位で計測。</li>`;
  }else if(index===1){
    rules=`<li>10枚が順番に光ります。</li><li>同じ順番でタップ。間違えた時点で終了。</li>`;
  }else if(index===2){
    rules=`<li>1〜12をランダム配置。</li><li>1 → 12の順番だけ入力可能。</li><li>12を消した瞬間のタイム。</li>`;
  }else if(index===3){
    rules=`<li>高速横ゲージ → 円形ゲージ。</li><li>横ゲージの両端約10%は「？」フィルターで見えません。</li><li>感覚で端を狙い、最大2000m。</li>`;
  }else if(index===4){
    rules=`<li>1体ずつつかんで積みます。</li><li>制限時間10秒。</li><li>時間が経つほど風が強くなり、手元もタワーもグラグラ。</li>`;
  }else if(index===5){
    rules=`<li>10秒間、毎回どちらか一方が1990。</li><li>1990=1周、5連続ごとにBONUS +1周。</li><li>罠は-1周。</li><li>25周以上で世界1位確定。</li>`;
  }else if(index===6){
    rules=`<li>3体を画面いっぱいに広く横一列に配置。</li><li>画面外の遠い位置から、足元の小さいエネルギーが接近。</li><li>同じエネルギーをP1 → P2 → P3が順番に1ジャンプで回避。</li><li>INCOMING予告あり。</li><li>成功するたび<strong>かなり大きく加速</strong>し、後半は素早い連続タップが必要。</li>`;
  }else if(index===7){
    rules=`<li>ベルトコンベアのMOB箱を10秒で完成。</li><li>空箱：人形 → 箱 → 箱で封。</li><li>人形入り箱は箱を1回タップ。</li><li>人形入り箱へさらに人形を入れたら不良品として箱ごと破棄。</li>`;
  }else if(index===8){
    rules=`<li>最初に動いているアーム幅ゲージをタップして停止。</li><li>次に左右でクレーン位置を決めて降下。</li><li>STOPで高さを決め、実際にアームを閉じます。</li><li>本当にアーム内へ入って保持できたモブくんだけを実物ごと持ち上げます。</li><li>広げすぎても大量取得できないよう、閉じる時のこぼれ判定があります。</li>`;
  }else if(index===9){
    rules=`<li>上の部屋が見本、下の部屋が自分の操作エリア。</li><li>見本の<strong>7体配置は毎回ランダム</strong>。</li><li>下の7体も毎回ランダムに散らばっています。</li><li>10秒でドラッグして見本へ近づけます。</li><li><strong>自動吸着なし</strong>。置いた位置そのままで一致率を計算。</li>`;
  }else if(index===10){
    rules=`<li>3・2・1で長いスロープを自動滑走。</li><li>踏切ラインへ来た瞬間を狙ってタップ。</li><li>成功すると大きく飛び、カメラがモブくんを追跡。</li><li>最高<strong>1000m</strong>。</li><li>100点モードは1000m=100点、200m以下=0点。</li>`;
  }else{
    rules=`<li>1000コインからスタート。1回100コイン。</li><li>SPINで3リール開始。STOP 1 → STOP 2 → STOP 3を自分で押します。</li><li>MMM / OOO / BBB = ×2、MOB = ×5、モブくん3つ = ×10。</li><li>最初の2リールはかなり揃いやすく補助。3リール目は目押し中心で、ときどき自動補助。</li><li>10秒後の所持コインで勝負。</li>`;
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
    else startMobSlot(p,humanIndex);
  },{once:true});
}

async function countdown(label="COUNTDOWN"){
  const layer=document.createElement("div");layer.className="countdown-layer";layer.innerHTML=`<div class="count-label">${label}</div><div class="count-number">3</div>`;document.body.appendChild(layer);const n=layer.querySelector(".count-number");
  for(const v of [3,2,1]){n.textContent=v;beep(310+(3-v)*85,80);await wait(620)}
  n.textContent="GO!";beep(710,100);await wait(300);layer.remove();
}

function playBadge(humanIndex){
  return state.freePlay ? "SOLO" : `${humanIndex+1}/${humans().length}`;
}

// GAME 1 -------------------------------------------------
async function startReaction(p,humanIndex){
  gameFit();
  screen.innerHTML=`<section class="reaction-stage"><div><span class="kicker">${esc(p.name)}</span><h2>反射神経</h2></div><div id="reactionZone" class="reaction-zone"><div class="wait-dots">•••</div></div><p class="hint">MOBが出た瞬間にタップ。0.001秒単位で記録します。</p></section>`;
  await countdown();
  const zone=document.getElementById("reactionZone");
  if(!zone)return;
  await wait(rand(650,1900));
  if(!document.body.contains(zone))return;

  const btn=document.createElement("button");
  btn.type="button";
  btn.className="mob-button";
  btn.textContent="MOB";
  zone.innerHTML="";
  zone.appendChild(btn);

  const t0=performance.now();
  btn.addEventListener("pointerdown",()=>{
    const ms=Math.max(1,Math.round(performance.now()-t0));
    state.records.reaction[p.id]=ms;
    beep(870,100);
    recordScreen(0,p,humanIndex,`${(ms/1000).toFixed(3)}<small>秒</small>`);
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

  // 1990を25周以上披露できたら世界大会優勝を確定。
  // 24周以下は毎回多少順位が変動する。
  let mobScore;
  if(laps>=25){
    const currentBest=Math.max(...entries.map(e=>e.score));
    mobScore=currentBest+5+rand(0,2);
  }else{
    // 目安:
    // 20～24周 = 世界上位～表彰台候補
    // 15～19周 = 中位～上位
    // 10～14周 = 中位中心
    mobScore=8+laps*.92+rand(-1.3,1.3);
  }

  entries.push({name:"MOB",score:mobScore,mob:true});
  entries.sort((a,b)=>b.score-a.score);
  entries.forEach((e,i)=>e.rank=i+1);
  return entries;
}

async function startGanbareMob(p,humanIndex){
  gameFit();
  let hits=0,streak=0,bonus=0,penalty=0,currentDecoy=null,targetSide=0,running=false,finished=false,lastDecoy="",endAt=0,pairLocked=false;

  screen.innerHTML=`<div class="ganbare-shell n1990-shell">
    <div class="ganbare-head"><div><span class="kicker">${esc(p.name)}</span><h2>1990世界大会</h2><p class="lead">1990だけを見抜いて押せ！</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="ganbare-hud n1990-hud">
      <div class="ganbare-time"><span>TIME</span><b id="ganbareTime">10.00</b></div>
      <div class="ganbare-count"><span>1990</span><b id="hitCount">0周</b></div>
      <div class="ganbare-count"><span>STREAK</span><b id="streakCount">0</b></div>
    </div>
    <div class="choice-arena n1990-arena"><button id="choiceLeft" class="choice-card left n1990-choice" type="button"><small>LEFT</small><b>1990</b></button><div class="choice-vs">OR</div><button id="choiceRight" class="choice-card right n1990-choice" type="button"><small>RIGHT</small><b>1991</b></button></div>
    <div class="ganbare-message"><b id="ganbareMessage">左右どちらかは必ず1990</b><span>5回連続で1990 → BONUS +1周 / 一部ニセ項目は -1周</span></div>
  </div>`;
  gameTop();

  const timeEl=document.getElementById("ganbareTime"),hitEl=document.getElementById("hitCount"),streakEl=document.getElementById("streakCount"),msg=document.getElementById("ganbareMessage"),left=document.getElementById("choiceLeft"),right=document.getElementById("choiceRight");

  function newPair(){
    let pool=NINETEEN90_DECOYS.filter(x=>x.name!==lastDecoy);if(!pool.length)pool=NINETEEN90_DECOYS;
    currentDecoy=pool[Math.floor(Math.random()*pool.length)];lastDecoy=currentDecoy.name;targetSide=Math.random()<.5?0:1;
    left.querySelector("b").textContent=targetSide===0?"1990":currentDecoy.name;right.querySelector("b").textContent=targetSide===1?"1990":currentDecoy.name;
    left.classList.remove("picked","wrong","bonus");right.classList.remove("picked","wrong","bonus");pairLocked=false;
  }
  function finalLaps(){return Math.max(0,hits+bonus-penalty)}
  function pick(side){
    if(!running||finished||pairLocked)return;pairLocked=true;const btn=side===0?left:right;
    if(side===targetSide){hits++;streak++;btn.classList.add("picked");let bonusNow=false;if(streak%5===0){bonus++;bonusNow=true;btn.classList.add("bonus");beep(920,85,.03)}else beep(680,45,.018);msg.textContent=bonusNow?`5連続！ BONUS +1周 / 現在 ${finalLaps()}周`:`1990！ 現在 ${finalLaps()}周`;
    }else{streak=0;btn.classList.add("wrong");if(currentDecoy.trap){penalty++;msg.textContent=`${currentDecoy.name} は罠！ -1周 / 現在 ${finalLaps()}周`;beep(150,100,.025)}else{msg.textContent=`${currentDecoy.name}… MISS / 現在 ${finalLaps()}周`;beep(260,55,.018)}}
    hitEl.textContent=`${finalLaps()}周`;streakEl.textContent=streak;setTimeout(()=>{if(running&&!finished)newPair()},115);
  }
  left.addEventListener("pointerdown",e=>{e.preventDefault();pick(0)},{passive:false});right.addEventListener("pointerdown",e=>{e.preventDefault();pick(1)},{passive:false});

  await countdown("1990");if(!document.body.contains(left))return;running=true;endAt=performance.now()+10000;newPair();
  const timer=now=>{if(!running||finished)return;const ms=Math.max(0,endAt-now);timeEl.textContent=(ms/1000).toFixed(2);if(ms<=0){running=false;finished=true;left.disabled=true;right.disabled=true;timeEl.textContent="0.00";beep(210,190,.035);const laps=finalLaps(),ranking=build1990WorldRanking(laps),mob=ranking.find(x=>x.mob);state.records.breakdance[p.id]=mob.rank;setTimeout(()=>show1990Summary(p,humanIndex,{hits,bonus,penalty,laps,ranking,rank:mob.rank}),260);return}activeAnimation=requestAnimationFrame(timer)};activeAnimation=requestAnimationFrame(timer);
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

  const dollCount=46;
  for(let i=0;i<dollCount;i++){
    const cluster=Math.random()<.72;
    dolls.push({
      x:cluster?clamp(.57+rand(-.22,.22),.13,.91):rand(.13,.91),
      y:cluster?rand(.80,.95):rand(.77,.96),
      rot:rand(-30,30),
      id:i
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
            ${dolls.map(d=>`<i class="catcher-doll ufo-prize" data-id="${d.id}" style="left:${d.x*100}%;top:${d.y*100}%;transform:translate(-50%,-50%) rotate(${d.rot}deg)"></i>`).join("")}
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

    const t=(now-widthStart)/820;
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

    const headCenterX=headRect.left-stageRect.left+headRect.width/2;
    const headBottom=headRect.bottom-stageRect.top;
    const stageH=stage.clientHeight;

    const gripWidth=32+armOpen*108;
    const gripTop=headBottom+16;
    const gripBottom=headBottom+90;
    const gripLeft=headCenterX-gripWidth/2;
    const gripRight=headCenterX+gripWidth/2;
    const gripCenterY=(gripTop+gripBottom)/2;

    const depthNorm=clamp(gripCenterY/stageH,0,1);
    const depthQuality=clamp(1-Math.abs(depthNorm-.86)/.15,0,1);

    // Width sweet spot is narrower; very wide claws lose much more retention.
    const widthQuality=clamp(1-Math.abs(armOpen-.58)/.24,0,1);

    const all=[...stage.querySelectorAll(".catcher-doll")].map(el=>{
      const r=el.getBoundingClientRect();
      const cx=r.left-stageRect.left+r.width/2;
      const cy=r.top-stageRect.top+r.height/2;
      const dx=Math.abs(cx-headCenterX)/(gripWidth/2);
      const dy=Math.abs(cy-gripCenterY)/((gripBottom-gripTop)/2);
      const inside=cx>=gripLeft&&cx<=gripRight&&cy>=gripTop&&cy<=gripBottom;

      const centerQuality=inside?clamp(1-(dx*.72+dy*.28),0,1):-1;
      return {el,id:Number(el.dataset.id),centerQuality,side:cx<headCenterX?-1:1};
    });

    const inside=all.filter(x=>x.centerQuality>=0).sort((a,b)=>b.centerQuality-a.centerQuality);

    const widePenalty=armOpen>.64?(armOpen-.64)/.25:0;
    const narrowPenalty=armOpen<.38?(.38-armOpen)/.11:0;
    const stability=clamp(widthQuality*.70+depthQuality*.30-widePenalty*.58-narrowPenalty*.10,0,1);

    // Even when many dolls are inside, weak retention throws most of them out.
    const capacity=clamp(Math.floor(1+9*Math.pow(stability,2.25)),0,10);
    const threshold=.26+(1-stability)*.50+widePenalty*.18;

    const held=inside.filter(c=>c.centerQuality>=threshold).slice(0,capacity);
    const heldIds=new Set(held.map(x=>x.id));
    const slipped=inside.filter(c=>!heldIds.has(c.id)).slice(0,10);

    return {held,slipped,stability};
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

      el.className="held-doll";
      el.style.left=`${left}%`;
      el.style.top=`${top}px`;
      el.style.transform="";
      el.style.setProperty("--r",`${rand(-14,14)}deg`);
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

    hint.textContent=caught?`${caught} GET`:"MISS";

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

    chuteCount.textContent=caught;
    beep(caught?900:210,100,.03);

    state.records.catcher[p.id]=caught;
    await wait(470);
    recordScreen(8,p,humanIndex,`${caught}<small>体</small>`,caught>=8?"BIG CATCH!":caught===0?"MISS":"UFO CATCH");
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
  const zones=[
    [.13,.70],[.26,.88],[.43,.74],[.61,.90],[.82,.70],
    [.18,.91],[.37,.84],[.57,.69],[.73,.86],[.88,.92]
  ];

  return shuffle(zones).slice(0,7).map(([x,y])=>({
    x:clamp(x+rand(-.05,.05),.08,.92),
    y:clamp(y+rand(-.03,.03),.64,.93)
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
  return clamp(Math.round((1-avg/.43)*100),0,100);
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

  let meters;
  if(a<=40){
    meters=1000-a*2.25;               // 910–1000
  }else if(a<=85){
    meters=910-(a-40)*3.25;           // 764–910
  }else if(a<=155){
    meters=764-(a-85)*3.45;           // 523–764
  }else if(a<=260){
    meters=523-(a-155)*2.25;          // 287–523
  }else{
    meters=287-(a-260)*.55;
  }

  return clamp(meters,110,1000);
}

function skiTimingLabel(deltaMs){
  const a=Math.abs(deltaMs);
  if(a<=40)return "PERFECT";
  if(a<=85)return "GREAT";
  if(a<=155)return "GOOD";
  return deltaMs<0?"TOO EARLY":"TOO LATE";
}

async function startSkiJump(p,humanIndex){
  gameFit();

  let running=false;
  let jumped=false;
  let startTime=0;
  let runRAF=null;

  const runDuration=2600;
  const idealTime=2240;
  const worldWidth=5200;
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
    </button>

    <p id="skiHint" class="hint">長いスロープを滑走。黄色いJUMPリップで1回タップ。</p>
  </div>`;

  const stage=document.getElementById("skiStage");
  const world=document.getElementById("skiCameraWorld");
  const jumper=document.getElementById("skiJumper");
  const timingEl=document.getElementById("skiTiming");
  const distanceEl=document.getElementById("skiDistance");
  const hint=document.getElementById("skiHint");
  const flyCallout=document.getElementById("skiFlyCallout");

  function renderRun(elapsed){
    const t=clamp(elapsed/runDuration,0,1);

    // Follow the actual visible slope: x advances while y moves down the ramp.
    const x=70+t*(takeoffX-92);
    const y=68+t*202;

    jumper.style.left=`${x}px`;
    jumper.style.top=`${y}px`;
    jumper.style.transform=`translate(-50%,-50%) rotate(${15+t*17}deg)`;
  }

  async function resolveJump(delta){
    if(jumped)return;

    jumped=true;
    running=false;
    if(runRAF)cancelAnimationFrame(runRAF);

    const meters=Math.round(skiDistanceFromTiming(delta)*10)/10;
    const label=skiTimingLabel(delta);

    timingEl.textContent=label;
    hint.textContent=`${label} / ${Math.abs(Math.round(delta))}ms`;
    flyCallout.classList.add("show");

    beep(label==="PERFECT"?980:label==="GREAT"?830:label==="GOOD"?700:280,90,.028);

    const targetX=takeoffX+meters*pxPerM;
    const flightStart=performance.now();
    const flightDuration=2100+meters*.9;
    const startY=270;
    const landingY=326;

    await new Promise(resolve=>{
      const frame=now=>{
        const t=clamp((now-flightStart)/flightDuration,0,1);
        const ease=1-Math.pow(1-t,2.1);
        const x=takeoffX+(targetX-takeoffX)*ease;

        // Huge, satisfying arc. Longer jumps fly visibly higher.
        const arc=Math.sin(t*Math.PI)*(115+meters*.16);
        const y=startY+(landingY-startY)*t-arc;

        jumper.style.left=`${x}px`;
        jumper.style.top=`${y}px`;
        jumper.style.transform=`translate(-50%,-50%) rotate(${8+t*28}deg)`;

        const currentMeters=Math.min(meters,Math.max(0,(x-takeoffX)/pxPerM));
        distanceEl.textContent=`${currentMeters.toFixed(1)}m`;

        const vw=stage.clientWidth;
        const camera=Math.max(0,Math.min(worldWidth-vw,x-vw*.34));
        world.style.transform=`translateX(${-camera}px)`;

        if(t>.16)flyCallout.classList.remove("show");

        if(t<1){
          requestAnimationFrame(frame);
        }else{
          resolve();
        }
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
    if(!running||jumped)return;
    e.preventDefault();

    const delta=(performance.now()-startTime)-idealTime;
    resolveJump(delta);
  },{passive:false});

  await countdown("SKI JUMP");
  if(!document.body.contains(stage))return;

  running=true;
  startTime=performance.now();

  const run=now=>{
    if(!running||jumped)return;

    const elapsed=now-startTime;
    renderRun(elapsed);

    if(elapsed>=runDuration+300){
      resolveJump(470);
      return;
    }
    runRAF=requestAnimationFrame(run);
  };
  runRAF=requestAnimationFrame(run);
}

// GAME 12 -------------------------------------------------
const SLOT_SYMBOLS=[
  {key:"M",label:"M"},
  {key:"O",label:"O"},
  {key:"B",label:"B"},
  {key:"MOB",label:""}
];

function slotPayout(keys){
  if(keys[0]==="MOB"&&keys[1]==="MOB"&&keys[2]==="MOB")return {mult:10,label:"MOB ×10"};
  if(keys[0]==="M"&&keys[1]==="O"&&keys[2]==="B")return {mult:5,label:"MOB ×5"};
  if(keys.every(k=>k==="M"))return {mult:2,label:"MMM ×2"};
  if(keys.every(k=>k==="O"))return {mult:2,label:"OOO ×2"};
  if(keys.every(k=>k==="B"))return {mult:2,label:"BBB ×2"};
  return {mult:0,label:"MISS"};
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
  let targetPattern=null;

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
      <div class="slot-top">MOB SLOT</div>

      <div class="slot-reels">
        ${[0,1,2].map(i=>`<div class="slot-reel" data-reel="${i}"><div class="slot-symbol" id="slotSymbol${i}">M</div></div>`).join("")}
      </div>

      <div id="slotResult" class="slot-result">READY</div>

      <button id="slotMainBtn" class="slot-main-button" type="button">SPIN</button>
    </div>

    <div class="slot-paytable">
      <span>MMM ×2</span><span>OOO ×2</span><span>BBB ×2</span><span>MOB ×5</span><span class="mob-pay"><i></i><i></i><i></i> ×10</span>
    </div>
  </div>`;

  const timeEl=document.getElementById("slotTime");
  const coinsEl=document.getElementById("slotCoins");
  const resultEl=document.getElementById("slotResult");
  const mainBtn=document.getElementById("slotMainBtn");
  const symbolEls=[0,1,2].map(i=>document.getElementById(`slotSymbol${i}`));

  function renderSymbol(el,symbolIndex){
    const s=SLOT_SYMBOLS[symbolIndex];
    el.className=`slot-symbol ${s.key==="MOB"?"mob-symbol":""}`;
    el.textContent=s.label;
  }

  function chooseTarget(){
    const r=Math.random();
    if(r<.20)return ["M","O","B"];
    if(r<.31)return ["MOB","MOB","MOB"];
    if(r<.50){
      const k=["M","O","B"][randi(0,2)];
      return [k,k,k];
    }
    return shuffle(["M","O","B","MOB"]).slice(0,3);
  }

  function symbolIndexByKey(key){
    return SLOT_SYMBOLS.findIndex(s=>s.key===key);
  }

  function spinReels(now){
    if(!spinActive)return;

    const elapsed=now-reelStart;
    for(let i=stopIndex;i<3;i++){
      const speed=82+i*11;
      visible[i]=Math.floor(elapsed/speed+i*1.4)%4;
      renderSymbol(symbolEls[i],visible[i]);
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
    targetPattern=chooseTarget();
    resultEl.textContent="-";
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

    // Reel 1 and 2 have strong automatic assistance toward the hidden target.
    if(stopIndex===0&&Math.random()<.82){
      idx=symbolIndexByKey(targetPattern[0]);
    }else if(stopIndex===1&&Math.random()<.76){
      idx=symbolIndexByKey(targetPattern[1]);
    }else if(stopIndex===2&&Math.random()<.16){
      // Third reel is primarily visual/timing skill, with occasional auto assistance.
      idx=symbolIndexByKey(targetPattern[2]);
    }

    visible[stopIndex]=idx;
    stopped[stopIndex]=idx;
    renderSymbol(symbolEls[stopIndex],idx);
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
      beep(payout.mult===10?980:payout.mult===5?850:720,100,.03);
    }else{
      resultEl.textContent="MISS";
      resultEl.classList.remove("win");
      beep(180,65,.012);
    }

    mainBtn.classList.remove("stopping");
    mainBtn.textContent="SPIN";

    await wait(75);
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

    setTimeout(()=>recordScreen(11,p,humanIndex,`${coins}<small> COIN</small>`,coins>1000?`+${coins-1000}`:coins===1000?"±0":`${coins-1000}`),220);
  }

  await countdown("MOB SLOT");
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
  const chance=[0.12,0.10,0.14,0.16,0.12,0.13,0.14,0.12,0.15,0.12,0.14,0.13][gameIndex] ?? 0.12;
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
    const bias={c5:120,c6:40,c7:180,c8:0}[p.id]||0;
    state.records.puzzle[p.id]=ultra?randi(1950,2350):clamp(randi(2550,4300)+bias,2400,4700);
  }else if(gameIndex===3){
    const bias={c5:15,c6:45,c7:0,c8:60}[p.id]||0;
    const meters=ultra?rand(1840,2000):clamp(rand(1280,1810)+bias,1200,1930);
    state.records.launch[p.id]=Math.round(meters*10);
  }else if(gameIndex===4){
    const bias={c5:1,c6:2,c7:0,c8:3}[p.id]||0;
    state.records.stack[p.id]=ultra?randi(23,31):clamp(randi(12,21)+bias,11,26);
  }else if(gameIndex===5){
    const bias={c5:1,c6:0,c7:2,c8:0}[p.id]||0;
    state.records.breakdance[p.id]=ultra?randi(1,2):clamp(randi(2,10)+bias,1,14);
  }else if(gameIndex===6){
    const bias={c5:1,c6:2,c7:0,c8:2}[p.id]||0;
    state.records.crisis[p.id]=ultra?randi(22,31):clamp(randi(14,23)+bias,13,28);
  }else if(gameIndex===7){
    const bias={c5:1,c6:3,c7:0,c8:2}[p.id]||0;
    state.records.factory[p.id]=ultra?randi(25,32):clamp(randi(16,24)+bias,15,28);
  }else if(gameIndex===8){
    const bias={c5:0,c6:1,c7:-1,c8:1}[p.id]||0;
    state.records.catcher[p.id]=ultra?randi(8,10):clamp(randi(2,7)+bias,1,9);
  }else if(gameIndex===9){
    const bias={c5:1,c6:3,c7:0,c8:2}[p.id]||0;
    state.records.tidy[p.id]=ultra?randi(96,100):clamp(randi(72,92)+bias,68,96);
  }else if(gameIndex===10){
    const bias={c5:22,c6:36,c7:0,c8:42}[p.id]||0;
    const meters=ultra?rand(925,1000):clamp(rand(610,900)+bias,580,960);
    state.records.ski[p.id]=Math.round(meters*10);
  }else{
    const bias={c5:40,c6:120,c7:-30,c8:160}[p.id]||0;
    state.records.slot[p.id]=ultra?randi(2600,3900):clamp(randi(1450,2650)+bias,1250,3200);
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
  if(gameIndex===8)return clamp(Math.round(v*10),0,100);
  if(gameIndex===9)return clamp(Math.round(v),0,100);
  if(gameIndex===10)return clamp(Math.round(((v/10)-200)/800*100),0,100);
  return clamp(Math.round((v-1000)/2000*100),0,100);
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
  if(gameIndex===0)return `${(v/1000).toFixed(3)}秒`;
  if(gameIndex===1)return `${v}/10`;
  if(gameIndex===2)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===3)return `${(v/10).toFixed(1)}m`;
  if(gameIndex===4)return `${v}体`;
  if(gameIndex===5)return `世界${v}位`;
  if(gameIndex===6)return `${v}回`;
  if(gameIndex===7)return `${v}箱`;
  if(gameIndex===8)return `${v}体`;
  if(gameIndex===9)return `${v}%`;
  if(gameIndex===10)return `${(v/10).toFixed(1)}m`;
  return `${v} COIN`;
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
