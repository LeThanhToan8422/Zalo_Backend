'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NickName extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NickName.belongsTo(models.User, {foreignKey : 'nicknameGiver'})
      NickName.belongsTo(models.User, {foreignKey : 'nicknameRecipient'})
    }
  }
  NickName.init({
    nickNames: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'NickName',
  });
  return NickName;
};