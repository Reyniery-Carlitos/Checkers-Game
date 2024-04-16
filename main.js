import './style.css'

// // 1 Jugador 1
// // 2 Jugador 2
// // 3 son las posiciones donde esta permitido moverse

let turnP1 = true
let selectedCell = null
let moveTo = null
let forcedToEat = false
const queenPositions = [1, 3, 5, 7]
const posibleQueenMoves = []

const boardContainer = document.getElementById('board')

let board = [
  -1, 0, -1, 0, -1, 0, -1, 2, 
  0, -1, 0, -1, 0, -1, 0, -1, 
  -1, 2, -1, 2, -1, 2, -1, 2, 
  0, -1, 0, -1, 1.5, -1, 0, -1, 
  -1, 0, -1, 2, -1, 2, -1, 1.5, 
  1.5, -1, 2, -1, 1.5, -1, 2, -1, 
  -1, 2, -1, 1, -1, 0, -1, 1, 
  1, -1, 0, -1, 1, -1, 1, -1
]

// // Pinta el board en blanco y amarillo
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
      cellElement.appendChild(pawnP1Element)
    }
    
    if (board[cell] === 2) {
      pawnP2Element.classList.add('player-2')
      // pawnP2Element.textContent = 2
      cellElement.appendChild(pawnP2Element)
    }

    if (board[cell] === 1.5) {
      pawnP1Element.classList.add('queen')
      // pawnP1Element.textContent = 1
      cellElement.appendChild(pawnP1Element)
    }

    if (board[cell] === 3) {
      cellElement.classList.add('hint')
    }
    
    boardContainer.appendChild(cellElement)
  }

}

// // Pintamos en base a las posiiones iniciales
paintBoard()

// // Actualizar el tablero
function updateBoard (newBoard, turn = false, move = null) {
  board = [...newBoard]
  paintBoard()
  listen()
  turnP1 = turn
  if (turn === false) {
    selectedCell = null
    moveTo = move
  }
}

// // Limpiar los posibles movimientos
function cleanHint () {
  board.forEach((cell, index) => {
    if (cell === 3) {
      board[index] = 0
    }
  })
} 

// // Actualizar el tablero para nada mas mostrar los posibles movimientos
function updatePossibleMoves(newBoard) {
  board = [...newBoard]
  paintBoard()
  listen()
}

// // Puede seguir comiendo?
function canEatAgain(myPos) {
  // Comer en la misma diagonal (Izq)
  if (board[myPos - 9] === 2 && board[myPos - 18] === 0) {
    return [myPos, true]
  }
  
  // Comer en la misma diagonal (Der)
  if (board[myPos - 7] === 2 && board[myPos - 14] === 0) {
    return [myPos, true]
  }

  // // Comer en ziczac partiendo por la der
  // if (board[myPos - 7] === 2 && board[myPos - 14] === 0) {
  //   return [myPos, true]
  // }

  return [myPos, false]
}

function queenCanEat(initPos, move) {
  const currentRow = Math.floor(initPos / 8)
  const currentCol = Math.floor(initPos % 8)
  const moveRow = Math.floor(move / 8)
  const moveCol = Math.floor(move % 8)

  for(let pos of posibleQueenMoves) {
    const posRow = Math.floor(pos / 8)
    const posCol = Math.floor(pos % 8)

    if (posRow > moveRow && currentRow > posRow && currentCol < posCol) {
      if (posCol < moveCol) { // Arriba a la derecha
        board[pos] = 0
      }
    } else if (posRow > moveRow && currentRow > posRow && currentCol > posCol) {
      if (posCol > moveCol) { // Arriba a la izquierda
        board[pos] = 0
      }
    } else if (posRow < moveRow && currentRow < posRow && currentCol > posCol) {
      if (posCol > moveCol) { // Abajo a la derecha
        console.log('SADSDASD', pos)
        board[pos] = 0
      }
    } else if (posRow < moveRow && currentRow < posRow && currentCol < posCol) {
      if (posCol < moveCol) { // Abajo a la izquierda
        board[pos] = 0
      }
    }
  }

  posibleQueenMoves.length = 0
  updateBoard(board)
}

