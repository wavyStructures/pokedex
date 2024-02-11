let currentPokemon;
let pokemonData = [];
let pokemonMap = new Map();
let offset = 0;

async function init() {
    await loadPokemons();
    renderCards();
    createLetters();

}

//kleinVersion Objekt darin in results: Array mit URL und Name von 20 Stück 0: {name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}
async function loadPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;
    let response = await fetch(url);
    pokemonsAsJSON = await response.json();

    for (let i = 0; i < pokemonsAsJSON['results'].length; i++) {
        const singleUrl = pokemonsAsJSON['results'][i]['url'];
        await getAllDataSinglePokemon(singleUrl);
    }
}


async function getAllDataSinglePokemon(singleUrl) {
    let url = singleUrl;
    let response = await fetch(url);
    currentPokemon = await response.json();
    pokemonMap.set(currentPokemon.id, currentPokemon);
    pokemonData.push(currentPokemon);
}



function renderCards() {
    let allCardsContainer = document.getElementById('allCards');
    allCardsContainer.innerHTML = '';

    for (let i = 0; i < pokemonData.length; i++) {
        const currentPokemon = pokemonData[i];
        // Render each card
        allCardsContainer.innerHTML += generateCardHTML(currentPokemon);
        if (currentPokemon['types'].length > 1) {
            let type2Container = document.getElementById(`typeContainer2${currentPokemon['name']}`);
            type2Container.innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
            type2Container.classList.add('typeContainer');
            type2Container.style.backgroundColor = getDarkerTypeColor(currentPokemon['types'][0]['type']['name']);
        }
        colorCard(currentPokemon);
    }
}

function colorCard(currentPokemon) {
    let smallCard = document.getElementById(`smallCardSingle${currentPokemon['name']}`);
    let typeContainer = document.getElementById(`typeContainer${currentPokemon['name']}`)
    let type = currentPokemon['types'][0]['type']['name'];

    smallCard.style.backgroundColor = getTypeColor(type);
    typeContainer.style.backgroundColor = getDarkerTypeColor(type);
}


function generateCardHTML(currentPokemon) {
    return `<div id="smallCardSingle${currentPokemon['name']}" class="smallCardSingle" onclick="openSingleCard(${currentPokemon['id']})">
                <div class="smallLeft">
                    <h2>${currentPokemon['name']}</h2>
                    <div class="typeContainer" id="typeContainer${currentPokemon['name']}">${currentPokemon['types'][0]['type']['name']}</div>
                    <div id="typeContainer2${currentPokemon['name']}"></div>
                </div>
                <div class="smallRight">
                        <div class="svgContainer"><div class="cardNumber">#${currentPokemon['id']}</div><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 256 256"
                        enable-background="new 0 0 256 256" xml:space="preserve">
                        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
                        <g><g><path fill="lightblue"
                                    d="M128,10C62.9,10,10,62.9,10,128c0,65.1,52.9,118,118,118c65.1,0,118-52.9,118-118C246,62.8,193.1,10,128,10z M128,92.7c19.5,0,35.4,15.8,35.4,35.3s-15.8,35.4-35.4,35.4S92.6,147.5,92.6,128S108.5,92.7,128,92.7z M28,135.6h49.4c3.7,24.6,24.9,43.5,50.6,43.5c25.6,0,46.9-18.9,50.6-43.5H228c-3.9,51.8-47.2,92.7-100,92.7C75.2,228.3,31.9,187.4,28,135.6z" />
                        </g></g>
                    </svg></div>
                    <img src="${currentPokemon['sprites']['other']['home']['front_shiny']}" class="imageSmall">
                </div>
             </div>`;
}


function openSingleCard(pokemonId) {
    let pokemonClicked = pokemonMap.get(pokemonId);

    showSingleCard(pokemonClicked);
}


function getTypeColor(type) {
    return colors[type] || '#CCCCCC';
}

function getDarkerTypeColor(type) {
    let color = colors[type] || '#CCCCCC';            //wird aufgerufen mit Info z.B type 'fire'
    let darkerColor = shadeColor(color, -10);
    return darkerColor;
}


