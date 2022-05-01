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
    return Math.random(0, 500);
};


module.exports = {
  getPlayers,
  
};