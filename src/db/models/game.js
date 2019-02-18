import Sequelize from 'sequelize'
import uuid from 'uuidv4'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('game', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuid()
    },
    private: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    //2d array of board each string is black, red, or empty
    board: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
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
      values: ['blackTurn', 'redTurn', 'redWin', 'blackWin', 'draw'],
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