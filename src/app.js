import express from 'express'
import dotenv from 'dotenv'
import session from 'express-session'
import cors from 'cors'
import helmet from 'helmet'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import db from './db/index'
import uuid from 'uuidv4'

dotenv.config()

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json())

//use res.cookie('user','useridvar', {signed: true}) to encode
//use req.signedCookies['user'] to retrieve
app.use(cookieParser(process.env.SECRET))

app.use(csrf({
  cookie: true
}))

app.use(helmet())

app.use(cors({
  origin: process.env.ORIGIN_URL,
  optionsSuccessStatus: 200
}))

app.use('/', (req, res, next) => {
  res.send('working')
})

db.sequelize.sync({})

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});