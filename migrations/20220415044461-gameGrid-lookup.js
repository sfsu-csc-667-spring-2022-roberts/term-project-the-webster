"use strict";

const GRID_SIDE = 15;
const doubleLetter = new Set();
//building doubleLetter set
{
  doubleLetter.add("0,3");
  doubleLetter.add("0,11");
  doubleLetter.add("2,6");
  doubleLetter.add("2,8");
  doubleLetter.add("3,0");
  doubleLetter.add("3,7");
  doubleLetter.add("3,14");
  doubleLetter.add("6,2");
  doubleLetter.add("6,6");
  doubleLetter.add("6,8");
  doubleLetter.add("6,12");
  doubleLetter.add("7,3");
  doubleLetter.add("7,11");
  doubleLetter.add("8,2");
  doubleLetter.add("8,6");
  doubleLetter.add("8,8");
  doubleLetter.add("8,12");
  doubleLetter.add("11,0");
  doubleLetter.add("11,7");
  doubleLetter.add("11,14");
  doubleLetter.add("12,6");
  doubleLetter.add("12,8");
  doubleLetter.add("14,3");
  doubleLetter.add("14,11");
}
const doubleWord = new Set();
//building doubleWord set
{
  doubleWord.add("1,1");
  doubleWord.add("1,13");
  doubleWord.add("2,2");
  doubleWord.add("2,12");
  doubleWord.add("3,3");
  doubleWord.add("3,11");
  doubleWord.add("4,4");
  doubleWord.add("4,10");
  doubleWord.add("10,4");
  doubleWord.add("10,10");
  doubleWord.add("11,3");
  doubleWord.add("11,11");
  doubleWord.add("12,12");
  doubleWord.add("12,2");
  doubleWord.add("13,1");
  doubleWord.add("13,13");
}
const tripleLetter = new Set();
{
  tripleLetter.add("1,5");
  tripleLetter.add("1,9");
  tripleLetter.add("5,1");
  tripleLetter.add("5,5");
  tripleLetter.add("5,9");
  tripleLetter.add("5,13");
  tripleLetter.add("9,1");
  tripleLetter.add("9,5");
  tripleLetter.add("9,9");
  tripleLetter.add("9,13");
  tripleLetter.add("13,5");
  tripleLetter.add("13,9");
}
const tripleWord = new Set();
{
  tripleWord.add("0,0");
  tripleWord.add("0,7");
  tripleWord.add("0,14");
  tripleWord.add("7,0");
  tripleWord.add("7,14");
  tripleWord.add("14,0");
  tripleWord.add("14,7");
  tripleWord.add("14,14");
}
let center = new Set();
center.add("7,7");

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
        let squares = [];
        for (let x = 0; x < GRID_SIDE; x++) {
          for (let y = 0; y < GRID_SIDE; y++) {
            if (doubleLetter.has(`${x},${y}`)) {
              squares.push({ x, y, letter_multiplier: 2, word_multiplier: 1 });
            } else if (doubleWord.has(`${x},${y}`)) {
              squares.push({ x, y, letter_multiplier: 1, word_multiplier: 2 });
            } else if (tripleLetter.has(`${x},${y}`)) {
              squares.push({ x, y, letter_multiplier: 3, word_multiplier: 1 });
            } else if (tripleWord.has(`${x},${y}`)) {
              squares.push({ x, y, letter_multiplier: 1, word_multiplier: 3 });
            } else if (center.has(`${x},${y}`)) {
              squares.push({ x, y, letter_multiplier: 2, word_multiplier: 2 });
            } else {
              squares.push({ x, y, letter_multiplier: 1, word_multiplier: 1 });
            }
          }
        }
        queryInterface.bulkInsert("game_grid", squares);
      });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("game_grid");
  },
};
