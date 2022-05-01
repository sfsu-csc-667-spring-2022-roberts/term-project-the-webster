"use strict";

const TILES = [
  { letter: "a", count: 9, value: 1 },
  { letter: "b", count: 2, value: 3 },
  { letter: "c", count: 2, value: 3 },
  { letter: "d", count: 4, value: 2 },
  { letter: "e", count: 12, value: 1 },
  { letter: "f", count: 2, value: 4 },
  { letter: "g", count: 3, value: 2 },
  { letter: "h", count: 2, value: 4 },
  { letter: "i", count: 9, value: 1 },
  { letter: "j", count: 1, value: 8 },
  { letter: "k", count: 1, value: 5 },
  { letter: "l", count: 4, value: 1 },
  { letter: "m", count: 2, value: 3 },
  { letter: "n", count: 6, value: 1 },
  { letter: "o", count: 8, value: 1 },
  { letter: "p", count: 2, value: 3 },
  { letter: "q", count: 1, value: 10 },
  { letter: "r", count: 6, value: 1 },
  { letter: "s", count: 4, value: 1 },
  { letter: "t", count: 6, value: 1 },
  { letter: "u", count: 4, value: 1 },
  { letter: "v", count: 2, value: 4 },
  { letter: "w", count: 2, value: 4 },
  { letter: "x", count: 1, value: 8 },
  { letter: "y", count: 2, value: 4 },
  { letter: "z", count: 1, value: 10 },
  { letter: " ", count: 2, value: 0}
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("tiles", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        letter: {
          type: Sequelize.STRING,
        },
        value: {
          type: Sequelize.INTEGER,
        },
      })
      .then(() => {
        const records = TILES.reduce((memo, { count, ...rest }) => {
          for (let i = 0; i < count; i++) {
            memo.push({ ...rest });
          }
          return memo;
        }, []);

        queryInterface.bulkInsert("tiles", records);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("tiles");
  },
};
