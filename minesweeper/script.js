//hva som skjer når man klikker


import  { 

    createBoard, 
    markTile, 
    TILE_STATUSES, 
    revealTile, 
    checkWin,
    checkLose

} from './funksjoner_og_logikk.js'

let BOARD_SIZE = 9
let NUMBER_OF_MINES = 10


const difficultySelect = document.getElementById('difficulty')

difficultySelect.addEventListener('change', vanskelighetsgrad)

function vanskelighetsgrad() {
    const selectedDifficulty = difficultySelect.value
    
    // Sett brettstørrelse og antall miner basert på vanskelighetsgrad
    if (selectedDifficulty === 'easy') {
        BOARD_SIZE = 9
        NUMBER_OF_MINES = 10
    } else if (selectedDifficulty === 'medium') {
        BOARD_SIZE = 17
        NUMBER_OF_MINES = 45
    } else if (selectedDifficulty === 'hard') {
        BOARD_SIZE = 23
        NUMBER_OF_MINES = 99
    }
    
    createNewBoard(BOARD_SIZE, NUMBER_OF_MINES)
}

let board = (createBoard(BOARD_SIZE,NUMBER_OF_MINES))
const brettElement = document.querySelector('.board')
const flaggIgjen = document.getElementById("flagg")

console.log(board)

//click er venstreklikk og contextmenu er høyreklikk
board.forEach(row => {
    row.forEach(tile => {
        brettElement.append(tile.element)
        tile.element.addEventListener('click', () => {
            revealTile(board, tile)
            checkGameEnd()
        }) 
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault() //hindrer menyen som vanligvis kommer fra høyreklikk
            markTile(tile)
            listFlaggLeft()
        }) 
    }) // () => og e => er enklere måter å skrive funksjoner på som bare skal brukes på et sted i koden
})

function createNewBoard(boardSize, numberOfMines) {
    const newBoard = createBoard(boardSize, numberOfMines); 
    brettElement.innerHTML = ''; 
    klokke = 0

    newBoard.forEach(row => {
        row.forEach(tile => {
            brettElement.append(tile.element);
            tile.element.addEventListener('click', () => {
                revealTile(newBoard, tile);
                checkGameEnd();
            });
            tile.element.addEventListener('contextmenu', e => {
                e.preventDefault();
                markTile(tile);
                listFlaggLeft();
            });
        });
    });
    brettElement.style.setProperty('--size', boardSize)
    flaggIgjen.textContent = numberOfMines
    board = newBoard    
}
brettElement.style.setProperty('--size', BOARD_SIZE)
flaggIgjen.textContent = NUMBER_OF_MINES


function listFlaggLeft() {
    const markedTilesCount = board.reduce((count, row ) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).
        length
    }, 0)

    flaggIgjen.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board)
    const lose = checkLose(board)

    if (win || lose) {
        clearInterval(klokkeinterval)
    }

    if(win) {
        showPopup("win")
    }
    if(lose) {
        showPopup("lose")
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.mine) {
                    revealTile(board, tile);
                } else if (tile.status === TILE_STATUSES.MARKED) {
                    markTile(tile); // Fjern markeringen (hvis feilmarkert flagg)
                }
            })
        })
    }
}

const clock = document.getElementById("klokke")
let klokke = 0
let klokkeinterval

starttimer()

function timer() {
    klokke++
    clock.innerHTML = klokke 
}

document.getElementById("pauseButton").addEventListener('click', () => {
    showPopup("pause")
})

function starttimer() {
    klokkeinterval = setInterval(timer, 1000);
}

let timeOut = false

function showPopup(result) {
    const popup = document.getElementById("popup")
    const popupMessage = document.getElementById("popupMessage")
    const tid = document.getElementById("tid_brukt")

    
    if (result === "win") {
        popupMessage.textContent = "Gratulerer, du vant!"
        tid.textContent = klokke + "sek"
        button.textContent = "prøv igjen"
    } else if (result === "lose") {
        popupMessage.textContent = "Beklager, du tapte!"
        tid.textContent = ''
        button.textContent = "prøv igjen"
    } else if (result === "pause") {
        popupMessage.textContent = "Pause"
        tid.textContent = ''
        clearInterval(klokkeinterval)
        timeOut = true
        button.textContent = "fortsett"
    }


    popup.style.display = "flex"
}

function hidePopup() {
    const popup = document.getElementById("popup")
    popup.style.display = "none"
}

const button = document.getElementById("tryAgainBtn")
document.getElementById("tryAgainBtn").addEventListener("click", function() {
    if (timeOut === true) {
        timeOut = false
        hidePopup()
    } else {
        hidePopup()
        restartGame()
        klokke = 0
    }
    starttimer()
    
});

function restartGame() {
    createNewBoard(BOARD_SIZE, NUMBER_OF_MINES); 
    clock.innerHTML = klokke
    flaggIgjen.textContent = NUMBER_OF_MINES
    listFlaggLeft()
}