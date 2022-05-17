const input = document.getElementById('chat-text-input')
const send_button = document.getElementById('send-text-game')
const chat_logs_game = document.getElementById('chat-logs-game')
const chat_logs_lobby = document.getElementById('chat-logs-game')

socket.emit('ping');

socket.on('testEVENT', () => {
  console.log('emit worked from .www');
})

send_button.addEventListener("click", async function () {
  const message = (input.value);
  if (message != "") {
    const x = await getUserInput()
    let url = window.location.href
    if (url.includes('/game')) {
      url = 'game';
    } else if (url.includes('lobby')) {
      url = 'lobby';
    }
    socket.emit('chat-message', {
      message: message,
      sender: x.username,
      destination: url
    })
    input.value = "";
  }
});


async function getUserInput() {
  return await fetch('/userInfo').then((result) => {
    return result.json();
  }).catch(err => {
    console.log(err)
  })

}


socket.on('message_back', data => {
  const _li = document.createElement('li');
  _li.textContent = " - " + data.sender + "  : " + data.message;
  if (data.destination.includes("game")) {
    chat_logs_game.appendChild(_li);
  }
  if (data.destination.includes("lobby")) {
    chat_logs_lobby.appendChild(_li);
  }
})







