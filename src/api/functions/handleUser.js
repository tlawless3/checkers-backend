import db from '../../db/index'

const login = async (req, res) => {
  if (req.body.user) {
    const foundUser = await db.sequelize.user.findOne({
      where: {
        username: req.body.username
      }
    })
    if (foundUser.correctPassword()) {
      jwt
    }
  } else {
    res.status('500')
    res.send('malformed login data')
  }
}