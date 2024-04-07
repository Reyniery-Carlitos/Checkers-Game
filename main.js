import './style.css'

// 1 Jugador 1
// 2 Jugador 2
// 3 son las posiciones donde esta permitido moverse

let turnP1 = true
let selectedCell = null
let moveTo = null

const boardContainer = document.getElementById('board')

let board = [
  0, 2, 0, 2, 0, 2, 0, 2, 
  2, 0, 2, 0, 0, 0, 2, 0, 
  0, 2, 0, 2, 0, 2, 0, 2, 
  0, 0, 0, 0, 0, 0, 0, 0, 
  0, 0, 0, 2, 0, 2, 0, 0, 
  1, 0, 1, 0, 1, 0, 1, 0, 
  0, 1, 0, 1, 0, 1, 0, 1, 
  1, 0, 1, 0, 1, 0, 1, 0
]

// Pinta el board en blanco y amarillo
function paintBoard() {
  boardContainer.innerHTML = ''
  let row = 0
  let col = 0

  for (let cell in board) {
    const cellElement = document.createElement('div');
    const pawnP1Element = document.createElement('span')
    const pawnP2Element = document.createElement('span');

    row = Math.floor(cell / 8)
    col = Math.floor(cell % 8)
    
    cellElement.classList.add('cell')
    if (row % 2 === 1 && col % 2 === 0 || row % 2 === 0 && col % 2 === 1) cellElement.classList.add('cell-painted')

    if (board[cell] === 1) {
      pawnP1Element.classList.add('player-1')
      // pawnP1Element.textContent = 1
      cellElement.appendChild(pawnP1Element)
    }
    
    if (board[cell] === 2) {
      pawnP2Element.classList.add('player-2')
      // pawnP2Element.textContent = 2
      cellElement.appendChild(pawnP2Element)
    }

    if (board[cell] === 3) {
      cellElement.classList.add('hint')
    }
    
    boardContainer.appendChild(cellElement)
  }

}

// Pintamos en base a las posiiones iniciales
paintBoard()

// Actualizar el tablero
function updateBoard (newBoard) {
  board = [...newBoard]
  paintBoard()
  listen()
  turnP1 = false
  selectedCell = null
  moveTo = null
}

// Limpiar los posibles movimientos
function cleanHint () {
  board.forEach((cell, index) => {
    if (cell === 3) {
      board[index] = 0
    }
  })
} 

// Actualizar el tablero para nada mas mostrar los posibles movimientos
function updatePossibleMoves(newBoard) {
  board = [...newBoard]
  paintBoard()
  listen()
}

// Puede seguir comiendo?
function canEatAgain(myPos) {
  if (board[myPos - 9] === 2 && board[myPos - 18] === 0) {
    return [myPos - 18, true]
  }

  if (board[myPos - 7] === 2 && board[myPos - 14] === 0) {
    return [myPos - 14, true]
  }

  return false
}

// Comer pieza
function eat (myPos, moveTo) {
  // En caso de que pueda comer
  if (myPos - moveTo === 18) {
    board[moveTo] = 1
    board[myPos - 9] = 0

    const canEat = canEatAgain(moveTo)
    if (canEat[1]) {
      setTimeout(() => {
        eat(moveTo, canEat[0])
      }, 1000)
    }
  }

  if (myPos - moveTo === 14) {
    board[moveTo] = 1
    board[myPos - 7] = 0

    const canEat = canEatAgain(moveTo)
    if (canEat[1]) {
      setTimeout(() => {
        eat(moveTo, canEat[0])
      }, 1000)
    }
  }

  // No puede comer por lo tanto solamente se mueve
  if (myPos - moveTo === 9) {
    board[moveTo] = 1
  }

  if (myPos - moveTo === 7) {
    board[moveTo] = 1
  }

  board[myPos] = 0
  
  cleanHint()
  updateBoard(board)
}

// Calculara los posibles movimientos de una ficha
function calculatePossibleMoves (currentPos) {
  const currentRow = Math.floor(currentPos / 8)
  const currentCol = Math.floor(currentPos % 8)

  if (currentCol === 0) {
    // Posible movimiento 
    const possibleMove = board[currentPos - 7]
    
    if (possibleMove === 0) {
      board[currentPos - 7] = 3
    }

    if (possibleMove === 2) {
      if (board[currentPos - 14] === 0) {
        board[currentPos - 14] = 3
      }
    }
    
    updatePossibleMoves(board)
  } else if (currentCol === 7) {
    const possibleMove = board[currentPos - 9]
    
    if (possibleMove === 0) {
      board[currentPos - 9] = 3
    }

    if (possibleMove === 2) {
      if (board[currentPos - 18] === 0) {
        board[currentPos - 18] = 3
      }
    }
    
    updatePossibleMoves(board)
  } else {
    const possibleMove1 = board[currentPos - 9]
    const possibleMove2 = board[currentPos - 7]

    if (possibleMove1 === 2 && possibleMove2 === 2) {
      if (board[currentPos - 18] === 0) {
        board[currentPos - 18] = 3
      }

      if (board[currentPos - 14] === 0) {
        board[currentPos - 14] = 3
      } 

      updatePossibleMoves(board)
      return
    } 

    if (possibleMove1 === 2) {
      if (board[currentPos - 18] === 0) {
        board[currentPos - 18] = 3
        updatePossibleMoves(board)
        return
      }
    }

    if (possibleMove2 === 2) {
      if (board[currentPos - 14] === 0) {
        board[currentPos - 14] = 3
        updatePossibleMoves(board)
        return
      }
    }
    
    if (possibleMove1 === 0) {
      board[currentPos - 9] = 3
    } 
    
    if (possibleMove2 === 0) {
      board[currentPos - 7] = 3
    }
    
    updatePossibleMoves(board)
  }
}

function listen() {
  const boardCells = document.querySelectorAll('.cell')
  boardCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      // Movimientos para el usuario 1
      if (turnP1 && board[index] === 1) {
        cleanHint()
        calculatePossibleMoves(index)
        selectedCell = index
      }
      else if (turnP1 && board[selectedCell] === 1 && board[index] === 3) {
        moveTo = index
        eat(selectedCell, moveTo)
      } 

      console.log(selectedCell, moveTo)
    })
  })
}

listen()