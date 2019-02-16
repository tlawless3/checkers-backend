import express from 'express'

const app = express()

app.post('/create', async (req, res, next) => {
  await createGame(req, res)
  next()
})

app.get('/myGames')

module.exports = app