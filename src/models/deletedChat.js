'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeletedChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DeletedChat.belongsTo(models.User, {foreignKey : 'implementer'})
      DeletedChat.belongsTo(models.User, {foreignKey : 'chat'})
      DeletedChat.belongsTo(models.GroupChat, {foreignKey : 'groupChat'})
    }
  }
  DeletedChat.init({
    dateTimeSend: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'DeletedChat',
  });
  return DeletedChat;
};