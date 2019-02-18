import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import db from './db/index'
import io from 'socket.io'
import uuid from 'uuidv4'
import {
  networkInterfaces
} from 'os';

dotenv.config()

const app = express();
const PORT = process.env.PORT;


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

//error handling
app.use((err, req, res, next) => {
  console.error(err)
  console.error(err.stack)
  res.status(err.status || 500).send(err.message || 'Internal server error.')
})

//set {force: true} to reformat db
db.sequelize.sync()

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});