// Comer pieza
function eat (myPos, moveTo) {
  if (board[myPos] === 1) {
    // En caso de que pueda comer
    if (myPos - moveTo === 18) {
      board[moveTo] = 1
      board[myPos - 9] = 0
    }

    if (myPos - moveTo === 14) {
      board[moveTo] = 1
      board[myPos - 7] = 0
    }

    // No puede comer por lo tanto solamente se mueve
    if (myPos - moveTo === 9) {
      board[moveTo] = 1
      if (queenPositions.includes(moveTo)) {
        board[moveTo] = 1.5
      }
    }

    if (myPos - moveTo === 7) {
      board[moveTo] = 1
      if (queenPositions.includes(moveTo)) {
        board[moveTo] = 1.5
      }
    }
  } 
  // Movimientos de la reina
  else if (board[myPos] === 1.5) {
    // No puede comer por lo tanto solamente se mueve
    if (board[moveTo] === 3) {
      board[myPos] = 0
      board[moveTo] = 1.5
      console.log(posibleQueenMoves)
      queenCanEat(myPos, moveTo)
    }
  }

  board[myPos] = 0
  
  cleanHint()
  updateBoard(board)
}

// Calculando recursivamente los posibles movimientos de la reina
// la funcion recibe un numero (pos) y un string (r, l, b) r = right, l = left, b = both, bl = bottom left, br = bottom right
function calculateQueenPositions(pos, direction) {
  const currentRow = Math.floor(pos / 8)
  const currentCol = Math.floor(pos % 8)

  if (currentRow === 0 || currentRow === 7 || currentCol === 0 || currentCol === 7) {
    if (board[pos] === 0) {
      board[pos] = 3
      updatePossibleMoves(board)  
      return
    }
    return
  }

  if (direction === 'r') {
    if (board[pos] === 0) {
      board[pos] = 3
      updatePossibleMoves(board)
      calculateQueenPositions(pos - 7, 'r')
    } else if (board[pos] === 2) {
      if (board[pos - 7] === 0) posibleQueenMoves.push(pos)
      calculateQueenPositions(pos - 7, 'r')
    }
  } else if (direction === 'l') {
    if (board[pos] === 0) {
      board[pos] = 3
      updatePossibleMoves(board)
      calculateQueenPositions(pos - 9, 'l')
    } else if (board[pos] === 2) {
      if (board[pos - 9] === 0) posibleQueenMoves.push(pos)
      calculateQueenPositions(pos - 9, 'l')
    }
  } else if (direction === 'bl') {
    if (board[pos] === 0) {
      board[pos] = 3
      updatePossibleMoves(board)
      calculateQueenPositions(pos + 7, 'bl')
    } else if (board[pos] === 2) {
      if (board[pos + 7] === 0) posibleQueenMoves.push(pos)
      calculateQueenPositions(pos + 7, 'bl')
    }
  }else if (direction === 'br') {
    if (board[pos] === 0) {
      board[pos] = 3
      updatePossibleMoves(board)
      calculateQueenPositions(pos + 9, 'br')
    } else if (board[pos] === 2) {
      if (board[pos + 9] === 0) posibleQueenMoves.push(pos)
      calculateQueenPositions(pos + 9, 'br')
    }
  }
}

