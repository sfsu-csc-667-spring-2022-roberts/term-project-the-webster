"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("messages", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      game_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "games",
          key: "id",
        },
      },
      text: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE, 
        defaultValue: Sequelize.literal('NOW()'),
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("messages");
  },
};
