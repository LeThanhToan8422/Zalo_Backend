'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Nick_Names', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickNames: {
        type: Sequelize.STRING
      },
      nicknameGiver: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
      nicknameRecipient: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Users',
          key : 'id'
        }
      },
    });
    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Nick_Names');
  }
};