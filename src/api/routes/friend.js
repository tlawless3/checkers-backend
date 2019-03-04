import express from 'express'
import {
  addFriend,
  acceptRequest,
  denyRequest,
  findReceived,
  findSent,
  findFriends
} from '../functions/handleFriend'

const app = express()

app.post('/request', async (req, res, next) => {
  await addFriend(req, res)
  next()
})

app.put('/accept', async (req, res, next) => {
  await acceptRequest(req, res)
  next()
})

app.put('/deny', async (req, res, next) => {
  await denyRequest(req, res)
  next()
})

app.get('/recieved', async (req, res, next) => {
  await findReceived(req, res)
  next()
})

app.get('/sent', async (req, res, next) => {
  await findSent(req, res)
  next()
})

app.get('/all', async (req, res, next) => {
  await findFriends(req, res)
  next()
})

module.exports = app