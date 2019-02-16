import Sequelize from 'sequelize'
import uuid from 'uuidv4'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('friend', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      defaultvalue: uuid()
    },
    board: {
      type: Sequelize.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('board'));
      },
      set: function (val) {
        return this.setDataValue('board', JSON.stringify(val));
      }
    },
    users: {
      type: Sequelize.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('users'));
      },
      set: function (val) {
        return this.setDataValue('users', JSON.stringify(val));
      }
    },
    //possible values: 
    status: {
      type: Sequelize.ENUM,
      values: ['blackTurn', 'redTurn', 'redWin', 'blackWin', 'draw'],
      allowNull: false,
      defaultValue: ''
    },
  }, {});
  Friend.associate = function (models) {};
  return Friend;
};