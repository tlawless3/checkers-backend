import Sequelize from 'sequelize'
import uuid from 'uuidv4'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
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
    //object with red, black keys values are user ids
    playerColors: {
      type: Sequelize.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('users'));
      },
      set: function (val) {
        return this.setDataValue('users', JSON.stringify(val));
      }
    },
    status: {
      type: Sequelize.ENUM,
      values: ['blackTurn', 'redTurn', 'redWin', 'blackWin', 'draw'],
      allowNull: false,
    },
  }, {});
  Game.associate = function (models) {
    Game.belongsToMany(models.user, {
      through: 'userGames'
    })
  };
  return Game;
};