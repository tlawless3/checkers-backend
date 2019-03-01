import db, {
  sequelize
} from '../../db/index'
import jwt from 'jsonwebtoken'

const addFriend = async (req, res) => {
  try {
    const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
    const user = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      }
    })
    console.log(user)
    db.friend.create({
      friendId: req.body.friend.friendId,
      userId: user.id,
      status: 'sent'
    })
    res.status(200)
    res.send('friend request set')
  } catch (err) {
    res.status(err.status || '500')
    res.send(err)
  }
}

const acceptRequest = async (req, res) => {
  try {
    const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
    const user = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      }
    })
    const friendRequest = await db.friend.update({
      status: 'friends'
    }, {
      where: {
        friendId: user.id,
        userId: req.body.friend.friendId
      }
    })
    const userFriend = await db.friend.create({
      friendId: req.body.friend.friendId,
      userId: user.id,
      status: 'friends'
    })
    res.status(200)
    res.send('friend request accepted')
  } catch (err) {
    res.status(err.status || '500')
    res.send(err)
  }
}

const denyRequest = async (req, res) => {
  try {
    const clientUserToken = await jwt.verify(req.cookies.userToken, process.env.SECRET)
    const user = await db.user.findOne({
      where: {
        id: clientUserToken.userId
      }
    })
    const deletedUser = await db.friend.destroy({
      where: {
        friendId: user.id,
        userId: req.body.friend.friendId
      }
    })
    res.status(200)
    res.send('friend request denied')
  } catch (err) {
    res.status(err.status || '500')
    res.send(err)
  }
}

module.exports = {
  addFriend,
  acceptRequest,
  denyRequest
}