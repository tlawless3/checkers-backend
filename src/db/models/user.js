import Sequelize from 'sequelize'
import uuid from 'uuidv4'

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
      unique: true
    }
  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};