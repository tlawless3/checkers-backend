import Sequelize from 'sequelize'
import uuid from 'uuidv4'

'use strict';
module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('friend', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuid()
    },
    userId: {
      type: Sequelize.STRING,
      foreignKey: true,
      allowNull: false
    },
    friendId: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {});
  Friend.associate = function (models) {};
  return Friend;
};