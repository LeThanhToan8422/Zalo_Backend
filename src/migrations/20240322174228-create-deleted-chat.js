'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Deleted_Chats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateTimeSend: {
        type: Sequelize.DATE
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
      groupChat: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Group_Chats',
          key : 'id'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Deleted_Chats');
  }
};