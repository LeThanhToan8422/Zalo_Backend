'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StatusChatFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StatusChatFile.belongsTo(models.User, {foreignKey : 'implementer'})
      StatusChatFile.belongsTo(models.ChatFile, {foreignKey : 'chat_file'})
    }
  }
  StatusChatFile.init({
    status: DataTypes.ENUM('delete', 'recalls'),
  }, {
    sequelize,
    modelName: 'StatusChatFile',
  });
  return StatusChatFile;
};