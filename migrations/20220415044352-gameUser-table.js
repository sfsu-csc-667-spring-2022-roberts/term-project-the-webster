'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'gameUser',
      {
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "gameBoard",
            key: "gameID"
          },
        },
        userID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "user",
            key: "userID"
          },
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