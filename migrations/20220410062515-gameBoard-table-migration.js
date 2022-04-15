'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameBoard',
      {
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        inLobby: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameBoard');
  }
};