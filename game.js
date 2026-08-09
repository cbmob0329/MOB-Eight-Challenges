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
  {no:3,key:"puzzle",title:"ナンバー12 パズル",sub:"1〜12を順番に消すタイムアタック"},
  {no:4,key:"launch",title:"フィギュア飛ばし",sub:"2ゲージ平均で最大1000m"},
  {no:5,key:"stack",title:"グラグラモブくん",sub:"フィギュアを何体積めるか勝負"}
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
  return {modeKey:null,gameIndex:0,freePlay:false,freeGameIndex:null,records:{reaction:{},memory:{},puzzle:{},launch:{},stack:{}},total:{},gamePoints:[null,null,null,null,null],cpuTier:{}};
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
      <div><span class="kicker">SMARTPHONE PARTY GAME</span><h1>5 MINI<br>GAMES</h1><p>5つのミニゲームを、4人個人戦・CPU入り8人戦・タッグ・PLAYER VS CPUで遊べます。</p></div>
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
  state.gameIndex=index;
  const g=GAMES[index];
  let rules="";
  if(index===0){
    rules=`<li>READY? → 3・2・1 → ランダム待機後、大きなMOBボタンが出現。</li>
      <li>MOB表示からタップまでを<strong>0.001秒単位</strong>で計測。</li>
      <li>速いほど上位。</li>`;
  }else if(index===1){
    rules=`<li>icon/01.png〜10.pngを10枚ランダム配置。</li>
      <li>3・2・1 → 10枚が順番に光ります。</li>
      <li>もう一度3・2・1 → 光った順番にタップ。</li>
      <li>間違えた時点で終了。同じ正解数は同着。</li>`;
  }else if(index===2){
    rules=`<li>12個のマスに<strong>1〜12の数字を毎回ランダム配置</strong>。</li>
      <li>3・2・1のあとタイムスタート。</li>
      <li>1 → 2 → 3 … → 12 の順番でタップすると、そのマスが消えます。</li>
      <li>最後の12を消した瞬間のタイムで順位決定。</li>
      <li>順番を間違えても終了にはならず、タイムだけ進み続けます。</li>`;
  }else if(index===3){
    rules=`<li>最初に横長ゲージ、次に円周を回る円形ゲージを止めます。</li>
      <li>横ゲージは左右端、円形ゲージは上のMAX位置に近いほど100%。</li>
      <li>2ゲージの平均値で飛距離を決定。</li>
      <li>最高飛距離は<strong>1000m</strong>。</li>
      <li>棒でフィギュアを打ち、カメラが回転しながら飛ぶフィギュアを追尾します。</li>`;
  }else{
    rules=`<li>icon/01.pngのフィギュアをタップでつかみ、左右に動かします。</li>
      <li>指を離すとフィギュアが落下し、タワーの上に積み上がります。</li>
      <li><strong>5体目あたりからタワーがグラグラ</strong>して難しくなります。</li>
      <li>バランスを崩して落ちた時点で、それまで積めた数が記録。</li>
      <li>積んだ数が多いほど上位。</li>`;
  }

  screen.innerHTML=`
    <div class="game-head"><div><span class="kicker">GAME ${g.no} / 5</span><h2>${g.title}</h2><p class="lead">${g.sub}</p></div><div class="game-badge">${g.no}/5</div></div>
    <section class="panel"><h3>RULE</h3><ul class="rules">${rules}</ul></section>
    ${state.freePlay
      ? `<section class="panel flat free-play-note"><h3>1 PLAYER FREE PLAY</h3><p class="lead">順位・ポイントなしで、このゲームだけ遊びます。</p></section>`
      : `<section class="panel flat"><h3>POINT</h3><div class="point-strip">${mode().points.map((p,i)=>`<span class="point-pill">${i+1}位 ${p}pt</span>`).join("")}</div></section>`}
    <button id="introStart" class="primary">${state.freePlay?"READY? へ":"プレイヤー1 READY? へ"}</button>`;
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
    ${gameIndex===2?`<div class="number-ready-guide"><b>1 → 2 → 3 → … → 12</b><small>数字は毎回ランダム配置</small></div>`:""}
    ${gameIndex===4?`<div class="number-ready-guide"><b>GRAB → MOVE → DROP</b><small>5体目からグラグラが強くなります</small></div>`:""}
    <button id="readyBtn" class="primary">準備OK</button>
  </div></div>`;
  document.getElementById("readyBtn").addEventListener("click",()=>{
    if(gameIndex===0)startReaction(p,humanIndex);
    else if(gameIndex===1)startMemory(p,humanIndex);
    else if(gameIndex===2)startPuzzle(p,humanIndex);
    else if(gameIndex===3)startLaunch(p,humanIndex);
    else startStack(p,humanIndex);
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
  let next=1,finished=false,t0=0;

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>ナンバー12 パズル</h2><p class="lead">1 → 12 の順に消せ！</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="number-puzzle-wrap">
      <div class="puzzle-meta">
        <div class="stat-box"><span>TIME</span><b id="numTime">0.00</b></div>
        <div class="stat-box"><span>NEXT</span><b id="numNext">1</b></div>
      </div>
      <div id="numberBoard" class="number-board prestart">
        ${slots.map((num,slot)=>{
          const col=slot%3,row=Math.floor(slot/3);
          const x=col*50,y=(row/3)*100;
          return `<button type="button" class="number-tile" data-num="${num}" style="--px:${x}%;--py:${y}%"><span>${num}</span></button>`;
        }).join("")}
      </div>
      <p id="numHint" class="hint">3・2・1のあと、1から順番にタップ。</p>
    </div>`;

  const board=document.getElementById("numberBoard");
  const timeEl=document.getElementById("numTime");
  const nextEl=document.getElementById("numNext");
  const hint=document.getElementById("numHint");

  await countdown("NUMBER 12");
  if(!document.body.contains(board))return;
  board.classList.remove("prestart");
  t0=performance.now();

  const tick=()=>{
    if(finished)return;
    timeEl.textContent=((performance.now()-t0)/1000).toFixed(2);
    activeAnimation=requestAnimationFrame(tick);
  };
  activeAnimation=requestAnimationFrame(tick);

  board.addEventListener("pointerdown",async e=>{
    const tile=e.target.closest(".number-tile");
    if(!tile||finished||tile.classList.contains("cleared"))return;
    const num=Number(tile.dataset.num);

    if(num===next){
      tile.classList.add("cleared");
      beep(560+next*18,38,.018);
      next++;
      if(next<=12){
        nextEl.textContent=next;
        hint.textContent=`次は ${next}`;
      }else{
        finished=true;
        cancelActiveAnimation();
        const ms=Math.max(1,Math.round(performance.now()-t0));
        state.records.puzzle[p.id]=ms;
        nextEl.textContent="CLEAR";
        hint.textContent="COMPLETE!";
        beep(940,130,.04);
        await wait(420);
        recordScreen(2,p,humanIndex,`${(ms/1000).toFixed(2)}<small>秒</small>`,`1 → 12 COMPLETE`);
      }
    }else{
      tile.classList.remove("wrong-number");
      void tile.offsetWidth;
      tile.classList.add("wrong-number");
      hint.textContent=`${next} を探してください`;
      beep(170,90,.02);
    }
  });
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
  const maxMeters=1000;
  const target=Math.round(Math.pow(power/100,1.22)*maxMeters*10)/10;
  const pxPerM=4.6;
  const targetX=128+target*pxPerM;
  const worldWidth=128+maxMeters*pxPerM+420;

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">POWER ${power.toFixed(1)}%</span><h2>FLY!</h2><p class="lead">横 ${linear}% / 円 ${circle}%</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
  <div class="flight-card">
    <div class="flight-hud">
      <div><span>REALTIME DISTANCE</span><b id="distance">0.0 m</b></div>
      <div><span>MAX</span><b>1000m</b></div>
    </div>
    <div id="viewport" class="flight-viewport">
      <div id="world" class="flight-world" style="width:${worldWidth}px">
        <div class="ground-line"></div>
        ${Array.from({length:11},(_,i)=>`<div class="meter-mark" style="left:${128+i*100*pxPerM}px"><span>${i*100}m</span></div>`).join("")}
        <div class="power-orb"></div>
        <div id="stick" class="power-stick"></div>
        <img id="figure" class="figure" src="icon/01.png" alt="figure" onerror="this.style.visibility='hidden'">
      </div>
    </div>
  </div>`;

  const viewport=document.getElementById("viewport"),
        world=document.getElementById("world"),
        figure=document.getElementById("figure"),
        stick=document.getElementById("stick"),
        distance=document.getElementById("distance");

  stick.classList.add("strike");
  beep(140,120,.035);
  await wait(440);
  beep(860,90,.03);

  const duration=3000+power*10;
  const start=performance.now();
  function easeOutCubic(t){return 1-Math.pow(1-t,3)}

  function flight(now){
    const raw=clamp((now-start)/duration,0,1);
    const e=easeOutCubic(raw);
    const x=128+(targetX-128)*e;
    const meters=(x-128)/pxPerM;
    const arc=Math.sin(raw*Math.PI)*Math.min(150,40+power*1.12);

    figure.style.left=`${x}px`;
    figure.style.bottom=`${76+arc}px`;
    figure.style.transform=`rotate(${raw*1800}deg)`;
    distance.textContent=`${Math.min(target,meters).toFixed(1)} m`;

    const vw=viewport.clientWidth;
    const cam=Math.max(0,x-vw*.42);
    world.style.transform=`translateX(${-cam}px)`;

    if(raw<1){
      activeAnimation=requestAnimationFrame(flight);
    }else{
      activeAnimation=null;
      state.records.launch[p.id]=Math.round(target*10);
      setTimeout(()=>recordScreen(3,p,humanIndex,`${target.toFixed(1)}<small>m</small>`,`POWER ${power.toFixed(1)}% / MAX 1000m`),420);
    }
  }
  activeAnimation=requestAnimationFrame(flight);
}

// GAME 5 -------------------------------------------------
async function startStack(p,humanIndex){
  let count=0;
  let active=null;
  let dragging=false;
  let dropping=false;
  let finished=false;
  let pointerId=null;
  let wobble=0;
  let wobbleRAF=null;
  const pieceW=66;
  const pieceH=52;
  const baseBottom=30;
  const stacked=[];

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>グラグラモブくん</h2><p class="lead">つかんで → 動かして → 離す</p></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="stack-wrap">
      <div class="stack-hud">
        <div class="stat-box"><span>STACK</span><b id="stackCount">0</b></div>
        <div class="stat-box"><span>DIFFICULTY</span><b id="stackDifficulty">EASY</b></div>
      </div>
      <div id="stackStage" class="stack-stage">
        <div class="stack-sky-label">DROP ZONE</div>
        <div id="towerWorld" class="tower-world">
          <div id="stackLayer" class="stack-layer"></div>
          <div class="tower-base"></div>
        </div>
        <div id="activeLayer" class="active-layer"></div>
      </div>
      <p id="stackHint" class="hint">フィギュアをタップしたまま左右に動かし、離して落としてください。</p>
    </div>`;

  const stage=document.getElementById("stackStage");
  const world=document.getElementById("towerWorld");
  const stackLayer=document.getElementById("stackLayer");
  const activeLayer=document.getElementById("activeLayer");
  const countEl=document.getElementById("stackCount");
  const diffEl=document.getElementById("stackDifficulty");
  const hint=document.getElementById("stackHint");

  function stageWidth(){return stage.clientWidth}
  function difficultyText(){
    if(count<5)return "EASY";
    if(count<8)return "WOBBLE";
    if(count<11)return "HARD";
    return "CRAZY";
  }
  function tolerance(){
    if(count<5)return 42-count*3;
    return Math.max(12,29-(count-5)*2.15);
  }
  function wobbleAmp(){
    if(count<5)return 0;
    return Math.min(20,3+(count-5)*2.25);
  }
  function cameraShift(){
    const top=baseBottom+(count+1)*pieceH;
    return Math.max(0,top-(stage.clientHeight-135));
  }
  function updateCamera(){
    world.style.transform=`translateY(${cameraShift()}px)`;
  }
  function renderStack(){
    stackLayer.innerHTML=stacked.map((it,i)=>`
      <img class="stack-piece placed" src="icon/01.png" alt="" style="left:${it.x-pieceW/2}px;bottom:${baseBottom+i*pieceH}px;transform:rotate(${it.rot}deg)" onerror="this.style.visibility='hidden'">
    `).join("");
    countEl.textContent=count;
    diffEl.textContent=difficultyText();
    updateCamera();
  }

  function startWobble(){
    const started=performance.now();
    const frame=now=>{
      if(finished)return;
      const amp=wobbleAmp();
      wobble=amp ? Math.sin((now-started)/(370-Math.min(count,12)*11))*amp : 0;
      stackLayer.style.transform=`translateX(${wobble}px)`;
      if(count>=5){
        const rot=Math.sin((now-started)/520)*Math.min(2.8,(count-4)*.34);
        stackLayer.style.rotate=`${rot}deg`;
      }else{
        stackLayer.style.rotate="0deg";
      }
      wobbleRAF=requestAnimationFrame(frame);
    };
    wobbleRAF=requestAnimationFrame(frame);
  }

  function spawnPiece(){
    if(finished)return;
    dragging=false;
    dropping=false;
    pointerId=null;
    const sw=stageWidth();
    const startX=clamp(sw*.5+rand(-sw*.24,sw*.24),pieceW/2+8,sw-pieceW/2-8);
    active={x:startX,y:18};
    activeLayer.innerHTML=`<img id="activeStackPiece" class="stack-piece active" src="icon/01.png" alt="figure" style="left:${active.x-pieceW/2}px;top:${active.y}px" onerror="this.style.visibility='hidden'">`;
    hint.textContent=count<5
      ? "フィギュアをつかんで、タワーの真上へ。"
      : "タワーがグラグラ！動いている中心を狙ってください。";
  }

  function activeEl(){return document.getElementById("activeStackPiece")}

  function setActiveX(clientX){
    if(!active)return;
    const rect=stage.getBoundingClientRect();
    active.x=clamp(clientX-rect.left,pieceW/2+6,rect.width-pieceW/2-6);
    const el=activeEl();
    if(el)el.style.left=`${active.x-pieceW/2}px`;
  }

  async function releasePiece(){
    if(!active||dropping||finished)return;
    dropping=true;
    dragging=false;

    const sw=stageWidth();
    const visualTarget=count===0 ? sw/2 : stacked[stacked.length-1].x+wobble;
    const off=active.x-visualTarget;
    const allowed=tolerance();
    const landingBottom=baseBottom+count*pieceH;
    const stageH=stage.clientHeight;
    const camera=cameraShift();
    const targetTop=stageH-(landingBottom+pieceH)+camera;
    const el=activeEl();
    if(!el)return;

    const startTop=parseFloat(el.style.top)||18;
    const dropStart=performance.now();
    const dropDur=360+Math.min(220,count*14);

    await new Promise(resolve=>{
      const fall=now=>{
        const t=clamp((now-dropStart)/dropDur,0,1);
        const e=1-Math.pow(1-t,3);
        el.style.top=`${startTop+(targetTop-startTop)*e}px`;
        el.style.transform=`rotate(${off*.16*t}deg)`;
        if(t<1)requestAnimationFrame(fall);else resolve();
      };
      requestAnimationFrame(fall);
    });

    const leanPressure=count>=5 ? Math.abs(off)+(Math.abs(wobble)*.36) : Math.abs(off);
    const fail=leanPressure>allowed;

    if(fail){
      hint.textContent="BALANCE BREAK!";
      beep(150,230,.04);
      el.classList.add(off>=0?"fall-right":"fall-left");
      await wait(760);
      finishStack();
      return;
    }

    // Convert visible x into the wobbling stack layer's local x.
    const localX=active.x-wobble;
    const rot=clamp(off*.12,-7,7);
    stacked.push({x:localX,rot});
    count++;
    active=null;
    activeLayer.innerHTML="";
    renderStack();
    beep(760,70,.024);

    // From the fifth figure onward, marginal landings visibly wobble.
    // Collapse is based on placement accuracy, not a random failure.
    if(count>=5 && leanPressure>allowed*.72){
      hint.textContent="グラグラ…！かなり危ない！";
      stackLayer.classList.add("tower-danger");
      await wait(420);
      stackLayer.classList.remove("tower-danger");
    }

    await wait(270);
    spawnPiece();
  }

  function finishStack(){
    if(finished)return;
    finished=true;
    if(wobbleRAF)cancelAnimationFrame(wobbleRAF);
    state.records.stack[p.id]=count;
    setTimeout(()=>recordScreen(4,p,humanIndex,`${count}<small>体</small>`,count>=10?"AMAZING TOWER!":"STACK RECORD"),260);
  }

  stage.addEventListener("pointerdown",e=>{
    const el=e.target.closest("#activeStackPiece");
    if(!el||dropping||finished)return;
    e.preventDefault();
    dragging=true;
    pointerId=e.pointerId;
    try{stage.setPointerCapture(pointerId)}catch(_){}
    setActiveX(e.clientX);
    el.classList.add("grabbed");
  },{passive:false});

  stage.addEventListener("pointermove",e=>{
    if(!dragging||e.pointerId!==pointerId||dropping||finished)return;
    e.preventDefault();
    setActiveX(e.clientX);
  },{passive:false});

  const release=e=>{
    if(!dragging||e.pointerId!==pointerId||dropping||finished)return;
    e.preventDefault();
    const el=activeEl();
    if(el)el.classList.remove("grabbed");
    releasePiece();
  };
  stage.addEventListener("pointerup",release,{passive:false});
  stage.addEventListener("pointercancel",release,{passive:false});

  renderStack();
  startWobble();
  await countdown("STACK");
  spawnPiece();
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
  const chance=[0.12,0.10,0.14,0.16,0.12][gameIndex] ?? 0.12;
  return Math.random()<chance;
}

