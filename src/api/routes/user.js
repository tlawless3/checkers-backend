import express from 'express'
import {
  login,
  createUser,
  verifyUser,
  getUserNameById,
  usernameAvailable
} from '../functions/handleUser'

const app = express()

app.post('/login', async (req, res, next) => {
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

app.post('/available', async (req, res, next) => {
  await usernameAvailable(req, res)
  next()
})

app.post('/id', async (req, res, next) => {
  await getUserNameById(req, res)
  next()
})

module.exports = app