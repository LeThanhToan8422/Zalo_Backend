'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Status_Chat', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM("text", "file")
      },
      status: {
        type: Sequelize.ENUM("delete", "recalls")
      },
      implementer: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      chat: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Chats',
          key : 'id'
        }
      },
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Status_Chat');
  }
};