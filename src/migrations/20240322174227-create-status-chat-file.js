'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Status_Chat_File', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      chat_file: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Chat_Files',
          key : 'id'
        }
      },
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Status_Chat_File');
  }
};