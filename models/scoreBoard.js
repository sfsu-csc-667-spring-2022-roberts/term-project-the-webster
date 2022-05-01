const game = require("../db/game");

const getPlayers = () => {
    players = [
        {
        name: "jack",
        id: 1, 
        score: getPlayersScore()
        }, 
        {
          name: "kris", 
          id: 2, 
          score: getPlayersScore()
        },
        {
          name: "kyle",
          id: 11, 
          score: getPlayersScore()
          },
        {
            name: "kyle",
            id: 11, 
            score: getPlayersScore()
        }
      ];
      return players;
};

const getPlayersScore = () => {
    return Math.round( (Math.random() * 1000));
};

const getPlayersId = (gameId) => {
  return Math.round( (Math.random() * 1000) );
};

module.exports = {
  getPlayers,
  getPlayersScore,
  getPlayersId,
};