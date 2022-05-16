
var userOrder;

let firstTurn = false;

socket.on("turn-update", gameTurn => {
  console.log("TURN-UPDATE SOCKET");
  console.log(gameTurn);
  console.log(gameTurn.newGameTurn);
})

socket.on("first-turn", () => {
  console.log("it is the first turn -- socket");
  firstTurn = true;
})

socket.on("not-first-turn", () => {
  console.log("it is NOT the first turn -- socket");
  firstTurn = false;
})



const selection = [];
const words = []; 
let word = [];

const slotTaken = (x, y) => {
 
  const found = words.find((entry) => entry.x === x && entry.y === y);
 
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
      console.log("WORDS IN RESPONSE!! ", word)
      console.log(word.length)
      console.log("------------------------------")
      console.log(word)
      console.log("------------------------------")
      word = []
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
      .catch(err => {
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

    console.log("x: " + x);
    console.log("y: " + y);
    console.log("firstTurn: " + firstTurn);

    if ((firstTurn == true) && (x != 7 || y != 7))   {
      alert("Tile must be placed in center");
      return;
    }
    if (slotTaken(x, y)) {
      alert("A tile has been placed in that slot.");
      return;
    }

    const selectedTile = selection.pop();
    selectedTile.classList.add("played-tile");

    selectedTile.classList.remove("selected-tile");

    let letterP = document.createElement("p");
    let valueP = document.createElement("p");

    letterP.innerText = selectedTile.children[0].innerText;
    valueP.innerText = selectedTile.children[1].innerText;

    event.target.appendChild(letterP);
    event.target.appendChild(valueP);
    event.target.classList.add("played-square");

    document.getElementById("tile-wrapper").removeChild(selectedTile);

    word.push({ ...selectedTile.dataset, x, y });
    words.push({ ...selectedTile.dataset, x, y });
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

const isYourTurn = (turnValue) =>{
  if(turnValue){
    let bagWrapper = document.querySelector(".bag-icon-wrapper");
    bagWrapper.ClassList.remove("bag-not-your-turn");
    bagWrapper.ClassList.add("bag-your-turn");
  }
}

const isNotYourTurn = (turnValue) =>{
  if(!turnValue){
   let  bagWrapper = document.querySelector(".bag-icon-wrapper");
    bagWrapper.ClassList.remove("bag-your-turn");
    bagWrapper.ClassList.add("bag-not-your-turn");
  }
}

const replenishHand = (data) =>{
 if (data.playerId){
  handData = data.playerHand;
  tileWrapper = document.getElementById("tile-wrapper");
  tilesInHand = tileWrapper.children;
  tilesInHandLength = tilesInHand.length;
  let needsTile = []; 
  for(i=0; i < handData.length; i++){
    let found = false;
    for(j = 0; j < tilesInHandLength; j++) {
      if(handData[i].tileId == tilesInHand[j].dataset.id){
        found = true;
      }
    }
    if (found == false) {
      needsTile.push(handData[i]);
    }
  }
  console.log("needsTile", needsTile);
  for(i=0; i < needsTile.length; i++){
        let tileDiv = document.createElement("div");
        tileDiv.dataset.id = needsTile[i].tileId;
        tileDiv.dataset.letter = needsTile[i].letter;
        tileDiv.dataset.value = needsTile[i].value;
        tileDiv.classList.add("tile");
        let letterP = document.createElement("p");
        letterP.innerText = needsTile[i].letter;
        letterP.classList.add("tile-letter");
        tileDiv.appendChild(letterP);
        let valueP = document.createElement("p");
        valueP.innerText = needsTile[i].value;
        valueP.classList.add("tile-value");
        tileDiv.appendChild(valueP);
        tileWrapper.appendChild(tileDiv);
    }
  }
}
 
const fillBoardFromDB = (gameState) =>  { 
  let allSquares = document.getElementById("game-board").children;
  for(i = 0; i < gameState.length; i++ ) {
    for(j = 0; j < allSquares.length; j++) {
      if( (gameState[i].x_coordinate == allSquares[j].dataset.x ) &&
          (gameState[i].y_coordinate == allSquares[j].dataset.y )){ 
            let letterP = document.createElement("p");
            allSquares[j].classList.add("played-square");
            letterP.innerText = gameState[i].letter;
            allSquares[j].appendChild(letterP);
          } 
    }
  }
}



socket.on("valid-word", async data => {
  fillBoardFromDB(data.tileDataForHTML);
  console.log("FRONT END SOCKET", data.playerHand);
  replenishHand(data);
  alert("VALID WORD PLAYED :)");
  return await fetch(`${window.location.pathname}/nextTurn`, {
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
})