function simulateOneCpu(gameIndex,p){
  const ultra=cpuUltraDraw(gameIndex);
  state.cpuTier[`${gameIndex}:${p.id}`]=ultra?"SUPER":"STRONG";

  if(gameIndex===0){
    // milliseconds: strong 0.125–0.230, SUPER 0.072–0.112
    const bias={c5:8,c6:2,c7:12,c8:0}[p.id]||0;
    state.records.reaction[p.id]=ultra ? randi(72,112) : clamp(randi(125,230)+bias,118,245);
  }else if(gameIndex===1){
    const base={c5:9,c6:9,c7:8,c8:10}[p.id]||9;
    state.records.memory[p.id]=ultra ? 10 : clamp(base+randi(-1,1),7,10);
  }else if(gameIndex===2){
    // milliseconds for tapping 1..12
    const bias={c5:180,c6:80,c7:260,c8:0}[p.id]||0;
    state.records.puzzle[p.id]=ultra ? randi(1250,1850) : clamp(randi(2150,3700)+bias,2050,4200);
  }else if(gameIndex===3){
    // stored in decimeters
    const bias={c5:15,c6:35,c7:0,c8:55}[p.id]||0;
    const meters=ultra ? rand(910,1000) : clamp(rand(650,900)+bias,620,955);
    state.records.launch[p.id]=Math.round(meters*10);
  }else{
    const bias={c5:1,c6:2,c7:0,c8:2}[p.id]||0;
    state.records.stack[p.id]=ultra ? randi(13,18) : clamp(randi(6,10)+bias,6,12);
  }
  return ultra;
}

