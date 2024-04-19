'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Emotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Emotion.belongsTo(models.User, {foreignKey : 'implementer'})
      Emotion.belongsTo(models.Chat, {foreignKey : 'chat'})
    }
  }
  Emotion.init({
    type: DataTypes.ENUM('like', 'love', 'haha', 'wow', 'sad', 'angry'),
  }, {
    sequelize,
    modelName: 'Emotion',
  });
  return Emotion;
};