//Using getElementById so that it is supported on all browsers without an additional library 
// let gameGridElements = Array();
// let gameGrid = document.getElementById("game-board");
// for (let x = 0; x < 14; x++){
//     for (let y = 0;  y < 14; y++){
//         gameGridElements.push(document.getElementById(`square(${x},${y})`));
//     }
// }
// gameGridElements.foreach(addEventListener(allowDrop));
// gameGridElements.foreach(addEventListener(drop));

function allowDrop(allowDropEvent) {
    allowDropEvent.target.style.color = 'blue';
    allowDropEvent.preventDefault();
}

function drag(dragEvent) {
    
    let bang = dragEvent.dataTransfer.setData("text", dragEvent.target.innerHTML);
    console.log("drag event : " +  bang);
    dragEvent.target.style.color = 'green';
}

function drop(dropEvent) {
    dropEvent.preventDefault();
    var data = dropEvent.dataTransfer.getData("text");
    console.log("drop event : " + data);
    dropEvent.target.className += " played-square";
    dropEvent.target.innerHTML = data;
    // dropEvent.dataTransfer.dropEvent = "move";
    // dropEvent.dataTransfer.setData("html",document.getElementById(data));
    // document.getElementById("drag").style.color = 'black';
}