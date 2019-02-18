import express from 'express'
import {
  login,
  createUser,
  verifyUser
} from '../functions/handleUser'

const app = express()

app.get('/login', async (req, res, next) => {
  await login(req, res)
  next()
})

app.post('/create', async (req, res, next) => {
  await createUser(req, res)
  next()
})

app.get('/verify', async (req, res, next) => {
  await verifyUser(req, res)
  next()
})

module.exports = app