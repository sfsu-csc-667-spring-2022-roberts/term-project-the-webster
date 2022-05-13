
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

// io.on("game-updated", (payload) => {
//   Update all the various game board divs, update player's tile rack,
//   provide some visual indication of current player
// });


const selection = [];
const word = [];

const slotTaken = (x, y) => {
  //easiest way ensure valid turns is to use this 
  //with the socket data of what is being used already 
  //then only allow for letters placed next to a placed letter
  const found = word.find((entry) => entry.x === x && entry.y === y);
  return found !== undefined;
};

const submitWord = async () => {
  if (word.length === 0) {
    alert("You must enter a word.");
    return;
  }
   console.log(`${window.location.pathname}/playWord`)

  return await fetch(`${window.location.pathname}/playWord`, {
    body: JSON.stringify(word),
    method: "post",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  })
    .then((response) => {

      console.log("returned response = ")
      return response.json()

    })  
    .catch((error) => {
      console.log(error);
      Promise.reject(error)
    });
};

document
  .getElementById("play-word-button")
  .addEventListener("click", (event) => {

   submitWord().then(result => {
     console.log("before RESULT")
     console.log(result)
     console.log("after RESULT")
   
    })
   .catch(err =>{
     console.log(err)
   });
    


  });

document.getElementById("game-board").addEventListener("click", (event) => {
  console.log("CLIIIIIIIIIIIIIIICK game board ");
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
    event.target.classList.add("played-square");
    //we need to create a new set of divs that have the 
    //letter and the value and then append them without 
    //removing a child of the tilerack(selectedTile)
    // to keep jrobs code working code 

    document.getElementById("tile-wrapper").removeChild(selectedTile);

    word.push({ ...selectedTile.dataset, x, y });
  }
  console.log({ word, selection });
});

document
  .getElementById("tile-wrapper")
  .addEventListener("click", ({ target }) => {
    console.log("CLIIIIIIIIIIIIIIICK tile rack ");
    const element = target.tagName === "P" ? target.parentElement : target;

    if (Array.from(element.classList).includes("selected-tile")) {
      element.classList.remove("selected-tile");
      //I think this is to un-select a tile and right now it
      //triggers Alert(place your tile before selecting a new tile)
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
