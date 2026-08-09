MOB 4 MODE GAMES
================

スマホ縦画面用 / 外部ライブラリ不要 / GitHub Pages対応

【ファイル】
index.html
style.css
game.js
play/
icon/

【必要画像・大文字小文字は厳守】
プレイヤー
play/01.png  プレイヤー1
play/02.png  プレイヤー2
play/03.png  プレイヤー3
play/04.png  プレイヤー4

CPU
play/05.PNG  モブイタリアン
play/06.PNG  モブ中華店主
play/07.PNG  モブティラノ
play/08.PNG  モブスーパーマン
※05〜08は指定どおり拡張子.PNGを大文字で参照しています。

記憶力ゲーム
icon/01.png ～ icon/10.png

スライドパズル
icon/006.png

フィギュア飛ばし
icon/01.png

【4モード】
1. 4人個人戦
   P1 / P2 / P3 / P4

2. 8人個人戦
   P1 / P2 / P3 / P4 + CPU5 / CPU6 / CPU7 / CPU8

3. 2対2タッグ
   TEAM A = P1 + P2
   TEAM B = P3 + P4

4. プレイヤー4人 VS CPU4人
   PLAYER TEAM = P1〜P4
   CPU TEAM = CPU5〜CPU8

【ポイント】
4人モード
1位 5 / 2位 3 / 3位 1 / 4位 0

8人モード
1位 10 / 2位 8 / 3位 6 / 4位 4 / 5位 3 / 6位 2 / 7位 1 / 8位 0

同記録は同着です。
同着者は同じ順位ポイントを獲得し、次順位は人数分繰り下げます。

【ゲーム1 反射神経】
READY? → 3・2・1 → ランダム待機 → MOBボタン。
MOB表示からタップまで0.01秒単位で計測します。
CPUは高速シミュレーションします。

【ゲーム2 記憶力】
icon/01.png〜10.pngをランダム配置。
3・2・1 → 10枚が順番に光る。
再度3・2・1 → 同じ順番にタップ。
間違えたところで終了。正解数で順位判定。
CPUは高速シミュレーションします。

【ゲーム3 スライドパズル】
icon/006.pngを3×3の9分割。
8ピース + 空き1マスとして遊びます。
必ず解ける状態になるよう、完成状態から合法手だけでシャッフルします。
完成まで0.01秒単位で計測。
CPUは高速シミュレーションします。

【ゲーム4 フィギュア飛ばし】
icon/01.pngのフィギュアを使用。
横長ゲージ → 円形ゲージの順で停止。
どちらも外側の端に近いほど100%。
2つの平均パワーから最大約280mの飛距離を計算。
棒がフィギュアを打ち、回転しながら横方向へ飛びます。
カメラはフィギュアを追尾し、飛距離をリアルタイム表示。
CPUは高速シミュレーションします。

【スマホ操作】
viewportでuser-scalable=no / maximum-scale=1を指定。
CSS touch-action: manipulationを指定。
dblclick、gesturestart/change/end、2本指touchmoveを抑止。
ゲーム操作エリアはtouch-action:none。
ダブルタップやピンチズームによる誤動作を抑えています。

【アップロード方法】
既存GitHubリポジトリに index.html / style.css / game.js を置き、
既存の play と icon フォルダをそのまま利用できます。
ZIP内のplay/iconには.gitkeepしか入れていないため、既存画像を上書きしません。
