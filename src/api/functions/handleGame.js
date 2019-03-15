import db from '../../db/index'
import jwt from 'jsonwebtoken'
import {
  io
} from '../../app'

const createGame = async (req, res) => {
  const board = generateBoard(req.body.game.boardSize)
  const game = {
    board,
    playerColors: req.body.game.playerColors,
    status: req.body.game.status
  }
  const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
  try {
    //not sure if we need to store the game id on the frontend yet
    const createdGame = await db.game.create(
      game
    )
    if (req.body.game.playerColors.red !== 'AI' && req.body.game.playerColors.black !== 'AI') {
      await createdGame.setUser([req.body.game.playerColors.red, req.body.game.playerColors.black])
    } else if (req.body.game.playerColors.black !== 'AI') {
      await createdGame.setUser(req.body.game.playerColors.black)
    } else if (req.body.game.playerColors.red !== 'AI') {
      await createdGame.setUser(req.body.game.playerColors.red)
    }
    res.status('201')
    res.send(createdGame.id)
    if (clientUserToken.userId === createdGame.playerColors.red) {
      io.sockets.in(createdGame.playerColors.black).emit('updatedGame')
    } else {
      io.sockets.in(createdGame.playerColors.red).emit('updatedGame')
    }
  } catch (err) {
    res.status(err.status || '500')
    res.send(err.message)
  }
}

//on update have to dispatch new state to both players
const updateGame = async (req, res) => {
  try {
    const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
    const targetGame = await db.game.findOne({
      where: {
        id: req.body.game.gameId
      }
    })
    const updatedGame = await targetGame.update(req.body.game, {
      where: {
        id: req.body.game.gameId
      },
      returning: true
    })
    res.status('200')
    res.send(updatedGame)
    if (clientUserToken.userId === targetGame.playerColors.red) {
      io.sockets.in(targetGame.playerColors.black).emit('updatedGame')
    } else {
      io.sockets.in(targetGame.playerColors.red).emit('updatedGame')
    }
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

const deleteGame = async (req, res) => {
  const gameId = req.body.game.id
  const opponentId = req.body.opponent.id
  const clientUserToken = jwt.verify(req.cookies.userToken, process.env.SECRET)

  try {
    const returnGame = await db.game.findOne({
      where: {
        id: gameId
      },
      include: [{
        model: db.user,
        as: 'User'
      }]
    })
    if (returnGame.User.length >= 2 && returnGame.status !== 'waitingBlack' && returnGame.status !== 'waitingRed') {
      await returnGame.setUser(opponentId)
      res.send('deleted associations')
    } else {
      await db.game.destroy({
        where: {
          id: gameId
        }
      })
      res.send('deletedGame')
    }
    res.send(returnGame.User)
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
  for (let j = 0; j < size; j++) {
    const row = []
    alternate = !alternate
    for (let i = 0; i < size; i++) {
      //generate top side of board
      if (i < rowsOfCheckers) {
        if (alternate) {
          (i % 2 === 0) ? row.push({
            color: 'red',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        } else {
          (i % 2 !== 0) ? row.push({
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
        row.push({
          color: 'empty',
          king: false
        })
      }
      //generate bottom side of board
      else if (i >= (size - rowsOfCheckers)) {
        if (alternate) {
          (i % 2 === 0) ? row.push({
            color: 'black',
            king: false
          }): row.push({
            color: 'empty',
            king: false
          });
        } else {
          (i % 2 !== 0) ? row.push({
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
  findActiveUserGames,
  deleteGame
}