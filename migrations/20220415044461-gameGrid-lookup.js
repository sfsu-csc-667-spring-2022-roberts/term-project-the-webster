"use strict";

const GRID_SIDE = 15;
const SPECIAL_COORDINATES = [
  [
    { letterMultiplier: 1, wordMultiplier: 3 },
    {},
    {},
    { letterMultiplier: 2, wordMultiplier: 1 },
    {},
    {},
    {},
    { letterMultiplier: 1, wordMultiplier: 3 },
    {},
    {},
    {},
    { letterMultiplier: 2, wordMultiplier: 1 },
  ],
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface
      .createTable("game_grid", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        x: {
          type: Sequelize.INTEGER,
        },
        y: {
          type: Sequelize.INTEGER,
        },
        word_multiplier: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
        letter_multiplier: {
          type: Sequelize.INTEGER,
          defaultValue: 1,
        },
      })
      .then(() => {
        let cells = [];

        for (let x = 0; x < GRID_SIDE; x++) {
          for (let y = 0; y < GRID_SIDE; y++) {
            cells.push({ x, y, ...((SPECIAL_COORDINATES[x] || [])[y] || {}) });
          }
        }

        queryInterface.bulkInsert("game_grid", cells);
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("game_grid");
  },
};
