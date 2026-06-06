const playerCount = document.getElementById("playerCount");
const playersTable = document.getElementById("playersTable");
const searchInput = document.getElementById("searchInput");

let allPlayers = [];

async function loadPlayers() {
    try {

        const response = await fetch("/.netlify/functions/players");

        const players = await response.json();

        allPlayers = players;

        playerCount.textContent = players.length;

        renderPlayers(players);

    } catch (error) {

        console.error(error);

        playersTable.innerHTML = `
            <tr>
                <td colspan="3">
                    Error al cargar los jugadores
                </td>
            </tr>
        `;
    }
}

function renderPlayers(players) {

    if (players.length === 0) {

        playersTable.innerHTML = `
            <tr>
                <td colspan="3">
                    No hay jugadores conectados
                </td>
            </tr>
        `;

        return;
    }

    playersTable.innerHTML = players.map(player => `
        <tr>
            <td>${player.id}</td>
            <td>${player.name}</td>
            <td>${player.ping}</td>
        </tr>
    `).join("");
}

searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = allPlayers.filter(player =>
        player.name.toLowerCase().includes(search)
    );

    renderPlayers(filtered);

});

loadPlayers();

setInterval(loadPlayers, 10000);