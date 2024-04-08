'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MakeFriends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MakeFriends.belongsTo(models.User, {foreignKey : 'giver'})
      MakeFriends.belongsTo(models.User, {foreignKey : 'recipient'})
    }
  }
  MakeFriends.init({
    content: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MakeFriends',
  });
  return MakeFriends;
};