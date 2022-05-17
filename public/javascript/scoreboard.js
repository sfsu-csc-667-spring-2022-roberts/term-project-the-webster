const scoreboard_ele = document.getElementById('scoreboard')
const f = async () => {
  const _x = await getUserInput()
  if (_x != undefined) {
    const x = document.createElement('div');
    x.textContent = _x.username
    x.className = "player-name"
    scoreboard_ele.appendChild(x)
  }
}
f()
async function getUserInput() {
  return await fetch('/userInfo').then((result) => {
    return result.json()
  }).catch(err => {
    console.log(err)
  })
}