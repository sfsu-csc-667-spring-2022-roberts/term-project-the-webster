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
          references : "user", 
          referencesKey: "userID"
        },
        recieverID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references : "user", 
          referencesKey: "userID"
        },
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references : "gameBoard", 
          referencesKey: "gameID"
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