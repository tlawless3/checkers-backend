import express from 'express'

import {
  createGame
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

app.get('/user', async (req, res, next) => {
  await findUserGames(req, res)
  next()
})

module.exports = app