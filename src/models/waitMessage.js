'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WaitMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WaitMessage.belongsTo(models.User, {foreignKey : 'sender'})
      WaitMessage.belongsTo(models.User, {foreignKey : 'receiver'})
      WaitMessage.belongsTo(models.GroupChat, {foreignKey : 'groupChat'})
    }
  }
  WaitMessage.init({
    dateTimeSend : DataTypes.DATE
  }, {
    sequelize,
    modelName: 'WaitMessage',
  });
  return WaitMessage;
};