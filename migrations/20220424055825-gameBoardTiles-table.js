'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameBoardTile',
      {
        gameBoardTildId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        coordinates: {
          type: Sequelize.STRING
        },
        wordMultiplier: {
          type: Sequelize.INTEGER
        },
        letterMultiplier: {
          type: Sequelize.INTEGER
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameBoardTiles');
  }
};