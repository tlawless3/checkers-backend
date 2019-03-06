import db from '../../db/index'
import jwt from 'jsonwebtoken'

const createGame = async (req, res) => {
  const board = generateBoard(req.body.game.boardSize)
  const game = {
    board,
    playerColors: req.body.game.playerColors
  }
  const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
  try {
    //not sure if we need to store the game id on the frontend yet
    const createdGame = await db.game.create(
      game
    )
    await createdGame.setUser(clientUserToken.userId)
    res.status('201')
    res.send(createdGame.id)
  } catch (err) {
    res.status(err.status || '500')
    res.send(err.message)
  }
}

//on update have to dispatch new state to both players
const updateGame = async (req, res) => {
  try {
    await db.game.update({
      ...req.body.game
    }, {
      where: {
        id: req.body.game.gameId
      }
    })
    res.status('200')
    res.send('game updated successfully')
  } catch (err) {
    res.status(err.status || '500')
    res.send(err.message)
  }
}

const findUserGames = async (req, res) => {
  const clientUserToken = jwt.verify(req.cookies.userToken, process.env.SECRET)
  try {
    const games = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      },
      include: [{
        model: db.game,
        as: 'Game',
      }]
    })
    res.status('200')
    res.send(games.Game)
  } catch (err) {
    res.status(err.status || '500')
    res.send(err.message)
  }
}

const findActiveUserGames = async (req, res) => {
  const clientUserToken = jwt.verify(req.cookies.userToken, process.env.SECRET)
  try {
    const games = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      },
      include: [{
        model: db.game,
        as: 'Game',
        where: {
          status: ['blackTurn', 'redTurn']
        }
      }]
    })
    const gamesJSON = JSON.stringify(games)
    res.status('200')
    res.send(gamesJSON)
  } catch (err) {
    res.status(err.status || '500')
    res.send(err.message)
  }
}

//only sizes that should be passed are 8 and 10
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
          (j % 2 === 0) ? row.push({
            color: 'red',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        } else {
          (j % 2 !== 0) ? row.push({
            color: 'red',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        }
      }
      //generate empty rows
      else if (i >= rowsOfCheckers && i < (size - rowsOfCheckers)) {
        row.push('empty')
      }
      //generate bottom side of board
      else if (i >= (size - rowsOfCheckers)) {
        if (alternate) {
          (j % 2 === 0) ? row.push({
            color: 'black',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        } else {
          (j % 2 !== 0) ? row.push({
            color: 'black',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        }
      }
    }
    board.push(row)
  }
  return board
}

module.exports = {
  createGame,
  updateGame,
  findUserGames,
  findActiveUserGames
}