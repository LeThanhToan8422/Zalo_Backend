'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wait_Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      dateTimeSend: {
        type: Sequelize.DATE
      },
      sender: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      receiver: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      groupChat: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Group_Chats',
          key : 'id'
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wait_Messages');
  }
};