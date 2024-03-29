<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/YUN-RU-TSENG/airplane-game">
    <img src="https://i.imgur.com/H0I6h7l.png" alt="Logo" width="80" height="80"/>
  </a>

  <h3 align="center">Airplane Game</h3>

  <p align="center">
    本遊戲是一款簡易的飛機射擊遊戲，使用 Canvas API 製作
    <br />
    <br />
    <a href="https://airplane-game.netlify.app/">Airplane-game</a>
  </p>
</p>

## 項目簡介

本遊戲是一款簡易的飛機射擊遊戲，能透過滑鼠操作飛機射擊、移動，攻擊對手。
設計稿為自行設計。

## 項目技術

- Canvas API
- JavaScript

## 遊戲設定

玩家操作遊戲中的藍色飛機，射擊敵方的三種飛機（火箭、飛船、橘色飛機），一旦分數達到 5000 分即成功

- 玩家（藍色飛機）如何擊毀敵方飛機？
  - 透過點擊滑鼠右鍵，玩家（藍色飛機）可以射出子彈攻擊對手
- 玩家（藍色飛機）會受到何種攻擊？
  - 玩家（藍色飛機）可能受到不定時的敵方飛機子彈攻擊
  - 玩家（藍色飛機）可能受到敵方飛機的**自殺式**攻擊
- 玩家血量，攻擊力為何？
  - 玩家（藍色飛機）血量為 100
  - 玩家（藍色飛機）子彈攻擊力為 20
  - 玩家（藍色飛機）**自殺式**攻擊力為 50
- 敵機血量，攻擊力為何？
  - 敵機（三種機型設定相同，只有長相不同）只要遭受玩家攻擊，就會死亡
  - 敵機子彈攻擊力為 10
  - 敵機**自殺式**攻擊力為 50
- 敵方飛機會在 1 ~ 2 秒時間內隨機產生一台新的在天空戰場的頂部
- 敵方飛機會在 1 ~ 2 秒內隨機射擊子彈

### Installation

1. Clone the repo
   ```sh
   https://github.com/YUN-RU-TSENG/airplane-game
   ```