"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("games", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      in_lobby: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      current_turn: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("games");
  },
};
