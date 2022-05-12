
console.log(socket);
console.log('FRONT END SOCK ^^ ')

/*socket.on('test-event1', async () => {
  console.log(` id is ${socket.id}`)
  
  socket.emit('hey')

})*/



// io.on("game-updated", (payload) => {
//   // Update all the various game board divs, update player's tile rack,
//   // provide some visual indication of current player

// });

// const game = require("../../db/game")

// const createGame = (currentUser) => {
//   game.createGame(currentUser)
//   .then((game_id) => {
//     return game_id;
//   })
// }

const selection = [];
const word = [];

const slotTaken = (x, y) => {
  const found = word.find((entry) => entry.x === x && entry.y === y);

  return found !== undefined;
};

const submitWord = () => {
  if (word.length === 0) {
    alert("You must enter a word.");
    return;
  }
   
  fetch(`${window.location.pathname}/playWord`, {
    body: JSON.stringify({ word }),
    method: "post",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log({ data });
    })
    .catch((error) => {
      console.log(error);
    });
};

document
  .getElementById("play-word-button")
  .addEventListener("click", (event) => {
    submitWord();
  });

document.getElementById("game-board").addEventListener("click", (event) => {
  if (
    Array.from(event.target.classList).includes("game-board-tile") &&
    selection.length === 1
  ) {
    const { x, y } = event.target.dataset;
    // Record letters stored at this coordinate
    if (slotTaken(x, y)) {
      alert("A tile has been placed in that slot.");
      return;
    }

    const selectedTile = selection.pop();
    selectedTile.classList.add("played-tile");
    selectedTile.classList.remove("selected-tile");

    document.getElementById("tile-wrapper").removeChild(selectedTile);

    word.push({ ...selectedTile.dataset, x, y });
  }
  console.log({ word, selection });
});

document
  .getElementById("tile-wrapper")
  .addEventListener("click", ({ target }) => {
    const element = target.tagName === "P" ? target.parentElement : target;

    if (Array.from(element.classList).includes("selected-tile")) {
      element.classList.remove("selected-tile");
    } else if (Array.from(element.classList).includes("played-tile")) {
      alert("This tile has been used already.");
      return;
    }

    if (Array.from(element.classList).includes("tile")) {
      if (selection.length === 1) {
        alert("Place your tile before selecting a new tile.");
      } else {
        selection.push(element);
      }
    }
  });
