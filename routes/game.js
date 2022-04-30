const express = require("express");

const router = express.Router();
const Game = require("../db/game");

router.get("/create", async (request, response) => {
  const currentUser = 1; // don't hard code this, get from params

  Game.createGame(currentUser)
    .then(({game_id} ) => {
      console.log("gameId:" + game_id);
      response.redirect(`/game/${game_id}`);
    })
    .catch((error) => {
      console.log(error);
      response.redirect("/lobby");
    });
});

router.get("/:id", (request, response) => {
  Game.getEmptyGrid()
    .then((cells) => {
      response.render("games", { cells });
    })
    .catch((error) => {
      console.log(">", error);
      response.json({ error });
    });
});

router.get("/:id/join", (request, response) => {
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
