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
  {no:3,key:"puzzle",title:"ナンバー12 パズル",sub:"1〜12を順番に消すタイムアタック"},
  {no:4,key:"launch",title:"フィギュア飛ばし",sub:"2ゲージ平均で最大2000m"},
  {no:5,key:"stack",title:"グラグラモブくん",sub:"フィギュアを何体積めるか勝負"},
  {no:6,key:"breakdance",title:"1990世界大会",sub:"10秒で1990を見抜いて世界へ"}
];

const MODES={
  solo4:{name:"4人 個人戦",short:"プレイヤー4人",participants:["p1","p2","p3","p4"],team:false,points:[5,3,1,0]},
  solo8:{name:"8人 個人戦",short:"プレイヤー4人 + CPU4人",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  tag:{name:"2対2 タッグ",short:"P1・P2 VS P3・P4",participants:["p1","p2","p3","p4"],team:true,points:[5,3,1,0],teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  humansVsCpu:{name:"4人 VS CPU4人",short:"PLAYER TEAM VS CPU TEAM",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:true,points:[10,8,6,4,3,2,1,0],teams:{A:["p1","p2","p3","p4"],B:["c5","c6","c7","c8"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  score4:{name:"100点 スコアバトル",short:"6ゲーム合計 最大600点",participants:["p1","p2","p3","p4"],team:false,points:[],performance:true},
  free:{name:"1人フリープレイ",short:"好きなゲームだけ遊ぶ",participants:["p1"],team:false,points:[0]}
};

let state=freshState();
let audioCtx=null;
let activeAnimation=null;

function freshState(){
  return {modeKey:null,gameIndex:0,freePlay:false,freeGameIndex:null,records:{reaction:{},memory:{},puzzle:{},launch:{},stack:{},breakdance:{}},total:{},gamePoints:[null,null,null,null,null,null],cpuTier:{}};
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
function imgTag(p,cls="avatar"){return `<img draggable="false" class="${cls}" src="${p.img}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">`}

homeBtn.addEventListener("click",()=>{cancelActiveAnimation();renderHome()});
resetBtn.addEventListener("click",()=>{
  cancelActiveAnimation();
  if(state.freePlay && state.freeGameIndex!==null){startFreeGame(state.freeGameIndex);return;}
  if(state.modeKey){const k=state.modeKey;state=freshState();state.modeKey=k;initTotals();renderModeLobby()}
  else renderHome();
});

function renderHome(){
  cancelActiveAnimation();
  state=freshState();
  screen.innerHTML=`
    <section class="hero">
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>6 MINI<br>GAMES</h1><p>6つのミニゲームを、4人個人戦・CPU入り8人戦・タッグ・PLAYER VS CPUで遊べます。</p></div>
      <div class="hero-mark">MOB</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>MODE SELECT</h3><span class="tag">5 MODES</span></div>
      <div class="mode-grid">
        <button class="mode-card" data-mode="solo4"><span class="mode-no">MODE 01</span><b>4人 個人戦</b><span>プレイヤー1〜4で個人順位を競う</span></button>
        <button class="mode-card" data-mode="solo8"><span class="mode-no">MODE 02</span><b>8人 個人戦</b><span>プレイヤー4人 + CPU4人</span></button>
        <button class="mode-card" data-mode="tag"><span class="mode-no">MODE 03</span><b>2対2 タッグ</b><span>P1・P2 VS P3・P4</span></button>
        <button class="mode-card" data-mode="humansVsCpu"><span class="mode-no">MODE 04</span><b>4人 VS CPU4人</b><span>PLAYER TEAM VS CPU TEAM</span></button>
        <button class="mode-card score-mode-card" data-mode="score4"><span class="mode-no">MODE 05</span><b>100点 スコアバトル</b><span>各ゲーム0〜100点 / 合計最大600点</span></button>
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
  state=freshState();state.modeKey=key;initTotals();renderModeLobby();
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

function renderModeLobby(){
  const m=mode();
  const scoreRules=`
    <div class="score-rule-grid">
      <div><b>反射神経</b><span>0.150秒以下=100 / 0.300秒=50 / 0.500秒以上=0</span></div>
      <div><b>記憶力</b><span>正解数 × 10点</span></div>
      <div><b>ナンバー12</b><span>4.00秒=100 / 12.00秒以上=0</span></div>
      <div><b>フィギュア飛ばし</b><span>2000m=100 / 0m=0</span></div>
      <div><b>グラグラモブくん</b><span>30体以上=100 / 0体=0</span></div>
      <div><b>1990世界大会</b><span>世界1位=100 / 40位=0</span></div>
    </div>`;

  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">MODE SELECTED</span><h2>${m.name}</h2><p class="lead">${m.short}</p></div><div class="game-badge">${m.participants.length}人</div></div>
    <section class="panel"><div class="panel-head"><h3>ENTRY</h3><span class="tag">${m.performance?"SCORE BATTLE":m.team?"TEAM BATTLE":"INDIVIDUAL"}</span></div><div class="player-grid">${participants().map(p=>`<div class="player-card ${m.team?(teamOf(p.id)==="A"?"team-a":"team-b"):(p.cpu?"team-cpu":"team-human")}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>${p.cpu?"CPU":`PLAYER ${p.no}`}${m.team?` / ${teamName(p.id)}`:""}</span></div></div>`).join("")}</div></section>
    ${m.performance
      ? `<section class="panel score-rule-panel"><h3>0〜100 SCORE RULE</h3>${scoreRules}<p class="note" style="margin-top:9px">6ゲームの合計点で最終順位を決定。最大600点。</p></section>`
      : `<section class="panel"><h3>POINT RULE</h3><div class="point-strip">${m.points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div><p class="note" style="margin-top:9px">同記録は同着。同着時は同じ順位ポイントを獲得し、次順位は人数分繰り下がります。</p></section>`}
    <section class="panel flat"><h3>PLAY ORDER</h3><p class="lead">プレイヤー1 → 2 → 3 → 4${cpus().length?" → CPUは高速処理":""}</p></section>
    <button id="modeStart" class="primary">GAME 1 START</button>`;
  gameTop();
  document.getElementById("modeStart").addEventListener("click",()=>showGameIntro(0));
}

function scoreRuleForGame(index){
  return [
    "0.150秒以下=100点 / 0.300秒=50点 / 0.500秒以上=0点",
    "正解数×10点 / 10枚正解=100点",
    "4.00秒=100点 / 12.00秒以上=0点",
    "2000m=100点 / 0m=0点",
    "30体以上=100点 / 0体=0点",
    "世界1位=100点 / 世界40位=0点"
  ][index];
}

function showGameIntro(index){
  state.gameIndex=index;
  const g=GAMES[index];
  let rules="";
  if(index===0){
    rules=`<li>READY? → 3・2・1 → ランダム待機後、大きなMOBボタンが出現。</li><li>MOB表示からタップまでを<strong>0.001秒単位</strong>で計測。</li>`;
  }else if(index===1){
    rules=`<li>icon/01.png〜10.pngを10枚ランダム配置。</li><li>3・2・1 → 10枚が順番に光ります。</li><li>もう一度3・2・1 → 光った順番にタップ。</li><li>間違えた時点で終了。</li>`;
  }else if(index===2){
    rules=`<li>12個のマスに1〜12をランダム配置。</li><li>3・2・1のあと、1 → 2 → … → 12 の順番だけ入力可能。</li><li>12を消した瞬間のタイム。</li>`;
  }else if(index===3){
    rules=`<li>横長ゲージ → 円形ゲージの順にSTOP。</li><li>横ゲージは以前より高速。</li><li>2ゲージ平均から飛距離を決定。最高<strong>2000m</strong>。</li>`;
  }else if(index===4){
    rules=`<li>フィギュアを<strong>短くタップ</strong>すると DROP ×1 → ×2 → ×3 → ×1 と切り替え。</li><li>そのまま横へ動かすと掴み、離すと1〜3体を同時DROP。</li><li>時間が経つほど風が強くなります。</li><li>重なり不足で崩れたら、カメラが一番下まで追います。</li><li>序盤はかなり乗りやすく、10体前後までは到達しやすいバランス。</li>`;
  }else{
    rules=`<li>10秒間、左右には<strong>必ず片方に1990</strong>が出ます。両方罠・進行不能はありません。</li><li>もう片方には1991 / 1989 / 2000 / 1909 / 1999など1990っぽい項目。</li><li>1990を押すと1周。<strong>5回連続で1990を押すたびBONUS +1周</strong>。</li><li>一部のニセ項目は罠で -1周。ニセを押すと連続数はリセット。</li><li>最終周回数をもとに世界1〜40位を決定。</li>`;
  }

  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">GAME ${g.no} / 6</span><h2>${g.title}</h2><p class="lead">${g.sub}</p></div><div class="game-badge">${g.no}/6</div></div>
    <section class="panel"><h3>RULE</h3><ul class="rules">${rules}</ul></section>
    ${state.freePlay
      ? `<section class="panel flat free-play-note"><h3>1 PLAYER FREE PLAY</h3><p class="lead">順位・ポイントなしで、このゲームだけ遊びます。</p></section>`
      : mode().performance
        ? `<section class="panel flat score-intro"><h3>SCORE</h3><div class="score-big-rule">${scoreRuleForGame(index)}</div></section>`
        : `<section class="panel flat"><h3>POINT</h3><div class="point-strip">${mode().points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div></section>`}
    <button id="introStart" class="primary">${state.freePlay?"READY? へ":"プレイヤー1 READY? へ"}</button>`;
  gameTop();
  document.getElementById("introStart").addEventListener("click",()=>humanReady(index,0));
}

function humanReady(gameIndex,humanIndex){
  const list=humans();
  if(humanIndex>=list.length){
    return cpus().length ? simulateCpuThenResult(gameIndex) : finishGame(gameIndex);
  }
  const p=list[humanIndex],g=GAMES[gameIndex];

  screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">
    ${imgTag(p,"ready-avatar")}
    <span class="kicker">GAME ${g.no} / ${state.freePlay?"SOLO":`PLAYER ${humanIndex+1} OF ${list.length}`}</span>
    <div class="ready-big">READY?</div>
    <div class="ready-name">${esc(p.name)}</div>
    <div class="ready-sub">${state.freePlay?"1 PLAYER FREE PLAY":(mode().team?teamName(p.id):`PLAYER ${p.no}`)}</div>
    ${gameIndex===2?`<div class="number-ready-guide"><b>1 → 2 → 3 → … → 12</b><small>数字は毎回ランダム / 正しい順番以外は押せません</small></div>`:""}
    ${gameIndex===4?`<div class="number-ready-guide"><b>GRAB → MOVE → DROP</b><small>重なっていれば必ず乗る / 重なり不足なら必ず落ちる</small></div>`:""}
    ${gameIndex===5?`<div class="number-ready-guide"><b>1990 CHALLENGE</b><small>左右どちらかは必ず1990。見抜いて連続タップ。</small></div>`:""}
    <button id="readyBtn" class="primary">準備OK</button>
  </div></div>`;
  gameTop();

  document.getElementById("readyBtn").addEventListener("click",()=>{
    if(gameIndex===0)startReaction(p,humanIndex);
    else if(gameIndex===1)startMemory(p,humanIndex);
    else if(gameIndex===2)startPuzzle(p,humanIndex);
    else if(gameIndex===3)startLaunch(p,humanIndex);
    else if(gameIndex===4)startStack(p,humanIndex);
    else startGanbareMob(p,humanIndex);
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
  gameTop();
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
  gameTop();
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
  gameTop();
  let linear=0,circle=0,phase="linear",start=performance.now();

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>フィギュア飛ばし</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
  <div class="gauge-wrap">
    <section id="linearCard" class="gauge-card">
      <div class="gauge-title">1. 高速 横長ゲージ <span id="linearScore">タップでSTOP</span></div>
      <div id="linearGauge" class="linear-gauge"><div id="linearMarker" class="linear-marker"></div></div>
    </section>
    <section id="circleCard" class="gauge-card disabled">
      <div class="gauge-title">2. 円形ゲージ <span id="circleScore">WAIT</span></div>
      <div id="circleGauge" class="circle-gauge" role="button" aria-label="円形ゲージを止める">
        <div class="circle-max-zone"><b>MAX</b><span>100</span></div><div class="circle-ring"></div><div id="circleNeedle" class="circle-needle"></div><div class="circle-center"><span>POWER</span><b id="circleLive">--</b></div>
      </div>
      <p class="circle-help">針が円周を360°回転。上のMAXに近いほど高得点。</p>
    </section>
    <p class="hint">横は左右端、円は上のMAXに近いほど100%。最大2000m。</p>
  </div>`;

  const lg=document.getElementById("linearGauge"),lm=document.getElementById("linearMarker"),lc=document.getElementById("linearCard"),ls=document.getElementById("linearScore"),cg=document.getElementById("circleGauge"),needle=document.getElementById("circleNeedle"),live=document.getElementById("circleLive"),cc=document.getElementById("circleCard"),cs=document.getElementById("circleScore");

  function linearAnim(now){
    if(phase!=="linear")return;
    const t=(now-start)/500;
    const pos=(Math.sin(t*Math.PI*2-Math.PI/2)+1)/2*100;
    lm.style.left=`${pos}%`;lm.dataset.pos=pos.toFixed(3);activeAnimation=requestAnimationFrame(linearAnim);
  }
  function beginCircle(){phase="circle";cancelActiveAnimation();lc.classList.add("disabled");cc.classList.remove("disabled");cs.textContent="タップでSTOP";start=performance.now();beep(660,70);activeAnimation=requestAnimationFrame(circleAnim)}
  function stopLinear(e){if(phase!=="linear")return;if(e)e.preventDefault();const pos=Number(lm.dataset.pos||50);linear=clamp(Math.round(Math.abs(pos-50)*2),0,100);ls.textContent=`${linear}%`;beginCircle()}
  function circleAnim(now){if(phase!=="circle")return;const angle=((now-start)/1120*360)%360;const distToMax=Math.min(angle,360-angle);const score=clamp(Math.round(100-(distToMax/180)*100),0,100);needle.style.transform=`rotate(${angle}deg)`;needle.dataset.score=String(score);live.textContent=`${score}%`;activeAnimation=requestAnimationFrame(circleAnim)}
  function stopCircle(e){if(phase!=="circle")return;if(e)e.preventDefault();circle=clamp(Number(needle.dataset.score||0),0,100);phase="done";cancelActiveAnimation();cs.textContent=`${circle}% STOP`;live.textContent=`${circle}%`;cc.classList.add("stopped");beep(760,80);const avg=(linear+circle)/2;setTimeout(()=>launchAnimation(p,humanIndex,avg,linear,circle),320)}

  activeAnimation=requestAnimationFrame(linearAnim);
  lg.addEventListener("pointerdown",stopLinear,{passive:false});lg.addEventListener("click",stopLinear);
  cg.addEventListener("pointerdown",stopCircle,{passive:false});cg.addEventListener("touchstart",stopCircle,{passive:false});cg.addEventListener("click",stopCircle);
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
  let count=0,dropCount=1,active=null,pointerId=null;
  let pointerDown=false,dragging=false,dropping=false,finished=false;
  let downX=0,downY=0,towerWobbleX=0,towerWobbleRot=0,handWobbleX=0,handWobbleRot=0,wobbleRAF=null;
  let grabTimer=null;
  const pieceW=68,pieceH=50,baseBottom=32,stacked=[];
  const gameStart=performance.now();

  screen.innerHTML=`<div class="stack-game-shell"><div class="stack-topline"><div><span class="kicker">${esc(p.name)}</span><h2>グラグラモブくん</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="stack-wrap">
      <div class="stack-hud stack-hud-v7">
        <div class="stat-box"><span>STACK</span><b id="stackCount">0</b></div>
        <div class="stat-box"><span>DROP</span><b id="dropCount">×1</b></div>
        <div class="stat-box wind-box"><span>WIND</span><b id="windValue">0%</b><i><em id="windFill"></em></i></div>
        <div class="stat-box balance-box"><span>BALANCE</span><b id="stackBalance">--</b><i><em id="balanceFill"></em></i></div>
      </div>
      <div id="stackStage" class="stack-stage">
        <div id="stackCallout" class="stack-callout"></div><div class="stack-sky-label">TAP:個数変更 / MOVE:つかむ / RELEASE:DROP</div>
        <div id="towerWorld" class="tower-world"><div id="stackLayer" class="stack-layer"></div><div id="supportGuide" class="support-guide"></div><div class="tower-base"></div></div>
        <div id="activeLayer" class="active-layer"></div>
      </div>
      <p id="stackHint" class="hint">短くタップすると ×1 → ×2 → ×3。横へ動かして離すと同時DROP。</p>
    </div></div>`;
  gameTop();

  const stage=document.getElementById("stackStage"),world=document.getElementById("towerWorld"),stackLayer=document.getElementById("stackLayer"),activeLayer=document.getElementById("activeLayer"),supportGuide=document.getElementById("supportGuide"),countEl=document.getElementById("stackCount"),dropEl=document.getElementById("dropCount"),windEl=document.getElementById("windValue"),windFill=document.getElementById("windFill"),balanceEl=document.getElementById("stackBalance"),balanceFill=document.getElementById("balanceFill"),hint=document.getElementById("stackHint"),callout=document.getElementById("stackCallout");

  function stageWidth(){return stage.clientWidth}
  function elapsedSec(){return Math.max(0,(performance.now()-gameStart)/1000)}
  function windPercent(){return clamp(Math.round(elapsedSec()/45*100),0,100)}
  function windAmp(){const s=elapsedSec();return Math.min(23,1.2+s*.44)}
  function handAmp(){return Math.min(12,2.4+elapsedSec()*.12+Math.max(0,count-8)*.18)}
  function requiredOverlapRatio(){let base=count<10?.25:count<20?.32:.40;return clamp(base+(dropCount-1)*.035,.25,.50)}
  function cameraShift(){const top=baseBottom+(count+dropCount)*pieceH;return Math.max(0,top-(stage.clientHeight-145))}
  function updateCamera(){world.style.transition="transform .22s ease";world.style.transform=`translateY(${cameraShift()}px)`}
  function topLocalX(){return count===0?stageWidth()/2:stacked[stacked.length-1].x}
  function topVisualX(){return topLocalX()+towerWobbleX}
  function landingBottom(){return baseBottom+count*pieceH}
  function bundleHeight(){return pieceH*dropCount}
  function activeEl(){return document.getElementById("activeStackBundle")}

  function updateSupportGuide(){const x=topLocalX();supportGuide.style.width=`${pieceW}px`;supportGuide.style.left=`${x-pieceW/2}px`;supportGuide.style.bottom=`${landingBottom()}px`}
  function renderStack(){
    stackLayer.innerHTML=stacked.map((it,i)=>`<div class="stack-piece placed" style="left:${it.x-pieceW/2}px;bottom:${baseBottom+i*pieceH}px;transform:rotate(${it.rot}deg)"></div>`).join("");
    countEl.textContent=count;dropEl.textContent=`×${dropCount}`;updateSupportGuide();updateCamera();
  }
  function showCallout(text,kind="good"){callout.className=`stack-callout show ${kind}`;callout.textContent=text;setTimeout(()=>{if(callout.textContent===text)callout.className="stack-callout"},520)}
  function visibleDropX(){return active?active.x+handWobbleX:0}
  function currentOverlapRatio(){if(!active)return 0;const d=Math.abs(visibleDropX()-topVisualX()),overlap=Math.max(0,pieceW-d);return clamp(overlap/pieceW,0,1)}
  function updateBalance(){if(!active||!pointerDown){balanceEl.textContent="--";balanceFill.style.width="0%";return}const ratio=currentOverlapRatio(),need=requiredOverlapRatio();balanceFill.style.width=`${Math.round(ratio*100)}%`;balanceEl.textContent=ratio>=.82?"PERFECT":ratio>=.58?"GOOD":ratio>=need?"SAFE":"DANGER"}

  function renderActiveBundle(){
    if(!active)return;
    activeLayer.innerHTML=`<div id="activeStackBundle" class="stack-bundle active" role="button" aria-label="フィギュア${dropCount}体" style="left:${active.x-pieceW/2}px;top:${active.y}px;height:${bundleHeight()}px">${Array.from({length:dropCount},(_,i)=>`<div class="stack-piece bundle-piece" style="left:0;bottom:${i*pieceH}px"></div>`).join("")}</div>`;
  }
  function spawnPiece(){
    if(finished)return;pointerDown=false;dragging=false;dropping=false;pointerId=null;handWobbleX=0;handWobbleRot=0;
    const sw=stageWidth(),startX=clamp(sw*.5+rand(-sw*.20,sw*.20),pieceW/2+8,sw-pieceW/2-8);active={x:startX,y:16};renderActiveBundle();dropEl.textContent=`×${dropCount}`;hint.textContent="短くタップで個数変更。横へ動かすと掴みます。";updateBalance();
  }
  function cycleDropCount(){dropCount=dropCount%3+1;dropEl.textContent=`×${dropCount}`;showCallout(`DROP ×${dropCount}`,"grab");beep(520+dropCount*80,45,.018);if(active)renderActiveBundle();updateSupportGuide()}
  function setActiveX(clientX){if(!active)return;const rect=stage.getBoundingClientRect();active.x=clamp(clientX-rect.left,pieceW/2+6,rect.width-pieceW/2-6);const el=activeEl();if(el)el.style.left=`${active.x-pieceW/2}px`;updateBalance()}

  function startWobble(){
    const started=performance.now();
    const frame=now=>{if(finished)return;const t=now-started,amp=windAmp(),wp=windPercent();windEl.textContent=`${wp}%`;windFill.style.width=`${wp}%`;
      towerWobbleX=Math.sin(t/(340-Math.min(170,wp)))*amp*.42 + Math.sin(t/710)*amp*.18;
      towerWobbleRot=Math.sin(t/540)*Math.min(3.2,amp*.12);
      stackLayer.style.transform=`translateX(${towerWobbleX}px) rotate(${towerWobbleRot}deg)`;supportGuide.style.transform=`translateX(${towerWobbleX}px) rotate(${towerWobbleRot}deg)`;
      if(pointerDown&&active){const ha=handAmp();handWobbleX=Math.sin(t/76)*ha+Math.sin(t/43)*ha*.24;handWobbleRot=Math.sin(t/88)*Math.min(9,2.4+wp*.055);const el=activeEl();if(el)el.style.transform=`translateX(${handWobbleX}px) rotate(${handWobbleRot}deg) scale(1.04)`;updateBalance()}else{handWobbleX=0;handWobbleRot=0}
      wobbleRAF=requestAnimationFrame(frame)};
    wobbleRAF=requestAnimationFrame(frame);
  }

  async function collapseToBottom(direction=1){
    stackLayer.classList.add(direction>=0?"tower-collapse-right":"tower-collapse-left");
    world.classList.add("camera-fall");world.style.transition="transform .75s cubic-bezier(.2,.7,.2,1)";world.style.transform="translateY(0px)";
    await wait(820);
  }

  async function releaseBundle(){
    if(!active||dropping||finished)return;dropping=true;pointerDown=false;dragging=false;
    const dropX=visibleDropX(),targetX=topVisualX(),distance=Math.abs(dropX-targetX),ratio=Math.max(0,pieceW-distance)/pieceW,need=requiredOverlapRatio();
    const stageH=stage.clientHeight,targetTop=stageH-(landingBottom()+bundleHeight())+cameraShift(),el=activeEl();if(!el)return;
    active.x=dropX;handWobbleX=0;el.style.left=`${dropX-pieceW/2}px`;el.style.transform=`rotate(${handWobbleRot*.25}deg)`;
    const startTop=parseFloat(el.style.top)||16,dropStart=performance.now(),dropDur=330+dropCount*55;
    await new Promise(resolve=>{const fall=now=>{const t=clamp((now-dropStart)/dropDur,0,1),e=1-Math.pow(1-t,3);el.style.top=`${startTop+(targetTop-startTop)*e}px`;if(t<1)requestAnimationFrame(fall);else resolve()};requestAnimationFrame(fall)});

    if(ratio<need){balanceEl.textContent="MISS";balanceFill.style.width=`${Math.round(ratio*100)}%`;showCallout("BALANCE BREAK!","bad");beep(150,230,.04);el.classList.add(dropX>=targetX?"fall-right":"fall-left");await wait(260);await collapseToBottom(dropX>=targetX?1:-1);finishStack();return}

    const localX=dropX-towerWobbleX,offset=dropX-targetX;
    for(let i=0;i<dropCount;i++)stacked.push({x:localX+Math.sin(i*2.2)*2.2,rot:clamp(offset*.075+towerWobbleRot*.18+(i-(dropCount-1)/2)*.7,-6,6)});
    count+=dropCount;active=null;activeLayer.innerHTML="";renderStack();beep(760,70,.024);
    if(ratio>=.82){showCallout(`PERFECT +${dropCount}!`,"perfect");hint.textContent=`PERFECT! ${dropCount}体積み上げ！`}else if(ratio>=.58){showCallout(`GOOD +${dropCount}!`,"good");hint.textContent=`GOOD! ${dropCount}体積み上げ！`}else{showCallout(`SAFE +${dropCount}!`,"safe");hint.textContent="ギリギリ乗りました！"}
    await wait(220);spawnPiece();
  }

  function finishStack(){if(finished)return;finished=true;clearTimeout(grabTimer);if(wobbleRAF)cancelAnimationFrame(wobbleRAF);state.records.stack[p.id]=count;setTimeout(()=>recordScreen(4,p,humanIndex,`${count}<small>体</small>`,`WIND ${windPercent()}% / STACK RECORD`),220)}

  // iPhoneでは「長押ししてから動かす」でも確実につかめる。
  // 短いタップだけは DROP数変更、3px以上動かす or 0.22秒ホールドでGRABになる。
  stage.addEventListener("pointerdown",e=>{
    const el=e.target.closest("#activeStackBundle");
    if(!el||dropping||finished)return;

    e.preventDefault();
    e.stopPropagation();

    pointerDown=true;
    dragging=false;
    pointerId=e.pointerId;
    downX=e.clientX;
    downY=e.clientY;

    el.classList.add("pressed");
    try{stage.setPointerCapture(pointerId)}catch(_){}

    clearTimeout(grabTimer);
    grabTimer=setTimeout(()=>{
      if(pointerDown&&!dropping&&!finished){
        dragging=true;
        el.classList.add("grabbed");
        showCallout("GRAB!","grab");
        updateBalance();
      }
    },220);

    showCallout("HOLD / MOVE","grab");
    updateBalance();
  },{passive:false});

  stage.addEventListener("pointermove",e=>{
    if(!pointerDown||e.pointerId!==pointerId||dropping||finished)return;

    e.preventDefault();
    e.stopPropagation();

    if(!dragging&&Math.hypot(e.clientX-downX,e.clientY-downY)>3){
      clearTimeout(grabTimer);
      dragging=true;
      const el=activeEl();
      if(el)el.classList.add("grabbed");
      showCallout("GRAB!","grab");
    }

    if(dragging)setActiveX(e.clientX);
  },{passive:false});

  const release=e=>{
    if(!pointerDown||e.pointerId!==pointerId||dropping||finished)return;

    e.preventDefault();
    e.stopPropagation();
    clearTimeout(grabTimer);

    const el=activeEl();
    if(el)el.classList.remove("pressed","grabbed");

    if(dragging){
      releaseBundle();
    }else{
      pointerDown=false;
      cycleDropCount();
    }
  };

  stage.addEventListener("pointerup",release,{passive:false});
  stage.addEventListener("pointercancel",e=>{
    clearTimeout(grabTimer);
    const el=activeEl();
    if(el)el.classList.remove("pressed","grabbed");
    if(pointerDown){
      pointerDown=false;
      dragging=false;
      updateBalance();
    }
  },{passive:false});

  // Safariの長押しメニュー・選択をゲーム領域では完全に無効化。
  stage.addEventListener("contextmenu",e=>e.preventDefault(),{passive:false});
  stage.addEventListener("touchstart",e=>e.preventDefault(),{passive:false});

  renderStack();startWobble();await countdown("STACK");spawnPiece();
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
  screen.innerHTML=`<div class="ganbare-transition n1990-summary"><span class="kicker">1990 COMPLETE</span><h2>モブくんは世界大会で<br><strong>1990を${data.laps}周</strong>披露した</h2>
    <div class="ganbare-summary"><div><span>1990 HIT</span><b>${data.hits}</b></div><div><span>5 STREAK BONUS</span><b>+${data.bonus}</b></div><div><span>TRAP</span><b>-${data.penalty}</b></div></div>
    <button id="worldRankingBtn" class="primary">世界ランキングを見る</button></div>`;gameTop();
  document.getElementById("worldRankingBtn").addEventListener("click",()=>show1990WorldRanking(p,humanIndex,data),{once:true});
}

function show1990WorldRanking(p,humanIndex,data){
  screen.innerHTML=`<div class="world-ranking-shell"><div class="world-title"><div><span class="kicker">1990 WORLD CHAMPIONSHIP</span><h2>WORLD RANKING</h2></div><div class="mob-rank-badge">MOB<br><b>${data.rank}位</b></div></div>
    <div class="world-ranking-list">${data.ranking.map(e=>`<div class="world-row ${e.mob?"mob":""}"><span class="world-place">${e.rank}</span><b>${e.name}</b><small>${e.mob?`1990 ${data.laps}周`:"COUNTRY"}</small></div>`).join("")}</div>
    <div class="world-sticky"><button id="worldResultBtn" class="primary">結果を見る</button></div></div>`;gameTop();
  document.getElementById("worldResultBtn").addEventListener("click",()=>show1990Final(p,humanIndex,data.laps,data.rank),{once:true});
}

function show1990Final(p,humanIndex,laps,rank){
  const tail=state.freePlay?`<button id="gAgain" class="primary">同じゲームをもう一度</button><div style="height:8px"></div><button id="gHome" class="secondary">メインメニューへ</button>`:`<button id="gNext" class="primary">${humanIndex+1<humans().length?"次のプレイヤー":cpus().length?"CPU高速処理へ":"GAME 6 RESULT"}</button>`;
  screen.innerHTML=`<div class="ganbare-final"><span class="kicker">FINAL MESSAGE</span><div class="ganbare-final-rank">${rank}<small>位</small></div><h2>モブくんは世界大会で1990を<strong>${laps}周</strong>披露し、<br><strong>${rank}位</strong>という成績を収めた。</h2>${tail}</div>`;gameTop();
  if(state.freePlay){document.getElementById("gAgain").addEventListener("click",()=>startFreeGame(5));document.getElementById("gHome").addEventListener("click",renderHome)}else document.getElementById("gNext").addEventListener("click",()=>humanReady(5,humanIndex+1));
}

function recordScreen(gameIndex,p,humanIndex,main,sub=""){
  gameTop();
  if(state.freePlay){
    screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">${imgTag(p,"ready-avatar")}<div class="record-label">${GAMES[gameIndex].title} / SOLO RECORD</div><div class="big-record">${main}</div>${sub?`<p class="lead">${sub}</p>`:""}<button id="soloReplay" class="primary">同じゲームをもう一度</button><div style="height:8px"></div><button id="soloHome" class="secondary">メインメニューへ</button></div></div>`;
    document.getElementById("soloReplay").addEventListener("click",()=>startFreeGame(gameIndex));
    document.getElementById("soloHome").addEventListener("click",renderHome);
    return;
  }
  const more=humanIndex+1<humans().length;
  screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">${imgTag(p,"ready-avatar")}<div class="record-label">${GAMES[gameIndex].title} / RECORD</div><div class="big-record">${main}</div>${sub?`<p class="lead">${sub}</p>`:""}<button id="nextHuman" class="primary">${more?"次のプレイヤー":cpus().length?"CPU高速処理へ":`GAME ${gameIndex+1} RESULT`}</button></div></div>`;
  document.getElementById("nextHuman").addEventListener("click",()=>humanReady(gameIndex,humanIndex+1));
}

// CPU ----------------------------------------------------
async function simulateCpuThenResult(gameIndex){
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
  const chance=[0.12,0.10,0.14,0.16,0.12,0.13][gameIndex] ?? 0.12;
  return Math.random()<chance;
}

function simulateOneCpu(gameIndex,p){
  const ultra=cpuUltraDraw(gameIndex);state.cpuTier[`${gameIndex}:${p.id}`]=ultra?"SUPER":"STRONG";
  if(gameIndex===0){const bias={c5:8,c6:2,c7:12,c8:0}[p.id]||0;state.records.reaction[p.id]=ultra?randi(72,112):clamp(randi(125,230)+bias,118,245)}
  else if(gameIndex===1){const base={c5:9,c6:9,c7:8,c8:10}[p.id]||9;state.records.memory[p.id]=ultra?10:clamp(base+randi(-1,1),7,10)}
  else if(gameIndex===2){const bias={c5:180,c6:80,c7:260,c8:0}[p.id]||0;state.records.puzzle[p.id]=ultra?randi(1250,1850):clamp(randi(2150,3700)+bias,2050,4200)}
  else if(gameIndex===3){const bias={c5:25,c6:65,c7:0,c8:80}[p.id]||0;const meters=ultra?rand(1880,2000):clamp(rand(1380,1880)+bias,1300,1960);state.records.launch[p.id]=Math.round(meters*10)}
  else if(gameIndex===4){const bias={c5:2,c6:4,c7:1,c8:5}[p.id]||0;state.records.stack[p.id]=ultra?randi(27,36):clamp(randi(15,25)+bias,14,31)}
  else{const bias={c5:1,c6:0,c7:2,c8:0}[p.id]||0;state.records.breakdance[p.id]=ultra?randi(1,3):clamp(randi(3,12)+bias,2,16)}
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
  if(gameIndex===2)return clamp(Math.round((12000-v)/8000*100),0,100);
  if(gameIndex===3)return clamp(Math.round((v/10)/2000*100),0,100);
  if(gameIndex===4)return clamp(Math.round(v/30*100),0,100);
  return clamp(Math.round((40-v)/39*100),0,100);
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
function formatRecord(gameIndex,v){if(gameIndex===0)return `${(v/1000).toFixed(3)}秒`;if(gameIndex===1)return `${v}/10`;if(gameIndex===2)return `${(v/1000).toFixed(2)}秒`;if(gameIndex===3)return `${(v/10).toFixed(1)}m`;if(gameIndex===4)return `${v}体`;return `世界${v}位`}
function applyPoints(gameIndex,ranked){const gp={};ranked.forEach(e=>{gp[e.p.id]=e.points;state.total[e.p.id]=(state.total[e.p.id]||0)+e.points});state.gamePoints[gameIndex]=gp}
function competitionRankTotals(){const arr=participants().map(p=>({p,points:state.total[p.id]||0})).sort((a,b)=>b.points-a.points);let last=null,lastRank=0;arr.forEach((e,i)=>{e.rank=i>0&&e.points===last?lastRank:i+1;last=e.points;lastRank=e.rank});return arr}
function teamTotals(){if(!mode().team)return null;const sum=t=>mode().teams[t].reduce((s,id)=>s+(state.total[id]||0),0);return {A:sum("A"),B:sum("B")}}
function finishGame(gameIndex){const ranked=rankRecords(gameIndex);applyPoints(gameIndex,ranked);renderGameResult(gameIndex,ranked)}
function renderGameResult(gameIndex,ranked){
  const totals=competitionRankTotals(),tt=teamTotals(),g=GAMES[gameIndex],scoreMode=mode().performance;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">GAME ${g.no} COMPLETE</span><h2>${g.title} RESULT</h2></div><div class="game-badge">${g.no}/6</div></div>
  <section class="panel"><h3>${scoreMode?"GAME SCORE":"GAME RANKING"}</h3><div class="rank-list">${ranked.map(e=>rankRow(e.p,e.rank,formatRecord(gameIndex,e.value),scoreMode?`${e.points}/100 pt`:`+${e.points}pt`)).join("")}</div></section>
  <section class="panel"><h3>OVERALL</h3><div class="rank-list">${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,scoreMode?`MAX 600`:(mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER")))).join("")}</div></section>
  ${tt?`<section class="panel"><h3>TEAM TOTAL</h3><div class="team-total"><div class="team-box a"><span>${mode().teamNames.A}</span><b>${tt.A}pt</b></div><div class="team-box b"><span>${mode().teamNames.B}</span><b>${tt.B}pt</b></div></div></section>`:""}
  <button id="resultNext" class="primary">${gameIndex<5?`GAME ${gameIndex+2} へ`:"FINAL RESULT"}</button>`;
  gameTop();document.getElementById("resultNext").addEventListener("click",()=>gameIndex<5?showGameIntro(gameIndex+1):renderFinal());
}
function rankRow(p,rank,record,badge){const tier=p.cpu&&!state.freePlay?state.cpuTier[`${state.gameIndex}:${p.id}`]:null;return `<div class="rank-row"><div class="rank-place">${rank}位</div>${imgTag(p)}<div class="rank-name">${esc(p.name)}<span>${p.cpu?"CPU":`PLAYER ${p.no}`}${mode().team?` / ${teamName(p.id)}`:""}${tier==="SUPER"?" / SUPER CPU":""}</span></div><div class="rank-score"><b>${record}</b><span class="point-badge">${badge}</span></div></div>`}

function renderFinal(){
  const totals=competitionRankTotals(),tt=teamTotals();
  let winner="";
  if(tt)winner=tt.A===tt.B?"DRAW":tt.A>tt.B?`${mode().teamNames.A} WIN!`:`${mode().teamNames.B} WIN!`;
  else winner=`${totals[0].p.name} WIN!`;

  screen.innerHTML=`<div class="champion"><small>FINAL RESULT</small><strong>${esc(winner)}</strong>${tt?`<span>${mode().teamNames.A} ${tt.A}pt　–　${tt.B}pt ${mode().teamNames.B}</span>`:`<span>${mode().performance?"6ゲーム合計 / MAX 600pt":"全6ゲーム 総合順位"}</span>`}</div>
  <section class="panel"><h3>FINAL RANKING</h3><div class="rank-list">${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER"))).join("")}</div></section>
  <section class="panel"><h3>GAME SCORE</h3><div class="game-list">${GAMES.map((g,i)=>`<div class="game-row"><div class="game-no">${g.no}</div><div><b>${g.title}</b><br><span>${participants().map(p=>`${p.cpu?p.name:`P${p.no}`}:${state.gamePoints[i]?.[p.id]??0}`).join(" / ")}</span></div><span>pt</span></div>`).join("")}</div></section>
  <button id="replay" class="primary">同じモードでもう一度</button><div style="height:8px"></div><button id="modeChange" class="secondary">モード選択へ</button>`;

  document.getElementById("replay").addEventListener("click",()=>{
    const k=state.modeKey;
    state=freshState();
    state.modeKey=k;
    initTotals();
    renderModeLobby();
  });
  document.getElementById("modeChange").addEventListener("click",renderHome);
}

renderHome();
})();
