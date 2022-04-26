"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("game_tiles", {
      gameId: {
        type: Sequelize.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      inPlay: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      inBag: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      xCoordinate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1,
      },
      yCoordinate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1,
      },
      order: {
        type: Sequelize.INTEGER,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("game_tiles");
  },
};
