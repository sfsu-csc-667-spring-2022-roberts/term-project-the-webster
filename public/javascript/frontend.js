// const { range } = require("express/lib/request");

var submittedLetters = document.getElementById("game-board");
var tileForm = document.createElement("form");
tileForm.id = "tile-form";

submittedLetters.addEventListener('submit', (e) => {
    console.log(submittedLetters);
});
// window.addEventListener('onload',
 window.onload = (event) => {
    
    for(i=0; i < 7; i++){
        let letterInput = document.createElement('input');
        letterInput.name = `letter-${i}`;
        letterInput.id = `letter-${i}`;
        letterInput.type = "text";
        //letterInput.style.visibility = "hidden";
        let xInput = document.createElement('input');
        xInput.name = `x-${i}`;
        xInput.id  = `x-${i}`;
        xInput.type = "text";
        //xInput.style.visibility = "hidden";
        let yInput = document.createElement('input');
        yInput.name = `y-${i}`;
        yInput.id = `y-${i}`;
        yInput.type = "text";
        //yInput.style.visibility = "hidden";
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
    let justLetter = String(data).match(/> \w </);
    let nextInput = findNextFormInput();
    console.log(nextInput);
    if(nextInput != "just A string") {
        nextInput.value = justLetter[0].slice(1,3)
        dropEvent.target.className += " played-square";
        dropEvent.target.innerHTML = data;
    }

    // dropEvent.dataTransfer.dropEvent = "move";
    // dropEvent.dataTransfer.setData("html",document.getElementById(data));
    // document.getElementById("drag").style.color = 'black';
}

function findNextFormInput() {
    var inputList = tileForm.childNodes;
    console.log(tileForm);
    console.log(inputList);
    var nextInput;
    for(let i = 0; i < inputList.length; i++){
        let item = inputList[i];
        if( (item.id == `x-${i}`) || (item.id == `y-${i}`) ){
            continue;
        }
        console.log(item.id);
        if(String(item.value) === "" ){
            nextInput = document.querySelectorAll('*');
            // nextInput = document.getElementById("letter-0");
            console.log("inside the if statement " + String(nextInput));
            //break;  
        }
    }
    
    console.log("in function " + nextInput);
    if(nextInput != null){
        return nextInput;
    }
    return "just A string";
}
   