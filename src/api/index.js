import express from 'express'

const app = express();

app.use('/testApi', (req, res, next) => {
  res.send('api working')
})

module.exports = app