// RANKING ------------------------------------------------
function rankRecords(gameIndex){
  const key=GAMES[gameIndex].key;
  const records=state.records[key];
  const asc=(gameIndex===0||gameIndex===2);
  const arr=participants().map(p=>({p,value:records[p.id]})).sort((a,b)=>asc?a.value-b.value:b.value-a.value);
  let last=null,lastRank=0;
  arr.forEach((e,i)=>{
    const same=i>0&&e.value===last;
    e.rank=same?lastRank:i+1;
    e.points=mode().points[e.rank-1]??0;
    last=e.value;
    lastRank=e.rank;
  });
  return arr;
}
function formatRecord(gameIndex,v){
  if(gameIndex===0)return `${(v/1000).toFixed(3)}秒`;
  if(gameIndex===1)return `${v}/10`;
  if(gameIndex===2)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===3)return `${(v/10).toFixed(1)}m`;
  return `${v}体`;
}
function applyPoints(gameIndex,ranked){
  const gp={};
  ranked.forEach(e=>{
    gp[e.p.id]=e.points;
    state.total[e.p.id]=(state.total[e.p.id]||0)+e.points;
  });
  state.gamePoints[gameIndex]=gp;
}
function competitionRankTotals(){
  const arr=participants().map(p=>({p,points:state.total[p.id]||0})).sort((a,b)=>b.points-a.points);
  let last=null,lastRank=0;
  arr.forEach((e,i)=>{
    e.rank=i>0&&e.points===last?lastRank:i+1;
    last=e.points;
    lastRank=e.rank;
  });
  return arr;
}
function teamTotals(){
  if(!mode().team)return null;
  const sum=t=>mode().teams[t].reduce((s,id)=>s+(state.total[id]||0),0);
  return {A:sum("A"),B:sum("B")};
}

