"use strict";

const TILES = [
  { letter: "A", count: 10, value: 1 },
  { letter: "B", count: 2, value: 3 },
  { letter: "C", count: 2, value: 3 },
  { letter: "D", count: 4, value: 2 },
  { letter: "E", count: 12, value: 1 },
  { letter: "F", count: 2, value: 4 },
  { letter: "G", count: 3, value: 2 },
  { letter: "H", count: 2, value: 4 },
  { letter: "I", count: 9, value: 1 },
  { letter: "J", count: 1, value: 8 },
  { letter: "K", count: 1, value: 5 },
  { letter: "L", count: 4, value: 1 },
  { letter: "M", count: 2, value: 3 },
  { letter: "N", count: 6, value: 1 },
  { letter: "O", count: 8, value: 1 },
  { letter: "P", count: 2, value: 3 },
  { letter: "Q", count: 1, value: 9 },
  { letter: "R", count: 6, value: 1 },
  { letter: "S", count: 4, value: 1 },
  { letter: "T", count: 6, value: 1 },
  { letter: "U", count: 5, value: 1 },
  { letter: "V", count: 2, value: 4 },
  { letter: "W", count: 2, value: 4 },
  { letter: "X", count: 1, value: 8 },
  { letter: "Y", count: 2, value: 4 },
  { letter: "Z", count: 1, value: 9 },
 // { letter: " ", count: 2, value: 0}
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
