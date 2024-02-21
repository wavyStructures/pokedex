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
        let type = currentPokemon['types'][0]['type']['name'];

        allCardsContainer.innerHTML += generateCardHTML(currentPokemon, type);
        if (currentPokemon['types'].length > 1) {
            let type2Container = document.getElementById(`typeContainer2${currentPokemon['name']}`);
            type2Container.innerHTML = `${currentPokemon['types'][1]['type']['name']}`;
            type2Container.classList.add('typeContainer');
            type2Container.style.backgroundColor = getDarkerTypeColor(currentPokemon['types'][0]['type']['name']);
        }
        let smallCard = document.getElementById(`smallCardSingle${currentPokemon['name']}`);
        let typeContainer = document.getElementById(`typeContainer${currentPokemon['name']}`)
        
        colorElement(smallCard, type);
        colorTypeBoxes(typeContainer, type);
    }
}

function colorElement(cardElement, type) {
        cardElement.style.backgroundColor = getTypeColor(type);
    }


function colorTypeBoxes(typeContainer, type){
        typeContainer.style.backgroundColor = getDarkerTypeColor(type);
    }

function generateCardHTML(currentPokemon, type) {
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
                        <g><g><path fill="getDarkerTypeColor(type);" fill-opacity="0.2";
                            d="M128,10C62.9,10,10,62.9,10,128c0,65.1,52.9,118,118,118c65.1,0,118-52.9,118-118C246,62.8,193.1,10,128,10z M128,92.7c19.5,0,35.4,15.8,35.4,35.3s-15.8,35.4-35.4,35.4S92.6,147.5,92.6,128S108.5,92.7,128,92.7z M28,135.6h49.4c3.7,24.6,24.9,43.5,50.6,43.5c25.6,0,46.9-18.9,50.6-43.5H228c-3.9,51.8-47.2,92.7-100,92.7C75.2,228.3,31.9,187.4,28,135.6z" />
                        </g></g>
                    </svg></div>
                    <img src="${currentPokemon['sprites']['other']['home']['front_shiny']}" class="imageSmall">
                </div>
             </div>`;
}


function getTypeColor(type) {
    return colors[type] || '#CCCCCC';
}

function getDarkerTypeColor(type) {
    let color = colors[type] || '#CCCCCC';
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
    let enteredSearch = document.getElementById('searchPokemon').value.toLowerCase();
    showSearchedFor(enteredSearch);
}


function showSearchedFor(enteredSearch) {
    const searchResults = pokemonData.filter(pokemon => pokemon.name.toLowerCase().startsWith(enteredSearch));
   renderSearchResults(searchResults);
}


function renderSearchResults(searchResults) {
    let allCardsContainer = document.getElementById('allCards');
    allCardsContainer.innerHTML = '';


    searchResults.forEach(pokemon => {
        allCardsContainer.innerHTML += generateCardHTML(pokemon);

        let smallCard = document.getElementById(`smallCardSingle${pokemon['name']}`);
        let typeContainer = document.getElementById(`typeContainer${pokemon['name']}`)
        let type = pokemon['types'][0]['type']['name'];
        colorElement(smallCard, type);
        colorTypeBoxes(typeContainer, type);
    });

}

function filterPokemon(letter) {
    let enteredLetter = letter;
    showSearchedFor(letter.toLowerCase());
}

//////////////////////////////////////// single card ////////////////////////////////////////

function openSingleCard(pokemonId) {                                                                                    //Klick auf Karte soll Einzelkarte öffnen
    const currentSinglePokemon = pokemonMap.get(pokemonId);                                             //dafür erstmal per ID Poki raussuchen

    let mainPage = document.querySelector('.main-page');
    mainPage.classList.add('d-none');                                                               //mainPage ausblenden
    let singleCardPage = document.getElementById('singleCardPage');
    singleCardPage.classList.remove('d-none');  
                                                                   //singlePage einblenden
    singleCardPage.innerHTML = generateSingleCard(currentSinglePokemon);
    styleSingleCard(currentSinglePokemon);
    }

function closeSingleCard(event) {
        if (event.target.id === 'bigBox') {                                         //onclick-event-Ziel mit DOM id bigBox, aber nicht die children, deswegen Klick auf Karte effektlos
         document.getElementById('singleCardPage').classList.add('d-none');
         document.querySelector('.main-page').classList.remove('d-none');
     }
}


function generateSingleCard(currentSinglePokemon) {
const type2 = currentSinglePokemon['types'][1]? currentSinglePokemon['types'][1]['type']['name'] : '';

    return `
    <div class="bigBox" id="bigBox" onclick="closeSingleCard(event)">
    <div class="pokedexAndInfoContainer" id="pokedexAndInfoContainer">
        <div id="pokedex">
            <h2 id="pokemonNameSingle">${currentSinglePokemon['name']}</h2>
            <div id="typeContainerSingle">${currentSinglePokemon['types'][0]['type']['name']}</div>
            ${  type2 ? `<div id="typeContainer2Single${currentSinglePokemon['name']}">${type2}</div>` : ''  }
            

        </div>

        <div class="info-container" id="info-container">
            <div class="image-container">
                <img id="image" src="${currentSinglePokemon['sprites']['other']['home']['front_shiny']}" alt="API_image">
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
        </div>
    </div>`;
}

function styleSingleCard(currentSinglePokemon){
    let bigCardUpperHalf = document.getElementById('pokedex');
    colorElement(bigCardUpperHalf, currentSinglePokemon['types'][0]['type']['name']);

    typeContainerSingle.classList.add('typeContainer');
    typeContainerSingle.style.backgroundColor = getDarkerTypeColor(currentSinglePokemon['types'][0]['type']['name']);

    if (currentSinglePokemon['types'].length > 1) {
        let type2ContainerSingle = document.getElementById(`typeContainer2Single${currentSinglePokemon['name']}`);
        type2ContainerSingle.classList.add('typeContainer');
        type2ContainerSingle.style.backgroundColor = getDarkerTypeColor(currentSinglePokemon['types'][0]['type']['name']);
    }

}

function colorElement(cardElement, type) {
    cardElement.style.backgroundColor = getTypeColor(type);
}


function colorTypeBoxes(typeContainer, type){
    typeContainer.style.backgroundColor = getDarkerTypeColor(type);
}



// document.addEventListener('DOMContentLoaded', function () {
//     renderPokemonInfo();
// });

// function renderPokemonInfo() {
//     document.getElementById('pokemonNameSingle').innerHTML = currentPokemon['name'];

//     let type = currentPokemon['types'][0]['type']['name'];
//     document.getElementById('typeContainer').innerHTML = type;

//     let imageContainer = document.getElementById('image');
//     let image = currentPokemon['sprites']['front_shiny'];
//     imageContainer.src = `${image}`;

//     let speciesBox = document.getElementById('species');
//     speciesBox.innerHTML = generateSpecies();

//     let heightBox = document.getElementById('height');
//     heightBox.innerHTML = generateHeight();

//     let weightBox = document.getElementById('weight');
//     weightBox.innerHTML = generateWeight();

//     let abilitiesBox = document.getElementById('abilities');
//     abilitiesBox.innerHTML = generateAbilities();
// }

// function generateSpecies() {
//     return `
//     <p>Hello ${currentPokemon['types'][0]['type']['name']}</p
//            `;
// }

// function generateHeight() {
//     return `
//     <p>${currentPokemon['height']}</p
       
//     `;
// }

// function generateWeight() {
//     const weightInKg = currentPokemon['weight'] / 10;
//     return `
//     <p>${weightInKg.toFixed(1)} kg</p>
//     `;
// }

// function generateAbilities() {
//     let abilities = currentPokemon['abilities'];
//     let result = '';

//     for (let i = 0; i < abilities.length; i++) {
//         const ability = abilities[i]['ability']['name'];
//         result += `<p>${ability}</p>`;
//     }

//     return result

// }

// function sortCards() {

//     pokemonData.sort((a, b) => {
//         const idA = a.id;
//         const idB = b.id;

//         return idA - idB;
//     });

//     renderCards();
// }


