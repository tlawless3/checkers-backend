import express from 'express'
import {
  addFriend,
  acceptRequest
} from '../functions/handleFriend'

const app = express()

app.post('/request', async (req, res, next) => {
  await addFriend(req, res)
  next()
})

app.post('/accept', async (req, res, next) => {
  await acceptRequest(req, res)
  next()
})

module.exports = app