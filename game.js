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
  {no:3,key:"puzzle",title:"9ピース はめ込みパズル",sub:"9個のピースを正しい場所にはめる"},
  {no:4,key:"launch",title:"フィギュア飛ばし",sub:"2ゲージ平均で飛距離勝負"}
];

const MODES={
  solo4:{name:"4人 個人戦",short:"プレイヤー4人",participants:["p1","p2","p3","p4"],team:false,points:[5,3,1,0]},
  solo8:{name:"8人 個人戦",short:"プレイヤー4人 + CPU4人",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:false,points:[10,8,6,4,3,2,1,0]},
  tag:{name:"2対2 タッグ",short:"P1・P2 VS P3・P4",participants:["p1","p2","p3","p4"],team:true,points:[5,3,1,0],teams:{A:["p1","p2"],B:["p3","p4"]},teamNames:{A:"P1 + P2",B:"P3 + P4"}},
  humansVsCpu:{name:"4人 VS CPU4人",short:"PLAYER TEAM VS CPU TEAM",participants:["p1","p2","p3","p4","c5","c6","c7","c8"],team:true,points:[10,8,6,4,3,2,1,0],teams:{A:["p1","p2","p3","p4"],B:["c5","c6","c7","c8"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  free:{name:"1人フリープレイ",short:"好きなゲームだけ遊ぶ",participants:["p1"],team:false,points:[0]}
};

let state=freshState();
let audioCtx=null;
let activeAnimation=null;

function freshState(){
  return {modeKey:null,gameIndex:0,freePlay:false,freeGameIndex:null,records:{reaction:{},memory:{},puzzle:{},launch:{}},total:{},gamePoints:[null,null,null,null]};
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
function imgTag(p,cls="avatar"){return `<img class="${cls}" src="${p.img}" alt="${esc(p.name)}" onerror="this.style.visibility='hidden'">`}

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
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>4 MODE<br>GAMES</h1><p>4つのミニゲームを、個人戦・CPU入り・タッグ・プレイヤーVS CPUで遊べます。</p></div>
      <div class="hero-mark">MOB</div>
    </section>
    <section class="panel">
      <div class="panel-head"><h3>MODE SELECT</h3><span class="tag">4 MODES</span></div>
      <div class="mode-grid">
        <button class="mode-card" data-mode="solo4"><span class="mode-no">MODE 01</span><b>4人 個人戦</b><span>プレイヤー1〜4で個人順位を競う</span></button>
        <button class="mode-card" data-mode="solo8"><span class="mode-no">MODE 02</span><b>8人 個人戦</b><span>プレイヤー4人 + CPU4人</span></button>
        <button class="mode-card" data-mode="tag"><span class="mode-no">MODE 03</span><b>2対2 タッグ</b><span>P1・P2 VS P3・P4</span></button>
        <button class="mode-card" data-mode="humansVsCpu"><span class="mode-no">MODE 04</span><b>4人 VS CPU4人</b><span>PLAYER TEAM VS CPU TEAM</span></button>
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
  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">MODE SELECTED</span><h2>${m.name}</h2><p class="lead">${m.short}</p></div><div class="game-badge">${m.participants.length}人</div></div>
    <section class="panel"><div class="panel-head"><h3>ENTRY</h3><span class="tag">${m.team?"TEAM BATTLE":"INDIVIDUAL"}</span></div><div class="player-grid">${participants().map(p=>`<div class="player-card ${m.team?(teamOf(p.id)==="A"?"team-a":"team-b"):(p.cpu?"team-cpu":"team-human")}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>${p.cpu?"CPU":`PLAYER ${p.no}`}${m.team?` / ${teamName(p.id)}`:""}</span></div></div>`).join("")}</div></section>
    <section class="panel"><h3>POINT RULE</h3><div class="point-strip">${m.points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div><p class="note" style="margin-top:9px">同記録は同着。同着時は同じ順位ポイントを獲得し、次順位は人数分繰り下がります。</p></section>
    <section class="panel flat"><h3>PLAY ORDER</h3><p class="lead">プレイヤー1 → 2 → 3 → 4${cpus().length?" → CPUは高速処理":""}</p></section>
    <button id="modeStart" class="primary">GAME 1 START</button>`;
  document.getElementById("modeStart").addEventListener("click",()=>showGameIntro(0));
}

function showGameIntro(index){
  state.gameIndex=index;const g=GAMES[index];
  const rules=index===0?
    `<li>READY? → 3・2・1 → ランダム待機後、大きなMOBボタンが出現。</li><li>MOB表示からタップまでを0.01秒単位で計測。</li><li>速いほど上位。</li>`:
    index===1?`<li>icon/01.png〜10.pngを10枚ランダム配置。</li><li>3・2・1 → 10枚が順番に光ります。</li><li>もう一度3・2・1 → 光った順番にタップ。</li><li>間違えた時点で終了。同じ正解数は同着。</li>`:
    index===2?`<li>icon/006.pngを<strong>3×3の9ピース</strong>に分割。</li><li>下のピース置き場から1個選び、上の正しいマスをタップしてはめ込みます。</li><li>正しい場所ならその場に固定。違う場所ならピースは戻ります。</li><li>完成見本と薄いガイドを表示する、遊びやすい仕様。</li><li>9個すべてをはめるまでのタイムが速いほど上位。</li>`:
    `<li>最初に横長ゲージ、次に<strong>円周を回る円形ゲージ</strong>を止めます。</li><li>横ゲージは左右端、円形ゲージは上のMAX位置に近いほど100%。</li><li>2ゲージの平均値で飛距離を決定。</li><li>棒にパワーが集まり、icon/01.pngのフィギュアを打ち出します。</li><li>カメラが追尾し、飛距離をリアルタイム表示。</li>`;
  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">GAME ${g.no} / 4</span><h2>${g.title}</h2><p class="lead">${g.sub}</p></div><div class="game-badge">${g.no}/4</div></div>
    ${index===2?`<img class="preview-img" src="icon/006.png" alt="完成見本" onerror="this.style.visibility='hidden'">`:""}
    <section class="panel"><h3>RULE</h3><ul class="rules">${rules}</ul></section>
    ${state.freePlay
      ? `<section class="panel flat free-play-note"><h3>1 PLAYER FREE PLAY</h3><p class="lead">順位・ポイントなしで、このゲームだけ遊びます。</p></section>`
      : `<section class="panel flat"><h3>POINT</h3><div class="point-strip">${mode().points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div></section>`}
    <button id="introStart" class="primary">${state.freePlay?"READY? へ":"プレイヤー1 READY? へ"}</button>`;
  document.getElementById("introStart").addEventListener("click",()=>humanReady(index,0));
}

function humanReady(gameIndex,humanIndex){
  const list=humans();
  if(humanIndex>=list.length){return cpus().length?simulateCpuThenResult(gameIndex):finishGame(gameIndex)}
  const p=list[humanIndex],g=GAMES[gameIndex];
  screen.innerHTML=`<div class="ready-wrap"><div class="ready-card">${imgTag(p,"ready-avatar")}<span class="kicker">GAME ${g.no} / ${state.freePlay?"SOLO":`PLAYER ${humanIndex+1} OF ${list.length}`}</span><div class="ready-big">READY?</div><div class="ready-name">${esc(p.name)}</div><div class="ready-sub">${state.freePlay?"1 PLAYER FREE PLAY":(mode().team?teamName(p.id):`PLAYER ${p.no}`)}</div>${gameIndex===2?`<div class="puzzle-ready-guide"><span>完成見本</span><img src="icon/006.png" alt="完成見本" onerror="this.style.visibility='hidden'"><small>9個を正しい場所にはめるだけ。下の初期位置は毎回ランダム。</small></div>`:""}<button id="readyBtn" class="primary">準備OK</button></div></div>`;
  document.getElementById("readyBtn").addEventListener("click",()=>{
    if(gameIndex===0)startReaction(p,humanIndex);
    else if(gameIndex===1)startMemory(p,humanIndex);
    else if(gameIndex===2)startPuzzle(p,humanIndex);
    else startLaunch(p,humanIndex);
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
  screen.innerHTML=`<section class="reaction-stage"><div><span class="kicker">${esc(p.name)}</span><h2>反射神経</h2></div><div id="reactionZone" class="reaction-zone"><div class="wait-dots">•••</div></div><p class="hint">MOBが出た瞬間にタップ。画面全体のフラッシュはありません。</p></section>`;
  await countdown();const zone=document.getElementById("reactionZone");if(!zone)return;await wait(rand(650,1900));if(!document.body.contains(zone))return;
  const btn=document.createElement("button");btn.type="button";btn.className="mob-button";btn.textContent="MOB";zone.innerHTML="";zone.appendChild(btn);const t0=performance.now();
  btn.addEventListener("pointerdown",()=>{const cs=Math.max(1,Math.round((performance.now()-t0)/10));state.records.reaction[p.id]=cs;beep(870,100);recordScreen(0,p,humanIndex,`${(cs/100).toFixed(2)}<small>秒</small>`);},{once:true});
}

// GAME 2 -------------------------------------------------
async function startMemory(p,humanIndex){
  const ids=shuffle(Array.from({length:10},(_,i)=>i+1));const seq=shuffle([...ids]);let input=0,active=false;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>記憶力ゲーム</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="memory-status"><div class="stat-box"><span>PHASE</span><b id="memPhase">WATCH</b></div><div class="stat-box"><span>CORRECT</span><b id="memCount">0 / 10</b></div></div><div id="memoryBoard" class="memory-board">${ids.map(id=>`<button type="button" class="memory-tile" data-id="${id}"><img src="icon/${String(id).padStart(2,"0")}.png" alt="icon ${id}" onerror="this.style.visibility='hidden'"></button>`).join("")}</div><p id="memHint" class="hint">3・2・1のあと、光る順番を覚えてください。</p>`;
  const board=document.getElementById("memoryBoard"),phase=document.getElementById("memPhase"),count=document.getElementById("memCount"),hint=document.getElementById("memHint");const tile=id=>board.querySelector(`[data-id="${id}"]`);
  await countdown("WATCH");
  for(const id of seq){if(!document.body.contains(board))return;tile(id).classList.add("showing");beep(400+id*18,55,.018);await wait(390);tile(id).classList.remove("showing");await wait(125)}
  phase.textContent="READY";hint.textContent="次の3・2・1のあと、同じ順番でタップ。";await wait(300);await countdown("TAP");phase.textContent="TAP";hint.textContent="光った順にタップしてください。";active=true;
  board.addEventListener("pointerdown",async e=>{const t=e.target.closest(".memory-tile");if(!t||!active)return;const id=Number(t.dataset.id);if(id===seq[input]){t.classList.add("correct");setTimeout(()=>t.classList.remove("correct"),170);beep(730,45,.02);input++;count.textContent=`${input} / 10`;if(input===10){active=false;state.records.memory[p.id]=10;await wait(240);recordScreen(1,p,humanIndex,`10<small>/10</small>`)}}else{active=false;t.classList.add("wrong");beep(170,160,.03);state.records.memory[p.id]=input;hint.textContent="MISS";await wait(430);recordScreen(1,p,humanIndex,`${input}<small>/10</small>`)}});
}

// GAME 3 -------------------------------------------------
function randomPuzzleTrayOrder(){
  const base=Array.from({length:9},(_,i)=>i);
  let order;
  do{ order=shuffle(base); }
  while(order.some((id,i)=>id===i));
  return order;
}

async function startPuzzle(p,humanIndex){
  const trayOrder=randomPuzzleTrayOrder();
  const placed=Array(9).fill(null);
  let selected=null,finished=false,t0=0,tries=0;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>9ピース はめ込みパズル</h2><p class="lead">9個を正しい場所にはめよう</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="fit-wrap">
      <div class="puzzle-meta"><div class="stat-box"><span>TIME</span><b id="puzTime">0.00</b></div><div class="stat-box"><span>FIT</span><b id="puzFit">0 / 9</b></div></div>
      <div class="fit-guide"><img src="icon/006.png" alt="完成見本" onerror="this.style.visibility='hidden'"><div><b>完成見本</b><span>下のピースを選んで、上の同じ場所をタップ</span></div></div>
      <div id="fitBoard" class="fit-board" aria-label="はめ込み先"></div>
      <div class="fit-tray-title"><b>PIECE / RANDOM</b><span id="fitHint">毎回ランダム配置 / ピースを1個タップ</span></div>
      <div id="fitTray" class="fit-tray"></div>
    </div>`;

  const board=document.getElementById("fitBoard"),tray=document.getElementById("fitTray"),timeEl=document.getElementById("puzTime"),fitEl=document.getElementById("puzFit"),hint=document.getElementById("fitHint");
  const pieceStyle=id=>{const col=id%3,row=Math.floor(id/3),x=col*50,y=row*50;return `background-size:300% 300%;background-position:${x}% ${y}%`};

  function drawBoard(){
    board.innerHTML=Array.from({length:9},(_,slot)=>{
      const id=placed[slot];
      if(id===slot)return `<div class="fit-slot filled" data-slot="${slot}"><div class="fit-piece fixed" style="${pieceStyle(id)}"></div></div>`;
      return `<button type="button" class="fit-slot" data-slot="${slot}" aria-label="${slot+1}番の場所"><div class="fit-ghost" style="${pieceStyle(slot)}"></div><span>${slot+1}</span></button>`;
    }).join("");
  }
  function drawTray(){
    tray.innerHTML=trayOrder.map(id=>{
      if(placed[id]===id)return `<div class="fit-piece-space"></div>`;
      return `<button type="button" class="fit-piece ${selected===id?"selected":""}" data-piece="${id}" style="${pieceStyle(id)}" aria-label="ピース${id+1}"><span>${id+1}</span></button>`;
    }).join("");
  }
  function selectPiece(id){
    if(finished||placed[id]===id)return;
    selected=id;drawTray();hint.textContent=`ピース ${id+1} を選択中 → 上の場所をタップ`;
    beep(560,35,.015);
  }
  async function tryFit(slot){
    if(finished)return;
    if(selected===null){hint.textContent="先に下のピースを1個タップ";beep(190,55,.018);return;}
    tries++;
    if(selected===slot){
      placed[slot]=selected;selected=null;drawBoard();drawTray();
      const count=placed.filter((v,i)=>v===i).length;fitEl.textContent=`${count} / 9`;hint.textContent=count<9?"OK! 次のピースを選んでください":"COMPLETE!";
      beep(800,65,.025);
      const target=board.querySelector(`[data-slot="${slot}"]`);if(target)target.classList.add("just-fit");
      if(count===9){
        finished=true;cancelActiveAnimation();const cs=Math.max(1,Math.round((performance.now()-t0)/10));state.records.puzzle[p.id]=cs;beep(940,130,.04);await wait(420);recordScreen(2,p,humanIndex,`${(cs/100).toFixed(2)}<small>秒</small>`,`9 / 9 COMPLETE`);
      }
    }else{
      const wrong=board.querySelector(`[data-slot="${slot}"]`);if(wrong){wrong.classList.add("wrong-fit");setTimeout(()=>wrong.classList.remove("wrong-fit"),260)}
      hint.textContent="そこではありません。別の場所へ！";beep(170,120,.025);
    }
  }

  drawBoard();drawTray();await countdown("PUZZLE");t0=performance.now();
  const tick=()=>{if(finished)return;timeEl.textContent=(Math.floor((performance.now()-t0)/10)/100).toFixed(2);activeAnimation=requestAnimationFrame(tick)};activeAnimation=requestAnimationFrame(tick);
  tray.addEventListener("pointerdown",e=>{const t=e.target.closest(".fit-piece[data-piece]");if(!t)return;selectPiece(Number(t.dataset.piece))});
  board.addEventListener("pointerdown",e=>{const t=e.target.closest(".fit-slot[data-slot]");if(!t||t.classList.contains("filled"))return;tryFit(Number(t.dataset.slot))});
}

// GAME 4 -------------------------------------------------
async function startLaunch(p,humanIndex){
  let linear=0,circle=0,phase="linear",start=performance.now();

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>フィギュア飛ばし</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
  <div class="gauge-wrap">
    <section id="linearCard" class="gauge-card">
      <div class="gauge-title">1. 横長ゲージ <span id="linearScore">タップでSTOP</span></div>
      <div id="linearGauge" class="linear-gauge"><div id="linearMarker" class="linear-marker"></div></div>
    </section>

    <section id="circleCard" class="gauge-card disabled">
      <div class="gauge-title">2. 円形ゲージ <span id="circleScore">WAIT</span></div>
      <div id="circleGauge" class="circle-gauge" role="button" aria-label="円形ゲージを止める">
        <div class="circle-max-zone"><b>MAX</b><span>100</span></div>
        <div class="circle-ring"></div>
        <div id="circleNeedle" class="circle-needle"></div>
        <div class="circle-center"><span>POWER</span><b id="circleLive">--</b></div>
      </div>
      <p class="circle-help">針が円周を360°回転。上のMAXに近いほど高得点。</p>
    </section>
    <p class="hint">横は左右端、円は上のMAXに近いほど100%。2つの平均値が最終パワー。</p>
  </div>`;

  const lg=document.getElementById("linearGauge"),
        lm=document.getElementById("linearMarker"),
        lc=document.getElementById("linearCard"),
        ls=document.getElementById("linearScore"),
        cg=document.getElementById("circleGauge"),
        needle=document.getElementById("circleNeedle"),
        live=document.getElementById("circleLive"),
        cc=document.getElementById("circleCard"),
        cs=document.getElementById("circleScore");

  function linearAnim(now){
    if(phase!=="linear")return;
    const t=(now-start)/760;
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
    const angle=((now-start)/1150*360)%360;
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
    const avg=(linear+circle)/2;
    setTimeout(()=>launchAnimation(p,humanIndex,avg,linear,circle),360);
  }

  activeAnimation=requestAnimationFrame(linearAnim);

  lg.addEventListener("pointerdown",stopLinear,{passive:false});
  lg.addEventListener("click",stopLinear);
  cg.addEventListener("pointerdown",stopCircle,{passive:false});
  cg.addEventListener("touchstart",stopCircle,{passive:false});
  cg.addEventListener("click",stopCircle);
}

async function launchAnimation(p,humanIndex,power,linear,circle){
  const maxMeters=280;const target=Math.round(Math.pow(power/100,1.35)*maxMeters*10)/10;const pxPerM=16;const targetX=128+target*pxPerM;
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">POWER ${power.toFixed(1)}%</span><h2>FLY!</h2><p class="lead">横 ${linear}% / 円 ${circle}%</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="flight-card"><div class="flight-hud"><div><span>REALTIME DISTANCE</span><b id="distance">0.0 m</b></div><div><span>POWER</span><b>${power.toFixed(1)}%</b></div></div><div id="viewport" class="flight-viewport"><div id="world" class="flight-world"><div class="ground-line"></div>${Array.from({length:6},(_,i)=>`<div class="meter-mark" style="left:${128+i*50*pxPerM}px"><span>${i*50}m</span></div>`).join("")}<div class="power-orb"></div><div id="stick" class="power-stick"></div><img id="figure" class="figure" src="icon/01.png" alt="figure" onerror="this.style.visibility='hidden'"></div></div></div>`;
  const viewport=document.getElementById("viewport"),world=document.getElementById("world"),figure=document.getElementById("figure"),stick=document.getElementById("stick"),distance=document.getElementById("distance");
  stick.classList.add("strike");beep(140,120,.035);await wait(440);beep(860,90,.03);
  const duration=2600+power*7;const start=performance.now();
  function easeOutCubic(t){return 1-Math.pow(1-t,3)}
  function flight(now){const raw=clamp((now-start)/duration,0,1),e=easeOutCubic(raw),x=128+(targetX-128)*e;const meters=(x-128)/pxPerM;const arc=Math.sin(raw*Math.PI)*Math.min(120,30+power*.95);figure.style.left=`${x}px`;figure.style.bottom=`${76+arc}px`;figure.style.transform=`rotate(${raw*1440}deg)`;distance.textContent=`${Math.min(target,meters).toFixed(1)} m`;const vw=viewport.clientWidth;const cam=Math.max(0,x-vw*.44);world.style.transform=`translateX(${-cam}px)`;if(raw<1)activeAnimation=requestAnimationFrame(flight);else{activeAnimation=null;state.records.launch[p.id]=Math.round(target*10);setTimeout(()=>recordScreen(3,p,humanIndex,`${target.toFixed(1)}<small>m</small>`,`POWER ${power.toFixed(1)}%`),420)}}
  activeAnimation=requestAnimationFrame(flight);
}

function recordScreen(gameIndex,p,humanIndex,main,sub=""){
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
  const list=cpus();
  screen.innerHTML=`<div class="cpu-sim"><div class="cpu-sim-box"><span class="kicker">CPU QUICK PROCESS</span><h2>CPU RESULT</h2><p class="lead">CPU4人分を高速処理しています。</p><div id="cpuRows">${list.map(p=>`<div class="cpu-row" data-cpu="${p.id}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>CPU</span></div><div class="cpu-dot">•••</div></div>`).join("")}</div></div></div>`;
  for(const p of list){await wait(150);simulateOneCpu(gameIndex,p);const row=screen.querySelector(`[data-cpu="${p.id}"] .cpu-dot`);if(row){row.textContent="DONE";row.classList.add("done");beep(470,30,.012)}}
  await wait(420);finishGame(gameIndex);
}
function simulateOneCpu(gameIndex,p){
  if(gameIndex===0){const skill={c5:[20,48],c6:[22,52],c7:[18,45],c8:[17,42]}[p.id]||[20,50];state.records.reaction[p.id]=randi(skill[0],skill[1]);}
  else if(gameIndex===1){const base={c5:7,c6:8,c7:6,c8:9}[p.id]||7;state.records.memory[p.id]=clamp(base+randi(-2,1),0,10);}
  else if(gameIndex===2){const base={c5:1250,c6:1080,c7:1450,c8:920}[p.id]||1200;state.records.puzzle[p.id]=clamp(base+randi(-260,320),620,2200);}
  else{const base={c5:69,c6:74,c7:65,c8:82}[p.id]||72;const power=clamp(base+randi(-16,14),18,99);const dist=Math.round(Math.pow(power/100,1.35)*2800);state.records.launch[p.id]=dist;}
}

// RANKING ------------------------------------------------
function rankRecords(gameIndex){
  const key=GAMES[gameIndex].key,records=state.records[key],asc=(gameIndex===0||gameIndex===2);const arr=participants().map(p=>({p,value:records[p.id]})).sort((a,b)=>asc?a.value-b.value:b.value-a.value);let last=null,lastRank=0;arr.forEach((e,i)=>{const same=i>0&&e.value===last;e.rank=same?lastRank:i+1;e.points=mode().points[e.rank-1]??0;last=e.value;lastRank=e.rank});return arr;
}
function formatRecord(gameIndex,v){if(gameIndex===0||gameIndex===2)return `${(v/100).toFixed(2)}秒`;if(gameIndex===1)return `${v}/10`;return `${(v/10).toFixed(1)}m`}
function applyPoints(gameIndex,ranked){const gp={};ranked.forEach(e=>{gp[e.p.id]=e.points;state.total[e.p.id]=(state.total[e.p.id]||0)+e.points});state.gamePoints[gameIndex]=gp}
function competitionRankTotals(){const arr=participants().map(p=>({p,points:state.total[p.id]||0})).sort((a,b)=>b.points-a.points);let last=null,lastRank=0;arr.forEach((e,i)=>{e.rank=i>0&&e.points===last?lastRank:i+1;last=e.points;lastRank=e.rank});return arr}
function teamTotals(){if(!mode().team)return null;const sum=t=>mode().teams[t].reduce((s,id)=>s+(state.total[id]||0),0);return {A:sum("A"),B:sum("B")}}

function finishGame(gameIndex){
  const ranked=rankRecords(gameIndex);applyPoints(gameIndex,ranked);renderGameResult(gameIndex,ranked);
}
function renderGameResult(gameIndex,ranked){
  const totals=competitionRankTotals(),tt=teamTotals(),g=GAMES[gameIndex];
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">GAME ${g.no} COMPLETE</span><h2>${g.title} RESULT</h2></div><div class="game-badge">${g.no}/4</div></div>
  <section class="panel"><h3>GAME RANKING</h3><div class="rank-list">${ranked.map(e=>rankRow(e.p,e.rank,formatRecord(gameIndex,e.value),`+${e.points}pt`)).join("")}</div></section>
  <section class="panel"><h3>OVERALL</h3><div class="rank-list">${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER"))).join("")}</div></section>
  ${tt?`<section class="panel"><h3>TEAM TOTAL</h3><div class="team-total"><div class="team-box a"><span>${mode().teamNames.A}</span><b>${tt.A}pt</b></div><div class="team-box b"><span>${mode().teamNames.B}</span><b>${tt.B}pt</b></div></div></section>`:""}
  <button id="resultNext" class="primary">${gameIndex<3?`GAME ${gameIndex+2} へ`:"FINAL RESULT"}</button>`;
  document.getElementById("resultNext").addEventListener("click",()=>gameIndex<3?showGameIntro(gameIndex+1):renderFinal());
}
function rankRow(p,rank,record,badge){return `<div class="rank-row"><div class="rank-place">${rank}位</div>${imgTag(p)}<div class="rank-name">${esc(p.name)}<span>${p.cpu?"CPU":`PLAYER ${p.no}`}${mode().team?` / ${teamName(p.id)}`:""}</span></div><div class="rank-score"><b>${record}</b><span class="point-badge">${badge}</span></div></div>`}

function renderFinal(){
  const totals=competitionRankTotals(),tt=teamTotals();let winner="";
  if(tt)winner=tt.A===tt.B?"DRAW":tt.A>tt.B?`${mode().teamNames.A} WIN!`:`${mode().teamNames.B} WIN!`;
  else winner=`${totals[0].p.name} WIN!`;
  screen.innerHTML=`<div class="champion"><small>FINAL RESULT</small><strong>${esc(winner)}</strong>${tt?`<span>${mode().teamNames.A} ${tt.A}pt　–　${tt.B}pt ${mode().teamNames.B}</span>`:`<span>全4ゲーム 総合順位</span>`}</div>
  <section class="panel"><h3>FINAL RANKING</h3><div class="rank-list">${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER"))).join("")}</div></section>
  <section class="panel"><h3>GAME SCORE</h3><div class="game-list">${GAMES.map((g,i)=>`<div class="game-row"><div class="game-no">${g.no}</div><div><b>${g.title}</b><br><span>${participants().map(p=>`${p.cpu?p.name:`P${p.no}`}:${state.gamePoints[i]?.[p.id]??0}`).join(" / ")}</span></div><span>pt</span></div>`).join("")}</div></section>
  <button id="replay" class="primary">同じモードでもう一度</button><div style="height:8px"></div><button id="modeChange" class="secondary">モード選択へ</button>`;
  document.getElementById("replay").addEventListener("click",()=>{const k=state.modeKey;state=freshState();state.modeKey=k;initTotals();renderModeLobby()});document.getElementById("modeChange").addEventListener("click",renderHome);
}

renderHome();
})();
