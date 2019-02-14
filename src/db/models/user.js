import Sequelize from 'sequelize'
import uuid from 'uuidv4'
import crypto from 'crypto'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      defaultvalue: uuid()
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    displayname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      isEmail: true
    },
    password: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('password')
      }
    },
    salt: {
      type: Sequelize.STRING,
      get() {
        return () => this.getDataValue('salt')
      }
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
    User.belongsToMany(User, {
      as: "friend",
      through: "friends",
      foreignKey: "userId",
      otherKey: "friendId"
    })
  };
  //instance methods
  User.prototype.correctPassword = function (candidatePwd) {
    return User.encryptPassword(candidatePwd, this.salt()) === this.password()
  }
  //class methods
  User.generateSalt = function () {
    return crypto.randomBytes(16).toString('base64')
  }

  User.encryptPassword = function (plainText, salt) {
    return crypto
      .createHash('RSA-SHA256')
      .update(plainText)
      .update(salt)
      .digest('hex')
  }
  //hooks
  const setSaltAndPassword = user => {
    if (user.changed('password')) {
      user.salt = User.generateSalt()
      user.password = User.encryptPassword(user.password(), user.salt())
    }
  }

  User.beforeCreate(setSaltAndPassword)
  User.beforeUpdate(setSaltAndPassword)

  //return
  return User;
};