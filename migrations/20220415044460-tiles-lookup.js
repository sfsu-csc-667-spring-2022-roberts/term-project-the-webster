"use strict";

const TILES = [
  { letter: "a", count: 2, value: 1 },
  { letter: "b", count: 2, value: 1 },
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
