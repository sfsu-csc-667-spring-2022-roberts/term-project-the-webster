const lobby = document.getElementById('lobby');
const lobby_id = document.getElementById('lobby-id');
document.querySelectorAll('.button-section').forEach(item => {
    item.addEventListener('click', async function () {
        const x = (item.parentNode);
        let lobbyId = String(x.childNodes[1].textContent).trim();
        window.location.href = `/lobby/${lobbyId}`, true;
    })
})