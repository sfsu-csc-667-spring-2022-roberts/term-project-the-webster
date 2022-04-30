const express = require("express");

const router = express.Router();
const Game = require("../db/game");

router.get("/create", (request, response) => {
  const currentUser = 1; // don't hard code this, get from params
  console.log("jrob Games");
  Game.createGame(currentUser)
    .then(({ gameId }) => {
        console.log(gameId);
      response.redirect(`/game/${gameId}`);
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/lobby");
    });
});

router.get("/:id", (request, response) => {
  Game.getEmptyGrid()
    .then((cells) => {
      response.render("games", {style: "gameStyle", grid: cells });
    })
    .catch((error) => {
      console.log(">", error);
      response.json({ error });
    });
});

router.get("/:id/join", (request, response) => {
  const { id: gameId } = request.params;
  const userId = 1; // This should be based on the current logged in user

  Game.joinGame(gameId, userId)
    .then(({ gameId }) => {
      response.redirect(`/game/${gameId}`);
      // Broadcast to game socket that a user has joind the game
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/lobby");
    });
});

module.exports = router;