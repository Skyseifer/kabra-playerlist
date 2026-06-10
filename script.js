const TAGS = {
    lspd: { name: "LSPD", color: "#1565C0" },
    sams: { name: "SAMS", color: "#FFD600" },
    staff: { name: "STAFF", color: "#FFB300" },
    la958: { name: "LA 958", color: "#FF69B4" },
    teku: { name: "TEKU", color: "#8E24AA" },
    losrana: { name: "LOS RANA", color: "#1B5E20" },
    rolling60: { name: "60TH ROLLING", color: "#42A5F5" },
    demc: { name: "D.E. MC", color: "#212121" },
    tsl: { name: "TSL", color: "#F5F5F5", textColor: "#000" }
};

let playerTags = JSON.parse(
    localStorage.getItem("kabra-tags") || "{}"
);
const playerCount = document.getElementById("playerCount");
const playersTable = document.getElementById("playersTable");
const searchInput = document.getElementById("searchInput");

let allPlayers = [];

async function loadPlayers() {
    try {

        const response = await fetch("/.netlify/functions/player");

        const players = await response.json();

        players.sort((a, b) => a.id - b.id);

        allPlayers = players;

        playerCount.textContent = players.length;

        renderPlayers(players);

    } catch (error) {

        console.error(error);

        playersTable.innerHTML = `
            <tr>
                <td colspan="4">
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
            <td colspan="4">
                No hay jugadores conectados
            </td>
        </tr>
        `;

        return;
    }

    playersTable.innerHTML = players.map(player => {

        const tags = playerTags[player.name] || [];

        const tagsHtml = tags.map(tag => {

            const info = TAGS[tag];

            return `
                <span
                    class="tag"
                    style="
                        background:${info.color};
                        color:${info.textColor || '#fff'};
                    "
                >
                    ${info.name}
                </span>
            `;

        }).join("");

return `
<tr>
    <td>${player.id}</td>
    <td>${player.name}</td>
    <td>${player.ping}</td>
    <td>TEST</td>
</tr>
`;

    }).join("");

}

function editTags(playerName) {

    const current =
        (playerTags[playerName] || []).join(",");

    const result = prompt(
        `Facciones para ${playerName}\n\n` +
        `Opciones:\n` +
        `lspd\nsams\nstaff\nla958\nteku\nlosrana\nrolling60\ndemc\ntsl\n\n` +
        `Separar con comas`,
        current
    );

    if (result === null) return;

    playerTags[playerName] = result
        .split(",")
        .map(x => x.trim())
        .filter(x => TAGS[x]);

    localStorage.setItem(
        "kabra-tags",
        JSON.stringify(playerTags)
    );

    loadPlayers();
}
searchInput.addEventListener("input", () => {

    const search = searchInput.value.toLowerCase();

    const filtered = allPlayers
        .filter(player =>
            player.name.toLowerCase().includes(search)
        )
        .sort((a, b) => a.id - b.id);

    renderPlayers(filtered);

});

loadPlayers();

setInterval(loadPlayers, 30000);
