'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'user',
      {
        userID: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        totalGames: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        wins: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        winStreak: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        highScore: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        gameUser: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        gameReady: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        gameScore: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        }
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};