function finishGame(gameIndex){
  const ranked=rankRecords(gameIndex);
  applyPoints(gameIndex,ranked);
  renderGameResult(gameIndex,ranked);
}
function renderGameResult(gameIndex,ranked){
  const totals=competitionRankTotals(),tt=teamTotals(),g=GAMES[gameIndex];
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">GAME ${g.no} COMPLETE</span><h2>${g.title} RESULT</h2></div><div class="game-badge">${g.no}/5</div></div>
  <section class="panel"><h3>GAME RANKING</h3><div class="rank-list">${ranked.map(e=>rankRow(e.p,e.rank,formatRecord(gameIndex,e.value),`+${e.points}pt`)).join("")}</div></section>
  <section class="panel"><h3>OVERALL</h3><div class="rank-list">${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?"CPU":"PLAYER"))).join("")}</div></section>
  ${tt?`<section class="panel"><h3>TEAM TOTAL</h3><div class="team-total"><div class="team-box a"><span>${mode().teamNames.A}</span><b>${tt.A}pt</b></div><div class="team-box b"><span>${mode().teamNames.B}</span><b>${tt.B}pt</b></div></div></section>`:""}
  <button id="resultNext" class="primary">${gameIndex<4?`GAME ${gameIndex+2} へ`:"FINAL RESULT"}</button>`;
  document.getElementById("resultNext").addEventListener("click",()=>gameIndex<4?showGameIntro(gameIndex+1):renderFinal());
}
function rankRow(p,rank,record,badge){
  const tier=p.cpu && !state.freePlay
    ? state.cpuTier[`${state.gameIndex}:${p.id}`]
    : null;
  return `<div class="rank-row"><div class="rank-place">${rank}位</div>${imgTag(p)}<div class="rank-name">${esc(p.name)}<span>${p.cpu?"CPU":`PLAYER ${p.no}`}${mode().team?` / ${teamName(p.id)}`:""}${tier==="SUPER"?" / SUPER CPU":""}</span></div><div class="rank-score"><b>${record}</b><span class="point-badge">${badge}</span></div></div>`;
}

function renderFinal(){
  const totals=competitionRankTotals(),tt=teamTotals();
  let winner="";
  if(tt)winner=tt.A===tt.B?"DRAW":tt.A>tt.B?`${mode().teamNames.A} WIN!`:`${mode().teamNames.B} WIN!`;
  else winner=`${totals[0].p.name} WIN!`;

  screen.innerHTML=`<div class="champion"><small>FINAL RESULT</small><strong>${esc(winner)}</strong>${tt?`<span>${mode().teamNames.A} ${tt.A}pt　–　${tt.B}pt ${mode().teamNames.B}</span>`:`<span>全5ゲーム 総合順位</span>`}</div>
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