// Calculara los posibles movimientos de la reina
function calculatePossibleQueenMoves (currentPos) {
  const currentRow = Math.floor(currentPos / 8)
  const currentCol = Math.floor(currentPos % 8)

  if (currentCol === 0) {
    // Posible movimiento 
    const possibleMove1 = board[currentPos - 7]
    const possibleMove2 = board[currentPos + 9]
    
    if (possibleMove1 === 2 && possibleMove2 === 2) {
      if (board[currentPos - 14] === 0) {
        posibleQueenMoves.push(currentPos - 7)
        calculateQueenPositions(currentPos - 14, 'r')
      }

      if (board[currentPos + 18] === 0) {
        posibleQueenMoves.push(currentPos + 9)
        calculateQueenPositions(currentPos + 18, 'br')
      } 

      return
    } 

    if (possibleMove1 === 2) {
      if (board[currentPos - 14] === 0) {
        posibleQueenMoves.push(currentPos - 7)
        calculateQueenPositions(currentPos - 14, 'r')
        return
      }
    }

    if (possibleMove2 === 2) {
      if (board[currentPos + 18] === 0) {
        posibleQueenMoves.push(currentPos + 9)
        calculateQueenPositions(currentPos + 18, 'br')
        return 
      }
    }
    
    if (possibleMove1 === 0) {
      calculateQueenPositions(currentPos, 'r')
      return
    } 
    
    if (possibleMove2 === 0) {
      calculateQueenPositions(currentPos + 9, 'br')
      return
    }
  } else if (currentCol === 7) {
    // Posible movimiento 
    const possibleMove1 = board[currentPos - 9]
    const possibleMove2 = board[currentPos + 7]
    
    if (possibleMove1 === 2 && possibleMove2 === 2) {
      if (board[currentPos - 18] === 0) {
        posibleQueenMoves.push(currentPos - 9)
        calculateQueenPositions(currentPos - 18, 'l')
      }

      if (board[currentPos + 14] === 0) {
        posibleQueenMoves.push(currentPos + 7)
        calculateQueenPositions(currentPos + 14, 'bl')
      } 
      
      return
    } 
    
    if (possibleMove1 === 2) {
      if (board[currentPos - 18] === 0) {
        posibleQueenMoves.push(currentPos - 9)
        calculateQueenPositions(currentPos - 18, 'l')
        return
      }
    }

    if (possibleMove2 === 2) {
      if (board[currentPos + 14] === 0) {
        posibleQueenMoves.push(currentPos + 7)
        calculateQueenPositions(currentPos + 14, 'bl')
        return 
      }
    }
    
    if (possibleMove1 === 0) {
      calculateQueenPositions(currentPos - 9, 'l')
      return
    } 
    
    if (possibleMove2 === 0) {
      calculateQueenPositions(currentPos + 7, 'bl')
      return
    }
  } else {
    const possibleMove1 = board[currentPos - 9] // left
    const possibleMove2 = board[currentPos - 7] // right
    const possibleMove3 = board[currentPos + 7] // abajo izq
    const possibleMove4 = board[currentPos + 9] // abajo der

    if (possibleMove1 === 2 || possibleMove2 === 2 || possibleMove3 === 2 || possibleMove4 === 2) {
      if (board[currentPos - 14] === 0 && board[currentPos - 7] !== 1) {
        posibleQueenMoves.push(currentPos - 7)
        calculateQueenPositions(currentPos - 14, 'r')
      }

      if (board[currentPos + 14] === 0 && board[currentPos + 7] !== 1) {
        posibleQueenMoves.push(currentPos + 7)
        calculateQueenPositions(currentPos + 14, 'bl')
      } 

      if (board[currentPos + 18] === 0 && board[currentPos + 9] !== 1) {
        posibleQueenMoves.push(currentPos + 9)
        calculateQueenPositions(currentPos + 18, 'br')
      } 

      if (board[currentPos - 18] === 0 && board[currentPos - 9] !== 1) {
        posibleQueenMoves.push(currentPos - 9)
        calculateQueenPositions(currentPos - 18, 'l')
      }

      return
    } 

    if (possibleMove1 === 2) {
      if (board[currentPos - 18] === 0) {
        calculateQueenPositions(currentPos - 9, 'l')
        return
      }
    }

    if (possibleMove2 === 2) {
      if (board[currentPos - 14] === 0) {
        calculateQueenPositions(currentPos - 7, 'r')
        return 
      }
    }
    
    if (possibleMove1 === 0) {
      calculateQueenPositions(currentPos, 'l')
      return
    } 
    
    if (possibleMove2 === 0) {
      calculateQueenPositions(currentPos - 7, 'r')
      return
    }
  }
}

// // Calculara los posibles movimientos de una ficha
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
      if (turnP1 && board[index] === 1 && !selectedCell) {
        cleanHint()
        calculatePossibleMoves(index)
        selectedCell = index
      }
      else if (turnP1 && board[index] === 1.5) {
        cleanHint()
        calculatePossibleQueenMoves(index)
        selectedCell = index
      }
      else if (turnP1 && board[selectedCell] === 1.5 && board[index] === 3) {
        moveTo = index
        eat(selectedCell, moveTo)
      }
      else if (turnP1 && board[selectedCell] === 1 && board[index] === 3) {
        moveTo = index
        const canEat = canEatAgain(moveTo)

        eat(selectedCell, moveTo)
        
        selectedCell = moveTo
        if (canEat[1]) {
          selectedCell = canEat[0]
          calculatePossibleMoves(selectedCell)
          updateBoard(board, true)
        }
      } 
    })
  })
}

listen()