function createLetters() {
    let lettersContainer = document.getElementById('letters');
    let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    for (let l = 0; l < letters.length; l++) {
        const letter = letters[l];
        lettersContainer.innerHTML += `
    <button class="letter" onclick="filterPokemon('${letter}')">${letter}</button>
    `;
    }
}


async function loadMorePokemons() {
    offset += 20;
    await loadPokemons();
    renderCards();
}


function search() {
    let enteredSearch = document.getElementById('searchPokemon').value.toLowerCase();    //grabs the input-value
    showSearchedFor(enteredSearch);
}


function showSearchedFor(enteredSearch) {
    const searchResults = pokemonData.filter(pokemon => pokemon.name.toLowerCase().includes(enteredSearch));

    renderSearchResults(searchResults);
}


function renderSearchResults(searchResults) {
    let allCardsContainer = document.getElementById('allCards');
    allCardsContainer.innerHTML = '';


    searchResults.forEach(pokemon => {
        allCardsContainer.innerHTML += generateCardHTML(pokemon);
        colorCard(pokemon);
    });

}

function filterPokemon(letter) {
    let enteredLetter = letter;
    showSearchedFor(letter.toLowerCase());
}

//////////////////////////////////////// single card ////////////////////////////////////////
function showSingleCard(pokemonClicked) {
    const currentSinglePokemon = pokemonClicked;

    let mainPage = document.querySelector('.main-page');
    mainPage.classList.add('d-none');

    let singleCardPage = document.getElementById('singleCardPage');
    singleCardPage.classList.remove('d-none');
    singleCardPage.innerHTML = generateSingleCard(currentSinglePokemon);
}


function generateSingleCard(currentSinglePokemon) {
    console.log('inside generate SingleCard currentSinglePoki is: ', currentSinglePokemon);
    return `
    <div class="bigBox">
        <div id="pokedex">
            <h1 id="pokemonName">Name</h1>
            <div id="typeContainer"></div>

        </div>

        <div class="info-container">
            <div class="image-container">
                <img id="image" src="" alt="API_image">
            </div>

            <div class="details-header">
                <div onclick="showAbout()">About</div>
                <div onclick="showBaseStats()">Base Stats</div>
                <div onclick="showEvolution()">Evolution</div>
                <div onclick="showMoves()">Moves</div>
            </div>

            <div id="details-container">
                <div class="singleDetail" id="aboutPage" style="display: none;">
                    <table>
                        <tr>
                            <td>Species</td>
                            <td class="tdGeneratedInfo" id="species"></td>
                        </tr>
                        <tr>
                            <td>Height</td>
                            <td class="tdGeneratedInfo" id="height"></td>
                        </tr>
                        <tr>
                            <td>Weight</td>
                            <td class="tdGeneratedInfo" id="weight"></td>
                        </tr>
                        <tr>
                            <td>Abilities</td>
                            <td class="tdGeneratedInfo" id="abilities"></td>
                        </tr>
                    </table>
                </div>
                <div class="singleDetail" id="baseStatsPage"></div>
                <div>
                    <canvas id="myChart" style="width:100%;max-width:700px"></canvas>
                </div>

                <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
                <script>

                    const ctx = document.getElementById('myChart');
                    const barColors = ["red", "green", "blue", "orange", "brown"];

                    new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: ['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed', 'Total'],
                            datasets: [{
                                data: [5, 10, 15, 20, 25, 30, 35, 90],
                                borderWidth: 1,
                                backgroundColor: barColors,
                            }]
                        },
                        options: {
                            grid: {
                                display: false
                            },
                            indexAxis: 'y',
                            scales: {
                                y: {
                                    grid: {
                                        display: false
                                    },
                                    beginAtZero: true
                                },
                            }
                        }
                    }
                    );

                </script>

                <div class="singleDetail" id="evolutionPage" style="display: none;"></div>
                <div class="singleDetail" id="movesPage" style="display: none;"></div>

            </div>
        </div>
    </div>`;
}


// function sortCards() {

//     pokemonData.sort((a, b) => {
//         const idA = a.id;
//         const idB = b.id;

//         return idA - idB;
//     });

//     renderCards();
// }

