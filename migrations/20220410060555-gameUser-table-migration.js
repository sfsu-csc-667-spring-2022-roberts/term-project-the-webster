'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameUser',
      {
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        userID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        order: {
          type: Sequelize.INTEGER,
          allowNull: false
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameUser');
  }
};