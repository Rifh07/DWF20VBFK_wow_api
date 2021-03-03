'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ListBook.belongsTo(models.User, {
        as : "users"
      });
      ListBook.belongsTo(models.Book, {
        as : "books"
      });
    }
  };
  ListBook.init({
    usersId: DataTypes.INTEGER,
    booksId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListBook',
  });
  return ListBook;
};