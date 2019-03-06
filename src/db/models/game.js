import Sequelize from 'sequelize'
import uuid from 'uuidv4'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid()
    },
    private: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    //2d array of board each object has props color and king
    board: {
      type: Sequelize.TEXT,
      allowNull: false,
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
        return JSON.parse(this.getDataValue('playerColors'));
      },
      set: function (val) {
        return this.setDataValue('playerColors', JSON.stringify(val));
      }
    },
    status: {
      type: Sequelize.ENUM,
      values: ['blackTurn', 'redTurn', 'redWin', 'blackWin', 'draw', 'waiting'],
      defaultValue: 'waiting',
      allowNull: false,
    },
  }, {});
  Game.associate = function (models) {
    Game.belongsToMany(models.user, {
      as: 'User',
      through: 'userGames'
    })
  };
  return Game;
};