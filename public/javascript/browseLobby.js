console.log('new lobby .js  ***** ')
console.log(socket);

const lobby = document.getElementById('lobby');
//console.log(lobby)
const lobby_id = document.getElementById('lobby-id');
//console.log(lobby_id)
// const join_button = document.getElementsByClassName('join-lobby');
// var lobbyId;
document.querySelectorAll('.button-section').forEach(item => {
    item.addEventListener('click', async function() {
            console.log("CLICKED JOIN BUTTON! IN BROWSE LOBBY!")
    const x = (item.parentNode)
    /*const str = x.childNodes[1].textContent;
    for (i = 0; i < str.length; i++) {
        console.log(`|${str[i]}|`);
    }*/
   
    let lobbyId = String(x.childNodes[1].textContent).trim();
    /*console.log(lobbyId.charAt(0))
    console.log(lobbyId.charAt(lobbyId.length -1))
    lobbyId = lobbyId.charAt(lobbyId.length -1)*/
    
    console.log("LOBBY ID INSIDE BROWSE LOBBY IS") 
     console.log( lobbyId )

   window.location.href = `/lobby/${lobbyId}`, true;
   

    })
    })


 