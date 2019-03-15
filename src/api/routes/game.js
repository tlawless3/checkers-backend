import express from 'express'
import {
  createGame,
  updateGame,
  findUserGames,
  findActiveUserGames,
  deleteGame
} from '../functions/handleGame'

const app = express()

app.post('/create', async (req, res, next) => {
  await createGame(req, res)
  next()
})

app.put('/update', async (req, res, next) => {
  await updateGame(req, res)
  next()
})

//deletes game if there are no associations otherwise deletes users association
app.put('/delete', async (req, res, next) => {
  await deleteGame(req, res)
  next()
})

//seperated finding all user games from finding active games to pass less data
app.get('/user/all', async (req, res, next) => {
  await findUserGames(req, res)
  next()
})

//finds all games that aren't over or abandoned
app.get('/user/active', async (req, res, next) => {
  await findActiveUserGames(req, res)
  next()
})


//need route to get current game board maybe idk how sockets work

module.exports = app