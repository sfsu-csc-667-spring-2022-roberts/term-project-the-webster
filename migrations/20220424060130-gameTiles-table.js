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
        inPlay: {
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
        coordinates: {
          type: Sequelize.STRING, 
          references: {
            model: "gameBoardTile",
            key: "coordinates"
          }
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