import express from 'express'

import {
  createGame,
  updateGame,
  findUserGames
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

//seperated finding all user games from finding active games to pass less data
app.get('/user/all', async (req, res, next) => {
  await findUserGames(req, res)
  next()
})

app.get('/user/active', async (req, res, next) => {
  await findActiveUserGames(req, res)
  next()
})

module.exports = app