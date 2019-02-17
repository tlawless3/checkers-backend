// import db from '../../db/index'

const createGame = async (req, res, next) => {
  const board = generateBoard(req.body.game.boardSize)
  const game = {
    board,
    ...req.body.game
  }
  // const game = await db.game.create(
  //   game
  // )
}

const generateBoard = (size) => {
  let rowsOfCheckers = 0;
  let board = [];
  if (size >= 10) {
    rowsOfCheckers = 4
  } else {
    rowsOfCheckers = 3
  }
  let alternate = false;
  for (let i = 0; i < size; i++) {
    alternate = !alternate
    const row = []
    for (let j = 0; j < size; j++) {
      //generate top side of board
      if (i < rowsOfCheckers) {
        if (alternate) {
          (j % 2 === 0) ? row.push('red'): row.push('empty');
        } else {
          (j % 2 !== 0) ? row.push('red'): row.push('empty');
        }
      }
      //generate empty rows
      else if (i >= rowsOfCheckers && i < (size - rowsOfCheckers)) {
        row.push('empty')
      }
      //generate bottom side of board
      else if (i >= (size - rowsOfCheckers)) {
        if (alternate) {
          (j % 2 === 0) ? row.push('black'): row.push('empty');
        } else {
          (j % 2 !== 0) ? row.push('black'): row.push('empty');
        }
      }
    }
    board.push(row)
  }
  return board
}