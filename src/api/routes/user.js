import express from 'express'
import {
  login
} from '../functions/handleUser'

const app = express()

app.get('/login', (req, res, next) => {
  login(req, res)
  next()
})

app.post('/create', (req, res, next) => {

})