'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Account, {foreignKey : 'user'})
      User.hasMany(models.Chat, {foreignKey : 'sender'})
      User.hasMany(models.Chat, {foreignKey : 'receiver'})
      User.hasOne(models.GroupChat, {foreignKey : 'leader'})
      User.hasMany(models.NickName, {foreignKey : 'user'})
      User.hasOne(models.StatusChat, {foreignKey : 'implementer'})
    }
  }
  User.init({
    name: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    dob: DataTypes.DATE,
    phone: DataTypes.STRING,
    image: DataTypes.STRING,
    background: DataTypes.STRING,
    relationships : DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};