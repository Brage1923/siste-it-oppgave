//logic

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}


// denne funksjonen lager et brett som jeg kan endre størrelsen på ved å ha et array 
// av ruter og rader som nå starter som hidden, altså ingen av rutene er bomber enda
export function createBoard(boardSize, numberOfMines) {
    const board = []
    const minePositions = getMinePositions(boardSize, numberOfMines)
    console.log(minePositions)

    for (let x = 0; x < boardSize; x++) {
        const row = []
        for (let y = 0; y < boardSize; y++) {
            const element = document.createElement("div")
            element.dataset.status = TILE_STATUSES.HIDDEN
            
            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(positionMatch.bind(null, { x, y})),
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile) 
        }
        board.push(row)
    }

    return board
} 


export function markTile(tile) {
    if (
        tile.status !== TILE_STATUSES.HIDDEN && 
        tile.status !== TILE_STATUSES.MARKED
    ) {
        return //gjør at koden ikke markerer hvis den er allerere klikket på, åpnet på en måte
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
    }
}

export function revealTile(board, tile) {
    if (tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }
    
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }
    
    //måten dette funker er at det er en array og .length sier hvor mange elementer som er "true"
    // i arrayet som i dette tilfellet er en rundt i alle retninger fra der man klikket
    tile.status = TILE_STATUSES.NUMBER
    const adjecentTiles = nearbyTiles(board, tile)
    const mines = adjecentTiles.filter(t => t.mine)
    if (mines.length === 0){
        adjecentTiles.forEach(revealTile.bind(null, board)) //denne linjen gjør at alt rundt en tom rute blir automatisk "klikket" på sånn som i det faktiske spillet
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkWin(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER ||
            (tile.mine &&
                (tile.status === TILE_STATUSES.Hidden || 
                    tile.status === TILE_STATUSES.MARKED ))
        })
    })
}

export function checkLose(board) {
    return board.some(row =>{
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}



function getMinePositions(boardSize, numberOfMines) {
    const positions = []

    while (positions.length < numberOfMines) {
        const position = {
            x: randomNumber(boardSize),
            y: randomNumber(boardSize),
        } 
        //legger til alle bombene som er spesifisert i NUMBER_OF_MINES

        if (!positions.some(positionMatch.bind(null, position))) {
            positions.push(position)
        }
    }

    return positions
}

function positionMatch(a, b) {
    return a.x === b.x && a.y === b.y
}

// tilfeldig tall som må være heltall
function randomNumber(size) {
    return Math.floor(Math.random() * size)
}

function nearbyTiles(board, { x, y }) {
    const tiles = []

    for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles 
} // denne funksjonen tar først et element til venstre og tar en og en i høyden før den går over til neste rekke

