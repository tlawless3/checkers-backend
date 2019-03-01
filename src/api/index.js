import express from 'express'

const app = express();

app.use('/testApi', (req, res, next) => {
  res.send('api working')
})

app.use('/user', require('./routes/user'))

app.use('/game', require('./routes/game'))

app.use('/friend', require('./routes/friend'))

module.exports = app