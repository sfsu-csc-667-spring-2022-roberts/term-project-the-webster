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
          primaryKey: true
        },
        recieverID: {
          type: Sequelize.INTEGER,
          primaryKey: true
        },
        gameID: {
          type: Sequelize.INTEGER,
          primaryKey: true
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