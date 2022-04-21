'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameTiles',
      {
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "gameBoard",
            key: "gameID"
          },
        },
        discarded: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        inBag: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        ownerID: {
          type: Sequelize.INTEGER,
          primaryKey: true, 
          references: {
            model: "users",
            key: "userID"
          },
        },
        order: {
          type: Sequelize.INTEGER
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('gameTiles');
  }
};