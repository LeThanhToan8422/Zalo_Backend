'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ChatFile.belongsTo(models.User, {foreignKey : 'sender'})
      ChatFile.belongsTo(models.User, {foreignKey : 'receiver'})
      ChatFile.belongsTo(models.GroupChat, {foreignKey : 'groupChat'})
      ChatFile.hasMany(models.StatusChatFile, {foreignKey : 'chat_file'})
    }
  }
  ChatFile.init({
    url: DataTypes.STRING,
    dateTimeSend: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'ChatFile',
  });
  return ChatFile;
};