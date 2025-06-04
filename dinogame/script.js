import { setupGround, updateGround } from './ground.js'
import { setupDino, updateDino, getDinoRect, setDinoLose } from './dino.js'
import { setupCactus, updateCactus, getCactusRects } from './cactus.js'

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldELm = document.querySelector('.world')
const scoreElm = document.querySelector('.scoreCount')
const highscoreElm = document.querySelector('.highscoreCount')
const startScreenElm = document.querySelector('.start-screen')

setPixelToWorldScale()
window.addEventListener('resize', setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

let lastTime
let speedScale
let score = 0
let highscore = localStorage.getItem('highscore') || 0

highscoreElm.textContent = highscore

// gjør sånn at dinosauren ikke beverger seg fortere eller saktere avhengig av hvor mange frames per sekund det er
function update(time) {
    if (lastTime == null) {
        lastTime = time
        window.requestAnimationFrame(update)
        return;
    }
    const delta = time - lastTime
    
    updateGround(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)
    if (checkLose()) return handleLose()
    
    lastTime = time;
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isColliding(rect, dinoRect))
}

function isColliding(rect1, rect2) {
    return (
    rect1.left < rect2.right && 
    rect1.right > rect2.left && 
    rect1.top < rect2.bottom && 
    rect1.bottom > rect2.top
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE

}

function updateScore(delta) {
    score += delta * 0.01
    scoreElm.textContent = Math.floor(score)
}

function handleStart() {
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElm.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose()
    if (score > highscore) {
        highscore = Math.floor(score)
        localStorage.setItem('highscore', highscore) // Lagre highscore i localStorage
        highscoreElm.textContent = highscore // Oppdater highscore element
    }
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true })
        startScreenElm.classList.remove("hide")
    }, 100)
}


function setPixelToWorldScale() {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldToPixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        worldToPixelScale = window.innerHeight / WORLD_HEIGHT
    }

    worldELm.style.width = WORLD_WIDTH * worldToPixelScale + 'px'
    worldELm.style.height = WORLD_HEIGHT * worldToPixelScale + 'px'
}
