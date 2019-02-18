import db, {
  sequelize
} from '../../db/index'
import jwt from 'jsonwebtoken'
import io from 'socket.io'

const login = async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: {
        username: req.body.user.username
      }
    })
    if (foundUser.correctPassword(req.body.user.password)) {
      const returnUser = {
        username: foundUser.username,
        role: foundUser.role,
        displayName: foundUser.displayName,
        userId: foundUser.id
      }
      const token = jwt.sign(returnUser, process.env.SECRET)
      res.cookie('userToken', token)
      res.status('200')
      res.send('login successful')
    } else {
      res.status('401')
      res.send('incorrect password')
    }
  } catch (err) {
    res.status(err.status || '404')
    res.send(err)
  }
}

//create user function
const createUser = async (req, res) => {
  try {
    const createdUser = await db.user.create(
      req.body.user
    )
    const returnUser = {
      username: createdUser.username,
      role: createdUser.role,
      displayName: createdUser.displayName,
      userId: createdUser.id
    }
    const token = jwt.sign(returnUser, process.env.SECRET)
    res.cookie('userToken', token)
    res.status('201')
    res.send('account created successfully')
  } catch (err) {
    res.status(err.status || '500')
    res.send(err)
  }
}

const verifyUser = async (req, res) => {
  const clientUserToken = jwt.verify(req.cookies.userToken, process.env.SECRET)
  try {
    const foundUser = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      }
    })
    const returnValue = ({
      exists: true,
      role: foundUser.role
    })
    const response = JSON.stringify(returnValue)
    res.status('200')
    res.send(response)
  } catch (err) {
    res.status(err.status || '404')
    res.send(err)
  }
}

const usernameAvailable = async (req, res) => {
  const checkUsername = req.body.user.username
  const foundUsername = db.user.findOne({
    where: {
      username: checkUsername
    }
  })
  if (foundUsername) {
    const returnValue = ({
      available: false
    })
    const response = JSON.stringify(returnValue)
    res.status('200')
    res.send(response)
  } else {
    const returnValue = ({
      available: false
    })
    const response = JSON.stringify(returnValue)
    res.status('200')
    res.JSON(response)
  }
}

module.exports = {
  login,
  createUser,
  verifyUser,
  usernameAvailable
}