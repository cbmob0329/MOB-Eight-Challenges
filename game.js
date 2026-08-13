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

// V10.40: gameplay中の長押し選択を即解除。
// pointerdown自体はキャンセルしないので、既存click系ゲームも維持。
function clearGameplaySelection(){
  try{
    const sel=window.getSelection&&window.getSelection();
    if(sel&&sel.rangeCount)sel.removeAllRanges();
  }catch(_){}
}
document.addEventListener("selectionchange",()=>{
  if(screen&&screen.classList.contains("gameplay-fit"))clearGameplaySelection();
});
document.addEventListener("pointerdown",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{passive:true});
document.addEventListener("touchstart",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{passive:true});
document.addEventListener("touchend",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{passive:true});

// V10.42: desktop系の長押し/ドラッグ選択もcapture段階で止める。
// mousedownのdefaultだけを止めるためpointer/click系ゲーム進行は維持。
document.addEventListener("mousedown",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit")){
    e.preventDefault();
    clearGameplaySelection();
  }
},{capture:true,passive:false});

document.addEventListener("selectstart",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit")){
    e.preventDefault();
    clearGameplaySelection();
  }
},{capture:true,passive:false});

document.addEventListener("dragstart",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit")){
    e.preventDefault();
  }
},{capture:true,passive:false});

document.addEventListener("contextmenu",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit")){
    e.preventDefault();
    clearGameplaySelection();
  }
},{capture:true,passive:false});

// V10.43: 押している間も選択範囲を継続的に消す。
// 長押し中だけ動作し、通常のゲームループには干渉しない。
let gameplaySelectionGuardTimer=null;
function stopGameplaySelectionGuard(){
  if(gameplaySelectionGuardTimer!==null){
    clearInterval(gameplaySelectionGuardTimer);
    gameplaySelectionGuardTimer=null;
  }
  clearGameplaySelection();
}
document.addEventListener("pointerdown",e=>{
  if(!(e.target&&e.target.closest&&e.target.closest(".gameplay-fit")))return;
  stopGameplaySelectionGuard();
  gameplaySelectionGuardTimer=setInterval(clearGameplaySelection,60);
},{capture:true,passive:true});
document.addEventListener("pointerup",stopGameplaySelectionGuard,{capture:true,passive:true});
document.addEventListener("pointercancel",stopGameplaySelectionGuard,{capture:true,passive:true});
// V10.47: gameplay中の長押し・ドラッグ選択対策をさらに強化。
document.addEventListener("pointermove",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{capture:true,passive:true});
document.addEventListener("mousemove",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{capture:true,passive:true});
document.addEventListener("touchmove",e=>{
  if(e.target&&e.target.closest&&e.target.closest(".gameplay-fit"))clearGameplaySelection();
},{capture:true,passive:true});
window.addEventListener("blur",clearGameplaySelection,{passive:true});

const PLAYERS=[
  {id:"p1",no:1,name:"プレイヤー1",cpu:false,img:"play/01.png"},
  {id:"p2",no:2,name:"プレイヤー2",cpu:false,img:"play/02.png"},
  {id:"p3",no:3,name:"プレイヤー3",cpu:false,img:"play/03.png"},
  {id:"p4",no:4,name:"プレイヤー4",cpu:false,img:"play/04.png"},

  // 10 VS 10 モード用のPLAYER追加枠。
  // 専用play画像がなくても遊べるよう既存iconを利用。
  {id:"p5",no:5,name:"プレイヤー5",cpu:false,img:"icon/05.png"},
  {id:"p6",no:6,name:"プレイヤー6",cpu:false,img:"icon/06.png"},
  {id:"p7",no:7,name:"プレイヤー7",cpu:false,img:"icon/07.png"},
  {id:"p8",no:8,name:"プレイヤー8",cpu:false,img:"icon/08.png"},
  {id:"p9",no:9,name:"プレイヤー9",cpu:false,img:"icon/09.png"},
  {id:"p10",no:10,name:"プレイヤー10",cpu:false,img:"icon/10.png"},

  {id:"c2",no:2,name:"CPUモブ02",cpu:true,img:"icon/02.png"},
  {id:"c3",no:3,name:"CPUモブ03",cpu:true,img:"icon/03.png"},
  {id:"c4",no:4,name:"CPUモブ04",cpu:true,img:"icon/04.png"},

  {id:"c5",no:5,name:"モブイタリアン",cpu:true,img:"play/05.PNG"},
  {id:"c6",no:6,name:"モブ中華店主",cpu:true,img:"play/06.PNG"},
  {id:"c7",no:7,name:"モブティラノ",cpu:true,img:"play/07.PNG"},
  {id:"c8",no:8,name:"モブスーパーマン",cpu:true,img:"play/08.PNG"},

  // 10 VS 10 モード用CPU追加枠。
  {id:"c9",no:9,name:"CPUモブ09",cpu:true,img:"icon/09.png"},
  {id:"c10",no:10,name:"CPUモブ10",cpu:true,img:"icon/10.png"},
  {id:"c11",no:11,name:"CPUモブ11",cpu:true,img:"icon/01.png"}
];

const GAMES=[
  {no:1,key:"reaction",title:"モブくんの反射神経",sub:"モブくんが出た瞬間をタップ"},
  {no:2,key:"memory",title:"モブくんを覚えて！",sub:"10枚の点灯順を記憶"},
  {no:3,key:"puzzle",title:"モブくん12",sub:"1〜12を順番に消すタイムアタック"},
  {no:4,key:"launch",title:"モブくん人形空を飛ぶ",sub:"感覚で狙う最大2000m"},
  {no:5,key:"stack",title:"グラグラモブくん",sub:"10秒で色々なモブくんを積む"},
  {no:6,key:"breakdance",title:"モブくん1990にチャレンジ",sub:"4択から1990を見抜く"},
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
  {no:27,key:"brake",title:"モブくんブレーキチキンレース",sub:"障害物ギリギリで瞬間停止"},
  {no:28,key:"feint",title:"モブくんは騙されやすい",sub:"見た目が同じ本物のGO!を待つ"},
  {no:29,key:"bomb",title:"爆弾チキンレース",sub:"0.000秒直前でSTOP"},
  {no:30,key:"overlapMaster",title:"重なりモブくん",sub:"4つの円を同時に重ねる"},
  {no:31,key:"jumpingMob",title:"ジャンピングモブくん",sub:"ホッピングで台を乗り継ぐ"},
  {no:32,key:"heroMaybe",title:"モブくんは勇者かも",sub:"10秒で勇者を育てる"},
  {no:33,key:"popularGame",title:"アクションモブくん",sub:"モブくんでモグラ踏み"},
  {no:34,key:"planetEnergy",title:"モブくんは破壊神",sub:"3回チャージして高層ビルを貫く"},
  {no:35,key:"painter",title:"モブくんは画家志望",sub:"猫の顔型を1回で綺麗になぞる"},
  {no:36,key:"bikeJump",title:"モブくんバイクで飛ぶ",sub:"約3秒走って巨大ジャンプ台へ"},
  {no:37,key:"trampoline",title:"モブくんのトランポリン",sub:"3回連続で跳ねて3回目が記録"},
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
  {no:49,key:"sniperMob",title:"モブくんはスナイパー",sub:"超遠距離ターゲットへ4発勝負"},
  {no:50,key:"mobRacePredict",title:"モブくんレースだれが勝つ!?",sub:"5秒のセリフからゴール順を予想"},
  {no:51,key:"mobRocket",title:"モブくんロケット",sub:"7秒でロケットを描いて最大100km"},
  {no:52,key:"bossDuel",title:"モブくん番長決戦",sub:"屋上タイマンを最速で制する"},
  {no:53,key:"plushCatcher",title:"モブくんはぬいぐるみが好き",sub:"巨大ぬいぐるみを3回キャッチ"},
  {no:54,key:"toyOnOff",title:"モブくんおもちゃON or OFF",sub:"OFF5体を全部ONにするタイムアタック"},
  {no:55,key:"dodgeballMob",title:"モブくんドッジボール",sub:"10秒で何体の黒モブくんを倒せるか"},
  {no:56,key:"amidakujiMob",title:"モブくんのあみだくじ",sub:"6本から選んで0〜100点のゴールへ"},
  {no:57,key:"katanaSmith",title:"モブくんは刀鍛冶",sub:"7秒で縦向きの刀身だけを自由に描く"},
  {no:58,key:"homeRunMob",title:"モブくんはパワーヒッター",sub:"角度とパワーを決めて最大3000m"},
  {no:59,key:"mobMisfortune",title:"モブくんの災難",sub:"大量の落石を左右移動で避ける"},
  {no:60,key:"aimMob",title:"狙ってモブくん！",sub:"弓矢で木の細い白線を狙う"},
  {no:61,key:"balanceMob",title:"極限バランスモブくん",sub:"細い棒の上で10秒耐える"},
  {no:62,key:"mobDice",title:"モブくんのサイコロ",sub:"5個のサイコロで大きな合計を狙う"},
  {no:63,key:"mobCombo",title:"モブくん20連コンボ",sub:"10秒でモブ球を動かして20連コンボを狙う"},
  {no:64,key:"electricMaze",title:"こっちだよモブくん！",sub:"タップでピンを立ててビリビリ迷路を突破"},
  {no:65,key:"cardShop",title:"モブくんカードショップ",sub:"6枚入りパックを開封して合計ポイントを競う"},
  {no:66,key:"pizzaChef",title:"モブくんピザ職人",sub:"具材をスワイプで投げてピザを焼き上げる"},
  {no:67,key:"mobHammer",title:"モブくんハンマー！",sub:"固定された滅→剛→力を5秒で順番連打して破壊力を溜める"},
  {no:68,key:"bungeeMob",title:"モブくんバンジー",sub:"逆さで急降下して地面ギリギリSTOP"},
  {no:69,key:"waterSlide",title:"モブくんウォータースライダー",sub:"波の横流れと障害物に耐えて10秒攻略"},
  {no:70,key:"pancakeMob",title:"モブくん巨大パンケーキ",sub:"2枚同時フリップを2回成功させる"},
  {no:71,key:"paperPlane",title:"モブくん紙飛行機研究所",sub:"完成済み機体へ翼を描いて実際に飛ばす"},
  {no:72,key:"tankMob",title:"モブくん戦車に乗る",sub:"見下ろし戦車で4方向から迫るスライムを10秒撃退"},
  {no:73,key:"curlingMob",title:"モブくん氷上カーリング",sub:"1スワイプでハウス中央を狙う"},
  {no:74,key:"bubbleMob",title:"モブくん巨大シャボン玉",sub:"画面中央の泡を見た目だけで限界まで膨らませる"},
  {no:75,key:"changeMob",title:"モブくん何が変わった？",sub:"部屋の1ヶ所の変化を見抜く"},
  {no:76,key:"baggageMob",title:"モブくん荷物検査",sub:"複数の箱が流れる検査ラインで「！」を1回勝負"},
  {no:77,key:"bridgeMob",title:"モブくん橋を作って！",sub:"自由に橋を描いてモブくんを渡らせる"},
  {no:78,key:"treasureMob",title:"モブくん宝箱どれだ!?",sub:"100点の宝箱をシャッフルから追いかける"},
  {no:79,key:"rouletteMob",title:"モブくんルーレットジャンプ",sub:"ジャンプして着地した床のポイントを獲得"},
  {no:80,key:"excavationMob",title:"モブくん地下発掘",sub:"9マスから3ヶ所掘って化石ポイントを獲得"},
  {no:81,key:"oldMaidDuel",title:"モブくんのババ抜き決闘",sub:"偽モブくんの2枚から引いて何回目で勝てるか"},
  {no:82,key:"robotMarch",title:"モブくんロボット大発進",sub:"何本でも自由に電池を描いて補給し巨大ロボを前進させる"},
  {no:83,key:"monsterMaster",title:"モブくんはモンスターマスター",sub:"3秒で自作ボールを描き、10秒間何個でも投げて10体を捕獲"},
  {no:84,key:"scoutMan",title:"モブくんはスカウトマン！",sub:"30000円で9ポジションを1秒判断でスカウト"},
  {no:85,key:"atafutaSurvival",title:"モブくんあたふたサバイバル",sub:"崩れる浮遊岩で9人の偽モブくんと最後の1人を目指す"},
  {no:86,key:"waveMaster",title:"モブくん波動を極める",sub:"魂ゲージと円型ゲージを極めて偽モブくんと波動を撃ち合う"},
  {no:87,key:"battleRoyaleMob",title:"モブくんFPSアリーナに挑戦",sub:"3対3のアリーナでスキルを使い敵チームを全滅させる"},
  {no:88,key:"littleMobShot",title:"Little MOB SHOT",sub:"レコードに乗って10秒間スライムを撃ちまくる縦シューティング"},
  {no:89,key:"monsterBoxMob",title:"モブくんモンスターボックスに挑む",sub:"ロイター板を踏んで15段から20段の跳び箱を越える"},
  {no:90,key:"alienBattleMob",title:"モブくんエイリアンと戦う",sub:"小型ロボ2機で地上の巨大エイリアンHP100を撃破する"},
  {no:91,key:"mobMusou",title:"モブくん無双",sub:"7秒で巨大武器を描き、10秒オートで大量スライムを無双する"},
  {no:92,key:"iaidoMaster",title:"モブくんは居合切りの達人",sub:"夜の草原でCPUと居合勝負。勝負！の瞬間を見抜く"},
  {no:93,key:"killLeaderMob",title:"モブくんはキルリーダー",sub:"1対1のFPS勝ち抜き戦。10人抜きで完全制覇を目指せ"}
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
  matchedVsCpu:{name:"プレイヤー VS CPU",short:"同人数チーム戦 / 1対1〜10対10",participants:["p1","c2"],team:true,points:[3,0],teams:{A:["p1"],B:["c2"]},teamNames:{A:"PLAYER TEAM",B:"CPU TEAM"}},
  configured:{name:"対戦",short:"",participants:["p1","c2"],team:false,points:[3,0],performance:false,teams:{},teamNames:{}},
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
      crisis:{},factory:{},catcher:{},tidy:{},ski:{},slot:{},rope:{},pk:{},rhythm:{},cut:{},climb:{},errand:{},dontHitMob:{},mobStop:{},overlap:{},shutter:{},cup:{},darts:{},parachute:{},mobCount:{},brake:{},feint:{},bomb:{},overlapMaster:{},jumpingMob:{},heroMaybe:{},popularGame:{},planetEnergy:{},painter:{},bikeJump:{},trampoline:{},mobTrain:{},giantMob:{},wizardMob:{},brawlerMob:{},summonerMob:{},blackjackMob:{},mobIssen:{},crowEscape:{},dancingMob:{},guardianMob:{},mob50m:{},sniperMob:{},mobRacePredict:{},mobRocket:{},bossDuel:{},plushCatcher:{},toyOnOff:{},dodgeballMob:{},amidakujiMob:{},katanaSmith:{},homeRunMob:{},mobMisfortune:{},aimMob:{},balanceMob:{},mobDice:{},mobCombo:{},electricMaze:{},cardShop:{},
        pizzaChef:{},mobHammer:{},bungeeMob:{},waterSlide:{},pancakeMob:{},
        paperPlane:{},tankMob:{},curlingMob:{},bubbleMob:{},
        changeMob:{},baggageMob:{},bridgeMob:{},treasureMob:{},rouletteMob:{},excavationMob:{},
        oldMaidDuel:{},robotMarch:{},monsterMaster:{},scoutMan:{},
        atafutaSurvival:{},waveMaster:{},battleRoyaleMob:{},littleMobShot:{},monsterBoxMob:{},alienBattleMob:{},mobMusou:{},iaidoMaster:{},killLeaderMob:{}
    },
    total:{},
    roundPoints:[],
    cpuTier:{},
    setup:null
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
  document.body.classList.remove("countdown-active-v140");
  if(screen)screen.removeAttribute("inert");
  clearGameplaySelection();
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
    <section class="hero hero-v119">
      <div>
        <span class="kicker">SMARTPHONE PARTY GAME</span>
        <h1>93 MINI<br>GAMES</h1>
        <p>対戦モードは「チーム戦」「個人戦」の2種類。人数・ルール・ゲーム数を自由に設定できます。</p>
      </div>
      <div class="hero-mark">MOB</div>
    </section>

    <section class="home-action-grid-v119">
      <button id="openModeSelect" class="home-main-action-v119" type="button">
        <span>MODE SELECT</span>
        <b>モードセレクト</b>
        <small>チーム戦 / 個人戦</small>
      </button>

      <button id="openFreePlay" class="home-sub-action-v119" type="button">
        <span>FREE PLAY</span>
        <b>1人で遊ぶ</b>
      </button>

      <button id="openGameGuide" class="home-sub-action-v119" type="button">
        <span>GUIDE</span>
        <b>各ゲームの説明</b>
      </button>
    </section>

    <section class="panel flat">
      <div class="panel-head"><h3>93 MINI GAMES</h3><span class="tag">GAME 1 → 93</span></div>
      <div class="compact-game-grid home-compact-games-v119">
        ${GAMES.map(g=>`<div><b>${g.no}</b><span>${g.title}</span></div>`).join("")}
      </div>
    </section>
  `;

  document.getElementById('openModeSelect').addEventListener('click',renderBattleTypeSelect);
  document.getElementById('openFreePlay').addEventListener('click',renderFreePlaySelect);
  document.getElementById('openGameGuide').addEventListener('click',renderGameGuide);
  gameTop();
}

function renderFreePlaySelect(){
  clearGameFit();
  invalidateGameRun();

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">FREE PLAY</span><h2>1人で遊ぶ</h2><p class="lead">好きなゲームを1つ選んでプレイ。</p></div>
      <div class="game-badge">93</div>
    </div>

    <button id="freeBack" class="secondary wizard-back-v119" type="button">← メインへ戻る</button>

    <section class="panel">
      <div class="free-game-grid">
        ${GAMES.map((g,i)=>`<button class="free-game-card" data-free-game="${i}" type="button"><span>GAME ${g.no}</span><b>${g.title}</b><small>${g.sub}</small></button>`).join("")}
      </div>
    </section>
  `;

  document.getElementById('freeBack').addEventListener('click',renderHome);
  screen.querySelectorAll('[data-free-game]').forEach(btn=>btn.addEventListener('click',()=>startFreeGame(Number(btn.dataset.freeGame))));
  gameTop();
}

function startFreeGame(gameIndex){
  cancelActiveAnimation();
  invalidateGameRun();

  state=freshState();
  state.modeKey="free";
  state.freePlay=true;
  state.freeGameIndex=gameIndex;
  state.gameIndex=gameIndex;

  initTotals();
  showGameIntro(gameIndex);
}

function renderGameGuide(){
  clearGameFit();
  invalidateGameRun();

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">GAME GUIDE</span><h2>各ゲームの説明</h2><p class="lead">内容と100点換算の目安を一覧で確認できます。</p></div>
      <div class="game-badge">93</div>
    </div>

    <button id="guideBack" class="secondary wizard-back-v119" type="button">← メインへ戻る</button>

    <div class="game-guide-list-v119">
      ${GAMES.map((g,i)=>`
        <section class="game-guide-card-v119">
          <div class="game-guide-no-v119">${g.no}</div>
          <div>
            <h3>${g.title}</h3>
            <p>${g.sub}</p>
            <small>${scoreRuleForGame(i)||'ゲーム内記録で順位を決定'}</small>
          </div>
        </section>
      `).join('')}
    </div>
  `;

  document.getElementById('guideBack').addEventListener('click',renderHome);
  gameTop();
}

function renderBattleTypeSelect(){
  clearGameFit();
  cancelActiveAnimation();
  invalidateGameRun();
  state=freshState();

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">MODE SELECT</span><h2>対戦形式を選択</h2><p class="lead">対戦モードはこの2つだけです。</p></div>
      <div class="game-badge">2 MODES</div>
    </div>

    <div class="battle-type-grid-v119">
      <button id="battleTeam" class="battle-type-card-v119 team" type="button">
        <span>TEAM BATTLE</span><b>チーム戦</b><small>最大4チーム / PLAYER・CPUを各チームへ割り当て</small>
      </button>
      <button id="battleSolo" class="battle-type-card-v119 solo" type="button">
        <span>INDIVIDUAL</span><b>個人戦</b><small>PLAYER人数 + CPU人数で全員対戦</small>
      </button>
    </div>

    <button id="battleTypeBack" class="secondary wizard-back-v119" type="button">← メインへ戻る</button>
    <button id="battleGuide" class="secondary" type="button">各ゲームの説明</button>
  `;

  document.getElementById('battleTeam').addEventListener('click',()=>{
    const config={type:'team',teamCount:2,teamSize:2,assignments:[],rule:null,length:null};
    state.setup=config;
    renderTeamBasics(config);
  });

  document.getElementById('battleSolo').addEventListener('click',()=>{
    const config={type:'individual',humanCount:1,cpuCount:1,rule:null,length:null};
    state.setup=config;
    renderIndividualSetup(config);
  });

  document.getElementById('battleTypeBack').addEventListener('click',renderHome);
  document.getElementById('battleGuide').addEventListener('click',renderGameGuide);
  gameTop();
}

function renderTeamBasics(config){
  clearGameFit();
  state.setup=config;

  function maxTeamSize(){
    return Math.min(10,Math.floor(20/config.teamCount));
  }

  config.teamSize=clamp(config.teamSize,1,maxTeamSize());

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">TEAM BATTLE / 1</span><h2>チーム数と人数</h2><p class="lead">全チーム同じ人数。最大4チーム。</p></div>
      <div class="game-badge" id="teamBasicTotal">${config.teamCount*config.teamSize}人</div>
    </div>

    <section class="panel wizard-counter-panel-v119">
      <div class="wizard-counter-v119">
        <span>TEAM COUNT</span>
        <div><button data-basic="team-" type="button">−</button><b id="teamCountValue">${config.teamCount}</b><button data-basic="team+" type="button">＋</button></div>
        <small>2〜4チーム</small>
      </div>
      <div class="wizard-counter-v119">
        <span>MEMBERS / TEAM</span>
        <div><button data-basic="size-" type="button">−</button><b id="teamSizeValue">${config.teamSize}</b><button data-basic="size+" type="button">＋</button></div>
        <small id="teamSizeMaxText">1〜${maxTeamSize()}人</small>
      </div>
    </section>

    <button id="teamBasicNext" class="primary" type="button">チーム割り当てへ</button>
    <button id="teamBasicBack" class="secondary wizard-back-v119" type="button">← チーム戦 / 個人戦へ戻る</button>
  `;

  const countEl=document.getElementById('teamCountValue');
  const sizeEl=document.getElementById('teamSizeValue');
  const totalEl=document.getElementById('teamBasicTotal');
  const maxText=document.getElementById('teamSizeMaxText');

  const redraw=()=>{
    config.teamSize=clamp(config.teamSize,1,maxTeamSize());
    countEl.textContent=config.teamCount;
    sizeEl.textContent=config.teamSize;
    totalEl.textContent=`${config.teamCount*config.teamSize}人`;
    maxText.textContent=`1〜${maxTeamSize()}人`;
  };

  screen.querySelectorAll('[data-basic]').forEach(btn=>btn.addEventListener('click',()=>{
    const k=btn.dataset.basic;
    if(k==='team-')config.teamCount=Math.max(2,config.teamCount-1);
    if(k==='team+')config.teamCount=Math.min(4,config.teamCount+1);
    if(k==='size-')config.teamSize=Math.max(1,config.teamSize-1);
    if(k==='size+')config.teamSize=Math.min(maxTeamSize(),config.teamSize+1);
    config.assignments=[];
    redraw();
  }));

  document.getElementById('teamBasicNext').addEventListener('click',()=>renderTeamAssignment(config));
  document.getElementById('teamBasicBack').addEventListener('click',renderBattleTypeSelect);
  redraw();
  gameTop();
}

function defaultTeamAssignments(teamCount,teamSize){
  const total=teamCount*teamSize;
  const targetHumans=Math.min(10,Math.ceil(total/2));
  const a=Array.from({length:teamCount},()=>({players:0,cpus:0}));
  let left=targetHumans;

  while(left>0){
    let progressed=false;
    for(let i=0;i<teamCount&&left>0;i++){
      if(a[i].players<teamSize){a[i].players++;left--;progressed=true;}
    }
    if(!progressed)break;
  }

  a.forEach(x=>x.cpus=teamSize-x.players);
  return a;
}

function renderTeamAssignment(config){
  clearGameFit();
  state.setup=config;

  if(!config.assignments||config.assignments.length!==config.teamCount){
    config.assignments=defaultTeamAssignments(config.teamCount,config.teamSize);
  }

  const teamLetters=['A','B','C','D'];

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">TEAM BATTLE / 2</span><h2>チーム割り当て</h2><p class="lead">各チームのPLAYER人数とCPU人数を決めます。CPU 0人でもOK。</p></div>
      <div class="game-badge">${config.teamCount} TEAMS</div>
    </div>

    <div id="teamAssignList" class="team-assign-list-v119"></div>
    <div id="teamAssignStatus" class="wizard-status-v119"></div>

    <button id="teamAssignNext" class="primary" type="button">ルール選択へ</button>
    <button id="teamAssignBack" class="secondary wizard-back-v119" type="button">← チーム数へ戻る</button>
  `;

  const list=document.getElementById('teamAssignList');
  const status=document.getElementById('teamAssignStatus');
  const next=document.getElementById('teamAssignNext');

  function totals(){
    return config.assignments.reduce((o,x)=>({players:o.players+x.players,cpus:o.cpus+x.cpus}),{players:0,cpus:0});
  }

  function redraw(){
    list.innerHTML=config.assignments.map((x,i)=>`
      <section class="team-assign-card-v119 team-${teamLetters[i].toLowerCase()}">
        <div class="panel-head"><h3>TEAM ${teamLetters[i]}</h3><span class="tag">${config.teamSize}人</span></div>
        <div class="team-split-counter-v119">
          <div><span>PLAYER</span><button data-adjust="${i}:p-" type="button">−</button><b>${x.players}</b><button data-adjust="${i}:p+" type="button">＋</button></div>
          <div><span>CPU</span><button data-adjust="${i}:c-" type="button">−</button><b>${x.cpus}</b><button data-adjust="${i}:c+" type="button">＋</button></div>
        </div>
        <p>${x.players} PLAYER + ${x.cpus} CPU = ${config.teamSize}人</p>
      </section>
    `).join('');

    const t=totals();
    const valid=t.players<=10&&t.cpus<=10&&config.assignments.every(x=>x.players+x.cpus===config.teamSize);
    status.innerHTML=`PLAYER 合計 <b>${t.players}/10</b>　CPU 合計 <b>${t.cpus}/10</b>${valid?'':'<strong>人数上限を超えています</strong>'}`;
    next.disabled=!valid;

    list.querySelectorAll('[data-adjust]').forEach(btn=>btn.addEventListener('click',()=>{
      const [idxRaw,op]=btn.dataset.adjust.split(':');
      const idx=Number(idxRaw); const x=config.assignments[idx];
      if(op==='p+'&&x.cpus>0){x.players++;x.cpus--;}
      if(op==='p-'&&x.players>0){x.players--;x.cpus++;}
      if(op==='c+'&&x.players>0){x.cpus++;x.players--;}
      if(op==='c-'&&x.cpus>0){x.cpus--;x.players++;}
      redraw();
    }));
  }

  next.addEventListener('click',()=>renderRuleSelect(config));
  document.getElementById('teamAssignBack').addEventListener('click',()=>renderTeamBasics(config));
  redraw();
  gameTop();
}

function renderIndividualSetup(config){
  clearGameFit();
  state.setup=config;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">INDIVIDUAL / 1</span><h2>参加人数</h2><p class="lead">PLAYER 1〜10人 / CPU 0〜10人。CPU無しでもOK。</p></div>
      <div class="game-badge"><span id="individualTotal">${config.humanCount+config.cpuCount}</span>人</div>
    </div>

    <section class="panel wizard-counter-panel-v119">
      <div class="wizard-counter-v119">
        <span>PLAYER</span>
        <div><button data-ind="p-" type="button">−</button><b id="individualP">${config.humanCount}</b><button data-ind="p+" type="button">＋</button></div>
        <small>1〜10人</small>
      </div>
      <div class="wizard-counter-v119">
        <span>CPU</span>
        <div><button data-ind="c-" type="button">−</button><b id="individualC">${config.cpuCount}</b><button data-ind="c+" type="button">＋</button></div>
        <small>0〜10人</small>
      </div>
    </section>

    <button id="individualNext" class="primary" type="button">ルール選択へ</button>
    <button id="individualBack" class="secondary wizard-back-v119" type="button">← チーム戦 / 個人戦へ戻る</button>
  `;

  const pEl=document.getElementById('individualP');
  const cEl=document.getElementById('individualC');
  const totalEl=document.getElementById('individualTotal');

  const redraw=()=>{
    pEl.textContent=config.humanCount;
    cEl.textContent=config.cpuCount;
    totalEl.textContent=config.humanCount+config.cpuCount;
  };

  screen.querySelectorAll('[data-ind]').forEach(btn=>btn.addEventListener('click',()=>{
    const k=btn.dataset.ind;
    if(k==='p-')config.humanCount=Math.max(1,config.humanCount-1);
    if(k==='p+')config.humanCount=Math.min(10,config.humanCount+1);
    if(k==='c-')config.cpuCount=Math.max(0,config.cpuCount-1);
    if(k==='c+')config.cpuCount=Math.min(10,config.cpuCount+1);
    redraw();
  }));

  document.getElementById('individualNext').addEventListener('click',()=>renderRuleSelect(config));
  document.getElementById('individualBack').addEventListener('click',renderBattleTypeSelect);
  redraw();
  gameTop();
}

function renderRuleSelect(config){
  clearGameFit();
  state.setup=config;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">RULE SELECT</span><h2>ルールを選択</h2><p class="lead">各ゲームの順位をポイント化するか、0〜100点をそのまま合計するか。</p></div>
      <div class="game-badge">2 RULES</div>
    </div>

    <div class="battle-type-grid-v119">
      <button id="ruleRank" class="battle-type-card-v119 rank" type="button"><span>RANKING</span><b>順位制</b><small>ゲームごとの順位ポイントを合計</small></button>
      <button id="ruleScore" class="battle-type-card-v119 score" type="button"><span>SCORE</span><b>スコア制</b><small>各ゲーム0〜100点をそのまま合計</small></button>
    </div>

    <button id="ruleBack" class="secondary wizard-back-v119" type="button">← 人数設定へ戻る</button>
  `;

  document.getElementById('ruleRank').addEventListener('click',()=>{config.rule='ranking';renderGameLengthSelect(config);});
  document.getElementById('ruleScore').addEventListener('click',()=>{config.rule='score';renderGameLengthSelect(config);});
  document.getElementById('ruleBack').addEventListener('click',()=>config.type==='team'?renderTeamAssignment(config):renderIndividualSetup(config));
  gameTop();
}

function applyConfiguredBattle(config){
  const humanIds=['p1','p2','p3','p4','p5','p6','p7','p8','p9','p10'];
  const cpuIds=['c2','c3','c4','c5','c6','c7','c8','c9','c10','c11'];
  const m=MODES.configured;

  m.team=config.type==='team';
  m.performance=config.rule==='score';
  m.teams={};
  m.teamNames={};

  if(config.type==='team'){
    let hp=0,cp=0;
    const letters=['A','B','C','D'].slice(0,config.teamCount);
    const all=[];

    letters.forEach((letter,i)=>{
      const a=config.assignments[i];
      const ids=[
        ...humanIds.slice(hp,hp+a.players),
        ...cpuIds.slice(cp,cp+a.cpus)
      ];
      hp+=a.players; cp+=a.cpus;
      m.teams[letter]=ids;
      m.teamNames[letter]=`TEAM ${letter}`;
      all.push(...ids);
    });

    m.participants=all;
    m.name='チーム戦';
    m.short=`${config.teamCount}チーム × ${config.teamSize}人 / ${config.rule==='score'?'スコア制':'順位制'}`;
  }else{
    m.participants=[...humanIds.slice(0,config.humanCount),...cpuIds.slice(0,config.cpuCount)];
    m.name='個人戦';
    m.short=`PLAYER ${config.humanCount}人 + CPU ${config.cpuCount}人 / ${config.rule==='score'?'スコア制':'順位制'}`;
  }

  m.points=m.performance?[]:pointsForCount(m.participants.length);
  state.modeKey='configured';
  state.setup=config;
  initTotals();
}

function renderGameLengthSelect(config){
  clearGameFit();
  state.setup=config;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">GAME MODE</span><h2>プレイするゲーム数</h2><p class="lead">CUSTOM以外は93ゲームからランダムで選択。</p></div>
      <div class="game-badge">${config.rule==='score'?'SCORE':'RANK'}</div>
    </div>

    <div class="game-length-grid-v119">
      <button data-length="5" type="button"><span>QUICK</span><b>サクッと5ゲーム</b><small>ランダム5種</small></button>
      <button data-length="15" type="button"><span>FUN</span><b>楽しく15ゲーム</b><small>ランダム15種</small></button>
      <button data-length="30" type="button"><span>LONG</span><b>じっくり30ゲーム</b><small>ランダム30種</small></button>
      <button data-length="all" type="button"><span>ALL</span><b>ガッツリ全ゲーム</b><small>全93種をランダム順</small></button>
      <button data-length="custom" class="custom" type="button"><span>CUSTOM</span><b>カスタム</b><small>自由選択 / 最大50ゲーム</small></button>
    </div>

    <button id="lengthBack" class="secondary wizard-back-v119" type="button">← ルール選択へ戻る</button>
  `;

  screen.querySelectorAll('[data-length]').forEach(btn=>btn.addEventListener('click',()=>{
    const kind=btn.dataset.length;
    config.length=kind;
    applyConfiguredBattle(config);
    state.roundIndex=0;

    if(kind==='custom'){
      state.playStyle='custom';
      state.playlist=[];
      renderCustomPicker();
      return;
    }

    const all=shuffle(GAMES.map((_,i)=>i));
    const count=kind==='all'?GAMES.length:Number(kind);
    state.playStyle=kind;
    state.playlist=all.slice(0,count);
    renderModeLobby();
  }));

  document.getElementById('lengthBack').addEventListener('click',()=>renderRuleSelect(config));
  gameTop();
}


function selectMode(key){
  state=freshState();
  state.modeKey=key;
  if(key==="customMix"){
    renderMixSetup();
    return;
  }
  if(key==="matchedVsCpu"){
    renderMatchedVsCpuSetup();
    return;
  }
  initTotals();
  renderPlayStyleSelect();
}
function renderMatchedVsCpuSetup(){
  clearGameFit();

  let teamSize=1;

  const humanIds=[
    "p1","p2","p3","p4","p5",
    "p6","p7","p8","p9","p10"
  ];

  const cpuIds=[
    "c2","c3","c4","c5","c6",
    "c7","c8","c9","c10","c11"
  ];

  screen.innerHTML=`
    <div class="game-head">
      <div>
        <span class="kicker">MODE 10</span>
        <h2>プレイヤー VS CPU</h2>
        <p class="lead">PLAYER TEAMとCPU TEAMは必ず同人数。最大10対10。</p>
      </div>
      <div class="game-badge"><span id="matchedTeamSize">1</span> VS <span id="matchedCpuSize">1</span></div>
    </div>

    <section class="panel matched-team-setup">
      <div class="matched-team-counter">
        <span>TEAM SIZE</span>
        <div>
          <button id="matchedMinus" type="button">−</button>
          <b id="matchedCount">1</b>
          <button id="matchedPlus" type="button">＋</button>
        </div>
        <small>1対1〜10対10</small>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h3>PLAYER TEAM</h3><span class="tag" id="matchedPlayerTag">1人</span></div>
      <div id="matchedPlayers" class="player-grid"></div>
    </section>

    <section class="panel">
      <div class="panel-head"><h3>CPU TEAM</h3><span class="tag" id="matchedCpuTag">1人</span></div>
      <div id="matchedCpus" class="player-grid"></div>
    </section>

    <button id="matchedDecide" class="primary" type="button">1 VS 1 で決定</button>
  `;

  const countEl=document.getElementById('matchedCount');
  const sizeA=document.getElementById('matchedTeamSize');
  const sizeB=document.getElementById('matchedCpuSize');
  const playerTag=document.getElementById('matchedPlayerTag');
  const cpuTag=document.getElementById('matchedCpuTag');
  const playerPreview=document.getElementById('matchedPlayers');
  const cpuPreview=document.getElementById('matchedCpus');
  const minus=document.getElementById('matchedMinus');
  const plus=document.getElementById('matchedPlus');
  const decide=document.getElementById('matchedDecide');

  function redraw(){
    countEl.textContent=teamSize;
    sizeA.textContent=teamSize;
    sizeB.textContent=teamSize;
    playerTag.textContent=`${teamSize}人`;
    cpuTag.textContent=`${teamSize}人`;

    playerPreview.innerHTML=
      humanIds.slice(0,teamSize).map(id=>{
        const member=pById(id);
        return `<div class="player-card team-a">
          ${imgTag(member)}
          <div><b>${esc(member.name)}</b><span>PLAYER TEAM</span></div>
        </div>`;
      }).join('');

    cpuPreview.innerHTML=
      cpuIds.slice(0,teamSize).map(id=>{
        const member=pById(id);
        return `<div class="player-card team-b">
          ${imgTag(member)}
          <div><b>${esc(member.name)}</b><span>CPU TEAM</span></div>
        </div>`;
      }).join('');

    minus.disabled=teamSize<=1;
    plus.disabled=teamSize>=10;
    decide.textContent=`${teamSize} VS ${teamSize} で決定`;
  }

  minus.addEventListener('click',()=>{
    teamSize=Math.max(1,teamSize-1);
    redraw();
  });

  plus.addEventListener('click',()=>{
    teamSize=Math.min(10,teamSize+1);
    redraw();
  });

  decide.addEventListener('click',()=>{
    const a=humanIds.slice(0,teamSize);
    const b=cpuIds.slice(0,teamSize);
    const total=teamSize*2;

    MODES.matchedVsCpu.participants=[...a,...b];
    MODES.matchedVsCpu.teams={A:a,B:b};
    MODES.matchedVsCpu.points=pointsForCount(total);
    MODES.matchedVsCpu.short=`PLAYER ${teamSize}人 VS CPU ${teamSize}人`;

    state.modeKey='matchedVsCpu';
    initTotals();
    renderPlayStyleSelect();
  });

  redraw();
  gameTop();
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
function teamKeys(){
  if(!mode()?.team)return [];
  return Object.keys(mode().teams||{});
}
function teamOf(id){
  if(!mode()?.team)return "";
  return teamKeys().find(key=>(mode().teams[key]||[]).includes(id))||"";
}
function teamName(id){
  if(!mode()?.team)return pById(id).cpu?"CPU":"PLAYER";
  const key=teamOf(id);
  return mode().teamNames?.[key]||`TEAM ${key}`;
}
function teamClass(id){
  const key=teamOf(id);
  return key?`team-${key.toLowerCase()}`:"";
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
        <small>GAME 1 → 93 を順番にプレイ</small>
      </button>
      <button id="customStyle" class="style-select-card custom" type="button">
        <span>CUSTOM</span>
        <b>自由にゲーム選択</b>
        <small>重複OK / 3〜10ゲーム</small>
      </button>
    </div>

    <section class="panel flat">
      <h3>93 MINI GAMES</h3>
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
  const MAX_CUSTOM=50;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">CUSTOM</span><h2>ゲームを選択</h2><p class="lead">1〜50ゲームまで自由に選択。同じゲームの重複もOK。</p></div>
      <div class="game-badge"><span id="customCount">${state.playlist.length}</span>/50</div>
    </div>

    <button id="customDecide" class="primary top-action-v120" type="button">1ゲーム以上選択</button>
    <button id="customBack" class="secondary wizard-back-v119" type="button">← ゲームモードへ戻る</button>

    <section class="panel custom-order-panel">
      <div class="panel-head"><h3>PLAY ORDER</h3><span class="tag">MAX 50</span></div>
      <div id="customOrder" class="custom-order"></div>
      <div class="custom-actions">
        <button id="undoCustom" class="secondary small-btn" type="button">1つ戻す</button>
        <button id="clearCustom" class="secondary small-btn" type="button">全消去</button>
      </div>
    </section>

    <section class="panel">
      <h3>追加するゲーム</h3>
      <div class="custom-game-grid">
        ${GAMES.map((g,i)=>`<button class="custom-game-add" data-add-game="${i}" type="button"><span>GAME ${g.no}</span><b>${g.title}</b><small>${g.sub}</small></button>`).join("")}
      </div>
    </section>

    <div id="customConfirmOverlay" class="custom-confirm-overlay-v114" hidden>
      <div class="custom-confirm-card-v114">
        <span class="kicker">ADD GAME?</span>
        <h3 id="customConfirmTitle">追加しますか？</h3>
        <p id="customConfirmText"></p>
        <div class="custom-confirm-buttons-v114">
          <button id="customConfirmNo" class="secondary" type="button">いいえ</button>
          <button id="customConfirmYes" class="primary" type="button">はい</button>
        </div>
      </div>
    </div>

    <div id="customAddedToast" class="custom-added-toast-v114"></div>
  `;

  const order=document.getElementById('customOrder');
  const count=document.getElementById('customCount');
  const decide=document.getElementById('customDecide');
  const confirmOverlay=document.getElementById('customConfirmOverlay');
  const confirmTitle=document.getElementById('customConfirmTitle');
  const confirmText=document.getElementById('customConfirmText');
  const confirmYes=document.getElementById('customConfirmYes');
  const confirmNo=document.getElementById('customConfirmNo');
  const toast=document.getElementById('customAddedToast');
  let pendingGameIndex=null;

  const redraw=()=>{
    order.innerHTML=state.playlist.length
      ? state.playlist.map((idx,pos)=>`<button class="custom-order-chip" data-remove-pos="${pos}" type="button"><span>${pos+1}</span>${GAMES[idx].title}<small>×</small></button>`).join('')
      : `<p class="note">まだ選択されていません。</p>`;

    count.textContent=state.playlist.length;
    decide.disabled=state.playlist.length<1||state.playlist.length>MAX_CUSTOM;
    decide.textContent=state.playlist.length<1?'1ゲーム以上選択':`この${state.playlist.length}ゲームで決定`;

    order.querySelectorAll('[data-remove-pos]').forEach(btn=>btn.addEventListener('click',()=>{
      state.playlist.splice(Number(btn.dataset.removePos),1);
      redraw();
    }));
  };

  function closeConfirm(){
    confirmOverlay.hidden=true;
    pendingGameIndex=null;
    screen.querySelectorAll('[data-add-game].pending').forEach(el=>el.classList.remove('pending'));
  }

  function showAddedToast(text){
    toast.textContent=text;
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');
  }

  screen.querySelectorAll('[data-add-game]').forEach(btn=>btn.addEventListener('click',()=>{
    pendingGameIndex=Number(btn.dataset.addGame);
    const game=GAMES[pendingGameIndex];
    screen.querySelectorAll('[data-add-game].pending').forEach(el=>el.classList.remove('pending'));
    btn.classList.add('pending');
    confirmTitle.textContent=`${game.title}を追加しますか？`;
    confirmText.textContent=state.playlist.length>=MAX_CUSTOM?`現在50ゲーム選択済みです。追加上限は50ゲームです。`:`第${state.playlist.length+1}ゲームとして追加します。`;
    confirmOverlay.hidden=false;
    beep(520,30,.008);
  }));

  confirmNo.addEventListener('click',()=>{closeConfirm();beep(260,25,.006);});
  confirmYes.addEventListener('click',()=>{
    if(pendingGameIndex===null)return;
    const game=GAMES[pendingGameIndex];
    if(state.playlist.length>=MAX_CUSTOM){closeConfirm();showAddedToast('最大50ゲームまでです');beep(180,55,.012);return;}
    state.playlist.push(pendingGameIndex);
    const pos=state.playlist.length;
    closeConfirm();
    redraw();
    showAddedToast(`第${pos}ゲームに「${game.title}」を選んだ！`);
    beep(720,55,.018);
  });

  document.getElementById('undoCustom').addEventListener('click',()=>{state.playlist.pop();redraw();});
  document.getElementById('clearCustom').addEventListener('click',()=>{state.playlist=[];redraw();});
  document.getElementById('customBack').addEventListener('click',()=>state.setup?renderGameLengthSelect(state.setup):renderBattleTypeSelect());
  decide.addEventListener('click',()=>{
    if(state.playlist.length<1||state.playlist.length>MAX_CUSTOM)return;
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
      <div><b>モブくんの反射神経</b><span>0.150秒以下=100 / 0.300秒=50 / 0.500秒以上=0</span></div>
      <div><b>モブくんを覚えて！</b><span>正解数 × 10点</span></div>
      <div><b>モブくん12</b><span>2.50秒=100 / 6.00秒以上=0</span></div>
      <div><b>モブくん人形空を飛ぶ</b><span>2000m=100 / 0m=0</span></div>
      <div><b>グラグラモブくん</b><span>30体以上=100 / 0体=0</span></div>
      <div><b>モブくん1990にチャレンジ</b><span>世界1位=100 / 40位=0</span></div>
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
      <div><b>モブくんブレーキチキンレース</b><span>衝突せず0m差=100 / 衝突=0</span></div>
      <div><b>モブくんは騙されやすい</b><span>0.150秒以下=100 / フェイント押し=0</span></div>
      <div><b>爆弾チキンレース</b><span>5.000秒→0.000秒 / 0秒直前ほど100点</span></div>
      <div><b>重なりモブくん</b><span>4円一致100%=100点</span></div>
      <div><b>ジャンピングモブくん</b><span>500m以上=100点</span></div>
      <div><b>モブくんは勇者かも</b><span>勇者ポイントがそのまま0〜100点</span></div>
      <div><b>アクションモブくん</b><span>20体踏みつけ=100点</span></div>
      <div><b>モブくんは破壊神</b><span>100km=100点</span></div>
      <div><b>モブくんは画家志望</b><span>猫輪郭一致率100%=100点</span></div>
      <div><b>モブくんバイクで飛ぶ</b><span>2000m=100点</span></div>
      <div><b>モブくんのトランポリン</b><span>3回目2000m=100点</span></div>
      <div><b>モブくん列車出発進行！</b><span>2.80秒以下=100点 / 衝突=0点</span></div>
      <div><b>巨大モブくん大進撃</b><span>30棟=100点</span></div>
      <div><b>魔法使いモブくん</b><span>闇炎20個消去=100点</span></div>
      <div><b>モブくんは喧嘩番長</b><span>30KO 10秒以内=100点</span></div>
      <div><b>モブくんは召喚師</b><span>500体KO=100点</span></div>
      <div><b>ブラックジャックの決戦</b><span>21=100点</span></div>
      <div><b>モブくん一閃</b><span>3回合計300pt=100点</span></div>
      <div><b>カラスから逃げろ！</b><span>20秒生存=100点</span></div>
      <div><b>ダンシングモブくん</b><span>描画評価1〜100点</span></div>
      <div><b>モブくんはガーディアン</b><span>残耐久50%以上=100点 / 3%=6点 / 全壊0点</span></div>
      <div><b>モブくん50m走</b><span>4.50秒以下=100 / 12.50秒以上=0</span></div>
      <div><b>モブくんはスナイパー</b><span>1発25点 / 4発100点</span></div>
      <div><b>モブくんレースだれが勝つ!?</b><span>完全一致100 / 3一致80 / 2一致50 / 1一致30</span></div>
      <div><b>モブくんロケット</b><span>100km=100点</span></div>
      <div><b>モブくん番長決戦</b><span>12秒以内=100 / 32秒以上=0</span></div>
      <div><b>モブくんはぬいぐるみが好き</b><span>3回GET=100 / 2回・1回は時間加点</span></div>
      <div><b>モブくんおもちゃON or OFF</b><span>1.40秒以下=100 / 6.50秒以上=0</span></div>
      <div><b>モブくんドッジボール</b><span>10秒 / 10体KO=100点</span></div>
      <div><b>モブくんのあみだくじ</b><span>ゴールの0 / 15 / 30 / 50 / 75 / 100がそのまま得点</span></div>
      <div><b>モブくんは刀鍛冶</b><span>縦向きの刀身だけ描いて1〜100点</span></div>
      <div><b>モブくんはパワーヒッター</b><span>ゴルフショット3000m=100点</span></div>
      <div><b>モブくんの災難</b><span>12秒生存=100点</span></div>
      <div><b>狙ってモブくん！</b><span>白線との誤差0px=100点</span></div>
      <div><b>極限バランスモブくん</b><span>10秒維持=100点</span></div>
      <div><b>モブくんのサイコロ</b><span>合計5=1点 / 合計30=100点</span></div>
      <div><b>モブくん10連コンボ</b><span>10 COMBO=100点</span></div>
      <div><b>こっちだよモブくん！</b><span>8秒以内=100点 / 30秒以上=0点</span></div>
    </div>`;

  screen.innerHTML=`
    <div class="game-head">
      <div><span class="kicker">${state.playStyle==="custom"?"CUSTOM":state.playStyle==="all"?"ALL GAMES":`${state.playlist.length} GAMES`}</span><h2>${m.name}</h2><p class="lead">${m.short}</p></div>
      <div class="game-badge">${state.playlist.length}戦</div>
    </div>

    <button id="modeStart" class="primary top-action-v120">START</button>

    <section class="panel">
      <div class="panel-head"><h3>ENTRY</h3><span class="tag">${m.performance?"SCORE BATTLE":m.team?"TEAM BATTLE":"INDIVIDUAL"}</span></div>
      <div class="player-grid">
        ${participants().map(p=>`<div class="player-card ${m.team?teamClass(p.id):(p.cpu?"team-cpu":"team-human")}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>${p.cpu?"CPU":`PLAYER ${p.no}`}${m.team?` / ${teamName(p.id)}`:""}</span></div></div>`).join("")}
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
    "残耐久50%以上=100点 / 50%未満は残耐久率×2 / 全壊0点",
    "4.50秒以下=100点 / 12.50秒以上=0点",
    "1発命中=25点 / 4発命中=100点",
    "予想とゴール順位 完全一致=100 / 3一致=80 / 2一致=50 / 1一致=30",
    "飛行距離100km=100点 / 0km=0点",
    "他校番長を倒すまでのタイム / 短いほど高得点",
    "3回GET=100点 / 2回・1回はGET数+使用時間で加点",
    "OFF5体を全部ON / 1.40秒以下=100点 / 6.50秒以上=0点",
    "10秒で10体KO=100点 / 0体=0点",
    "到達したゴール数字がそのまま0〜100点",
    "縦向き刀身の長さ・接続・滑らかさ・形を1〜100点",
    "ゴルフショット3000m=100点 / 0m=0点",
    "12.00秒生存=100点 / 岩直撃までの時間",
    "白線との誤差3px以内=100点 / 約80px以上=0点",
    "10.00秒維持=100点 / 倒れるまでの時間",
    "5個合計5=1点 / 合計30=100点",
    "20 COMBO=100点 / 0 COMBO=0点",
    "10.00秒以内=100点 / 30.00秒以上=0点",
    "90ポイント以上=100点 / 30ポイント以下=0点",
    "3秒以内に8個全部乗せる / 離した位置がそのまま着地点 / 配置も採点",
    "固定配置の滅→剛→力を5秒で順番連打 / ENERGY最大100点",
    "地面から約8pxでSTOP=100点 / 接触=0点",
    "波の横流れ・壁接触・障害物HITで0〜100点",
    "2回のフリップ平均 / 着地が大きくズレると高得点不可",
    "描いた翼の左右バランス・広がり・接続から最大100m",
    "10秒で35体撃破=100点 / 撃破数が多いほど高得点",
    "ハウス中心0px=100点 / 外へ離れるほど減点",
    "破裂直前の大きさ=100点 / 破裂=0点",
    "変化を正解 + 速さで0〜100点 / 誤答0点",
    "検査ゲートで！が出て105ms以内=100点 / 185ms以内=90点 / 1回勝負",
    "両岸接続・滑らかさ・傾斜をゆるめに判定して0〜100点",
    "選んだ宝箱のポイントがそのまま記録",
    "32分割 / 100点床1マス・90点床1マス / ジャンプ着地時の床ポイント",
    "3ヶ所から掘り出した化石ポイントの合計",
    "1回目で勝利=100点 / 2回目=90点 / 10回目=10点",
    "前進距離1000m=100点 / エネルギー切れまでの距離",
    "3秒デザイン→10秒捕獲 / 捕獲したモンスター数×10点 / 10体GET=100点",
    "甲子園47校中の最終順位 / 1位=100点・47位=0点換算",
    "10人中の生存順位で0〜100点 / 最初に落下=0点 / 最後の1人=100点",
    "魂ゲージ55% + Z型ゲージ1回のなぞり45%で波動威力0〜100点",
    "3対3を全滅させるまでの時間 / 速いほど高評価",
    "10秒間のスライムKO数 / 200体KO=100点",
    "15段→20段を順番に突破 / 20段クリア=100点",
    "巨大エイリアンHP100を倒すまでの時間 / 速いほど高評価",
    "10秒オート無双 / 150体KO=100点 / 巨大スライム・ロボも出現",
    "1人目敗北0〜30 / 2人目敗北31〜60 / 3人目敗北61〜75 / 3人撃破80〜100",
    "10人抜き=100点 / 1人撃破ごとに10点"
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
    rules=`<li>7秒でモブくんを守るお城・タワー・壁などを自由に描きます。</li><li>攻撃は3連続。第一陣=通常 / 第二陣=約2倍 / 第三陣=画面を覆う超巨大エネルギー。</li><li>エネルギーは絵の手前で止まり、押し合い・衝撃波・揺れを挟んでから耐久を削ります。</li><li>離して描いた建造物は別々の防衛施設として判定。大きさだけでなく線量・密度・ストローク数・複雑さも耐久へ反映。</li><li>最終残耐久50%以上=100点。50%未満は残耐久率×2で採点。例:3%なら6点。全壊してモブくん直撃=0点。</li>`;
  }else if(index===47){
    rules=`<li>3・2・1で50m走スタート。</li><li>LEFT FOOT → RIGHT FOOT → LEFT FOOT…と左右の足ボタンを必ず交互に連打。</li><li>正しい足入力ごとに前進。同じ足を連続で押しても進みません。</li><li>目安は最速4.5秒、普通6.5秒、ゆっくり12.5秒。50m到達タイムを競います。</li>`;
  }else if(index===48){
    rules=`<li>かなり遠距離の狙撃。プレイヤーもターゲットも小さく表示されます。</li><li>右端付近のターゲットは上下に揺れます。揺れは10段階から毎回ランダムで、ゲーム中は変化しません。</li><li>画面をタップすると、その地点へ弾を1発だけ発射。弾が飛んでいる間は次を撃てません。</li><li>弾は4発。命中1発=25点、4発全て命中で100点。</li>`;
  }else if(index===49){
    rules=`<li>1〜4レーンのモブくんが5秒間、1秒ごとに吹き出しで本音をつぶやきます。</li><li>調子が良いモブくんは好調セリフ、悪いモブくんは不調セリフ。どちらとも言えない時は両方を話します。</li><li>5秒後、1〜4のゴール順位予想を自由に並び替えて決定。</li><li>3・2・1でレース開始。完全一致=100点 / 3つ一致=80 / 2つ=50 / 1つ=30。</li>`;
  }else if(index===50){
    rules=`<li>モブくんが乗ったコクピットは完成済み。7秒でその周りにロケットを自由に描きます。</li><li>描き終えたら3・2・1で発射。カメラが上空〜宇宙まで追従。</li><li>大きさだけではなく、左右バランス・縦長形状・線量・複雑さ・コクピットとの接続を評価。</li><li>描いたロケットによって飛行距離が変化。最大100km。</li>`;
  }else if(index===51){
    rules=`<li>学校の屋上で他校の番長とタイマン。相手の耐久値は表示されません。</li><li>通常PUNCHでも相手は短く怯みます。同時に攻撃がぶつかるとCLASHになり、お互い横へ弾け飛びます。</li><li>超密着でPUNCHを連打すると、番長が時々ジャンプして背後へ回り込みます。</li><li>通常PUNCHを3回受けるごとに番長は高速バックステップ。追いかける必要があります。</li><li>プレイヤーは派手な突進SPECIALを2回まで使用可能。1回命中で5ダメージ。</li><li>相手の攻撃頻度は少し控えめ。ただし壁際へ追い込むと強烈な反撃があります。</li>`;
  }else if(index===52){
    rules=`<li>巨大モブくんぬいぐるみ1個だけのUFOキャッチャー。</li><li>まずARM WIDTHゲージをSTOPしてアームの広さを決定。狭すぎても広すぎても掴みにくく、適度な幅が重要。</li><li>その後◀ ▶で横位置を合わせて「降下」。降下中のSTOPは高さだけ。</li><li>アーム幅・横位置・高さでまず掴みます。ただし掴み方が浅いと持ち上げ中に滑り落ちることがあります。</li><li>3回とも景品口まで運べたら100点。</li><li>2回GETは80点から、1回GETは50点から。使った合計時間が短いほど追加点。</li>`;
  }else if(index===53){
    rules=`<li>play/001.png=ON、play/002.png=OFF。</li><li>30体のおもちゃがランダム位置に出現。ON25体・OFF5体。</li><li>OFFだけを素早くタップするとONへ変化。</li><li>5体すべてONになった瞬間までのタイムを競います。</li>`;
  }else if(index===54){
    rules=`<li>ドッジボール大好きなモブくんが10秒で何体倒せるか挑戦。</li><li>play/003.pngがプレイヤー。黒塗り反転モブくんが5体ずつ出現。</li><li>敵はそれぞれ上下移動し、必ず中央のボールラインを通過します。</li><li>THROWまたは画面タップで真っすぐボールを発射。1回投げるとリロード1秒。</li><li>5体全滅すると新しい5体が即登場。10秒終了時のKO数が記録。</li>`;
  }else if(index===55){
    rules=`<li>6本のあみだくじ。ゴールは0 / 15 / 30 / 50 / 75 / 100。</li><li>最初はゴール側からカメラが始まり、あみだの一部をヒントとして見せてから入口へ移動。</li><li>入口を1つ選ぶとモブくんが自動で線をたどり、カメラが追従してゴールへ。</li><li>あみだの横線・数字の配置は毎回ランダム。</li>`;
  }else if(index===56){
    rules=`<li>鍔・柄・柄頭は最初から完成済み。プレイヤーが描くのは刀身だけ。</li><li>刀は縦向き。黄色い根元から上へ、好きな形のカッコイイ刀身を7秒で描きます。</li><li>長さ・根元への接続・滑らかさ・中央バランスなどを採点。刀身の太さは自由です。</li><li>まっすぐでも少し曲がっていてもOK。1〜100点。</li>`;
  }else if(index===57){
    rules=`<li>野球ではなくゴルフのパワーヒッターゲーム。</li><li>最初にANGLEゲージをSTOPして10〜70°から打ち出し角を決定。</li><li>次にPOWERゲージをSTOP。100%に近いほど強いショット。</li><li>自動でゴルフスイングし、カメラがボールを追跡。角度45°付近＋POWER100%で最大3000m。</li>`;
  }else if(index===58){
    rules=`<li>上から大量の岩が落下。← →でモブくんを動かして避けます。</li><li>岩に1回でも当たったら即終了。</li><li>7秒までは徐々に難しくなり、7秒以降は落石数・速度が一気に上がるROCK STORM。</li><li>最大12秒生存。</li>`;
  }else if(index===59){
    rules=`<li>右側の巨大な木に、矢と同じくらい細い白線があります。</li><li>左のモブくんを▲ ▼で上下移動。</li><li>モブくんの弓から短い照準線が出るので、矢が出る高さを確認できます。</li><li>FIREまたは画面タップで矢を1発だけ真っすぐ発射。判定は以前より少し広めです。</li><li>矢が刺さった高さと白線の誤差から0〜100点。</li>`;
  }else if(index===60){
    rules=`<li>細い棒の上にモブくん。10秒間倒れないように維持。</li><li>右へ傾いたらLEFT、左へ傾いたらRIGHTをタップして補正。</li><li>風と傾き加速はかなり強め。後半ほど不安定になります。</li><li>約26°から補正不能、32°で転倒。</li>`;
  }else if(index===61){
    rules=`<li>5個の巨大サイコロを1回だけ振る完全な運勝負。</li><li>合計5（全部1）=1点、合計30（全部6）=100点。</li><li>途中の合計は5〜30を1〜100点へ比例換算。</li>`;
  }else if(index===62){
    rules=`<li>6×5のモブ球パズル。10秒間、押したモブ球を指で動かして隣と入れ替えます。</li><li>同じモブ球が横に3体以上並ぶと、揃った組から順番に消えます。</li><li>その盤面で消える組が全部消えてから、上のモブ球が落下・補充されます。落ちた結果たまたま揃えば落ちコン。</li><li>落ちコンは起こりやすめですが確定ではありません。初期盤面も毎回大きく変化します。</li><li>カウントダウン前から盤面を確認できます。20 COMBO=100点。</li>`;
  }else if(index===63){
    rules=`<li>固定されたビリビリ迷路のGOALを目指します。全員同じコースなので公平です。</li><li>画面をタップするとピンが立ち、モブくんがその場所へ歩きます。</li><li>途中には上下に動き続ける「ビリビリモブくんマシーン」が3台。壁やマシーンへ触れると1秒スタン。</li><li>カウントダウン中からステージと初期配置を確認できます。GOALまでのタイムを競います。</li>`;
  }else if(index===64){
    rules=`<li>中央にMOBと描かれたパックを1つ購入して開封します。1パック6枚入り。</li><li>「開封！」を押すと1枚ずつカードが表示され、レア度ごとの演出が入ります。</li><li>最後に6枚のカードが並び、合計ポイントを発表。合計ポイントが高いほど有利です。</li><li>レア度は R=5点 / SR=8点 / SSR=10点 / UR=15点 / MOB=30点。</li>`;
  }else if(index===65){
    rules=`<li>輪切りトマト / チーズ / サラミ / 輪切りピーマンの巨大具材8個が最初から全部並びます。</li><li>制限時間は3秒。具材を1個ずつピザへ直接スワイプしてください。</li><li>指を離した位置がそのまま着地点。中央へ自動補正しません。</li><li>時間終了後はオーブンでこんがり焼き、乗せた数・配置・散らばりを採点します。</li>`;
  }else if(index===66){
    rules=`<li>制限時間5秒。ボタンは左から「滅・剛・力」で固定されています。</li><li>滅 → 剛 → 力 → 滅 → 剛 → 力…の順番でタップしてENERGYを溜めます。</li><li>間違えるとENERGY減少・連鎖リセット。5秒間にどこまで溜められるか勝負。</li><li>終了後に巨大ハンマーを振り下ろし、高ENERGYでは周囲の建物、さらに強ければピラミッドまで崩壊します。</li>`;
  }else if(index===67){
    rules=`<li>モブくんが台から飛び出し、逆さになって高速落下します。</li><li>地面ギリギリだと思った瞬間にSTOP。</li><li>約8px手前がPERFECT。地面接触は0点。</li><li>成功するとゴムが縮み、モブくんが大きく跳ね返ります。</li>`;
  }else if(index===68){
    rules=`<li>モブくんがそりに乗って10秒間ウォータースライダーを疾走。</li><li>LEFT / RIGHTで操作しますが、水流と波が常に左右へ押してきます。</li><li>途中には岩・ブイ・樽。後半は障害物も波も強くなります。</li><li>壁・障害物への接触で減点。波へ逆らいながらノーヒットを狙います。</li>`;
  }else if(index===69){
    rules=`<li>1回の挑戦で巨大パンケーキ2枚を同時にひっくり返します。</li><li>その2枚同時フリップを合計2回。全部で4枚。</li><li>1回のスワイプで2枚の高さ・回転・着地点が少しずつ変わります。</li><li>2枚とも約1回転してフライパン中央へ戻すことが重要。2回の平均点が記録です。</li>`;
  }else if(index===70){
    rules=`<li>胴体・機首・尾翼は最初から完成済み。5秒で左右の翼だけ描きます。</li><li>左右の広がり・対称性・機体への接続を採点。</li><li>完成後は描いた線を含む紙飛行機そのものが空を飛びます。</li><li>最大100m。</li>`;
  }else if(index===71){
    rules=`<li>中央の戦車を動かさない見下ろし型シューティングです。</li><li>上下左右からスライムが戦車へ接近。画面をフリックした方向へ大砲を1発発射します。</li><li>発射方向は上・下・左・右の4方向。10秒間、後半ほど敵の出現間隔と移動速度が上がります。</li><li>倒したスライムの数が記録。戦車へ到達した敵は消滅し、撃破数には入りません。</li>`;
  }else if(index===72){
    rules=`<li>ストーンを上方向へ1回だけスワイプ。</li><li>スワイプ速度で距離、横方向のブレでコースが決まります。</li><li>氷の軌跡・スピン・ハウス到達演出を追加。</li><li>ハウス中央へ近いほど高得点。中心で100点。</li>`;
  }else if(index===73){
    rules=`<li>画面中央の巨大シャボン玉を、モブくんが下から吹いて膨らませます。</li><li>BLOWを長押しして、好きなタイミングで離します。</li><li>残り余裕を文字では表示しません。泡の揺れと「!」だけがヒント。</li><li>限界直前ほど高得点。破裂すると0点です。</li>`;
  }else if(index===74){
    rules=`<li>カートゥーンの部屋を最初に2.5秒観察します。</li><li>小さな表示だけなので「覚えて！」が部屋を隠しません。</li><li>短い切替演出後、家具・小物の1ヶ所だけ色や形が変化。</li><li>変化した物をタップ。正解が速いほど高得点。</li>`;
  }else if(index===75){
    rules=`<li>複数の箱が高速コンベアを流れ、順番にMOB CHECKゲートを通過します。</li><li>箱が検査ゲートを通る瞬間、マークが表示されることがあります。</li><li>「！」が出た瞬間に赤いDETECTを1回だけタップ。</li><li>！から105ms以内=100点、185ms以内=90点。押せるのは1回だけです。</li>`;
  }else if(index===76){
    rules=`<li>左右の崖の黄色いアンカー付近をつなぐよう、5秒で自由に橋を描きます。</li><li>判定はかなり緩め。多少ずれても橋として扱います。</li><li>終了後モブくんが描いた橋をゆっくり歩いて渡ります。</li><li>両岸への接続・滑らかさ・急傾斜を総合採点。</li>`;
  }else if(index===77){
    rules=`<li>5個の宝箱のうち、最初に100点の宝箱だけ豪華に開きます。</li><li>閉じたあと高速シャッフル。光の残像や砂煙にも注目。</li><li>終了後、100点だと思う宝箱を1つタップ。</li><li>選択後は全箱を開き、100点箱も公開します。</li>`;
  }else if(index===78){
    rules=`<li>32分割の高速ルーレット。100点床は1マス、90点床も1マスだけです。</li><li>JUMPを押すとモブくんがルーレット外から飛びます。ジャンプ中も高速回転を続けます。</li><li>実際に着地した瞬間のLAND位置にある極細の床を判定。</li><li>高得点床はかなり狭く、回転速度も以前より速くなっています。</li>`;
  }else if(index===79){
    rules=`<li>地面の9マスから3ヶ所を選んで発掘します。</li><li>1ヶ所掘るたびに土が飛び、化石や石が出現。演出終了後に次を掘れます。</li><li>0 / 10 / 30 / 50 / 75 / 100ポイント。</li><li>3回の合計ポイントで競います。</li>`;
  }else if(index===80){
    rules=`<li>偽モブくんはジョーカーとスペードのA、こちらはダイヤのAを持って開始。</li><li>相手の2枚から1枚を選ぶたび「このカードを引きますか？」と確認が出ます。「はい」で確定、「いいえ」で選び直せます。</li><li>スペードのAを引けばAのペアが完成して勝利。ジョーカーなら相手へ戻り、2枚をシャッフルして次の挑戦。</li><li>何回目の「はい」で勝てたかを競います。1回目勝利が最高記録。</li>`;
  }else if(index===81){
    rules=`<li>モブくんが乗った巨大ロボは自動で前進し続け、前進中はENERGYが減り続けます。</li><li>右下のBATTERY枠へ好きな形を何本でも自由に描きます。描き終わったあと、絵を短くタップすると電池としてロボへ飛びます。</li><li>一筆だけでも送れますが補給量は少なめ。複数の線で大きく描くほど補給量が伸びます。</li><li>ENERGYが0になった瞬間に終了し、それまでの前進距離が記録です。</li>`;
  }else if(index===82){
    rules=`<li>中央〜上部では10体のモンスターがそれぞれ違う速度で左右に歩いています。</li><li>下の正方形BALL DESIGN枠で円と中のデザインを何本でも自由に描けます。</li><li>描いたボールを上方向へフリックすると、その方向と速さのままモンスターへ飛びます。命中すると吸い込み→揺れ→捕獲判定。</li><li>モンスターごとに捕まりやすさが異なります。10体すべてGETで100点です。</li>`;
  }else if(index===83){
    rules=`<li>所持金30000円で、P / C / 1B / 2B / 3B / SS / RF / LF / CFの9人をスカウトします。</li><li>各ポジションごとに5人が横一列へ表示され、選べる時間は1秒。選んだ選手を即購入します。</li><li>R=500円 / SR=1000円 / SSR=3000円 / UR=5000円 / MOB=10000円。時間切れまたは資金不足ならRが自動加入。</li><li>9人決定後にチーム一覧を確認し、「結果を観る」で47校中の甲子園順位を発表します。</li>`;
  }else if(index===84){
    rules=`<li>プレイヤーと9人の偽モブくんが、宙に浮く岩の足場からスタートします。</li><li>左右の矢印で移動、JUMPで最大2段ジャンプ。モブくん同士はぶつかるので、前をふさがれたらジャンプして越えます。</li><li>岩の足場は部分ごとにヒビが入り、時間とともにどんどん崩落します。落下したらその時点で終了です。</li><li>最初に落ちると0点。最後の1人まで生き残ればCLEARで100点です。</li>`;
  }else if(index===85){
    rules=`<li>最初は円形の魂ゲージ。ゲージがMAXに近い瞬間を狙ってタップします。</li><li>次は円型ゲージの輪郭を指でなぞり、これを3回成功させます。</li><li>2つのゲージが終わると「モブくん波動パワー！」が出現。タップすると偽モブくんと波動の撃ち合いが始まります。</li><li>波動が強いほど小さく凝縮され、周囲のリング・火花・衝撃波が強化。かなり弱い場合だけ逆に押し負けます。</li>`;
  }else if(index===86){
    rules=`<li>3対3。中央ラインを越えず、敵3人を全滅させます。</li><li>移動・ジャンプ・射撃・リロード・グレネード・回復を使います。</li>`;
  }else if(index===87){
    rules=`<li>10秒間の縦シューティング。弾は自動発射です。</li><li>左右移動・ボム・3秒レーザーでスライムを倒します。</li>`;
  }else if(index===88){
    rules=`<li>自動で走り、JUMPでロイター板を踏みます。</li><li>15段から20段までの跳び箱を順番に越えます。</li>`;
  }else if(index===89){
    rules=`<li>← / JUMP / 射撃 / 砲撃 / →で画面いっぱいの巨大エイリアンHP100と戦います。</li><li>5秒後に超巨大化。3秒間だけ砲撃が手動パンチに変わり無敵になります。</li>`;
  }else if(index===90){
    rules=`<li>7秒で巨大な武器を自由に描きます。</li><li>力が宿ったら10秒間オートで大量スライムを無双します。</li>`;
  }else if(index===91){
    rules=`<li>「勝負！」が出た瞬間にタップします。</li><li>3人の刺客を居合で迎え撃ち、反応タイムで高得点を狙います。</li>`;
  }else{
    rules=`<li>1対1のFPS勝ち抜き戦です。</li><li>10秒から開始し、1人倒すごとに5秒延長。10人撃破で100点です。</li>`;
  }
  const conciseRules=(rules.match(/<li>[\s\S]*?<\/li>/g)||[]).slice(0,2).join("");
  rules=conciseRules||`<li>${esc(g.sub)}</li>`;
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
    else if(gameIndex===48)startSniperMob(p,humanIndex,runId);
    else if(gameIndex===49)startMobRacePredict(p,humanIndex,runId);
    else if(gameIndex===50)startMobRocket(p,humanIndex,runId);
    else if(gameIndex===51)startBossDuel(p,humanIndex,runId);
    else if(gameIndex===52)startPlushCatcher(p,humanIndex,runId);
    else if(gameIndex===53)startToyOnOff(p,humanIndex,runId);
    else if(gameIndex===54)startDodgeballMob(p,humanIndex,runId);
    else if(gameIndex===55)startAmidakujiMob(p,humanIndex,runId);
    else if(gameIndex===56)startKatanaSmith(p,humanIndex,runId);
    else if(gameIndex===57)startPowerHitter(p,humanIndex,runId);
    else if(gameIndex===58)startMobMisfortune(p,humanIndex,runId);
    else if(gameIndex===59)startAimMob(p,humanIndex,runId);
    else if(gameIndex===60)startBalanceMob(p,humanIndex,runId);
    else if(gameIndex===61)startMobDice(p,humanIndex,runId);
    else if(gameIndex===62)startMobCombo(p,humanIndex,runId);
    else if(gameIndex===63)startElectricMaze(p,humanIndex,runId);
    else if(gameIndex===64)startCardShop(p,humanIndex,runId);
    else if(gameIndex===65)startPizzaChef(p,humanIndex,runId);
    else if(gameIndex===66)startMobHammer(p,humanIndex,runId);
    else if(gameIndex===67)startBungeeMob(p,humanIndex,runId);
    else if(gameIndex===68)startWaterSlide(p,humanIndex,runId);
    else if(gameIndex===69)startPancakeMob(p,humanIndex,runId);
    else if(gameIndex===70)startPaperPlane(p,humanIndex,runId);
    else if(gameIndex===71)startTankMob(p,humanIndex,runId);
    else if(gameIndex===72)startCurlingMob(p,humanIndex,runId);
    else if(gameIndex===73)startBubbleMob(p,humanIndex,runId);
    else if(gameIndex===74)startChangeMob(p,humanIndex,runId);
    else if(gameIndex===75)startBaggageMob(p,humanIndex,runId);
    else if(gameIndex===76)startBridgeMob(p,humanIndex,runId);
    else if(gameIndex===77)startTreasureMob(p,humanIndex,runId);
    else if(gameIndex===78)startRouletteMob(p,humanIndex,runId);
    else if(gameIndex===79)startExcavationMob(p,humanIndex,runId);
    else if(gameIndex===80)startOldMaidDuel(p,humanIndex,runId);
    else if(gameIndex===81)startRobotMarch(p,humanIndex,runId);
    else if(gameIndex===82)startMonsterMaster(p,humanIndex,runId);
    else if(gameIndex===83)startScoutMan(p,humanIndex,runId);
    else if(gameIndex===84)startAtafutaSurvival(p,humanIndex,runId);
    else if(gameIndex===85)startWaveMaster(p,humanIndex,runId);
    else if(gameIndex===86)startBattleRoyaleMob(p,humanIndex,runId);
    else if(gameIndex===87)startLittleMobShot(p,humanIndex,runId);
    else if(gameIndex===88)startMonsterBoxMob(p,humanIndex,runId);
    else if(gameIndex===89)startAlienBattleMob(p,humanIndex,runId);
    else if(gameIndex===90)startMobMusou(p,humanIndex,runId);
    else if(gameIndex===91)startIaidoMaster(p,humanIndex,runId);
    else startKillLeaderMob(p,humanIndex,runId);
  },{once:true});
}

async function countdown(
  label="COUNTDOWN",
  runId=activeGameRunId,
  options={}
){
  if(!isGameRunValid(runId))return false;

  cancelCountdown();
  const serial=++countdownSerial;

  if(!isGameRunValid(runId))return false;

  // ここへ来る前のDOM/初期座標を確定。
  try{void screen.offsetHeight}catch(_){}

  document.body.classList.add("countdown-active-v140");
  if(screen)screen.setAttribute("inert","");

  const layer=document.createElement("div");
  layer.className=
    "countdown-layer"+
    (options.transparent?" stage-visible-v121":"");
  layer.innerHTML=`<div class="count-label">${label}</div><div class="count-number">3</div>`;
  document.body.appendChild(layer);
  activeCountdownLayer=layer;

  const n=layer.querySelector(".count-number");

  try{
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

    return true;
  }finally{
    // 別カウントダウン開始済みなら新しいinertを触らない。
    if(activeCountdownLayer===layer){
      if(layer.isConnected)layer.remove();
      activeCountdownLayer=null;
      document.body.classList.remove("countdown-active-v140");
      if(screen)screen.removeAttribute("inert");
      clearGameplaySelection();
    }else if(layer.isConnected){
      layer.remove();
    }
  }
}

function playBadge(humanIndex){
  return state.freePlay ? "SOLO" : `${humanIndex+1}/${humans().length}`;
}

// GAME 1 -------------------------------------------------
async function startReaction(p,humanIndex,runId){
  gameFit();
  screen.innerHTML=`<section class="reaction-stage"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんの反射神経</h2></div><div id="reactionZone" class="reaction-zone"><div class="wait-dots">•••</div></div><p class="hint">モブくんが出た瞬間にタップ。0.0001秒単位で表示します。</p></section>`;
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
  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんを覚えて！</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="memory-status"><div class="stat-box"><span>PHASE</span><b id="memPhase">WATCH</b></div><div class="stat-box"><span>CORRECT</span><b id="memCount">0 / 10</b></div></div><div id="memoryBoard" class="memory-board">${ids.map(id=>`<button type="button" class="memory-tile" data-id="${id}"><img src="icon/${String(id).padStart(2,"0")}.png" alt="icon ${id}" onerror="this.style.visibility='hidden'"></button>`).join("")}</div><p id="memHint" class="hint">3・2・1のあと、光る順番を覚えてください。</p>`;
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
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん12</h2></div>
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
          return `<button type="button" class="number-tile locked" data-num="${num}" aria-label="${num}" style="--px:${x}%;--py:${y}%"><img class="number-mob-mini-v119" src="icon/${String(((num-1)%10)+1).padStart(2,'0')}.png" draggable="false" alt=""><span>${num}</span></button>`;
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

  screen.innerHTML=`<div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん人形空を飛ぶ</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
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
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん1990にチャレンジ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="ganbare-hud n1990-hud">
      <div class="ganbare-time"><span>TIME</span><b id="ganbareTime">10.00</b></div>
      <div class="ganbare-count"><span>1990</span><b id="hitCount">0周</b></div>
      <div class="ganbare-count"><span>STREAK</span><b id="streakCount">0</b></div>
    </div>

    <div id="n1990Grid" class="n1990-grid">
      ${[0,1,2,3].map(i=>`<button class="n1990-choice4" data-choice="${i}" type="button"><img class="n1990-mini-mob-v119" src="icon/${String(i+1).padStart(2,'0')}.png" draggable="false" alt=""><b>1990</b></button>`).join("")}
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

        <div id="shutterMob" class="shutter-mob shutter-mob-v116" style="background-image:url('icon/01.png')"></div>

        <div class="shutter-view-data left">1/500<br>F2.8</div>
        <div class="shutter-view-data right">RAW<br>50mm</div>

        <div id="shutterCurtain" class="shutter-curtain">
          <i class="top"></i><i class="bottom"></i>
        </div>

        <div id="shutterSnap" class="shutter-snap-v111">CLICK!</div>

        <div id="shutterPhoto" class="shutter-photo-v111">
          <div id="shutterPhotoMob" class="shutter-photo-mob" style="background-image:url('icon/01.png')"></div>
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

  // V10.16: camera body used to collapse the flex stage to almost 0px.
  // Force the subject visible before any countdown begins.
  mob.style.opacity='1';
  mob.style.display='block';

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

    // The instant-photo preview is a framed full-body photo.
    // V10.16 moved the preview by jump height and cropped the upper body.
    photoMob.style.transform='translateX(-50%) scale(.82)';
    photoMob.style.bottom='2px';

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
  screen.innerHTML=`<div class="brake-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんブレーキチキンレース</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="brake-hud"><span>SPEED</span><b id="brakeSpeed">FAST</b></div><div id="brakeStage" class="brake-stage"><div id="brakeWorld" class="brake-world" style="width:${worldW}px"><div class="brake-road"></div><div id="brakeCar" class="brake-car"><img src="icon/01.png" draggable="false"></div><div id="brakeObstacle" class="brake-obstacle">!</div></div><div id="brakeAlert" class="brake-alert">DRIVE</div></div><button id="brakeBtn" class="brake-button" type="button">BRAKE</button></div>`;
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
  screen.innerHTML=`<div class="feint-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんは騙されやすい</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><button id="feintStage" class="feint-stage" type="button"><img src="icon/01.png" draggable="false"><strong id="feintWord">READY</strong><span>本物のGO!だけタップ</span></button></div>`;
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
  screen.innerHTML=`<div class="overlap-shell master-overlap-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>重なりモブくん</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="overlap-hud overlap-hud-two"><div><span>4 MATCH</span><b id="masterLive">---</b></div><div><span>TIME</span><b id="masterTime">10.00</b></div></div><button id="masterStage" class="overlap-stage master-stage" type="button">${[1,2,3,4].map((n,i)=>`<div id="masterC${i}" class="overlap-circle master c${i}"><img src="icon/0${n}.png" draggable="false"></div>`).join('')}<div class="overlap-center-line"></div><div class="overlap-tap">MASTER TAP</div></button><p class="hint">4つ全部が重なる瞬間を狙う。</p></div>`;
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
  screen.innerHTML=`<div class="popular-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>アクションモブくん</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="popular-hud"><div><span>TIME</span><b id="popularTime">10.00</b></div><div><span>STOMP</span><b id="popularKills">0</b></div></div><div id="popularView" class="popular-view"><div id="popularWorld" class="popular-world" style="width:${worldW}px">
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
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは破壊神</h2></div>
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
      finalCharge>=97?'モブくんは破壊神':finalCharge>=90?'超巨大エネルギー':'ENERGY READY',
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
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんバイクで飛ぶ</h2></div>
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
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんのトランポリン</h2></div>
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
  const worldW=900;
  const fieldMinX=65;
  const fieldMaxX=worldW-65;

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
          ${Array.from({length:4},(_,i)=>`
            <div class="school-window" style="left:${55+i*210}px"></div>
            <div class="school-door brawler-door-v110" data-door="${i}" style="left:${150+i*210}px">
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
    document.getElementById('brawlerAllyA')
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
      x:worldW*.34,
      home:worldW*.34,
      speed:290,
      cd:760,
      lastAttack:0,
      phase:.7
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
      Math.round((x-150)/210),
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
        x=150+doorIndex*210+rand(-14,14);
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
      nextAttack:now+rand(900,1800),
      hitVX:0,
      hitVY:0,
      airRot:0,
      airborne:false
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

    const bossDoorIndexes=[0,2,3];
    const bossXs=bossDoorIndexes.map(i=>150+i*210);

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
      // Non-lethal hits must still feel like a brawler hit:
      // launch the boss into the air, rotate, then let physics land him.
      enemy.airborne=true;
      enemy.hitVX=dir*rand(300,430);
      enemy.hitVY=rand(370,510);
      enemy.airRot=0;

      enemy.el.classList.remove('boss-hurt');
      void enemy.el.offsetWidth;
      enemy.el.classList.add('boss-hurt','nonlethal-flight');

      enemy.el.style.setProperty('--hurt-dir',dir);
      enemy.el.style.setProperty('--air-rot','0deg');

      popImpact(
        enemy.boss
          ? `${enemy.hp} HIT 残り`
          : 'HIT!'
      );

      beep(enemy.boss?300:240,34,.011);
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

    // Door-entry animation must be removed before the KO animation.
    // Otherwise CSS animation priority makes normal mobs simply disappear.
    enemy.el.classList.remove(
      'door-in',
      'enemy-attacking',
      'boss-hurt',
      'nonlethal-flight'
    );

    void enemy.el.offsetWidth;

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

      if(enemy.airborne){
        enemy.hitVY-=1320*dt;
        enemy.x+=enemy.hitVX*dt;
        enemy.y+=enemy.hitVY*dt;
        enemy.hitVX*=Math.pow(.18,dt);
        enemy.airRot+=dir*620*dt;

        if(enemy.y<=64){
          enemy.y=64;
          enemy.hitVX=0;
          enemy.hitVY=0;
          enemy.airRot=0;
          enemy.airborne=false;
          enemy.el.classList.remove('nonlethal-flight','boss-hurt');
        }

        enemy.x=clamp(
          enemy.x,
          fieldMinX+18,
          fieldMaxX-18
        );

        enemy.el.style.left=`${enemy.x}px`;
        enemy.el.style.bottom=`${enemy.y}px`;
        enemy.el.style.setProperty('--enemy-face',dir);
        enemy.el.style.setProperty('--air-rot',`${enemy.airRot}deg`);
        continue;
      }

      if(Math.abs(dx)>54){
        enemy.x+=dir*enemy.speed*dt;
      }

      enemy.x=clamp(
        enemy.x,
        fieldMinX+18,
        fieldMaxX-18
      );

      enemy.el.style.left=`${enemy.x}px`;
      enemy.el.style.bottom=`${enemy.y}px`;
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

  await wait(5000);
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
function guardianClusterStrokes(strokes,threshold=12){
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

  function pointDistance(a,b){
    // Fast reject first.
    if(bboxGap(a.stat,b.stat)>threshold)return Infinity;

    const sa=a.stroke;
    const sb=b.stroke;

    const stepA=Math.max(1,Math.floor(sa.length/36));
    const stepB=Math.max(1,Math.floor(sb.length/36));

    let best=Infinity;

    for(let i=0;i<sa.length;i+=stepA){
      const pa=sa[i];

      for(let j=0;j<sb.length;j+=stepB){
        const pb=sb[j];
        const d=Math.hypot(pa.x-pb.x,pa.y-pb.y);

        if(d<best)best=d;
        if(best<=threshold)return best;
      }
    }

    return best;
  }

  for(const item of valid){
    // Only strokes that actually touch / nearly touch are one structure.
    // Large overlapping bounding boxes no longer merge distant buildings.
    let cluster=clusters.find(c=>
      c.items.some(other=>
        pointDistance(item,other)<=threshold
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
    const perimeter=2*(w+h)+1;
    const lineDensity=len/perimeter;
    const verticality=clamp(h/(w+1)/2.4,0,1);
    const detail=clamp(c.items.length/8,0,1);
    const complexity=clamp(turn/(Math.PI*24),0,1);

    // Size matters, but a giant empty outline is not automatically a fortress.
    const durability=clamp(
      Math.round(
        24+
        clamp(area/23500,0,1)*100+
        clamp(len/1500,0,1)*118+
        clamp(lineDensity/2.8,0,1)*82+
        detail*92+
        complexity*66+
        verticality*30
      ),
      22,540
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

  screen.innerHTML=`<div class="guardian-shell guardian-v112">
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

      <div id="guardianEnergy" class="guardian-energy-v112">
        <i></i><b></b>
      </div>

      <svg id="guardianSvg" class="guardian-svg guardian-svg-v112"></svg>

      <div id="guardianClash" class="guardian-clash-v112">
        <i class="c1"></i><i class="c2"></i><i class="c3"></i><b>CLASH!</b>
      </div>

      <div id="guardianDebris" class="guardian-debris"></div>
      <div id="guardianCall" class="guardian-call"></div>
      <div id="guardianWave" class="guardian-wave-v112"></div>
      <div id="guardianMessage" class="guardian-message">城・タワーを描いて守れ！</div>
    </div>
  </div>`;

  const stage=document.getElementById('guardianStage');
  const svg=document.getElementById('guardianSvg');
  const mob=document.getElementById('guardianMob');
  const energy=document.getElementById('guardianEnergy');
  const clash=document.getElementById('guardianClash');
  const debris=document.getElementById('guardianDebris');
  const call=document.getElementById('guardianCall');
  const waveEl=document.getElementById('guardianWave');
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

  const initialTotal=clusters.reduce((sum,c)=>sum+c.hp,0);

  function currentHp(){
    return clusters.reduce((sum,c)=>sum+Math.max(0,c.hp),0);
  }

  function updateDefense(){
    const hp=currentHp();

    defenseEl.textContent=
      initialTotal>0
        ? `${Math.round(hp/initialTotal*100)}%`
        : '0%';
  }

  updateDefense();

  call.textContent='魔王の攻撃だ！';
  call.classList.add('show');
  message.textContent='3連続攻撃を耐えろ！！';

  beep(330,140,.035);

  await wait(720);
  if(!isGameRunValid(runId))return;

  const waves=[
    {
      no:1,
      power:85,
      size:145,
      clashMs:720,
      title:'第一陣'
    },
    {
      no:2,
      power:145,
      size:285,
      clashMs:880,
      title:'第二陣'
    },
    {
      no:3,
      power:235,
      size:Math.min(540,w*1.12),
      clashMs:1080,
      title:'第三陣'
    }
  ];

  function breakStructure(cluster){
    const g=clusterGroups[cluster.id];
    if(!g)return;

    g.classList.remove('clashing');
    g.classList.add('destroyed');

    debris.style.left=`${cluster.cx}px`;
    debris.style.top=`${cluster.cy}px`;
    debris.innerHTML=Array.from({length:18},(_,i)=>`
      <i style="
        --gx:${rand(-125,125).toFixed(0)}px;
        --gy:${rand(-130,65).toFixed(0)}px;
        --gr:${randi(-260,260)}deg;
        --gd:${(i%6)*.018}s
      "></i>
    `).join('');

    debris.classList.remove('show');
    void debris.offsetWidth;
    debris.classList.add('show');

    beep(165,120,.032);
  }

  function setWaveEnergy(wave){
    energy.className='guardian-energy-v112 active';
    energy.style.width=`${wave.size}px`;
    energy.style.height=`${wave.size}px`;
    energy.style.left=`${w+wave.size*.62}px`;
    energy.dataset.x=String(w+wave.size*.62);
    energy.style.setProperty('--guardian-energy-scale',`${wave.size/145}`);

    waveEl.textContent=
      `${wave.title} / ENERGY ×${wave.no===1?'1':wave.no===2?'2':'MAX'}`;

    waveEl.classList.remove('show','final');
    void waveEl.offsetWidth;
    waveEl.classList.add('show');

    if(wave.no===3)waveEl.classList.add('final');
  }

  async function moveEnergyTo(x,duration=360){
    const from=parseFloat(
      energy.dataset.x||
      String(w+100)
    );

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

  async function clashWithStructure(cluster,wave,remainingPower){
    const g=clusterGroups[cluster.id];

    const collisionX=clamp(
      cluster.maxX+wave.size*.34,
      cluster.maxX+28,
      w+wave.size*.35
    );

    await moveEnergyTo(
      collisionX,
      wave.no===3?620:450
    );

    if(!isGameRunValid(runId))return remainingPower;

    clash.style.left=`${clamp(cluster.maxX,58,w-35)}px`;
    clash.style.top=`${clamp(cluster.cy,55,h-58)}px`;

    clash.classList.remove('show','huge');
    void clash.offsetWidth;
    clash.classList.add('show');

    if(wave.no===3)clash.classList.add('huge');

    if(g){
      g.classList.remove('hit','clashing');
      void g.getBoundingClientRect();
      g.classList.add('clashing');
    }

    energy.classList.add('clashing');
    stage.classList.add('guardian-stage-clash-v112');

    message.textContent=
      wave.no===3
        ? '巨大エネルギーと防衛線が激突！！'
        : `${wave.title}とぶつかり合っている！`;

    const clashStart=performance.now();

    await new Promise(resolve=>{
      const frame=now=>{
        if(!isGameRunValid(runId)){resolve();return;}

        const t=clamp(
          (now-clashStart)/wave.clashMs,
          0,1
        );

        const base=collisionX;
        const press=
          Math.sin(t*Math.PI*10)*
          (wave.no===3?8:5);

        energy.style.left=`${base+press}px`;
        energy.style.transform=
          `translate(-50%,-50%) scale(${1+Math.sin(t*Math.PI*8)*.045})`;

        if(t<1){
          raf=requestAnimationFrame(frame);
        }else{
          energy.style.transform='translate(-50%,-50%)';
          resolve();
        }
      };

      raf=requestAnimationFrame(frame);
    });

    stage.classList.remove('guardian-stage-clash-v112');
    energy.classList.remove('clashing');
    clash.classList.remove('show','huge');

    if(g)g.classList.remove('clashing');

    const damage=Math.min(
      cluster.hp,
      remainingPower
    );

    cluster.hp-=damage;
    remainingPower-=damage;
    updateDefense();

    if(cluster.hp<=0){
      breakStructure(cluster);
      message.textContent=`${wave.title}で1つ崩壊！`;
      await wait(230);
    }else{
      if(g){
        g.classList.remove('hit');
        void g.getBoundingClientRect();
        g.classList.add('hit');
      }

      energy.classList.add('blocked');
      message.textContent=`${wave.title}を防いだ！！`;
      beep(920,135,.038);

      await wait(420);
      remainingPower=0;
    }

    return remainingPower;
  }

  async function hitMob(wave){
    message.textContent='防衛線全壊！ モブくんへ直撃！！';

    await moveEnergyTo(54,wave.no===3?520:420);
    if(!isGameRunValid(runId))return;

    mob.classList.add('blown');
    energy.classList.add('mob-hit');

    stage.classList.remove('guardian-stage-clash-v112');
    clash.classList.remove('show','huge');

    beep(110,250,.055);
  }

  let destroyedAll=false;

  for(const wave of waves){
    if(!isGameRunValid(runId))return;

    const alive=clusters
      .filter(c=>c.hp>0)
      .sort((a,b)=>b.cx-a.cx);

    if(!alive.length){
      destroyedAll=true;
      setWaveEnergy(wave);
      await hitMob(wave);
      break;
    }

    setWaveEnergy(wave);
    message.textContent=
      `${wave.title} 接近！`;

    beep(
      wave.no===3?180:
      wave.no===2?250:
      340,
      120,.03
    );

    await wait(360);
    if(!isGameRunValid(runId))return;

    let remainingPower=wave.power;

    for(const cluster of alive){
      if(remainingPower<=0)break;
      if(cluster.hp<=0)continue;

      remainingPower=
        await clashWithStructure(
          cluster,
          wave,
          remainingPower
        );

      if(!isGameRunValid(runId))return;
    }

    const stillAlive=clusters.some(c=>c.hp>0);

    if(!stillAlive){
      destroyedAll=true;

      // If the last structure broke, the wave visually continues into Mob-kun.
      await hitMob(wave);
      break;
    }

    if(remainingPower<=0){
      energy.classList.add('retreat');
      await wait(380);
    }

    energy.className='guardian-energy-v112';
    energy.style.opacity='0';

    if(wave.no<3){
      message.textContent=
        `${wave.title}終了… 次が来る！`;

      await wait(520);
    }
  }

  const remainingTotal=currentHp();

  let score=0;
  let remainingPct=0;

  if(
    !clusters.length||
    destroyedAll||
    remainingTotal<=0
  ){
    score=0;
    remainingPct=0;

  }else{
    remainingPct=clamp(
      remainingTotal/
      Math.max(1,initialTotal)*
      100,
      0,100
    );

    // New scoring:
    // 50% or more remaining = 100 points.
    // Under 50% = remaining percentage x2.
    // Example: 3% remaining -> 6 points, not 100.
    score=clamp(
      Math.round(
        Math.min(50,remainingPct)*2
      ),
      1,100
    );

    message.textContent=
      `3連撃防衛成功！ 残存耐久 ${remainingPct.toFixed(0)}% / ${score} POINT`;
  }

  state.records.guardianMob[p.id]=score;
  defenseEl.textContent=
    `${remainingPct.toFixed(0)}% / ${score}pt`;

  await wait(850);

  if(isGameRunValid(runId)){
    recordScreen(
      46,p,humanIndex,
      `${score}<small>pt</small>`,
      score===0
        ? '3 WAVE BREAK'
        : `耐久 ${remainingPct.toFixed(0)}% / ${clusters.length} STRUCTURES`
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



// GAME 50 -------------------------------------------------
const MOB_RACE_GOOD_LINES=[
  "今日は翼が生えている",
  "エアー連発出来た！",
  "僕は風になる",
  "足がめちゃくちゃ軽い！",
  "朝から絶好調！",
  "今日は負ける気がしない",
  "スタートが見えてる",
  "体が勝手に前へ出る",
  "昨日より速く走れそう",
  "追い風しか感じない",
  "脚がバネみたいだ",
  "今日は自己ベストの日",
  "ゴールが近く見える",
  "走りたくて仕方ない",
  "今なら空も走れそう"
];

const MOB_RACE_BAD_LINES=[
  "お腹すいた",
  "タンコブ出来た",
  "これは風邪か？",
  "足がちょっと重い",
  "朝から眠すぎる",
  "靴ひもが気になる",
  "昨日走りすぎた",
  "向かい風しか感じない",
  "なんか膝が笑ってる",
  "スタート失敗しそう",
  "今日は休みたかった",
  "ゴールが遠く見える",
  "体がまだ起きてない",
  "ちょっと横腹が痛い",
  "走る前から疲れた"
];

async function startMobRacePredict(p,humanIndex,runId){
  gameFit();

  let prediction=[1,2,3,4];
  let raceRAF=null;
  let raceStarted=false;

  const conditionSeed=shuffle([
    'good',
    'bad',
    'neutral',
    Math.random()<.5?'good':'bad'
  ]);

  const racers=[1,2,3,4].map((lane,i)=>{
    const mood=conditionSeed[i];

    const base=
      mood==='good'
        ? rand(.74,.98)
        : mood==='bad'
          ? rand(.20,.48)
          : rand(.46,.73);

    const performance=clamp(
      base+rand(-.05,.05),
      .12,1
    );

    const finishSec=clamp(
      6.42-performance*1.72+rand(-.13,.13),
      4.55,6.55
    );

    return {
      lane,
      mood,
      performance,
      finishSec
    };
  });

  const finalOrder=[...racers]
    .sort((a,b)=>a.finishSec-b.finishSec)
    .map(r=>r.lane);

  screen.innerHTML=`<div class="race-predict-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんレースだれが勝つ!?</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="race-clue-hud">
      <span>CLUE TIME</span>
      <b id="raceClueTime">5</b>
      <em>1秒ごとのセリフを見逃すな</em>
    </div>

    <div id="racePredictStage" class="race-predict-stage">
      ${racers.map(r=>`
        <div class="race-lane" data-lane="${r.lane}">
          <b class="race-lane-no">${r.lane}</b>
          <div class="race-runner" id="raceRunner${r.lane}" style="background-image:url('icon/${String(r.lane).padStart(2,'0')}.png')"></div>
          <div class="race-speech" id="raceSpeech${r.lane}">…</div>
          <i class="race-finish-line"></i>
          <span class="race-place" id="racePlace${r.lane}"></span>
        </div>
      `).join('')}
    </div>

    <div id="racePredictPanel" class="race-predict-panel" hidden>
      <h3>ゴールする順番を予想してください！</h3>
      <p>キャラクターを2体タップして交換 / カードを左右・上下にスワイプして移動</p>
      <div id="raceOrderEditor" class="race-order-editor race-character-order-v114"></div>
      <button id="raceDecision" class="primary" type="button">決定</button>
    </div>

    <div id="raceResultCompare" class="race-result-compare" hidden></div>
  </div>`;

  const stage=document.getElementById('racePredictStage');
  const clueTime=document.getElementById('raceClueTime');
  const panel=document.getElementById('racePredictPanel');
  const editor=document.getElementById('raceOrderEditor');
  const decision=document.getElementById('raceDecision');
  const compare=document.getElementById('raceResultCompare');

  function pickLine(r,tick){
    if(r.mood==='good'){
      return MOB_RACE_GOOD_LINES[
        randi(0,MOB_RACE_GOOD_LINES.length-1)
      ];
    }

    if(r.mood==='bad'){
      return MOB_RACE_BAD_LINES[
        randi(0,MOB_RACE_BAD_LINES.length-1)
      ];
    }

    // Neutral racers definitely say both positive and negative lines
    // during the five-second clue phase.
    const pool=
      tick%2===0
        ? MOB_RACE_GOOD_LINES
        : MOB_RACE_BAD_LINES;

    return pool[randi(0,pool.length-1)];
  }

  for(let second=5;second>=1;second--){
    if(!isGameRunValid(runId))return;

    clueTime.textContent=second;

    racers.forEach(r=>{
      const speech=document.getElementById(
        `raceSpeech${r.lane}`
      );

      speech.textContent=pickLine(r,5-second);
      speech.classList.remove('pop');
      void speech.offsetWidth;
      speech.classList.add('pop');
    });

    beep(430+(5-second)*32,25,.005);
    await wait(1000);
  }

  if(!isGameRunValid(runId))return;

  clueTime.textContent='予想';

  racers.forEach(r=>{
    document.getElementById(
      `raceSpeech${r.lane}`
    ).textContent='？';
  });

  panel.hidden=false;

  let selectedIndex=null;
  let dragState=null;
  let dragGhost=null;

  function renderOrder(){
    editor.innerHTML=prediction.map((lane,index)=>`
      <button
        class="race-predict-character-v114 ${selectedIndex===index?'selected':''}"
        data-race-order-index="${index}"
        type="button">
        <span class="race-predict-rank-v114">${index+1}位</span>
        <img
          src="icon/${String(lane).padStart(2,'0')}.png"
          alt="LANE ${lane}"
          draggable="false">
        <b>LANE ${lane}</b>
        <small>${selectedIndex===index?'もう1体をタップ':'TAP / DRAG'}</small>
      </button>
    `).join('');
  }

  function swapPrediction(a,b){
    if(
      a<0||
      b<0||
      a>=prediction.length||
      b>=prediction.length||
      a===b
    )return;

    [prediction[a],prediction[b]]=
      [prediction[b],prediction[a]];

    selectedIndex=null;
    renderOrder();
    beep(610,35,.010);
  }

  function movePrediction(from,to){
    if(
      from<0||
      to<0||
      from>=prediction.length||
      to>=prediction.length||
      from===to
    )return from;

    const [lane]=prediction.splice(from,1);
    prediction.splice(to,0,lane);

    selectedIndex=null;
    renderOrder();
    beep(545,22,.006);
    return to;
  }

  function targetIndexFromPointer(clientX,clientY){
    const cards=[...editor.querySelectorAll('[data-race-order-index]')];

    let best=0;
    let bestDist=Infinity;

    cards.forEach((card,index)=>{
      const rect=card.getBoundingClientRect();
      const cx=rect.left+rect.width/2;
      const cy=rect.top+rect.height/2;
      const d=Math.hypot(clientX-cx,clientY-cy);

      if(d<bestDist){
        bestDist=d;
        best=index;
      }
    });

    return best;
  }

  function removeGhost(){
    if(dragGhost){
      dragGhost.remove();
      dragGhost=null;
    }
  }

  renderOrder();

  editor.addEventListener('pointerdown',e=>{
    const card=e.target.closest('[data-race-order-index]');
    if(!card)return;

    e.preventDefault();

    const rect=card.getBoundingClientRect();

    dragState={
      index:Number(card.dataset.raceOrderIndex),
      startIndex:Number(card.dataset.raceOrderIndex),
      x:e.clientX,
      y:e.clientY,
      pointerId:e.pointerId,
      moved:false
    };

    dragGhost=card.cloneNode(true);
    dragGhost.classList.add('race-drag-ghost-v116');
    dragGhost.style.width=`${rect.width}px`;
    dragGhost.style.height=`${rect.height}px`;
    dragGhost.style.left=`${rect.left}px`;
    dragGhost.style.top=`${rect.top}px`;

    document.body.appendChild(dragGhost);
    card.classList.add('drag-source-v116');

    try{editor.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  editor.addEventListener('pointermove',e=>{
    if(!dragState||e.pointerId!==dragState.pointerId)return;

    e.preventDefault();

    const dx=e.clientX-dragState.x;
    const dy=e.clientY-dragState.y;

    if(Math.hypot(dx,dy)>=10){
      dragState.moved=true;
    }

    if(dragGhost){
      dragGhost.style.transform=
        `translate(${dx}px,${dy}px) scale(1.05) rotate(${clamp(dx/18,-5,5)}deg)`;
    }

    if(!dragState.moved)return;

    const target=targetIndexFromPointer(e.clientX,e.clientY);

    if(target!==dragState.index){
      dragState.index=movePrediction(dragState.index,target);

      editor.querySelectorAll('.drag-source-v116')
        .forEach(el=>el.classList.remove('drag-source-v116'));

      const source=editor.querySelector(
        `[data-race-order-index="${dragState.index}"]`
      );

      if(source)source.classList.add('drag-source-v116');
    }
  },{passive:false});

  function finishPredictionPointer(e){
    if(!dragState||e.pointerId!==dragState.pointerId)return;

    e.preventDefault();

    const {
      index,
      startIndex,
      moved
    }=dragState;

    editor.querySelectorAll('.drag-source-v116')
      .forEach(el=>el.classList.remove('drag-source-v116'));

    removeGhost();

    if(!moved){
      if(selectedIndex===null){
        selectedIndex=index;
        renderOrder();
        beep(470,25,.006);

      }else if(selectedIndex===index){
        selectedIndex=null;
        renderOrder();

      }else{
        swapPrediction(selectedIndex,index);
      }
    }else{
      selectedIndex=null;
      renderOrder();

      if(startIndex!==index){
        beep(690,38,.012);
      }
    }

    dragState=null;
  }

  editor.addEventListener('pointerup',finishPredictionPointer,{passive:false});

  editor.addEventListener('pointercancel',e=>{
    if(!dragState)return;

    editor.querySelectorAll('.drag-source-v116')
      .forEach(el=>el.classList.remove('drag-source-v116'));

    removeGhost();
    dragState=null;
    renderOrder();
  },{passive:false});

  await new Promise(resolve=>{
    decision.addEventListener('pointerdown',e=>{
      e.preventDefault();
      decision.disabled=true;
      resolve();
    },{once:true,passive:false});
  });

  if(!isGameRunValid(runId))return;

  panel.hidden=true;

  if(!(await countdown('RACE',runId)))return;

  raceStarted=true;

  racers.forEach(racer=>{
    const speech=document.getElementById(`raceSpeech${racer.lane}`);
    if(speech)speech.textContent='';
  });

  stage.classList.add('racing');

  const start=performance.now();
  const finished=new Set();

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      racers.forEach(r=>{
        const runner=document.getElementById(
          `raceRunner${r.lane}`
        );

        const t=clamp(
          (now-start)/(r.finishSec*1000),
          0,1
        );

        const ease=
          t<.12
            ? t*t/0.12
            : .12+(t-.12)*.88/.88;

        runner.style.left=`${7+ease*83}%`;

        if(t>=1&&!finished.has(r.lane)){
          finished.add(r.lane);

          const place=
            finalOrder.indexOf(r.lane)+1;

          document.getElementById(
            `racePlace${r.lane}`
          ).textContent=`${place}位`;

          runner.classList.add('goal');
          beep(620+(4-place)*85,45,.012);
        }
      });

      if(finished.size===4){
        resolve();
        return;
      }

      raceRAF=requestAnimationFrame(frame);
    };

    raceRAF=requestAnimationFrame(frame);
  });

  if(!isGameRunValid(runId))return;

  const exact=prediction.reduce(
    (sum,lane,i)=>
      sum+(lane===finalOrder[i]?1:0),
    0
  );

  // With a 4-item permutation, exactly 3 exact positions is mathematically
  // impossible. For the requested 4/3/2/1 score tiers, a non-perfect racer
  // also counts as matched when its predicted rank is only 1 place away.
  const near=prediction.reduce(
    (sum,lane,predictedIndex)=>{
      const actualIndex=finalOrder.indexOf(lane);
      return sum+(
        Math.abs(predictedIndex-actualIndex)<=1
          ? 1
          : 0
      );
    },
    0
  );

  const matchTier=
    exact===4
      ? 4
      : Math.min(3,near);

  const score=
    matchTier===4?100:
    matchTier===3?80:
    matchTier===2?50:
    matchTier===1?30:
    0;

  state.records.mobRacePredict[p.id]=score;

  function resultCards(order){
    return `<div class="race-result-order-v114">${
      order.map((lane,i)=>`
        <div>
          <span>${i+1}位</span>
          <img src="icon/${String(lane).padStart(2,'0')}.png" draggable="false">
          <b>${lane}</b>
        </div>
      `).join('')
    }</div>`;
  }

  compare.innerHTML=`
    <h3>RACE RESULT</h3>
    <div>
      <span>YOUR PREDICTION</span>
      ${resultCards(prediction)}
    </div>
    <div>
      <span>ACTUAL ORDER</span>
      ${resultCards(finalOrder)}
    </div>
    <strong>${matchTier}/4 MATCH　${score} POINT</strong>
    <button id="raceResultContinue" class="primary" type="button">結果を確認</button>
  `;

  compare.hidden=false;

  beep(score===100?1080:score>=80?880:score>=50?660:430,150,.04);

  await new Promise(resolve=>{
    const btn=document.getElementById('raceResultContinue');

    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();
      btn.disabled=true;
      resolve();
    },{once:true,passive:false});
  });

  if(isGameRunValid(runId)){
    recordScreen(
      49,p,humanIndex,
      `${score}<small>pt</small>`,
      `予想 ${prediction.join('→')} / 結果 ${finalOrder.join('→')}`
    );
  }
}

// GAME 51 -------------------------------------------------
function scoreRocketDrawing(strokes,w,h,cockpit){
  const valid=strokes.filter(s=>s.length>=2);
  const flat=valid.flat();

  if(flat.length<5){
    return {
      distance:4.0,
      bbox:{
        minX:cockpit.x-45,
        maxX:cockpit.x+45,
        minY:cockpit.y-80,
        maxY:cockpit.y+55
      }
    };
  }

  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  let len=0;
  let turn=0;

  valid.forEach(stroke=>{
    const stat=drawingStrokeStats(stroke);

    minX=Math.min(minX,stat.minX);
    minY=Math.min(minY,stat.minY);
    maxX=Math.max(maxX,stat.maxX);
    maxY=Math.max(maxY,stat.maxY);
    len+=stat.len;
    turn+=stat.turn;
  });

  minX=Math.min(minX,cockpit.x-35);
  maxX=Math.max(maxX,cockpit.x+35);
  minY=Math.min(minY,cockpit.y-45);
  maxY=Math.max(maxY,cockpit.y+40);

  const bw=Math.max(1,maxX-minX);
  const bh=Math.max(1,maxY-minY);
  const aspect=bh/bw;

  const leftExtent=Math.max(1,cockpit.x-minX);
  const rightExtent=Math.max(1,maxX-cockpit.x);

  const symmetry=clamp(
    1-
    Math.abs(leftExtent-rightExtent)/
    Math.max(leftExtent,rightExtent),
    0,1
  );

  const aspectScore=clamp(
    1-
    Math.abs(aspect-1.9)/1.65,
    0,1
  );

  const lineScore=clamp(
    len/(w*7.0),
    0,1
  );

  const complexity=clamp(
    turn/(Math.PI*28),
    0,1
  );

  const areaRatio=
    bw*bh/
    Math.max(1,w*h);

  const sizeScore=clamp(
    1-
    Math.abs(areaRatio-.34)/.34,
    0,1
  );

  const nearCockpit=flat.filter(pt=>
    Math.hypot(
      pt.x-cockpit.x,
      pt.y-cockpit.y
    )<82
  ).length;

  const connection=clamp(
    nearCockpit/18,
    0,1
  );

  const strokeBalance=clamp(
    valid.length/10,
    0,1
  );

  const quality=
    symmetry*.22+
    aspectScore*.20+
    connection*.18+
    lineScore*.16+
    complexity*.10+
    sizeScore*.08+
    strokeBalance*.06;

  return {
    distance:Math.round(
      clamp(
        5+
        Math.pow(
          clamp(quality,0,1),
          .74
        )*
        95,
        0,100
      )*
      10
    )/10,
    bbox:{minX,maxX,minY,maxY}
  };
}

async function startMobRocket(p,humanIndex,runId){
  gameFit();

  let drawing=false;
  let drawingOpen=false;
  let pointerId=null;
  let currentStroke=null;
  let raf=null;

  const strokes=[];

  screen.innerHTML=`<div class="rocket-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんロケット</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="rocket-hud">
      <div><span>DRAW</span><b id="rocketTime">7.0</b></div>
      <div><span>DISTANCE</span><b id="rocketDistance">---</b></div>
    </div>

    <div id="rocketStage" class="rocket-stage">
      <div class="rocket-draw-bg">
        <i class="rocket-grid g1"></i>
        <i class="rocket-grid g2"></i>
        <i class="rocket-ground"></i>
      </div>

      <svg id="rocketDrawSvg" class="rocket-draw-svg"></svg>

      <div id="rocketCockpit" class="rocket-cockpit">
        <div class="rocket-cockpit-glass">
          <i style="background-image:url('icon/01.png')"></i>
        </div>
        <b>COCKPIT</b>
      </div>

      <div id="rocketMessage" class="rocket-message">コクピットの周りにロケットを描け！</div>
    </div>
  </div>`;

  const stage=document.getElementById('rocketStage');
  const svg=document.getElementById('rocketDrawSvg');
  const cockpitEl=document.getElementById('rocketCockpit');
  const timeEl=document.getElementById('rocketTime');
  const distanceEl=document.getElementById('rocketDistance');
  const message=document.getElementById('rocketMessage');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  const cockpit={
    x:w*.50,
    y:h*.70
  };

  cockpitEl.style.left=`${cockpit.x}px`;
  cockpitEl.style.top=`${cockpit.y}px`;

  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  function localPoint(e){
    const r=stage.getBoundingClientRect();

    return {
      x:clamp(e.clientX-r.left,6,w-6),
      y:clamp(e.clientY-r.top,8,h-32)
    };
  }

  function createStroke(){
    const el=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );

    el.classList.add('rocket-user-stroke');
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

  if(!(await countdown('ROCKET DRAW',runId)))return;

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

  const analysis=
    scoreRocketDrawing(
      strokes,
      w,h,
      cockpit
    );

  const distance=analysis.distance;
  const bbox=analysis.bbox;

  state.records.mobRocket[p.id]=distance;

  message.textContent='発射準備完了！';

  await wait(250);
  if(!isGameRunValid(runId))return;

  if(!(await countdown('LAUNCH',runId)))return;

  const pad=14;
  const minX=bbox.minX-pad;
  const minY=bbox.minY-pad;
  const bw=Math.max(80,bbox.maxX-bbox.minX+pad*2);
  const bh=Math.max(110,bbox.maxY-bbox.minY+pad*2);

  const lines=[...svg.querySelectorAll('.rocket-user-stroke')]
    .map(el=>el.outerHTML)
    .join('');

  const cockpitLeft=
    (cockpit.x-minX)/bw*100;

  const cockpitTop=
    (cockpit.y-minY)/bh*100;

  const displayW=clamp(
    bw,
    105,
    w*.82
  );

  const scale=displayW/bw;
  const displayH=bh*scale;

  stage.innerHTML=`<div id="rocketSpaceWorld" class="rocket-space-world">
    ${Array.from({length:35},(_,i)=>`
      <i class="rocket-star" style="
        left:${randi(4,96)}%;
        bottom:${110+i*145+randi(-55,55)}px;
        --rs:${rand(.5,1.6).toFixed(2)}
      "></i>
    `).join('')}

    ${Array.from({length:8},(_,i)=>`
      <i class="rocket-cloud-v112" style="
        left:${randi(5,85)}%;
        bottom:${150+i*150}px
      "></i>
    `).join('')}

    <div id="rocketVehicle" class="rocket-vehicle-v112" style="
      width:${displayW}px;
      height:${displayH}px
    ">
      <svg viewBox="${minX} ${minY} ${bw} ${bh}" preserveAspectRatio="none">
        ${lines}
      </svg>

      <div class="rocket-launch-cockpit" style="
        left:${cockpitLeft}%;
        top:${cockpitTop}%
      ">
        <i style="background-image:url('icon/01.png')"></i>
      </div>

      <div class="rocket-fire-v112">
        <i></i><i></i><i></i>
      </div>
    </div>

    <div class="rocket-earth-v112"></div>
    <div class="rocket-speed-lines-v126"></div>
    <div class="rocket-smoke-v126"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="rocket-shock-ring-v126 r1"></div><div class="rocket-shock-ring-v126 r2"></div>
  </div>

  <div id="rocketLaunchHud" class="rocket-launch-hud">
    <span>ALTITUDE</span>
    <b>0.0km</b>
  </div>

  <div id="rocketLaunchCall" class="rocket-launch-call">LIFT OFF!</div>`;

  const world=document.getElementById('rocketSpaceWorld');
  const vehicle=document.getElementById('rocketVehicle');
  const launchHud=document.getElementById('rocketLaunchHud').querySelector('b');
  const launchCall=document.getElementById('rocketLaunchCall');

  launchCall.classList.add('show');
  stage.classList.add('rocket-rumble-v126','rocket-launch-blast-v126');
  world.classList.add('rocket-liftoff-v126');
  setTimeout(()=>stage?.classList.remove('rocket-rumble-v126'),520);
  setTimeout(()=>stage?.classList.remove('rocket-launch-blast-v126'),900);
  beep(330,120,.035);setTimeout(()=>beep(510,140,.04),110);setTimeout(()=>beep(760,150,.045),220);

  const worldH=5600;
  const maxY=160+distance/100*5000;
  const launchStart=performance.now();
  const duration=2500+distance/100*950;

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){resolve();return;}

      const t=clamp(
        (now-launchStart)/duration,
        0,1
      );

      const ease=
        1-Math.pow(1-t,2.35);

      const y=90+ease*(maxY-90);
      const km=distance*ease;

      vehicle.style.bottom=`${y}px`;
      vehicle.style.transform=
        `translateX(-50%) rotate(${Math.sin(t*Math.PI*4)*2.5}deg)`;

      launchHud.textContent=`${km.toFixed(1)}km`;
      vehicle.style.setProperty('--rocket-power',`${.75+distance/100*.75}`);
      const band=km>=75?3:km>=50?2:km>=25?1:0;
      if(stage.dataset.rocketBand!==String(band)){
        stage.dataset.rocketBand=String(band);
        if(band>0){launchCall.textContent=`${band*25}km!`;launchCall.classList.remove('show');void launchCall.offsetWidth;launchCall.classList.add('show');beep(610+band*120,75,.02);}
      }

      const cam=Math.max(
        0,
        y-stage.clientHeight*.43
      );

      world.style.transform=
        `translateY(${cam}px)`;

      stage.classList.toggle(
        'rocket-space-mode',
        km>25
      );

      if(t<1){
        raf=requestAnimationFrame(frame);
      }else{
        resolve();
      }
    };

    raf=requestAnimationFrame(frame);
  });

  if(!isGameRunValid(runId))return;

  launchCall.textContent=
    distance>=99.5
      ? '100km MAX!!'
      : `${distance.toFixed(1)}km`;

  launchCall.classList.remove('show');
  void launchCall.offsetWidth;
  launchCall.classList.add('show');

  beep(
    distance>=95?1080:
    distance>=75?870:
    distance>=50?690:
    480,
    160,.04
  );

  await wait(780);

  if(isGameRunValid(runId)){
    recordScreen(
      50,p,humanIndex,
      `${distance.toFixed(1)}<small>km</small>`,
      `DRAWN ROCKET`
    );
  }
}

// GAME 52 -------------------------------------------------
async function startBossDuel(p,humanIndex,runId){
  gameFit();

  let playerX=0;
  let enemyX=0;
  let playerVX=0;
  let enemyVX=0;
  let moveDir=0;
  let facing=1;

  let enemyHp=20;
  let normalHitCount=0;
  let specialCharges=2;
  let specialBusy=false;

  let startTime=0;
  let last=0;
  let raf=null;
  let finished=false;

  let punchReady=true;
  let playerAttackUntil=0;
  let playerStunUntil=0;

  let enemyBackstepUntil=0;
  let enemyAttackSerial=0;
  let enemyAttackWindowStart=0;
  let enemyAttackWindowEnd=0;
  let nextEnemyAttack=0;
  let nextEnemySpecial=0;

  let clashLockUntil=0;
  let lastPlayerPunchAt=0;
  let closeMashCount=0;
  let enemyLeapUntil=0;
  let enemyLeapStart=0;
  let enemyLeapFromX=0;
  let enemyLeapToX=0;
  let nextEnemyLeap=0;
  let nextEdgeBurst=0;

  screen.innerHTML=`<div class="duel-shell duel-v115">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん番長決戦</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="duel-hud">
      <div><span>TIME</span><b id="duelTime">0.00</b></div>
      <div><span>SPECIAL</span><b id="duelSpecialState">READY ×2</b></div>
    </div>

    <div id="duelStage" class="duel-stage">
      <div class="duel-sky"></div>
      <div class="duel-fence left"></div>
      <div class="duel-fence right"></div>
      <div class="duel-school"></div>
      <div class="duel-floor"></div>

      <div id="duelPlayer" class="duel-player">
        <i style="background-image:url('icon/01.png')"></i>
        <b class="duel-fist"></b>
      </div>

      <div id="duelEnemy" class="duel-enemy">
        <span>他校の番長</span>
        <i style="background-image:url('icon/10.png')"></i>
        <b class="duel-fist"></b>
      </div>

      <div id="duelImpact" class="duel-impact"></div>
      <div id="duelCall" class="duel-call">タイマン勝負！</div>
      <div id="duelClashFx" class="duel-clash-v115">
        <i></i><i></i><b>CLASH!!</b>
      </div>
    </div>

    <div class="duel-controls duel-controls-v115">
      <button id="duelLeft" type="button">←</button>
      <button id="duelPunch" class="punch" type="button">PUNCH</button>
      <button id="duelSpecial" class="special" type="button">必殺 ×2</button>
      <button id="duelRight" type="button">→</button>
    </div>
  </div>`;

  const stage=document.getElementById('duelStage');
  const player=document.getElementById('duelPlayer');
  const enemy=document.getElementById('duelEnemy');
  const timeEl=document.getElementById('duelTime');
  const specialState=document.getElementById('duelSpecialState');
  const impact=document.getElementById('duelImpact');
  const call=document.getElementById('duelCall');
  const clashFx=document.getElementById('duelClashFx');
  const left=document.getElementById('duelLeft');
  const right=document.getElementById('duelRight');
  const punch=document.getElementById('duelPunch');
  const special=document.getElementById('duelSpecial');

  const fieldMin=55;
  const fieldMax=stage.clientWidth-55;
  const minBodyGap=76;

  playerX=stage.clientWidth*.27;
  enemyX=stage.clientWidth*.73;

  function bindHold(btn,dir){
    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();
      if(performance.now()<playerStunUntil)return;
      moveDir=dir;
      facing=dir;
      player.classList.toggle('face-left',dir<0);
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

  function popImpact(text,x){
    impact.textContent=text;
    impact.style.left=`${clamp(x,50,stage.clientWidth-50)}px`;
    impact.classList.remove('show');
    void impact.offsetWidth;
    impact.classList.add('show');
  }

  function showClash(){
    clashFx.classList.remove('show');
    void clashFx.offsetWidth;
    clashFx.classList.add('show');
  }

  function clearEnemyAttack(){
    enemyAttackSerial++;
    enemyAttackWindowStart=0;
    enemyAttackWindowEnd=0;
    enemy.classList.remove('attacking','special-attacking');
  }

  function clash(now){
    if(now<clashLockUntil||finished)return;

    clashLockUntil=now+340;
    clearEnemyAttack();

    const dir=enemyX>=playerX?1:-1;

    playerVX=-dir*520;
    enemyVX=dir*520;
    playerStunUntil=now+250;
    enemyBackstepUntil=now+250;
    nextEnemyAttack=now+650;

    player.classList.remove('hit','special-hit','clash-hit-v115');
    enemy.classList.remove('armor-hit','backstep-v115','clash-hit-v115');
    void player.offsetWidth;
    player.classList.add('clash-hit-v115');
    enemy.classList.add('clash-hit-v115');

    showClash();
    popImpact('同時攻撃！',stage.clientWidth*.50);
    beep(300,95,.035);
  }

  function finishDuel(){
    if(finished)return;
    finished=true;
    clearEnemyAttack();

    const dir=enemyX>=playerX?1:-1;
    enemy.style.setProperty('--duel-finish-dir',dir);
    enemy.classList.remove('armor-hit','backstep-v115');
    void enemy.offsetWidth;
    enemy.classList.add('defeated-horizontal');

    const elapsedMs=Math.max(
      1,
      Math.round(performance.now()-startTime)
    );

    state.records.bossDuel[p.id]=elapsedMs;
    timeEl.textContent=(elapsedMs/1000).toFixed(2);

    call.textContent='決着！！';
    call.classList.remove('show');
    void call.offsetWidth;
    call.classList.add('show');

    beep(1060,160,.045);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          51,p,humanIndex,
          `${(elapsedMs/1000).toFixed(2)}<small>秒</small>`,
          `ROOFTOP DUEL`
        );
      }
    },900);
  }

  function enemyEdgeBurst(now){
    if(finished||now<nextEdgeBurst||now<enemyLeapUntil)return false;
    const nearLeft=enemyX<=fieldMin+36;
    const nearRight=enemyX>=fieldMax-36;
    if(!(nearLeft||nearRight)||Math.abs(enemyX-playerX)>132)return false;
    nextEdgeBurst=now+2200;
    clearEnemyAttack();
    const dir=playerX<enemyX?-1:1;
    enemy.classList.remove('edge-burst-v118','attacking','special-attacking');
    void enemy.offsetWidth;
    enemy.classList.add('edge-burst-v118');
    popImpact('壁際反撃！！',enemyX);
    beep(390,90,.03);
    setTimeout(()=>{
      if(finished||!isGameRunValid(runId)||Math.abs(enemyX-playerX)>155)return;
      playerVX=dir*980;
      playerStunUntil=performance.now()+720;
      enemyVX=nearLeft?360:-360;
      enemyBackstepUntil=performance.now()+260;
      player.classList.remove('hit','special-hit','edge-blown-v118');
      void player.offsetWidth;
      player.classList.add('edge-blown-v118');
      popImpact('BLOW AWAY!!',playerX);
      beep(105,145,.045);
    },115);
    return true;
  }

  function applyEnemyDamage(damage,{specialHit=false}={}){
    if(finished)return;

    enemyHp-=damage;

    if(enemyHp<=0){
      popImpact('FINISH!!',(playerX+enemyX)/2);
      finishDuel();
      return;
    }

    if(specialHit){
      enemyVX=(enemyX>=playerX?1:-1)*210;
      enemyBackstepUntil=performance.now()+180;

      enemy.classList.remove('armor-hit','special-damaged-v115');
      void enemy.offsetWidth;
      enemy.classList.add('special-damaged-v115');

      popImpact('-5',(playerX+enemyX)/2);
      beep(780,85,.028);
      return;
    }

    normalHitCount++;

    if(enemyEdgeBurst(performance.now()))return;

    if(normalHitCount%3===0){
      const dir=enemyX>=playerX?1:-1;

      // Exactly every third normal hit: fast horizontal backstep.
      enemyVX=dir*760;
      enemyBackstepUntil=performance.now()+300;

      enemy.classList.remove('armor-hit','backstep-v115');
      void enemy.offsetWidth;
      enemy.classList.add('backstep-v115');

      popImpact('BACK STEP!',enemyX);
      beep(390,60,.018);

    }else{
      const dir=enemyX>=playerX?1:-1;
      enemyVX=dir*72;
      enemyBackstepUntil=performance.now()+90;

      enemy.classList.remove('armor-hit','normal-stagger-v119');
      void enemy.offsetWidth;
      enemy.classList.add('normal-stagger-v119');

      popImpact('HIT!',(playerX+enemyX)/2);
      beep(300,34,.011);
    }

    // V10.19: normal hits no longer make the rival attack faster.
    // Keep a small breathing window so the fight is less oppressive.
    nextEnemyAttack=Math.max(
      nextEnemyAttack,
      performance.now()+500
    );
  }

  function startLeapBehind(now){
    if(
      finished||
      now<enemyLeapUntil||
      now<enemyBackstepUntil||
      now<clashLockUntil
    )return false;

    const side=
      playerX<stage.clientWidth*.50
        ? 1
        : -1;

    enemyLeapStart=now;
    enemyLeapUntil=now+520;
    enemyLeapFromX=enemyX;
    enemyLeapToX=clamp(
      playerX+side*82,
      fieldMin,
      fieldMax
    );

    nextEnemyLeap=now+rand(1700,2900);
    nextEnemyAttack=enemyLeapUntil+80;
    clearEnemyAttack();

    enemy.classList.remove(
      'attacking',
      'special-attacking',
      'backstep-v115',
      'leap-behind-v116'
    );

    void enemy.offsetWidth;
    enemy.classList.add('leap-behind-v116');

    popImpact('背後へ！',enemyX);
    beep(520,65,.018);
    return true;
  }

  function normalPunch(){
    const now=performance.now();

    if(
      finished||
      !punchReady||
      now<playerStunUntil||
      !isGameRunValid(runId)
    )return;

    punchReady=false;
    playerAttackUntil=now+175;

    const distance=Math.abs(enemyX-playerX);
    const interval=now-lastPlayerPunchAt;
    lastPlayerPunchAt=now;

    if(distance<=88&&interval<=270){
      closeMashCount++;
    }else{
      closeMashCount=1;
    }

    // At point-blank range, repeated mashing makes the rival evade behind you.
    if(
      closeMashCount>=4&&
      now>=nextEnemyLeap&&
      distance<=92
    ){
      closeMashCount=0;

      if(startLeapBehind(now)){
        player.classList.remove('punching');
        void player.offsetWidth;
        player.classList.add('punching');

        popImpact('MISS!',playerX);

        setTimeout(()=>{
          punchReady=true;
        },175);

        return;
      }
    }

    player.classList.remove('punching');
    void player.offsetWidth;
    player.classList.add('punching');

    if(
      distance<=132&&
      now>=enemyAttackWindowStart&&
      now<=enemyAttackWindowEnd
    ){
      clash(now);

    }else if(distance<=132){
      applyEnemyDamage(1);

    }else{
      beep(150,25,.006);
    }

    setTimeout(()=>{
      punchReady=true;
    },175);
  }

  punch.addEventListener('pointerdown',e=>{
    e.preventDefault();
    normalPunch();
  },{passive:false});

  function updateDuelSpecialUI(){
    if(finished)return;

    special.disabled=
      specialBusy||
      specialCharges<=0;

    special.classList.toggle(
      'used',
      specialCharges<=0
    );

    specialState.textContent=
      specialBusy
        ? 'RUSHING...'
        : specialCharges>0
          ? `READY ×${specialCharges}`
          : 'USED';

    special.textContent=
      specialCharges>0
        ? `必殺 ×${specialCharges}`
        : 'USED';
  }

  special.addEventListener('pointerdown',e=>{
    e.preventDefault();

    const now=performance.now();

    if(
      specialCharges<=0||
      specialBusy||
      finished||
      now<playerStunUntil||
      !isGameRunValid(runId)
    )return;

    specialCharges--;
    specialBusy=true;
    updateDuelSpecialUI();
    moveDir=0;

    const dir=enemyX>=playerX?1:-1;
    facing=dir;

    player.classList.remove(
      'special-punch-v115',
      'rush-charge-v119',
      'rush-dash-v119'
    );

    void player.offsetWidth;
    player.classList.add('rush-charge-v119');

    popImpact('SPECIAL CHARGE!!',playerX);
    stage.classList.add('rush-screen-v119');
    beep(360,85,.025);

    const releaseSpecial=()=>{
      setTimeout(()=>{
        if(!isGameRunValid(runId)||finished)return;

        specialBusy=false;
        updateDuelSpecialUI();
      },360);
    };

    setTimeout(()=>{
      if(finished||!isGameRunValid(runId))return;

      player.classList.remove('rush-charge-v119');
      player.classList.add('rush-dash-v119');
      playerAttackUntil=performance.now()+330;
      playerVX=dir*1180;

      const rushTrail=document.createElement('div');
      rushTrail.className='duel-rush-trail-v119';
      rushTrail.style.left=`${playerX}px`;
      rushTrail.style.setProperty('--rush-dir',dir);
      stage.appendChild(rushTrail);
      setTimeout(()=>rushTrail.remove(),480);

      beep(980,95,.04);

      setTimeout(()=>{
        if(finished||!isGameRunValid(runId))return;

        if(Math.abs(enemyX-playerX)<=190){
          clearEnemyAttack();
          applyEnemyDamage(5,{specialHit:true});

          enemyVX=dir*520;
          enemyBackstepUntil=performance.now()+300;
          enemy.classList.add('rush-smashed-v119');

          popImpact('RUSH SMASH!!',(playerX+enemyX)/2);
          stage.classList.remove('rush-screen-v119');
          stage.classList.add('rush-impact-v119');
          beep(1180,145,.05);

          setTimeout(
            ()=>stage.classList.remove('rush-impact-v119'),
            360
          );

        }else{
          popImpact('MISS!',playerX);
          stage.classList.remove('rush-screen-v119');
          beep(170,80,.016);
        }

        releaseSpecial();
      },145);
    },230);
  },{passive:false});

  function enemyNormalAttack(now){
    const serial=++enemyAttackSerial;
    enemyAttackWindowStart=now;
    enemyAttackWindowEnd=now+245;

    enemy.classList.remove('attacking','special-attacking');
    void enemy.offsetWidth;
    enemy.classList.add('attacking');

    setTimeout(()=>{
      if(
        serial!==enemyAttackSerial||
        finished||
        !isGameRunValid(runId)
      )return;

      const t=performance.now();

      if(
        t<=playerAttackUntil+70&&
        Math.abs(enemyX-playerX)<=128
      ){
        clash(t);
        return;
      }

      if(Math.abs(enemyX-playerX)<=104){
        const dir=playerX<enemyX?-1:1;
        playerVX=dir*330;
        playerStunUntil=t+150;

        player.classList.remove('hit');
        void player.offsetWidth;
        player.classList.add('hit');

        popImpact('GUH!',playerX);
        beep(160,55,.018);
      }

      enemyAttackWindowStart=0;
      enemyAttackWindowEnd=0;
      enemy.classList.remove('attacking');
    },130);

    nextEnemyAttack=now+rand(650,980);
  }

  function enemySpecialAttack(now){
    const serial=++enemyAttackSerial;
    enemyAttackWindowStart=now+45;
    enemyAttackWindowEnd=now+340;

    enemy.classList.remove('attacking','special-attacking');
    void enemy.offsetWidth;
    enemy.classList.add('special-attacking');

    popImpact('必殺！！',(playerX+enemyX)/2);
    beep(420,90,.03);

    setTimeout(()=>{
      if(
        serial!==enemyAttackSerial||
        finished||
        !isGameRunValid(runId)
      )return;

      const t=performance.now();

      if(
        t<=playerAttackUntil+90&&
        Math.abs(enemyX-playerX)<=155
      ){
        clash(t);
        return;
      }

      if(Math.abs(enemyX-playerX)<=165){
        const dir=playerX<enemyX?-1:1;
        playerVX=dir*720;
        playerStunUntil=t+620;

        player.classList.remove('hit','special-hit');
        void player.offsetWidth;
        player.classList.add('special-hit');

        popImpact('BLOW AWAY!!',playerX);
        beep(120,125,.04);
      }

      enemyAttackWindowStart=0;
      enemyAttackWindowEnd=0;
      enemy.classList.remove('special-attacking');
    },220);

    nextEnemyAttack=now+rand(1150,1650);
    nextEnemySpecial=now+rand(2500,4100);
  }

  function enemyAI(now){
    if(
      finished||
      now<enemyBackstepUntil||
      now<nextEnemyAttack
    )return;

    const distance=Math.abs(enemyX-playerX);

    if(
      now>=nextEnemySpecial&&
      distance<=170&&
      Math.random()<.23
    ){
      enemySpecialAttack(now);
      return;
    }

    if(distance<=95){
      enemyNormalAttack(now);
    }
  }

  function resolveBodySeparation(){
    if(nowDuringLeap())return;

    const dx=enemyX-playerX;
    const dist=Math.abs(dx);

    if(dist>=minBodyGap)return;

    const dir=
      dist<.001
        ? (facing>0?1:-1)
        : Math.sign(dx);

    const overlap=minBodyGap-dist;

    playerX=clamp(
      playerX-dir*overlap*.52,
      fieldMin,
      fieldMax
    );

    enemyX=clamp(
      enemyX+dir*overlap*.52,
      fieldMin,
      fieldMax
    );

    // If one side is already against the boundary, force the other body away.
    if(Math.abs(enemyX-playerX)<minBodyGap){
      if(dir>0){
        enemyX=clamp(
          playerX+minBodyGap,
          fieldMin,
          fieldMax
        );

        if(Math.abs(enemyX-playerX)<minBodyGap){
          playerX=clamp(
            enemyX-minBodyGap,
            fieldMin,
            fieldMax
          );
        }
      }else{
        enemyX=clamp(
          playerX-minBodyGap,
          fieldMin,
          fieldMax
        );

        if(Math.abs(enemyX-playerX)<minBodyGap){
          playerX=clamp(
            enemyX+minBodyGap,
            fieldMin,
            fieldMax
          );
        }
      }
    }
  }

  function nowDuringLeap(){
    return performance.now()<enemyLeapUntil;
  }

  if(!(await countdown('BANCHOU DUEL',runId)))return;

  startTime=performance.now();
  last=startTime;
  nextEnemyAttack=startTime+620;
  nextEnemySpecial=startTime+rand(1700,3000);
  nextEnemyLeap=startTime+rand(1250,1900);
  call.classList.add('show');

  function frame(now){
    if(!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    if(!finished){
      timeEl.textContent=((now-startTime)/1000).toFixed(2);
    }

    playerVX*=Math.pow(.045,dt);
    enemyVX*=Math.pow(.035,dt);

    const control=
      now<playerStunUntil
        ? 0
        : moveDir*250;

    playerX=clamp(
      playerX+(control+playerVX)*dt,
      fieldMin,
      fieldMax
    );

    if(now<enemyLeapUntil){
      const t=clamp(
        (now-enemyLeapStart)/
        Math.max(1,enemyLeapUntil-enemyLeapStart),
        0,1
      );

      const e=t<.5
        ? 2*t*t
        : 1-Math.pow(-2*t+2,2)/2;

      enemyX=
        enemyLeapFromX+
        (enemyLeapToX-enemyLeapFromX)*e;

      const jumpY=Math.sin(t*Math.PI)*108;

      enemy.style.left=`${enemyX}px`;
      enemy.style.transform=
        `translateX(-50%) translateY(${-jumpY}px) rotate(${(enemyLeapToX>=enemyLeapFromX?1:-1)*Math.sin(t*Math.PI)*16}deg)`;

      if(t>=.98){
        enemy.style.transform='';
      }

    }else{
      enemy.style.transform='';

      enemyX=clamp(
        enemyX+enemyVX*dt,
        fieldMin,
        fieldMax
      );

      if(
        !finished&&
        now>=enemyBackstepUntil&&
        Math.abs(enemyVX)<12
      ){
        const dx=playerX-enemyX;
        const dir=Math.sign(dx)||1;
        const distance=Math.abs(dx);

        if(
          now>=nextEnemyLeap&&
          distance<=108&&
          Math.random()<dt*.55
        ){
          startLeapBehind(now);

        }else{
          if(distance>70){
            const speed=distance>185?230:188;
            enemyX=clamp(
              enemyX+dir*speed*dt,
              fieldMin,
              fieldMax
            );
          }

          enemyAI(now);
        }
      }

      enemy.style.left=`${enemyX}px`;
    }

    if(now>=enemyLeapUntil){
      resolveBodySeparation();
      enemy.style.left=`${enemyX}px`;
    }

    player.style.left=`${playerX}px`;

    enemy.classList.toggle(
      'face-left',
      playerX<enemyX
    );

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 53 -------------------------------------------------
async function startPlushCatcher(p,humanIndex,runId){
  gameFit();

  let attempt=0;
  let catches=0;
  let totalUsedMs=0;
  let phase='idle';
  let craneX=.50;
  let craneY=24;
  let moveDir=0;
  let raf=null;
  let attemptStart=0;
  let currentPlushX=.60;
  let gaugeStart=0;
  let gaugePhase=0;
  let gaugePos=.5;
  let armCatchWidth=.050;
  let armAngle=24;

  screen.innerHTML=`<div class="plush-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはぬいぐるみが好き</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="plush-hud">
      <div><span>TRY</span><b id="plushTry">1 / 3</b></div>
      <div><span>GET</span><b id="plushGet">0</b></div>
      <div><span>TIME</span><b id="plushTime">0.0</b></div>
    </div>

    <div class="plush-cabinet">
      <div class="plush-marquee">GIANT MOB PLUSH</div>

      <div id="plushStage" class="plush-stage">
        <div class="plush-back-logo">MOB</div>
        <div class="plush-floor"></div>
        <div class="plush-chute">PRIZE</div>

        <div id="plushPrize" class="giant-plush-v112" style="background-image:url('icon/01.png')"></div>

        <div id="plushCrane" class="plush-crane">
          <div class="plush-trolley"></div>
          <div id="plushCable" class="plush-cable"></div>
          <div id="plushHead" class="plush-head">
            <i class="arm left"></i>
            <i class="arm right"></i>
          </div>
        </div>

        <div id="plushGauge" class="plush-grab-gauge-v114" hidden>
          <span>ARM WIDTH</span>
          <div class="plush-width-labels-v114"><b>NARROW</b><b>WIDE</b></div>
          <div class="plush-gauge-track-v114">
            <b id="plushGaugeMarker" class="marker"></b>
          </div>
          <em>先にアームの広さを決める</em>
        </div>

        <div id="plushMessage" class="plush-message">巨大ぬいぐるみを狙え！</div>
      </div>
    </div>

    <div class="plush-controls">
      <button id="plushLeft" type="button">◀</button>
      <button id="plushDrop" class="drop" type="button">降下</button>
      <button id="plushStop" class="stop" type="button" disabled>STOP</button>
      <button id="plushRight" type="button">▶</button>
    </div>
  </div>`;

  const stage=document.getElementById('plushStage');
  const crane=document.getElementById('plushCrane');
  const cable=document.getElementById('plushCable');
  const head=document.getElementById('plushHead');
  const prize=document.getElementById('plushPrize');
  const message=document.getElementById('plushMessage');
  const gauge=document.getElementById('plushGauge');
  const gaugeMarker=document.getElementById('plushGaugeMarker');
  const tryEl=document.getElementById('plushTry');
  const getEl=document.getElementById('plushGet');
  const timeEl=document.getElementById('plushTime');
  const left=document.getElementById('plushLeft');
  const right=document.getElementById('plushRight');
  const drop=document.getElementById('plushDrop');
  const stop=document.getElementById('plushStop');

  function renderCrane(){
    crane.style.left=`${craneX*100}%`;
    cable.style.height=`${craneY}px`;
    head.style.top=`${craneY}px`;
  }

  function setMove(btn,dir){
    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();

      if(phase!=='position')return;

      moveDir=dir;

      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    },{passive:false});

    const end=()=>{
      if(moveDir===dir)moveDir=0;
    };

    btn.addEventListener('pointerup',end);
    btn.addEventListener('pointercancel',end);
    btn.addEventListener('lostpointercapture',end);
  }

  setMove(left,-1);
  setMove(right,1);

  function resetAttempt(){
    attempt++;
    phase='width';
    craneX=.50;
    craneY=24;
    moveDir=0;

    gaugeStart=performance.now();
    gaugePhase=rand(0,Math.PI*2);
    gaugePos=.5;
    armCatchWidth=.050;
    armAngle=24;

    currentPlushX=rand(.34,.80);

    prize.style.left=`${currentPlushX*100}%`;
    prize.style.top='82%';
    prize.className='giant-plush-v112';

    crane.classList.remove('holding');
    head.classList.remove('closed');

    gauge.hidden=false;
    gaugeMarker.style.left='50%';
    head.style.setProperty('--plush-left-angle','24deg');
    head.style.setProperty('--plush-right-angle','-24deg');

    tryEl.textContent=`${attempt} / 3`;
    message.textContent='① 先にアームの広さを決めろ！';

    drop.textContent='降下';
    drop.disabled=true;

    stop.textContent='幅STOP';
    stop.disabled=false;

    left.disabled=true;
    right.disabled=true;

    attemptStart=performance.now();

    renderCrane();
  }

  async function resolveAttempt(){
    if(phase!=='descending')return;

    phase='judging';
    moveDir=0;

    drop.disabled=true;
    stop.disabled=true;
    left.disabled=true;
    right.disabled=true;

    const used=performance.now()-attemptStart;
    totalUsedMs+=used;
    attemptStart=0;

    const stageH=stage.clientHeight;
    const clawY=(craneY+72)/stageH;

    const dx=Math.abs(craneX-currentPlushX);
    const depthError=Math.abs(clawY-.82);

    // ARM WIDTH was already chosen before descent.
    // Descent STOP now judges height only, exactly like the original flow.
    const gripQuality=clamp(
      1-Math.abs(gaugePos-.70)/.56,
      0,1
    );

    const heightWindow=.040+gripQuality*.027;

    const success=
      gripQuality>=.34&&
      dx<=armCatchWidth&&
      depthError<=heightWindow;

    gauge.hidden=true;

    head.classList.add('closed');

    if(success){
      message.textContent='つかんだ！ 持ち上げろ…';

      prize.classList.add('caught');
      crane.classList.add('holding');

      const alignQuality=clamp(
        1-dx/Math.max(.001,armCatchWidth),
        0,1
      );

      const depthQuality=clamp(
        1-depthError/Math.max(.001,heightWindow),
        0,1
      );

      // Even after the arms close, an unstable grab can slip.
      // A nearly perfect grab is very reliable, but never literally 100%.
      const holdChance=clamp(
        .14+
        gripQuality*.30+
        alignQuality*.24+
        depthQuality*.18,
        .14,.86
      );

      const willHold=Math.random()<holdChance;

      beep(900,90,.03);

      const liftStart=performance.now();
      const startY=craneY;

      await new Promise(resolve=>{
        const frame=now=>{
          if(!isGameRunValid(runId)){resolve();return;}

          const t=clamp(
            (now-liftStart)/620,
            0,1
          );

          const e=1-Math.pow(1-t,3);
          craneY=startY+(34-startY)*e;
          renderCrane();

          prize.style.left=`${craneX*100}%`;
          prize.style.top=`${clamp((craneY+76)/stageH*100,12,76)}%`;

          if(t<1){
            requestAnimationFrame(frame);
          }else{
            resolve();
          }
        };

        requestAnimationFrame(frame);
      });

      if(!willHold){
        crane.classList.remove('holding');
        head.classList.remove('closed');
        prize.classList.remove('caught');
        prize.classList.add('slipped-v116');

        message.textContent=
          `つかんだ…が落ちた！ HOLD ${Math.round(holdChance*100)}%`;

        beep(155,130,.03);

        await wait(560);

      }else{
        message.textContent='HOLD！ PRIZEへ運べ！';

        const backStart=performance.now();
        const startX=craneX;

      await new Promise(resolve=>{
        const frame=now=>{
          if(!isGameRunValid(runId)){resolve();return;}

          const t=clamp(
            (now-backStart)/620,
            0,1
          );

          const e=1-Math.pow(1-t,3);
          craneX=startX+(.14-startX)*e;

          renderCrane();
          prize.style.left=`${craneX*100}%`;

          if(t<1){
            requestAnimationFrame(frame);
          }else{
            resolve();
          }
        };

        requestAnimationFrame(frame);
      });

        prize.classList.add('released');

        catches++;
        getEl.textContent=catches;
        message.textContent='GET!!';

        beep(980,90,.03);
        await wait(280);
      }

    }else{
      message.textContent='MISS…';
      prize.classList.add('miss');
      beep(190,100,.022);
      await wait(520);
    }

    if(!isGameRunValid(runId))return;

    if(attempt>=3){
      finishGameResult();
    }else{
      resetAttempt();
    }
  }

  drop.addEventListener('pointerdown',e=>{
    if(phase!=='position')return;

    e.preventDefault();

    phase='descending';
    moveDir=0;

    drop.disabled=true;
    stop.disabled=false;
    stop.textContent='高さSTOP';
    left.disabled=true;
    right.disabled=true;

    message.textContent='③ STOPでつかむ高さだけを決めろ！';
  },{passive:false});

  stop.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(phase==='width'){
      // Left side = narrow, right side = wide.
      // Too narrow cannot fit the giant plush; too wide loses grip.
      // The best zone is around 65〜75%.
      const gripQuality=clamp(
        1-Math.abs(gaugePos-.70)/.56,
        0,1
      );

      armCatchWidth=.018+gripQuality*.038;
      armAngle=12+gaugePos*34;

      head.style.setProperty(
        '--plush-left-angle',
        `${armAngle.toFixed(1)}deg`
      );
      head.style.setProperty(
        '--plush-right-angle',
        `${(-armAngle).toFixed(1)}deg`
      );

      phase='position';
      gauge.hidden=true;

      stop.disabled=true;
      stop.textContent='STOP';

      drop.disabled=false;
      left.disabled=false;
      right.disabled=false;

      message.textContent=
        `② アーム幅 ${Math.round(gaugePos*100)}% / 位置を合わせて降下`;

      beep(
        gaugePos>=.80?900:
        gaugePos>=.55?720:
        520,
        55,.016
      );

      return;
    }

    if(phase==='descending'){
      resolveAttempt();
    }
  },{passive:false});

  function finishGameResult(){
    phase='finished';

    const totalSec=totalUsedMs/1000;

    let score=0;

    if(catches===3){
      score=100;

    }else if(catches===2){
      const bonus=Math.round(
        clamp(
          (30-totalSec)/30,
          0,1
        )*15
      );

      score=80+bonus;

    }else if(catches===1){
      const bonus=Math.round(
        clamp(
          (30-totalSec)/30,
          0,1
        )*20
      );

      score=50+bonus;
    }

    state.records.plushCatcher[p.id]=score;

    message.textContent=
      `${catches}/3 GET　${score} POINT`;

    beep(
      score===100?1080:
      score>=80?860:
      score>=50?650:
      360,
      150,.04
    );

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          52,p,humanIndex,
          `${score}<small>pt</small>`,
          `${catches} / 3 GET　${totalSec.toFixed(1)}秒`
        );
      }
    },850);
  }

  if(!(await countdown('GIANT CATCHER',runId)))return;

  resetAttempt();

  let last=performance.now();

  function frame(now){
    if(!isGameRunValid(runId)||phase==='finished')return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    if(phase==='width'){
      const gaugeSpeed=.90+attempt*.12;

      gaugePos=
        .5+
        .5*Math.sin(
          (now-gaugeStart)/1000*
          gaugeSpeed*
          Math.PI*2+
          gaugePhase
        );

      gaugeMarker.style.left=`${gaugePos*100}%`;

      // Preview the actual arm opening while choosing width.
      const previewAngle=12+gaugePos*34;
      head.style.setProperty(
        '--plush-left-angle',
        `${previewAngle.toFixed(1)}deg`
      );
      head.style.setProperty(
        '--plush-right-angle',
        `${(-previewAngle).toFixed(1)}deg`
      );

    }else if(phase==='position'){
      craneX=clamp(
        craneX+moveDir*.38*dt,
        .11,.91
      );

      renderCrane();

    }else if(phase==='descending'){
      craneY+=190*dt;

      if(craneY>=stage.clientHeight*.72){
        craneY=stage.clientHeight*.72;
        renderCrane();
        resolveAttempt();
      }else{
        renderCrane();
      }
    }

    if(attemptStart){
      timeEl.textContent=
        ((totalUsedMs+
        Math.max(0,performance.now()-attemptStart))/1000)
        .toFixed(1);
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



// GAME 54 -------------------------------------------------
async function startToyOnOff(p,humanIndex,runId){
  gameFit();

  let finished=false;
  let remaining=5;
  let startTime=0;
  let raf=null;

  screen.innerHTML=`<div class="toy-switch-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんおもちゃON or OFF</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="toy-switch-hud">
      <div><span>TIME</span><b id="toySwitchTime">0.00</b></div>
      <div><span>OFF</span><b id="toySwitchRemain">5</b></div>
    </div>

    <div id="toySwitchStage" class="toy-switch-stage">
      <div class="toy-switch-sign">OFFを全部ONにしろ！</div>
      <div id="toySwitchBoard" class="toy-switch-board"></div>
    </div>
  </div>`;

  const board=document.getElementById('toySwitchBoard');
  const timeEl=document.getElementById('toySwitchTime');
  const remainEl=document.getElementById('toySwitchRemain');

  const cells=shuffle(
    Array.from({length:30},(_,i)=>i)
  );

  const offSet=new Set(
    shuffle(cells).slice(0,5)
  );

  board.innerHTML=cells.map((cell,index)=>{
    const row=Math.floor(cell/5);
    const col=cell%5;
    const off=offSet.has(cell);

    const x=
      8+
      col*21+
      rand(-2.2,2.2);

    const y=
      8+
      row*15.5+
      rand(-1.8,1.8);

    return `<button
      type="button"
      class="toy-switch-item ${off?'off':'on'}"
      data-off="${off?1:0}"
      style="left:${x}%;top:${y}%"
      aria-label="${off?'OFF':'ON'}">
      <img
        src="${off?'play/002.png':'play/001.png'}"
        draggable="false"
        alt="${off?'OFF':'ON'}">
    </button>`;
  }).join('');

  if(!(await countdown('ON or OFF',runId)))return;

  startTime=performance.now();

  function finish(){
    if(finished)return;
    finished=true;

    const ms=Math.max(
      1,
      Math.round(performance.now()-startTime)
    );

    state.records.toyOnOff[p.id]=ms;
    timeEl.textContent=(ms/1000).toFixed(2);

    board.classList.add('all-on');
    beep(1050,150,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          53,p,humanIndex,
          `${(ms/1000).toFixed(2)}<small>秒</small>`,
          `30 / 30 ON`
        );
      }
    },600);
  }

  board.addEventListener('pointerdown',e=>{
    const item=e.target.closest('.toy-switch-item');
    if(
      !item||
      finished||
      item.dataset.off!=='1'
    )return;

    e.preventDefault();

    item.dataset.off='0';
    item.classList.remove('off');
    item.classList.add('on','turned-on');

    const img=item.querySelector('img');
    img.src='play/001.png';
    img.alt='ON';

    remaining--;
    remainEl.textContent=remaining;

    beep(680+(5-remaining)*45,35,.012);

    if(remaining<=0){
      finish();
    }
  },{passive:false});

  function frame(now){
    if(finished||!isGameRunValid(runId))return;
    timeEl.textContent=((now-startTime)/1000).toFixed(2);
    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 55 -------------------------------------------------
async function startDodgeballMob(p,humanIndex,runId){
  gameFit();

  const GAME_MS=10000;
  const RELOAD_MS=1000;

  let kills=0;
  let wave=0;
  let reloadingUntil=0;
  let startTime=0;
  let last=0;
  let raf=null;
  let finished=false;
  let gameStarted=false;

  const enemies=[];
  const balls=[];

  screen.innerHTML=`<div class="dodge-shell dodge-v117">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんドッジボール</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="dodge-hud dodge-hud-v117">
      <div><span>TIME</span><b id="dodgeTime">10.00</b></div>
      <div><span>KO</span><b id="dodgeKills">0</b></div>
      <div><span>RELOAD</span><b id="dodgeReload">READY</b></div>
    </div>

    <div id="dodgeStage" class="dodge-stage dodge-stage-v117">
      <div class="dodge-court">
        <i></i><i></i>
      </div>

      <div id="dodgePlayer" class="dodge-player dodge-player-v117">
        <img src="play/003.png" draggable="false" alt="player">
      </div>

      <div id="dodgeEnemies" class="dodge-enemy-layer-v117"></div>
      <div id="dodgeBalls" class="dodge-ball-layer-v117"></div>

      <div class="dodge-shot-line-v117"></div>

      <div id="dodgeWave" class="dodge-wave-v117">WAVE 1</div>
      <div id="dodgeMessage" class="dodge-message dodge-message-v117">中央ラインに来た敵を狙え！</div>
    </div>

    <button id="dodgeFire" class="dodge-fire-v117" type="button">THROW!</button>
  </div>`;

  const stage=document.getElementById('dodgeStage');
  const enemyLayer=document.getElementById('dodgeEnemies');
  const ballLayer=document.getElementById('dodgeBalls');
  const timeEl=document.getElementById('dodgeTime');
  const killsEl=document.getElementById('dodgeKills');
  const reloadEl=document.getElementById('dodgeReload');
  const waveEl=document.getElementById('dodgeWave');
  const message=document.getElementById('dodgeMessage');
  const fire=document.getElementById('dodgeFire');

  const w=stage.clientWidth;
  const h=stage.clientHeight;
  const shotY=h*.55;
  const playerX=w*.14;

  function spawnWave(){
    wave++;
    waveEl.textContent=`WAVE ${wave}`;
    waveEl.classList.remove('show');
    void waveEl.offsetWidth;
    waveEl.classList.add('show');

    const xFractions=shuffle([.55,.64,.73,.82,.90]);

    for(let i=0;i<5;i++){
      const el=document.createElement('div');
      el.className='dodge-target-v117';
      el.innerHTML=`
        <img src="play/003.png" draggable="false" alt="rival">
        <b>${wave}-${i+1}</b>
      `;

      enemyLayer.appendChild(el);

      const amp=rand(52,Math.max(68,h*.20));
      const speed=rand(.72,1.32);
      const phase=Math.random()*Math.PI*2;

      const enemy={
        el,
        x:w*xFractions[i],
        y:shotY,
        amp,
        speed,
        phase,
        dead:false
      };

      enemies.push(enemy);
    }
  }

  function activeEnemies(){
    return enemies.filter(e=>!e.dead);
  }

  function throwBall(){
    const now=performance.now();

    if(
      finished||
      !gameStarted||
      now<reloadingUntil||
      !isGameRunValid(runId)
    )return;

    reloadingUntil=now+RELOAD_MS;
    fire.disabled=true;
    reloadEl.textContent='1.00';

    const el=document.createElement('div');
    el.className='dodge-live-ball-v117';
    el.innerHTML=`<img src="icon/001.png" draggable="false" alt="ball">`;
    ballLayer.appendChild(el);

    balls.push({
      el,
      x:playerX+30,
      y:shotY,
      alive:true
    });

    message.textContent='THROW!!';
    beep(760,48,.016);
  }

  fire.addEventListener('pointerdown',e=>{
    e.preventDefault();
    throwBall();
  },{passive:false});

  stage.addEventListener('pointerdown',e=>{
    if(e.target.closest('.dodge-message-v117'))return;
    e.preventDefault();
    throwBall();
  },{passive:false});

  function hitEnemy(enemy,ball){
    if(enemy.dead||!ball.alive)return;

    enemy.dead=true;
    ball.alive=false;
    ball.el.remove();

    kills++;
    killsEl.textContent=kills;

    enemy.el.classList.add('hit-fly-v117');
    message.textContent=`HIT! ${kills} KO`;
    beep(980,75,.026);

    setTimeout(()=>enemy.el.remove(),650);

    if(activeEnemies().length===0){
      setTimeout(()=>{
        if(!finished&&isGameRunValid(runId)){
          spawnWave();
        }
      },230);
    }
  }

  if(!(await countdown('DODGEBALL',runId)))return;

  // Prevent the pointer that closed a previous screen / countdown from becoming a throw.
  await wait(240);
  if(!isGameRunValid(runId))return;
  gameStarted=true;
  startTime=performance.now();
  last=startTime;
  spawnWave();

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    const elapsed=now-startTime;
    const rem=GAME_MS-elapsed;

    if(rem<=0){
      finished=true;
      timeEl.textContent='0.00';

      state.records.dodgeballMob[p.id]=kills;

      message.textContent=`TIME UP！ ${kills} KO`;
      beep(kills>=10?1080:kills>=6?820:580,150,.04);

      setTimeout(()=>{
        if(isGameRunValid(runId)){
          recordScreen(
            54,p,humanIndex,
            `${kills}<small>体</small>`,
            `${wave} WAVE`
          );
        }
      },650);
      return;
    }

    timeEl.textContent=(rem/1000).toFixed(2);

    const reloadRem=Math.max(0,reloadingUntil-now);
    if(reloadRem<=0){
      reloadEl.textContent='READY';
      fire.disabled=false;
    }else{
      reloadEl.textContent=(reloadRem/1000).toFixed(2);
    }

    for(const enemy of activeEnemies()){
      const t=elapsed/1000;
      enemy.y=
        shotY+
        Math.sin(
          t*enemy.speed*Math.PI*2+
          enemy.phase
        )*
        enemy.amp;

      enemy.el.style.left=`${enemy.x}px`;
      enemy.el.style.top=`${enemy.y}px`;
    }

    for(const ball of balls){
      if(!ball.alive)continue;

      ball.x+=620*dt;
      ball.el.style.left=`${ball.x}px`;
      ball.el.style.top=`${ball.y}px`;

      let hit=null;

      for(const enemy of activeEnemies()){
        if(
          Math.abs(ball.x-enemy.x)<=22&&
          Math.abs(ball.y-enemy.y)<=31
        ){
          hit=enemy;
          break;
        }
      }

      if(hit){
        hitEnemy(hit,ball);
      }else if(ball.x>w+35){
        ball.alive=false;
        ball.el.remove();
      }
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 56 -------------------------------------------------
async function startAmidakujiMob(p,humanIndex,runId){
  gameFit();
  const lanes=6,worldH=1120,topY=95,bottomY=1030,goalValues=shuffle([0,15,30,50,75,100]);
  const rows=[];for(let i=0;i<13;i++){let pair=randi(0,lanes-2);if(rows.length&&rows[rows.length-1].pair===pair)pair=(pair+1+randi(0,2))%(lanes-1);rows.push({y:topY+80+i*64,pair});}
  let selected=false,raf=null;
  screen.innerHTML=`<div class="amida-shell amida-v126"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんのあみだくじ</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div id="amidaViewport" class="amida-viewport amida-viewport-v126"><div id="amidaWorld" class="amida-world" style="height:${worldH}px"><div class="amida-light-v126"></div>
      <svg id="amidaSvg" class="amida-svg" viewBox="0 0 600 ${worldH}" preserveAspectRatio="none"></svg>
      <svg class="amida-trace-svg-v126" viewBox="0 0 600 ${worldH}" preserveAspectRatio="none"><polyline id="amidaTrace" points=""></polyline></svg>
      <div id="amidaMob" class="amida-mob amida-mob-v126" style="background-image:url('icon/01.png')"></div>
      <div class="amida-goals amida-goals-v126">${goalValues.map((v,i)=>`<b data-goal="${i}" style="left:${(i+.5)/lanes*100}%"><i>${v}</i><span>pt</span></b>`).join('')}</div>
    </div><div id="amidaHint" class="amida-hint amida-hint-v126">GOALをチェック…</div>
    <div id="amidaEntrances" class="amida-entrances amida-entrances-v126" hidden>${Array.from({length:lanes},(_,i)=>`<button type="button" data-amida="${i}"><span>${i+1}</span></button>`).join('')}</div></div></div>`;
  const viewport=document.getElementById('amidaViewport'),world=document.getElementById('amidaWorld'),svg=document.getElementById('amidaSvg'),trace=document.getElementById('amidaTrace'),mob=document.getElementById('amidaMob'),entrances=document.getElementById('amidaEntrances'),hint=document.getElementById('amidaHint');
  const xForLane=lane=>(lane+.5)/lanes*600;let markup='';
  for(let lane=0;lane<lanes;lane++){const x=xForLane(lane);markup+=`<line x1="${x}" y1="${topY}" x2="${x}" y2="${bottomY}" class="amida-vertical"/>`;}
  rows.forEach(row=>{markup+=`<line x1="${xForLane(row.pair)}" y1="${row.y}" x2="${xForLane(row.pair+1)}" y2="${row.y}" class="amida-horizontal"/>`;markup+=`<circle cx="${(xForLane(row.pair)+xForLane(row.pair+1))/2}" cy="${row.y}" r="5" class="amida-node-v126"/>`;});
  svg.innerHTML=markup;
  const maxScroll=Math.max(0,worldH-viewport.clientHeight);world.style.transform=`translateY(${-maxScroll}px)`;viewport.classList.add("goal-preview-v126");beep(540,70,.018);
  await wait(1000);if(!isGameRunValid(runId))return;
  await new Promise(resolve=>{const st=performance.now(),duration=1450;const f=now=>{if(!isGameRunValid(runId)){resolve();return;}const t=clamp((now-st)/duration,0,1),e=1-Math.pow(1-t,3);world.style.transform=`translateY(${-maxScroll*(1-e)}px)`;if(t<1)raf=requestAnimationFrame(f);else resolve();};raf=requestAnimationFrame(f);});
  if(!isGameRunValid(runId))return;viewport.classList.remove("goal-preview-v126");hint.textContent='入口を1つ選べ！';entrances.hidden=false;entrances.classList.add("show-v126");

  function buildPath(startLane){let lane=startLane;const points=[{x:xForLane(lane),y:topY}];rows.forEach(row=>{points.push({x:xForLane(lane),y:row.y});if(row.pair===lane){lane++;points.push({x:xForLane(lane),y:row.y});}else if(row.pair+1===lane){lane--;points.push({x:xForLane(lane),y:row.y});}});points.push({x:xForLane(lane),y:bottomY});return{points,finalLane:lane};}
  async function animatePath(path){
    mob.hidden=false;const traced=[path.points[0]];trace.setAttribute("points",`${path.points[0].x},${path.points[0].y}`);
    for(let i=1;i<path.points.length;i++){if(!isGameRunValid(runId))return;const a=path.points[i-1],b=path.points[i],dist=Math.hypot(b.x-a.x,b.y-a.y),duration=clamp(dist*2.45,150,470),st=performance.now();
      await new Promise(resolve=>{const f=now=>{if(!isGameRunValid(runId)){resolve();return;}const t=clamp((now-st)/duration,0,1),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,x=a.x+(b.x-a.x)*e,y=a.y+(b.y-a.y)*e;mob.style.left=`${x/600*100}%`;mob.style.top=`${y}px`;trace.setAttribute("points",[...traced,{x,y}].map(q=>`${q.x},${q.y}`).join(" "));world.style.transform=`translateY(${-clamp(y-viewport.clientHeight*.42,0,maxScroll)}px)`;if(t<1)raf=requestAnimationFrame(f);else resolve();};raf=requestAnimationFrame(f);});
      traced.push(b);if(Math.abs(b.x-a.x)>20)beep(640,34,.012);
    }
  }
  entrances.addEventListener('pointerdown',async e=>{const btn=e.target.closest('[data-amida]');if(!btn||selected||!isGameRunValid(runId))return;e.preventDefault();selected=true;entrances.querySelectorAll("button").forEach(b=>b.disabled=true);btn.classList.add("selected-v126");const startLane=Number(btn.dataset.amida),path=buildPath(startLane);mob.style.left=`${xForLane(startLane)/600*100}%`;mob.style.top=`${topY}px`;hint.textContent=`${startLane+1}番 START!`;beep(720,80,.025);await wait(350);entrances.hidden=true;await animatePath(path);if(!isGameRunValid(runId))return;const score=goalValues[path.finalLane];state.records.amidakujiMob[p.id]=score;document.querySelector(`[data-goal="${path.finalLane}"]`)?.classList.add("goal-hit-v126");viewport.classList.add("amida-goal-burst-v126");hint.textContent=score===100?'100 POINT JACKPOT!!':`GOAL ${score} POINT！`;beep(score===100?1180:score>=75?1020:score>=50?820:score>=15?600:320,180,.05);await wait(950);if(isGameRunValid(runId))recordScreen(55,p,humanIndex,`${score}<small>pt</small>`,`${startLane+1}番 → GOAL`);},{passive:false});
}


// GAME 57 -------------------------------------------------
function scoreKatanaDrawing(strokes,w,h,anchorX,anchorY){
  const valid=strokes.filter(s=>s.length>=2);
  const points=valid.flat();

  if(points.length<4)return 1;

  const minX=Math.min(...points.map(p=>p.x));
  const maxX=Math.max(...points.map(p=>p.x));
  const minY=Math.min(...points.map(p=>p.y));
  const maxY=Math.max(...points.map(p=>p.y));

  const bladeHeight=Math.max(1,anchorY-minY);
  const heightScore=clamp(
    bladeHeight/(h*.68),
    0,1
  );

  let minAnchorDist=Infinity;

  points.forEach(pt=>{
    minAnchorDist=Math.min(
      minAnchorDist,
      Math.hypot(pt.x-anchorX,pt.y-anchorY)
    );
  });

  const connectScore=clamp(
    1-minAnchorDist/82,
    0,1
  );

  const longest=valid
    .map(st=>({
      stroke:st,
      stat:drawingStrokeStats(st)
    }))
    .sort((a,b)=>b.stat.len-a.stat.len)[0];

  const first=longest.stroke[0];
  const last=longest.stroke[longest.stroke.length-1];

  const smoothScore=clamp(
    Math.hypot(
      last.x-first.x,
      last.y-first.y
    )/
    Math.max(1,longest.stat.len),
    .18,1
  );

  const totalTurn=valid.reduce(
    (sum,st)=>sum+drawingStrokeStats(st).turn,
    0
  );

  // A little curve/detail looks stylish; scribbling does not.
  const styleScore=clamp(
    1-Math.abs(totalTurn/(Math.PI*2.3)-.55),
    .18,1
  );

  const countScore=clamp(
    1-Math.abs(valid.length-2)/5,
    .35,1
  );

  const centerDrift=Math.abs(
    (minX+maxX)/2-anchorX
  );

  const centeredScore=clamp(
    1-centerDrift/(w*.32),
    0,1
  );

  const raw=
    8+
    heightScore*38+
    connectScore*25+
    smoothScore*14+
    centeredScore*10+
    styleScore*7+
    countScore*6;

  return clamp(
    Math.round(raw),
    1,100
  );
}

async function startKatanaSmith(p,humanIndex,runId){
  gameFit();

  let drawingOpen=false;
  let drawing=false;
  let pointerId=null;
  let current=null;
  let raf=null;

  const strokes=[];

  screen.innerHTML=`<div class="katana-shell katana-v117">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは刀鍛冶</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="katana-hud">
      <div><span>DRAW</span><b id="katanaTime">7.0</b></div>
      <div><span>BLADE</span><b id="katanaStroke">0</b></div>
    </div>

    <div id="katanaStage" class="katana-stage katana-stage-v117">
      <div class="katana-forge-bg">
        <i class="forge-fire f1"></i>
        <i class="forge-fire f2"></i>
        <div class="forge-anvil"></div>
      </div>

      <div id="katanaFixedHilt" class="katana-fixed-hilt-v117">
        <i class="katana-pommel-v117"></i>
        <i class="katana-handle-v117"></i>
        <i class="katana-guard-v117"></i>
        <b class="katana-anchor-v117"></b>
      </div>

      <div class="katana-blade-zone-v117">
        <span>刀身だけ自由に描く</span>
        <small>ここから上へ ↑</small>
      </div>

      <svg id="katanaSvg" class="katana-svg"></svg>

      <div id="katanaCall" class="katana-call">縦にカッコイイ刀身を描け！</div>
      <div id="katanaScore" class="katana-score"></div>
    </div>
  </div>`;

  const stage=document.getElementById('katanaStage');
  const svg=document.getElementById('katanaSvg');
  const timeEl=document.getElementById('katanaTime');
  const strokeEl=document.getElementById('katanaStroke');
  const call=document.getElementById('katanaCall');
  const scoreEl=document.getElementById('katanaScore');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  const anchorX=w*.50;
  const anchorY=h-112;

  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);

  function localPoint(e){
    const r=stage.getBoundingClientRect();

    return {
      x:clamp(
        e.clientX-r.left,
        8,
        w-8
      ),
      y:clamp(
        e.clientY-r.top,
        8,
        anchorY
      )
    };
  }

  function newLine(){
    const el=document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polyline'
    );

    el.classList.add('katana-user-stroke');
    svg.appendChild(el);
    return el;
  }

  stage.addEventListener('pointerdown',e=>{
    if(
      !drawingOpen||
      drawing||
      !isGameRunValid(runId)
    )return;

    e.preventDefault();

    drawing=true;
    pointerId=e.pointerId;

    current={
      points:[localPoint(e)],
      el:newLine()
    };

    strokes.push(current.points);
    strokeEl.textContent=strokes.length;

    try{
      stage.setPointerCapture(pointerId);
    }catch(_){}
  },{passive:false});

  stage.addEventListener('pointermove',e=>{
    if(
      !drawing||
      e.pointerId!==pointerId||
      !drawingOpen
    )return;

    e.preventDefault();

    const pt=localPoint(e);
    const prev=current.points[current.points.length-1];

    if(Math.hypot(pt.x-prev.x,pt.y-prev.y)>=2){
      current.points.push(pt);

      current.el.setAttribute(
        'points',
        current.points
          .map(q=>`${q.x},${q.y}`)
          .join(' ')
      );
    }
  },{passive:false});

  const end=e=>{
    if(!drawing||e.pointerId!==pointerId)return;
    e.preventDefault();
    drawing=false;
    current=null;
  };

  stage.addEventListener('pointerup',end,{passive:false});
  stage.addEventListener('pointercancel',end,{passive:false});

  if(!(await countdown('KATANA BLADE',runId)))return;

  drawingOpen=true;
  const start=performance.now();

  await new Promise(resolve=>{
    const frame=now=>{
      if(!isGameRunValid(runId)){
        resolve();
        return;
      }

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

  const score=scoreKatanaDrawing(
    strokes,
    w,h,
    anchorX,
    anchorY
  );

  state.records.katanaSmith[p.id]=score;

  stage.classList.add('forged');
  call.textContent='刀 完成！';
  scoreEl.textContent=`${score} POINT`;
  scoreEl.classList.add('show');

  beep(
    score>=90?1080:
    score>=70?840:
    score>=45?620:
    420,
    150,.04
  );

  await wait(850);

  if(isGameRunValid(runId)){
    recordScreen(
      56,p,humanIndex,
      `${score}<small>pt</small>`,
      score>=85
        ? '名刀！'
        : score>=60
          ? 'いい刀身！'
          : '根元から上へ長く描こう！'
    );
  }
}

// GAME 58 -------------------------------------------------
async function startPowerHitter(p,humanIndex,runId){
  gameFit();

  let phase='angle';
  let anglePos=.50;
  let powerPos=.50;
  let angleDeg=45;
  let powerPct=0;
  let gaugeStart=0;
  let raf=null;
  let finished=false;

  screen.innerHTML=`<div class="power-hit-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはパワーヒッター</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="power-hit-hud">
      <div><span>ANGLE</span><b id="powerAngleText">---</b></div>
      <div><span>POWER</span><b id="powerPowerText">---</b></div>
      <div><span>DISTANCE</span><b id="powerDistance">0m</b></div>
    </div>

    <div id="powerStage" class="power-stage">
      <div id="powerWorld" class="power-world">
        <div class="power-sky"></div>
        <div class="power-ground"></div>

        ${[500,1000,1500,2000,2500,3000].map((m,i)=>`
          <b class="power-meter" style="left:${430+i*385}px">${m}m</b>
        `).join('')}
      </div>

      <div id="powerGolfer" class="power-golfer" style="background-image:url('icon/01.png')">
        <i class="power-club"></i>
      </div>

      <div id="powerBall" class="power-ball"></div>
      <div id="powerImpact" class="power-impact">SMASH!!</div>
      <div id="powerMessage" class="power-message">まず角度を決める！</div>
    </div>

    <div class="power-gauges">
      <div id="angleGaugeBox" class="power-gauge-box active">
        <span>ANGLE 10° → 70°</span>
        <div class="power-gauge-track angle">
          <i class="ideal"></i>
          <b id="angleMarker" class="power-marker"></b>
        </div>
      </div>

      <div id="powerGaugeBox" class="power-gauge-box">
        <span>POWER 0 → 100%</span>
        <div class="power-gauge-track power">
          <i class="ideal"></i>
          <b id="powerMarker" class="power-marker"></b>
        </div>
      </div>

      <button id="powerStop" class="power-stop" type="button">ANGLE STOP</button>
    </div>
  </div>`;

  const stage=document.getElementById('powerStage');
  const world=document.getElementById('powerWorld');
  const golfer=document.getElementById('powerGolfer');
  const ball=document.getElementById('powerBall');
  const impact=document.getElementById('powerImpact');
  const message=document.getElementById('powerMessage');
  const angleText=document.getElementById('powerAngleText');
  const powerText=document.getElementById('powerPowerText');
  const distanceEl=document.getElementById('powerDistance');
  const angleBox=document.getElementById('angleGaugeBox');
  const powerBox=document.getElementById('powerGaugeBox');
  const angleMarker=document.getElementById('angleMarker');
  const powerMarker=document.getElementById('powerMarker');
  const stop=document.getElementById('powerStop');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  function gaugeValue(now,speed,phaseOffset=0){
    const t=
      (now-gaugeStart)/1000*
      speed*
      Math.PI*2+
      phaseOffset;

    return .5+.5*Math.sin(t);
  }

  function angleFromPos(pos){
    return 10+pos*60;
  }

  async function launchBall(){
    golfer.classList.add('golf-swing');

    await wait(190);
    if(!isGameRunValid(runId))return;

    impact.classList.add('show');
    ball.classList.add('launched');
    stage.classList.add('ball-camera-v119');

    // From impact onward only the ball and scenery remain.
    golfer.style.display='none';
    message.style.display='none';

    const gaugePanel=document.querySelector('.power-gauges');
    if(gaugePanel)gaugePanel.style.display='none';

    beep(940,100,.035);

    const angleRad=angleDeg*Math.PI/180;
    const angleFactor=clamp(
      Math.sin(angleRad*2),
      0,1
    );

    let distance=
      3000*
      Math.pow(powerPct/100,1.28)*
      Math.pow(angleFactor,1.06);

    if(
      powerPct>=99.4&&
      Math.abs(angleDeg-45)<=1.2
    ){
      distance=3000;
    }

    distance=Math.round(
      clamp(distance,0,3000)*10
    )/10;

    state.records.homeRunMob[p.id]=distance;

    message.textContent=
      distance>=2950
        ? 'SUPER SHOT!!'
        : distance>=2200
          ? 'BIG SHOT!!'
          : distance>=1000
            ? 'NICE SHOT!'
            : 'SHOT!';

    const worldW=2750;
    world.style.width=`${worldW}px`;

    const startX=w*.18;
    const startY=h*.67;
    const travel=
      160+
      distance/3000*2350;

    const maxHeight=
      90+
      distance/3000*250+
      Math.sin(angleRad)*70;

    const flightStart=performance.now();
    const duration=1250+distance*.42;

    await new Promise(resolve=>{
      const frame=now=>{
        if(!isGameRunValid(runId)){
          resolve();
          return;
        }

        const t=clamp(
          (now-flightStart)/duration,
          0,1
        );

        const e=1-Math.pow(1-t,2);
        const bx=startX+travel*e;
        const by=
          startY-
          Math.sin(t*Math.PI)*
          maxHeight;

        const cam=clamp(
          bx-w*.36,
          0,
          worldW-w
        );

        world.style.transform=
          `translateX(${-cam}px)`;

        ball.style.left=`${bx-cam}px`;
        ball.style.top=`${by}px`;

        distanceEl.textContent=
          `${Math.round(distance*e)}m`;

        if(t<1){
          raf=requestAnimationFrame(frame);
        }else{
          resolve();
        }
      };

      raf=requestAnimationFrame(frame);
    });

    if(!isGameRunValid(runId))return;

    distanceEl.textContent=`${distance.toFixed(1)}m`;

    await wait(420);

    if(isGameRunValid(runId)){
      recordScreen(
        57,p,humanIndex,
        `${distance.toFixed(1)}<small>m</small>`,
        `ANGLE ${angleDeg.toFixed(1)}° / POWER ${powerPct.toFixed(1)}%`
      );
    }
  }

  stop.addEventListener('pointerdown',e=>{
    if(finished||!isGameRunValid(runId))return;

    e.preventDefault();

    const now=performance.now();

    if(phase==='angle'){
      anglePos=gaugeValue(now,1.04,.2);
      angleDeg=angleFromPos(anglePos);

      angleMarker.style.left=`${anglePos*100}%`;
      angleText.textContent=`${angleDeg.toFixed(1)}°`;

      angleBox.classList.remove('active');
      angleBox.classList.add('locked');
      powerBox.classList.add('active');

      phase='power';
      gaugeStart=performance.now();

      stop.textContent='POWER STOP';
      message.textContent='次はパワー！ MAXを狙え！';

      beep(650,55,.016);

    }else if(phase==='power'){
      powerPos=gaugeValue(now,1.32,1.1);
      powerPct=powerPos*100;

      powerMarker.style.left=`${powerPos*100}%`;
      powerText.textContent=`${powerPct.toFixed(1)}%`;

      powerBox.classList.remove('active');
      powerBox.classList.add('locked');

      phase='launch';
      finished=true;
      stop.disabled=true;
      stop.textContent='SHOT!';

      launchBall();
    }
  },{passive:false});

  if(!(await countdown('POWER HITTER',runId)))return;

  gaugeStart=performance.now();

  function frame(now){
    if(!isGameRunValid(runId))return;

    if(phase==='angle'){
      anglePos=gaugeValue(now,1.04,.2);
      angleMarker.style.left=`${anglePos*100}%`;
      angleText.textContent=
        `${angleFromPos(anglePos).toFixed(0)}°`;

    }else if(phase==='power'){
      powerPos=gaugeValue(now,1.32,1.1);
      powerMarker.style.left=`${powerPos*100}%`;
      powerText.textContent=
        `${Math.round(powerPos*100)}%`;
    }

    if(!finished){
      raf=requestAnimationFrame(frame);
    }
  }

  raf=requestAnimationFrame(frame);
}



// GAME 59 -------------------------------------------------
async function startMobMisfortune(p,humanIndex,runId){
  gameFit();

  const MAX_MS=12000;

  let playerX=0;
  let moveDir=0;
  let startTime=0;
  let last=0;
  let lastSpawn=0;
  let raf=null;
  let finished=false;

  const rocks=[];

  screen.innerHTML=`<div class="misfortune-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんの災難</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="misfortune-hud">
      <div><span>TIME</span><b id="misfortuneTime">0.00</b></div>
      <div><span>DANGER</span><b id="misfortuneDanger">NORMAL</b></div>
    </div>

    <div id="misfortuneStage" class="misfortune-stage">
      <div class="misfortune-cliff left"></div>
      <div class="misfortune-cliff right"></div>
      <div id="misfortuneRockLayer"></div>

      <div id="misfortunePlayer" class="misfortune-player" style="background-image:url('icon/01.png')"></div>

      <div id="misfortuneWarning" class="misfortune-warning"></div>
      <div id="misfortuneMessage" class="misfortune-message">岩に当たるな！</div>
    </div>

    <div class="misfortune-controls">
      <button id="misfortuneLeft" type="button">←</button>
      <button id="misfortuneRight" type="button">→</button>
    </div>
  </div>`;

  const stage=document.getElementById('misfortuneStage');
  const rockLayer=document.getElementById('misfortuneRockLayer');
  const player=document.getElementById('misfortunePlayer');
  const timeEl=document.getElementById('misfortuneTime');
  const dangerEl=document.getElementById('misfortuneDanger');
  const warning=document.getElementById('misfortuneWarning');
  const message=document.getElementById('misfortuneMessage');
  const left=document.getElementById('misfortuneLeft');
  const right=document.getElementById('misfortuneRight');

  const w=stage.clientWidth;
  const h=stage.clientHeight;

  playerX=w*.50;

  function bindHold(btn,dir){
    btn.addEventListener('pointerdown',e=>{
      e.preventDefault();
      moveDir=dir;
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

  function spawnRock(now,hard){
    const size=
      hard
        ? rand(34,66)
        : rand(28,54);

    const el=document.createElement('div');
    el.className='misfortune-rock';
    el.style.width=`${size}px`;
    el.style.height=`${size}px`;

    rockLayer.appendChild(el);

    rocks.push({
      el,
      x:rand(28,w-28),
      y:-size,
      size,
      speed:
        hard
          ? rand(340,520)
          : rand(185,285),
      spin:rand(-220,220)
    });

    lastSpawn=now;
  }

  function finish(hit,elapsed){
    if(finished)return;
    finished=true;

    const seconds=Math.min(
      MAX_MS,
      elapsed
    )/1000;

    state.records.mobMisfortune[p.id]=
      Math.round(seconds*100)/100;

    timeEl.textContent=seconds.toFixed(2);

    if(hit){
      player.classList.add('rock-hit');
      message.textContent='岩直撃！！';
      beep(115,180,.04);
    }else{
      message.textContent='SURVIVED!!';
      beep(1080,150,.04);
    }

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          58,p,humanIndex,
          `${seconds.toFixed(2)}<small>秒</small>`,
          hit?'ROCK HIT':'12 SECOND SURVIVE'
        );
      }
    },700);
  }

  if(!(await countdown('ROCK FALL',runId)))return;

  startTime=performance.now();
  last=startTime;
  lastSpawn=startTime-500;

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    const elapsed=now-startTime;
    const hard=elapsed>=7000;

    timeEl.textContent=(elapsed/1000).toFixed(2);

    if(hard){
      dangerEl.textContent='EXTREME';
      dangerEl.classList.add('extreme');

      if(elapsed<7100){
        warning.textContent='ROCK STORM!!';
        warning.classList.add('show');
      }
    }

    playerX=clamp(
      playerX+moveDir*270*dt,
      32,
      w-32
    );

    player.style.left=`${playerX}px`;

    const spawnEvery=
      hard
        ? 145
        : clamp(500-elapsed*.035,285,500);

    if(now-lastSpawn>=spawnEvery){
      const count=
        hard&&Math.random()<.45
          ? 2
          : 1;

      for(let i=0;i<count;i++){
        spawnRock(now,hard);
      }
    }

    for(const rock of rocks){
      rock.y+=rock.speed*dt;

      rock.el.style.left=`${rock.x}px`;
      rock.el.style.top=`${rock.y}px`;
      rock.el.style.transform=
        `translate(-50%,-50%) rotate(${rock.y*rock.spin*.002}deg)`;

      if(
        rock.y>=h-82&&
        rock.y<=h-16&&
        Math.abs(rock.x-playerX)<
          rock.size*.34+18
      ){
        finish(true,elapsed);
        return;
      }

      if(rock.y>h+70){
        rock.el.remove();
        rock.y=99999;
      }
    }

    if(elapsed>=MAX_MS){
      finish(false,MAX_MS);
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 60 -------------------------------------------------
async function startAimMob(p,humanIndex,runId){
  gameFit();
  const LIMIT_MS=5000;
  let archerY=0,moveDir=0,shot=false,raf=null,last=0,startTime=0,treeOffset=0,targetStageY=0;

  screen.innerHTML=`<div class="aim-shell aim-v126">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>狙ってモブくん！</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="aim-hud"><div><span>TIME</span><b id="aimTime">5.00</b></div><div><span>SCORE</span><b id="aimScore">---</b></div></div>
    <div id="aimStage" class="aim-stage aim-stage-v126">
      <div id="aimArcher" class="aim-archer" style="background-image:url('icon/01.png')"><i class="aim-bow"></i></div>
      <div id="aimTree" class="aim-tree aim-tree-v126"><i id="aimWhiteLine" class="aim-white-line"></i></div>
      <div id="aimGuideLine" class="aim-guide-line-v126"></div>
      <div id="aimArrow" class="aim-arrow"><i></i><b></b></div>
      <div id="aimMessage" class="aim-message">動く木の白線へ合わせろ！</div>
    </div>
    <div class="aim-controls"><button id="aimUp" type="button">▲</button><button id="aimFire" class="fire" type="button">FIRE</button><button id="aimDown" type="button">▼</button></div>
  </div>`;

  const stage=document.getElementById('aimStage'),archer=document.getElementById('aimArcher'),tree=document.getElementById('aimTree'),line=document.getElementById('aimWhiteLine'),arrow=document.getElementById('aimArrow'),guideLine=document.getElementById('aimGuideLine'),timeEl=document.getElementById('aimTime'),scoreEl=document.getElementById('aimScore'),message=document.getElementById('aimMessage'),up=document.getElementById('aimUp'),down=document.getElementById('aimDown'),fire=document.getElementById('aimFire');
  const w=stage.clientWidth,h=stage.clientHeight,minY=65,maxY=h-65;
  archerY=h*.52;
  const treeBaseTop=tree.offsetTop;
  const lineLocal=clamp(tree.clientHeight*.48,34,tree.clientHeight-34);
  line.style.top=`${lineLocal}px`;
  const updateTarget=()=>{targetStageY=treeBaseTop+treeOffset+lineLocal;};
  updateTarget();

  function bindHold(btn,dir){
    btn.addEventListener('pointerdown',e=>{e.preventDefault();if(shot)return;moveDir=dir;try{btn.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});
    const stop=()=>{if(moveDir===dir)moveDir=0;};
    btn.addEventListener('pointerup',stop);btn.addEventListener('pointercancel',stop);btn.addEventListener('lostpointercapture',stop);
  }
  bindHold(up,-1);bindHold(down,1);

  async function finishShot(auto=false){
    if(shot||!isGameRunValid(runId))return;
    shot=true;moveDir=0;up.disabled=down.disabled=fire.disabled=true;
    if(auto){
      state.records.aimMob[p.id]=0;scoreEl.textContent='0pt';message.textContent='TIME UP!';beep(150,160,.04);
      await wait(650);if(isGameRunValid(runId))recordScreen(59,p,humanIndex,'0<small>pt</small>','TIME UP');return;
    }
    const shotY=archerY,targetAtShot=targetStageY;
    arrow.style.top=`${shotY}px`;arrow.style.left='72px';arrow.classList.add('flying');message.textContent='SHOOT!!';beep(780,55,.018);
    const treeX=w-84,startX=72,start=performance.now(),duration=500;
    await new Promise(resolve=>{
      const frame=now=>{if(!isGameRunValid(runId)){resolve();return;}const t=clamp((now-start)/duration,0,1),e=1-Math.pow(1-t,2);arrow.style.left=`${startX+(treeX-startX)*e}px`;if(t<1)raf=requestAnimationFrame(frame);else resolve();};
      raf=requestAnimationFrame(frame);
    });
    if(!isGameRunValid(runId))return;
    arrow.classList.remove('flying');arrow.classList.add('stuck');
    const error=Math.abs(shotY-targetAtShot);
    const score=error<=4?100:clamp(Math.round(100-(error-4)*1.18),0,100);
    state.records.aimMob[p.id]=score;scoreEl.textContent=`${score}pt`;
    message.textContent=score===100?'PERFECT!!':score>=85?'BULLSEYE!':score>=60?'NICE!':'MISS...';
    stage.classList.add('aim-impact-v126');beep(score>=90?1040:score>=60?760:350,140,.04);
    await wait(760);if(isGameRunValid(runId))recordScreen(59,p,humanIndex,`${score}<small>pt</small>`,`白線との誤差 ${error.toFixed(1)}px`);
  }
  fire.addEventListener('pointerdown',e=>{e.preventDefault();finishShot(false);},{passive:false});

  if(!(await countdown('ARCHERY',runId,{transparent:true})))return;
  last=startTime=performance.now();
  function frame(now){
    if(!isGameRunValid(runId)||shot)return;
    const dt=Math.min(30,now-last)/1000;last=now;
    const elapsed=now-startTime,rem=LIMIT_MS-elapsed;timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);
    archerY=clamp(archerY+moveDir*190*dt,minY,maxY);archer.style.top=`${archerY}px`;guideLine.style.top=`${archerY}px`;
    treeOffset=Math.sin(elapsed/1000*2.35)*48;tree.style.transform=`translateY(${treeOffset}px)`;updateTarget();
    if(rem<=0){finishShot(true);return;}raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}


// GAME 61 -------------------------------------------------
async function startBalanceMob(p,humanIndex,runId){
  gameFit();

  const MAX_MS=10000;
  const FALL_ANGLE=32;
  const NO_CONTROL_ANGLE=26;

  let angle=rand(-4.2,4.2);
  let angularVelocity=rand(-2.0,2.0);

  let startTime=0;
  let last=0;
  let raf=null;
  let finished=false;
  let gustPhase=Math.random()*Math.PI*2;

  screen.innerHTML=`<div class="balance-shell">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>極限バランスモブくん</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="balance-hud">
      <div><span>TIME</span><b id="balanceTime">0.00</b></div>
      <div><span>TILT</span><b id="balanceTilt">0.0°</b></div>
    </div>

    <div id="balanceStage" class="balance-stage">
      <div class="balance-limit left">LIMIT</div>
      <div class="balance-limit right">LIMIT</div>

      <div id="balanceRig" class="balance-rig">
        <div class="balance-pole"></div>
        <div class="balance-mob" style="background-image:url('icon/01.png')"></div>
      </div>

      <div id="balanceMessage" class="balance-message">傾いた逆方向をタップ！</div>
    </div>

    <div class="balance-controls">
      <button id="balanceLeft" type="button">← LEFT</button>
      <button id="balanceRight" type="button">RIGHT →</button>
    </div>
  </div>`;

  const stage=document.getElementById('balanceStage');
  const rig=document.getElementById('balanceRig');
  const timeEl=document.getElementById('balanceTime');
  const tiltEl=document.getElementById('balanceTilt');
  const message=document.getElementById('balanceMessage');
  const left=document.getElementById('balanceLeft');
  const right=document.getElementById('balanceRight');

  function correctionStrength(){
    const a=Math.abs(angle);

    if(a>=NO_CONTROL_ANGLE){
      return 0;
    }

    const base=1.25+a*.24;

    if(a<=19)return base;

    return base*clamp((NO_CONTROL_ANGLE-a)/(NO_CONTROL_ANGLE-19),0,1);
  }

  function correct(dir){
    if(finished||!isGameRunValid(runId))return;

    const power=correctionStrength();

    if(power<=0){
      message.textContent='限界！ 補正が効かない！';
      beep(140,55,.016);
      return;
    }

    angle+=dir*power;
    angularVelocity+=dir*(1.2+power*.18);

    stage.classList.remove('balance-tap');
    void stage.offsetWidth;
    stage.classList.add('balance-tap');

    beep(460+Math.min(280,power*18),22,.006);
  }

  left.addEventListener('pointerdown',e=>{
    e.preventDefault();
    correct(-1);
  },{passive:false});

  right.addEventListener('pointerdown',e=>{
    e.preventDefault();
    correct(1);
  },{passive:false});

  function finish(elapsed,fallen){
    if(finished)return;
    finished=true;

    const seconds=Math.min(
      elapsed,
      MAX_MS
    )/1000;

    state.records.balanceMob[p.id]=
      Math.round(seconds*100)/100;

    timeEl.textContent=seconds.toFixed(2);

    if(fallen){
      rig.classList.add(
        angle<0
          ? 'fall-left'
          : 'fall-right'
      );

      message.textContent='BALANCE BREAK!';
      beep(120,180,.04);

    }else{
      message.textContent='10秒 SURVIVE!!';
      beep(1080,150,.04);
    }

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          60,p,humanIndex,
          `${seconds.toFixed(2)}<small>秒</small>`,
          fallen?'BALANCE BREAK':'PERFECT BALANCE'
        );
      }
    },700);
  }

  if(!(await countdown('BALANCE',runId)))return;

  startTime=performance.now();
  last=startTime;

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(30,now-last)/1000;
    last=now;

    const elapsed=now-startTime;
    const t=elapsed/1000;

    const difficulty=1+clamp(t/10,0,1)*1.25;
    const gust=(Math.sin(t*2.35+gustPhase)*1.85+Math.sin(t*.83+gustPhase*.43)*1.10+Math.sin(t*4.10+gustPhase*.19)*.46)*difficulty;
    angularVelocity+=(angle*.44*difficulty+gust)*dt;
    angularVelocity*=Math.pow(.965,dt*60);
    angle+=angularVelocity*dt*18.5;
    if(Math.random()<dt*(2.0+t*.20)){angularVelocity+=rand(-.82,.82)*(1+t*.07);}

    rig.style.transform=
      `translateX(-50%) rotate(${angle}deg)`;

    timeEl.textContent=(elapsed/1000).toFixed(2);
    tiltEl.textContent=`${Math.abs(angle).toFixed(1)}°`;

    if(Math.abs(angle)>=NO_CONTROL_ANGLE){
      tiltEl.classList.add('danger');
      message.textContent='限界域！ 補正不能！';
    }else if(Math.abs(angle)>=19){
      tiltEl.classList.add('warning');
      message.textContent='強く傾いてる！ 逆方向！';
    }else{
      tiltEl.classList.remove('danger','warning');
    }

    if(Math.abs(angle)>=FALL_ANGLE){
      finish(elapsed,true);
      return;
    }

    if(elapsed>=MAX_MS){
      finish(MAX_MS,false);
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



// GAME 62 -------------------------------------------------
async function startMobDice(p,humanIndex,runId){
  gameFit();
  let rolled=false;
  let finished=false;

  screen.innerHTML=`<div class="dice-shell dice-shell-v119">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんのサイコロ</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="dice-hud"><div><span>TOTAL</span><b id="diceTotal">---</b></div><div><span>SCORE</span><b id="diceScore">---</b></div></div>

    <div id="diceStage" class="dice-stage dice-stage-v119">
      <div class="dice-table-v119"></div>
      <div class="dice-mob-v119" style="background-image:url('icon/01.png')"><span>ROLL!</span></div>
      <div id="diceTray" class="dice-tray-v119">
        ${Array.from({length:5},(_,i)=>`<div class="mob-die-v119" data-die="${i}"><div class="die-face-v119"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>`).join('')}
      </div>
      <div id="diceMessage" class="dice-message dice-message-v119">巨大サイコロ5個！</div>
      <div id="diceJackpot" class="dice-jackpot">ALL 6!!</div>
    </div>

    <button id="diceRoll" class="dice-roll" type="button">5 DICE ROLL!</button>
  </div>`;

  const dice=[...screen.querySelectorAll('.mob-die-v119')];
  const totalEl=document.getElementById('diceTotal');
  const scoreEl=document.getElementById('diceScore');
  const message=document.getElementById('diceMessage');
  const jackpot=document.getElementById('diceJackpot');
  const rollBtn=document.getElementById('diceRoll');

  const pipMap={
    1:[4],
    2:[0,8],
    3:[0,4,8],
    4:[0,2,6,8],
    5:[0,2,4,6,8],
    6:[0,2,3,5,6,8]
  };

  function setDie(die,value){
    die.dataset.value=value;
    const on=new Set(pipMap[value]||[]);
    [...die.querySelectorAll('.die-face-v119 i')].forEach((pip,i)=>pip.classList.toggle('on',on.has(i)));
  }

  function scoreFromTotal(total){
    if(total<=5)return 1;
    if(total>=30)return 100;
    return clamp(Math.round(1+(total-5)/25*99),1,100);
  }

  async function rollDice(){
    if(rolled||finished||!isGameRunValid(runId))return;
    rolled=true;
    rollBtn.disabled=true;
    message.textContent='ROLL!!';

    dice.forEach((die,i)=>{
      die.style.setProperty('--dice-x',`${rand(-42,42).toFixed(0)}px`);
      die.style.setProperty('--dice-y',`${rand(-96,-56).toFixed(0)}px`);
      die.style.setProperty('--dice-r',`${randi(-620,620)}deg`);
      die.style.setProperty('--dice-delay',`${i*.05}s`);
      die.classList.remove('rolling','settled');
      void die.offsetWidth;
      die.classList.add('rolling');
    });

    beep(520,80,.015);

    for(let step=0;step<10;step++){
      if(!isGameRunValid(runId))return;
      dice.forEach(d=>setDie(d,randi(1,6)));
      await wait(70);
    }

    const values=[];
    dice.forEach((die,i)=>{
      const value=randi(1,6);
      values.push(value);
      setDie(die,value);
      setTimeout(()=>{if(die.isConnected)die.classList.add('settled')},i*75);
    });

    await wait(520);
    if(!isGameRunValid(runId))return;

    const total=values.reduce((a,b)=>a+b,0);
    const score=scoreFromTotal(total);
    state.records.mobDice[p.id]=score;
    totalEl.textContent=total;
    scoreEl.textContent=`${score}pt`;

    if(values.every(v=>v===6)){
      jackpot.classList.add('show');
      message.textContent='奇跡！ ALL 6！！';
      beep(1180,220,.05);
    }else if(values.every(v=>v===1)){
      message.textContent='ALL 1… 1 POINT';
      beep(150,180,.035);
    }else{
      message.textContent=total>=25?'LUCKY!!':total>=18?'GOOD!':'運は次回に…';
      beep(score>=80?980:score>=55?760:score>=30?560:330,140,.035);
    }

    finished=true;
    await wait(900);
    if(isGameRunValid(runId))recordScreen(61,p,humanIndex,`${score}<small>pt</small>`,`${values.join(' + ')} = ${total}`);
  }

  dice.forEach(d=>setDie(d,1));
  rollBtn.addEventListener('pointerdown',e=>{e.preventDefault();rollDice()},{passive:false});
  if(!(await countdown('DICE',runId)))return;
  message.textContent='5個まとめて振れ！';
}


// GAME 63 -------------------------------------------------
function makePerfectComboBoardV122(){
  const board=[];
  let previousPair="";

  for(let r=0;r<5;r++){
    let pool=shuffle([1,2,3,4,5,6]);
    let a=pool[0];
    let b=pool[1];

    // Avoid visually repeating the same pair on consecutive rows.
    let pair=[a,b].sort((x,y)=>x-y).join("-");

    if(pair===previousPair){
      b=pool[2];
      pair=[a,b].sort((x,y)=>x-y).join("-");
    }

    previousPair=pair;

    if(Math.random()<.5){
      board.push(a,a,a,b,b,b);
    }else{
      board.push(b,b,b,a,a,a);
    }
  }

  return board;
}

function makeTwentyComboBoardV121(){
  const rows=5,cols=6;
  const target=makePerfectComboBoardV122();
  const board=[...target];

  let cell=randi(0,rows*cols-1);
  let prev=-1;
  const path=[cell];

  for(let s=0;s<randi(24,36);s++){
    const r=Math.floor(cell/cols);
    const c=cell%cols;
    const opts=[];

    if(r>0)opts.push(cell-cols);
    if(r<rows-1)opts.push(cell+cols);
    if(c>0)opts.push(cell-1);
    if(c<cols-1)opts.push(cell+1);

    const safe=opts.filter(x=>x!==prev);
    const pool=safe.length?safe:opts;
    const next=pool[randi(0,pool.length-1)];

    [board[cell],board[next]]=
      [board[next],board[cell]];

    prev=cell;
    cell=next;
    path.push(cell);
  }

  return {
    board,
    target,
    reversePath:[...path].reverse()
  };
}

async function startMobCombo(p,humanIndex,runId){
  gameFit();

  const ROWS=5;
  const COLS=6;
  const GAME_MS=10000;

  const generated=makeTwentyComboBoardV121();
  let board=[...generated.board];

  let dragging=false;
  let currentIndex=-1;
  let pointerId=null;
  let ghost=null;
  let startTime=0;
  let raf=null;
  let resolving=false;
  let finished=false;
  let dropCascadeCount=0;

  screen.innerHTML=`<div class="combo-shell-v120 combo-v121">
    <div class="game-head">
      <div>
        <span class="kicker">${esc(p.name)}</span>
        <h2>モブくん20連コンボ</h2>
      </div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="combo-hud-v120">
      <div><span>TIME</span><b id="comboTime">10.00</b></div>
      <div><span>COMBO</span><b id="comboLive">0</b></div>
    </div>

    <div id="comboBoard" class="combo-board-v120 combo-board-v121"></div>

    <div id="comboCall" class="combo-call-v120">
      盤面を確認！ カウントダウン後に動かせます
    </div>

    <div id="comboBurst" class="combo-burst-v120"></div>
  </div>`;

  const boardEl=document.getElementById('comboBoard');
  const timeEl=document.getElementById('comboTime');
  const comboEl=document.getElementById('comboLive');
  const call=document.getElementById('comboCall');
  const burst=document.getElementById('comboBurst');

  function orbColor(v){
    return `orb-${((v-1)%6)+1}`;
  }

  function renderBoard({
    hideIndex=-1,
    dropMap=null,
    shift=null
  }={}){
    boardEl.innerHTML=board.map((v,i)=>{
      const hidden=i===hideIndex;
      const dropRows=dropMap?.get(i)||0;
      const isShift=shift&&shift.index===i;

      return `<div
        class="combo-slot-v120 ${hidden?'drag-source-v120':''}"
        data-combo-index="${i}">
        ${v==null
          ? ''
          : `<div
              class="combo-orb-v120 ${orbColor(v)} ${dropRows>0?'drop-in-v120':''} ${isShift?'shift-in-v120':''}"
              style="
                --drop-y:${dropRows*72}px;
                --shift-x:${isShift?shift.dx:0}px;
                --shift-y:${isShift?shift.dy:0}px;
              ">
              <img
                src="icon/${String(v).padStart(2,'0')}.png"
                draggable="false"
                alt="MOB ${v}">
            </div>`
        }
      </div>`;
    }).join('');
  }

  function indexFromPoint(x,y){
    const rect=boardEl.getBoundingClientRect();

    if(
      x<rect.left||
      x>rect.right||
      y<rect.top||
      y>rect.bottom
    )return -1;

    const c=clamp(
      Math.floor((x-rect.left)/(rect.width/COLS)),
      0,COLS-1
    );

    const r=clamp(
      Math.floor((y-rect.top)/(rect.height/ROWS)),
      0,ROWS-1
    );

    return r*COLS+c;
  }

  function adjacent(a,b){
    if(a<0||b<0)return false;

    const ar=Math.floor(a/COLS);
    const ac=a%COLS;
    const br=Math.floor(b/COLS);
    const bc=b%COLS;

    return (
      Math.abs(ar-br)+
      Math.abs(ac-bc)
    )===1;
  }

  function createGhost(value,e){
    removeGhost();

    ghost=document.createElement('div');
    ghost.className=
      `combo-drag-ghost-v120 combo-orb-v120 ${orbColor(value)}`;

    ghost.innerHTML=`
      <img
        src="icon/${String(value).padStart(2,'0')}.png"
        draggable="false">
    `;

    document.body.appendChild(ghost);
    moveGhost(e);
  }

  function moveGhost(e){
    if(!ghost)return;
    ghost.style.left=`${e.clientX}px`;
    ghost.style.top=`${e.clientY}px`;
  }

  function removeGhost(){
    if(ghost){
      ghost.remove();
      ghost=null;
    }
  }

  function stepToward(targetIndex){
    if(
      currentIndex<0||
      targetIndex<0||
      targetIndex===currentIndex
    )return false;

    const cr=Math.floor(currentIndex/COLS);
    const cc=currentIndex%COLS;
    const tr=Math.floor(targetIndex/COLS);
    const tc=targetIndex%COLS;

    let next=currentIndex;

    if(Math.abs(tc-cc)>=Math.abs(tr-cr)){
      if(tc>cc)next=currentIndex+1;
      else if(tc<cc)next=currentIndex-1;
      else if(tr>cr)next=currentIndex+COLS;
      else if(tr<cr)next=currentIndex-COLS;
    }else{
      if(tr>cr)next=currentIndex+COLS;
      else if(tr<cr)next=currentIndex-COLS;
      else if(tc>cc)next=currentIndex+1;
      else if(tc<cc)next=currentIndex-1;
    }

    if(!adjacent(currentIndex,next))return false;

    const old=currentIndex;
    const oldR=Math.floor(old/COLS);
    const oldC=old%COLS;
    const nextR=Math.floor(next/COLS);
    const nextC=next%COLS;

    [board[old],board[next]]=
      [board[next],board[old]];

    currentIndex=next;

    const rect=boardEl.getBoundingClientRect();
    const cellW=rect.width/COLS;
    const cellH=rect.height/ROWS;

    renderBoard({
      hideIndex:currentIndex,
      shift:{
        index:old,
        dx:(nextC-oldC)*cellW,
        dy:(nextR-oldR)*cellH
      }
    });

    beep(355,12,.0035);
    return true;
  }

  function findHorizontalMatches(){
    const groups=[];

    for(let r=0;r<ROWS;r++){
      let c=0;

      while(c<COLS){
        const v=board[r*COLS+c];
        let end=c+1;

        while(
          end<COLS&&
          board[r*COLS+end]===v
        ){
          end++;
        }

        if(v!=null&&end-c>=3){
          const indices=[];

          for(let k=c;k<end;k++){
            indices.push(r*COLS+k);
          }

          groups.push({value:v,indices});
        }

        c=end;
      }
    }

    return groups;
  }

  function collapseAndFillAnimated({
    cascadeIndex=0
  }={}){
    const nextBoard=Array(ROWS*COLS).fill(null);
    const dropMap=new Map();

    for(let c=0;c<COLS;c++){
      const survivors=[];

      for(let r=ROWS-1;r>=0;r--){
        const idx=r*COLS+c;
        const v=board[idx];

        if(v!=null){
          survivors.push({
            value:v,
            fromRow:r
          });
        }
      }

      let writeRow=ROWS-1;

      for(const item of survivors){
        const idx=writeRow*COLS+c;
        nextBoard[idx]=item.value;

        const dropRows=
          writeRow-item.fromRow;

        if(dropRows>0){
          dropMap.set(idx,dropRows);
        }

        writeRow--;
      }

      let spawnDepth=1;

      while(writeRow>=0){
        const idx=writeRow*COLS+c;

        nextBoard[idx]=randi(1,6);
        dropMap.set(
          idx,
          writeRow+spawnDepth+2
        );

        writeRow--;
        spawnDepth++;
      }
    }

    // "Ochikon" assistance:
    // New falling orbs are a little more likely to create a horizontal match,
    // but this is deliberately probabilistic — NEVER guaranteed.
    const assistChance=
      cascadeIndex===0
        ? .56
        : cascadeIndex===1
          ? .38
          : .20;

    if(Math.random()<assistChance){
      const howMany=
        Math.random()<.28
          ? 2
          : 1;

      const usedRows=new Set();

      for(let n=0;n<howMany;n++){
        const candidates=
          shuffle([0,1,2,3,4])
            .filter(r=>!usedRows.has(r));

        if(!candidates.length)break;

        const r=candidates[0];
        usedRows.add(r);

        const start=randi(0,COLS-3);
        const value=randi(1,6);

        for(let k=0;k<3;k++){
          const idx=r*COLS+start+k;
          nextBoard[idx]=value;

          // Mark as a newly falling orb for visual continuity.
          if(!dropMap.has(idx)){
            dropMap.set(
              idx,
              r+ROWS+2+k*.18
            );
          }
        }
      }
    }

    board=nextBoard;
    return dropMap;
  }

  function showComboBurst(comboNo){
    burst.textContent=`${comboNo} COMBO!`;

    burst.classList.remove('show');
    void burst.offsetWidth;
    burst.classList.add('show');

    call.textContent=`${comboNo} COMBO!!`;
  }

  async function vanishGroupSequentially(
    group,
    comboNo
  ){
    showComboBurst(comboNo);
    renderBoard();

    // One orb at a time.
    for(const idx of group.indices){
      const orb=
        boardEl.querySelector(
          `[data-combo-index="${idx}"] .combo-orb-v120`
        );

      if(orb){
        orb.classList.add(
          'vanish-v120',
          'vanish-one-v121'
        );
      }

      beep(
        490+
        Math.min(500,comboNo*24),
        36,.012
      );

      await wait(92);
      if(!isGameRunValid(runId))return false;
    }

    // Finish this group before starting the next matched group.
    await wait(185);
    if(!isGameRunValid(runId))return false;

    group.indices.forEach(i=>{
      board[i]=null;
    });

    renderBoard();
    return true;
  }

  async function resolveBoard(){
    if(resolving||finished)return;

    resolving=true;
    dragging=false;
    currentIndex=-1;
    removeGhost();

    boardEl.classList.add('resolving-v120');

    let combos=0;

    for(let cascade=0;cascade<20;cascade++){
      const groups=findHorizontalMatches();
      if(!groups.length)break;

      // All groups disappear first.
      for(const group of groups){
        combos++;
        comboEl.textContent=combos;

        if(!(
          await vanishGroupSequentially(
            group,
            combos
          )
        ))return;
      }

      // Only after every matched group is fully gone can the next drop start.
      await wait(95);
      if(!isGameRunValid(runId))return;

      dropCascadeCount++;

      call.textContent=
        '落下中… 落ちコンするか！？';

      const dropMap=
        collapseAndFillAnimated({
          cascadeIndex:
            dropCascadeCount-1
        });

      renderBoard({dropMap});
      boardEl.classList.add('drop-shake-v120');

      await wait(390);
      if(!isGameRunValid(runId))return;

      boardEl.classList.remove('drop-shake-v120');

      await wait(120);
      if(!isGameRunValid(runId))return;
    }

    finished=true;

    state.records.mobCombo[p.id]=combos;

    call.textContent=
      combos>=20
        ? `${combos} COMBO！ 20連コンボ達成！`
        : `${combos} COMBO！`;

    burst.textContent=
      combos>=20
        ? '20 COMBO CLEAR!!'
        : `${combos} COMBO`;

    burst.classList.remove('show');
    void burst.offsetWidth;
    burst.classList.add('show');

    beep(
      combos>=20
        ? 1180
        : combos>=12
          ? 900
          : 590,
      180,.045
    );

    await wait(850);

    if(isGameRunValid(runId)){
      recordScreen(
        62,p,humanIndex,
        `${combos}<small> COMBO</small>`,
        combos>=20
          ? '20 COMBO CLEAR!'
          : '20 COMBOで100点'
      );
    }
  }

  boardEl.addEventListener('pointerdown',e=>{
    if(
      resolving||
      finished||
      !startTime
    )return;

    e.preventDefault();

    const idx=
      indexFromPoint(
        e.clientX,
        e.clientY
      );

    if(idx<0)return;

    dragging=true;
    currentIndex=idx;
    pointerId=e.pointerId;

    createGhost(
      board[currentIndex],
      e
    );

    renderBoard({
      hideIndex:currentIndex
    });

    boardEl.classList.add('drag-active-v120');

    try{
      boardEl.setPointerCapture(pointerId);
    }catch(_){}

    beep(430,20,.006);
  },{passive:false});

  boardEl.addEventListener('pointermove',e=>{
    if(
      !dragging||
      e.pointerId!==pointerId||
      resolving
    )return;

    e.preventDefault();
    moveGhost(e);

    const target=
      indexFromPoint(
        e.clientX,
        e.clientY
      );

    if(target<0)return;

    let guard=0;

    while(
      currentIndex!==target&&
      guard<8
    ){
      if(!stepToward(target))break;
      guard++;
    }
  },{passive:false});

  const endDrag=e=>{
    if(
      !dragging||
      e.pointerId!==pointerId
    )return;

    e.preventDefault();

    dragging=false;
    currentIndex=-1;
    removeGhost();
    renderBoard();

    boardEl.classList.remove('drag-active-v120');
    beep(470,22,.006);
  };

  boardEl.addEventListener(
    'pointerup',
    endDrag,
    {passive:false}
  );

  boardEl.addEventListener(
    'pointercancel',
    endDrag,
    {passive:false}
  );

  // The board exists before countdown and remains visible through 3-2-1.
  renderBoard();
  call.textContent=
    '盤面を確認！ カウントダウン後に10秒スタート';

  if(!(
    await countdown(
      '20 COMBO',
      runId,
      {transparent:true}
    )
  ))return;

  startTime=performance.now();

  call.textContent=
    '10秒！ モブ球を押したまま自由に動かせ！';

  function frame(now){
    if(
      finished||
      resolving||
      !isGameRunValid(runId)
    )return;

    const rem=
      GAME_MS-
      (now-startTime);

    timeEl.textContent=
      (Math.max(0,rem)/1000).toFixed(2);

    if(rem<=0){
      timeEl.textContent='0.00';

      if(dragging){
        dragging=false;
        currentIndex=-1;
        removeGhost();
        renderBoard();
      }

      resolveBoard();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// GAME 65 -------------------------------------------------

async function startCardShop(p,humanIndex,runId){
  gameFit();

  const POOLS={
    R:{name:'レア',points:5,ids:["01","02","07","10","11","21"],chance:32,color:'#71c7ff'},
    SR:{name:'スーパーレア',points:8,ids:["04","05","19","20"],chance:24,color:'#72efff'},
    SSR:{name:'スーパースペシャルレア',points:10,ids:["12","15","16","22"],chance:20,color:'#ffe165'},
    UR:{name:'アルティメットレア',points:15,ids:["03","06","08","09"],chance:14,color:'#c687ff'},
    MOB:{name:'モブアーティストレア',points:30,ids:["13","14","17","18"],chance:10,color:'#ff75ca'}
  };

  const N={
    "01":"お昼寝モブくん","02":"走るモブくん","03":"MCモブくん","04":"ハロウィンモブくん",
    "05":"夏休みモブくん","06":"BBOYモブくん","07":"お勉強モブくん","08":"DJモブくん",
    "09":"グラフィティモブくん","10":"ジャンプモブくん","11":"トレーニングモブくん","12":"パーティーモブくん",
    "13":"ゲームモブくん","14":"どら焼き食べるモブくん","15":"音楽モブくん","16":"チルタイムモブくん",
    "17":"みかんちゃんとモブくん","18":"わたあめ大好きモブくん","19":"クリスマスモブくん","20":"お正月モブくん",
    "21":"お掃除モブくん","22":"お誕生日モブくん"
  };

  const rarities=['R','SR','SSR','UR','MOB'];

  function draw(){
    const roll=Math.random()*100;
    let acc=0;
    let rarity='R';

    for(const key of rarities){
      acc+=POOLS[key].chance;
      if(roll<acc){
        rarity=key;
        break;
      }
    }

    const pool=POOLS[rarity];
    const id=pool.ids[randi(0,pool.ids.length-1)];

    return{
      id,
      rarity,
      rarityName:pool.name,
      points:pool.points,
      color:pool.color,
      name:N[id]
    };
  }

  const pulls=Array.from({length:6},draw);
  const total=pulls.reduce((sum,c)=>sum+c.points,0);

  screen.innerHTML=`<div class="cardshop-v128">
    <div class="cardshop-head-v128">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんカードショップ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div id="cardStage128" class="cardshop-stage-v128">
      <div class="shop-wall-v128"></div>
      <div class="shop-shelf-v128 s1"></div>
      <div class="shop-shelf-v128 s2"></div>
      <div id="cardTop128" class="card-top-v128">1パック 6枚入り</div>

      <div id="packScene128" class="pack-scene-v128">
        <div id="pack128" class="pack-v128">
          <div class="pack-shine-v128"></div>
          <b>MOB</b>
          <span style="background-image:url('icon/01.png')"></span>
          <em>PARTY CARD PACK</em>
          <i>★ ★ ★</i>
        </div>
        <button id="open128" class="primary open-v128" type="button">開封！</button>
      </div>

      <div id="reveal128" class="reveal-v128" hidden></div>
      <div id="cardStatus128" class="card-status-v128">パックを開封して6枚の合計ポイントを競う！</div>
    </div>
  </div>`;

  const stage=document.getElementById('cardStage128');
  const packScene=document.getElementById('packScene128');
  const pack=document.getElementById('pack128');
  const open=document.getElementById('open128');
  const reveal=document.getElementById('reveal128');
  const status=document.getElementById('cardStatus128');
  const top=document.getElementById('cardTop128');

  function rarityClass(rarity){
    return `r-${rarity.toLowerCase()}-v128`;
  }

  function frontCard(c,small=false){
    const el=document.createElement('div');
    el.className=`card-front-v128 ${rarityClass(c.rarity)} ${small?'small-v128':''}`;
    el.innerHTML=`
      <div class="card-frame-glow-v128"></div>
      <div class="card-rarity-v128"><b>${c.rarity}</b><span>${c.points}pt</span></div>
      <div class="card-art-v128"><img src="card/${c.id}.png" draggable="false" alt="${esc(c.name)}"></div>
      <div class="card-name-v128">${esc(c.name)}</div>
    `;
    return el;
  }

  function revealCard(c){
    const wrap=document.createElement('div');
    wrap.className=`card-flip-v128 ${rarityClass(c.rarity)}`;
    wrap.innerHTML=`
      <div class="flip-inner-v128">
        <div class="card-back-v128">
          <b>MOB</b>
          <span style="background-image:url('icon/01.png')"></span>
          <em>PARTY CARD</em>
          <i>★ ★ ★</i>
        </div>
      </div>
    `;
    const front=frontCard(c,false);
    front.classList.add('flip-front-v128');
    wrap.querySelector('.flip-inner-v128').appendChild(front);
    return wrap;
  }

  function playRaritySound(rarity){
    const tones={
      R:[470],
      SR:[520,650],
      SSR:[590,760,980],
      UR:[620,820,1050,1320],
      MOB:[520,720,940,1190,1450,1710]
    }[rarity];

    tones.forEach((tone,i)=>{
      setTimeout(()=>beep(tone,105+(i>2?25:0),.035),i*90);
    });
  }

  function makeRarityFx(c){
    const fx=document.createElement('div');
    fx.className=`rarity-fx-v128 fx-${c.rarity.toLowerCase()}-v128`;

    const labels={
      R:'RARE',
      SR:'SUPER RARE!',
      SSR:'SUPER SPECIAL RARE!!',
      UR:'ULTIMATE RARE!!!',
      MOB:'MOB ARTIST RARE!!!!'
    };

    fx.innerHTML=`
      <div class="rarity-rays-v128"></div>
      <div class="rarity-ring-v128"></div>
      <div class="rarity-call-v128">${labels[c.rarity]}</div>
      <div class="rarity-sparks-v128">
        ${Array.from({length:c.rarity==='MOB'?22:c.rarity==='UR'?18:c.rarity==='SSR'?15:10},(_,i)=>
          `<i style="--a:${i*31}deg;--d:${54+(i%5)*14}px;--delay:${(i%4)*.035}s"></i>`
        ).join('')}
      </div>
    `;
    return fx;
  }

  function clearRarityStage(){
    stage.classList.remove(
      'stage-r-v128','stage-sr-v128','stage-ssr-v128','stage-ur-v128','stage-mob-v128'
    );
  }

  function showRarity(c,scene){
    clearRarityStage();
    stage.classList.add(`stage-${c.rarity.toLowerCase()}-v128`);
    scene.appendChild(makeRarityFx(c));
    playRaritySound(c.rarity);
  }

  function waitForButton(scene,label){
    return new Promise(resolve=>{
      const box=document.createElement('div');
      box.className='card-next-wrap-v128 card-next-inside-v129';

      const btn=document.createElement('button');
      btn.type='button';
      btn.className='primary card-next-v128';
      btn.textContent=label;

      box.appendChild(btn);
      scene.appendChild(box);

      let settled=false;
      const done=e=>{
        if(settled)return;
        settled=true;
        e.preventDefault();
        e.stopPropagation();
        btn.disabled=true;
        resolve();
      };

      btn.addEventListener('pointerup',done,{passive:false,once:true});
      btn.addEventListener('click',done,{once:true});
    });
  }

  async function runOpen(){
    if(open.disabled||!isGameRunValid(runId))return;
    open.disabled=true;

    status.textContent='パック開封中…';
    pack.classList.add('tear-v128');
    beep(280,90,.03);
    await wait(520);
    if(!isGameRunValid(runId))return;

    packScene.hidden=true;
    status.hidden=true;
    reveal.hidden=false;
    top.textContent='CARD OPEN';

    for(let i=0;i<pulls.length;i++){
      if(!isGameRunValid(runId))return;

      clearRarityStage();
      const c=pulls[i];
      reveal.innerHTML='';

      const scene=document.createElement('div');
      scene.className='single-card-scene-v128';

      const counter=document.createElement('div');
      counter.className='card-counter-v128';
      counter.textContent=`${i+1} / 6`;

      const holder=document.createElement('div');
      holder.className='single-card-holder-v128';
      const card=revealCard(c);
      holder.appendChild(card);

      const info=document.createElement('div');
      info.className='single-card-info-v128';
      info.innerHTML=`
        <b>${c.rarity} ${c.rarityName}</b>
        <span>${esc(c.name)}</span>
        <strong>${c.points} POINT</strong>
      `;

      scene.append(counter,holder,info);
      reveal.appendChild(scene);

      await wait(330);
      if(!isGameRunValid(runId))return;

      card.classList.add('open-v128');
      showRarity(c,scene);

      // Make every pull readable before allowing the next card.
      const minRead={R:850,SR:1000,SSR:1200,UR:1450,MOB:1800}[c.rarity];
      await wait(minRead);
      if(!isGameRunValid(runId))return;

      await waitForButton(scene,i===pulls.length-1?'6枚をまとめて見る':'次のカード');
      if(!isGameRunValid(runId))return;
    }

    clearRarityStage();
    reveal.innerHTML='';
    top.textContent='OPEN RESULT';

    const finalScene=document.createElement('div');
    finalScene.className='final-scene-v128';

    const title=document.createElement('div');
    title.className='final-title-v128';
    title.textContent='6枚の開封結果';

    const grid=document.createElement('div');
    grid.className='final-grid-v128';
    pulls.forEach(c=>grid.appendChild(frontCard(c,true)));

    const totalEl=document.createElement('div');
    totalEl.className='final-total-v128';
    totalEl.textContent=`合計 ${total} ポイント！`;

    const finishBtn=document.createElement('button');
    finishBtn.type='button';
    finishBtn.className='primary final-ok-v128';
    finishBtn.textContent='結果OK';

    finalScene.append(title,grid,totalEl,finishBtn);
    reveal.appendChild(finalScene);

    state.records.cardShop[p.id]=total;
    beep(total>=90?1180:total>=70?920:650,190,.05);

    // Final cards stay on screen until the player confirms.
    finishBtn.addEventListener('pointerdown',e=>{
      e.preventDefault();
      finishBtn.disabled=true;
      if(isGameRunValid(runId)){
        recordScreen(
          64,p,humanIndex,
          `${total}<small> POINT</small>`,
          '1パック6枚の合計ポイント'
        );
      }
    },{passive:false,once:true});
  }

  open.addEventListener('pointerdown',e=>{
    e.preventDefault();
    runOpen();
  },{passive:false,once:true});
}


// GAME 66 — モブくんピザ職人
async function startPizzaChef(p,humanIndex,runId){
  gameFit();

  const ingredients=[
    {kind:'tomato',name:'輪切りトマト'},
    {kind:'cheese',name:'チーズ'},
    {kind:'salami',name:'サラミ'},
    {kind:'pepper',name:'輪切りピーマン'},
    {kind:'tomato',name:'輪切りトマト'},
    {kind:'cheese',name:'チーズ'},
    {kind:'salami',name:'サラミ'},
    {kind:'pepper',name:'輪切りピーマン'}
  ];

  let active=false;
  let finished=false;
  let start=0;
  let raf=null;
  let drag=null;
  let launched=0;
  const landed=[];

  screen.innerHTML=`<div class="pizza-shell-v131">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんピザ職人</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TIME</span><b id="pizzaTime131">3.00</b></div>
      <div><span>ON PIZZA</span><b id="pizzaCount131">0 / 8</b></div>
    </div>

    <div id="pizzaStage131" class="pizza-stage-v131">
      <div id="pizza131" class="pizza-cartoon-v131">
        <div class="pizza-sauce-v131"></div>
        <div class="pizza-target-v131"></div>
      </div>

      <div class="oven-v131"><b>OVEN</b><i></i></div>
      <div class="pizza-chef-v131" style="background-image:url('icon/01.png')"></div>

      <div id="pizzaTray131" class="pizza-tray-v131">
        ${ingredients.map((it,i)=>`
          <div class="pizza-piece-wrap-v131" data-i="${i}">
            <div class="ingredient-v131 ing-${it.kind}-v131"></div>
          </div>
        `).join('')}
      </div>

      <div id="pizzaFlyLayer131" class="pizza-fly-layer-v131"></div>

      <div id="pizzaHint131" class="pizza-hint-v131">
        3秒！ 巨大具材をピザへ直接スワイプ！
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('pizzaStage131');
  const pizza=document.getElementById('pizza131');
  const tray=document.getElementById('pizzaTray131');
  const flyLayer=document.getElementById('pizzaFlyLayer131');
  const timeEl=document.getElementById('pizzaTime131');
  const countEl=document.getElementById('pizzaCount131');
  const hint=document.getElementById('pizzaHint131');

  function ingredientNode(kind,cls=''){
    const d=document.createElement('div');
    d.className=`ingredient-v131 ing-${kind}-v131 ${cls}`.trim();
    return d;
  }

  function pizzaPoint(clientX,clientY){
    const r=pizza.getBoundingClientRect();
    return {
      x:clientX-r.left,
      y:clientY-r.top,
      inside:
        clientX>=r.left &&
        clientX<=r.right &&
        clientY>=r.top &&
        clientY<=r.bottom &&
        Math.hypot(
          clientX-(r.left+r.width/2),
          clientY-(r.top+r.height/2)
        )<=r.width*.47
    };
  }

  function scorePizza(){
    if(!landed.length)return 0;

    const completion=landed.length/ingredients.length;
    const R=pizza.clientWidth/2;
    const target=R*.54;

    const radial=landed.reduce((sum,q)=>{
      const d=Math.hypot(q.x-R,q.y-R);
      return sum+clamp(
        100-Math.abs(d-target)/(R*.47)*100,
        0,100
      );
    },0)/landed.length;

    let spread=0;

    if(landed.length>=3){
      const angles=landed.map(q=>{
        let a=Math.atan2(q.y-R,q.x-R);
        if(a<0)a+=Math.PI*2;
        return a;
      }).sort((a,b)=>a-b);

      const ideal=Math.PI*2/angles.length;
      const gaps=angles.map((a,i)=>{
        const b=i===angles.length-1
          ? angles[0]+Math.PI*2
          : angles[i+1];
        return b-a;
      });

      spread=clamp(
        100-
        gaps.reduce((s,g)=>s+Math.abs(g-ideal),0)/
        gaps.length/
        ideal*
        78,
        0,100
      );
    }

    return clamp(
      Math.round(
        completion*62+
        radial*.23+
        spread*.15
      ),
      0,100
    );
  }

  async function finish(){
    if(finished)return;

    finished=true;
    active=false;
    drag=null;
    if(raf)cancelAnimationFrame(raf);

    tray.classList.add('locked-v131');

    const missing=ingredients.length-landed.length;

    hint.textContent=
      missing===0
        ? '全部乗った！ オーブンへ！'
        : `${missing}個間に合わなかった！ オーブンへ！`;

    stage.classList.add('to-oven-v131');
    beep(540,90,.025);

    await wait(620);
    if(!isGameRunValid(runId))return;

    stage.classList.add('baking-v131');
    hint.textContent='こんがり焼いています…';

    for(let i=0;i<5;i++){
      beep(300+i*62,45,.01);
      await wait(155);
    }

    await wait(420);
    if(!isGameRunValid(runId))return;

    stage.classList.remove('to-oven-v131');
    stage.classList.add('baked-v131');

    const score=scorePizza();
    state.records.pizzaChef[p.id]=score;

    hint.textContent=`焼き上がり！ ${score} POINT`;
    beep(score>=90?1080:score>=70?790:500,180,.045);

    await wait(1050);

    if(isGameRunValid(runId)){
      recordScreen(
        65,p,humanIndex,
        `${score}<small>pt</small>`,
        `3秒 / ${landed.length}個トッピング`
      );
    }
  }

  tray.addEventListener('pointerdown',e=>{
    if(!active||finished||drag)return;

    const wrap=e.target.closest('.pizza-piece-wrap-v131');
    if(!wrap||wrap.classList.contains('used-v131'))return;

    e.preventDefault();

    const idx=Number(wrap.dataset.i);
    const item=ingredients[idx];
    const r=wrap.getBoundingClientRect();
    const sr=stage.getBoundingClientRect();

    drag={
      idx,
      item,
      wrap,
      pointerId:e.pointerId,
      startX:r.left+r.width/2,
      startY:r.top+r.height/2,
      ghost:ingredientNode(item.kind,'flying-v131')
    };

    drag.ghost.style.left=`${drag.startX-sr.left}px`;
    drag.ghost.style.top=`${drag.startY-sr.top}px`;
    flyLayer.appendChild(drag.ghost);

    wrap.classList.add('dragging-v131');

    try{wrap.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  tray.addEventListener('pointermove',e=>{
    if(!drag||!active||finished||e.pointerId!==drag.pointerId)return;
    e.preventDefault();

    const sr=stage.getBoundingClientRect();

    drag.ghost.style.left=`${e.clientX-sr.left}px`;
    drag.ghost.style.top=`${e.clientY-sr.top}px`;

    const dx=e.clientX-drag.startX;
    const dy=e.clientY-drag.startY;
    drag.ghost.style.rotate=`${clamp(dx*.35,-42,42)}deg`;
    drag.ghost.style.scale=`${1+clamp(-dy/420,0,.16)}`;
  },{passive:false});

  async function release(e){
    if(!drag||e.pointerId!==drag.pointerId)return;
    e.preventDefault();

    const d=drag;
    drag=null;

    const target=pizzaPoint(e.clientX,e.clientY);

    d.wrap.classList.remove('dragging-v131');
    d.wrap.classList.add('used-v131');

    // The release point itself is the landing point.
    // There is no hidden correction or center attraction.
    const sr=stage.getBoundingClientRect();
    const pr=pizza.getBoundingClientRect();

    if(target.inside){
      const landedEl=ingredientNode(d.item.kind,'landed-v131');
      landedEl.style.left=`${target.x}px`;
      landedEl.style.top=`${target.y}px`;
      pizza.appendChild(landedEl);

      landed.push({x:target.x,y:target.y});
      countEl.textContent=`${landed.length} / 8`;

      d.ghost.animate(
        [
          {
            left:`${parseFloat(d.ghost.style.left)}px`,
            top:`${parseFloat(d.ghost.style.top)}px`,
            scale:'1.08'
          },
          {
            left:`${pr.left-sr.left+target.x}px`,
            top:`${pr.top-sr.top+target.y}px`,
            scale:'.74',
            rotate:'360deg'
          }
        ],
        {
          duration:170,
          easing:'ease-out',
          fill:'forwards'
        }
      );

      beep(620+landed.length*25,34,.012);
    }else{
      d.ghost.classList.add('miss-v131');
      beep(165,45,.012);
    }

    launched++;

    setTimeout(()=>d.ghost.remove(),190);

    if(launched>=ingredients.length){
      await wait(80);
      finish();
    }
  }

  tray.addEventListener('pointerup',release,{passive:false});
  tray.addEventListener('pointercancel',e=>{
    if(!drag||e.pointerId!==drag.pointerId)return;
    drag.ghost.remove();
    drag.wrap.classList.remove('dragging-v131');
    drag=null;
  });

  if(!(await countdown('3 SECOND PIZZA',runId,{transparent:true})))return;

  active=true;
  start=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const rem=3000-(now-start);
    timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);

    if(rem<=0){
      finish();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// GAME 67 — モブくんハンマー！
async function startMobHammer(p,humanIndex,runId){
  gameFit();

  const sequence=['滅','剛','力'];
  let expected=0;
  let energy=0;
  let chain=0;
  let correct=0;
  let wrong=0;
  let active=false;
  let finished=false;
  let start=0;
  let raf=null;

  screen.innerHTML=`<div class="hammer-shell-v131">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんハンマー！</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TIME</span><b id="hammerTime131">5.00</b></div>
      <div><span>ENERGY</span><b id="hammerEnergy131">0%</b></div>
    </div>

    <div id="hammerStage131" class="hammer-stage-v131">
      <div class="hammer-sky-v131"></div>

      <div class="city-v131 left">
        <i class="building-v131 b1"></i>
        <i class="building-v131 b2"></i>
        <i class="building-v131 b3"></i>
      </div>

      <div class="city-v131 right">
        <i class="building-v131 b4"></i>
        <i class="building-v131 b5"></i>
        <i class="building-v131 b6"></i>
      </div>

      <div class="pyramid-wrap-v131">
        <div class="pyramid-v131">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
      </div>

      <div class="hammer-mob-v131" style="background-image:url('icon/01.png')"></div>

      <div id="giantHammer131" class="giant-hammer-v131">
        <i></i><b></b>
      </div>

      <div id="hammerAura131" class="hammer-aura-v131"></div>
      <div id="crater131" class="hammer-crater-v131"></div>
      <div id="shock131" class="hammer-shock-v131"></div>
      <div id="debris131" class="hammer-debris-v131"></div>
      <div id="fissures131" class="hammer-fissures-v131"></div>

      <div id="hammerText131" class="hammer-text-v131">
        滅 → 剛 → 力
      </div>
    </div>

    <div class="hammer-energybar-v131">
      <i id="hammerEnergyBar131"></i>
    </div>

    <div id="hammerKeys131" class="hammer-keys-v131">
      <button type="button" data-char="滅">滅</button>
      <button type="button" data-char="剛">剛</button>
      <button type="button" data-char="力">力</button>
    </div>
  </div>`;

  const stage=document.getElementById('hammerStage131');
  const hammer=document.getElementById('giantHammer131');
  const aura=document.getElementById('hammerAura131');
  const crater=document.getElementById('crater131');
  const shock=document.getElementById('shock131');
  const debris=document.getElementById('debris131');
  const fissures=document.getElementById('fissures131');
  const text=document.getElementById('hammerText131');
  const keys=document.getElementById('hammerKeys131');
  const energyEl=document.getElementById('hammerEnergy131');
  const energyBar=document.getElementById('hammerEnergyBar131');
  const timeEl=document.getElementById('hammerTime131');
  const keyEls=[...keys.querySelectorAll('button')];

  function updateExpected(){
    keyEls.forEach(btn=>{
      btn.classList.toggle(
        'next-v131',
        btn.dataset.char===sequence[expected]
      );
    });
  }

  function updateEnergy(){
    energy=clamp(energy,0,100);
    energyEl.textContent=`${Math.round(energy)}%`;
    energyBar.style.width=`${energy}%`;

    aura.style.opacity=`${.08+energy/110}`;
    aura.style.scale=`${.72+energy/220}`;
  }

  keys.addEventListener('pointerdown',e=>{
    const btn=e.target.closest('button[data-char]');
    if(!btn||!active||finished)return;
    e.preventDefault();

    const wanted=sequence[expected];

    if(btn.dataset.char===wanted){
      correct++;
      chain++;

      energy+=2.15+Math.min(1.05,chain*.055);

      expected=(expected+1)%3;

      btn.classList.remove('good-v131');
      void btn.offsetWidth;
      btn.classList.add('good-v131');

      if(expected===0){
        stage.classList.remove('cycle-v131');
        void stage.offsetWidth;
        stage.classList.add('cycle-v131');
        beep(940,48,.022);
      }else{
        beep(500+expected*130,34,.014);
      }
    }else{
      wrong++;
      chain=0;
      expected=0;
      energy-=10.5;

      btn.classList.remove('bad-v131');
      void btn.offsetWidth;
      btn.classList.add('bad-v131');

      stage.classList.remove('wrong-v131');
      void stage.offsetWidth;
      stage.classList.add('wrong-v131');

      beep(145,68,.025);
    }

    updateExpected();
    updateEnergy();
  },{passive:false});

  async function finalSmash(){
    if(finished)return;

    finished=true;
    active=false;
    if(raf)cancelAnimationFrame(raf);

    keyEls.forEach(b=>b.disabled=true);

    const score=clamp(Math.round(energy),0,100);
    state.records.mobHammer[p.id]=score;

    text.textContent='ENERGY RELEASE!!';
    stage.classList.add('charge-v131');

    await wait(320);
    if(!isGameRunValid(runId))return;

    hammer.classList.add('slam-v131');

    await wait(400);
    if(!isGameRunValid(runId))return;

    crater.classList.add('open-v131');

    const rings=
      score>=95?9:
      score>=85?8:
      score>=70?6:
      score>=50?5:3;

    shock.innerHTML='';
    for(let i=0;i<rings;i++){
      const r=document.createElement('i');
      r.style.setProperty('--size',`${170+i*83+score*2.1}px`);
      r.style.animationDelay=`${i*42}ms`;
      shock.appendChild(r);
    }

    debris.innerHTML='';
    const debrisCount=Math.round(16+score*.44);

    for(let i=0;i<debrisCount;i++){
      const d=document.createElement('i');
      d.style.setProperty('--x',`${rand(-225,225)}px`);
      d.style.setProperty('--y',`${rand(-220,-62)}px`);
      d.style.setProperty('--rot',`${randi(-440,440)}deg`);
      d.style.animationDelay=`${i*8}ms`;
      debris.appendChild(d);
    }

    fissures.innerHTML='';
    for(let i=0;i<Math.round(4+score/13);i++){
      const f=document.createElement('i');
      f.style.setProperty('--r',`${randi(-72,72)}deg`);
      f.style.setProperty('--l',`${70+randi(0,120)}px`);
      fissures.appendChild(f);
    }

    if(score>=55){
      stage.classList.add('collapse-city-v131');
    }

    if(score>=88){
      stage.classList.add('collapse-pyramid-v131');
    }

    if(score>=97){
      stage.classList.add('apocalypse-v131');
    }

    text.textContent=
      score>=97?'滅・剛・力　WORLD BREAK!!!':
      score>=88?'滅・剛・力　PYRAMID BREAK!!':
      score>=70?'滅・剛・力　CITY SMASH!!':
      score>=50?'滅・剛・力　HEAVY SMASH!':
      '滅・剛・力　SMASH!';

    beep(90+score*5.1,260,.07);
    setTimeout(()=>beep(160+score*6.2,210,.045),110);
    setTimeout(()=>beep(90,180,.035),260);

    await wait(1450);

    if(isGameRunValid(runId)){
      recordScreen(
        66,p,humanIndex,
        `${score}<small>pt</small>`,
        `5秒 / 正解${correct}・ミス${wrong}`
      );
    }
  }

  updateExpected();
  updateEnergy();

  if(!(await countdown('滅・剛・力',runId,{transparent:true})))return;

  active=true;
  start=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const elapsed=now-start;
    const rem=5000-elapsed;

    // Small decay keeps 100pt from being trivial while preserving fixed order.
    energy=Math.max(0,energy-.017);
    updateEnergy();

    timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);

    if(rem<=0){
      finalSmash();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// GAME 68 — モブくんバンジー
async function startBungeeMob(p,humanIndex,runId){
  gameFit();let active=false,finished=false,start=0,last=0,raf=null,x=72,y=66;const ground=388,anchor={x:72,y:50};
  screen.innerHTML=`<div class="bungee-shell-v127"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんバンジー</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div id="bungeeStage127" class="bungee-stage-v127"><div class="bungee-platform-v127">JUMP</div><svg class="bungee-svg-v127" viewBox="0 0 360 430" preserveAspectRatio="none"><line id="bungeeCord127" x1="72" y1="50" x2="72" y2="66"/></svg><div id="bungeeMob127" class="bungee-mob-v127" style="background-image:url('icon/01.png')"></div><div class="bungee-ground-v127"></div><div id="bungeeRead127" class="bungee-read-v127">READY</div></div><button id="bungeeStop127" class="primary bungee-stop-v127">STOP!</button></div>`;
  const stage=document.getElementById('bungeeStage127'),mob=document.getElementById('bungeeMob127'),cord=document.getElementById('bungeeCord127'),read=document.getElementById('bungeeRead127'),stop=document.getElementById('bungeeStop127');
  function render(){mob.style.left=`${x/360*100}%`;mob.style.top=`${y}px`;cord.setAttribute('x2',x);const sy=Math.max(0,(y-26)/Math.max(1,stage.clientHeight)*430);cord.setAttribute('y2',sy);}
  async function finish(crash=false){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);stop.disabled=true;const clearance=Math.max(0,ground-(y+31));const score=crash?0:clamp(Math.round(100-Math.abs(clearance-10)*1.55),0,100);state.records.bungeeMob[p.id]=score;if(crash){stage.classList.add('crash-v127');read.textContent='GROUND HIT!';beep(120,180,.05);}else{read.textContent=score>=90?'PERFECT REBOUND!':`${score} POINT`;beep(score>=90?1020:720,160,.04);const baseY=y,amp=clamp(110+score*.9,120,205),bs=performance.now();stage.classList.add('rebound-v127');while(isGameRunValid(runId)){const t=(performance.now()-bs)/1150;if(t>=1)break;y=baseY-Math.sin(t*Math.PI)*amp;render();await wait(16);}y=baseY-18;render();}await wait(650);if(isGameRunValid(runId))recordScreen(67,p,humanIndex,`${score}<small>pt</small>`,crash?'GROUND HIT':`地面まで約${Math.round(clearance)}px`);}
  stop.addEventListener('pointerdown',e=>{e.preventDefault();if(active&&!finished)finish(false);},{passive:false});
  if(!(await countdown('BUNGEE',runId,{transparent:true})))return;active=true;start=last=performance.now();stage.classList.add('jumping-v127');
  function frame(now){if(!active||finished||!isGameRunValid(runId))return;const t=(now-start)/1000;if(t<.28){const q=t/.28;x=72+(180-72)*q;y=66-18*Math.sin(q*Math.PI);mob.style.transform=`translate(-50%,-50%) rotate(${q*180}deg)`;read.textContent='JUMP!';}else{const ft=t-.28;x=180;y=58+Math.pow(ft/1.55,1.30)*(ground-58);mob.style.transform='translate(-50%,-50%) rotate(180deg)';read.textContent=`GROUND ${Math.max(0,Math.round(ground-(y+31)))}px`;}render();if(y+31>=ground){finish(true);return;}raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);
}


// GAME 69 — モブくんウォータースライダー
async function startWaterSlide(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let dir=0;
  let x=50;
  let vx=0;
  let start=0;
  let last=0;
  let raf=null;
  let obstacleHits=0;
  let wallHits=0;
  let wallLock=0;
  let nextObs=.65;
  let nextWave=.85;
  let waveForce=0;
  let waveUntil=0;
  let driftSum=0;
  let samples=0;
  const obstacles=[];

  screen.innerHTML=`<div class="slide-shell-v129">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんウォータースライダー</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TIME</span><b id="slideTime129">10.00</b></div>
      <div><span>HIT</span><b id="slideHit129">0</b></div>
    </div>

    <div id="slideStage129" class="slide-stage-v129">
      <div class="slide-wall-v129 left"></div>
      <div class="slide-wall-v129 right"></div>
      <div class="slide-water-v129"></div>
      <div id="waveBand129" class="wave-band-v129"></div>
      <div id="obstacleLayer129" class="slide-obstacles-v129"></div>
      <div id="sled129" class="slide-sled-v129">
        <i></i>
        <span style="background-image:url('icon/01.png')"></span>
      </div>
      <div id="splash129" class="slide-splash-v129"></div>
    </div>

    <div class="slide-controls-v129">
      <button id="left129">◀ LEFT</button>
      <button id="right129">RIGHT ▶</button>
    </div>
  </div>`;

  const stage=document.getElementById('slideStage129');
  const sled=document.getElementById('sled129');
  const layer=document.getElementById('obstacleLayer129');
  const splash=document.getElementById('splash129');
  const waveBand=document.getElementById('waveBand129');
  const timeEl=document.getElementById('slideTime129');
  const hitEl=document.getElementById('slideHit129');

  function bind(btn,val){
    const press=e=>{
      e.preventDefault();
      if(!active||finished)return;
      dir=val;
      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    };
    const clear=e=>{
      if(e)e.preventDefault();
      if(dir===val)dir=0;
    };

    btn.addEventListener('pointerdown',press,{passive:false});
    btn.addEventListener('pointerup',clear,{passive:false});
    btn.addEventListener('pointercancel',clear);
    btn.addEventListener('lostpointercapture',clear);
  }

  bind(document.getElementById('left129'),-1);
  bind(document.getElementById('right129'),1);

  function splashHit(){
    splash.classList.remove('burst-v129');
    void splash.offsetWidth;
    splash.classList.add('burst-v129');
    sled.classList.remove('bump-v129');
    void sled.offsetWidth;
    sled.classList.add('bump-v129');
  }

  function spawnObstacle(elapsed){
    const count=
      elapsed>6.2&&Math.random()<.48
        ? 2
        : 1;

    const positions=count===2
      ? (Math.random()<.5?[28,68]:[36,76])
      : [randi(24,76)];

    positions.forEach(ox=>{
      const type=['rock','buoy','barrel'][randi(0,2)];
      const el=document.createElement('div');
      el.className=`slide-obstacle-v129 ${type}`;
      el.style.left=`${ox}%`;
      el.style.top='-70px';
      layer.appendChild(el);
      obstacles.push({x:ox,y:-70,el,dead:false});
    });
  }

  function obstacleHit(o){
    if(o.dead)return;
    o.dead=true;
    obstacleHits++;
    hitEl.textContent=obstacleHits+wallHits;
    o.el.classList.add('hit-v129');
    vx+=x<o.x?-12:12;
    splashHit();
    beep(145,90,.03);
  }

  function wallHit(now,side){
    if(now<wallLock)return;
    wallLock=now+430;
    wallHits++;
    hitEl.textContent=obstacleHits+wallHits;
    vx*=-.48;
    x=side<0?15.8:84.2;
    splashHit();
    beep(125,85,.03);
  }

  function finish(){
    if(finished)return;
    finished=true;
    active=false;
    dir=0;
    if(raf)cancelAnimationFrame(raf);

    const avgDrift=samples?driftSum/samples:0;
    const result=clamp(
      Math.round(
        100-
        obstacleHits*13-
        wallHits*8-
        Math.max(0,avgDrift-7)*.7
      ),
      0,100
    );

    state.records.waterSlide[p.id]=result;
    stage.classList.add('finish-v129');
    beep(result>=88?1010:result>=65?730:440,180,.04);

    setTimeout(()=>{
      if(isGameRunValid(runId)){
        recordScreen(
          68,p,humanIndex,
          `${result}<small>pt</small>`,
          `障害物${obstacleHits} / 壁${wallHits}`
        );
      }
    },950);
  }

  if(!(await countdown('WATER SLIDE',runId,{transparent:true})))return;

  active=true;
  start=last=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;
    const elapsed=(now-start)/1000;

    const baseCurrent=
      Math.sin(elapsed*2.05)*18+
      Math.sin(elapsed*.72+1.3)*10;

    if(elapsed>=nextWave){
      waveForce=rand(-36,36);
      waveUntil=elapsed+rand(.42,.68);
      nextWave+=rand(.85,1.30);

      waveBand.classList.remove('show-v129','left-v129','right-v129');
      void waveBand.offsetWidth;
      waveBand.classList.add(
        'show-v129',
        waveForce<0?'left-v129':'right-v129'
      );
      beep(260,45,.01);
    }

    if(elapsed>waveUntil){
      waveForce*=Math.pow(.90,dt*60);
    }

    const current=baseCurrent+waveForce;
    const control=dir*84;

    vx+=(control+current)*dt;
    vx*=Math.pow(.925,dt*60);
    x+=vx*dt;

    driftSum+=Math.abs(current);
    samples++;

    if(x<15.3)wallHit(now,-1);
    if(x>84.7)wallHit(now,1);

    x=clamp(x,14.8,85.2);
    sled.style.left=`${x}%`;
    sled.style.rotate=`${clamp(vx*.55,-14,14)}deg`;

    if(elapsed>=nextObs){
      spawnObstacle(elapsed);
      nextObs+=elapsed>6?.68:elapsed>3?.82:.95;
    }

    const h=stage.clientHeight;
    const playerY=h-84;

    for(const o of obstacles){
      if(o.dead)continue;

      o.y+=(178+elapsed*11)*dt;
      o.el.style.top=`${o.y}px`;

      if(o.y>h+45){
        o.dead=true;
        o.el.remove();
        continue;
      }

      if(
        Math.abs(o.x-x)<10.5&&
        Math.abs(o.y-playerY)<35
      ){
        obstacleHit(o);
      }
    }

    timeEl.textContent=Math.max(0,10-elapsed).toFixed(2);

    if(elapsed>=10){
      finish();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 70 — モブくん巨大パンケーキ
async function startPancakeMob(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let attempt=1;
  let down=null;
  const attemptScores=[];

  screen.innerHTML=`<div class="pancake-shell-v129">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん巨大パンケーキ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TRY</span><b id="cakeTry129">1 / 2</b></div>
      <div><span>PANCAKES</span><b>2枚同時</b></div>
    </div>

    <div id="cakeStage129" class="pancake-stage-v129">
      <div class="pancake-chef-v129" style="background-image:url('icon/01.png')"></div>

      <div id="cakePair129" class="pancake-pair-v129">
        <div id="cakeA129" class="mega-pancake-v129 cake-a-v129"><i></i><b></b></div>
        <div id="cakeB129" class="mega-pancake-v129 cake-b-v129"><i></i><b></b></div>
      </div>

      <div class="pan-v129"></div>

      <div id="cakeMsg129" class="pancake-msg-v129">
        2枚まとめて1回転 → 2枚ともフライパンへ戻そう！
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('cakeStage129');
  const pair=document.getElementById('cakePair129');
  const cakeA=document.getElementById('cakeA129');
  const cakeB=document.getElementById('cakeB129');
  const msg=document.getElementById('cakeMsg129');
  const tryEl=document.getElementById('cakeTry129');

  function resetPair(){
    [cakeA,cakeB].forEach(c=>{
      c.classList.remove('flip-v129','miss-v129','land-v129');
      c.style.removeProperty('--cake-x');
      c.style.removeProperty('--cake-y');
      c.style.removeProperty('--cake-r');
    });
    pair.classList.remove('landing-v129');
    down=null;
  }

  function oneScore(speed,rot,landingX){
    const rotScore=clamp(100-Math.abs(rot-360)/1.55,0,100);
    const speedScore=clamp(100-Math.abs(speed-1.03)/.37*100,0,100);
    const landingScore=clamp(100-Math.abs(landingX)/.64,0,100);

    let score=Math.round(
      rotScore*.40+
      speedScore*.18+
      landingScore*.42
    );

    if(Math.abs(landingX)>82)score=Math.min(score,42);
    if(rot<285||rot>445)score=Math.min(score,48);
    if(speed<.72||speed>1.42)score=Math.min(score,52);

    return clamp(score,0,100);
  }

  stage.addEventListener('pointerdown',e=>{
    if(!active||finished||down)return;
    e.preventDefault();
    down={
      x:e.clientX,
      y:e.clientY,
      t:performance.now(),
      id:e.pointerId
    };
    try{stage.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointerup',async e=>{
    if(!active||finished||!down||e.pointerId!==down.id)return;
    e.preventDefault();

    const dt=Math.max(80,performance.now()-down.t);
    const dx=e.clientX-down.x;
    const dy=e.clientY-down.y;
    down=null;

    if(dy>-90){
      msg.textContent='もっと強く上へスワイプ！';
      beep(165,75,.02);
      return;
    }

    active=false;

    const speed=(-dy)/dt;

    const rotA=clamp(speed*350+8,190,625);
    const rotB=clamp(speed*372-12,190,650);

    const landingA=clamp(
      dx*1.42+
      (speed-1.03)*62-
      17,
      -150,150
    );

    const landingB=clamp(
      dx*1.28+
      (speed-1.00)*72+
      19,
      -150,150
    );

    const scoreA=oneScore(speed,rotA,landingA);
    const scoreB=oneScore(speed,rotB,landingB);

    let tryScore=Math.round((scoreA+scoreB)/2);
    tryScore=Math.min(tryScore,Math.min(scoreA,scoreB)+28);
    tryScore=clamp(tryScore,0,100);

    const heightA=-clamp(170+speed*108,190,300);
    const heightB=-clamp(150+speed*126,185,310);

    cakeA.style.setProperty('--cake-x',`${landingA}px`);
    cakeA.style.setProperty('--cake-y',`${heightA}px`);
    cakeA.style.setProperty('--cake-r',`${rotA}deg`);

    cakeB.style.setProperty('--cake-x',`${landingB}px`);
    cakeB.style.setProperty('--cake-y',`${heightB}px`);
    cakeB.style.setProperty('--cake-r',`${rotB}deg`);

    cakeA.classList.add('flip-v129');
    cakeB.classList.add('flip-v129');

    msg.textContent=`TRY ${attempt}！ 2枚が飛んだ！`;
    beep(520,85,.025);

    await wait(1200);
    if(!isGameRunValid(runId))return;

    cakeA.classList.add(Math.abs(landingA)<=82?'land-v129':'miss-v129');
    cakeB.classList.add(Math.abs(landingB)<=82?'land-v129':'miss-v129');
    pair.classList.add('landing-v129');

    attemptScores.push(tryScore);

    msg.textContent=
      tryScore>=90
        ? `2枚ともPERFECT！ ${tryScore}pt`
        : `A ${scoreA} / B ${scoreB} → ${tryScore}pt`;

    beep(tryScore>=90?1040:tryScore>=65?730:430,160,.04);

    await wait(850);
    if(!isGameRunValid(runId))return;

    if(attempt<2){
      attempt++;
      tryEl.textContent=`${attempt} / 2`;
      resetPair();
      msg.textContent='TRY 2！ もう一度2枚まとめてひっくり返せ！';
      active=true;
      return;
    }

    finished=true;
    const finalScore=Math.round(
      (attemptScores[0]+attemptScores[1])/2
    );

    state.records.pancakeMob[p.id]=finalScore;
    msg.textContent=`2回平均 ${finalScore} POINT`;

    await wait(850);
    if(isGameRunValid(runId)){
      recordScreen(
        69,p,humanIndex,
        `${finalScore}<small>pt</small>`,
        `TRY1 ${attemptScores[0]} / TRY2 ${attemptScores[1]}`
      );
    }
  },{passive:false});

  stage.addEventListener('pointercancel',()=>down=null);

  if(!(await countdown('2×2 PANCAKES',runId,{transparent:true})))return;
  active=true;
}

// GAME 71 — モブくん紙飛行機研究所
async function startPaperPlane(p,humanIndex,runId){
  gameFit();let active=false,drawing=false,finished=false,start=0,raf=null,strokes=[],current=null;
  screen.innerHTML=`<div class="plane-shell-v127"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん紙飛行機研究所</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="v125-hud"><div><span>DRAW WINGS</span><b id="planeTime127">5.00</b></div><div><span>BODY</span><b>完成済み</b></div></div><div id="planeStage127" class="plane-stage-v127"><svg id="planeSvg127" viewBox="0 0 360 360" preserveAspectRatio="none"><path class="plane-body-pre-v127" d="M180 45 L202 230 L190 314 L180 330 L170 314 L158 230 Z"/><path class="plane-tail-pre-v127" d="M170 250 L128 305 L172 292 M190 250 L232 305 L188 292"/><circle cx="180" cy="190" r="10" class="plane-joint-pre-v127"/></svg><div class="wing-zone-v127 left">LEFT WING</div><div class="wing-zone-v127 right">RIGHT WING</div><div id="planeMsg127" class="plane-msg-v127">胴体と尾翼は完成済み。翼だけ描こう！</div></div><div id="planeFlight127" class="plane-flight-v127" hidden><div class="flight-clouds-v127"></div><div id="planeClone127" class="plane-clone-v127"></div><div id="planeMeter127" class="plane-meter-v127">0m</div></div></div>`;
  const stage=document.getElementById('planeStage127'),svg=document.getElementById('planeSvg127'),timeEl=document.getElementById('planeTime127'),msg=document.getElementById('planeMsg127'),flight=document.getElementById('planeFlight127'),clone=document.getElementById('planeClone127'),meter=document.getElementById('planeMeter127');
  function local(e){const r=stage.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/r.width*360,0,360),y:clamp((e.clientY-r.top)/r.height*360,0,360)};}
  function addStroke(s){const pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');pl.setAttribute('class','plane-wing-draw-v127');pl.setAttribute('points',s.map(q=>`${q.x},${q.y}`).join(' '));svg.appendChild(pl);return pl;}
  stage.addEventListener('pointerdown',e=>{if(!active||finished)return;e.preventDefault();drawing=true;current=[local(e)];current._el=addStroke(current);strokes.push(current);try{stage.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});
  stage.addEventListener('pointermove',e=>{if(!drawing||!active||finished)return;e.preventDefault();const q=local(e),a=current[current.length-1];if(Math.hypot(q.x-a.x,q.y-a.y)<4)return;current.push(q);current._el.setAttribute('points',current.map(p=>`${p.x},${p.y}`).join(' '));},{passive:false});
  stage.addEventListener('pointerup',()=>{drawing=false;current=null});stage.addEventListener('pointercancel',()=>{drawing=false;current=null});
  function scorePlane(){const pts=strokes.flatMap(s=>s.filter(q=>q&&typeof q.x==='number'));if(pts.length<8)return 0;const L=pts.filter(q=>q.x<180),R=pts.filter(q=>q.x>180);if(!L.length||!R.length)return 8;const spreadL=180-Math.min(...L.map(q=>q.x)),spreadR=Math.max(...R.map(q=>q.x))-180;const symmetry=clamp(100-Math.abs(spreadL-spreadR)*1.1,0,100);const spread=clamp((spreadL+spreadR)/220*100,0,100);const connect=clamp(pts.filter(q=>Math.abs(q.x-180)<28).length/8*100,0,100);let len=0;for(const s of strokes)for(let i=1;i<s.length;i++)len+=Math.hypot(s[i].x-s[i-1].x,s[i].y-s[i-1].y);const detail=clamp(len/540*100,0,100);return clamp(Math.round(symmetry*.34+spread*.30+connect*.20+detail*.16),0,100);}
  async function finish(){if(finished)return;finished=true;active=false;drawing=false;if(raf)cancelAnimationFrame(raf);const distance=scorePlane();state.records.paperPlane[p.id]=distance;const drawingSvg=svg.outerHTML;stage.hidden=true;flight.hidden=false;clone.innerHTML=drawingSvg;msg.textContent='';const fs=performance.now(),duration=2500;while(isGameRunValid(runId)){const t=clamp((performance.now()-fs)/duration,0,1);clone.style.left=`${18+t*64}%`;clone.style.top=`${58-Math.sin(t*Math.PI)*28-t*12}%`;clone.style.transform=`translate(-50%,-50%) rotate(${-8-Math.sin(t*Math.PI)*8}deg) scale(${.78-t*.18})`;meter.textContent=`${Math.round(distance*t)}m`;if(t>=1)break;await wait(16);}beep(distance>=85?1020:distance>=60?760:490,170,.04);await wait(500);if(isGameRunValid(runId))recordScreen(70,p,humanIndex,`${distance}<small>m</small>`,'描いた紙飛行機の飛距離');}
  if(!(await countdown('DRAW WINGS',runId,{transparent:true})))return;active=true;start=performance.now();function frame(now){if(!active||finished||!isGameRunValid(runId))return;const rem=5000-(now-start);timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);if(rem<=0){finish();return;}raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);
}


// GAME 72 — モブくんドミノ職人
async function startTankMob(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let start=0;
  let last=0;
  let raf=null;
  let nextSpawn=0;
  let kills=0;
  let breaches=0;
  let swipe=null;
  let lastShotAt=0;

  const enemies=[];
  const bullets=[];

  screen.innerHTML=`<div class="tank-shell-v132">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん戦車に乗る</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TIME</span><b id="tankTime132">10.00</b></div>
      <div><span>KO</span><b id="tankKills132">0</b></div>
    </div>

    <div class="tank-help-v132">画面をフリック → 上・下・左・右へ砲撃</div>

    <div id="tankStage132" class="tank-stage-v132">
      <div class="tank-grid-v132"></div>

      <div id="tank132" class="tank-v132">
        <div id="tankTurret132" class="tank-turret-v132"><i></i></div>
        <div class="tank-body-v132"></div>
        <div class="tank-mob-v132" style="background-image:url('icon/01.png')"></div>
      </div>

      <div id="tankEnemyLayer132" class="tank-enemy-layer-v132"></div>
      <div id="tankBulletLayer132" class="tank-bullet-layer-v132"></div>
      <div id="tankBurstLayer132" class="tank-burst-layer-v132"></div>
    </div>
  </div>`;

  const stage=document.getElementById('tankStage132');
  const tank=document.getElementById('tank132');
  const turret=document.getElementById('tankTurret132');
  const enemyLayer=document.getElementById('tankEnemyLayer132');
  const bulletLayer=document.getElementById('tankBulletLayer132');
  const burstLayer=document.getElementById('tankBurstLayer132');
  const timeEl=document.getElementById('tankTime132');
  const killEl=document.getElementById('tankKills132');

  const dirs={
    up:{x:0,y:-1,angle:0},
    right:{x:1,y:0,angle:90},
    down:{x:0,y:1,angle:180},
    left:{x:-1,y:0,angle:270}
  };

  function center(){
    return{x:stage.clientWidth/2,y:stage.clientHeight/2};
  }

  function fire(direction,now){
    if(!active||finished||now-lastShotAt<100)return;
    lastShotAt=now;

    const d=dirs[direction];
    const c=center();

    turret.style.transform=`translate(-50%,-50%) rotate(${d.angle}deg)`;

    const el=document.createElement('i');
    el.className='tank-shell-shot-v132';
    bulletLayer.appendChild(el);

    bullets.push({
      x:c.x+d.x*45,
      y:c.y+d.y*45,
      vx:d.x*475,
      vy:d.y*475,
      el,
      dead:false
    });

    tank.classList.remove('recoil-v132');
    void tank.offsetWidth;
    tank.classList.add('recoil-v132');

    beep(180,40,.02);
  }

  function spawnEnemy(elapsed){
    const side=randi(0,3);
    const c=center();
    const r=20+randi(0,5);

    let x=c.x,y=c.y,vx=0,vy=0;

    const speed=60+elapsed*6.2+rand(-3,7);

    if(side===0){y=-r;vy=speed;}
    if(side===1){x=stage.clientWidth+r;vx=-speed;}
    if(side===2){y=stage.clientHeight+r;vy=-speed;}
    if(side===3){x=-r;vx=speed;}

    const el=document.createElement('div');
    el.className=`tank-slime-v132 s${randi(0,3)}`;
    el.innerHTML='<i></i><b></b>';
    enemyLayer.appendChild(el);

    enemies.push({x,y,vx,vy,r,el,dead:false});
  }

  function explode(x,y,strong=false){
    const el=document.createElement('div');
    el.className=`tank-burst-v132 ${strong?'strong-v132':''}`;
    el.style.left=`${x}px`;
    el.style.top=`${y}px`;
    burstLayer.appendChild(el);
    setTimeout(()=>el.remove(),430);
  }

  function kill(enemy){
    if(enemy.dead)return;
    enemy.dead=true;
    kills++;
    killEl.textContent=kills;
    enemy.el.remove();
    explode(enemy.x,enemy.y);
    beep(520+kills%5*45,30,.01);
  }

  function breach(enemy){
    if(enemy.dead)return;
    enemy.dead=true;
    breaches++;
    enemy.el.remove();

    const c=center();
    explode(c.x,c.y,true);

    tank.classList.remove('hit-v132');
    void tank.offsetWidth;
    tank.classList.add('hit-v132');

    beep(115,70,.022);
  }

  stage.addEventListener('pointerdown',e=>{
    if(!active||finished)return;
    e.preventDefault();

    swipe={x:e.clientX,y:e.clientY,id:e.pointerId};
    try{stage.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  stage.addEventListener('pointerup',e=>{
    if(!active||finished||!swipe||e.pointerId!==swipe.id)return;
    e.preventDefault();

    const dx=e.clientX-swipe.x;
    const dy=e.clientY-swipe.y;
    const dist=Math.hypot(dx,dy);
    swipe=null;

    if(dist<20)return;

    const direction=
      Math.abs(dx)>Math.abs(dy)
        ? dx>0?'right':'left'
        : dy>0?'down':'up';

    fire(direction,performance.now());
  },{passive:false});

  stage.addEventListener('pointercancel',()=>swipe=null);

  async function finish(){
    if(finished)return;
    finished=true;
    active=false;
    if(raf)cancelAnimationFrame(raf);

    state.records.tankMob[p.id]=kills;
    stage.classList.add('clear-v132');

    beep(kills>=30?1040:kills>=20?760:480,180,.04);
    await wait(850);

    if(isGameRunValid(runId)){
      recordScreen(71,p,humanIndex,`${kills}<small>体</small>`,`10秒 / 侵入${breaches}体`);
    }
  }

  if(!(await countdown('TANK BATTLE',runId,{transparent:true})))return;

  active=true;
  start=last=performance.now();
  nextSpawn=performance.now()+180;

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;
    const elapsed=(now-start)/1000;

    const spawnGap=clamp(500-elapsed*34,160,500);

    if(now>=nextSpawn){
      spawnEnemy(elapsed);

      if(elapsed>5.2&&Math.random()<.40){
        setTimeout(()=>{
          if(active&&!finished&&isGameRunValid(runId))spawnEnemy(elapsed);
        },85);
      }

      nextSpawn=now+spawnGap;
    }

    const c=center();

    for(const bullet of bullets){
      if(bullet.dead)continue;

      bullet.x+=bullet.vx*dt;
      bullet.y+=bullet.vy*dt;
      bullet.el.style.left=`${bullet.x}px`;
      bullet.el.style.top=`${bullet.y}px`;

      if(
        bullet.x<-30||bullet.y<-30||
        bullet.x>stage.clientWidth+30||
        bullet.y>stage.clientHeight+30
      ){
        bullet.dead=true;
        bullet.el.remove();
        continue;
      }

      for(const enemy of enemies){
        if(enemy.dead)continue;

        if(Math.hypot(bullet.x-enemy.x,bullet.y-enemy.y)<enemy.r+9){
          bullet.dead=true;
          bullet.el.remove();
          kill(enemy);
          break;
        }
      }
    }

    for(const enemy of enemies){
      if(enemy.dead)continue;

      enemy.x+=enemy.vx*dt;
      enemy.y+=enemy.vy*dt;
      enemy.el.style.left=`${enemy.x}px`;
      enemy.el.style.top=`${enemy.y}px`;

      if(Math.hypot(enemy.x-c.x,enemy.y-c.y)<43){
        breach(enemy);
      }
    }

    timeEl.textContent=Math.max(0,10-elapsed).toFixed(2);

    if(elapsed>=10){
      finish();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// GAME 74 — モブくん氷上カーリング
async function startCurlingMob(p,humanIndex,runId){
  gameFit();let active=false,down=null,finished=false;
  screen.innerHTML=`<div class="v126-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん氷上カーリング</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div id="curlStageV126" class="curl-stage-v126"><div class="curl-ice-lines-v126"></div><div class="curl-house-v126"><i></i><b></b><em></em></div><div id="curlTrailV126" class="curl-trail-v126"></div><div id="curlStoneV126" class="curl-stone-v126"><span style="background-image:url('icon/01.png')"></span></div><div class="curl-sweep-v126"><i></i><i></i></div><div id="curlMsgV126" class="curl-msg-v126">上へ1回スワイプ！ 中央を狙え！</div></div></div>`;
  const stage=document.getElementById("curlStageV126"),stone=document.getElementById("curlStoneV126"),trail=document.getElementById("curlTrailV126"),msg=document.getElementById("curlMsgV126");
  stage.addEventListener("pointerdown",e=>{if(!active||finished)return;e.preventDefault();down={x:e.clientX,y:e.clientY,t:performance.now(),id:e.pointerId};try{stage.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});
  stage.addEventListener("pointerup",e=>{if(!active||finished||!down||e.pointerId!==down.id)return;e.preventDefault();const dt=Math.max(90,performance.now()-down.t),dx=e.clientX-down.x,dy=e.clientY-down.y;down=null;if(dy>-55){msg.textContent="もっと上へスワイプ！";beep(170,70,.018);return;}finished=true;active=false;const speed=(-dy)/dt,travel=clamp(speed*285,110,410),xShift=clamp(dx*1.18,-135,135),dist=Math.hypot(xShift,travel-300),score=clamp(Math.round(100-dist/135*100),0,100);state.records.curlingMob[p.id]=score;stone.style.setProperty("--curl-x",`${xShift}px`);stone.style.setProperty("--curl-y",`${-travel}px`);trail.style.setProperty("--trail-x",`${xShift}px`);trail.style.setProperty("--trail-y",`${-travel}px`);stage.classList.add("curl-action-v126");stone.classList.add("slide-v126");trail.classList.add("show-v126");beep(500,70,.02);setTimeout(()=>{stage.classList.add("curl-house-impact-v126");msg.textContent=score>=95?"BUTTON!!":score>=75?"NICE SHOT!":`${score} POINT`;beep(score>=90?1080:score>=65?760:450,180,.045);},900);setTimeout(()=>{if(isGameRunValid(runId))recordScreen(72,p,humanIndex,`${score}<small>pt</small>`,"ハウス中心への精度");},1500);},{passive:false});
  if(!(await countdown("CURLING",runId,{transparent:true})))return;active=true;
}


// GAME 75 — モブくん巨大シャボン玉
async function startBubbleMob(p,humanIndex,runId){
  gameFit();

  let active=false;
  let holding=false;
  let finished=false;
  let last=0;
  let raf=null;
  let radius=25;
  let pressure=0;

  const limit=rand(118,148);

  screen.innerHTML=`<div class="bubble-shell-v129">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん巨大シャボン玉</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div id="bubbleStage129" class="bubble-stage-v129">
      <div id="bubble129" class="bubble-v129"></div>

      <div id="bubbleMob129" class="bubble-mob-v129" style="background-image:url('icon/01.png')">
        <i class="bubble-wand-v129"></i>
      </div>

      <div id="bubbleSignal129" class="bubble-signal-v129"></div>
    </div>

    <button id="bubbleBtn129" class="primary bubble-button-v129">
      BLOW / 長押し
    </button>
  </div>`;

  const stage=document.getElementById('bubbleStage129');
  const mob=document.getElementById('bubbleMob129');
  const bubble=document.getElementById('bubble129');
  const signal=document.getElementById('bubbleSignal129');
  const btn=document.getElementById('bubbleBtn129');

  function scoreNow(){
    const ratio=radius/limit;

    if(ratio<=.70){
      return clamp(
        Math.round(ratio/.70*42),
        0,42
      );
    }

    return clamp(
      Math.round(
        42+
        (ratio-.70)/.295*58
      ),
      0,100
    );
  }

  async function release(){
    if(!active||finished)return;

    holding=false;
    finished=true;
    active=false;

    if(raf)cancelAnimationFrame(raf);

    mob.classList.remove('blowing-v129');

    const score=scoreNow();
    state.records.bubbleMob[p.id]=score;

    bubble.classList.add('float-v129');
    signal.textContent=`${score}pt`;

    beep(score>=94?1080:score>=72?760:470,170,.04);

    await wait(1000);

    if(isGameRunValid(runId)){
      recordScreen(
        73,p,humanIndex,
        `${score}<small>pt</small>`,
        'シャボン玉サイズ'
      );
    }
  }

  async function burst(){
    if(finished)return;

    finished=true;
    active=false;
    holding=false;

    if(raf)cancelAnimationFrame(raf);

    mob.classList.remove('blowing-v129');

    state.records.bubbleMob[p.id]=0;
    bubble.classList.add('burst-v129');
    stage.classList.add('pop-stage-v129');
    signal.textContent='!!!';

    beep(115,190,.05);

    await wait(780);

    if(isGameRunValid(runId)){
      recordScreen(
        73,p,humanIndex,
        '0<small>pt</small>',
        'BURST'
      );
    }
  }

  btn.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(active&&!finished){
      holding=true;
      mob.classList.add('blowing-v129');
      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    }
  },{passive:false});

  const releasePointer=e=>{
    if(e)e.preventDefault();
    if(holding&&!finished)release();
  };

  btn.addEventListener('pointerup',releasePointer,{passive:false});
  btn.addEventListener('pointercancel',()=>{if(holding&&!finished)release();});
  btn.addEventListener('lostpointercapture',()=>{if(holding&&!finished)release();});

  if(!(await countdown('BUBBLE',runId,{transparent:true})))return;

  active=true;
  last=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;

    if(holding){
      pressure+=dt;

      radius+=(
        31+
        radius*.27+
        Math.sin(pressure*9.5)*5
      )*dt;

      if(Math.random()<dt*1.35){
        radius+=rand(1.0,3.8);
      }
    }

    const ratio=radius/limit;
    bubble.style.width=bubble.style.height=`${radius*2}px`;

    if(ratio>.86){
      bubble.classList.add('wobble-v129');
    }

    if(ratio>.955){
      signal.textContent='!!';
      signal.classList.add('show-v129');
    }else if(ratio>.89){
      signal.textContent='!';
      signal.classList.add('show-v129');
    }else{
      signal.textContent='';
      signal.classList.remove('show-v129');
    }

    if(radius>=limit){
      burst();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}

// GAME 76 — モブくん何が変わった？
async function startChangeMob(p,humanIndex,runId){
  gameFit();const props=['lamp','plant','clock','book','chair','radio','cup','picture','sofa'];const changeIndex=randi(0,props.length-1);let active=false,changed=false,finished=false,startAnswer=0;
  screen.innerHTML=`<div class="change-shell-v127"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん何が変わった？</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="change-note-v127" id="changeNote127">3秒で部屋を覚えて！</div><div id="room127" class="room-v127"><div class="room-wall-v127"><div class="room-window-v127"></div><div class="room-rug-v127"></div></div>${props.map((t,i)=>`<button type="button" data-i="${i}" class="room-prop-v127 p${i}"><i class="room-icon-v126 ${t}"></i></button>`).join('')}<div class="room-mob-v127" style="background-image:url('icon/01.png')"></div><div id="roomWipe127" class="room-wipe-v127"></div></div></div>`;
  const room=document.getElementById('room127'),note=document.getElementById('changeNote127'),wipe=document.getElementById('roomWipe127');
  room.addEventListener('pointerdown',e=>{if(!active||!changed||finished)return;const b=e.target.closest('button[data-i]');if(!b)return;e.preventDefault();finished=true;active=false;const chosen=Number(b.dataset.i);let sc=0;if(chosen===changeIndex){const t=performance.now()-startAnswer;sc=clamp(Math.round(100-Math.max(0,t-650)/48),45,100);b.classList.add('correct-v127');note.textContent=`正解！ ${sc} POINT`;beep(1030,160,.045);}else{b.classList.add('wrong-v127');room.querySelector(`[data-i="${changeIndex}"]`)?.classList.add('answer-v127');note.textContent='違う！ 正解はここ';beep(160,150,.04);}state.records.changeMob[p.id]=sc;setTimeout(()=>{if(isGameRunValid(runId))recordScreen(74,p,humanIndex,`${sc}<small>pt</small>`,chosen===changeIndex?'CHANGE FOUND':'MISS');},850);},{passive:false});
  if(!(await countdown('ROOM',runId,{transparent:true})))return;await wait(3000);if(!isGameRunValid(runId))return;wipe.classList.add('show-v127');await wait(330);if(!isGameRunValid(runId))return;const target=room.querySelector(`[data-i="${changeIndex}"] .room-icon-v126`);target.classList.add('alt-v127');changed=true;await wait(180);wipe.classList.remove('show-v127');note.textContent='何が変わった？';active=true;startAnswer=performance.now();
}


// GAME 77 — モブくん荷物検査
async function startBaggageMob(p,humanIndex,runId){
  gameFit();

  const BOX_COUNT=8;
  const boxes=[];

  const targetIndex=randi(2,6);
  const questionCandidates=shuffle(
    Array.from({length:BOX_COUNT},(_,i)=>i)
      .filter(i=>i!==targetIndex)
  );

  const questionSet=new Set(
    questionCandidates.slice(0,randi(1,3))
  );

  let active=false;
  let finished=false;
  let used=false;
  let targetShown=false;
  let targetAt=0;
  let start=0;
  let last=0;
  let raf=null;

  screen.innerHTML=`<div class="bag-flow-shell-v131">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん荷物検査</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>BOX</span><b>8</b></div>
      <div><span>RECORD</span><b id="bagRecord131">---</b></div>
    </div>

    <div id="bagStage131" class="bag-flow-stage-v131">
      <div class="bag-belt-v131"></div>
      <div id="bagBoxes131" class="bag-box-layer-v131"></div>

      <div id="bagGate131" class="bag-gate-v131">
        <b>MOB</b>
        <span>CHECK</span>
        <i></i>
      </div>
    </div>

    <button id="bagDetect131" class="detect-v131">
      DETECT
    </button>
  </div>`;

  const stage=document.getElementById('bagStage131');
  const layer=document.getElementById('bagBoxes131');
  const gate=document.getElementById('bagGate131');
  const detect=document.getElementById('bagDetect131');
  const recordEl=document.getElementById('bagRecord131');

  function reactionScore(ms){
    if(ms<=105)return 100;
    if(ms<=130)return 98;
    if(ms<=155)return 95;
    if(ms<=185)return 90;
    if(ms<=235)return 82;
    if(ms<=310)return 68;
    if(ms<=420)return 48;
    if(ms<=560)return 25;
    return 0;
  }

  function makeBox(i){
    const el=document.createElement('div');
    el.className='flow-box-v131';
    el.innerHTML=`
      <div class="flow-box-art-v131"><i></i><b></b></div>
      <div class="flow-symbol-v131"></div>
    `;
    layer.appendChild(el);

    return{
      index:i,
      x:-60-i*112,
      y:0,
      el,
      symbol:el.querySelector('.flow-symbol-v131'),
      mark:
        i===targetIndex
          ? '!'
          : questionSet.has(i)
            ? '?'
            : '',
      markShown:false,
      markGone:false
    };
  }

  for(let i=0;i<BOX_COUNT;i++){
    boxes.push(makeBox(i));
  }

  async function end(score,detail,good){
    if(finished)return;

    finished=true;
    active=false;
    detect.disabled=true;
    if(raf)cancelAnimationFrame(raf);

    state.records.baggageMob[p.id]=score;
    stage.classList.add(good?'success-v131':'fail-v131');

    beep(good?(score>=95?1060:760):145,175,.04);

    await wait(900);

    if(isGameRunValid(runId)){
      recordScreen(
        75,p,humanIndex,
        `${score}<small>pt</small>`,
        detail
      );
    }
  }

  detect.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(!active||finished||used)return;

    used=true;
    detect.disabled=true;

    if(targetShown){
      const ms=performance.now()-targetAt;
      const score=reactionScore(ms);

      recordEl.textContent=`${Math.round(ms)}ms`;

      const target=boxes[targetIndex];
      target.symbol.classList.add('hit-v131');

      end(
        score,
        `！から ${Math.round(ms)}ms`,
        score>0
      );
    }else{
      recordEl.textContent='FOUL';

      end(
        0,
        '！より前に押した',
        false
      );
    }
  },{passive:false});

  if(!(await countdown('BAGGAGE CHECK',runId,{transparent:true})))return;

  active=true;
  start=last=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;

    const elapsed=(now-start)/1000;
    const stageW=stage.clientWidth;
    const speed=205+Math.min(25,elapsed*3.5);

    const gateCenter=stageW*.74;
    const markHalf=31;

    let allPassed=true;

    for(const box of boxes){
      if(box.x<stageW+90){
        allPassed=false;
      }

      box.x+=speed*dt;
      box.el.style.left=`${box.x}px`;
      box.el.style.top='58%';

      const atGate=
        Math.abs(box.x-gateCenter)<=markHalf;

      if(atGate&&box.mark&&!box.markShown){
        box.markShown=true;
        box.symbol.textContent=box.mark;
        box.symbol.classList.add(
          'show-v131',
          box.mark==='!'?'target-v131':'question-v131'
        );

        gate.classList.add('scan-v131');
        setTimeout(()=>gate.classList.remove('scan-v131'),140);

        if(box.mark==='!'){
          targetShown=true;
          targetAt=now;
          beep(900,48,.026);
        }else{
          beep(310,28,.006);
        }
      }

      if(!atGate&&box.markShown&&!box.markGone&&box.x>gateCenter+markHalf){
        box.markGone=true;
        box.symbol.classList.remove('show-v131');

        if(box.mark==='!'){
          targetShown=false;

          if(!used){
            recordEl.textContent='MISS';
            end(0,'！を見逃した',false);
            return;
          }
        }
      }
    }

    if(allPassed&&!finished){
      end(0,'TIME UP',false);
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// GAME 78 — モブくん橋を作って！
async function startBridgeMob(p,humanIndex,runId){
  gameFit();let active=false,drawing=false,finished=false,start=0,raf=null,strokes=[],current=null;
  screen.innerHTML=`<div class="bridge-shell-v127"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん橋を作って！</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="v125-hud"><div><span>DRAW</span><b id="bridgeTime127">7.00</b></div><div><span>GOAL</span><b>安全 + FUN</b></div></div><div id="bridgeStage127" class="bridge-stage-v127"><div class="bridge-cliff-v127 left">START</div><div class="bridge-cliff-v127 right">GOAL</div><div class="bridge-water-v127"></div><svg id="bridgeSvg127" viewBox="0 0 360 360" preserveAspectRatio="none"></svg><div id="bridgeMob127" class="bridge-mob-v127" style="background-image:url('icon/01.png')"></div><div id="bridgeFun127" class="bridge-fun-v127"></div><div id="bridgeMsg127" class="bridge-msg-v127">何本描いてもOK！ 床・手すり・支柱でモブくんを楽しませよう</div></div></div>`;
  const stage=document.getElementById('bridgeStage127'),svg=document.getElementById('bridgeSvg127'),mob=document.getElementById('bridgeMob127'),funEl=document.getElementById('bridgeFun127'),timeEl=document.getElementById('bridgeTime127'),msg=document.getElementById('bridgeMsg127');
  function local(e){const r=stage.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/r.width*360,0,360),y:clamp((e.clientY-r.top)/r.height*360,0,360)};}
  stage.addEventListener('pointerdown',e=>{if(!active||finished)return;e.preventDefault();drawing=true;current=[local(e)];const pl=document.createElementNS('http://www.w3.org/2000/svg','polyline');pl.setAttribute('class','bridge-stroke-v127');svg.appendChild(pl);current._el=pl;strokes.push(current);try{stage.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});
  stage.addEventListener('pointermove',e=>{if(!drawing||!active||finished)return;e.preventDefault();const q=local(e),a=current[current.length-1];if(Math.hypot(q.x-a.x,q.y-a.y)<3)return;current.push(q);current._el.setAttribute('points',current.map(p=>`${p.x},${p.y}`).join(' '));},{passive:false});
  stage.addEventListener('pointerup',()=>{drawing=false;current=null});stage.addEventListener('pointercancel',()=>{drawing=false;current=null});
  function metrics(){const valid=strokes.filter(s=>s.length>2);if(!valid.length)return null;const info=valid.map(s=>{const xs=s.map(q=>q.x);return{s,span:Math.max(...xs)-Math.min(...xs)}}).sort((a,b)=>b.span-a.span);let deck=[...info[0].s];if(deck[0].x>deck[deck.length-1].x)deck.reverse();const A={x:42,y:226},B={x:318,y:226};const sd=Math.hypot(deck[0].x-A.x,deck[0].y-A.y),ed=Math.hypot(deck[deck.length-1].x-B.x,deck[deck.length-1].y-B.y);let rough=0;for(let i=2;i<deck.length;i++){const a=Math.atan2(deck[i-1].y-deck[i-2].y,deck[i-1].x-deck[i-2].x),b=Math.atan2(deck[i].y-deck[i-1].y,deck[i].x-deck[i-1].x);rough+=Math.abs(Math.atan2(Math.sin(b-a),Math.cos(b-a)));}const spanScore=clamp(info[0].span/250*100,0,100),connect=clamp(100-(sd+ed)*.45,30,100),smooth=clamp(100-rough/Math.max(1,deck.length-2)*42,25,100);let extraLen=0;valid.slice(1).forEach(s=>{for(let i=1;i<s.length;i++)extraLen+=Math.hypot(s[i].x-s[i-1].x,s[i].y-s[i-1].y)});const fun=clamp(Math.round((valid.length-1)*8+extraLen/45),0,100);const safety=clamp(Math.round(spanScore*.40+connect*.34+smooth*.26),0,100);return{deck,A,B,safety,fun,total:clamp(Math.round(safety*.76+fun*.24),0,100),span:info[0].span};}
  async function finish(){if(finished)return;finished=true;active=false;drawing=false;if(raf)cancelAnimationFrame(raf);const m=metrics();if(!m||m.span<120){state.records.bridgeMob[p.id]=0;msg.textContent='左右をつなぐ床を描こう！';await wait(500);if(isGameRunValid(runId))recordScreen(76,p,humanIndex,'0<small>pt</small>','NO BRIDGE');return;}const walk=[m.A,...m.deck,m.B];state.records.bridgeMob[p.id]=m.total;msg.textContent=`安全 ${m.safety} / FUN ${m.fun}　渡ります！`;let lastFun=false;for(let i=0;i<walk.length;i+=Math.max(1,Math.floor(walk.length/46))){if(!isGameRunValid(runId))return;const q=walk[Math.min(i,walk.length-1)];mob.style.left=`${q.x/360*100}%`;mob.style.top=`${q.y/360*100}%`;mob.classList.toggle('hop-v127',i%4===0);if(!lastFun&&i>walk.length*.45&&m.fun>=18){lastFun=true;funEl.textContent='FUN! ★';funEl.classList.add('show-v127');beep(880,70,.018);}await wait(78);}mob.style.left=`${m.B.x/360*100}%`;mob.style.top=`${m.B.y/360*100}%`;stage.classList.add('clear-v127');msg.textContent=`モブくん大満足！ ${m.total} POINT`;beep(m.total>=80?1060:760,180,.045);await wait(850);if(isGameRunValid(runId))recordScreen(76,p,humanIndex,`${m.total}<small>pt</small>`,`安全${m.safety} / FUN${m.fun}`);}
  if(!(await countdown('BUILD BRIDGE',runId,{transparent:true})))return;active=true;start=performance.now();function frame(now){if(!active||finished||!isGameRunValid(runId))return;const rem=7000-(now-start);timeEl.textContent=(Math.max(0,rem)/1000).toFixed(2);if(rem<=0){finish();return;}raf=requestAnimationFrame(frame);}raf=requestAnimationFrame(frame);
}


// GAME 79 — モブくん宝箱どれだ!?
async function startTreasureMob(p,humanIndex,runId){
  gameFit();const values=shuffle([20,40,60,80,100]),chests=values.map((value,i)=>({id:i,value,slot:i}));let active=false,finished=false;
  screen.innerHTML=`<div class="v126-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん宝箱どれだ!?</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div id="treasureStageV126" class="treasure-stage-v126"><div class="treasure-rays-v126"></div><div class="treasure-mob-v126" style="background-image:url('icon/01.png')"></div><div id="treasureTrackV126" class="treasure-track-v126">${chests.map(c=>`<button class="treasure-chest-v126" data-id="${c.id}" type="button" style="--slot:${c.slot}"><i></i><b>?</b><em></em></button>`).join("")}</div><div id="treasureMsgV126" class="treasure-msg-v126">100点の宝箱を覚えろ！</div></div></div>`;
  const stage=document.getElementById("treasureStageV126"),track=document.getElementById("treasureTrackV126"),msg=document.getElementById("treasureMsgV126"),target=chests.find(c=>c.value===100);
  const render=()=>chests.forEach(c=>track.querySelector(`[data-id="${c.id}"]`).style.setProperty("--slot",c.slot));
  const swap=(a,b)=>{const ca=chests.find(c=>c.slot===a),cb=chests.find(c=>c.slot===b);[ca.slot,cb.slot]=[cb.slot,ca.slot];render();};
  track.addEventListener("pointerdown",async e=>{if(!active||finished)return;const el=e.target.closest(".treasure-chest-v126");if(!el)return;e.preventDefault();finished=true;active=false;const chosen=chests.find(x=>x.id===Number(el.dataset.id));el.classList.add("selected-v126");await wait(250);chests.forEach(c=>{const ce=track.querySelector(`[data-id="${c.id}"]`);ce.classList.add("open-v126");ce.querySelector("b").textContent=c.value;if(c.value===100)ce.classList.add("jackpot-v126");});state.records.treasureMob[p.id]=chosen.value;stage.classList.add(chosen.value===100?"treasure-jackpot-stage-v126":"treasure-reveal-stage-v126");msg.textContent=chosen.value===100?"JACKPOT 100!!":`${chosen.value} POINT / 100点箱も公開！`;beep(chosen.value===100?1180:420+chosen.value*5,180,.05);await wait(1050);if(isGameRunValid(runId))recordScreen(77,p,humanIndex,`${chosen.value}<small>pt</small>`,chosen.value===100?"100pt CHEST!":"宝箱ポイント");},{passive:false});
  if(!(await countdown("WATCH",runId,{transparent:true})))return;const targetEl=track.querySelector(`[data-id="${target.id}"]`);targetEl.classList.add("open-v126","target-v126");targetEl.querySelector("b").textContent="100";stage.classList.add("treasure-preview-stage-v126");beep(1020,150,.04);await wait(1350);if(!isGameRunValid(runId))return;targetEl.classList.remove("open-v126","target-v126");targetEl.querySelector("b").textContent="?";stage.classList.remove("treasure-preview-stage-v126");msg.textContent="SHUFFLE!!";for(let i=0;i<10;i++){const a=randi(0,4);let b=randi(0,4);while(b===a)b=randi(0,4);swap(a,b);stage.classList.remove("treasure-shuffle-v126");void stage.offsetWidth;stage.classList.add("treasure-shuffle-v126");beep(320+i*24,28,.008);await wait(210);if(!isGameRunValid(runId))return;}msg.textContent="100点はどれだ!?";active=true;
}


// GAME 80 — モブくんルーレットジャンプ
async function startRouletteMob(p,humanIndex,runId){
  gameFit();

  const values=[
    0,10,20,30,40,50,20,30,
    60,10,20,40,50,30,75,20,
    0,10,30,50,20,40,60,30,
    20,50,10,75,30,40,90,100
  ];

  const colors=[
    '#d8dde1','#79c6e7','#8bd18d','#e6c764','#ef9a66','#bc96e5','#82ced5','#f0a9c6',
    '#80ca8d','#a5bde5','#e6c96a','#ef9172','#8ed0cc','#c49be3','#f0bb63','#83c2e4',
    '#d3d8dc','#87cbd9','#8bce8e','#e6b96b','#c39be4','#ee9e76','#77c9ca','#dfc762',
    '#8dbfe1','#83ce8b','#eda06b','#ba95e1','#82c8df','#efba65','#dd90d1','#ffe15b'
  ];

  const N=values.length;
  const sector=360/N;
  const from=-sector/2;

  const gradient=values.map((_,i)=>{
    const a=i*sector;
    const b=(i+1)*sector;
    return `${colors[i]} ${a}deg ${b}deg`;
  }).join(',');

  let angle=0;
  let speed=7.35;
  let active=false;
  let jumping=false;
  let finished=false;
  let last=0;
  let raf=null;

  screen.innerHTML=`<div class="roulette-shell-v131">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんルーレットジャンプ</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div id="rouletteStage131" class="roulette-stage-v131">
      <div class="roulette-caption-v131">着地した瞬間のLAND床がポイント</div>
      <div class="roulette-land-v131">▼ LAND</div>

      <div
        id="wheel131"
        class="roulette-wheel-v131"
        style="background:conic-gradient(from ${from}deg,${gradient})"
      >
        ${values.map((v,i)=>`
          <span
            data-i="${i}"
            class="${v>=90?'high-v131':''}"
            style="--a:${i*sector}deg"
          >${v}</span>
        `).join('')}
        <i></i>
      </div>

      <div id="rouletteMob131" class="roulette-mob-v131" style="background-image:url('icon/01.png')"></div>
      <div id="rouletteResult131" class="roulette-result-v131"></div>
    </div>

    <button id="rouletteJump131" class="primary roulette-button-v131">
      JUMP!
    </button>
  </div>`;

  const stage=document.getElementById('rouletteStage131');
  const wheel=document.getElementById('wheel131');
  const mob=document.getElementById('rouletteMob131');
  const result=document.getElementById('rouletteResult131');
  const btn=document.getElementById('rouletteJump131');

  function landedIndex(){
    const deg=((angle*180/Math.PI)%360+360)%360;
    const local=(360-deg)%360;

    return Math.floor(
      (local+sector/2)/sector
    )%N;
  }

  async function jump(){
    if(!active||jumping||finished)return;

    jumping=true;
    btn.disabled=true;

    mob.classList.add('jump-v131');
    result.textContent='JUMP!!';
    beep(660,75,.025);

    await wait(760);
    if(!isGameRunValid(runId))return;

    active=false;
    if(raf)cancelAnimationFrame(raf);

    const idx=landedIndex();
    const value=values[idx];

    wheel.querySelector(`[data-i="${idx}"]`)?.classList.add('selected-v131');

    mob.classList.remove('jump-v131');
    mob.classList.add('landed-v131');

    result.textContent=`${value} POINT`;

    stage.classList.add(
      value===100
        ? 'jackpot-v131'
        : value>=90
          ? 'high-land-v131'
          : 'land-v131'
    );

    state.records.rouletteMob[p.id]=value;

    beep(
      value===100
        ? 1190
        : value>=90
          ? 1010
          : 410+value*5,
      180,.05
    );

    await wait(980);

    if(isGameRunValid(runId)){
      recordScreen(
        78,p,humanIndex,
        `${value}<small>pt</small>`,
        '着地した瞬間の床'
      );
    }
  }

  btn.addEventListener('pointerdown',e=>{
    e.preventDefault();
    jump();
  },{passive:false});

  if(!(await countdown('ROULETTE',runId,{transparent:true})))return;

  active=true;
  last=performance.now();

  function frame(now){
    if((!active&&!jumping)||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;

    speed=7.35+Math.sin(now*.0019)*.24;
    angle+=speed*dt;

    wheel.style.transform=
      `translate(-50%,-50%) rotate(${angle}rad)`;

    if(active||jumping){
      raf=requestAnimationFrame(frame);
    }
  }

  raf=requestAnimationFrame(frame);
}


// GAME 81 — モブくん地下発掘
async function startExcavationMob(p,humanIndex,runId){
  gameFit();const values=shuffle([0,0,10,10,30,30,50,75,100]);let digs=0,total=0,finished=false,busy=false,active=false;
  screen.innerHTML=`<div class="v126-shell"><div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくん地下発掘</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div><div class="v125-hud"><div><span>DIG</span><b id="digCountV126">0 / 3</b></div><div><span>TOTAL</span><b id="digTotalV126">0pt</b></div></div><div id="digStageV126" class="dig-stage-v126"><div class="dig-ground-top-v126"></div><div class="dig-mob-v126" style="background-image:url('icon/01.png')"><i></i></div><div id="digGridV126" class="dig-grid-v126">${values.map((v,i)=>`<button data-i="${i}" type="button"><div class="soil-v126"></div><i>?</i><b></b></button>`).join("")}</div><div id="digMsgV126" class="dig-msg-v126">3ヶ所選んで発掘！</div></div></div>`;
  const stage=document.getElementById("digStageV126"),grid=document.getElementById("digGridV126"),countEl=document.getElementById("digCountV126"),totalEl=document.getElementById("digTotalV126"),msg=document.getElementById("digMsgV126");
  grid.addEventListener("pointerdown",async e=>{if(!active||finished||busy||digs>=3)return;const btn=e.target.closest("button[data-i]");if(!btn||btn.disabled)return;e.preventDefault();busy=true;btn.disabled=true;const idx=Number(btn.dataset.i),value=values[idx];btn.classList.add("digging-v126");stage.classList.add("dig-action-v126");beep(260,70,.02);await wait(300);if(!isGameRunValid(runId))return;btn.classList.remove("digging-v126");btn.classList.add("dug-v126");btn.querySelector("i").textContent=value===0?"◆":value>=75?"★":"●";btn.querySelector("b").textContent=`${value}pt`;if(value>=75)btn.classList.add("rare-v126");digs++;total+=value;countEl.textContent=`${digs} / 3`;totalEl.textContent=`${total}pt`;msg.textContent=value===100?"伝説級化石 100pt!!":value>=75?"超レア化石！":value===0?"ただの石…":`化石 ${value}pt!`;beep(value===100?1150:value>=75?940:value>=50?760:value>0?560:220,140,.04);stage.classList.remove("dig-action-v126");busy=false;if(digs>=3){finished=true;active=false;state.records.excavationMob[p.id]=total;await wait(700);if(!isGameRunValid(runId))return;stage.classList.add("dig-finish-v126");msg.textContent=`発掘終了！ 合計 ${total}pt`;await wait(650);if(isGameRunValid(runId))recordScreen(79,p,humanIndex,`${total}<small>pt</small>`,"3ヶ所の発掘合計");}},{passive:false});
  if(!(await countdown("DIG",runId,{transparent:true})))return;active=true;
}



// =========================================================
// V10.32 GAME 81 — モブくんのババ抜き決闘
// =========================================================
async function startOldMaidDuel(p,humanIndex,runId){
  gameFit();

  let tries=0;
  let busy=false;
  let selected=-1;
  let forcedWin=false;
  let cards=['joker','spade'];
  let finished=false;

  screen.innerHTML=`<div class="maid-shell-v133">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんのババ抜き決闘</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>TRY</span><b id="maidTry133">0</b></div>
      <div><span>YOUR CARD</span><b>A♦</b></div>
    </div>

    <div class="maid-stage-v133">
      <div class="fake-mob-v133" style="background-image:url('icon/02.png')"><span>FAKE MOB</span></div>
      <div class="maid-label-v133">相手のカード</div>

      <div id="maidOpponent133" class="maid-opponent-v133">
        <button type="button" data-pos="0" class="maid-card-v133 back-v133"><span class="maid-card-back-v133">MOB</span></button>
        <button type="button" data-pos="1" class="maid-card-v133 back-v133"><span class="maid-card-back-v133">MOB</span></button>
      </div>

      <div class="maid-player-v133">
        <div class="maid-card-v133 ace-diamond-v133"><b>A</b><i>♦</i></div>
      </div>
    </div>

    <div id="maidConfirm133" class="maid-confirm-v133" hidden>
      <b>このカードを引きますか？</b>
      <div>
        <button id="maidYes133" type="button" class="primary">はい</button>
        <button id="maidNo133" type="button">いいえ</button>
      </div>
    </div>

    <div id="maidStatus133" class="maid-status-v133">相手の2枚から1枚選んでください</div>
  </div>`;

  const opponent=document.getElementById('maidOpponent133');
  const confirm=document.getElementById('maidConfirm133');
  const yes=document.getElementById('maidYes133');
  const no=document.getElementById('maidNo133');
  const tryEl=document.getElementById('maidTry133');
  const status=document.getElementById('maidStatus133');

  const buttons=()=>[...opponent.querySelectorAll('button[data-pos]')];

  function faceHtml(kind){
    return kind==='spade'
      ? `<span class="maid-face-v133 ace-spade-v133"><b>A</b><i>♠</i></span>`
      : `<span class="maid-face-v133 joker-v133"><b>JOKER</b><i>★</i></span>`;
  }

  function setBack(btn){
    btn.className='maid-card-v133 back-v133';
    btn.innerHTML='<span class="maid-card-back-v133">MOB</span>';
  }

  function clearSelect(){
    selected=-1;
    buttons().forEach(b=>b.classList.remove('selected-v133'));
    confirm.hidden=true;
  }

  function shuffleCards(){
    if(!forcedWin && Math.random()<.5)cards.reverse();

    opponent.classList.remove('shuffle-v133');
    void opponent.offsetWidth;
    opponent.classList.add('shuffle-v133');
  }

  opponent.addEventListener('pointerdown',e=>{
    if(busy||finished)return;

    const card=e.target.closest('button[data-pos]');
    if(!card)return;
    e.preventDefault();

    selected=Number(card.dataset.pos);

    buttons().forEach(b=>{
      b.classList.toggle('selected-v133',b===card);
    });

    confirm.hidden=false;
    status.textContent='このカードでよければ「はい」';
  },{passive:false});

  no.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(busy||finished)return;

    clearSelect();
    status.textContent='別のカードを選べます';
    beep(260,40,.01);
  },{passive:false});

  yes.addEventListener('pointerdown',async e=>{
    e.preventDefault();
    if(busy||finished||selected<0)return;

    busy=true;
    confirm.hidden=true;

    tries++;
    tryEl.textContent=tries;

    const chosen=forcedWin?'spade':cards[selected];
    const selectedBtn=buttons()[selected];

    selectedBtn.classList.remove('selected-v133');
    selectedBtn.classList.add('flip-v133');

    status.textContent='カードをめくります…';
    beep(410,50,.012);

    await wait(230);
    if(!isGameRunValid(runId))return;

    selectedBtn.classList.remove('back-v133');
    selectedBtn.classList.add(
      'face-v133',
      chosen==='spade'?'spade-v133':'joker-card-v133'
    );
    selectedBtn.innerHTML=faceHtml(chosen);

    selectedBtn.classList.remove('flip-v133');
    selectedBtn.classList.add('flip-open-v133');

    beep(chosen==='spade'?930:430,95,.025);

    // Keep the drawn card face-up long enough to understand exactly what was pulled.
    await wait(1050);
    if(!isGameRunValid(runId))return;

    if(chosen==='spade'){
      finished=true;

      status.textContent='A♦ + A♠！ ペア完成！';
      document.querySelector('.maid-player-v133')?.classList.add('pair-v133');
      selectedBtn.classList.add('pair-v133');

      await wait(900);
      if(!isGameRunValid(runId))return;

      state.records.oldMaidDuel[p.id]=tries;
      status.textContent=`${tries}回目で勝利！`;

      beep(1120,190,.05);

      await wait(900);

      if(isGameRunValid(runId)){
        recordScreen(
          80,p,humanIndex,
          `${tries}<small>回目</small>`,
          'A♠を引いてペア完成'
        );
      }
      return;
    }

    status.textContent='JOKER。相手へ戻ります';

    await wait(650);
    if(!isGameRunValid(runId))return;

    setBack(selectedBtn);
    clearSelect();

    if(tries>=9){
      forcedWin=true;
    }else{
      shuffleCards();
    }

    status.textContent='もう一度、相手の2枚から選ぶ';

    await wait(300);
    busy=false;
  },{passive:false});

  if(!(await countdown('OLD MAID',runId,{transparent:true})))return;

  shuffleCards();
}


// =========================================================
// V10.32 GAME 82 — モブくんロボット大発進
// =========================================================
async function startRobotMarch(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let energy=100;
  let distance=0;
  let last=0;
  let raf=null;

  let strokes=[];
  let activeStroke=null;
  let pointer=null;
  let ready=false;
  let sendLock=false;

  screen.innerHTML=`<div class="robot-shell-v133">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんロボット大発進</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>DISTANCE</span><b id="robotDist133">0m</b></div>
      <div><span>ENERGY</span><b id="robotEnergy133">100%</b></div>
    </div>

    <div class="robot-help-v133">
      右下へ自由に何本でも描く。描き終えたら短くタップして送る
    </div>

    <div id="robotStage133" class="robot-stage-v133">
      <div class="robot-road-v133"></div>

      <div class="robot-buildings-v133 left"><i></i><i></i><i></i></div>
      <div class="robot-buildings-v133 right"><i></i><i></i><i></i></div>

      <div id="robot133" class="giant-robot-v133">
        <div class="robot-head-v133"><span style="background-image:url('icon/01.png')"></span></div>
        <div class="robot-chest-v133"><i></i></div>
        <div class="robot-arm-v133 left"></div>
        <div class="robot-arm-v133 right"></div>
        <div class="robot-leg-v133 left"></div>
        <div class="robot-leg-v133 right"></div>
      </div>

      <div class="robot-energybar-v133"><i id="robotEnergyBar133"></i></div>

      <div id="batteryPad133" class="battery-pad-v133">
        <b>BATTERY</b>
        <svg id="batterySvg133" viewBox="0 0 120 120" preserveAspectRatio="none"></svg>
        <span id="batteryTap133">DRAW</span>
      </div>

      <div id="batteryFly133" class="battery-fly-v133"></div>
    </div>
  </div>`;

  const stage=document.getElementById('robotStage133');
  const robot=document.getElementById('robot133');
  const pad=document.getElementById('batteryPad133');
  const svg=document.getElementById('batterySvg133');
  const padText=document.getElementById('batteryTap133');
  const fly=document.getElementById('batteryFly133');
  const energyEl=document.getElementById('robotEnergy133');
  const energyBar=document.getElementById('robotEnergyBar133');
  const distEl=document.getElementById('robotDist133');

  function localPad(e){
    const r=pad.getBoundingClientRect();
    return{
      x:clamp((e.clientX-r.left)/r.width*120,0,120),
      y:clamp((e.clientY-r.top)/r.height*120,0,120)
    };
  }

  function renderStrokes(){
    svg.innerHTML='';

    strokes.forEach((stroke,i)=>{
      if(stroke.length<2)return;

      const pl=document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polyline'
      );

      pl.setAttribute(
        'points',
        stroke.map(q=>`${q.x},${q.y}`).join(' ')
      );
      pl.setAttribute('class','battery-drawing-v133');
      pl.style.setProperty('--stroke-i',i);

      svg.appendChild(pl);
    });
  }

  function stats(){
    const usable=strokes.filter(s=>s.length>=2);

    if(!usable.length){
      return{charge:0,strokeCount:0};
    }

    let totalLen=0;
    const all=[];

    for(const stroke of usable){
      all.push(...stroke);

      for(let i=1;i<stroke.length;i++){
        totalLen+=Math.hypot(
          stroke[i].x-stroke[i-1].x,
          stroke[i].y-stroke[i-1].y
        );
      }
    }

    const xs=all.map(q=>q.x);
    const ys=all.map(q=>q.y);
    const w=Math.max(...xs)-Math.min(...xs);
    const h=Math.max(...ys)-Math.min(...ys);
    const area=w*h;

    const sizeScore=clamp(area/7600,0,1);
    const lineScore=clamp(totalLen/620,0,1);
    const strokeCount=usable.length;

    // One-stroke "quick toss" is valid but intentionally weaker.
    const multiBonus=
      strokeCount===1
        ? 0
        : clamp((strokeCount-1)*5,5,18);

    const oneStrokeCap=strokeCount===1?24:52;

    const charge=clamp(
      Math.round(
        8+
        sizeScore*14+
        lineScore*14+
        multiBonus
      ),
      8,
      oneStrokeCap
    );

    return{
      charge,
      strokeCount
    };
  }

  async function sendBattery(){
    if(!active||finished||!ready||sendLock)return;

    sendLock=true;
    ready=false;
    pad.classList.add('sending-v133');

    const result=stats();
    const charge=result.charge;

    const pr=pad.getBoundingClientRect();
    const sr=stage.getBoundingClientRect();
    const rr=robot.getBoundingClientRect();

    fly.innerHTML=svg.outerHTML;
    fly.style.left=`${pr.left-sr.left+pr.width/2}px`;
    fly.style.top=`${pr.top-sr.top+pr.height/2}px`;
    fly.style.opacity='1';

    const tx=
      rr.left-sr.left+rr.width/2-
      (pr.left-sr.left+pr.width/2);

    const ty=
      rr.top-sr.top+rr.height*.45-
      (pr.top-sr.top+pr.height/2);

    const anim=fly.animate(
      [
        {transform:'translate(-50%,-50%) translate(0,0) scale(.78) rotate(0deg)'},
        {transform:`translate(-50%,-50%) translate(${tx*.54}px,${ty*.48-58}px) scale(.60) rotate(180deg)`},
        {transform:`translate(-50%,-50%) translate(${tx}px,${ty}px) scale(.30) rotate(360deg)`}
      ],
      {
        duration:520,
        easing:'cubic-bezier(.18,.72,.18,1)',
        fill:'forwards'
      }
    );

    beep(560,70,.02);

    await anim.finished.catch(()=>{});
    if(!isGameRunValid(runId))return;

    energy=clamp(energy+charge,0,100);

    energyEl.textContent=`${Math.round(energy)}%`;
    energyBar.style.width=`${energy}%`;

    robot.classList.remove('charged-v133');
    void robot.offsetWidth;
    robot.classList.add('charged-v133');

    padText.textContent=`+${charge}`;
    beep(820+charge*4,110,.03);

    await wait(180);

    fly.innerHTML='';
    fly.style.opacity='0';
    svg.innerHTML='';

    strokes=[];
    activeStroke=null;
    pointer=null;

    padText.textContent='DRAW';
    pad.classList.remove('sending-v133','ready-v133');

    sendLock=false;
  }

  pad.addEventListener('pointerdown',e=>{
    if(!active||finished||sendLock)return;
    e.preventDefault();

    pointer={
      id:e.pointerId,
      startX:e.clientX,
      startY:e.clientY,
      moved:false,
      startedStroke:false
    };

    try{pad.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  pad.addEventListener('pointermove',e=>{
    if(!active||finished||sendLock||!pointer||e.pointerId!==pointer.id)return;
    e.preventDefault();

    const moved=Math.hypot(
      e.clientX-pointer.startX,
      e.clientY-pointer.startY
    );

    if(!pointer.startedStroke && moved>=7){
      pointer.moved=true;
      pointer.startedStroke=true;

      activeStroke=[localPad(e)];
      strokes.push(activeStroke);

      ready=true;
      pad.classList.add('ready-v133');
      padText.textContent=`DRAW ${strokes.length}`;
    }

    if(pointer.startedStroke){
      const q=localPad(e);
      const prev=activeStroke[activeStroke.length-1];

      if(Math.hypot(q.x-prev.x,q.y-prev.y)>=2){
        activeStroke.push(q);
        renderStrokes();
      }
    }
  },{passive:false});

  pad.addEventListener('pointerup',e=>{
    if(!active||finished||sendLock||!pointer||e.pointerId!==pointer.id)return;
    e.preventDefault();

    const wasStroke=pointer.startedStroke;
    const moved=Math.hypot(
      e.clientX-pointer.startX,
      e.clientY-pointer.startY
    );

    pointer=null;
    activeStroke=null;

    if(!wasStroke && moved<7 && ready){
      sendBattery();
      return;
    }

    if(wasStroke){
      const usable=strokes.filter(s=>s.length>=2);

      if(!usable.length){
        strokes=[];
        svg.innerHTML='';
        ready=false;
        pad.classList.remove('ready-v133');
        padText.textContent='DRAW';
      }else{
        ready=true;
        pad.classList.add('ready-v133');
        padText.textContent=`${usable.length} STROKE / TAP SEND`;
      }
    }
  },{passive:false});

  pad.addEventListener('pointercancel',()=>{
    pointer=null;
    activeStroke=null;
  });

  async function finish(){
    if(finished)return;

    finished=true;
    active=false;
    if(raf)cancelAnimationFrame(raf);

    robot.classList.add('stop-v133');
    stage.classList.add('power-down-v133');

    state.records.robotMarch[p.id]=Math.round(distance);

    energy=0;
    energyEl.textContent='0%';
    energyBar.style.width='0%';

    beep(105,220,.045);

    await wait(900);

    if(isGameRunValid(runId)){
      recordScreen(
        81,p,humanIndex,
        `${Math.round(distance)}<small>m</small>`,
        'ENERGY切れまでの前進距離'
      );
    }
  }

  if(!(await countdown('ROBOT GO',runId,{transparent:true})))return;

  active=true;
  last=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;

    distance+=44*dt;

    const drain=
      14.8+
      Math.min(24,distance/55);

    energy-=drain*dt;

    distEl.textContent=`${Math.round(distance)}m`;
    energyEl.textContent=`${Math.max(0,Math.round(energy))}%`;
    energyBar.style.width=`${clamp(energy,0,100)}%`;

    stage.style.setProperty(
      '--road-speed',
      `${clamp(.62-distance/2200,.26,.62)}s`
    );

    robot.classList.toggle(
      'low-energy-v133',
      energy<28
    );

    if(energy<=0){
      finish();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// =========================================================
// V10.34 GAME 83 — モブくんはモンスターマスター
// =========================================================
async function startMonsterMaster(p,humanIndex,runId){
  gameFit();

  let phase='draw';
  let finished=false;
  let drawing=false;
  let pointer=null;
  let activeStroke=null;
  let strokes=[];
  let designReady=false;

  let last=0;
  let phaseStart=0;
  let raf=null;
  let caught=0;
  let thrown=0;
  let capturesInProgress=0;
  let catchTimeOver=false;

  const projectiles=[];
  const monsters=[];

  screen.innerHTML=`<div class="master-shell-v135">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはモンスターマスター</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span id="masterPhaseLabel135">DRAW</span><b id="masterTimer135">3.00</b></div>
      <div><span>GET</span><b id="masterGet135">0 / 10</b></div>
    </div>

    <div id="masterHelp135" class="master-help-v135">
      3秒で円とデザインを自由に描こう
    </div>

    <div id="masterStage135" class="master-stage-v135">
      <div class="master-zone-label-v135">MONSTER ZONE</div>
      <div id="monsterLayer135" class="monster-layer-v135"></div>
      <div id="masterProjectileLayer135" class="master-projectile-layer-v135"></div>
      <div id="masterCaptureLayer135" class="master-capture-layer-v135"></div>
      <div id="masterFx135" class="master-fx-v135"></div>

      <div id="ballPad135" class="ball-pad-v135">
        <b>BALL DESIGN</b>
        <svg id="ballSvg135" viewBox="0 0 140 140" preserveAspectRatio="none"></svg>
        <span id="ballState135">DRAW</span>
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('masterStage135');
  const monsterLayer=document.getElementById('monsterLayer135');
  const projectileLayer=document.getElementById('masterProjectileLayer135');
  const captureLayer=document.getElementById('masterCaptureLayer135');
  const fx=document.getElementById('masterFx135');
  const pad=document.getElementById('ballPad135');
  const svg=document.getElementById('ballSvg135');
  const stateEl=document.getElementById('ballState135');
  const helpEl=document.getElementById('masterHelp135');
  const timerEl=document.getElementById('masterTimer135');
  const phaseLabel=document.getElementById('masterPhaseLabel135');
  const getEl=document.getElementById('masterGet135');

  const defs=Array.from({length:10},(_,i)=>({
    speed:rand(18,42),
    dir:Math.random()<.5?-1:1,
    y:42+(i%5)*43+(i>=5?12:0),
    catchRate:i===9?.34:i>=7?.48:.69,
    color:['#7bd26f','#74c8e7','#dc88d8','#efca61','#ed7e6c'][i%5]
  }));

  defs.forEach((d,i)=>{
    const el=document.createElement('div');
    el.className='master-monster-v135';
    el.style.setProperty('--mc',d.color);
    el.innerHTML='<i></i><b></b><span></span>';
    monsterLayer.appendChild(el);

    monsters.push({
      ...d,
      id:i,
      x:rand(40,stage.clientWidth-40),
      el,
      caught:false,
      busy:false
    });
  });

  function localPad(e){
    const r=pad.getBoundingClientRect();

    return{
      x:clamp((e.clientX-r.left)/r.width*140,0,140),
      y:clamp((e.clientY-r.top)/r.height*140,0,140)
    };
  }

  function renderDesign(){
    svg.innerHTML='';

    for(const stroke of strokes){
      if(stroke.length<2)continue;

      const pl=document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polyline'
      );

      pl.setAttribute(
        'points',
        stroke.map(q=>`${q.x},${q.y}`).join(' ')
      );
      pl.setAttribute('class','ball-drawing-v135');

      svg.appendChild(pl);
    }
  }

  function ensureDefaultBall(){
    if(strokes.some(s=>s.length>=3))return;

    const circle=[];
    const cx=70,cy=70,r=48;

    for(let i=0;i<=32;i++){
      const a=Math.PI*2*i/32;
      circle.push({
        x:cx+Math.cos(a)*r,
        y:cy+Math.sin(a)*r
      });
    }

    strokes=[circle];
    renderDesign();
  }

  function ballPower(){
    const usable=strokes.filter(s=>s.length>=2);

    if(!usable.length)return .72;

    let len=0;
    const all=[];

    for(const s of usable){
      all.push(...s);

      for(let i=1;i<s.length;i++){
        len+=Math.hypot(
          s[i].x-s[i-1].x,
          s[i].y-s[i-1].y
        );
      }
    }

    const xs=all.map(q=>q.x);
    const ys=all.map(q=>q.y);
    const area=
      (Math.max(...xs)-Math.min(...xs))*
      (Math.max(...ys)-Math.min(...ys));

    const close=Math.min(
      ...usable.map(s=>
        Math.hypot(
          s[0].x-s[s.length-1].x,
          s[0].y-s[s.length-1].y
        )
      )
    );

    return clamp(
      .72+
      clamp(1-close/80,0,1)*.10+
      clamp(area/11000,0,1)*.08+
      clamp((len-180)/650,0,1)*.10,
      .72,1
    );
  }

  function ballHtml(){
    return `<div class="drawn-ball-v135">${svg.outerHTML}</div>`;
  }

  function burst(x,y,text=''){
    const b=document.createElement('div');
    b.className='master-burst-v135';
    b.style.left=`${x}px`;
    b.style.top=`${y}px`;
    b.innerHTML=`<i></i>${text?`<b>${text}</b>`:''}`;
    fx.appendChild(b);
    setTimeout(()=>b.remove(),820);
  }

  function createProjectile(dx,dy){
    if(phase!=='catch'||finished||catchTimeOver||!designReady)return;

    const dist=Math.hypot(dx,dy);
    if(dist<26||dy>=-8)return;

    const sr=stage.getBoundingClientRect();
    const pr=pad.getBoundingClientRect();

    const x=pr.left-sr.left+pr.width/2;
    const y=pr.top-sr.top+18;

    const speed=clamp(dist*4.6,350,760);
    const ux=dx/dist;
    const uy=dy/dist;

    const el=document.createElement('div');
    el.className='master-projectile-v135 flying-v135';
    el.innerHTML=ballHtml();
    el.style.left=`${x}px`;
    el.style.top=`${y}px`;
    projectileLayer.appendChild(el);

    projectiles.push({
      x,y,
      vx:ux*speed,
      vy:uy*speed,
      dead:false,
      el
    });

    thrown++;
    beep(540,48,.015);
  }

  async function resolveCapture(monster,x,y,ballMarkup){
    capturesInProgress++;
    monster.busy=true;

    const capture=document.createElement('div');
    capture.className='master-capture-ball-v135';
    capture.style.left=`${x}px`;
    capture.style.top=`${y}px`;
    capture.innerHTML=ballMarkup;
    captureLayer.appendChild(capture);

    monster.el.classList.add('sucked-v135');
    burst(x,y);

    await wait(300);
    if(!isGameRunValid(runId))return;

    monster.el.style.opacity='0';
    capture.classList.add('closed-v135');

    await wait(230);
    if(!isGameRunValid(runId))return;

    const chance=clamp(
      monster.catchRate*ballPower(),
      .20,.84
    );

    const shakes=
      chance>.62?2:
      chance>.44?3:4;

    for(let i=0;i<shakes;i++){
      capture.classList.remove('shake-v135');
      void capture.offsetWidth;
      capture.classList.add('shake-v135');

      beep(410+i*45,50,.014);

      await wait(260);
      if(!isGameRunValid(runId))return;
    }

    const success=Math.random()<chance;

    if(success){
      monster.caught=true;
      caught++;

      getEl.textContent=`${caught} / 10`;
      capture.classList.add('get-v135');
      burst(x,y,'GET!!');

      beep(1060,160,.048);

      await wait(480);
    }else{
      monster.el.style.opacity='1';
      monster.el.classList.remove('sucked-v135');
      monster.busy=false;

      capture.classList.add('break-v135');
      burst(x,y,'ESCAPE!');

      beep(145,110,.03);

      await wait(390);
    }

    capture.remove();
    capturesInProgress--;

    if(caught>=10){
      catchTimeOver=true;
      phase='ending';
      tryFinishCatch();
      return;
    }

    if(catchTimeOver){
      tryFinishCatch();
    }
  }

  function tryFinishCatch(){
    if(finished)return;

    const airborne=projectiles.some(q=>!q.dead);

    if(catchTimeOver && !airborne && capturesInProgress===0){
      finish();
    }
  }

  pad.addEventListener('pointerdown',e=>{
    if(finished)return;

    e.preventDefault();

    pointer={
      id:e.pointerId,
      sx:e.clientX,
      sy:e.clientY,
      started:false
    };

    try{pad.setPointerCapture(e.pointerId)}catch(_){}
  },{passive:false});

  pad.addEventListener('pointermove',e=>{
    if(!pointer||e.pointerId!==pointer.id||finished)return;

    e.preventDefault();

    const moved=Math.hypot(
      e.clientX-pointer.sx,
      e.clientY-pointer.sy
    );

    if(phase==='draw'){
      if(!pointer.started&&moved>=5){
        pointer.started=true;
        drawing=true;

        activeStroke=[localPad(e)];
        strokes.push(activeStroke);

        stateEl.textContent=`DRAW ${strokes.length}`;
      }

      if(pointer.started){
        const q=localPad(e);
        const prev=activeStroke[activeStroke.length-1];

        if(Math.hypot(q.x-prev.x,q.y-prev.y)>=2){
          activeStroke.push(q);
          renderDesign();
        }
      }

      return;
    }

    if(phase==='catch'){
      // Only the final swipe vector matters during capture phase.
      pointer.started=moved>=8;
    }
  },{passive:false});

  pad.addEventListener('pointerup',e=>{
    if(!pointer||e.pointerId!==pointer.id||finished)return;

    e.preventDefault();

    const dx=e.clientX-pointer.sx;
    const dy=e.clientY-pointer.sy;
    const dist=Math.hypot(dx,dy);

    if(phase==='draw'){
      drawing=false;
      activeStroke=null;
      pointer=null;
      return;
    }

    if(phase==='catch'&&!catchTimeOver){
      pointer=null;
      createProjectile(dx,dy);
      return;
    }

    pointer=null;
  },{passive:false});

  pad.addEventListener('pointercancel',()=>{
    pointer=null;
    drawing=false;
    activeStroke=null;
  });

  async function showCaughtCollection(){
    const caughtList=monsters.filter(m=>m.caught);

    screen.innerHTML=`<div class="master-result-shell-v135">
      <div class="game-head">
        <div>
          <span class="kicker">${esc(p.name)}</span>
          <h2>モブくんはモンスターマスター</h2>
        </div>
        <div class="game-badge">${playBadge(humanIndex)}</div>
      </div>

      <div class="master-result-title-v135">
        <b>MONSTER GET!</b>
        <strong>${caughtList.length} / 10</strong>
      </div>

      <div class="master-collection-v135">
        ${caughtList.length
          ? caughtList.map(m=>`
            <div class="master-caught-card-v135">
              <div class="master-caught-monster-v135" style="--mc:${m.color}">
                <i></i><b></b>
              </div>
              <span>GET</span>
            </div>
          `).join('')
          : `<div class="master-no-catch-v135">NO MONSTER</div>`
        }
      </div>

      <div class="master-result-note-v135">
        ${thrown} BALL THROW
      </div>
    </div>`;

    beep(
      caught>=8?1080:
      caught>=5?760:
      480,
      190,.045
    );

    await wait(2200);
  }

  async function finish(){
    if(finished)return;

    finished=true;
    phase='done';

    if(raf)cancelAnimationFrame(raf);

    state.records.monsterMaster[p.id]=caught;

    await showCaughtCollection();

    if(
      isGameRunValid(runId)
    ){
      recordScreen(
        82,p,humanIndex,
        `${caught}<small>体</small>`,
        `10秒で ${caught}体GET`
      );
    }
  }

  if(!(await countdown('BALL DESIGN',runId,{transparent:true})))return;

  phase='draw';
  phaseStart=last=performance.now();

  function beginCatchPhase(now){
    ensureDefaultBall();
    designReady=true;
    phase='catch';
    phaseStart=now;

    phaseLabel.textContent='CATCH';
    helpEl.textContent='10秒！ 同じボールを何個でもフリックできる！';
    stateEl.textContent='FLICK TO THROW';
    pad.classList.add('ready-v135');
  }

  function frame(now){
    if(finished||!isGameRunValid(runId))return;

    const dt=Math.min(.04,(now-last)/1000);
    last=now;

    if(phase==='draw'){
      const elapsed=now-phaseStart;
      const rem=3000-elapsed;

      timerEl.textContent=(Math.max(0,rem)/1000).toFixed(2);

      if(rem<=0){
        drawing=false;
        activeStroke=null;
        pointer=null;
        beginCatchPhase(now);
      }
    }else if(phase==='catch'){
      const elapsed=now-phaseStart;
      const rem=10000-elapsed;

      timerEl.textContent=(Math.max(0,rem)/1000).toFixed(2);

      if(rem<=0&&!catchTimeOver){
        catchTimeOver=true;
        phase='ending';
        helpEl.textContent='TIME UP！ 投げたボールの結果を待っています';
        stateEl.textContent='TIME UP';
        pad.classList.add('disabled-v135');
      }
    }else if(phase==='ending'){
      timerEl.textContent='0.00';
    }

    for(const m of monsters){
      if(m.caught||m.busy)continue;

      m.x+=m.dir*m.speed*dt;

      if(m.x<28){
        m.x=28;
        m.dir=1;
        m.el.classList.remove('left-v135');
      }

      if(m.x>stage.clientWidth-28){
        m.x=stage.clientWidth-28;
        m.dir=-1;
        m.el.classList.add('left-v135');
      }

      m.el.style.left=`${m.x}px`;
      m.el.style.top=`${m.y}px`;
    }

    for(const q of projectiles){
      if(q.dead)continue;

      q.x+=q.vx*dt;
      q.y+=q.vy*dt;
      q.vy+=190*dt;

      q.el.style.left=`${q.x}px`;
      q.el.style.top=`${q.y}px`;

      let hit=null;

      for(const m of monsters){
        if(m.caught||m.busy)continue;

        if(Math.hypot(q.x-m.x,q.y-m.y)<31){
          hit=m;
          break;
        }
      }

      if(hit){
        q.dead=true;

        const markup=q.el.innerHTML;
        q.el.remove();

        resolveCapture(
          hit,q.x,q.y,markup
        );

        continue;
      }

      if(
        q.x<-45||
        q.x>stage.clientWidth+45||
        q.y<-70||
        q.y>stage.clientHeight+60
      ){
        q.dead=true;
        q.el.remove();
      }
    }

    if(catchTimeOver){
      tryFinishCatch();
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// =========================================================
// V10.34 GAME 84 — モブくんはスカウトマン！
// =========================================================
async function startScoutMan(p,humanIndex,runId){
  gameFit();
  const positions=[['P','ピッチャー'],['C','キャッチャー'],['1B','ファースト'],['2B','セカンド'],['3B','サード'],['SS','ショート'],['RF','ライト'],['LF','レフト'],['CF','センター']];
  const info={R:{price:500,power:8},SR:{price:1000,power:14},SSR:{price:3000,power:23},UR:{price:5000,power:34},MOB:{price:10000,power:50}};
  let money=30000,posIndex=0,active=false,chosen=false,timer=null,team=[],finished=false;

  screen.innerHTML=`<div class="scout-shell-v134">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんはスカウトマン！</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="v125-hud"><div><span>BUDGET</span><b id="scoutMoney134">¥30,000</b></div><div><span>POSITION</span><b id="scoutPos134">P</b></div></div>
    <div id="scoutStage134" class="scout-stage-v134">
      <div class="scout-title-v134"><b id="scoutPosName134">ピッチャー</b><span id="scoutClock134">1.0</span></div>
      <div id="scoutCards134" class="scout-cards-v134"></div>
      <div id="scoutNotice134" class="scout-notice-v134"></div>
    </div>
    <div id="scoutFooter134" class="scout-footer-v134">1秒以内に1人タップして購入</div>
  </div>`;

  const stage=document.getElementById('scoutStage134'),cardsEl=document.getElementById('scoutCards134'),moneyEl=document.getElementById('scoutMoney134');
  const posEl=document.getElementById('scoutPos134'),posNameEl=document.getElementById('scoutPosName134'),clockEl=document.getElementById('scoutClock134');
  const notice=document.getElementById('scoutNotice134'),footer=document.getElementById('scoutFooter134');

  function candidates(){
    const pick=()=>{const r=Math.random()*100;return r<38?'R':r<64?'SR':r<82?'SSR':r<95?'UR':'MOB';};
    const a=Array.from({length:5},pick); if(!a.includes('R'))a[randi(0,4)]='R'; return shuffle(a);
  }
  function card(r,i){
    const x=info[r],img=String((posIndex*5+i)%10+1).padStart(2,'0');
    return `<button type="button" class="scout-card-v134 rarity-${r.toLowerCase()}-v134" data-rarity="${r}" data-price="${x.price}"><span class="scout-rarity-v134">${r}</span><div class="scout-player-art-v134" style="background-image:url('icon/${img}.png')"></div><em>¥${x.price.toLocaleString()}</em></button>`;
  }
  function addR(reason){
    const cost=Math.min(500,money); money-=cost;
    team.push({pos:positions[posIndex][0],rarity:'R',price:cost,power:8,auto:true}); moneyEl.textContent=`¥${money.toLocaleString()}`;
    notice.textContent=reason||'Rモブくん加入'; notice.className='scout-notice-v134 auto-v134'; beep(360,70,.018);
  }
  async function choose(r){
    if(chosen||finished)return; chosen=true;active=false;if(timer){clearInterval(timer);timer=null;}
    const remainAfter=positions.length-posIndex-1,requiredReserve=remainAfter*500,x=info[r];
    if(x.price+requiredReserve>money){notice.textContent='資金不足！ Rモブくん加入';notice.className='scout-notice-v134 fail-v134';addR();}
    else{money-=x.price;team.push({pos:positions[posIndex][0],rarity:r,price:x.price,power:x.power,auto:false});moneyEl.textContent=`¥${money.toLocaleString()}`;notice.textContent=`${r}モブくん SCOUT！`;notice.className=`scout-notice-v134 scout-${r.toLowerCase()}-v134`;beep(r==='MOB'?1120:r==='UR'?930:r==='SSR'?760:r==='SR'?580:430,120,.03);}
    await wait(390);if(!isGameRunValid(runId))return;posIndex++;if(posIndex>=positions.length)showTeam();else startRound();
  }
  cardsEl.addEventListener('pointerdown',e=>{const c=e.target.closest('button[data-rarity]');if(!c||!active||chosen||finished)return;e.preventDefault();choose(c.dataset.rarity);},{passive:false});
  async function timeout(){
    if(chosen||finished)return;chosen=true;active=false;if(timer){clearInterval(timer);timer=null;}addR('TIME UP！ Rモブくん加入');
    await wait(390);if(!isGameRunValid(runId))return;posIndex++;if(posIndex>=positions.length)showTeam();else startRound();
  }
  function startRound(){
    chosen=false;active=true;notice.textContent='';notice.className='scout-notice-v134';
    const [pos,name]=positions[posIndex];posEl.textContent=pos;posNameEl.textContent=name;cardsEl.innerHTML=candidates().map(card).join('');
    const begin=performance.now();clockEl.textContent='1.0';if(timer)clearInterval(timer);
    timer=setInterval(()=>{const rem=Math.max(0,1000-(performance.now()-begin));clockEl.textContent=(rem/1000).toFixed(1);if(rem<=0){clearInterval(timer);timer=null;timeout();}},25);
  }
  function rank(power){
    const avg=power/9,luck=rand(-11,11),strength=avg*2.25+luck;
    return clamp(Math.round(48-strength/2.55),1,47);
  }
  function showTeam(){
    finished=true;active=false;if(timer){clearInterval(timer);timer=null;}
    const total=team.reduce((s,m)=>s+m.power,0);
    stage.innerHTML=`<div class="scout-team-v134"><h3>MOB TEAM</h3><div class="scout-lineup-v134">${team.map(m=>`<div><b>${m.pos}</b><span class="rarity-text-${m.rarity.toLowerCase()}-v134">${m.rarity}</span><em>¥${m.price.toLocaleString()}</em></div>`).join('')}</div><div class="scout-team-info-v134"><b>TEAM POWER ${total}</b><span>残金 ¥${money.toLocaleString()}</span></div><div class="scout-koshien-v134">モブくんチーム、いざ甲子園へ！</div><button id="scoutResultBtn134" type="button" class="primary scout-result-btn-v134">結果を観る</button><div id="scoutTournament134" class="scout-tournament-v134"></div></div>`;
    footer.textContent='9人のスカウト完了';
    const btn=document.getElementById('scoutResultBtn134'),t=document.getElementById('scoutTournament134');
    btn.addEventListener('pointerdown',async e=>{
      e.preventDefault();btn.disabled=true;const labels=['47校','BEST 32','BEST 16','BEST 8','BEST 4','FINAL'];
      for(let i=0;i<labels.length;i++){t.textContent=labels[i];t.classList.remove('pulse-v134');void t.offsetWidth;t.classList.add('pulse-v134');beep(420+i*70,45,.012);await wait(210);if(!isGameRunValid(runId))return;}
      const r=rank(total);state.records.scoutMan[p.id]=r;t.innerHTML=`<b>47校中</b><strong>${r}位</strong>`;if(r<=3)t.classList.add('top-v134');beep(r===1?1180:r<=8?940:650,190,.05);
      await wait(1150);if(isGameRunValid(runId))recordScreen(83,p,humanIndex,`47校中 <strong>${r}位</strong>`,`残金 ¥${money.toLocaleString()}`);
    },{passive:false});
  }

  if(!(await countdown('SCOUT START',runId,{transparent:true})))return;
  startRound();
}


// =========================================================
// V10.36 GAME 85 — モブくんあたふたサバイバル
// =========================================================
async function startAtafutaSurvival(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let raf=null;
  let last=0;
  let start=0;
  let nextCollapseAt=0;
  let collapseCount=0;

  const input={left:false,right:false};
  const actors=[];
  const tiles=[];

  screen.innerHTML=`<div class="survival-shell-v137">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんあたふたサバイバル</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>SURVIVOR</span><b id="surviveCount137">10</b></div>
      <div><span>JUMP</span><b id="surviveJump137">2</b></div>
    </div>

    <div class="survival-help-v137">
      ← → で移動 / JUMPは2段まで / 他のモブくんの上にも乗れる！
    </div>

    <div id="survivalStage137" class="survival-stage-v137">
      <div class="survival-sky-v137">
        <i class="cloud c1"></i><i class="cloud c2"></i>
      </div>
      <div id="survivalRockLayer137" class="survival-rock-layer-v137"></div>
      <div id="survivalActorLayer137" class="survival-actor-layer-v137"></div>
      <div id="survivalFx137" class="survival-fx-v137"></div>
      <div id="survivalMessage137" class="survival-message-v137"></div>
    </div>

    <div class="survival-controls-v137">
      <button id="surviveLeft137" type="button">←</button>
      <button id="surviveJumpBtn137" class="jump" type="button">JUMP</button>
      <button id="surviveRight137" type="button">→</button>
    </div>
  </div>`;

  const stage=document.getElementById('survivalStage137');
  const rockLayer=document.getElementById('survivalRockLayer137');
  const actorLayer=document.getElementById('survivalActorLayer137');
  const fx=document.getElementById('survivalFx137');
  const countEl=document.getElementById('surviveCount137');
  const jumpEl=document.getElementById('surviveJump137');
  const msg=document.getElementById('survivalMessage137');
  const leftBtn=document.getElementById('surviveLeft137');
  const rightBtn=document.getElementById('surviveRight137');
  const jumpBtn=document.getElementById('surviveJumpBtn137');

  const W=Math.max(300,stage.clientWidth||340);
  const H=Math.max(300,stage.clientHeight||360);
  const tileCount=12;
  const gap=3;
  const side=7;
  const tileW=(W-side*2-gap*(tileCount-1))/tileCount;
  const baseY=Math.round(H*.69);

  for(let i=0;i<tileCount;i++){
    const el=document.createElement('div');
    el.className='survival-rock-v137';
    el.style.left=`${side+i*(tileW+gap)}px`;
    el.style.width=`${tileW}px`;
    el.style.top=`${baseY}px`;
    el.innerHTML='<i></i><b></b>';
    rockLayer.appendChild(el);

    tiles.push({
      i,
      x:side+i*(tileW+gap),
      y:baseY,
      w:tileW,
      active:true,
      cracking:false,
      el
    });
  }

  function makeActor(i,isPlayer=false){
    const el=document.createElement('div');
    el.className=`survival-actor-v137 ${isPlayer?'player-v137':'fake-v137'}`;
    el.style.backgroundImage=`url('${isPlayer?'icon/01.png':`icon/${String((i%9)+2).padStart(2,'0')}.png`}')`;
    actorLayer.appendChild(el);

    const x=clamp(
      4+(i+.35)*(W-34)/10,
      3,W-31
    );

    const a={
      id:i,
      player:isPlayer,
      x,
      y:baseY-36,
      prevY:baseY-36,
      vx:0,
      vy:0,
      w:28,
      h:36,
      onGround:true,
      riding:null,
      jumps:0,
      alive:true,
      aiDir:Math.random()<.5?-1:1,
      aiSpeed:rand(62,87),
      aiChange:performance.now()+rand(450,1200),
      el
    };

    // IMPORTANT: positions are assigned before countdown starts,
    // so actors never appear stacked at the upper-left.
    el.style.left=`${a.x}px`;
    el.style.top=`${a.y}px`;

    actors.push(a);
    return a;
  }

  const player=makeActor(0,true);
  for(let i=1;i<10;i++)makeActor(i,false);

  function aliveActors(){
    return actors.filter(a=>a.alive);
  }

  function tileAhead(a,dir){
    const px=a.x+a.w/2+dir*(a.w*.72+10);
    return tiles.some(t=>
      t.active &&
      px>=t.x &&
      px<=t.x+t.w
    );
  }

  function bodiesOverlap(a,b,nextX=a.x){
    if(!a.alive||!b.alive||a===b)return false;

    const ay1=a.y+4;
    const ay2=a.y+a.h-3;
    const by1=b.y+4;
    const by2=b.y+b.h-3;

    const vertical=ay2>by1&&ay1<by2;
    if(!vertical)return false;

    return(
      nextX < b.x+b.w-3 &&
      nextX+a.w > b.x+3
    );
  }

  function actorBlocked(a,nextX){
    return actors.some(b=>bodiesOverlap(a,b,nextX));
  }

  function tryJump(a){
    if(!a.alive||a.jumps>=2)return;

    a.riding=null;
    a.vy=a.jumps===0?-245:-220;
    a.jumps++;
    a.onGround=false;

    if(a.player){
      jumpEl.textContent=Math.max(0,2-a.jumps);
    }

    a.el.classList.remove('jump-v137');
    void a.el.offsetWidth;
    a.el.classList.add('jump-v137');

    beep(a.player?540+a.jumps*80:310,42,.012);
  }

  function collapseOne(){
    const candidates=tiles.filter(t=>t.active&&!t.cracking);
    if(!candidates.length)return;

    let tile;

    if(collapseCount>=7){
      const alive=aliveActors();
      const weighted=candidates.map(t=>{
        const cx=t.x+t.w/2;
        const d=Math.min(
          ...alive.map(a=>
            Math.abs((a.x+a.w/2)-cx)
          )
        );
        return {t,d};
      }).sort((a,b)=>a.d-b.d);

      tile=weighted[
        randi(0,Math.min(2,weighted.length-1))
      ].t;
    }else{
      tile=candidates[randi(0,candidates.length-1)];
    }

    tile.cracking=true;
    tile.el.classList.add('crack-v137');

    const marker=document.createElement('div');
    marker.className='survival-warning-v137';
    marker.style.left=`${tile.x+tile.w/2}px`;
    marker.style.top=`${tile.y-25}px`;
    marker.textContent='!';
    fx.appendChild(marker);

    beep(190,60,.016);

    setTimeout(()=>{
      marker.remove();

      if(finished||!isGameRunValid(runId))return;

      tile.active=false;
      tile.el.classList.remove('crack-v137');
      tile.el.classList.add('fall-v137');

      setTimeout(()=>tile.el.remove(),760);
    },520);

    collapseCount++;
  }

  function playerScore(place){
    return clamp(
      Math.round((10-place)/9*100),
      0,100
    );
  }

  async function endPlayer(place,clear){
    if(finished)return;

    finished=true;
    active=false;
    if(raf)cancelAnimationFrame(raf);

    const score=playerScore(place);
    state.records.atafutaSurvival[p.id]=score;

    msg.textContent=clear?'LAST MOB!! CLEAR!':`${place}位`;
    msg.classList.add(clear?'clear-v137':'lose-v137');

    beep(
      clear?1120:
      score>=78?810:
      score>=44?560:160,
      clear?220:150,.045
    );

    await wait(clear?1250:850);

    if(isGameRunValid(runId)){
      recordScreen(
        84,p,humanIndex,
        `${score}<small>pt</small>`,
        clear
          ? '最後の1人まで生存 / CLEAR'
          : `10人中 ${place}位`
      );
    }
  }

  function eliminate(a){
    if(!a.alive)return;

    const place=aliveActors().length;
    a.alive=false;
    a.el.classList.add('drop-v137');

    countEl.textContent=aliveActors().length;

    for(const rider of actors){
      if(rider.riding===a){
        rider.riding=null;
        rider.onGround=false;
      }
    }

    if(a.player){
      endPlayer(place,false);
      return;
    }

    beep(120,50,.01);

    if(player.alive&&aliveActors().length===1){
      endPlayer(1,true);
    }
  }

  function bindHold(btn,key){
    const on=e=>{
      e.preventDefault();
      if(active&&!finished)input[key]=true;
      try{btn.setPointerCapture(e.pointerId)}catch(_){}
    };

    const off=e=>{
      if(e)e.preventDefault();
      input[key]=false;
    };

    btn.addEventListener('pointerdown',on,{passive:false});
    btn.addEventListener('pointerup',off,{passive:false});
    btn.addEventListener('pointercancel',off,{passive:false});
    btn.addEventListener('lostpointercapture',off,{passive:false});
  }

  bindHold(leftBtn,'left');
  bindHold(rightBtn,'right');

  jumpBtn.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(active&&!finished)tryJump(player);
  },{passive:false});

  function landOnActor(a,prevBottom,newBottom){
    if(a.vy<0)return false;

    const candidates=actors
      .filter(b=>
        b!==a &&
        b.alive &&
        b.y>a.y &&
        a.x+a.w-5>b.x &&
        a.x+5<b.x+b.w &&
        prevBottom<=b.y+5 &&
        newBottom>=b.y
      )
      .sort((x,y)=>x.y-y.y);

    if(!candidates.length)return false;

    const base=candidates[0];

    a.y=base.y-a.h;
    a.vy=0;
    a.onGround=true;
    a.riding=base;
    a.jumps=0;

    if(a.player)jumpEl.textContent='2';

    return true;
  }

  async function finishTimeout(){
    if(finished)return;

    const place=Math.max(1,aliveActors().length);

    if(player.alive){
      if(place===1)endPlayer(1,true);
      else endPlayer(place,false);
    }
  }

  if(!(await countdown('SURVIVAL',runId,{transparent:true})))return;

  active=true;
  start=last=performance.now();
  nextCollapseAt=start+1500;

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;

    const dt=Math.min(.035,(now-last)/1000);
    last=now;
    const elapsed=(now-start)/1000;

    if(now>=nextCollapseAt){
      collapseOne();

      const gapMs=clamp(
        920-collapseCount*34,
        470,920
      );

      nextCollapseAt=now+gapMs;
    }

    if(
      elapsed>17 &&
      tiles.some(t=>t.active&&!t.cracking)
    ){
      nextCollapseAt=Math.min(nextCollapseAt,now+120);
    }

    for(const a of actors){
      if(!a.alive)continue;

      a.prevY=a.y;

      let desired=0;

      if(a.player){
        desired=
          input.left&&!input.right
            ? -1
            : input.right&&!input.left
              ? 1
              : 0;
      }else{
        if(now>=a.aiChange){
          a.aiDir=Math.random()<.5?-1:1;
          a.aiChange=now+rand(420,1050);

          if(Math.random()<.34)tryJump(a);
        }

        desired=a.aiDir;

        if(
          actorBlocked(a,a.x+desired*4) ||
          !tileAhead(a,desired)
        ){
          if(a.jumps<2&&Math.random()<.78){
            tryJump(a);
          }else if(Math.random()<.55){
            a.aiDir*=-1;
            desired=a.aiDir;
          }
        }
      }

      const wantedVx=desired*(a.player?112:a.aiSpeed);

      if(desired===0){
        a.vx*=Math.pow(.06,dt);
      }else{
        a.vx=wantedVx;
      }

      let nextX=a.x+a.vx*dt;

      if(actorBlocked(a,nextX)){
        nextX=a.x;
        a.vx=0;

        if(
          !a.player &&
          a.jumps<2 &&
          Math.random()<.08
        ){
          tryJump(a);
        }
      }

      a.x=nextX;

      if(
        a.riding &&
        (
          !a.riding.alive ||
          a.x+a.w-5<=a.riding.x ||
          a.x+5>=a.riding.x+a.riding.w
        )
      ){
        a.riding=null;
        a.onGround=false;
      }

      const prevBottom=a.y+a.h;

      a.vy+=470*dt;
      a.y+=a.vy*dt;

      const newBottom=a.y+a.h;
      a.onGround=false;

      let landed=false;

      if(a.vy>=0){
        for(const t of tiles){
          if(!t.active)continue;

          const horiz=
            a.x+a.w-5>t.x &&
            a.x+5<t.x+t.w;

          const crossing=
            prevBottom<=t.y+5 &&
            newBottom>=t.y;

          if(horiz&&crossing){
            a.y=t.y-a.h;
            a.vy=0;
            a.onGround=true;
            a.riding=null;
            a.jumps=0;
            landed=true;

            if(a.player)jumpEl.textContent='2';
            break;
          }
        }
      }

      if(!landed){
        landOnActor(a,prevBottom,newBottom);
      }

      if(
        a.x+a.w<-18 ||
        a.x>W+18 ||
        a.y>H+75
      ){
        eliminate(a);
        continue;
      }

      a.el.style.left=`${a.x}px`;
      a.el.style.top=`${a.y}px`;
    }

    if(player.alive&&aliveActors().length===1){
      endPlayer(1,true);
      return;
    }

    if(elapsed>=22){
      finishTimeout();
      return;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}


// =========================================================
// V10.36 GAME 86 — モブくん波動を極める
// =========================================================
async function startWaveMaster(p,humanIndex,runId){
  gameFit();

  let phase='locked';
  let finished=false;
  let raf=null;
  let phaseStart=0;
  let soulPct=0;
  let soulScore=0;

  let tracePointer=null;
  let tracePoints=[];
  let traceSamples=[];
  let traceProgress=0;
  let traceMoves=0;
  let traceMisses=0;
  let traceLength=0;
  let traceScore=0;

  screen.innerHTML=`<div class="wave-shell-v140">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん波動を極める</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="v125-hud">
      <div><span>STEP</span><b id="waveStep140">1 / 2</b></div>
      <div><span>POWER</span><b id="wavePower140">---</b></div>
    </div>

    <div id="waveHelp140" class="wave-help-v140">魂ゲージがMAXに近い瞬間を狙え</div>

    <div id="waveStage140" class="wave-stage-v140">
      <div id="waveSoulPanel140" class="wave-soul-panel-v140">
        <div id="soulGauge140" class="soul-gauge-v140">
          <div id="soulCore140" class="soul-core-v140"></div>
          <span>MAX</span>
        </div>
      </div>

      <div id="waveZPanel140" class="wave-z-panel-v140" hidden>
        <div class="z-title-v140">TRACE Z</div>
        <svg id="waveZSvg140" class="wave-z-svg-v140" viewBox="0 0 320 240">
          <polyline class="wave-z-back-v140" points="48,48 272,48 48,192 272,192"/>
          <polyline id="waveZTarget140" class="wave-z-target-v140" points="48,48 272,48 48,192 272,192"/>
          <circle class="wave-z-start-v140" cx="48" cy="48" r="15"/>
          <circle class="wave-z-goal-v140" cx="272" cy="192" r="15"/>
          <polyline id="waveZUser140" class="wave-z-user-v140" points=""/>
        </svg>
        <div id="waveZHint140" class="wave-z-hint-v140">STARTからZを一筆でなぞる</div>
        <div id="waveZProgress140" class="wave-z-progress-v140">0%</div>
      </div>

      <div id="waveCinema140" class="wave-cinema-v140" hidden></div>
    </div>

    <div id="waveControl140" class="wave-control-v140">
      <button id="soulTap140" type="button" class="primary" disabled>魂を込める！</button>
    </div>
  </div>`;

  const stage=document.getElementById('waveStage140');
  const help=document.getElementById('waveHelp140');
  const stepEl=document.getElementById('waveStep140');
  const powerEl=document.getElementById('wavePower140');
  const soulPanel=document.getElementById('waveSoulPanel140');
  const soulGauge=document.getElementById('soulGauge140');
  const soulCore=document.getElementById('soulCore140');
  const soulBtn=document.getElementById('soulTap140');
  const zPanel=document.getElementById('waveZPanel140');
  const zSvg=document.getElementById('waveZSvg140');
  const zUser=document.getElementById('waveZUser140');
  const zHint=document.getElementById('waveZHint140');
  const zProgress=document.getElementById('waveZProgress140');
  const cinema=document.getElementById('waveCinema140');
  const control=document.getElementById('waveControl140');

  function soulFrame(now){
    if(finished||phase!=='soul'||!isGameRunValid(runId))return;

    const cyc=((now-phaseStart)%1550)/1550;
    soulPct=cyc*100;

    soulGauge.style.background=
      `conic-gradient(#ffe65b ${soulPct*3.6}deg,#314250 0deg)`;

    soulCore.style.transform=
      `translate(-50%,-50%) scale(${1.05-soulPct/345})`;

    raf=requestAnimationFrame(soulFrame);
  }

  function buildZSamples(){
    const vertices=[
      {x:48,y:48},
      {x:272,y:48},
      {x:48,y:192},
      {x:272,y:192}
    ];

    traceSamples=[];

    for(let seg=0;seg<3;seg++){
      const a=vertices[seg];
      const b=vertices[seg+1];
      const count=seg===1?52:40;

      for(let i=0;i<count;i++){
        const t=i/count;
        traceSamples.push({
          x:a.x+(b.x-a.x)*t,
          y:a.y+(b.y-a.y)*t
        });
      }
    }

    traceSamples.push(vertices[3]);
  }

  function localZ(e){
    const r=zSvg.getBoundingClientRect();

    return{
      x:clamp((e.clientX-r.left)/r.width*320,0,320),
      y:clamp((e.clientY-r.top)/r.height*240,0,240)
    };
  }

  function resetZ(message='STARTからZを一筆でなぞる'){
    tracePointer=null;
    tracePoints=[];
    traceProgress=0;
    traceMoves=0;
    traceMisses=0;
    traceLength=0;
    zUser.setAttribute('points','');
    zProgress.textContent='0%';
    zHint.textContent=message;
    zPanel.classList.remove('retry-v140');
  }

  function nearestSample(q){
    let best=-1;
    let bestD=999;

    for(let i=0;i<traceSamples.length;i++){
      const s=traceSamples[i];
      const d=Math.hypot(q.x-s.x,q.y-s.y);

      if(d<bestD){
        bestD=d;
        best=i;
      }
    }

    return {index:best,distance:bestD};
  }

  function traceMove(q){
    traceMoves++;

    const prev=tracePoints[tracePoints.length-1];
    if(prev){
      traceLength+=Math.hypot(q.x-prev.x,q.y-prev.y);
    }

    tracePoints.push(q);

    const near=nearestSample(q);
    const currentIndex=Math.floor(
      traceProgress*(traceSamples.length-1)
    );

    if(
      near.distance<=19 &&
      near.index>=Math.max(0,currentIndex-5) &&
      near.index<=Math.min(
        traceSamples.length-1,
        currentIndex+18
      )
    ){
      traceProgress=Math.max(
        traceProgress,
        near.index/(traceSamples.length-1)
      );
    }else{
      traceMisses++;
    }

    zProgress.textContent=
      `${Math.round(traceProgress*100)}%`;

    zUser.setAttribute(
      'points',
      tracePoints
        .map(pt=>`${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
        .join(' ')
    );
  }

  zSvg.addEventListener('pointerdown',e=>{
    if(phase!=='z'||finished)return;

    e.preventDefault();

    const q=localZ(e);

    if(Math.hypot(q.x-48,q.y-48)>31){
      zHint.textContent='STARTから光るZをなぞれ！';
      zPanel.classList.add('retry-v140');
      beep(170,60,.014);
      return;
    }

    resetZ('そのままZを一筆でなぞる');
    tracePointer={id:e.pointerId};
    traceMove(q);

    try{
      zSvg.setPointerCapture(e.pointerId);
    }catch(_){}
  },{passive:false});

  zSvg.addEventListener('pointermove',e=>{
    if(
      phase!=='z'||
      !tracePointer||
      e.pointerId!==tracePointer.id
    )return;

    e.preventDefault();

    const q=localZ(e);
    const prev=tracePoints[tracePoints.length-1];

    if(
      prev &&
      Math.hypot(q.x-prev.x,q.y-prev.y)<2
    )return;

    traceMove(q);
  },{passive:false});

  const finishZ=e=>{
    if(!tracePointer)return;
    if(e&&e.pointerId!==tracePointer.id)return;

    if(e)e.preventDefault();

    const last=
      tracePoints[tracePoints.length-1]||
      {x:0,y:0};

    const endOk=
      Math.hypot(last.x-272,last.y-192)<=34;

    const enough=
      traceProgress>=.78 &&
      traceMoves>=18 &&
      traceLength>=260 &&
      endOk;

    tracePointer=null;

    if(!enough){
      zPanel.classList.add('retry-v140');
      zHint.textContent='光るZラインを最後まで一筆でなぞる！';
      beep(180,75,.015);

      setTimeout(()=>{
        if(!isGameRunValid(runId)||phase!=='z')return;
        resetZ();
      },450);

      return;
    }

    const accuracy=
      traceMoves
        ? clamp(
            100-traceMisses/traceMoves*88,
            0,100
          )
        : 0;

    const lengthScore=
      clamp(
        100-Math.abs(traceLength-632)*.10,
        60,100
      );

    traceScore=clamp(
      Math.round(
        accuracy*.72+
        lengthScore*.18+
        traceProgress*100*.10
      ),
      0,100
    );

    phase='z-lock';
    zProgress.textContent=`${traceScore} POINT`;
    zHint.textContent='Z TRACE COMPLETE!';
    zPanel.classList.add('success-v140');

    beep(
      traceScore>=90?1030:780,
      120,.03
    );

    setTimeout(()=>{
      if(!isGameRunValid(runId)||finished)return;
      prepareWave();
    },550);
  };

  zSvg.addEventListener(
    'pointerup',
    finishZ,
    {passive:false}
  );

  zSvg.addEventListener(
    'pointercancel',
    finishZ,
    {passive:false}
  );

  soulBtn.addEventListener('pointerdown',e=>{
    if(phase!=='soul'||finished)return;

    e.preventDefault();

    phase='soul-lock';

    if(raf)cancelAnimationFrame(raf);

    soulScore=clamp(
      Math.round(
        100-Math.abs(100-soulPct)*1.08
      ),
      0,100
    );

    powerEl.textContent=`${soulScore}%`;
    soulBtn.disabled=true;
    soulGauge.classList.add('locked-v140');

    beep(
      soulScore>=95?1080:
      soulScore>=80?850:570,
      120,.035
    );

    setTimeout(()=>{
      if(!isGameRunValid(runId)||finished)return;

      soulPanel.hidden=true;
      zPanel.hidden=false;

      stepEl.textContent='2 / 2';
      help.textContent='光るZ型ラインを1回なぞれ';
      control.innerHTML='';

      buildZSamples();
      phase='z';
      resetZ();
    },430);
  },{passive:false});

  function prepareWave(){
    phase='ready';

    const finalPower=clamp(
      Math.round(
        soulScore*.55+
        traceScore*.45
      ),
      0,100
    );

    powerEl.textContent=`${finalPower}%`;
    help.textContent='波動を放て！';

    zPanel.hidden=true;
    cinema.hidden=false;

    const enemyPower=randi(48,66);
    const pCore=Math.round(84+finalPower*.46);
    const eCore=Math.round(92+enemyPower*.38);

    const pBeamH=
      Math.round(54+finalPower*.52);

    const eBeamH=
      Math.round(58+enemyPower*.46);

    cinema.innerHTML=`
      <div class="wave-duel-bg-v140"></div>
      <div class="wave-duel-ground-v140"></div>

      <div id="wavePlayer140" class="wave-duel-mob-v140 player-v140" style="background-image:url('icon/01.png')"></div>
      <div id="waveEnemy140" class="wave-duel-mob-v140 enemy-v140" style="background-image:url('icon/10.png')"></div>

      <div id="wavePlayerSource140" class="wave-source-v140 player-v140">
        <div id="wavePlayerOrb140" class="wave-orb-v140 player-v140" style="--core:${pCore}px;--energy:${finalPower}">
          <i></i><b></b><span></span>
        </div>
      </div>

      <div id="waveEnemySource140" class="wave-source-v140 enemy-v140">
        <div id="waveEnemyOrb140" class="wave-orb-v140 enemy-v140" style="--core:${eCore}px;--energy:${enemyPower}">
          <i></i><b></b><span></span>
        </div>
      </div>

      <div id="wavePlayerBeam140" class="wave-beam-v140 player-v140" style="--beamH:${pBeamH}px"></div>
      <div id="waveEnemyBeam140" class="wave-beam-v140 enemy-v140" style="--beamH:${eBeamH}px"></div>
      <div id="waveClash140" class="wave-clash-v140"></div>
      <div id="waveFx140" class="wave-fx-v140"></div>
      <div id="waveText140" class="wave-text-v140"></div>
    `;

    const pOrb=
      document.getElementById('wavePlayerOrb140');

    if(finalPower>=78){
      pOrb.classList.add('strong-v140');
    }

    if(finalPower>=94){
      pOrb.classList.add('max-v140');
    }

    control.innerHTML=`
      <button id="waveFire140" class="primary wave-fire-btn-v140" type="button">
        モブくん波動パワー！
      </button>
    `;

    document
      .getElementById('waveFire140')
      .addEventListener('pointerdown',e=>{
        e.preventDefault();
        fireWave(finalPower,enemyPower);
      },{passive:false});
  }

  async function fireWave(finalPower,enemyPower){
    if(phase!=='ready'||finished)return;

    phase='charge';

    const btn=
      document.getElementById('waveFire140');

    const player=
      document.getElementById('wavePlayer140');

    const enemy=
      document.getElementById('waveEnemy140');

    const pSource=
      document.getElementById('wavePlayerSource140');

    const eSource=
      document.getElementById('waveEnemySource140');

    const pOrb=
      document.getElementById('wavePlayerOrb140');

    const eOrb=
      document.getElementById('waveEnemyOrb140');

    const pBeam=
      document.getElementById('wavePlayerBeam140');

    const eBeam=
      document.getElementById('waveEnemyBeam140');

    const clash=
      document.getElementById('waveClash140');

    const fx=
      document.getElementById('waveFx140');

    const text=
      document.getElementById('waveText140');

    btn.disabled=true;

    text.textContent='エネルギー凝縮…！';
    text.classList.add('show-v140');

    player.classList.add('charge-v140');
    enemy.classList.add('charge-v140');
    pSource.classList.add('charge-v140');
    eSource.classList.add('charge-v140');
    pOrb.classList.add('charge-v140');
    eOrb.classList.add('charge-v140');

    for(let i=0;i<7;i++){
      if(!isGameRunValid(runId))return;

      stage.classList.toggle(
        'charge-shake-v140',
        i%2===0
      );

      beep(
        (i%2?300:245)+finalPower*2,
        65,.018
      );

      await wait(210);
    }

    stage.classList.remove('charge-shake-v140');

    player.classList.remove('charge-v140');
    enemy.classList.remove('charge-v140');
    pSource.classList.remove('charge-v140');
    eSource.classList.remove('charge-v140');

    text.textContent='波動激突！！';

    pBeam.classList.add('fire-v140');
    eBeam.classList.add('fire-v140');
    clash.classList.add('active-v140');

    const weakLose=finalPower<24;
    const duration=randi(3350,4850);
    const t0=performance.now();

    while(performance.now()-t0<duration){
      if(!isGameRunValid(runId))return;

      const t=
        (performance.now()-t0)/duration;

      const wobble=
        Math.sin(t*Math.PI*8)*5+
        Math.sin(t*Math.PI*15)*2;

      const trend=
        weakLose
          ? -24*t
          : Math.min(
              27,
              (finalPower-enemyPower)*.15+
              20*t
            );

      const balance=
        clamp(
          50+trend+wobble,
          26,74
        );

      clash.style.left=`${balance}%`;

      const pShift=
        clamp((balance-50)*1.25,-27,32);

      const eShift=
        clamp((balance-50)*1.15,-32,27);

      player.style.translate=
        `${pShift}px ${Math.sin(t*Math.PI*12)*2}px`;

      enemy.style.translate=
        `${eShift}px ${Math.cos(t*Math.PI*11)*2}px`;

      pSource.style.translate=
        `${pShift+rand(-2,2)}px ${rand(-3,3)}px`;

      eSource.style.translate=
        `${eShift+rand(-2,2)}px ${rand(-3,3)}px`;

      pBeam.style.width=
        `${Math.max(4,balance-26.5)}%`;

      eBeam.style.width=
        `${Math.max(4,73.5-balance)}%`;

      pBeam.style.translate=
        `0 ${rand(-4,4)}px`;

      eBeam.style.translate=
        `0 ${rand(-4,4)}px`;

      fx.innerHTML='';

      const sparks=
        finalPower>=90?11:
        finalPower>=70?8:
        6;

      for(let i=0;i<sparks;i++){
        const sp=document.createElement('i');

        sp.style.setProperty(
          '--sx',
          `${rand(-72,72)}px`
        );

        sp.style.setProperty(
          '--sy',
          `${rand(-62,62)}px`
        );

        sp.style.setProperty(
          '--rot',
          `${randi(-80,80)}deg`
        );

        fx.appendChild(sp);
      }

      stage.classList.toggle(
        'fight-shake-v140',
        Math.random()<.72
      );

      beep(
        145+randi(0,85),
        20,.0035
      );

      await wait(145);
    }

    stage.classList.remove('fight-shake-v140');

    if(weakLose){
      pBeam.classList.add('burst-v140');
      pOrb.classList.add('burst-v140');
      player.classList.add('blown-v140');

      text.textContent='押し負けた！！';
      text.classList.add('lose-v140');

      beep(105,280,.065);
    }else{
      eBeam.classList.add('burst-v140');
      eOrb.classList.add('burst-v140');
      enemy.classList.add('blown-v140');

      text.textContent=
        finalPower>=90
          ? '圧倒的波動！！'
          : '波動勝負に勝利！！';

      text.classList.add('win-v140');
      stage.classList.add('finish-impact-v140');

      beep(
        finalPower>=90?1180:940,
        275,.065
      );
    }

    await wait(1400);

    if(!isGameRunValid(runId))return;

    finished=true;
    state.records.waveMaster[p.id]=finalPower;

    recordScreen(
      85,p,humanIndex,
      `${finalPower}<small>pt</small>`,
      weakLose
        ? '波動勝負 敗北'
        : '波動勝負 勝利'
    );
  }

  soulBtn.disabled=true;

  if(
    !(await countdown(
      'SOUL GAUGE',
      runId,
      {transparent:true}
    ))
  )return;

  if(!isGameRunValid(runId))return;

  phase='soul';
  soulBtn.disabled=false;
  phaseStart=performance.now();

  raf=requestAnimationFrame(soulFrame);
}


async function startBattleRoyaleMob(p,humanIndex,runId){
  gameFit();

  let active=false,finished=false,raf=null,last=0,start=0;
  let grenadeReadyAt=0,airReadyAt=0;
  let allyPortal=null,allyPortalUntil=0,allyPortalDone=false;
  let enemyPortal=null,enemyPortalUntil=0,enemyPortalReadyAt=0;
  const input={left:false,right:false},actors=[],bullets=[],grenades=[],stunGrenades=[];

  screen.innerHTML=`<div class="br-shell-v138">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんFPSアリーナに挑戦</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="br-hud-v138">
      <div><span>TIME</span><b id="brTime138">0.00</b></div>
      <div><span>AMMO</span><b id="brAmmo138">∞</b></div>
      <div><span>ALLY</span><b id="brAlly138">75 HP</b></div>
      <div><span>ENEMY</span><b id="brEnemy138">45 HP</b></div>
    </div>
    <div class="br-help-v138">中央ライン越境禁止 / 敵3人を全滅させろ</div>
    <div id="brStage138" class="br-stage-v138">
      <div class="br-war-sky-v138"></div><div class="br-ground-v138"></div><div class="br-center-line-v138"><span>NO ENTRY</span></div>
      <div class="br-platform-v138 ally p1"></div><div class="br-platform-v138 ally p2"></div>
      <div class="br-platform-v138 enemy p1"></div><div class="br-platform-v138 enemy p2"></div>
      <div id="brActorLayer138" class="br-actor-layer-v138"></div>
      <div id="brBulletLayer138" class="br-bullet-layer-v138"></div>
      <div id="brGrenadeLayer138" class="br-grenade-layer-v138"></div>
      <div id="brAbilityLayer138" class="br-ability-layer-v138"></div>
      <div id="brFx138" class="br-fx-v138"></div>
      <div id="brMessage138" class="br-message-v138"></div>
    </div>
    <div class="br-main-controls-v139">
      <button id="brLeft138">←</button>
      <button id="brJump138">JUMP</button>
      <button id="brShoot138" class="shoot">射撃</button>
      <button id="brRight138">→</button>
    </div>
    <div class="br-skill-controls-v139">
      <button id="brGrenade138">GRENADE <b>READY</b></button>
      <button id="brAirstrike141">戦闘機 <b>READY</b></button>
    </div>
  </div>`;

  const stage=document.getElementById('brStage138'),actorLayer=document.getElementById('brActorLayer138'),bulletLayer=document.getElementById('brBulletLayer138'),grenadeLayer=document.getElementById('brGrenadeLayer138'),abilityLayer=document.getElementById('brAbilityLayer138'),fx=document.getElementById('brFx138'),msg=document.getElementById('brMessage138');
  const timeEl=document.getElementById('brTime138'),ammoEl=document.getElementById('brAmmo138'),allyEl=document.getElementById('brAlly138'),enemyEl=document.getElementById('brEnemy138');
  const leftBtn=document.getElementById('brLeft138'),rightBtn=document.getElementById('brRight138'),jumpBtn=document.getElementById('brJump138'),shootBtn=document.getElementById('brShoot138'),grenadeBtn=document.getElementById('brGrenade138'),airBtn=document.getElementById('brAirstrike141');

  const W=Math.max(300,stage.clientWidth||340),H=Math.max(300,stage.clientHeight||360),centerX=W/2,groundY=H-48;
  const allyPlatforms=[{x:W*.07,y:groundY-76,w:W*.20},{x:W*.27,y:groundY-134,w:W*.17}];
  const enemyPlatforms=[{x:W*.73,y:groundY-76,w:W*.20},{x:W*.56,y:groundY-134,w:W*.17}];

  function makeActor(o){
    const el=document.createElement('div');
    el.className=`br-actor-v138 ${o.team} ${o.player?'player-v138':''}`;
    el.style.backgroundImage=`url('${o.img}')`;
    el.innerHTML=`<span>${o.label}</span><div class="br-hpbar-v138"><i></i></div>`;
    actorLayer.appendChild(el);
    const maxHp=o.team==='ally'?25:15;
    const a={...o,y:groundY-38,vx:0,vy:0,w:30,h:38,hp:maxHp,maxHp,alive:true,onGround:true,nextShot:0,nextJump:0,nextDecision:0,targetX:o.x,targetY:groundY-38,portalLock:0,voidUntil:0,voidReadyAt:0,voidUses:0,stunUntil:0,stunReadyAt:0,el,hpEl:el.querySelector('i')};
    el.style.left=`${a.x}px`;el.style.top=`${a.y}px`;actors.push(a);return a;
  }

  const player=makeActor({id:'player',team:'ally',x:W*.12,img:'icon/01.png',player:true,label:'YOU',role:''});
  const allyA=makeActor({id:'allyA',team:'ally',x:W*.27,img:'icon/02.png',label:'ALLY A',role:'portal'});
  const allyB=makeActor({id:'allyB',team:'ally',x:W*.40,img:'icon/03.png',label:'ALLY B',role:'support'});
  const enemyA=makeActor({id:'enemyA',team:'enemy',x:W*.60,img:'icon/08.png',label:'ENEMY A',role:'portal'});
  const enemyB=makeActor({id:'enemyB',team:'enemy',x:W*.74,img:'icon/09.png',label:'ENEMY B',role:'void'});
  const enemyC=makeActor({id:'enemyC',team:'enemy',x:W*.87,img:'icon/10.png',label:'ENEMY C',role:'stun'});

  const allies=()=>actors.filter(a=>a.team==='ally'&&a.alive),enemies=()=>actors.filter(a=>a.team==='enemy'&&a.alive);
  const teamHp=t=>actors.filter(a=>a.team===t&&a.alive).reduce((s,a)=>s+a.hp,0);

  function updateHp(a){a.hpEl.style.width=`${clamp(a.hp/a.maxHp*100,0,100)}%`}
  function updateHud(now=performance.now()){
    ammoEl.textContent='∞';
    allyEl.textContent=`${teamHp('ally')} HP`;
    enemyEl.textContent=`${teamHp('enemy')} HP`;
    grenadeBtn.querySelector('b').textContent=now<grenadeReadyAt?`${((grenadeReadyAt-now)/1000).toFixed(1)}`:'READY';
    airBtn.querySelector('b').textContent=now<airReadyAt?`${((airReadyAt-now)/1000).toFixed(1)}`:'READY';
  }
  function pop(x,y,text,cls=''){const e=document.createElement('div');e.className=`br-hit-fx-v138 ${cls}`;e.style.left=`${x}px`;e.style.top=`${y}px`;e.textContent=text;fx.appendChild(e);setTimeout(()=>e.remove(),550)}
  function eliminate(a){if(!a.alive)return;a.alive=false;a.hp=0;updateHp(a);a.el.classList.add('down-v138');pop(a.x+a.w/2,a.y,'DOWN');beep(a.team==='enemy'?680:120,90,.025);if(enemies().length===0)finishWin();else if(allies().length===0)finishLose()}
  function damage(a,n){if(!a.alive||performance.now()<a.voidUntil)return;a.hp=clamp(a.hp-n,0,a.maxHp);updateHp(a);a.el.classList.remove('hit-v138');void a.el.offsetWidth;a.el.classList.add('hit-v138');pop(a.x+a.w/2,a.y+8,`-${n}`);if(a.hp<=0)eliminate(a)}
  function nearestTarget(a){const pool=a.team==='ally'?enemies():allies();return pool.slice().sort((x,y)=>Math.hypot(x.x-a.x,x.y-a.y)-Math.hypot(y.x-a.x,y.y-a.y))[0]||null}

  function fireBullet(a,manual=false){
    const now=performance.now();if(!a.alive||now<a.stunUntil)return;
    const target=nearestTarget(a);if(!target)return;
    const dir=a.team==='ally'?1:-1,dy=clamp((target.y+17)-(a.y+17),-70,70),dx=Math.max(60,Math.abs(target.x-a.x)),speed=manual?440:390;
    const el=document.createElement('i');el.className=`br-bullet-v138 ${a.team}`;bulletLayer.appendChild(el);
    bullets.push({team:a.team,x:a.x+a.w/2+dir*17,y:a.y+17,vx:dir*speed,vy:dy/dx*speed,damage:1,dead:false,el});
    a.el.classList.remove('shoot-v138');void a.el.offsetWidth;a.el.classList.add('shoot-v138');beep(manual?520:330,28,.008);updateHud(now);
  }

  function spawnGrenade(owner,type='damage'){
    const dir=owner.team==='ally'?1:-1,el=document.createElement('div');el.className=`br-grenade-v138 ${type==='stun'?'stun-v138':''}`;grenadeLayer.appendChild(el);
    (type==='stun'?stunGrenades:grenades).push({owner,team:owner.team,type,x:owner.x+owner.w/2,y:owner.y+4,vx:dir*220,vy:-245,fuse:performance.now()+1050,dead:false,el});
  }
  function playerGrenade(){const now=performance.now();if(!active||finished||now<grenadeReadyAt||!player.alive)return;grenadeReadyAt=now+5000;spawnGrenade(player);updateHud(now)}
  function airStrike(){
    const now=performance.now();
    if(!active||finished||now<airReadyAt||!player.alive)return;

    airReadyAt=now+3000;
    msg.textContent='FIGHTER AIR STRIKE!';
    updateHud(now);

    const plane=document.createElement('div');
    plane.className='br-fighter-v141';
    abilityLayer.appendChild(plane);

    requestAnimationFrame(()=>{
      plane.classList.add('fly-v141');
    });

    setTimeout(()=>plane.remove(),1250);

    for(let i=0;i<5;i++){
      setTimeout(()=>{
        if(!active||finished||!isGameRunValid(runId))return;

        const pool=enemies();
        if(!pool.length)return;

        const target=pool[i%pool.length]||pool[0];
        const missile=document.createElement('div');
        missile.className='br-air-missile-v141';

        const impactX=clamp(target.x+target.w/2,18,W-18);
        const impactY=target.y+target.h*.55;

        missile.style.left=`${impactX}px`;
        missile.style.top='-28px';
        abilityLayer.appendChild(missile);

        requestAnimationFrame(()=>{
          missile.style.top=`${impactY}px`;
        });

        setTimeout(()=>{
          if(!missile.isConnected)return;

          missile.remove();

          const blast=document.createElement('div');
          blast.className='br-air-blast-v141';
          blast.style.left=`${impactX}px`;
          blast.style.top=`${impactY}px`;
          fx.appendChild(blast);

          setTimeout(()=>blast.remove(),520);

          if(target.alive){
            damage(target,3);
          }

          beep(125,95,.025);
        },430);
      },180+i*145);
    }

    beep(710,100,.02);
  }
  function jump(a){const now=performance.now();if(!a.alive||!a.onGround||now<a.stunUntil)return;a.vy=-395;a.onGround=false;a.el.classList.add('jump-v138');setTimeout(()=>a.el.classList.remove('jump-v138'),160)}
  function activateVoid(a,now){
    if(a.role!=='void'||now<a.voidReadyAt||!a.alive||a.voidUses>=2)return;
    a.voidUses++;
    a.voidUntil=now+2000;
    a.voidReadyAt=now+3000;
    a.el.classList.add('void-v138');
    pop(a.x,a.y,`VOID ${a.voidUses}/2`);
    setTimeout(()=>a.el.classList.remove('void-v138'),2000);
  }

  function renderPortals(pair,team){pair.forEach(q=>{const el=document.createElement('div');el.className=`br-portal-v138 ${team}`;el.dataset.portalTeam=team;el.style.left=`${q.x}px`;el.style.top=`${q.y}px`;abilityLayer.appendChild(el)})}
  function activateAllyPortal(now){if(allyPortalDone||!allyA.alive)return;allyPortalDone=true;const pf=allyPlatforms[randi(0,1)];allyPortal=[{x:centerX-30,y:groundY-26},{x:pf.x+pf.w/2,y:pf.y-27}];allyPortalUntil=now+3000;renderPortals(allyPortal,'ally');pop(allyA.x,allyA.y,'PORTAL')}
  function activateEnemyPortal(now){if(enemyPortal||now<enemyPortalReadyAt||!enemyA.alive)return;enemyPortalReadyAt=now+6000;const pf=enemyPlatforms[randi(0,1)];enemyPortal=[{x:centerX+30,y:groundY-26},{x:pf.x+pf.w/2,y:pf.y-27}];enemyPortalUntil=now+3000;renderPortals(enemyPortal,'enemy');pop(enemyA.x,enemyA.y,'PORTAL')}
  function clearPortals(team){abilityLayer.querySelectorAll(`[data-portal-team="${team}"]`).forEach(e=>e.remove());if(team==='ally')allyPortal=null;else enemyPortal=null}
  function maybePortal(a,now){
    const pair=a.team==='ally'?allyPortal:enemyPortal;if(!pair||now<a.portalLock)return;
    for(const [src,dst] of [[pair[0],pair[1]],[pair[1],pair[0]]]){
      if(Math.hypot(a.x+a.w/2-src.x,a.y+a.h/2-src.y)<32){
        const min=a.team==='ally'?0:centerX+5,max=a.team==='ally'?centerX-a.w-5:W-a.w;
        a.x=clamp(dst.x-a.w/2,min,max);a.y=dst.y-a.h/2;a.portalLock=now+650;pop(dst.x,dst.y,'WARP');break;
      }
    }
  }

  function bindHold(btn,key){const on=e=>{e.preventDefault();if(active&&!finished)input[key]=true;try{btn.setPointerCapture(e.pointerId)}catch(_){}},off=e=>{if(e)e.preventDefault();input[key]=false};btn.addEventListener('pointerdown',on,{passive:false});btn.addEventListener('pointerup',off,{passive:false});btn.addEventListener('pointercancel',off,{passive:false});btn.addEventListener('lostpointercapture',off,{passive:false})}
  bindHold(leftBtn,'left');bindHold(rightBtn,'right');
  jumpBtn.addEventListener('pointerdown',e=>{e.preventDefault();if(active&&!finished)jump(player)},{passive:false});
  shootBtn.addEventListener('pointerdown',e=>{e.preventDefault();if(!active||finished||!player.alive)return;fireBullet(player,true)},{passive:false});
  grenadeBtn.addEventListener('pointerdown',e=>{e.preventDefault();playerGrenade()},{passive:false});
  airBtn.addEventListener('pointerdown',e=>{e.preventDefault();airStrike()},{passive:false});

  function actorLand(a,prevBottom,newBottom){
    a.onGround=false;const min=a.team==='ally'?0:centerX+5,max=a.team==='ally'?centerX-a.w-5:W-a.w;a.x=clamp(a.x,min,max);
    const ps=a.team==='ally'?allyPlatforms:enemyPlatforms;
    for(const pf of ps){
      if(a.x+a.w-4>pf.x&&a.x+4<pf.x+pf.w&&prevBottom<=pf.y+5&&newBottom>=pf.y){a.y=pf.y-a.h;a.vy=0;a.onGround=true;return}
    }
    if(prevBottom<=groundY+5&&newBottom>=groundY){a.y=groundY-a.h;a.vy=0;a.onGround=true}
  }

  function aiActor(a,now){
    if(!a.alive||a.player||now<a.stunUntil)return;const target=nearestTarget(a);if(!target)return;
    if(a.role==='void'&&a.voidUses<2&&now>=a.voidReadyAt&&(a.hp<=11||Math.random()<.018))activateVoid(a,now);
    if(a.role==='portal'&&a.team==='enemy'&&!enemyPortal&&now>=enemyPortalReadyAt&&(Math.abs(target.x-a.x)>W*.20||a.hp<=13||Math.random()<.018))activateEnemyPortal(now);
    if(a.role==='stun'&&now>=a.stunReadyAt&&Math.abs(target.x-a.x)<W*.62){a.stunReadyAt=now+4300;spawnGrenade(a,'stun')}
    if(now>=a.nextDecision){
      a.nextDecision=now+rand(140,330);const ps=a.team==='ally'?allyPlatforms:enemyPlatforms;
      if(Math.random()<.50){const pf=ps[randi(0,1)];a.targetX=pf.x+pf.w/2-a.w/2;a.targetY=pf.y-a.h}
      else{const min=a.team==='ally'?8:centerX+12,max=a.team==='ally'?centerX-a.w-12:W-a.w-8;a.targetX=rand(min,max);a.targetY=groundY-a.h}
    }
    const dx=a.targetX-a.x;a.vx=Math.abs(dx)>7?Math.sign(dx)*rand(96,132):0;
    if(a.onGround&&now>=a.nextJump&&(Math.abs(a.targetY-a.y)>26||Math.random()<.045)){jump(a);a.nextJump=now+rand(330,680)}
    if(now>=a.nextShot){fireBullet(a,false);a.nextShot=now+rand(a.team==='enemy'?330:400,a.team==='enemy'?610:720)}
  }

  function explodeGrenade(g){
    const targets=g.team==='ally'?enemies():allies();
    const blast=document.createElement('div');blast.className=`br-grenade-blast-v138 ${g.type==='stun'?'stun-v138':''}`;blast.style.left=`${g.x}px`;blast.style.top=`${g.y}px`;fx.appendChild(blast);setTimeout(()=>blast.remove(),620);
    for(const target of targets){
      if(Math.hypot(target.x+target.w/2-g.x,target.y+target.h/2-g.y)<96){
        if(g.type==='stun'){target.stunUntil=performance.now()+1250;target.el.classList.add('stunned-v138');setTimeout(()=>target.el.classList.remove('stunned-v138'),1250);pop(target.x,target.y,'STUN')}
        else damage(target,5);
      }
    }
  }

  async function finishWin(){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);const elapsed=Math.max(1,Math.round(performance.now()-start));state.records.battleRoyaleMob[p.id]=elapsed;msg.textContent='CHAMPION!';msg.className='br-message-v138 win-v138';stage.classList.add('victory-v138');beep(1160,240,.06);await wait(1150);if(isGameRunValid(runId))recordScreen(86,p,humanIndex,`${(elapsed/1000).toFixed(2)}<small>秒</small>`,'敵チーム全滅')}
  async function finishLose(){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);state.records.battleRoyaleMob[p.id]=60000;msg.textContent='SQUAD ELIMINATED';msg.className='br-message-v138 lose-v138';beep(105,220,.045);await wait(900);if(isGameRunValid(runId))recordScreen(86,p,humanIndex,`60.00<small>秒</small>`,'敗北')}

  if(!(await countdown('3 VS 3',runId,{transparent:true})))return;
  active=true;start=last=performance.now();enemyPortalReadyAt=start+4200;
  actors.forEach(a=>{a.nextShot=start+rand(420,850);a.nextJump=start+rand(550,1100);a.nextDecision=start+rand(80,220);a.voidReadyAt=start+1200;a.stunReadyAt=start+2500;updateHp(a)});
  updateHud(start);

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;const dt=Math.min(.035,(now-last)/1000);last=now;timeEl.textContent=((now-start)/1000).toFixed(2);
    if(!allyPortalDone&&now-start>=5000)activateAllyPortal(now);
    if(allyPortal&&now>=allyPortalUntil)clearPortals('ally');
    if(enemyPortal&&now>=enemyPortalUntil)clearPortals('enemy');

    for(const a of actors){
      if(!a.alive)continue;
      if(a.player){const d=now<a.stunUntil?0:(input.left&&!input.right?-1:input.right&&!input.left?1:0);a.vx=d*110}else aiActor(a,now);
      a.x+=a.vx*dt;const pb=a.y+a.h;a.vy+=470*dt;a.y+=a.vy*dt;actorLand(a,pb,a.y+a.h);maybePortal(a,now);a.el.style.left=`${a.x}px`;a.el.style.top=`${a.y}px`;
    }

    for(const b of bullets){
      if(b.dead)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;b.el.style.left=`${b.x}px`;b.el.style.top=`${b.y}px`;
      for(const t of actors.filter(a=>a.alive&&a.team!==b.team)){
        if(b.x>=t.x-4&&b.x<=t.x+t.w+4&&b.y>=t.y&&b.y<=t.y+t.h){b.dead=true;b.el.remove();damage(t,b.damage);break}
      }
      if(b.x<-25||b.x>W+25||b.y<-20||b.y>H+20){b.dead=true;b.el.remove()}
    }

    for(const list of [grenades,stunGrenades]){
      for(const g of list){
        if(g.dead)continue;g.x+=g.vx*dt;g.y+=g.vy*dt;g.vy+=480*dt;
        if(g.y>=groundY-12){g.y=groundY-12;g.vy*=-.32;g.vx*=.76}
        g.el.style.left=`${g.x}px`;g.el.style.top=`${g.y}px`;
        if(now>=g.fuse){g.dead=true;g.el.remove();explodeGrenade(g)}
      }
    }

    updateHud(now);raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}

// =========================================================
// V10.38 GAME 88 — Little MOB SHOT
// =========================================================
async function startLittleMobShot(p,humanIndex,runId){
  gameFit();

  let active=false,finished=false,raf=null,last=0,start=0,nextSpawn=0,nextAutoShot=0;
  let x=0,dir=0,kills=0,bombReadyAt=0,waveReadyAt=0,waveUntil=0;
  const bullets=[],enemies=[];

  screen.innerHTML=`<div class="little-shot-shell-v138">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>Little MOB SHOT</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="v125-hud"><div><span>TIME</span><b id="lsTime138">10.00</b></div><div><span>KO</span><b id="lsKills138">0</b></div><div><span>WIDE</span><b id="lsWide138">1</b></div></div>
    <div id="lsStage138" class="ls-stage-v138">
      <div class="ls-stars-v139"><i></i><i></i><i></i><i></i><i></i><i></i></div><div id="lsEnemyLayer138" class="ls-layer-v138"></div><div id="lsBulletLayer138" class="ls-layer-v138"></div><div id="lsFx138" class="ls-layer-v138"></div><div id="lsLaser138" class="ls-laser-v138"></div>
      <div id="lsPlayer138" class="ls-player-v138"><div class="ls-record-v138"></div><div class="ls-mob-v138" style="background-image:url('icon/01.png')"></div></div>
      <div id="lsPet139" class="ls-pet-v139"><i></i><b></b><span></span></div>
    </div>
    <div class="ls-controls-v138"><button id="lsLeft138">←</button><button id="lsBomb138" class="bomb">BOMB<b>READY</b></button><button id="lsWave138" class="wave">波動<b>READY</b></button><button id="lsRight138">→</button></div>
  </div>`;

  const stage=document.getElementById('lsStage138'),player=document.getElementById('lsPlayer138'),enemyLayer=document.getElementById('lsEnemyLayer138'),bulletLayer=document.getElementById('lsBulletLayer138'),fx=document.getElementById('lsFx138'),laser=document.getElementById('lsLaser138');
  const pet=document.getElementById('lsPet139');
  let petX=0,petY=0,nextPetShot=0;
  const timeEl=document.getElementById('lsTime138'),killsEl=document.getElementById('lsKills138'),wideEl=document.getElementById('lsWide138'),left=document.getElementById('lsLeft138'),right=document.getElementById('lsRight138'),bomb=document.getElementById('lsBomb138'),wave=document.getElementById('lsWave138');
  const W=Math.max(300,stage.clientWidth||340),H=Math.max(300,stage.clientHeight||420);x=W/2;

  function spawnEnemy(elapsed){
    const roll=Math.random();let kind='small',hp=1,size=28,speed=80+elapsed*8;
    if(roll>.93){kind='xl';hp=18;size=78;speed=45+elapsed*4}
    else if(roll>.82){kind='large';hp=7;size=56;speed=56+elapsed*5}
    else if(roll>.65){kind='mid';hp=3;size=40;speed=68+elapsed*6}
    const el=document.createElement('div');el.className=`ls-slime-v138 ${kind}`;el.innerHTML='<i></i><b></b>';enemyLayer.appendChild(el);
    enemies.push({x:rand(size/2,W-size/2),y:-size,size,hp,speed,dead:false,el});
  }
  function destroyEnemy(e){
    if(e.dead)return;e.dead=true;kills++;killsEl.textContent=kills;wideEl.textContent=1+Math.floor(kills/10);e.el.remove();
    const b=document.createElement('div');b.className='ls-pop-v138';b.style.left=`${e.x}px`;b.style.top=`${e.y}px`;fx.appendChild(b);setTimeout(()=>b.remove(),400);beep(600+Math.min(350,kills*5),25,.007);
  }
  function autoFire(){
    const lanes=clamp(1+Math.floor(kills/10),1,6);
    const spread=lanes===1?[0]:Array.from({length:lanes},(_,i)=>(i-(lanes-1)/2)*16);
    for(const off of spread){const el=document.createElement('i');el.className='ls-bullet-v138';bulletLayer.appendChild(el);bullets.push({x:x+off*.18,y:H-82,vx:off*1.7,vy:-420,dead:false,el})}
  }
  function useBomb(){
    const now=performance.now();if(!active||finished||now<bombReadyAt)return;bombReadyAt=now+4000;stage.classList.add('bomb-v138');setTimeout(()=>stage.classList.remove('bomb-v138'),450);
    for(const e of enemies){if(!e.dead&&e.y>H*.12){e.hp-=8;if(e.hp<=0)destroyEnemy(e)}}beep(100,170,.05);
  }
  function useWave(){const now=performance.now();if(!active||finished||now<waveReadyAt)return;waveReadyAt=now+6000;waveUntil=now+3000;laser.classList.add('active-v138');beep(880,150,.04)}
  function bind(btn,d){btn.addEventListener('pointerdown',e=>{e.preventDefault();dir=d;try{btn.setPointerCapture(e.pointerId)}catch(_){}},{passive:false});const off=e=>{if(e)e.preventDefault();if(dir===d)dir=0};btn.addEventListener('pointerup',off,{passive:false});btn.addEventListener('pointercancel',off,{passive:false});btn.addEventListener('lostpointercapture',off,{passive:false})}
  bind(left,-1);bind(right,1);bomb.addEventListener('pointerdown',e=>{e.preventDefault();useBomb()},{passive:false});wave.addEventListener('pointerdown',e=>{e.preventDefault();useWave()},{passive:false});

  function petFire(now){
    const target=enemies
      .filter(e=>!e.dead)
      .sort((a,b)=>Math.hypot(a.x-petX,a.y-petY)-Math.hypot(b.x-petX,b.y-petY))[0];
    if(!target)return;

    const dx=target.x-petX;
    const dy=target.y-petY;
    const d=Math.max(1,Math.hypot(dx,dy));
    const el=document.createElement('i');
    el.className='ls-bullet-v138 pet-v139';
    bulletLayer.appendChild(el);
    bullets.push({
      x:petX,y:petY,vx:dx/d*340,vy:dy/d*340,
      dead:false,el,pet:true
    });
  }

  async function finish(){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);state.records.littleMobShot[p.id]=kills;beep(kills>=60?1100:kills>=35?780:500,190,.045);await wait(850);if(isGameRunValid(runId))recordScreen(87,p,humanIndex,`${kills}<small> KO</small>`,`10秒 / WIDE ${1+Math.floor(kills/10)}`)}
  if(!(await countdown('LITTLE MOB SHOT',runId,{transparent:true})))return;
  active=true;start=last=performance.now();nextSpawn=start+35;nextAutoShot=start+70;nextPetShot=start+100;
  for(let i=0;i<7;i++)spawnEnemy(0);


  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;const dt=Math.min(.035,(now-last)/1000);last=now;const elapsed=(now-start)/1000;
    x=clamp(x+dir*190*dt,34,W-34);player.style.left=`${x}px`;
    if(now>=nextAutoShot){autoFire();nextAutoShot=now+145}
    const gap=clamp(118-elapsed*6,54,118);
    if(now>=nextSpawn){
      spawnEnemy(elapsed);
      if(Math.random()<.72)spawnEnemy(elapsed);
      if(elapsed>3&&Math.random()<.40)spawnEnemy(elapsed);
      nextSpawn=now+gap;
    }
    petX=clamp(
      x+Math.sin(elapsed*2.5)*72,
      24,W-24
    );
    petY=H-112+Math.sin(elapsed*4.2)*10;
    pet.style.left=`${petX}px`;
    pet.style.top=`${petY}px`;

    if(now>=nextPetShot){
      petFire(now);
      nextPetShot=now+230;
    }

    for(const b of bullets){
      if(b.dead)continue;b.x+=b.vx*dt;b.y+=b.vy*dt;b.el.style.left=`${b.x}px`;b.el.style.top=`${b.y}px`;
      if(b.y<-15){b.dead=true;b.el.remove();continue}
      for(const e of enemies){if(e.dead)continue;if(Math.hypot(b.x-e.x,b.y-e.y)<e.size*.44+7){b.dead=true;b.el.remove();e.hp-=b.pet?1.5:1;if(e.hp<=0)destroyEnemy(e);break}}
    }
    const waveActive=now<waveUntil;laser.classList.toggle('active-v138',waveActive);laser.style.left=`${x}px`;
    for(const e of enemies){
      if(e.dead)continue;e.y+=e.speed*dt;e.el.style.left=`${e.x}px`;e.el.style.top=`${e.y}px`;
      if(waveActive&&Math.abs(e.x-x)<31&&e.y<H-70){e.hp-=8*dt;if(e.hp<=0){destroyEnemy(e);continue}}
      if(e.y>H+90){e.dead=true;e.el.remove()}
    }
    bomb.querySelector('b').textContent=now<bombReadyAt?`${((bombReadyAt-now)/1000).toFixed(1)}`:'READY';
    wave.querySelector('b').textContent=now<waveReadyAt?`${((waveReadyAt-now)/1000).toFixed(1)}`:'READY';
    timeEl.textContent=Math.max(0,10-elapsed).toFixed(2);
    if(elapsed>=10){finish();return}
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}

// =========================================================
// V10.38 GAME 89 — モブくんモンスターボックスに挑む
// =========================================================
async function startMonsterBoxMob(p,humanIndex,runId){
  gameFit();

  let active=false,finished=false,raf=null,last=0,level=15,score=0,jumping=false,vy=0,y=0,boardX=0,boxX=0,passedBoard=false,launched=false;
  screen.innerHTML=`<div class="mbox-shell-v138">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>モブくんモンスターボックスに挑む</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="v125-hud"><div><span>LEVEL</span><b id="mbLevel138">15段</b></div><div><span>SCORE</span><b id="mbScore138">0</b></div></div>
    <div id="mbStage138" class="mb-stage-v138"><div class="mb-run-lines-v138"></div><div class="mb-ground-v138"></div><div id="mbBoard138" class="mb-board-v138"></div><div id="mbBox138" class="mb-box-v138"></div><div id="mbMob138" class="mb-mob-v138" style="background-image:url('icon/01.png')"></div><div id="mbFx138" class="mb-fx-v138"></div></div>
    <button id="mbJump138" class="primary mb-jump-v138">JUMP</button>
  </div>`;

  const stage=document.getElementById('mbStage138'),board=document.getElementById('mbBoard138'),box=document.getElementById('mbBox138'),mob=document.getElementById('mbMob138'),fx=document.getElementById('mbFx138'),levelEl=document.getElementById('mbLevel138'),scoreEl=document.getElementById('mbScore138'),jumpBtn=document.getElementById('mbJump138');
  const W=Math.max(300,stage.clientWidth||340),H=Math.max(300,stage.clientHeight||390),groundY=H-50,mobX=54;y=groundY-44;
  const boxHeight=()=>82+(level-15)*12;

  function resetCycle(){
    boardX=W+70;
    boxX=boardX+115;
    passedBoard=false;
    launched=false;
    board.style.left=`${boardX}px`;
    board.style.top=`${groundY-13}px`;
    box.style.left=`${boxX}px`;
    box.style.height=`${boxHeight()}px`;
    box.style.top=`${groundY-boxHeight()}px`;
    board.classList.remove('hit-v138');
  }
  function pop(text,xp,yp,cls=''){const e=document.createElement('div');e.className=`mb-pop-v138 ${cls}`;e.textContent=text;e.style.left=`${xp}px`;e.style.top=`${yp}px`;fx.appendChild(e);setTimeout(()=>e.remove(),650)}
  function jump(){if(!active||finished||jumping||launched)return;jumping=true;vy=-205;beep(500,45,.012)}
  jumpBtn.addEventListener('pointerdown',e=>{e.preventDefault();jump()},{passive:false});

  async function fail(reason){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);state.records.monsterBoxMob[p.id]=score;mob.classList.add('fail-v138');pop(reason,mobX+30,y,'fail-v138');beep(120,180,.04);await wait(850);if(isGameRunValid(runId))recordScreen(88,p,humanIndex,`${score}<small>pt</small>`,`${level}段で終了`)}
  async function clearAll(){if(finished)return;finished=true;active=false;if(raf)cancelAnimationFrame(raf);score=100;state.records.monsterBoxMob[p.id]=100;stage.classList.add('clear-v138');pop('20段 CLEAR!!',W/2,H*.34,'clear-v138');beep(1120,220,.055);await wait(1050);if(isGameRunValid(runId))recordScreen(88,p,humanIndex,`100<small>pt</small>`,'20段 CLEAR')}

  mob.style.top=`${y}px`;
  resetCycle();

  if(!(await countdown('MONSTER BOX',runId,{transparent:true})))return;
  active=true;
  last=performance.now();

  function frame(now){
    if(!active||finished||!isGameRunValid(runId))return;const dt=Math.min(.035,(now-last)/1000);last=now;const speed=205+(level-15)*9;
    boardX-=speed*dt;boxX-=speed*dt;board.style.left=`${boardX}px`;box.style.left=`${boxX}px`;

    if(jumping||launched){vy+=470*dt;y+=vy*dt;if(!launched&&y>=groundY-44){y=groundY-44;vy=0;jumping=false}}

    const footX=mobX+24,boardCenter=boardX+35;
    if(!passedBoard&&footX>=boardX&&footX<=boardX+70){
      passedBoard=true;const feet=y+44,boardY=groundY-13;
      if(Math.abs(feet-boardY)<22&&vy>=0){
        const err=Math.abs(footX-boardCenter),quality=clamp(1-err/35,0,1),launchHeight=120+quality*145;
        vy=-Math.sqrt(2*470*Math.max(80,launchHeight));launched=true;jumping=true;board.classList.add('hit-v138');pop(quality>.82?'PERFECT!':quality>.52?'GOOD!':'WEAK',boardCenter,groundY-45,quality>.82?'good-v138':'');mob.dataset.quality=String(quality);beep(quality>.82?940:650,90,.025);
      }
    }

    const bh=boxHeight(),boxTop=groundY-bh;
    if(boxX<mobX+44&&boxX+82>mobX+8&&y+44>boxTop+5){fail('HIT!');return}

    if(launched&&boxX+82<mobX-18&&y>=groundY-44){
      y=groundY-44;vy=0;jumping=false;launched=false;
      const quality=Number(mob.dataset.quality||0);score=clamp(Math.round((level-14)/6*88+quality*12),0,100);scoreEl.textContent=score;pop(`${level}段 CLEAR`,W*.50,H*.28,'clear-v138');beep(840,100,.025);
      if(level>=20){clearAll();return}
      level++;levelEl.textContent=`${level}段`;resetCycle();
    }

    if(boxX<-130&&!launched){fail('MISS!');return}
    mob.style.top=`${y}px`;mob.classList.toggle('air-v138',jumping||launched);
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}



// =========================================================
// V10.40 GAME 90 — モブくんエイリアンと戦う
// =========================================================

async function startAlienBattleMob(p,humanIndex,runId){
  gameFit();

  let active=false;
  let finished=false;
  let raf=null;
  let last=0;
  let start=0;
  let nextBossAttack=0;
  let bossAttackLock=false;
  let chargeStart=0;
  let charging=false;
  let activeChargeBall=null;
  let nextPlayerShotAt=0;
  let giantReady=false;
  let giantUsed=false;
  let giantUntil=0;
  let giantPunchReadyAt=0;
  let airMinisSpawned=false;
  let rapidHeld=false;
  let nextRapidShotAt=0;
  let artilleryReadyAt=0;
  const weakAllies=[];
  const weakShots=[];
  const airMinis=[];

  const input={left:false,right:false};
  const shots=[];
  const fireballs=[];
  const kids=[];
  const team=[];

  screen.innerHTML=`<div class="alien-shell-v140">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくんエイリアンと戦う</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="alien-hud-v140">
      <div><span>ALIEN HP</span><b id="alienHp140">100 / 100</b></div>
      <div><span>YOU HP</span><b id="alienYouHp140">20 / 20</b></div>
      <div><span>CHARGE</span><b id="alienCharge140">0.0s</b></div>
    </div>

    <div id="alienStage140" class="alien-stage-v140">
      <div class="alien-sky-v140"><i></i><i></i><i></i></div>
      <div class="alien-ground-v140"></div>

      <div id="alienTeamLayer140" class="alien-layer-v140"></div>
      <div id="alienShotLayer140" class="alien-layer-v140"></div>
      <div id="alienEnemyLayer140" class="alien-layer-v140"></div>
      <div id="alienFx140" class="alien-layer-v140"></div>

      <div id="alienBoss140" class="alien-boss-v140 giant-v141">
        <div class="alien-horn-v141 h1"></div>
        <div class="alien-horn-v141 h2"></div>
        <div class="alien-head-v140">
          <i class="eye e1"></i><i class="eye e2"></i>
          <i class="eye e3"></i>
          <b class="mouth"></b>
        </div>
        <div class="alien-body-v140">
          <i class="alien-spike-v141 s1"></i>
          <i class="alien-spike-v141 s2"></i>
          <i class="alien-spike-v141 s3"></i>
        </div>
        <div id="alienArm140" class="alien-arm-v140 left-v141"></div>
        <div class="alien-arm-v141 right-v141"></div>
        <div class="alien-leg-v141 leg1"><i class="alien-foot-v142"></i></div>
        <div class="alien-leg-v141 leg2"><i class="alien-foot-v142"></i></div>
        <div class="alien-ground-shadow-v142"></div>
        <div class="alien-boss-hp-v140"><i id="alienBossHpBar140"></i></div>
      </div>

      <div id="alienWave140" class="alien-full-wave-v140"></div>
      <div id="alienMessage140" class="alien-message-v140"></div>
    </div>

    <div class="alien-controls-v140">
      <button id="alienLeft140">←</button>
      <button id="alienJump140">JUMP</button>
      <button id="alienRapid146">射撃</button>
      <button id="alienShoot140" class="shoot"><span id="alienHeavyLabel146">砲撃</span><b id="alienHeavyCd146">READY</b></button>
      <button id="alienRight140">→</button>
    </div>
    <div class="alien-special-row-v145">
      <button id="alienGiant145" type="button" disabled>超巨大化 <b>5秒後</b></button>
    </div>
  </div>`;

  const stage=document.getElementById('alienStage140');
  const teamLayer=document.getElementById('alienTeamLayer140');
  const shotLayer=document.getElementById('alienShotLayer140');
  const enemyLayer=document.getElementById('alienEnemyLayer140');
  const fx=document.getElementById('alienFx140');
  const bossEl=document.getElementById('alienBoss140');
  const armEl=document.getElementById('alienArm140');
  const bossBar=document.getElementById('alienBossHpBar140');
  const waveEl=document.getElementById('alienWave140');
  const msg=document.getElementById('alienMessage140');
  const bossHpEl=document.getElementById('alienHp140');
  const youHpEl=document.getElementById('alienYouHp140');
  const chargeEl=document.getElementById('alienCharge140');
  const leftBtn=document.getElementById('alienLeft140');
  const rightBtn=document.getElementById('alienRight140');
  const jumpBtn=document.getElementById('alienJump140');
  const shootBtn=document.getElementById('alienShoot140');
  const rapidBtn=document.getElementById('alienRapid146');
  const heavyLabel=document.getElementById('alienHeavyLabel146');
  const heavyCd=document.getElementById('alienHeavyCd146');
  const giantBtn=document.getElementById('alienGiant145');

  const W=Math.max(300,stage.clientWidth||340);
  const H=Math.max(300,stage.clientHeight||370);
  const groundY=H-48;

  const boss={
    hp:100,
    maxHp:100,
    x:clamp(W-224-10,W*.30,W*.42),
    y:0,
    w:224,
    h:groundY,
    alive:true
  };
  const bossBaseX=boss.x;

  bossEl.style.left=`${boss.x}px`;
  bossEl.style.top=`${boss.y}px`;

  function makeRobot(id,x,img,player=false){
    const el=document.createElement('div');
    el.className=`alien-robot-v140 ${player?'player-v140':'ally-v140'}`;
    el.innerHTML=`
      <div class="alien-robot-pilot-v140" style="background-image:url('${img}')"></div>
      <div class="alien-robot-body-v140 combat-v142">
        <i class="robot-light-v142 l1"></i>
        <b class="robot-light-v142 l2"></b>
        <span class="robot-cannon-v142"></span>
        <em class="robot-armor-v142 a1"></em>
        <em class="robot-armor-v142 a2"></em>
        <u class="robot-leg-v142 leg1"></u>
        <u class="robot-leg-v142 leg2"></u>
      </div>
      <div class="alien-robot-hp-v140"><span></span></div>
    `;
    teamLayer.appendChild(el);

    const r={
      id,
      x,
      y:groundY-52,
      vx:0,
      vy:0,
      w:50,
      h:52,
      hp:20,
      maxHp:20,
      alive:true,
      player,
      onGround:true,
      stunUntil:0,
      nextShot:0,
      nextJump:0,
      el,
      hpEl:el.querySelector('.alien-robot-hp-v140 span')
    };

    el.style.left=`${r.x}px`;
    el.style.top=`${r.y}px`;

    team.push(r);
    return r;
  }

  const player=makeRobot('you',W*.08,'icon/01.png',true);
  const allyA=makeRobot('allyA',W*.27,'icon/02.png');

  function makeWeakAlly(i,x){
    const el=document.createElement('div');
    el.className='alien-weak-ally-v145';
    el.innerHTML=`<img src="icon/0${(i%3)+1}.png" draggable="false" alt="">`;
    teamLayer.appendChild(el);

    const a={
      id:`weak${i}`,
      x,
      y:groundY-34,
      w:25,
      h:34,
      alive:true,
      nextShot:0,
      phase:rand(0,Math.PI*2),
      el
    };
    el.style.left=`${a.x}px`;
    el.style.top=`${a.y}px`;
    weakAllies.push(a);
    return a;
  }

  makeWeakAlly(1,W*.04);
  makeWeakAlly(2,W*.13);
  makeWeakAlly(3,W*.21);

  function updateRobotHp(r){
    r.hpEl.style.width=`${clamp(r.hp/r.maxHp*100,0,100)}%`;

    if(r.player){
      youHpEl.textContent=`${Math.max(0,r.hp)} / 20`;
    }
  }

  team.forEach(updateRobotHp);

  function pop(x,y,text,cls=''){
    const e=document.createElement('div');
    e.className=`alien-pop-v140 ${cls}`;
    e.style.left=`${x}px`;
    e.style.top=`${y}px`;
    e.textContent=text;
    fx.appendChild(e);
    setTimeout(()=>e.remove(),650);
  }

  function damageRobot(r,n,{stun=0,knock=0,up=0}={}){
    if(!r.alive)return;
    if(r.player&&performance.now()<giantUntil){
      pop(r.x+r.w/2,r.y,'GUARD');
      return;
    }

    r.hp=clamp(r.hp-n,0,r.maxHp);
    updateRobotHp(r);

    if(stun>0){
      r.stunUntil=Math.max(
        r.stunUntil,
        performance.now()+stun
      );

      r.el.classList.add('stunned-v140');

      setTimeout(()=>{
        r.el.classList.remove('stunned-v140');
      },stun);
    }

    if(knock){
      r.vx=-Math.abs(knock);
      r.vy=-Math.abs(up||110);
      r.onGround=false;
    }

    r.el.classList.remove('hit-v140');
    void r.el.offsetWidth;
    r.el.classList.add('hit-v140');

    pop(r.x+r.w/2,r.y,`-${n}`);

    if(r.hp<=0){
      r.alive=false;
      r.el.classList.add('down-v140');

      if(r.player){
        finishLose();
      }
    }
  }

  function bossDamage(n){
    if(!boss.alive||finished)return;

    boss.hp=clamp(
      boss.hp-n,
      0,boss.maxHp
    );

    bossHpEl.textContent=`${boss.hp} / 100`;
    bossBar.style.width=
      `${boss.hp/boss.maxHp*100}%`;

    bossEl.classList.remove('hit-v140');
    void bossEl.offsetWidth;
    bossEl.classList.add('hit-v140');

    pop(
      boss.x+25,
      boss.y+35,
      `-${n}`,
      'boss-hit-v140'
    );

    beep(520+n*35,50,.013);

    if(boss.hp<=0){
      boss.alive=false;
      finishWin();
    }
  }

  function nearestKid(x,y){
    return kids
      .filter(k=>k.alive)
      .sort(
        (a,b)=>
          Math.hypot(a.x-x,a.y-y)-
          Math.hypot(b.x-x,b.y-y)
      )[0]||null;
  }

  function fireShot(owner,chargeMs=0,ally=false,existingEl=null){
    if(!owner.alive||finished)return;

    const capped=clamp(chargeMs,0,3000);

    const damage=
      ally?1:
      capped>=2850?15:
      capped>=1850?10:
      capped>=850?5:
      1;

    const ratio=clamp(capped/3000,0,1);

    const size=
      ally
        ? 20
        : 32+ratio*78;

    const speed=
      ally
        ? 300
        : 245+ratio*75;

    const kidTarget=
      nearestKid(owner.x,owner.y);

    let tx=boss.x+18;
    let ty=boss.y+boss.h*.46;

    if(kidTarget){
      tx=kidTarget.x;
      ty=kidTarget.y+15;
    }

    const sx=
      owner.x+owner.w+
      (ally?0:size*.18);

    const sy=owner.y+24;
    const dx=tx-sx;
    const dy=ty-sy;
    const d=Math.max(1,Math.hypot(dx,dy));

    const el=
      existingEl||
      document.createElement('div');

    el.hidden=false;
    el.className=
      `alien-shot-v140 ${ally?'ally-v140':'charged-v141'}`;

    el.style.width=`${size}px`;
    el.style.height=`${size}px`;
    el.style.left=`${sx}px`;
    el.style.top=`${sy}px`;

    if(!el.isConnected){
      shotLayer.appendChild(el);
    }

    shots.push({
      owner,
      x:sx,
      y:sy,
      vx:dx/d*speed,
      vy:dy/d*speed,
      size,
      damage,
      alive:true,
      el
    });

    owner.el.classList.remove('fire-v140');
    void owner.el.offsetWidth;
    owner.el.classList.add('fire-v140');

    beep(
      ally?430:610+damage*26,
      55,.017
    );
  }


  function fireWeakShot(a){
    if(!a.alive||finished)return;
    const sx=a.x+a.w;
    const sy=a.y+12;
    const tx=boss.x+18;
    const ty=boss.y+boss.h*.52;
    const dx=tx-sx;
    const dy=ty-sy;
    const d=Math.max(1,Math.hypot(dx,dy));

    const el=document.createElement('div');
    el.className='alien-weak-shot-v145';
    shotLayer.appendChild(el);

    weakShots.push({
      x:sx,
      y:sy,
      vx:dx/d*250,
      vy:dy/d*250,
      size:8,
      damage:.5,
      alive:true,
      el
    });
  }

  function giantPunch(){
    const now=performance.now();
    if(!active||finished||now>=giantUntil||now<giantPunchReadyAt)return;

    giantPunchReadyAt=now+340;
    player.el.classList.remove('giant-punch-v145');
    void player.el.offsetWidth;
    player.el.classList.add('giant-punch-v145');
    setTimeout(()=>player.el.classList.remove('giant-punch-v145'),210);

    const cx=player.x+player.w*.55;
    const cy=player.y+player.h*.42;
    const impact=document.createElement('div');
    impact.className='alien-giant-punch-fx-v145';
    impact.style.left=`${cx+85}px`;
    impact.style.top=`${cy}px`;
    fx.appendChild(impact);
    setTimeout(()=>impact.remove(),350);

    // Manual punch only. No automatic movement or automatic attack.
    if(player.x+player.w+165>=boss.x){
      bossDamage(7);
    }

    for(const m of airMinis){
      if(!m.alive)continue;
      if(Math.hypot((m.x+m.w/2)-cx,(m.y+m.h/2)-cy)<150){
        m.hp-=3;
        if(m.hp<=0){
          m.alive=false;
          m.el.classList.add('dead-v145');
          setTimeout(()=>m.el.remove(),280);
        }
      }
    }

    beep(118,120,.04);
  }

  function activateGiant(){
    const now=performance.now();
    if(!giantReady||giantUsed||finished||now<start+5000)return;

    if(charging){
      charging=false;
      player.el.classList.remove('charging-v140');
      shootBtn.classList.remove('charging-v140');
      if(activeChargeBall&&activeChargeBall.isConnected)activeChargeBall.remove();
      activeChargeBall=null;
    }

    giantUsed=true;
    giantUntil=now+3000;
    giantPunchReadyAt=now;
    giantBtn.disabled=true;
    giantBtn.classList.remove('ready-v145');
    giantBtn.classList.add('used-v145');
    giantBtn.querySelector('b').textContent='発動中';
    heavyLabel.textContent='パンチ';
    heavyCd.textContent='5.0s';
    rapidBtn.disabled=true;
    player.el.classList.add('super-giant-v145');
    msg.textContent='超巨大化！！';
    beep(760,120,.035);
  }

  function spawnAirMinis(){
    if(airMinisSpawned)return;
    airMinisSpawned=true;
    msg.textContent='ミニエイリアン降下！';

    for(let i=0;i<5;i++){
      const el=document.createElement('div');
      el.className='alien-air-mini-v145';
      el.innerHTML='<i></i><b></b>';
      enemyLayer.appendChild(el);

      const m={
        x:clamp(W*.11+i*W*.14,20,W-65),
        y:-75-i*22,
        vx:(i%2?1:-1)*rand(35,58),
        vy:rand(95,135),
        w:50,
        h:58,
        hp:2,
        alive:true,
        onGround:false,
        nextPunch:0,
        el
      };
      airMinis.push(m);
    }
    beep(250,100,.025);
  }


  function fireRapidShot(){
    const now=performance.now();
    if(
      !active||
      finished||
      !player.alive||
      now<player.stunUntil||
      now<nextRapidShotAt||
      now<giantUntil
    )return;

    nextRapidShotAt=now+620;

    const sx=player.x+player.w+2;
    const sy=player.y+24;

    const target=
      airMinis.filter(m=>m.alive)
        .sort((a,b)=>Math.abs(a.x-sx)-Math.abs(b.x-sx))[0]||
      kids.filter(k=>k.alive)
        .sort((a,b)=>Math.abs(a.x-sx)-Math.abs(b.x-sx))[0]||
      null;

    const tx=target?target.x:boss.x+18;
    const ty=target?(target.y+target.h/2):(boss.y+boss.h*.47);
    const dx=tx-sx;
    const dy=ty-sy;
    const d=Math.max(1,Math.hypot(dx,dy));

    const el=document.createElement('div');
    el.className='alien-rapid-shot-v146';
    shotLayer.appendChild(el);

    shots.push({
      owner:player,
      x:sx,
      y:sy,
      vx:dx/d*390,
      vy:dy/d*390,
      size:16,
      damage:2,
      alive:true,
      el
    });

    player.el.classList.remove('rapid-fire-v146');
    void player.el.offsetWidth;
    player.el.classList.add('rapid-fire-v146');
    setTimeout(()=>player.el.classList.remove('rapid-fire-v146'),140);
    beep(420,28,.007);
  }

  function fireArtillery(){
    const now=performance.now();

    if(
      !active||
      finished||
      !player.alive||
      now<player.stunUntil||
      now<artilleryReadyAt||
      now<giantUntil
    )return;

    artilleryReadyAt=now+5000;

    // 以前の3秒MAXチャージ弾を、溜め無しで即発射。
    fireShot(
      player,
      3000,
      false,
      null
    );

    shootBtn.classList.add('artillery-fire-v146');
    setTimeout(()=>shootBtn.classList.remove('artillery-fire-v146'),180);
    beep(760,75,.02);
  }

  function startCharge(){
    const now=performance.now();

    if(
      !active||
      finished||
      charging||
      !player.alive||
      now<player.stunUntil||
      now<nextPlayerShotAt
    )return;

    charging=true;
    chargeStart=now;

    player.el.classList.add('charging-v140');
    shootBtn.classList.add('charging-v140');

    const ball=document.createElement('div');
    ball.className='alien-charge-ball-v141';
    ball.style.width='32px';
    ball.style.height='32px';
    ball.style.left=`${player.x+player.w+6}px`;
    ball.style.top=`${player.y+24}px`;
    ball.style.setProperty('--power','0');

    shotLayer.appendChild(ball);
    activeChargeBall=ball;
  }

  function releaseCharge(){
    if(!charging)return;

    const now=performance.now();
    const ms=clamp(now-chargeStart,0,3000);
    const ball=activeChargeBall;

    charging=false;
    activeChargeBall=null;
    nextPlayerShotAt=now+420;

    player.el.classList.remove('charging-v140');
    shootBtn.classList.remove('charging-v140');
    shootBtn.classList.add('cooldown-v143');

    setTimeout(()=>{
      shootBtn.classList.remove('cooldown-v143');
    },420);

    if(ball&&ball.isConnected){
      // このチャージで作った玉だけを、そのまま飛翔体へ変換。
      // 次の連射では別DOMを作るので前弾が消えない。
      fireShot(
        player,
        ms,
        false,
        ball
      );
    }

    chargeEl.textContent='0.0s';
  }

  function jump(r){
    if(
      !r.alive||
      !r.onGround||
      performance.now()<r.stunUntil
    )return;

    r.vy=r.player?-455:-345;
    r.onGround=false;

    r.el.classList.add('jump-v140');

    setTimeout(()=>{
      r.el.classList.remove('jump-v140');
    },180);
  }

  function bindHold(btn,key){
    const on=e=>{
      e.preventDefault();

      if(active&&!finished){
        input[key]=true;
      }

      try{
        btn.setPointerCapture(e.pointerId);
      }catch(_){}
    };

    const off=e=>{
      if(e)e.preventDefault();
      input[key]=false;
    };

    btn.addEventListener(
      'pointerdown',
      on,
      {passive:false}
    );

    btn.addEventListener(
      'pointerup',
      off,
      {passive:false}
    );

    btn.addEventListener(
      'pointercancel',
      off,
      {passive:false}
    );

    btn.addEventListener(
      'lostpointercapture',
      off,
      {passive:false}
    );
  }

  bindHold(leftBtn,'left');
  bindHold(rightBtn,'right');

  jumpBtn.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(active&&!finished){
      jump(player);
    }
  },{passive:false});

  const rapidDown=e=>{
    e.preventDefault();
    rapidHeld=true;
    fireRapidShot();
    try{rapidBtn.setPointerCapture(e.pointerId)}catch(_){}
  };
  const rapidUp=e=>{
    if(e)e.preventDefault();
    rapidHeld=false;
  };

  rapidBtn.addEventListener('pointerdown',rapidDown,{passive:false});
  rapidBtn.addEventListener('pointerup',rapidUp,{passive:false});
  rapidBtn.addEventListener('pointercancel',rapidUp,{passive:false});
  rapidBtn.addEventListener('lostpointercapture',rapidUp,{passive:false});

  shootBtn.addEventListener('pointerdown',e=>{
    e.preventDefault();

    if(performance.now()<giantUntil){
      giantPunch();
    }else{
      fireArtillery();
    }

    try{
      shootBtn.setPointerCapture(e.pointerId);
    }catch(_){}
  },{passive:false});

  giantBtn.addEventListener('pointerdown',e=>{
    e.preventDefault();
    activateGiant();
  },{passive:false});

  function spawnFireball(){
    const targets=
      team.filter(r=>r.alive);

    if(!targets.length)return;

    const target=
      targets[
        randi(0,targets.length-1)
      ];

    bossEl.classList.add('attack-mouth-v140');

    setTimeout(()=>{
      bossEl.classList.remove('attack-mouth-v140');
    },480);

    const sx=boss.x+boss.w*.34;
    const sy=boss.y+boss.h*.22;
    const tx=target.x+target.w/2;
    const ty=groundY-12;
    const dx=tx-sx;
    const dy=Math.max(120,ty-sy);
    const d=Math.max(
      1,
      Math.hypot(dx,dy)
    );

    const el=document.createElement('div');
    el.className='alien-fireball-v140';
    enemyLayer.appendChild(el);

    fireballs.push({
      x:sx,
      y:sy,
      vx:dx/d*315,
      vy:dy/d*315,
      alive:true,
      el
    });

    pop(
      boss.x,
      boss.y+45,
      'FIRE BALL'
    );

    beep(170,110,.03);
  }

  async function longPunch(){
    if(finished||!boss.alive)return;

    bossAttackLock=true;
    msg.textContent='LONG PUNCH!';

    armEl.classList.add('warning-v140');

    await wait(430);

    if(
      !isGameRunValid(runId)||
      finished
    )return;

    armEl.classList.remove('warning-v140');
    armEl.classList.add('punch-v140');
    bossEl.classList.add('punch-v140');

    const reachLeft=W*.16;

    for(const r of team){
      if(!r.alive)continue;

      const lowEnough=
        r.y>groundY-125;

      if(
        lowEnough&&
        r.x+r.w>reachLeft
      ){
        damageRobot(
          r,
          3,
          {
            knock:330,
            up:190
          }
        );
      }
    }

    beep(95,160,.05);

    await wait(440);

    armEl.classList.remove('punch-v140');
    bossEl.classList.remove('punch-v140');

    bossAttackLock=false;
  }

  async function longKick(){
    if(finished||!boss.alive)return;

    bossAttackLock=true;
    msg.textContent='LONG KICK!';

    const kickLeg=
      bossEl.querySelector('.alien-leg-v141.leg1');

    kickLeg.classList.add('kick-warning-v143');

    await wait(430);

    if(
      !isGameRunValid(runId)||
      finished
    )return;

    kickLeg.classList.remove('kick-warning-v143');
    kickLeg.classList.add('long-kick-v143');

    for(const r of team){
      if(!r.alive)continue;

      const inLane=r.y>groundY-185;
      const inReach=r.x+r.w>W*.08;

      if(inLane&&inReach){
        damageRobot(
          r,
          4,
          {
            knock:390,
            up:155
          }
        );
      }
    }

    beep(82,175,.055);

    await wait(520);

    kickLeg.classList.remove('long-kick-v143');
    bossAttackLock=false;
  }


  function summonKids(){
    msg.textContent='ALIEN CHILD ×4';

    bossEl.classList.add('summon-v140');

    setTimeout(()=>{
      bossEl.classList.remove('summon-v140');
    },520);

    for(let i=0;i<4;i++){
      const el=document.createElement('div');

      el.className='alien-kid-v140';
      el.innerHTML='<i></i><b></b>';

      enemyLayer.appendChild(el);

      const k={
        x:boss.x-5+i*10,
        y:groundY-31,
        vx:-rand(55,85),
        hp:2,
        alive:true,
        nextPunch:0,
        el
      };

      el.style.left=`${k.x}px`;
      el.style.top=`${k.y}px`;

      kids.push(k);
    }

    beep(260,120,.03);
  }

  async function fullPowerWave(){
    if(finished||!boss.alive)return;

    bossAttackLock=true;
    msg.textContent='FULL POWER ENERGY!!';

    bossEl.classList.add('full-charge-v140');
    waveEl.classList.add('charging-v140');

    await wait(800);

    if(
      !isGameRunValid(runId)||
      finished
    )return;

    waveEl.classList.remove('charging-v140');
    waveEl.classList.add('fire-v140');
    bossEl.classList.remove('full-charge-v140');

    for(const r of team){
      if(!r.alive)continue;

      damageRobot(
        r,
        5,
        {
          stun:1500,
          knock:360,
          up:210
        }
      );
    }

    stage.classList.add('alien-shake-v140');
    beep(80,280,.07);

    await wait(650);

    waveEl.classList.remove('fire-v140');
    stage.classList.remove('alien-shake-v140');

    bossAttackLock=false;
  }

  async function bossAttack(){
    if(
      bossAttackLock||
      finished||
      !boss.alive
    )return;

    const roll=randi(1,5);

    if(roll===1){
      spawnFireball();
    }else if(roll===2){
      await longPunch();
    }else if(roll===3){
      await longKick();
    }else if(roll===4){
      summonKids();
    }else{
      await fullPowerWave();
    }
  }

  function aiUpdate(r,now){
    if(
      !r.alive||
      r.player||
      now<r.stunUntil
    )return;

    if(
      now>=r.nextJump&&
      Math.random()<.025
    ){
      jump(r);

      r.nextJump=
        now+rand(900,1600);
    }

    if(now>=r.nextShot){
      fireShot(r,0,true);

      r.nextShot=
        now+rand(850,1300);
    }

    const kidsAlive=
      kids.some(k=>k.alive);

    const targetX=
      kidsAlive
        ? W*.40
        : W*.46;

    const wiggle=
      Math.sin(
        now/520+
        r.id.length
      )*30;

    const wanted=
      clamp(
        targetX+wiggle,
        40,
        W*.58
      );

    r.vx=
      Math.sign(wanted-r.x)*
      rand(28,50);

    if(
      Math.abs(wanted-r.x)<8
    ){
      r.vx=0;
    }
  }

  function finishWin(){
    if(finished)return;

    finished=true;
    active=false;

    if(activeChargeBall&&activeChargeBall.isConnected){
      activeChargeBall.remove();
    }
    activeChargeBall=null;
    charging=false;

    if(raf){
      cancelAnimationFrame(raf);
      raf=null;
    }

    const elapsed=
      Math.max(
        1,
        Math.round(
          performance.now()-start
        )
      );

    state.records.alienBattleMob[p.id]=elapsed;

    bossEl.classList.add('defeat-v140');
    msg.textContent='GIANT ALIEN DOWN!';
    msg.classList.add('win-v140');
    stage.classList.add('victory-v140');

    beep(1160,260,.065);

    // クリア演出後は必ずRESULTへ。
    // countdown由来のinertが残っていてもここで明示解除。
    setTimeout(()=>{
      if(!isGameRunValid(runId))return;

      document.body.classList.remove('countdown-active-v140');
      screen.removeAttribute('inert');
      clearGameplaySelection();

      recordScreen(
        89,
        p,
        humanIndex,
        `${(elapsed/1000).toFixed(2)}<small>秒</small>`,
        '巨大エイリアン撃破'
      );
    },950);
  }

  function finishLose(){
    if(finished)return;

    finished=true;
    active=false;

    if(activeChargeBall&&activeChargeBall.isConnected){
      activeChargeBall.remove();
    }
    activeChargeBall=null;
    charging=false;

    if(raf){
      cancelAnimationFrame(raf);
      raf=null;
    }

    state.records.alienBattleMob[p.id]=60000;

    msg.textContent='ROBOT DOWN';
    msg.classList.add('lose-v140');

    beep(100,230,.05);

    setTimeout(()=>{
      if(!isGameRunValid(runId))return;

      document.body.classList.remove('countdown-active-v140');
      screen.removeAttribute('inert');
      clearGameplaySelection();

      recordScreen(
        89,
        p,
        humanIndex,
        `60.00<small>秒</small>`,
        '敗北'
      );
    },800);
  }

  // カウントダウン前に全初期配置を完了。
  bossBar.style.width='100%';

  team.forEach(r=>{
    r.el.style.left=`${r.x}px`;
    r.el.style.top=`${r.y}px`;
  });
  weakAllies.forEach(a=>{
    a.el.style.left=`${a.x}px`;
    a.el.style.top=`${a.y}px`;
  });
  bossEl.style.left=`${boss.x}px`;
  bossEl.style.top='0px';
  // Force one layout pass so transparent countdown shows everybody in-place.
  void stage.offsetHeight;

  if(
    !(await countdown(
      'GIANT ALIEN',
      runId,
      {transparent:true}
    ))
  )return;

  if(!isGameRunValid(runId))return;

  active=true;
  start=last=performance.now();
  nextBossAttack=start+2100;

  allyA.nextShot=start+650;
  allyA.nextJump=start+900;
  weakAllies.forEach((a,i)=>{
    a.nextShot=start+1800+i*420;
  });

  function frame(now){
    if(
      !active||
      finished||
      !isGameRunValid(runId)
    )return;

    const dt=
      Math.min(
        .035,
        (now-last)/1000
      );

    last=now;

    const elapsed=(now-start)/1000;

    if(!giantReady&&elapsed>=5){
      giantReady=true;
      giantBtn.disabled=false;
      giantBtn.classList.add('ready-v145');
      giantBtn.querySelector('b').textContent='READY';
      msg.textContent='超巨大化 解放！';
      beep(690,80,.02);
    }

    if(!airMinisSpawned&&elapsed>=8){
      spawnAirMinis();
    }

    // 地面に立ったまま、巨人が少しだけ左右へ歩く。
    boss.x=clamp(
      bossBaseX+
      Math.sin(elapsed*.82)*13+
      Math.sin(elapsed*1.9)*4,
      W*.24,
      W-boss.w*.72
    );
    bossEl.style.left=`${boss.x}px`;
    bossEl.style.setProperty('--alien-step',Math.sin(elapsed*2.3).toFixed(3));

    if(rapidHeld&&now>=nextRapidShotAt&&now>=giantUntil){
      fireRapidShot();
    }

    if(now<giantUntil){
      heavyCd.textContent=`${Math.max(0,(giantUntil-now)/1000).toFixed(1)}s`;
    }else if(now<artilleryReadyAt){
      heavyCd.textContent=`${Math.max(0,(artilleryReadyAt-now)/1000).toFixed(1)}s`;
    }else{
      heavyCd.textContent='READY';
    }

    if(giantUsed&&giantUntil>0&&now>=giantUntil){
      giantUntil=0;
      player.el.classList.remove('super-giant-v145');
      heavyLabel.textContent='砲撃';
      rapidBtn.disabled=false;
      giantBtn.querySelector('b').textContent='使用済';
      msg.textContent='超巨大化 終了';
    }

    if(false&&charging){
      const ms=
        clamp(
          now-chargeStart,
          0,3000
        );

      const ratio=ms/3000;

      chargeEl.textContent=
        `${(ms/1000).toFixed(1)}s`;

      shootBtn.style.setProperty(
        '--charge',
        ratio.toFixed(3)
      );

      const ballSize=32+ratio*78;

      if(activeChargeBall&&activeChargeBall.isConnected){
        activeChargeBall.style.width=`${ballSize}px`;
        activeChargeBall.style.height=`${ballSize}px`;
        activeChargeBall.style.left=`${player.x+player.w+ballSize*.18}px`;
        activeChargeBall.style.top=`${player.y+24}px`;
        activeChargeBall.style.setProperty('--power',ratio.toFixed(3));
      }

      if(ms>=3000){
        chargeEl.textContent='3.0s MAX';
      }
    }else{
      shootBtn.style.setProperty(
        '--charge',
        '0'
      );
    }

    if(
      now>=nextBossAttack&&
      !bossAttackLock
    ){
      bossAttack();

      nextBossAttack=
        now+rand(2700,3900);
    }

    for(const r of team){
      if(!r.alive)continue;

      if(r.player){
        const stunned=
          now<r.stunUntil;

        const d=
          stunned
            ? 0
            : input.left&&!input.right
              ? -1
              : input.right&&!input.left
                ? 1
                : 0;

        r.vx=d*(r.onGround?132:150);
      }else{
        aiUpdate(r,now);
      }

      r.x+=r.vx*dt;

      r.x=
        clamp(
          r.x,
          8,
          W*.62-r.w
        );

      const prevBottom=
        r.y+r.h;

      r.vy+=470*dt;
      r.y+=r.vy*dt;

      if(
        prevBottom<=groundY+4&&
        r.y+r.h>=groundY
      ){
        r.y=groundY-r.h;
        r.vy=0;
        r.onGround=true;
      }else{
        r.onGround=false;
      }

      r.el.style.left=`${r.x}px`;
      r.el.style.top=`${r.y}px`;
    }

    for(const a of weakAllies){
      if(!a.alive)continue;
      a.phase+=dt*2.0;
      a.x=clamp(a.x+Math.sin(a.phase)*8*dt,6,boss.x-105);
      a.y=groundY-a.h+Math.sin(a.phase*.8)*1.5;
      a.el.style.left=`${a.x}px`;
      a.el.style.top=`${a.y}px`;

      if(now>=a.nextShot){
        a.nextShot=now+rand(1700,2900);
        fireWeakShot(a);
      }
    }

    for(const m of airMinis){
      if(!m.alive)continue;

      if(!m.onGround){
        m.vy+=520*dt;
        m.y+=m.vy*dt;
        if(m.y>=groundY-m.h){
          m.y=groundY-m.h;
          m.vy=0;
          m.onGround=true;
        }
      }else{
        const tx=player.x+player.w/2;
        m.vx=Math.sign(tx-(m.x+m.w/2))*rand(38,58);
        m.x+=m.vx*dt;

        if(now>=m.nextPunch&&Math.abs((m.x+m.w/2)-tx)<38){
          m.nextPunch=now+900;
          if(now>=giantUntil){
            player.vx+=(m.x<player.x?1:-1)*90;
            player.vy=-80;
          }
          m.el.classList.add('punch-v145');
          setTimeout(()=>m.el.classList.remove('punch-v145'),180);
        }
      }

      m.x=clamp(m.x,5,W-m.w-5);
      m.el.style.left=`${m.x}px`;
      m.el.style.top=`${m.y}px`;
    }

    for(const ws of weakShots){
      if(!ws.alive)continue;
      ws.x+=ws.vx*dt;
      ws.y+=ws.vy*dt;
      ws.el.style.left=`${ws.x}px`;
      ws.el.style.top=`${ws.y}px`;

      if(
        ws.x>=boss.x+10&&
        ws.x<=boss.x+boss.w&&
        ws.y>=boss.y&&
        ws.y<=boss.y+boss.h
      ){
        ws.alive=false;
        ws.el.remove();
        bossDamage(ws.damage);
        continue;
      }

      if(ws.x>W+30||ws.y<-30||ws.y>H+30){
        ws.alive=false;
        ws.el.remove();
      }
    }

    for(const sh of shots){
      if(!sh.alive)continue;

      sh.x+=sh.vx*dt;
      sh.y+=sh.vy*dt;

      sh.el.style.left=`${sh.x}px`;
      sh.el.style.top=`${sh.y}px`;

      let hitKid=null;

      for(const m of airMinis){
        if(!m.alive)continue;
        if(
          Math.hypot(
            sh.x-(m.x+m.w/2),
            sh.y-(m.y+m.h/2)
          )<sh.size*.45+26
        ){
          m.hp-=sh.damage;
          sh.alive=false;
          sh.el.remove();

          if(m.hp<=0){
            m.alive=false;
            m.el.classList.add('dead-v145');
            setTimeout(()=>m.el.remove(),280);
          }
          hitKid={handled:true};
          break;
        }
      }

      if(hitKid)continue;
      hitKid=null;

      for(const k of kids){
        if(!k.alive)continue;

        if(
          Math.hypot(
            sh.x-k.x,
            sh.y-(k.y+15)
          )<
          sh.size*.45+14
        ){
          hitKid=k;
          break;
        }
      }

      if(hitKid){
        hitKid.hp-=sh.damage;

        sh.alive=false;
        sh.el.remove();

        if(hitKid.hp<=0){
          hitKid.alive=false;
          hitKid.el.classList.add('dead-v140');

          setTimeout(()=>{
            hitKid.el.remove();
          },350);

          pop(
            hitKid.x,
            hitKid.y,
            'KID DOWN'
          );
        }

        continue;
      }

      if(
        sh.x>=boss.x+10&&
        sh.x<=boss.x+boss.w&&
        sh.y>=boss.y+18&&
        sh.y<=boss.y+boss.h-8
      ){
        sh.alive=false;

        // 見た目がボスへ到達してから爆発させる。
        sh.x=boss.x+12;
        sh.el.style.left=`${sh.x}px`;
        sh.el.style.top=`${sh.y}px`;
        sh.el.classList.add('impact-v142');

        const impact=document.createElement('div');
        impact.className='alien-shot-impact-v142';
        impact.style.left=`${sh.x}px`;
        impact.style.top=`${sh.y}px`;
        fx.appendChild(impact);

        bossDamage(sh.damage);

        setTimeout(()=>{
          sh.el.remove();
          impact.remove();
        },180);

        continue;
      }

      if(
        sh.x>W+100||
        sh.y<-50||
        sh.y>H+50
      ){
        sh.alive=false;
        sh.el.remove();
      }
    }

    for(const f of fireballs){
      if(!f.alive)continue;

      f.x+=f.vx*dt;
      f.y+=f.vy*dt;

      f.el.style.left=`${f.x}px`;
      f.el.style.top=`${f.y}px`;

      for(const r of team){
        if(!r.alive)continue;

        if(
          Math.hypot(
            f.x-(r.x+r.w/2),
            f.y-(r.y+r.h/2)
          )<25
        ){
          f.alive=false;
          f.el.remove();

          damageRobot(
            r,
            2,
            {
              stun:1200,
              knock:80,
              up:80
            }
          );

          pop(r.x,r.y,'STUN');

          break;
        }
      }

      if(
        f.x<-50||
        f.y>H+50
      ){
        f.alive=false;
        f.el.remove();
      }
    }

    for(const k of kids){
      if(!k.alive)continue;

      const targets=
        team.filter(r=>r.alive);

      if(!targets.length)continue;

      const target=
        targets
          .slice()
          .sort(
            (a,b)=>
              Math.abs(a.x-k.x)-
              Math.abs(b.x-k.x)
          )[0];

      k.vx=
        Math.sign(target.x-k.x)*
        rand(48,72);

      k.x+=k.vx*dt;

      if(
        Math.abs(
          (target.x+target.w/2)-k.x
        )<24&&
        now>=k.nextPunch
      ){
        k.nextPunch=now+900;

        damageRobot(
          target,
          1,
          {
            knock:90,
            up:70
          }
        );

        k.el.classList.add('punch-v140');

        setTimeout(()=>{
          k.el.classList.remove('punch-v140');
        },180);
      }

      k.el.style.left=`${k.x}px`;
    }

    raf=requestAnimationFrame(frame);
  }

  raf=requestAnimationFrame(frame);
}



// =========================================================
// V10.43 GAME 91 — モブくん無双
// =========================================================




async function startMobMusou(p,humanIndex,runId){
  gameFit();

  let phase='draw';
  let drawStart=0;
  let drawRaf=0;
  let battleStart=0;
  let battleRaf=0;
  let battleLast=0;
  let nextSpawnAt=0;
  let nextAttackAt=0;
  let attackCount=0;
  let kills=0;

  const strokes=[];
  let currentStroke=null;
  let pointerId=null;
  const enemies=[];

  const TECHS={
    lightning:{color:'#f3e35e',radius:118,cadence:205,cls:'lightning-v145'},
    water:{color:'#69cbf0',radius:110,cadence:220,cls:'water-v145'},
    wave:{color:'#86e6ff',radius:138,cadence:235,cls:'wave-v145'},
    flame:{color:'#ff934f',radius:114,cadence:200,cls:'flame-v145'},
    fire:{color:'#ff6d4b',radius:128,cadence:212,cls:'fire-v145'},
    flamethrower:{color:'#ff7b43',radius:148,cadence:245,cls:'flamethrower-v145'},
    darkSword:{color:'#7851a4',radius:112,cadence:190,cls:'dark-sword-v145'},
    heroSword:{color:'#f6d85a',radius:116,cadence:196,cls:'hero-sword-v145'},
    flameSword:{color:'#ff7a4c',radius:124,cadence:200,cls:'flame-sword-v145'},
    blizzardSword:{color:'#a8eef8',radius:130,cadence:218,cls:'blizzard-sword-v145'},
    energySword:{color:'#63eee4',radius:118,cadence:184,cls:'energy-sword-v145'}
  };
  let tech=TECHS.heroSword;

  screen.innerHTML=`<div class="musou-shell-v145">
    <div class="game-head">
      <div><span class="kicker">${esc(p.name)}</span><h2>モブくん無双</h2></div>
      <div class="game-badge">${playBadge(humanIndex)}</div>
    </div>

    <div class="musou-hud-v145">
      <div><span>TIME</span><b id="musouTime145">7.00</b></div>
      <div><span>KO</span><b id="musouKo145">0</b></div>
      <div><span>MODE</span><b id="musouMode145">DRAW</b></div>
    </div>

    <div id="musouDraw145" class="musou-draw-panel-v145">
      <div class="musou-draw-title-v145">7秒で巨大な武器を描け！</div>
      <svg id="musouSvg145" class="musou-draw-svg-v145" viewBox="0 0 360 320">
        <rect x="4" y="4" width="352" height="312" rx="18" class="musou-draw-bg-v145"/>
        <g id="musouPath145"></g>
      </svg>
      <div class="musou-draw-note-v145">縦長にも大きく描ける</div>
    </div>

    <div id="musouPower145" class="musou-power-v145" hidden>
      <div class="musou-power-mob-v145" style="background-image:url('icon/01.png')"></div>
      <div class="musou-power-text-v145">モブくんに力が宿る！</div>
    </div>

    <div id="musouBattle145" class="musou-battle-v145" hidden>
      <div class="musou-cave-back-v145"><i></i><i></i><i></i><i></i></div>
      <div class="musou-cave-floor-v145"></div>
      <div id="musouEnemyLayer145" class="musou-layer-v145"></div>
      <div id="musouFx145" class="musou-layer-v145"></div>
      <div id="musouMob145" class="musou-mob-v145">
        <img src="icon/01.png" draggable="false" alt="">
        <svg id="musouWeapon145" class="musou-weapon-svg-v145" viewBox="0 0 360 320"></svg>
      </div>
    </div>
  </div>`;

  const timeEl=document.getElementById('musouTime145');
  const koEl=document.getElementById('musouKo145');
  const modeEl=document.getElementById('musouMode145');
  const drawPanel=document.getElementById('musouDraw145');
  const svg=document.getElementById('musouSvg145');
  const pathLayer=document.getElementById('musouPath145');
  const powerPanel=document.getElementById('musouPower145');
  const battlePanel=document.getElementById('musouBattle145');
  const enemyLayer=document.getElementById('musouEnemyLayer145');
  const fxLayer=document.getElementById('musouFx145');
  const mobEl=document.getElementById('musouMob145');
  const weaponSvg=document.getElementById('musouWeapon145');

  function localPt(e){
    const r=svg.getBoundingClientRect();
    return {
      x:clamp((e.clientX-r.left)/r.width*360,10,350),
      y:clamp((e.clientY-r.top)/r.height*320,10,310)
    };
  }
  function addSvgStroke(points){
    const p=document.createElementNS('http://www.w3.org/2000/svg','polyline');
    p.setAttribute('points',points.map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' '));
    p.setAttribute('class','musou-user-path-v145');
    pathLayer.appendChild(p);
    return p;
  }

  svg.addEventListener('pointerdown',e=>{
    if(phase!=='draw')return;
    e.preventDefault();
    const p=localPt(e);
    currentStroke={points:[p],el:addSvgStroke([p])};
    strokes.push(currentStroke);
    pointerId=e.pointerId;
    try{svg.setPointerCapture(e.pointerId);}catch(_){}
  },{passive:false});
  svg.addEventListener('pointermove',e=>{
    if(phase!=='draw'||pointerId!==e.pointerId||!currentStroke)return;
    e.preventDefault();
    const p=localPt(e);
    const last=currentStroke.points[currentStroke.points.length-1];
    if(Math.hypot(p.x-last.x,p.y-last.y)<2.2)return;
    currentStroke.points.push(p);
    currentStroke.el.setAttribute('points',currentStroke.points.map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' '));
  },{passive:false});
  const endStroke=e=>{
    if(pointerId!==e.pointerId)return;
    if(e)e.preventDefault();
    currentStroke=null;
    pointerId=null;
  };
  svg.addEventListener('pointerup',endStroke,{passive:false});
  svg.addEventListener('pointercancel',endStroke,{passive:false});

  function metrics(){
    const valid=strokes.filter(s=>s.points.length>=2);
    if(!valid.length)return {count:0,total:0,width:1,height:1,ratio:1,straight:.3,turn:.2,density:0};
    let minX=999,minY=999,maxX=-999,maxY=-999,total=0,straightSum=0,turnSum=0,turnCount=0;
    for(const s of valid){
      let len=0;
      for(let i=0;i<s.points.length;i++){
        const p=s.points[i];
        minX=Math.min(minX,p.x); minY=Math.min(minY,p.y);
        maxX=Math.max(maxX,p.x); maxY=Math.max(maxY,p.y);
        if(i>0){
          len+=Math.hypot(p.x-s.points[i-1].x,p.y-s.points[i-1].y);
        }
        if(i>1){
          const a=Math.atan2(s.points[i-1].y-s.points[i-2].y,s.points[i-1].x-s.points[i-2].x);
          const b=Math.atan2(s.points[i].y-s.points[i-1].y,s.points[i].x-s.points[i-1].x);
          let d=Math.abs(a-b);
          if(d>Math.PI)d=Math.PI*2-d;
          turnSum+=d/Math.PI;
          turnCount++;
        }
      }
      total+=len;
      const endDist=Math.hypot(s.points[s.points.length-1].x-s.points[0].x,s.points[s.points.length-1].y-s.points[0].y);
      straightSum+=len>0?clamp(endDist/len,0,1):0;
    }
    return {
      count:valid.length,
      total,
      width:Math.max(1,maxX-minX),
      height:Math.max(1,maxY-minY),
      ratio:Math.max(1,maxX-minX)/Math.max(1,maxY-minY),
      straight:straightSum/valid.length,
      turn:turnCount?turnSum/turnCount:0,
      density:total/(Math.max(1,maxX-minX)+Math.max(1,maxY-minY))
    };
  }
  function chooseTech(){
    const m=metrics();
    if(m.count===0)return TECHS.heroSword;
    if(m.count>=7&&m.turn>.34)return TECHS.lightning;
    if(m.ratio>=2.0&&m.count<=2)return TECHS.flamethrower;
    if(m.ratio>=1.65&&m.turn>.18)return TECHS.wave;
    if(m.ratio<=.62&&m.straight>=.74&&m.count<=2)return TECHS.energySword;
    if(m.ratio<=.8&&m.count>=5)return TECHS.blizzardSword;
    if(m.count<=2&&m.straight>=.62)return TECHS.heroSword;
    if(m.total>1000||m.density>4.7)return TECHS.fire;
    if(m.ratio<1.08&&m.count<=3)return TECHS.darkSword;
    return TECHS.flameSword;
  }
  function copyWeapon(){
    weaponSvg.innerHTML='';
    const valid=strokes.filter(s=>s.points.length>=2);
    if(!valid.length){
      const p=document.createElementNS('http://www.w3.org/2000/svg','polyline');
      p.setAttribute('points','90,250 165,40 245,250');
      p.setAttribute('class','musou-battle-path-v145');
      weaponSvg.appendChild(p);
    }else{
      for(const s of valid){
        const p=document.createElementNS('http://www.w3.org/2000/svg','polyline');
        p.setAttribute('points',s.points.map(q=>`${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' '));
        p.setAttribute('class','musou-battle-path-v145');
        weaponSvg.appendChild(p);
      }
    }
    weaponSvg.className.baseVal=`musou-weapon-svg-v145 ${tech.cls}`;
  }
  function spawnEnemy(W,H,elapsed){
    const roll=Math.random();
    let kind='slime', size=rand(22,34), hp=1, speed=rand(85,120)+elapsed*2.4;
    if(roll>.88){ kind='giant'; size=rand(52,70); hp=2; speed=rand(55,82)+elapsed*1.5; }
    else if(roll>.68){ kind='robot'; size=rand(28,42); hp=1; speed=rand(95,130)+elapsed*2.6; }
    else if(roll>.52){ kind='heavy'; size=rand(42,54); hp=2; speed=rand(72,100)+elapsed*2; }
    const side=Math.random()<.5?-1:1;
    const x=side<0?-size:W+size;
    const y=H-44-size*.76-rand(0,18);
    const el=document.createElement('div');
    el.className=`musou-enemy-v145 ${kind}-v145`;
    el.innerHTML=kind==='robot'||kind==='heavy'
      ? '<i class="head"></i><b class="arm a1"></b><b class="arm a2"></b>'
      : '<i></i><b></b>';
    el.style.width=`${size}px`;
    el.style.height=`${kind==='robot'||kind==='heavy' ? size*.95 : size*.74}px`;
    enemyLayer.appendChild(el);
    enemies.push({kind,size,hp,speed,side,x,y,alive:true,el});
  }
  function killEnemy(en,mx,my){
    if(!en.alive)return;
    en.alive=false;
    kills++;
    koEl.textContent=kills;
    const dx=en.x<mx?-rand(95,165):rand(95,165);
    const dy=-rand(48,126);
    en.el.style.setProperty('--kx',`${dx}px`);
    en.el.style.setProperty('--ky',`${dy}px`);
    en.el.classList.add('knock-v145');
    setTimeout(()=>en.el.remove(),440);
  }
  function addSlashFx(mx,my,mode){
    const fx=document.createElement('div');
    fx.className=`musou-effect-v145 ${tech.cls} ${mode}`;
    fx.style.left=`${mx}px`;
    fx.style.top=`${my}px`;
    for(let i=0;i<5;i++){
      const seg=document.createElement('i');
      fx.appendChild(seg);
    }
    fxLayer.appendChild(fx);
    setTimeout(()=>fx.remove(),320);
  }
  function doAttack(W,H,elapsed,mx,my){
    attackCount++;
    const mode=attackCount%4===0?'jump':attackCount%2===0?'vertical':'horizontal';
    mobEl.classList.remove('slash-horizontal-v145','slash-vertical-v145','slash-jump-v145');
    void mobEl.offsetWidth;
    mobEl.classList.add(mode==='horizontal'?'slash-horizontal-v145':mode==='vertical'?'slash-vertical-v145':'slash-jump-v145');
    addSlashFx(mx+42,my+34,mode);
    const radius=tech.radius+(mode==='jump'?20:0);

    let hitCount=0;
    for(const en of enemies){
      if(!en.alive)continue;
      const dx=en.x-(mx+34);
      const dy=en.y-(my+36);
      const hOK=mode==='horizontal'?Math.abs(dy)<78:true;
      const vOK=mode==='vertical'?Math.abs(dx)<88:true;
      if(Math.hypot(dx,dy)<=radius&&hOK&&vOK){
        en.hp-=1;
        if(en.hp<=0)killEnemy(en,mx,my);
        else addSlashFx(en.x+18,en.y+18,'mini');
        hitCount++;
      }
    }
    if(hitCount<2){
      const near=enemies.filter(e=>e.alive).sort((a,b)=>Math.hypot(a.x-mx,a.y-my)-Math.hypot(b.x-mx,b.y-my)).slice(0,2-hitCount);
      for(const en of near){
        if(Math.hypot(en.x-mx,en.y-my)<radius*1.55){
          en.hp-=1;
          if(en.hp<=0)killEnemy(en,mx,my);
          else addSlashFx(en.x+18,en.y+18,'mini');
        }
      }
    }
    beep(tech.cls.includes('dark')?180:tech.cls.includes('lightning')?920:tech.cls.includes('blizzard')?760:540,28,.006);
  }
  function finishBattle(){
    if(phase==='result')return;
    phase='result';
    if(battleRaf)cancelAnimationFrame(battleRaf);
    document.body.classList.remove('countdown-active-v140');
    screen.removeAttribute('inert');
    clearGameplaySelection();
    state.records.mobMusou[p.id]=kills;
    timeEl.textContent='0.00';
    modeEl.textContent='RESULT';
    setTimeout(()=>{
      if(!isGameRunValid(runId))return;
      recordScreen(
        90,
        p,
        humanIndex,
        `${kills}<small> KO</small>`,
        '10秒オート無双'
      );
    },650);
  }
  function startBattle(){
    phase='battle';
    drawPanel.hidden=true;
    powerPanel.hidden=true;
    battlePanel.hidden=false;
    timeEl.textContent='10.00';
    modeEl.textContent='BATTLE';
    copyWeapon();
    const W=Math.max(300,battlePanel.clientWidth||340);
    const H=Math.max(300,battlePanel.clientHeight||390);
    battleStart=battleLast=performance.now();
    nextSpawnAt=battleStart;
    nextAttackAt=battleStart+120;
    for(let i=0;i<12;i++)spawnEnemy(W,H,0);

    function frame(now){
      if(phase!=='battle'||!isGameRunValid(runId))return;
      const dt=Math.min(.035,(now-battleLast)/1000);
      battleLast=now;
      const elapsed=(now-battleStart)/1000;
      const remain=Math.max(0,10-elapsed);
      timeEl.textContent=remain.toFixed(2);

      const mx=clamp(W*.46+Math.sin(elapsed*3.6)*W*.31+Math.sin(elapsed*8.0)*18,24,W-98);
      const jumpWave=Math.max(0,Math.sin(elapsed*4.8));
      const my=H-112-jumpWave*92;
      mobEl.style.left=`${mx}px`;
      mobEl.style.top=`${my}px`;
      const face=Math.sin(elapsed*3.6)>=0?1:-1;
      mobEl.style.transform=`scaleX(${face})`;

      if(now>=nextSpawnAt){
        const batch=elapsed>5?randi(3,5):randi(2,4);
        for(let i=0;i<batch;i++)spawnEnemy(W,H,elapsed);
        nextSpawnAt=now+clamp(138-elapsed*5,84,138);
      }

      for(const en of enemies){
        if(!en.alive)continue;
        const targetX=mx+34;
        const dx=targetX-en.x;
        en.x+=Math.sign(dx)*en.speed*dt;
        if(en.kind==='robot'||en.kind==='heavy'){
          en.y=H-44-en.size*.95-Math.abs(Math.sin(elapsed*4+en.size))*3;
        }else{
          en.y=H-44-en.size*.74-Math.abs(Math.sin(elapsed*4+en.size))*2;
        }
        en.el.style.left=`${en.x}px`;
        en.el.style.top=`${en.y}px`;
        if(en.kind==='robot'||en.kind==='heavy'){
          if(dx<0)en.el.style.transform='scaleX(-1)';
          else en.el.style.transform='scaleX(1)';
        }
        if(en.x<-90||en.x>W+90){
          en.alive=false;
          en.el.remove();
        }
      }

      if(now>=nextAttackAt){
        doAttack(W,H,elapsed,mx,my);
        nextAttackAt=now+tech.cadence+rand(-20,26);
      }

      if(elapsed>=10)finishBattle();
      else battleRaf=requestAnimationFrame(frame);
    }
    battleRaf=requestAnimationFrame(frame);
  }

  function finishDrawing(){
    phase='power';
    if(drawRaf)cancelAnimationFrame(drawRaf);
    tech=chooseTech();
    drawPanel.hidden=true;
    powerPanel.hidden=false;
    modeEl.textContent='POWER';
    timeEl.textContent='---';
    beep(820,90,.025);
    setTimeout(()=>{
      if(!isGameRunValid(runId))return;
      startBattle();
    },900);
  }
  function drawFrame(now){
    if(phase!=='draw'||!isGameRunValid(runId))return;
    const left=Math.max(0,7-(now-drawStart)/1000);
    timeEl.textContent=left.toFixed(2);
    if(left<=0){
      finishDrawing();
      return;
    }
    drawRaf=requestAnimationFrame(drawFrame);
  }

  if(!(await countdown('WEAPON DRAW',runId,{transparent:true})))return;
  if(!isGameRunValid(runId))return;
  drawStart=performance.now();
  drawRaf=requestAnimationFrame(drawFrame);
}


// GAME 64 -------------------------------------------------// GAME 64 -------------------------------------------------
function buildElectricMazeFixedV121(cols,rows){
  const cells=Array.from(
    {length:cols*rows},
    ()=>({
      top:true,
      right:true,
      bottom:true,
      left:true
    })
  );

  const idx=(r,c)=>r*cols+c;

  function carve(r1,c1,r2,c2){
    const a=idx(r1,c1);
    const b=idx(r2,c2);

    if(r2===r1-1){
      cells[a].top=false;
      cells[b].bottom=false;
    }else if(r2===r1+1){
      cells[a].bottom=false;
      cells[b].top=false;
    }else if(c2===c1-1){
      cells[a].left=false;
      cells[b].right=false;
    }else if(c2===c1+1){
      cells[a].right=false;
      cells[b].left=false;
    }
  }

  const mainPath=[
    [6,0],[6,1],[5,1],[4,1],
    [4,2],[4,3],[3,3],[2,3],
    [2,2],[1,2],[1,3],[1,4],[0,4]
  ];

  for(let i=1;i<mainPath.length;i++){
    const a=mainPath[i-1];
    const b=mainPath[i];
    carve(a[0],a[1],b[0],b[1]);
  }

  const branches=[
    [[6,1],[5,0]],
    [[4,1],[3,1]],
    [[3,1],[3,0]],
    [[4,2],[5,2]],
    [[4,3],[4,4]],
    [[3,3],[3,4]],
    [[2,2],[2,1]],
    [[2,1],[1,1]],
    [[1,2],[0,2]],
    [[1,4],[2,4]]
  ];

  for(const [a,b] of branches){
    carve(a[0],a[1],b[0],b[1]);
  }

  return cells;
}

async function startElectricMaze(p,humanIndex,runId){
  gameFit();
  const COLS=5,ROWS=7,MAX_MS=35000;
  let x=0,y=0,target=null;
  let startTime=0,last=0,raf=null,finished=false,stunUntil=0,machineGraceUntil=0;

  screen.innerHTML=`<div class="electric-shell-v119">
    <div class="game-head"><div><span class="kicker">${esc(p.name)}</span><h2>こっちだよモブくん！</h2></div><div class="game-badge">${playBadge(humanIndex)}</div></div>
    <div class="electric-hud-v119"><div><span>TIME</span><b id="electricTime">0.00</b></div><div><span>STATUS</span><b id="electricStatus">READY</b></div></div>
    <div id="electricStage" class="electric-stage-v119">
      <div id="electricWalls" class="electric-walls-v119"></div>
      <div id="electricMachines" class="electric-machines-v121"></div>
      <div id="electricGoal" class="electric-goal-v119">GOAL</div>
      <div id="electricPin" class="electric-pin-v119" hidden><i></i></div>
      <div id="electricMob" class="electric-mob-v119" style="background-image:url('icon/01.png')"></div>
      <div id="electricShock" class="electric-shock-v119"></div>
      <div id="electricMessage" class="electric-message-v119">行きたい場所をタップ！</div>
    </div>
  </div>`;

  const stage=document.getElementById('electricStage');
  const wallsEl=document.getElementById('electricWalls');
  const machinesEl=document.getElementById('electricMachines');
  const goalEl=document.getElementById('electricGoal');
  const pin=document.getElementById('electricPin');
  const mob=document.getElementById('electricMob');
  const shock=document.getElementById('electricShock');
  const timeEl=document.getElementById('electricTime');
  const statusEl=document.getElementById('electricStatus');
  const message=document.getElementById('electricMessage');

  const w=stage.clientWidth,h=stage.clientHeight;
  const pad=12,cw=(w-pad*2)/COLS,ch=(h-pad*2)/ROWS;
  const cells=buildElectricMazeFixedV121(COLS,ROWS);
  const segments=[];
  const machines=[];

  function addSeg(x1,y1,x2,y2){segments.push({x1,y1,x2,y2});}
  let html='';
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const cell=cells[r*COLS+c];
    const x0=pad+c*cw,y0=pad+r*ch,x1=x0+cw,y1=y0+ch;
    if(r===0&&cell.top){html+=`<i class="maze-wall-v119 h" style="left:${x0}px;top:${y0}px;width:${cw}px"></i>`;addSeg(x0,y0,x1,y0);}
    if(c===0&&cell.left){html+=`<i class="maze-wall-v119 v" style="left:${x0}px;top:${y0}px;height:${ch}px"></i>`;addSeg(x0,y0,x0,y1);}
    if(cell.right){html+=`<i class="maze-wall-v119 v" style="left:${x1}px;top:${y0}px;height:${ch}px"></i>`;addSeg(x1,y0,x1,y1);}
    if(cell.bottom){html+=`<i class="maze-wall-v119 h" style="left:${x0}px;top:${y1}px;width:${cw}px"></i>`;addSeg(x0,y1,x1,y1);}
  }
  wallsEl.innerHTML=html;

  x=pad+cw*.5;y=pad+(ROWS-.5)*ch;
  const goalX=pad+(COLS-.5)*cw,goalY=pad+ch*.5;
  goalEl.style.left=`${goalX}px`;goalEl.style.top=`${goalY}px`;
  mob.style.left=`${x}px`;mob.style.top=`${y}px`;

  const machineSpecs=[
    // Slightly offset from corridor center so a route always exists.
    {xCell:1.22,baseR:4.18,amp:.25,speed:.82,phase:.20},
    {xCell:3.70,baseR:2.72,amp:.23,speed:.96,phase:2.00},
    {xCell:3.32,baseR:1.44,amp:.21,speed:.74,phase:4.10}
  ];

  machineSpecs.forEach(spec=>{
    const el=document.createElement('div');
    el.className='electric-machine-v121';
    el.innerHTML=`
      <i style="background-image:url('icon/01.png')"></i>
      <span class="electric-bolt-v122">⚡</span>
    `;

    machinesEl.appendChild(el);

    machines.push({
      el,
      x:pad+spec.xCell*cw,
      baseY:pad+spec.baseR*ch,
      amp:spec.amp*ch,
      speed:spec.speed,
      phase:spec.phase,
      y:pad+spec.baseR*ch
    });
  });

  function pointSegDist(px,py,s){
    const vx=s.x2-s.x1,vy=s.y2-s.y1,wx=px-s.x1,wy=py-s.y1;
    const len=vx*vx+vy*vy;
    const t=len?clamp((wx*vx+wy*vy)/len,0,1):0;
    const sx=s.x1+vx*t,sy=s.y1+vy*t;
    return Math.hypot(px-sx,py-sy);
  }

  function collision(nx,ny){
    return segments.some(
      s=>pointSegDist(nx,ny,s)<13
    );
  }

  function machineCollision(nx,ny,now=performance.now()){
    if(now<machineGraceUntil)return false;

    return machines.some(m=>
      Math.hypot(
        nx-m.x,
        ny-m.y
      )<18
    );
  }

  function zap(now,source="wall"){
    stunUntil=now+1000;
    target=null;
    pin.hidden=true;

    if(source==="machine"){
      // Extra grace after the one-second stun prevents stun-lock.
      machineGraceUntil=now+1750;
    }
    statusEl.textContent='STUN 1.0';message.textContent='ビリビリ！！ 1秒スタン';
    mob.classList.remove('shocked');void mob.offsetWidth;mob.classList.add('shocked');
    shock.style.left=`${x}px`;shock.style.top=`${y}px`;shock.classList.remove('show');void shock.offsetWidth;shock.classList.add('show');
    beep(125,160,.045);
  }

  stage.addEventListener('pointerdown',e=>{
    if(finished||!startTime)return;
    e.preventDefault();
    const rect=stage.getBoundingClientRect();
    target={x:clamp(e.clientX-rect.left,pad,w-pad),y:clamp(e.clientY-rect.top,pad,h-pad)};
    pin.hidden=false;pin.style.left=`${target.x}px`;pin.style.top=`${target.y}px`;
    message.textContent='こっちだよ！';
    beep(620,24,.007);
  },{passive:false});

  function finish(ms){
    if(finished)return;finished=true;
    const value=Math.round(ms);
    state.records.electricMaze[p.id]=value;
    statusEl.textContent='GOAL!';message.textContent='GOAL!!';pin.hidden=true;mob.classList.add('goal-pop');
    beep(1080,170,.045);
    setTimeout(()=>{if(isGameRunValid(runId))recordScreen(63,p,humanIndex,`${(value/1000).toFixed(2)}<small>秒</small>`,`STUNしてもルートを修正！`)},700);
  }

  message.textContent=
    '固定コース！ ビリビリマシーンの初期位置も確認！';

  if(!(
    await countdown(
      'ELECTRIC MAZE',
      runId,
      {transparent:true}
    )
  ))return;

  startTime=performance.now();
  last=startTime;
  statusEl.textContent='GO!';

  function frame(now){
    if(finished||!isGameRunValid(runId))return;
    const dt=Math.min(30,now-last)/1000;last=now;
    const elapsed=now-startTime;timeEl.textContent=(elapsed/1000).toFixed(2);

    if(elapsed>=MAX_MS){finish(MAX_MS);return;}

    const machineT=elapsed/1000;

    for(const machine of machines){
      machine.y=
        machine.baseY+
        Math.sin(
          machineT*
          machine.speed*
          Math.PI*2+
          machine.phase
        )*
        machine.amp;

      machine.el.style.left=`${machine.x}px`;
      machine.el.style.top=`${machine.y}px`;
    }

    if(now<stunUntil){
      statusEl.textContent=
        `STUN ${((stunUntil-now)/1000).toFixed(1)}`;
    }else{
      if(statusEl.textContent.startsWith('STUN')){
        statusEl.textContent='GO!';
      }

      if(machineCollision(x,y,now)){
        zap(now,"machine");

      }else if(target){
        const dx=target.x-x;
        const dy=target.y-y;
        const dist=Math.hypot(dx,dy);

        if(dist<5){
          target=null;
          pin.hidden=true;

        }else{
          const step=Math.min(dist,132*dt);
          const nx=x+dx/dist*step;
          const ny=y+dy/dist*step;

          if(
            collision(nx,ny)||
            machineCollision(nx,ny,now)
          ){
            zap(
              now,
              collision(nx,ny)
                ? "wall"
                : "machine"
            );
          }else{
            x=nx;
            y=ny;
            mob.style.transform=
              `translate(-50%,-50%) scaleX(${dx<0?-1:1})`;
          }
        }
      }
    }

    mob.style.left=`${x}px`;
    mob.style.top=`${y}px`;
    if(Math.hypot(x-goalX,y-goalY)<Math.min(cw,ch)*.28){finish(elapsed);return;}
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
  screen.innerHTML=`<div class="cpu-sim"><div class="cpu-sim-box"><span class="kicker">CPU QUICK PROCESS</span><h2>CPU RESULT</h2><p class="lead">CPUは人間らしいばらつきに再調整。SUPER CPUはかなり低確率です。</p><div id="cpuRows">${list.map(p=>`<div class="cpu-row" data-cpu="${p.id}">${imgTag(p)}<div><b>${esc(p.name)}</b><span>CPU</span></div><div class="cpu-dot">•••</div></div>`).join("")}</div></div></div>`;

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
  const luckOnly=new Set([
    5,11,25,42,49,55,61,64,77,79,80
  ]);

  if(luckOnly.has(gameIndex)){
    return false;
  }

  return Math.random()<.05;
}


function softenCpuResultV121(gameIndex,p,ultra){
  const luckOnly=new Set([
    5,11,25,42,49,55,61,64,77,79,80
  ]);

  const specificallyTuned=new Set([
    50,51,54,59,62,63,
    64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92
  ]);

  if(
    luckOnly.has(gameIndex)||
    specificallyTuned.has(gameIndex)
  )return;

  const key=GAMES[gameIndex]?.key;
  const records=state.records[key];
  if(!records)return;

  const value=records[p.id];

  if(
    typeof value!=='number'||
    !Number.isFinite(value)
  )return;

  const lowerIsBetter=new Set([
    0,2,5,14,21,23,24,25,
    26,27,37,40,47,51,53,63
  ]);

  if(lowerIsBetter.has(gameIndex)){
    records[p.id]=
      value*
      (
        ultra
          ? 1.035
          : 1.105
      );
  }else{
    records[p.id]=
      value*
      (
        ultra
          ? .965
          : .895
      );
  }
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
    state.records.guardianMob[p.id]=ultra?randi(82,100):randi(24,88);
  }else if(gameIndex===47){
    state.records.mob50m[p.id]=ultra?randi(4550,5300):randi(5350,8900);
  }else if(gameIndex===48){
    const cpuHits=ultra?(Math.random()<.62?4:3):randi(1,3);
    state.records.sniperMob[p.id]=cpuHits*25;
  }else if(gameIndex===49){
    state.records.mobRacePredict[p.id]=ultra?(Math.random()<.55?100:80):[30,50,50,80][randi(0,3)];
  }else if(gameIndex===50){
    state.records.mobRocket[p.id]=Math.round(
      (
        ultra
          ? rand(72,86)
          : rand(40,74)
      )*
      10
    )/10;
  }else if(gameIndex===51){
    state.records.bossDuel[p.id]=ultra?randi(13500,17500):randi(17500,30000);
  }else if(gameIndex===52){
    const catches=ultra?randi(2,3):randi(0,2);
    state.records.plushCatcher[p.id]=
      catches===3?100:
      catches===2?randi(81,92):
      catches===1?randi(50,66):
      0;
  }else if(gameIndex===53){
    state.records.toyOnOff[p.id]=ultra?randi(1200,1900):randi(1900,4600);
  }else if(gameIndex===54){
    state.records.dodgeballMob[p.id]=ultra?randi(9,10):randi(4,8);
  }else if(gameIndex===55){
    state.records.amidakujiMob[p.id]=[0,15,30,50,75,100][randi(0,5)];
  }else if(gameIndex===56){
    state.records.katanaSmith[p.id]=ultra?randi(88,100):randi(55,91);
  }else if(gameIndex===57){
    state.records.homeRunMob[p.id]=Math.round((ultra?rand(2500,3000):rand(900,2550))*10)/10;
  }else if(gameIndex===58){
    state.records.mobMisfortune[p.id]=Math.round((ultra?rand(10.3,12):rand(5.6,10.8))*100)/100;
  }else if(gameIndex===59){
    state.records.aimMob[p.id]=
      ultra
        ? randi(58,76)
        : randi(24,58);
  }else if(gameIndex===60){
    state.records.balanceMob[p.id]=Math.round((ultra?rand(7.9,10):rand(3.6,8.3))*100)/100;
  }else if(gameIndex===61){
    const diceTotal=
      randi(1,6)+randi(1,6)+randi(1,6)+randi(1,6)+randi(1,6);
    state.records.mobDice[p.id]=clamp(
      Math.round(
        diceTotal<=5
          ? 1
          : diceTotal>=30
            ? 100
            : 1+(diceTotal-5)/25*99
      ),
      1,100
    );
  }else if(gameIndex===62){
    state.records.mobCombo[p.id]=ultra?randi(12,17):randi(4,11);
  }else if(gameIndex===63){
    state.records.electricMaze[p.id]=
      ultra
        ? randi(7800,10800)
        : randi(11200,22500);
  }else if(gameIndex===64){
    const cpuCardPoints=()=>{
      const roll=Math.random()*100;
      if(roll<32)return 5;
      if(roll<56)return 8;
      if(roll<76)return 10;
      if(roll<90)return 15;
      return 30;
    };

    let total=0;
    for(let i=0;i<6;i++)total+=cpuCardPoints();
    state.records.cardShop[p.id]=total;
  }else if(gameIndex===65){
    state.records.pizzaChef[p.id]=ultra?randi(78,92):randi(34,76);
  }else if(gameIndex===66){
    state.records.mobHammer[p.id]=ultra?randi(82,95):randi(35,79);
  }else if(gameIndex===67){
    state.records.bungeeMob[p.id]=ultra?randi(80,95):randi(32,79);
  }else if(gameIndex===68){
    state.records.waterSlide[p.id]=ultra?randi(80,92):randi(35,76);
  }else if(gameIndex===69){
    state.records.pancakeMob[p.id]=ultra?randi(78,91):randi(32,75);
  }else if(gameIndex===70){
    state.records.paperPlane[p.id]=ultra?randi(80,94):randi(36,79);
  }else if(gameIndex===71){
    state.records.tankMob[p.id]=ultra?randi(28,36):randi(12,28);
  }else if(gameIndex===72){
    state.records.curlingMob[p.id]=ultra?randi(80,95):randi(30,79);
  }else if(gameIndex===73){
    state.records.bubbleMob[p.id]=ultra?randi(82,94):randi(34,77);
  }else if(gameIndex===74){
    state.records.changeMob[p.id]=ultra?randi(82,97):randi(36,80);
  }else if(gameIndex===75){
    state.records.baggageMob[p.id]=ultra?randi(88,97):randi(30,80);
  }else if(gameIndex===76){
    state.records.bridgeMob[p.id]=ultra?randi(80,95):randi(36,79);
  }else if(gameIndex===77){
    state.records.treasureMob[p.id]=[20,40,60,80,100][randi(0,4)];
  }else if(gameIndex===78){
    state.records.rouletteMob[p.id]=ultra?[75,90,90,100][randi(0,3)]:[0,10,20,20,20,30,30,30,40,40,50,50,60,75,90][randi(0,14)];
  }else if(gameIndex===79){
    const values=shuffle([0,0,10,10,30,30,50,75,100]);
    state.records.excavationMob[p.id]=values[0]+values[1]+values[2];
  }else if(gameIndex===80){
    let tries=1;
    while(tries<10&&Math.random()>.5)tries++;
    state.records.oldMaidDuel[p.id]=tries;
  }else if(gameIndex===81){
    state.records.robotMarch[p.id]=Math.round(ultra?rand(720,980):rand(280,760));
  }else if(gameIndex===82){
    state.records.monsterMaster[p.id]=ultra?randi(8,10):randi(3,8);
  }else if(gameIndex===83){
    state.records.scoutMan[p.id]=ultra?randi(1,10):randi(5,34);
  }else if(gameIndex===84){
    const survivalScores=[0,11,22,33,44,56,67,78,89,100];
    state.records.atafutaSurvival[p.id]=ultra
      ? survivalScores[randi(7,9)]
      : survivalScores[randi(2,8)];
  }else if(gameIndex===85){
    state.records.waveMaster[p.id]=ultra?randi(84,98):randi(38,83);
  }else if(gameIndex===86){
    state.records.battleRoyaleMob[p.id]=ultra
      ? randi(8500,13500)
      : randi(12000,28000);
  }else if(gameIndex===87){
    state.records.littleMobShot[p.id]=ultra
      ? randi(155,198)
      : randi(72,158);
  }else if(gameIndex===88){
    state.records.monsterBoxMob[p.id]=ultra?randi(86,100):randi(34,86);
  }else if(gameIndex===89){
    state.records.alienBattleMob[p.id]=ultra
      ? randi(12500,19000)
      : randi(17500,36000);
  }else if(gameIndex===90){
    state.records.mobMusou[p.id]=ultra
      ? randi(128,165)
      : randi(62,132);
  }else if(gameIndex===91){
    state.records.iaidoMaster[p.id]=ultra
      ? randi(82,100)
      : randi(24,86);
  }else{
    state.records.killLeaderMob[p.id]=ultra
      ? [80,90,100][randi(0,2)]
      : randi(3,9)*10;
  }

  softenCpuResultV121(
    gameIndex,
    p,
    ultra
  );

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
  if(gameIndex===48)return clamp(Math.round(v),0,100);
  if(gameIndex===49)return clamp(Math.round(v),0,100);
  if(gameIndex===50)return clamp(Math.round(v),0,100);
  if(gameIndex===51){
    if(v<=12000)return 100;
    if(v>=32000)return 0;
    return clamp(
      Math.round((32000-v)/20000*100),
      0,100
    );
  }
  if(gameIndex===52)return clamp(Math.round(v),0,100);
  if(gameIndex===53){
    if(v<=1400)return 100;
    if(v>=6500)return 0;
    return clamp(Math.round((6500-v)/5100*100),0,100);
  }
  if(gameIndex===54)return clamp(Math.round(v/10*100),0,100);
  if(gameIndex===55)return clamp(Math.round(v),0,100);
  if(gameIndex===56)return clamp(Math.round(v),0,100);
  if(gameIndex===57)return clamp(Math.round(v/3000*100),0,100);
  if(gameIndex===58)return clamp(Math.round(v/12*100),0,100);
  if(gameIndex===59)return clamp(Math.round(v),0,100);
  if(gameIndex===60)return clamp(Math.round(v/10*100),0,100);
  if(gameIndex===61)return clamp(Math.round(v),0,100);
  if(gameIndex===62)return clamp(Math.round(v/20*100),0,100);
  if(gameIndex===63){
    if(v<=10000)return 100;
    if(v>=30000)return 0;
    return clamp(
      Math.round(
        (30000-v)/
        20000*
        100
      ),
      0,100
    );
  }
  if(gameIndex===64){
    if(v<=30)return 0;
    if(v>=90)return 100;
    return clamp(Math.round((v-30)/60*100),0,100);
  }
  if(gameIndex===71)return clamp(Math.round(v/35*100),0,100);
  if(gameIndex===79)return clamp(Math.round(v/225*100),0,100);
  if(gameIndex===80)return clamp(110-Math.round(v)*10,0,100);
  if(gameIndex===81)return clamp(Math.round(v/1000*100),0,100);
  if(gameIndex===82)return clamp(Math.round(v/10*100),0,100);
  if(gameIndex===83)return clamp(Math.round((47-v)/46*100),0,100);
  if(gameIndex===84)return clamp(Math.round(v),0,100);
  if(gameIndex===85)return clamp(Math.round(v),0,100);
  if(gameIndex===86){
    if(v<=8500)return 100;
    if(v>=40000)return 0;
    return clamp(Math.round((40000-v)/31500*100),0,100);
  }
  if(gameIndex===87)return clamp(Math.round(v/200*100),0,100);
  if(gameIndex===88)return clamp(Math.round(v),0,100);
  if(gameIndex===89){
    if(v<=12000)return 100;
    if(v>=45000)return 0;
    return clamp(Math.round((45000-v)/33000*100),0,100);
  }
  if(gameIndex===90)return clamp(Math.round(v/150*100),0,100);
  return clamp(Math.round(v),0,100);
}

function rankRecords(gameIndex){
  const key=GAMES[gameIndex].key,records=state.records[key],ascRaw=(gameIndex===0||gameIndex===2||gameIndex===5||gameIndex===14||gameIndex===21||gameIndex===23||gameIndex===24||gameIndex===25||gameIndex===26||gameIndex===27||gameIndex===37||gameIndex===40||gameIndex===47||gameIndex===51||gameIndex===53||gameIndex===63||gameIndex===80||gameIndex===83||gameIndex===86||gameIndex===89);
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
  if(gameIndex===48)return `${Math.round(v)}pt`;
  if(gameIndex===49)return `${Math.round(v)}pt`;
  if(gameIndex===50)return `${Number(v).toFixed(1)}km`;
  if(gameIndex===51)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===52)return `${Math.round(v)}pt`;
  if(gameIndex===53)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===54)return `${Math.round(v)}体`;
  if(gameIndex===55)return `${Math.round(v)}pt`;
  if(gameIndex===56)return `${Math.round(v)}pt`;
  if(gameIndex===57)return `${Number(v).toFixed(1)}m`;
  if(gameIndex===58)return `${Number(v).toFixed(2)}秒`;
  if(gameIndex===59)return `${Math.round(v)}pt`;
  if(gameIndex===60)return `${Number(v).toFixed(2)}秒`;
  if(gameIndex===61)return `${Math.round(v)}pt`;
  if(gameIndex===62)return `${Math.round(v)} COMBO`;
  if(gameIndex===63)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===70)return `${Math.round(v)}m`;
  if(gameIndex===71)return `${Math.round(v)}体`;
  if(gameIndex===80)return `${Math.round(v)}回目`;
  if(gameIndex===81)return `${Math.round(v)}m`;
  if(gameIndex===82)return `${Math.round(v)}体`;
  if(gameIndex===83)return `47校中 ${Math.round(v)}位`;
  if(gameIndex===84)return `${Math.round(v)}pt`;
  if(gameIndex===85)return `${Math.round(v)}pt`;
  if(gameIndex===86)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===87)return `${Math.round(v)} KO`;
  if(gameIndex===88)return `${Math.round(v)}pt`;
  if(gameIndex===89)return `${(v/1000).toFixed(2)}秒`;
  if(gameIndex===90)return `${Math.round(v)} KO`;
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
function teamTotals(){
  if(!mode().team)return null;
  const out={};
  teamKeys().forEach(key=>{
    out[key]=(mode().teams[key]||[]).reduce((sum,id)=>sum+(state.total[id]||0),0);
  });
  return out;
}
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

    ${tt?`<section class="panel"><h3>TEAM TOTAL</h3><div class="team-total multi-team-v119">${teamKeys().map((key,i)=>`<div class="team-box ${key.toLowerCase()}"><span>${mode().teamNames[key]}</span><b>${tt[key]}pt</b></div>`).join('')}</div></section>`:""}

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
  const totals=competitionRankTotals();
  const tt=teamTotals();
  let winner='';
  let teamSummary='';

  if(tt){
    const teamRank=teamKeys().map(key=>({key,points:tt[key]})).sort((a,b)=>b.points-a.points);
    const top=teamRank[0]?.points??0;
    const winners=teamRank.filter(x=>x.points===top);
    winner=winners.length>1?'DRAW':`${mode().teamNames[winners[0].key]} WIN!`;
    teamSummary=teamRank.map(x=>`${mode().teamNames[x.key]} ${x.points}pt`).join(' / ');
  }else{
    winner=`${totals[0].p.name} WIN!`;
  }

  screen.innerHTML=`
    <div class="champion">
      <small>FINAL RESULT</small>
      <strong>${esc(winner)}</strong>
      ${tt
        ? `<span>${teamSummary}</span>`
        : `<span>${mode().performance?`${state.playlist.length}ゲーム合計 / MAX ${maxScoreTotal()}pt`:`${state.playlist.length}ゲーム 総合順位`}</span>`}
    </div>

    <section class="panel">
      <h3>FINAL RANKING</h3>
      <div class="rank-list">
        ${totals.map(e=>rankRow(e.p,e.rank,`${e.points}pt`,mode().team?teamName(e.p.id):(e.p.cpu?'CPU':'PLAYER'))).join('')}
      </div>
    </section>

    ${tt?`<section class="panel"><h3>FINAL TEAM RANKING</h3><div class="team-final-grid-v119">${teamKeys().map(key=>({key,points:tt[key]})).sort((a,b)=>b.points-a.points).map((x,i)=>`<div class="team-box ${x.key.toLowerCase()}"><span>${i+1}位 ${mode().teamNames[x.key]}</span><b>${x.points}pt</b></div>`).join('')}</div></section>`:''}

    <section class="panel">
      <h3>GAME SCORE</h3>
      <div class="game-list">
        ${state.playlist.map((gameIdx,round)=>`<div class="game-row"><div class="game-no">${round+1}</div><div><b>${GAMES[gameIdx].title}</b><br><span>${participants().map(p=>`${p.cpu?p.name:`P${p.no}`}:${state.roundPoints[round]?.[p.id]??0}`).join(' / ')}</span></div><span>pt</span></div>`).join('')}
      </div>
    </section>

    <button id="replay" class="primary">同じ内容でもう一度</button>
    <div style="height:8px"></div>
    <button id="modeChange" class="secondary">モードセレクトへ</button>
  `;

  gameTop();

  document.getElementById('replay').addEventListener('click',()=>{
    const k=state.modeKey;
    const style=state.playStyle;
    const list=[...state.playlist];
    const setup=state.setup;

    state=freshState();
    state.modeKey=k;
    state.playStyle=style;
    state.playlist=list;
    state.setup=setup;
    state.roundIndex=0;
    initTotals();
    renderModeLobby();
  });

  document.getElementById('modeChange').addEventListener('click',renderBattleTypeSelect);
}


// =========================================================
// V10.48 GAME 92 — モブくんは居合切りの達人
// =========================================================
async function startIaidoMaster(p,humanIndex,runId){
  gameFit();

  const limits=[300,2500,2250];
  const lossFloor=[0,31,61];
  const lossTop=[30,60,75];
  let bestMs=99999;
  const clearTimes=[];
  let finalScore=0;
  let cleared=0;

  screen.innerHTML=`
    <div class="iaido-shell-v148 gameplay-fit">
      <div class="game-head">
        <div><span class="kicker">${esc(p.name)}</span><h2>モブくんは居合切りの達人</h2><p class="lead">「勝負!!」の瞬間に一閃</p></div>
        <div class="game-badge">${playBadge(humanIndex)}</div>
      </div>

      <div class="iaido-hud-v148">
        <div><span>刺客</span><b id="iaidoRound148">1 / 3</b></div>
        <div><span>勝利ライン</span><b id="iaidoLimit148">0.300</b></div>
        <div><span>BEST</span><b id="iaidoBest148">---</b></div>
      </div>

      <div id="iaidoStage148" class="iaido-stage-v148">
        <div class="iaido-night-v148"></div>
        <div class="iaido-moon-v148"></div>
        <div class="iaido-hills-v148"></div>
        <div class="iaido-grass-v148"></div>
        <div id="iaidoCall148" class="iaido-call-v148">READY</div>
        <div id="iaidoSlash148" class="iaido-slash-v148" hidden></div>
        <div id="iaidoAfter148" class="iaido-after-v148"></div>

        <div id="iaidoPlayer148" class="iaido-fighter-v148 player-v148">
          <img draggable="false" src="icon/01.png" alt="モブくん">
          <div class="iaido-katana-v148">
            <span class="blade-v148"></span><span class="guard-v148"></span><span class="hilt-v148"></span><span class="pommel-v148"></span>
          </div>
        </div>

        <div id="iaidoEnemy148" class="iaido-fighter-v148 enemy-v148">
          <img id="iaidoEnemyImg148" draggable="false" src="icon/02.png" alt="CPU">
          <div class="iaido-katana-v148">
            <span class="blade-v148"></span><span class="guard-v148"></span><span class="hilt-v148"></span><span class="pommel-v148"></span>
          </div>
        </div>
      </div>

      <div class="iaido-help-v148">早押しは敗北。中央の文字だけを見てタップ。</div>
    </div>`;

  const roundEl=document.getElementById('iaidoRound148');
  const limitEl=document.getElementById('iaidoLimit148');
  const bestEl=document.getElementById('iaidoBest148');
  const stage=document.getElementById('iaidoStage148');
  const call=document.getElementById('iaidoCall148');
  const slash=document.getElementById('iaidoSlash148');
  const after=document.getElementById('iaidoAfter148');
  const player=document.getElementById('iaidoPlayer148');
  const enemy=document.getElementById('iaidoEnemy148');
  const enemyImg=document.getElementById('iaidoEnemyImg148');

  function setCall(text,kind=''){
    call.textContent=text;
    call.className=`iaido-call-v148 ${kind}`.trim();
  }
  function prepare(stageNo){
    roundEl.textContent=`${stageNo+1} / 3`;
    limitEl.textContent=(limits[stageNo]/1000).toFixed(3);
    enemyImg.src=`icon/${String(Math.min(4,stageNo+2)).padStart(2,'0')}.png`;
    player.style.left='13%';
    enemy.style.left='67%';
    player.classList.remove('fallen-v148','winner-v148','swap-v148');
    enemy.classList.remove('fallen-v148','winner-v148','swap-v148');
    stage.classList.remove('impact-v148','lose-v148','win-v148');
    slash.hidden=true;
    slash.classList.remove('show-v148');
    after.innerHTML='';
    setCall('');
  }
  function lossScore(stageNo,ms,early){
    if(early)return lossFloor[stageNo];
    const floor=lossFloor[stageNo], top=lossTop[stageNo];
    const windowMs=[900,2500,2250][stageNo];
    const over=Math.max(0,ms-limits[stageNo]);
    return clamp(Math.round(top-(top-floor)*over/windowMs),floor,top);
  }
  function clearScore(){
    if(bestMs<=190)return 100;
    let q=0;
    clearTimes.forEach((ms,i)=>{
      const range=Math.max(1,limits[i]-190);
      q+=clamp(1-(ms-190)/range,0,1);
    });
    q/=Math.max(1,clearTimes.length);
    return clamp(80+Math.round(q*19),80,99);
  }
  function addAfterImages(){
    after.innerHTML=`<i class="p-v148"></i><i class="e-v148"></i>`;
  }

  // 2人はカウントダウンの時点ですでに夜の草原に配置。
  prepare(0);
  setCall('READY');
  if(!(await countdown('COUNTDOWN',runId,{transparent:true})))return;

  async function duel(stageNo){
    prepare(stageNo);
    let phase='intro';
    let goAt=0;
    let settled=false;
    let tapHandler=null;

    const resultPromise=new Promise(resolve=>{
      const settle=result=>{
        if(settled)return;
        settled=true;
        if(tapHandler)screen.removeEventListener('pointerdown',tapHandler,true);
        resolve(result);
      };
      tapHandler=e=>{
        e.preventDefault();
        if(phase!=='go'){
          settle({win:false,early:true,ms:99999});
          return;
        }
        const ms=Math.max(1,performance.now()-goAt);
        settle({win:ms<=limits[stageNo],early:false,ms});
      };
      screen.addEventListener('pointerdown',tapHandler,true);

      (async()=>{
        setCall('いざ・・','intro-v148');
        await wait(520); if(settled)return;
        setCall('尋常に','intro-v148');
        await wait(560); if(settled)return;
        setCall('','');
        await wait(rand(420,900)); if(settled)return;
        phase='go';
        goAt=performance.now();
        setCall('勝負!!','go-v148');
        beep(880,85,.025);
        await wait(limits[stageNo]+1500); if(settled)return;
        settle({win:false,early:false,ms:limits[stageNo]+1500});
      })();
    });

    const result=await resultPromise;
    if(!isGameRunValid(runId))return {win:false,abort:true};

    if(result.ms<bestMs){bestMs=result.ms; if(bestMs<99999)bestEl.textContent=(bestMs/1000).toFixed(3);}

    // 超高速で入れ替わって斬り合う。
    setCall('一閃!!','slash-text-v148');
    addAfterImages();
    slash.hidden=false;
    void slash.offsetWidth;
    slash.classList.add('show-v148');
    player.classList.add('swap-v148');
    enemy.classList.add('swap-v148');
    player.style.left='61%';
    enemy.style.left='19%';
    stage.classList.add('impact-v148');
    beep(result.win?1040:210,140,.035);

    // 指定どおり、斬り合いから1秒後に負けた方が倒れる。
    await wait(1000);
    if(!isGameRunValid(runId))return {win:false,abort:true};

    if(result.win){
      enemy.classList.add('fallen-v148');
      player.classList.add('winner-v148');
      stage.classList.add('win-v148');
      setCall(`${(result.ms/1000).toFixed(3)}秒  勝利!`,'result-v148 win-text-v148');
      clearTimes.push(result.ms);
      cleared=stageNo+1;
    }else{
      player.classList.add('fallen-v148');
      enemy.classList.add('winner-v148');
      stage.classList.add('lose-v148');
      finalScore=lossScore(stageNo,result.ms,result.early);
      setCall(result.early?'早すぎた…':'敗北…','result-v148 lose-text-v148');
    }

    // 勝敗演出を合計2秒以上確保。
    await wait(1150);
    return result;
  }

  for(let i=0;i<3;i++){
    const result=await duel(i);
    if(result.abort)return;
    if(!result.win)break;
    if(i<2){
      setCall('次の刺客!','next-v148');
      await wait(700);
    }
  }

  if(cleared===3)finalScore=clearScore();
  state.records.iaidoMaster[p.id]=finalScore;
  recordScreen(91,p,humanIndex,`${finalScore}<small>PT</small>`,cleared===3?`3人撃破 / BEST ${(bestMs/1000).toFixed(3)}秒`:`${cleared}人撃破`);
}


// =========================================================
// V10.48 GAME 93 — モブくんはキルリーダー
// =========================================================
async function startKillLeaderMob(p,humanIndex,runId){
  gameFit();

  const groundY=318;
  let W=360;
  let timeLeft=10;
  let kills=0;
  let wave=1;
  let last=performance.now();
  let raf=0;
  let finished=false;
  let leftHeld=false,rightHeld=false;
  let enemy=null;
  let bullets=[],enemyBullets=[];

  const player={x:38,y:groundY,w:38,h:48,vx:0,vy:0,onGround:true,hp:50,maxHp:50,face:1,shotAt:0,airAt:0};

  screen.innerHTML=`
    <div class="kill-shell-v148 gameplay-fit">
      <div class="game-head">
        <div><span class="kicker">${esc(p.name)}</span><h2>モブくんはキルリーダー</h2><p class="lead">HP50で1対1・10人抜き</p></div>
        <div class="game-badge">${playBadge(humanIndex)}</div>
      </div>

      <div class="kill-hud-v148">
        <div><span>KILL</span><b id="killK148">0 / 10</b></div>
        <div><span>TIME</span><b id="killT148">10.0</b></div>
        <div><span>YOU</span><b id="killHP148">50</b></div>
        <div><span>ENEMY</span><b id="killE148">5</b></div>
      </div>

      <div id="killStage148" class="kill-stage-v148">
        <div class="kill-sky-v148"></div><div class="kill-city-v148"></div><div class="kill-ground-v148"></div>
        <div id="killActor148" class="kill-actor-layer-v148"></div>
        <div id="killBul148" class="kill-bullet-layer-v148"></div>
        <div id="killFx148" class="kill-fx-v148"></div>
        <div id="killMsg148" class="kill-msg-v148">READY</div>
        <div id="killBig148" class="kill-big-v148" hidden></div>
      </div>

      <div class="kill-controls-v148">
        <button id="killLeft148">←</button>
        <button id="killJump148">JUMP</button>
        <button id="killShot148" class="shot-v148">射撃</button>
        <button id="killAir148" class="air-v148">戦闘機<b>READY</b></button>
        <button id="killRight148">→</button>
      </div>
    </div>`;

  const stage=document.getElementById('killStage148');
  const actorLayer=document.getElementById('killActor148');
  const bulletLayer=document.getElementById('killBul148');
  const fx=document.getElementById('killFx148');
  const msg=document.getElementById('killMsg148');
  const big=document.getElementById('killBig148');
  const kEl=document.getElementById('killK148');
  const tEl=document.getElementById('killT148');
  const hpEl=document.getElementById('killHP148');
  const eEl=document.getElementById('killE148');
  const airBtn=document.getElementById('killAir148');
  const airCd=airBtn.querySelector('b');
  W=Math.max(300,stage.clientWidth||360);

  function makeActor(img,isEnemy=false){
    const el=document.createElement('div');
    el.className=`kill-actor-v148 ${isEnemy?'enemy-v148':'player-v148'}`;
    el.innerHTML=`<img draggable="false" src="${img}" alt=""><i class="gun-v148"></i><b class="hpbar-v148"><i></i></b>`;
    actorLayer.appendChild(el);
    return el;
  }
  const playerEl=makeActor('icon/01.png',false);

  function updateActor(a){
    if(!a||!a.el)return;
    a.el.style.left=`${a.x}px`;
    a.el.style.top=`${a.y-a.h}px`;
    a.el.style.transform=`scaleX(${a.face<0?-1:1})`;
    a.el.querySelector('.hpbar-v148 i').style.width=`${clamp(a.hp/a.maxHp,0,1)*100}%`;
  }
  function showBig(text,kind='kill',ms=700){
    big.hidden=false;
    big.textContent=text;
    big.className=`kill-big-v148 ${kind}-v148 show-v148`;
    setTimeout(()=>{
      if(big.textContent===text){big.hidden=true;big.className='kill-big-v148';}
    },ms);
  }
  function pop(x,y,text,kind=''){
    const el=document.createElement('div');
    el.className=`kill-pop-v148 ${kind}`;
    el.textContent=text;
    el.style.left=`${x}px`;el.style.top=`${y}px`;
    fx.appendChild(el);
    setTimeout(()=>el.remove(),720);
  }
  function burst(x,y,kind='hit'){
    const el=document.createElement('div');
    el.className=`kill-burst-v148 ${kind}`;
    el.style.left=`${x}px`;el.style.top=`${y}px`;
    fx.appendChild(el);
    setTimeout(()=>el.remove(),520);
  }

  function spawnEnemy(initial=false){
    const hp=wave>=9?20:5;
    const icon=Math.min(10,wave+1);
    enemy={
      idx:wave,x:W-82,y:groundY,w:38,h:48,vx:0,vy:0,onGround:true,
      hp,maxHp:hp,face:-1,shotAt:performance.now()+700,voidAt:performance.now()+1500,voidUntil:0,
      grenadeAt:performance.now()+1500,portalAt:performance.now()+1100,airAt:performance.now()+1700,
      voidUsed:false,grenadeUsed:false,portalUsed:false,airUsed:false,
      el:makeActor(`icon/${String(icon).padStart(2,'0')}.png`,true)
    };
    updateActor(enemy);
    if(!initial){
      enemy.el.classList.add('drop-v148');
      setTimeout(()=>enemy&&enemy.el&&enemy.el.classList.remove('drop-v148'),450);
    }
    msg.textContent=`ENEMY ${wave} / HP ${hp}`;
  }

  function shoot(owner,ally=true){
    const now=performance.now();
    if(now<owner.shotAt)return;
    owner.shotAt=now+(ally?170:320);
    const el=document.createElement('i');
    el.className=`kill-bullet-v148 ${ally?'ally-v148':'enemy-v148'}`;
    bulletLayer.appendChild(el);
    (ally?bullets:enemyBullets).push({
      x:ally?owner.x+owner.w:owner.x,
      y:owner.y-owner.h+23,
      vx:(ally?1:-1)*480,
      el
    });
    beep(ally?660:310,34,.008);
  }

  function playerAirStrike(){
    const now=performance.now();
    if(now<player.airAt)return;
    player.airAt=now+3000;
    msg.textContent='FIGHTER!';
    for(let i=0;i<4;i++){
      setTimeout(()=>{
        if(!enemy||finished||!isGameRunValid(runId))return;
        const x=enemy.x+enemy.w/2+rand(-10,10);
        const missile=document.createElement('i');
        missile.className='kill-missile-v148 ally-v148';
        missile.style.left=`${x}px`;missile.style.top='-28px';
        fx.appendChild(missile);
        setTimeout(()=>{
          if(missile.isConnected)missile.remove();
          if(!enemy)return;
          enemy.hp=Math.max(0,enemy.hp-2);
          burst(x,enemy.y-18,'air-v148');
          pop(x,enemy.y-48,'-2','hit-v148');
        },360);
      },i*120);
    }
  }

  function enemyAirStrike(){
    msg.textContent='ENEMY FIGHTER!';
    showBig('AIR RAID','danger',650);
    for(let i=0;i<3;i++){
      setTimeout(()=>{
        if(finished)return;
        const x=player.x+player.w/2+rand(-14,14);
        const missile=document.createElement('i');
        missile.className='kill-missile-v148 enemy-v148';
        missile.style.left=`${x}px`;missile.style.top='-28px';
        fx.appendChild(missile);
        setTimeout(()=>{
          if(missile.isConnected)missile.remove();
          player.hp=Math.max(0,player.hp-2);
          burst(x,player.y-18,'enemy-v148');
          pop(x,player.y-50,'-2','enemy-v148');
        },380);
      },i*150);
    }
  }

  function useVoid(){
    if(!enemy||enemy.voidUsed)return;
    enemy.voidUsed=true;
    enemy.voidUntil=performance.now()+1500;
    enemy.el.classList.add('void-v148');
    msg.textContent='VOID!';
    showBig('VOID','void',520);
  }
  function useGrenade(){
    if(!enemy||enemy.grenadeUsed)return;
    enemy.grenadeUsed=true;
    msg.textContent='GRENADE!';
    const g=document.createElement('i');
    g.className='kill-grenade-v148';
    g.style.left=`${enemy.x}px`;g.style.top=`${enemy.y-44}px`;
    fx.appendChild(g);
    setTimeout(()=>{
      if(g.isConnected)g.remove();
      player.hp=Math.max(0,player.hp-5);
      burst(player.x+18,player.y-18,'grenade-v148');
      pop(player.x+18,player.y-52,'STUN -5','enemy-v148');
    },430);
  }
  function usePortal(){
    if(!enemy||enemy.portalUsed)return;
    enemy.portalUsed=true;
    const from=enemy.x,to=clamp(player.x+rand(85,145),160,W-70);
    const p1=document.createElement('i'),p2=document.createElement('i');
    p1.className='kill-portal-v148';p2.className='kill-portal-v148';
    p1.style.left=`${from}px`;p2.style.left=`${to}px`;
    p1.style.top=p2.style.top=`${groundY-25}px`;
    fx.append(p1,p2);
    msg.textContent='PORTAL!';
    setTimeout(()=>{
      if(enemy)enemy.x=to;
      p1.remove();p2.remove();
    },330);
  }

  function finishGameNow(kind){
    if(finished)return;
    finished=true;
    cancelAnimationFrame(raf);
    const score=clamp(kills*10,0,100);
    state.records.killLeaderMob[p.id]=score;
    if(kind==='clear'){
      stage.classList.add('clear-v148');
      showBig('KILL LEADER!!','clear',1400);
      beep(1120,210,.05);
    }else{
      stage.classList.add('defeat-v148');
      showBig('DEFEAT','defeat',1300);
      beep(150,260,.05);
    }
    setTimeout(()=>recordScreen(92,p,humanIndex,`${score}<small>PT</small>`,`${kills}人撃破`),1500);
  }

  // カウントダウン前にプレイヤーと1人目を配置。
  updateActor({...player,el:playerEl});
  player.el=playerEl;
  spawnEnemy(true);
  updateActor(player);
  updateActor(enemy);
  msg.textContent='READY / 1 VS 1';

  if(!(await countdown('COUNTDOWN',runId,{transparent:true})))return;
  last=performance.now();
  msg.textContent='FIGHT!';

  const hold=(id,setter)=>{
    const el=document.getElementById(id);
    el.addEventListener('pointerdown',e=>{e.preventDefault();setter(true);try{el.setPointerCapture(e.pointerId)}catch(_){}} ,{passive:false});
    const off=e=>{if(e)e.preventDefault();setter(false)};
    el.addEventListener('pointerup',off,{passive:false});
    el.addEventListener('pointercancel',off,{passive:false});
    el.addEventListener('lostpointercapture',()=>setter(false),{passive:true});
  };
  hold('killLeft148',v=>leftHeld=v);
  hold('killRight148',v=>rightHeld=v);
  document.getElementById('killJump148').addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(player.onGround){player.vy=-545;player.onGround=false;beep(460,38,.01);}
  },{passive:false});
  document.getElementById('killShot148').addEventListener('pointerdown',e=>{e.preventDefault();shoot(player,true)}, {passive:false});
  airBtn.addEventListener('pointerdown',e=>{e.preventDefault();playerAirStrike()}, {passive:false});

  const loop=now=>{
    if(finished||!isGameRunValid(runId))return;
    const dt=Math.min(.033,(now-last)/1000);last=now;
    timeLeft=Math.max(0,timeLeft-dt);

    player.vx=(leftHeld?-180:0)+(rightHeld?180:0);
    if(player.vx<0)player.face=-1;if(player.vx>0)player.face=1;
    player.x=clamp(player.x+player.vx*dt,8,W-player.w-8);
    if(!player.onGround){
      player.vy+=980*dt;player.y+=player.vy*dt;
      if(player.y>=groundY){player.y=groundY;player.vy=0;player.onGround=true;}
    }
    updateActor(player);

    if(enemy){
      const dx=player.x-enemy.x;
      enemy.face=dx>0?1:-1;
      if(Math.abs(dx)>115)enemy.x=clamp(enemy.x+Math.sign(dx)*78*dt,12,W-enemy.w-12);
      if(Math.random()<0.007&&enemy.onGround){enemy.vy=-470;enemy.onGround=false;}
      if(!enemy.onGround){
        enemy.vy+=980*dt;enemy.y+=enemy.vy*dt;
        if(enemy.y>=groundY){enemy.y=groundY;enemy.vy=0;enemy.onGround=true;}
      }

      if(enemy.idx===7 && now>=enemy.voidAt)useVoid();
      if(enemy.idx===8 && now>=enemy.grenadeAt)useGrenade();
      if(enemy.idx===9){
        if(now>=enemy.portalAt)usePortal();
        if(now>=enemy.voidAt)useVoid();
      }
      if(enemy.idx===10){
        if(now>=enemy.voidAt)useVoid();
        if(now>=enemy.airAt&&!enemy.airUsed){enemy.airUsed=true;enemyAirStrike();}
      }

      if(enemy.voidUntil<=now)enemy.el.classList.remove('void-v148');
      if(now>=enemy.shotAt && enemy.voidUntil<=now)shoot(enemy,false);
      updateActor(enemy);
    }

    bullets=bullets.filter(b=>{
      b.x+=b.vx*dt;b.el.style.left=`${b.x}px`;b.el.style.top=`${b.y}px`;
      if(enemy&&enemy.voidUntil<=now&&b.x>=enemy.x&&b.x<=enemy.x+enemy.w&&b.y>=enemy.y-enemy.h&&b.y<=enemy.y){
        enemy.hp=Math.max(0,enemy.hp-1);burst(enemy.x+enemy.w/2,b.y,'hit-v148');pop(enemy.x+enemy.w/2,enemy.y-52,'HIT','hit-v148');b.el.remove();return false;
      }
      if(b.x>W+24){b.el.remove();return false;}return true;
    });

    enemyBullets=enemyBullets.filter(b=>{
      b.x+=b.vx*dt;b.el.style.left=`${b.x}px`;b.el.style.top=`${b.y}px`;
      if(b.x>=player.x&&b.x<=player.x+player.w&&b.y>=player.y-player.h&&b.y<=player.y){
        player.hp=Math.max(0,player.hp-1);burst(player.x+player.w/2,b.y,'enemy-v148');pop(player.x+player.w/2,player.y-52,'-1','enemy-v148');b.el.remove();return false;
      }
      if(b.x<-24){b.el.remove();return false;}return true;
    });

    if(enemy&&enemy.hp<=0){
      const dead=enemy;
      kills++;
      timeLeft+=5;
      player.hp=Math.min(player.maxHp,player.hp+10);
      stage.classList.remove('kill-shake-v148');void stage.offsetWidth;stage.classList.add('kill-shake-v148');
      showBig(`KILL ${kills}!`,'kill',720);
      pop(dead.x+dead.w/2,dead.y-65,'+5 SEC / +10 HP','heal-v148');
      dead.el.classList.add('dead-v148');
      enemy=null;
      if(kills>=10){finishGameNow('clear');return;}
      wave++;
      setTimeout(()=>{
        if(!finished&&isGameRunValid(runId))spawnEnemy(false);
      },350);
    }

    kEl.textContent=`${kills} / 10`;
    tEl.textContent=timeLeft.toFixed(1);
    hpEl.textContent=Math.round(player.hp);
    eEl.textContent=enemy?Math.round(enemy.hp):'--';
    airCd.textContent=performance.now()<player.airAt?`${((player.airAt-performance.now())/1000).toFixed(1)}s`:'READY';

    if(player.hp<=0||timeLeft<=0){finishGameNow('defeat');return;}
    raf=requestAnimationFrame(loop);
  };
  raf=requestAnimationFrame(loop);
}


renderHome();
})();
