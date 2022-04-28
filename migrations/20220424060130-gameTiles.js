"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("game_tiles", {
      game_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      tile_id :{
        type: Sequelize.INTEGER,
        references: {
          model: "tiles",
          key: "id"
        }
      },
      in_play: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      in_bag: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      x_coordinate: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: -1,
      },
      y_coordinate: {
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
