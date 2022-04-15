'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'tiles',
      {
        tileID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true, 
          references: {
            model: "gameBoard",
            key: "gameID"
          },
        },
        letter: {
          type: Sequelize.STRING
        },
        value: {
          type: Sequelize.INTEGER
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tiles');
  }
};