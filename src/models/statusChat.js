'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StatusChat.belongsTo(models.User, {foreignKey : 'implementer'})
      StatusChat.belongsTo(models.Chat, {foreignKey : 'chat'})
    }
  }
  StatusChat.init({
    type: DataTypes.ENUM('text', 'file'),
    status: DataTypes.ENUM('delete', 'recalls'),
  }, {
    sequelize,
    modelName: 'StatusChat',
  });
  return StatusChat;
};