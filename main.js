import { getRandomInt, coolDown } from './libs/helper.js'

const canvas = document.querySelector('canvas')
let ctx = null
let isGameOnGoing = true

const playerPlaneImg = document.querySelector('.myAirPlaneImg')
const enemyPlaneImg = [
  document.querySelector('.enemyPlane_1'),
  document.querySelector('.enemyPlane_2'),
  document.querySelector('.enemyPlane_3'),
]
const playerPlane = {
  coordinate: {
    x: 0,
    y: 700,
  },
  img: playerPlaneImg,
  hitPoints: 100,
  bullet: [],
  attack: 0,
}
let enemyPlane = []
let skyCloud = [
  {
    coordinate: {
      x: 0,
      y: 30,
    },
    radius: 200,
  },
  {
    coordinate: {
      x: 340,
      y: 700,
    },
    radius: 100,
  },
]

const playerBullet = 7

class EnemyPlane {
  constructor({ x, y, img, isLive = true }) {
    this.coordinate = {
      x,
      y,
    }
    this.img = img
    this.hitPoints = 100
    this.bullet = []
    this.isLive = isLive
  }
}

class NoCanvasSupport extends Error {
  constructor(message) {
    super(message)
    this.name = 'NoCanvasSupport'
  }
}

function setupCanvas() {
  if (!canvas.getContext)
    throw NoCanvasSupport(
      "This browser doesn't support canvas, please change a browser"
    )

  ctx = canvas.getContext('2d')
  const parentElementPadding = 120
  canvas.width = canvas.parentNode.clientWidth
  canvas.height = canvas.parentNode.clientHeight - parentElementPadding
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function drawSky() {
  drawSkyBackground()
  drawSkyCloud()
}

function drawSkyCloud() {
  const cloudWhite = '#ffffff40'
  ctx.save()
  ctx.fillStyle = cloudWhite
  skyCloud.forEach(function drawSkyCloudCanvas(item) {
    const {
      coordinate: { x, y },
      radius,
    } = item
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.restore()
}

function drawSkyBackground() {
  ctx.save()
  ctx.fillStyle = '#D6EEFD'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
}

function getNewCoordinateOfSky() {
  return skyCloud.map((item) => {
    const {
      coordinate: { x: cloudX, y: cloudY },
      radius: cloudRadius,
    } = item
    const skyCloudStartPoint = 0 - cloudRadius
    const advanceDistance = 0.25
    const isCloudBeyondBoundary = cloudY - cloudRadius > canvas.height

    return isCloudBeyondBoundary
      ? {
          ...item,
          coordinate: { y: skyCloudStartPoint, x: cloudX },
        }
      : {
          ...item,
          coordinate: {
            y: cloudY + advanceDistance,
            x: cloudX,
          },
        }
  })
}

function drawPlayer() {
  drawPlayerHPAndScore()
  drawPlayerPlane()
  drawPlayerBullet()
}

function drawPlayerPlane() {
  ctx.save()
  // because player airplane is reverse 180 deg, so have to be rotated canvas
  ctx.translate(playerPlane.coordinate.x, playerPlane.coordinate.y)
  ctx.rotate((Math.PI / 180) * 180)
  ctx.drawImage(
    playerPlane.img,
    0 - playerPlane.img.width / 2,
    0 - playerPlane.img.height / 2
  )
  ctx.restore()
}

function drawPlayerHPAndScore() {
  const scoreX = 10
  const scoreY = 20
  const dark = '#343838'

  ctx.save()
  ctx.fillStyle = dark
  ctx.font = 'bold 12px monospace'
  ctx.fillText(
    `HP: ${playerPlane.hitPoints < 0 ? 0 : playerPlane.hitPoints}/100; SCORE:${
      playerPlane.attack ?? 0
    }`,
    scoreX,
    scoreY
  )
  ctx.restore()
}

function drawPlayerBullet() {
  const blue = '#273649'

  ctx.save()
  ctx.fillStyle = blue
  playerPlane.bullet.forEach(function drawPlayerCanvas(bullet) {
    const {
      coordinate: { x: bulletX, y: bulletY },
      size: { width: bulletWidth, height: bulletHeight },
    } = bullet

    ctx.fillRect(
      bulletX - bulletWidth / 2,
      bulletY - bulletHeight / 2,
      bulletWidth,
      bulletHeight
    )
  })
  ctx.restore()
}

function getNewCoordinateOfPlayerPlaneBullet() {
  const advanceDistance = 2

  return playerPlane.bullet
    .filter((item) => {
      const bulletBeyondBoundary = item.coordinate.y <= 0
      return !bulletBeyondBoundary
    })
    .map((item) => {
      const {
        coordinate: { x: bulletX, y: bulletY },
      } = item

      return {
        ...item,
        coordinate: {
          y: bulletY - advanceDistance,
          x: bulletX,
        },
      }
    })
}

function drawEnemyPlanes() {
  drawEnemyPlane()
  drawEnemyPlaneBullet()
}

function drawEnemyPlane() {
  for (let index = 0; index < enemyPlane.length; index++) {
    const currentEnemyPlane = enemyPlane[index]
    if (currentEnemyPlane.isLive) {
      ctx.drawImage(
        currentEnemyPlane.img,
        currentEnemyPlane.coordinate.x,
        currentEnemyPlane.coordinate.y
      )
    }
  }
}

function drawEnemyPlaneBullet() {
  ctx.save()
  ctx.fillStyle = '#F18651'
  const allBulletsCoordinate = enemyPlane.map((item) => item.bullet).flat()
  allBulletsCoordinate.forEach(function drawEnemyPlaneBulletCanvas(bullet) {
    const {
      coordinate: { x: bulletX, y: bulletY },
      size: { width: bulletWidth, height: bulletHeight },
    } = bullet

    ctx.fillRect(
      bulletX - bulletWidth / 2,
      bulletY - bulletHeight / 2,
      bulletWidth,
      bulletHeight
    )
  })
  ctx.restore()
}

function getNewCoordinateEnemyPlane() {
  return enemyPlane.map((enemyPlane) => {
    const {
      coordinate: { x: enemyPlaneX, y: enemyPlaneY },
    } = enemyPlane

    return {
      ...enemyPlane,
      coordinate: { x: enemyPlaneX, y: enemyPlaneY + 1 },
    }
  })
}

function getNewCoordinateOfEnemyPlaneBullet() {
  return enemyPlane.map((item) => {
    const newBullet = item.bullet.map((bullet) => {
      const {
        coordinate: { x: bulletX, y: bulletY },
      } = bullet

      return {
        ...bullet,
        coordinate: {
          x: bulletX,
          y: bulletY + 2,
        },
      }
    })

    return {
      ...item,
      bullet: newBullet,
    }
  })
}

function updateCoordinateOfPlayerPlane(e) {
  const mouseNotInCanvas = e.target !== canvas
  const mouseBeyondLeftMargin = e.offsetX <= 0
  const mouseBeyondRightMargin = e.offsetX >= canvas.width

  if (mouseNotInCanvas) {
    return
  }

  if (mouseBeyondRightMargin) {
    return (playerPlane.coordinate.x = canvas.width)
  }

  if (mouseBeyondLeftMargin) {
    return (playerPlane.coordinate.x = 0)
  }

  return (playerPlane.coordinate.x = e.offsetX)
}

function fireEnemyBullets() {
  setTimeout(function enemyPlaneBulletBulletLaunch() {
    enemyPlane = enemyPlane.map((item) => {
      const {
        coordinate: { x: enemyPlaneX, y: enemyPlaneY },
        bullet: enemyPlaneBullet,
      } = item

      const newEnemyPlaneBullet = {
        coordinate: {
          x: enemyPlaneX + item.img.width / 2,
          y: enemyPlaneY + item.img.height,
        },
        attack: 10,
        size: { width: 5, height: 5 },
      }

      return !item.isLive
        ? item
        : {
            ...item,
            bullet: [...enemyPlaneBullet, newEnemyPlaneBullet],
          }
    })

    if (isGameOnGoing) fireEnemyBullets()
  }, getRandomInt(100, 3000))
}

function detectPlayerPlaneFireBullet() {
  const addNewBullet = () => {
    playerPlane.bullet.push({
      coordinate: {
        x: playerPlane.coordinate.x,
        y: playerPlane.coordinate.y - playerPlane.img.height,
      },
      attack: 10,
      size: {
        width: 5,
        height: 5,
      },
    })
  }
  window.addEventListener(
    'click',
    // coolDown({ callback: addNewBullet, maximumNumberOfTimes: 10, second: 1000 })
    addNewBullet
  )
}

function dispatchANewEnemyPlane() {
  setTimeout(function dispatchANewEnemyPlaneCallback() {
    const randomImgIndex = getRandomInt(0, enemyPlaneImg.length - 1)
    const randomImg = enemyPlaneImg[randomImgIndex]
    const randomCoordinateX = getRandomInt(0, canvas.width - randomImg.width)
    const coordinateY = -randomImg.height

    enemyPlane.push(
      new EnemyPlane({
        x: randomCoordinateX,
        y: coordinateY,
        img: randomImg,
      })
    )

    if (isGameOnGoing) dispatchANewEnemyPlane()
  }, getRandomInt(1000, 2000))
}

function detectAttackDamage() {
  // 假如子彈重疊，子彈消失
  for (let index = 0; index < enemyPlane.length; index++) {
    for (let j = 0; j < enemyPlane[index].bullet.length; j++) {
      const detect = playerPlane.bullet.findIndex((item) => {
        const bulletOverlap =
          item.coordinate.x <= enemyPlane[index].bullet[j].coordinate.x + 3 &&
          item.coordinate.x >= enemyPlane[index].bullet[j].coordinate.x - 3 &&
          item.coordinate.y <= enemyPlane[index].bullet[j].coordinate.y + 3 &&
          item.coordinate.y >= enemyPlane[index].bullet[j].coordinate.y - 3
        return bulletOverlap ? true : false
      })
      if (detect !== -1) {
        playerPlane.bullet.splice(detect, 1)
        enemyPlane[index].bullet.splice(j, 1)
      }
    }
  }

  // 假如敵方子彈與我方飛機重疊，飛機扣血，子彈消失
  for (let index = 0; index < enemyPlane.length; index++) {
    for (let j = 0; j < enemyPlane[index].bullet.length; j++) {
      if (
        playerPlane.coordinate.x - playerPlane.img.width / 2 <=
          enemyPlane[index].bullet[j].coordinate.x &&
        playerPlane.coordinate.x + playerPlane.img.width / 2 >=
          enemyPlane[index].bullet[j].coordinate.x &&
        playerPlane.coordinate.y - playerPlane.img.height / 2 <=
          enemyPlane[index].bullet[j].coordinate.y &&
        playerPlane.coordinate.y + playerPlane.img.height / 2 >=
          enemyPlane[index].bullet[j].coordinate.y - 3
      ) {
        playerPlane.hitPoints -= 10
        enemyPlane[index].bullet.splice(j, 1)
      }
    }
  }

  // 假如我方子彈與敵方飛機重疊，飛機扣血，子彈消失
  for (let index = 0; index < enemyPlane.length; index++) {
    const detect = playerPlane.bullet.findIndex((item) => {
      if (
        item.coordinate.x <=
          enemyPlane[index].coordinate.x + enemyPlane[index].img.width &&
        item.coordinate.x >= enemyPlane[index].coordinate.x &&
        item.coordinate.y <=
          enemyPlane[index].coordinate.y + enemyPlane[index].img.height &&
        item.coordinate.y >= enemyPlane[index].coordinate.y &&
        enemyPlane[index].isLive
      )
        return true
    })
    if (detect !== -1) {
      playerPlane.bullet.splice(detect, 1)
      playerPlane.attack += 100
      enemyPlane[index].isLive = false
    }
  }

  // 假如飛機重疊，雙方皆扣血
  for (let index = 0; index < enemyPlane.length; index++) {
    if (
      playerPlane.coordinate.x - playerPlane.img.width / 2 <=
        enemyPlane[index].coordinate.x + enemyPlane[index].img.width &&
      playerPlane.coordinate.x + playerPlane.img.width / 2 >=
        enemyPlane[index].coordinate.x &&
      playerPlane.coordinate.y - playerPlane.img.height / 2 <=
        enemyPlane[index].coordinate.y + enemyPlane[index].img.height &&
      playerPlane.coordinate.y + playerPlane.img.height / 2 >=
        enemyPlane[index].coordinate.y - 3 &&
      enemyPlane[index].isLive
    ) {
      playerPlane.hitPoints -= 50
      enemyPlane[index].isLive = false
    }
  }

  if (isGameOnGoing) requestAnimationFrame(detectAttackDamage)
}

// function clearOverlapBullets(params) {}
// function playerPlaneIsShot(params) {}
// function enemyPlaneIsShot(params) {}
// function planeHitsTheBlood(params) {}

function isGameOver() {
  if (playerPlane.hitPoints < 0) {
    alert('Game over!')
    return window.location.reload()
  }
  if (playerPlane.attack >= 5000) {
    alert('You win!')
    return window.location.reload()
  }
  requestAnimationFrame(isGameOver)
}

function detectingPageIsActive() {
  document.addEventListener('visibilitychange', (e) => {
    if (e.target.visibilityState === 'visible') {
      isGameOnGoing = true
      fireEnemyBullets()
      dispatchANewEnemyPlane()
      detectAttackDamage()
    }
    if (e.target.visibilityState === 'hidden') isGameOnGoing = false
  })
}

function drawGame() {
  clearCanvas()
  drawSky()
  drawPlayer()
  drawEnemyPlanes()
  skyCloud = getNewCoordinateOfSky()
  playerPlane.bullet = getNewCoordinateOfPlayerPlaneBullet()
  enemyPlane = getNewCoordinateEnemyPlane()
  enemyPlane = getNewCoordinateOfEnemyPlaneBullet()
  requestAnimationFrame(drawGame)
}

function gameStart() {
  try {
    setupCanvas()
    drawGame()
    window.addEventListener('mousemove', updateCoordinateOfPlayerPlane)
    fireEnemyBullets()
    detectPlayerPlaneFireBullet()
    dispatchANewEnemyPlane()
    detectAttackDamage()
    detectingPageIsActive()
  } catch (error) {
    if (error instanceof NoCanvasSupport) alert(error.message)
    console.error(error)
  }
}

window.addEventListener('load', function () {
  isGameOver()
  gameStart()
})

// 修正為飛機都是用血量來計算生死
// 子彈可以顯示冷卻時間
// 飛機子彈打到死掉的敵機並不會讓子彈消失
// 修正攻擊偵測
