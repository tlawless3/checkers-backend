import '@babel/polyfill'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import db from './db/index'
import uuid from 'uuidv4'

dotenv.config()

const app = express();
const PORT = process.env.PORT;

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