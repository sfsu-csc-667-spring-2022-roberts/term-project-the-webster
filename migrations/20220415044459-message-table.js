'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'message',
      {
        messageID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        senderID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "user",
            key: "userID"
          },
        },
        recieverID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "user",
            key: "userID"
          },
        },
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: "gameBoard",
            key: "gameID"
          },
        },
        text: {
          type: Sequelize.TEXT
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message');
  }
};