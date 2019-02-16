import db from '../../db/index'
import jwt from 'jsonwebtoken'

const login = async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: {
        username: req.body.user.username
      }
    })
    // console.log('++++++', foundUser.password())
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
    res.status('404')
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
    res.status('500')
    res.send(err)
  }
}

module.exports = {
  login,
  createUser
}