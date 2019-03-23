import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import db from './db/index'
import jwt from 'jsonwebtoken'

dotenv.config()

const app = express();
const server = require('http').createServer(app);
const config = {
  pingTimeout: 60000
};
export const io = require('socket.io')(server, config)
const PORT = process.env.PORT || 3000;


//use res.cookie('user','useridvar', {signed: true}) to sign
//use req.signedCookies['user'] to retrieve
//pass porcess.env.SECRET to sign with secret, switching to json web token
app.use(cookieParser())

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//using json web token now pass user credentials as json web token

app.use(helmet())

app.use(cors({
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200,
  credentials: true
}))

// app.use('/', (req, res, next) => {
//   res.send('working')
// })

app.use('/api/v1.0.0', require('./api/index'))

io.on('connection', (socket) => {
  console.log('===============Socket Connection')
  socket.on('login', (userId) => {
    console.log('----------------' + userId)
    socket.join(userId)
  })
})

io.on('disconnet', (socekt) => {

})

// io.on('login', () => {
//   console.log('----------------loggedin')
// })
//error handling
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

//set {force: true} to reformat db
db.sequelize.sync()


server.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});