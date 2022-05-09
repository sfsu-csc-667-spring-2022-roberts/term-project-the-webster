// const { range } = require("express/lib/request");

var submittedLetters = document.getElementById("game-board");
var tileForm = document.createElement("form");
tileForm.id = "tile-form";
var gameBoard = document.getElementById("game-board");
gameBoard.appendChild(tileForm);

submittedLetters.addEventListener('submit', (e) => {
    console.log(submittedLetters);
});

 window.onload = (event) => {
    
    for(i=0; i < 7; i++){
        let letterInput = document.createElement('input');
        letterInput.name = `letter-${i}`;
        letterInput.id = `letter-${i}`;
        letterInput.type = "text";
        letterInput.style.display = "none";
        let xInput = document.createElement('input');
        xInput.name = `x-${i}`;
        xInput.id  = `x-${i}`;
        xInput.type = "text";
        xInput.style.display = "none";
        let yInput = document.createElement('input');
        yInput.name = `y-${i}`;
        yInput.id = `y-${i}`;
        yInput.type = "text";
        yInput.style.display = "none";
        tileForm.appendChild(letterInput);
        tileForm.appendChild(xInput);
        tileForm.appendChild(yInput);
    }
  };

function allowDrop(allowDropEvent) {
    allowDropEvent.target.style.color = 'blue';
    allowDropEvent.preventDefault();
}

function drag(dragEvent) {
    let bang = dragEvent.dataTransfer.setData("text", dragEvent.target.innerHTML);
    dragEvent.target.style.color = 'green';
}

function drop(dropEvent) {
    dropEvent.preventDefault();
    var data = dropEvent.dataTransfer.getData("text");
    dropEvent.target.innerHTML = data;
    dropEvent.target.className += " played-square";
    let input = findNextFormInput();
    console.log("drop " + input.id );
    fillFormInput(input, dropEvent);
}

function findNextFormInput() {
    var inputList = tileForm.childNodes;
    var nextInput;
    for(let i = 0; i < inputList.length; i++){
        let item = inputList[i];
        if((item.id == `letter-${i/3}`) && (item.value == "") ){
            nextInput = document.getElementById(item.id);
            console.log("findNextFormInput  " + nextInput.id)
            break;  
        }
    }
    return nextInput;
}

function fillFormInput( nextInput, dropEvent ) { 
    var data = dropEvent.dataTransfer.getData("text");
    let placedLetter = String(data).match(/> \w </);
    console.log("fillFormInput " + nextInput.id);
    nextInput.value = placedLetter[0].slice(2,3);
    console.log("fillFormInput " + nextInput.value);
    squarePos = nextInput.id.match(/\d/);
    nextInput = document.getElementById("x-" + squarePos[0]);
    nextInput.value = dropEvent.target.dataset.x;
    console.log("fillFormInput " + nextInput.value);
    nextInput = document.getElementById("y-" + squarePos[0]);
    nextInput.value = dropEvent.target.dataset.y;
    console.log("fillFormInput " + nextInput.value);
}
   