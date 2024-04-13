'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupChat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      GroupChat.belongsTo(models.User, {foreignKey : 'leader'})
      GroupChat.belongsTo(models.User, {foreignKey : 'deputy'})
      GroupChat.hasMany(models.Chat, {foreignKey : 'groupChat'})
    }
  }
  GroupChat.init({
    name: DataTypes.STRING,
    members : DataTypes.JSON,
    image : DataTypes.STRING,
    status : DataTypes.ENUM(0,1)
  }, {
    sequelize,
    modelName: 'GroupChat',
  });
  return GroupChat;
};