let currentPokemon;
let pokemonsAsJSON;
let pokemonData = [];
let pokemonMap = new Map();
let offset = 0;
let currentBigPokemon;
let bigCardJSONforDetails;

let evolutionJSON;
let statsJSONarray;


async function init() {
    await loadPokemons();
    await openBigCard(1);
}


// Call the initialization function after the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    init();
});


//kleinVersion Objekt darin in results: Array mit URL und Name von 20 Stück 0: {name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/'}
async function loadPokemons() {
    let url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`;
    let response = await fetch(url);
    pokemonsAsJSON = await response.json();

    console.log('das ist das pokemonAsJSON', pokemonsAsJSON);

    for (let i = 0; i < pokemonsAsJSON['results'].length; i++) {
        const singleUrl = pokemonsAsJSON['results'][i]['url'];
        await getAllDataSinglePokemon(singleUrl);
    }
    console.log('map is: ', pokemonMap);
    console.log('pokemonData is:', pokemonData);

    return pokemonsAsJSON;
}

async function getAllDataSinglePokemon(singleUrl) {
    let url = singleUrl;
    let response = await fetch(url);

    currentPokemon = await response.json();
    pokemonMap.set(currentPokemon.id, currentPokemon);
    pokemonData.push(currentPokemon);
}


function colorElement(cardElement, type) {
    cardElement.style.backgroundColor = getTypeColor(type);
}


function colorTypeBoxes(typeContainer, type) {
    typeContainer.style.backgroundColor = getDarkerTypeColor(type);
}

function getTypeColor(type) {
    return colors[type] || '#CCCCCC';
}

function getDarkerTypeColor(type) {
    let color = colors[type] || '#CCCCCC';
    let darkerColor = shadeColor(color, -10);
    return darkerColor;
}


//////////////////////////////////////// single card ////////////////////////////////////////

async function openBigCard(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;    //z.B. https://pokeapi.co/api/v2/pokemon-species/1/  für bulba
    let response = await fetch(url);
    bigCardJSONforDetails = await response.json();

    currentBigPokemon = pokemonMap.get(pokemonId);                      //dafür erstmal per ID Poki raussuchen

    console.log('currentBig is: ', currentBigPokemon);

    let mainPage = document.querySelector('.main-page');
    mainPage.classList.add('d-none');                                                               //mainPage ausblenden
    let BigCardPage = document.getElementById('bigCardPage');
    BigCardPage.classList.remove('d-none');
    BigCardPage.innerHTML = generateBigCard(currentBigPokemon);
    styleBigCard(currentBigPokemon, pokemonId);
    getEvolutionUrl(currentBigPokemon);
}


function closeBigCard(event) {
    if (event.target.id === 'bigBox') {         //onclick-event-Ziel mit DOM id bigBox, aber nicht die children, deswegen Klick auf Karte effektlos
        document.getElementById('bigCardPage').classList.add('d-none');
        document.querySelector('.main-page').classList.remove('d-none');
    }
}


generateBigCard(currentBigPokemon);

function generateBigCard(currentBigPokemon) {
    const type1 = currentBigPokemon['types'][0]['type']['name'];
    const type2 = currentBigPokemon['types'][1] ? currentBigPokemon['types'][1]['type']['name'] : '';
    // const darkerTypeColor = getDarkerTypeColor(type1);

    console.log('stats is: ', currentBigPokemon['stats']);


    return `
    <div class="bigBox" id="bigBox" onclick="closeBigCard(event)">
    <div class="all">
        <div><img src="./img/left-arrow.png" onclick="showPreviousBig(currentBigPokemon)" class="nextPrevArrows"></div>
        <div class="pokedexAndInfoContainer" id="pokedexAndInfoContainer">
            <div id="pokedex">
                <h2 id="pokemonNameSingle">${currentBigPokemon['name']}</h2>
                <div id="typeContainerSingle">${type1}</div>
                ${type2 ? `<div id="typeContainer2Single${currentBigPokemon['name']}">${type2}</div>` : ''}
            </div>

            <div class="info-container" id="info-container">
                <div class="image-container">
                    <img id="image" src="${currentBigPokemon['sprites']['other']['home']['front_shiny']}"
                        alt="API_image">
                </div>

                <div class="details-header">
                    <div class="tab" onclick="showTab('aboutPage')">About</div>
                    <div class="tab" onclick="showTab('baseStatsPage')">Base Stats</div>
                    <div class="tab" onclick="showTab('evolutionPage')">Evolution</div>
                    <div class="tab" onclick="showTab('movesPage')">Moves</div>
                </div>

                <div id="details-container">
                    
                    <div class="singleDetail" id="aboutPage">
                        <table>
                            <tr>
                                <td>Height</td>
                                <td class="tdGeneratedInfo" id="height">24</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td class="tdGeneratedInfo" id="weight">23</td>
                            </tr>
                            <tr>
                                <td>Abilities</td>
                                <td class="tdGeneratedInfo" id="abilities">12

                                </td>
                            </tr>
                        </table>

                        <h4>${currentBigPokemon['name']}</h4>
                        <p class="flavorTexts">${bigCardJSONforDetails['flavor_text_entries'][2]['flavor_text']}</p>
                        </p>
                    </div>


                    <div class="singleDetail d-none-tabs" id="baseStatsPage">
                        <div>
                        <canvas id="myCanvas" width="300" height="200"></canvas>
                        </div>
                    </div>
                    
                    <div class="singleDetail d-none-tabs" id="evolutionPage">
                       
                            <div class="evolutionLine1 flex" id="evolutionLine1">
                                <div class="evolutionCircle" id="evolutionCircle1"> <img src="${currentBigPokemon['sprites']['other']['home']['front_shiny']}"
                                class="imageEvolution">
                                <p id="evolutionName1">${currentBigPokemon['name']}</p>
                                </div>
                                <div class="evolutionArrows">
                                <img src="./img/arrow-right.png" alt="arrow right">
                                </div>
                                
                                <div class="evolutionCircle" id="evolutionCircle2"><img src=""
                                class="imageEvolution">
                                <p id="evolutionName2"></p> 
                                </div>
                            </div>

                            <div class="evolutionLine2 flex" id="evolutionLine2">
                                <div class="evolutionCircle" id="evolutionCircle2Line2"><img src="" class="imageEvolution">
                                    <p id="evolutionName2_2"></p>
                                </div>
                                <div class="evolutionArrows"><img src="./img/arrow-right.png" alt="arrow right"></div>
                                <div class="evolutionCircle" id="evolutionCircle3"><img src="" class="imageEvolution">
                                    <p id="evolutionName3"></p>
                                </div>
                            </div>
                    </div>

                    <div class="singleDetail d-none-tabs" id="movesPage">
                        <p>moves</p>
                    </div>

                    
                </div>
            </div>
        </div>
        <div><img src="./img/right-arrow.png" onclick="showNextBig(currentBigPokemon)" class="nextPrevArrows"></div>
    </div>`;
}


let flavorTexts = document.querySelectorAll('p .flavorTexts');
for (let p = 0; p < flavorTexts.length; p++) {
    let text = flavorTexts[i].text.Content;
    let newText = text.replace('U+000c', '');
    flavorTexts[i].textContent = newText;
}


getBaseStats(currentBigPokemon);



getEvolutionUrl(currentBigPokemon);


function showNextBig(currentBigPokemon) {
    let nextBigPokemonID;
    if (currentBigPokemon['id'] === (pokemonData.length - 1)) {
        nextBigPokemonID = 1;
    } else {
        nextBigPokemonID = currentBigPokemon['id'] + 1;
    }
    openBigCard(nextBigPokemonID);
}


function showPreviousBig(currentBigPokemon) {
    let nextBigPokemonID;
    if (currentBigPokemon['id'] === 1) {
        nextBigPokemonID = (pokemonData.length - 1);
    } else {
        nextBigPokemonID = currentBigPokemon['id'] - 1;
    }
    openBigCard(nextBigPokemonID);
}


///////////////////////////////////////////// About Page /////////////////////////////////////////////

// function calculateDetails(currentBigPokemon){
//     let calculatedHeight = calculateHeight(currentBigPokemon);
//     let calculatedWeight = calculateWeight(currentBigPokemon);

//     // showAbilities(currentBigPokemon);
//     insertDetails(calculatedHeight, calculatedWeight);
// }



// function calculateWeight(currentBigPokemon){
//     return `${currentBigPokemon['weight']}/10`;
// }


// function calculateHeight(currentBigPokemon){
//     return `${currentBigPokemon['height']}`;
// }

//  function insertDetails(calculatedHeight, calculatedWeight){
//     const heightElement = document.getElementById('height');
//     if (heightElement){heightElement.innerText = 'is' + calculatedHeight;}
//     const weightElement = document.getElementById('weight');
//     if (weightElement) weightElement.innerText = calculatedWeight;
// }

//USAGE
// calculateDetails(currentBigPokemon); 
///////////////////////////////////////////// Base Stats /////////////////////////////////////////////

function initChart() {
    const canvas = document.getElementById('myCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        const labels = ['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed', 'Total'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'Base Stats',
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 205, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(201, 203, 207, 1)'
                ],
                borderWidth: 1
            }]
        };
        const config = {
            type: 'bar',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
        new Chart(ctx, config);


    } else {
        console.error("Canvas element not found");
    }
}

// Call the initChart function after the DOM content is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM content loaded");
    // Call initChart here or wherever appropriate
    initChart();
});


// const ctx = document.getElementById('myChart');
// const labels = ['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed', 'Total'];
// const CONFIG_BG_color = [
//   'rgba(255, 99, 132, 0.2)',
//   'rgba(255, 159, 64, 0.2)',
//   'rgba(255, 205, 86, 0.2)',
//   'rgba(75, 192, 192, 0.2)',
//   'rgba(54, 162, 235, 0.2)',
//   'rgba(153, 102, 255, 0.2)',
//   'rgba(201, 203, 207, 0.2)'
// ];
// const CONFIG_BORDER_color = [
//   'rgb(255, 99, 132)',
//   'rgb(255, 159, 64)',
//   'rgb(255, 205, 86)',
//   'rgb(75, 192, 192)',
//   'rgb(54, 162, 235)',
//   'rgb(153, 102, 255)',
//   'rgb(201, 203, 207)'
// ];

// const data = {
//   labels: labels,
//   datasets: [{
//     axis: 'y',
//     label: 'My First Dataset',
//     data: [65, 59, 80, 81, 56, 55, 40],
//     fill: false,
//     backgroundColor: CONFIG_BG_color,
//     borderColor: CONFIG_BORDER_color,
//     borderWidth: 1
//   }]
// };

// const config = {
//   type: 'bar',
//   data: data,
//   options: {
//     grid: {
//       display: false
//     },
//     indexAxis: 'y',
//     scales: {
//       y: {
//         grid: {
//           display: false
//         },
//         beginAtZero: true
//       },
//     }
//   }
// };

// new Chart(ctx, config);





// function getBaseStats(currentBigPokemon){

//  statsJSONarray = currentBigPokemon['stats'];
// let baseStats = [];

// if (Array.isArray(statsJSONarray)) {
//     for (let s = 0; s < statsJSONarray.length; s++) {
//         let singleStatFromArray = statsJSONarray[s];
//         baseStats.push(singleStatFromArray);
//         console.log('baseStats gepushte sind: ', baseStats);
//     }
// } else {
//     console.error("Stats data is not an array.");
// }



// alert(Array.isArray(statsJSONarray));
// }





///////////////////////////////////////////// Evolution /////////////////////////////////////////////
async function getEvolutionUrl(currentBigPokemon) {              //
    let url = currentBigPokemon['species']['url'];      //vom aktuellen Pokemon, die URL, die unter species liegt, z.B. 
    let response = await fetch(url);                    // wird z.B. abgeholt: 
    let urlEvolutionJSON = await response.json();

    let urlEvolution = urlEvolutionJSON['evolution_chain']['url'];
    // console.log('urlEvolution is: ', urlEvolution);
    // console.log('die vorherige URL für evolution is: ', url);

    await getEvolutionDetails(urlEvolution);
}


async function getEvolutionDetails(urlEvolution) {
    let response = await fetch(urlEvolution);                   //evolution_chain   >   url, z.B. https://pokeapi.co/api/v2/evolution-chain/2/ für die charmander family
    evolutionJSON = await response.json();                      //das als kompletti evolutionJSON

    console.log('evolutionJSON is: ', evolutionJSON);

    showEvolutionDetails(evolutionJSON);

    return evolutionJSON;
}


function showEvolutionDetails(evolutionJSON) {
    const chainNumber = getChainNumberFromURL(evolutionJSON.url);
    writeNames(evolutionJSON, chainNumber);
    fillImages(chainNumber);
}

function getChainNumberFromURL(url) {
    // Extract chain number from URL
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
}

function writeNames(evolutionJSON, chainNumber) {
    // Write names based on chain number
    switch (chainNumber) {
        case 1:
            document.getElementById('evolutionName2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
            document.getElementById('evolutionName2_2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
            document.getElementById('evolutionName3').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']}`;
            break;
        // Add more cases for other chain numbers if needed
    }
}

function fillImages(chainNumber) {
    // Fill images based on chain number
    let imgElement2 = document.querySelector("#evolutionCircle2 .imageEvolution");
    let imgElement2_2 = document.querySelector("#evolutionCircle2Line2 .imageEvolution");
    let imgElement3 = document.querySelector("#evolutionCircle3 .imageEvolution");

    // Logic to determine which Pokémon to display images for
    let currentId;

    if (chainNumber === 1) {
        currentId = 1; // Assuming starting Pokémon ID is 1 for chain 1
    } else {
        // Logic to determine starting Pokémon ID for other chains
        // Modify as needed based on your data structure
    }

    const nextId = currentId + 1;
    const nextAfterNextId = nextId + 1;
    const nextPokemon = pokemonData.find(pokemon => pokemon.id === nextId);
    const nextAfterNextPokemon = pokemonData.find(pokemon => pokemon.id === nextAfterNextId);
    console.log('nextAfterNextPokemon is: ', nextAfterNextPokemon);
    const nextAfterNextPokemonSprite = nextAfterNextPokemon['sprites']['other']['home']['front_shiny'];

    const nextPokemonSprite = nextPokemon['sprites']['other']['home']['front_shiny'];
    imgElement2.src = `${nextPokemonSprite}`;
    imgElement2_2.src = `${nextPokemonSprite}`;
    imgElement3.src = `${nextAfterNextPokemonSprite}`;
}



/////////////////////////////////////         ALT     ///////////////////////////////
// function writeNames(evolutionJSON){
//     document.getElementById('evolutionName2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
//     document.getElementById('evolutionName2_2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
//     document.getElementById('evolutionName3').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']}`;
// }

// function fillImages(){
//     let imgElement2 = document.querySelector("#evolutionCircle2 .imageEvolution");
//     let imgElement2_2 = document.querySelector("#evolutionCircle2Line2 .imageEvolution");
//     let imgElement3 = document.querySelector("#evolutionCircle3 .imageEvolution");

// const currentId = currentBigPokemon['id'];

// const nextId = currentId + 1;
// const nextAfterNextId = nextId + 1;
// const nextPokemon = pokemonData.find(pokemon => pokemon.id === nextId);
// const nextAfterNextPokemon = pokemonData.find(pokemon => pokemon.id === nextAfterNextId);
// console.log('nextAfterNextPokemon is: ', nextAfterNextPokemon);
// const nextAfterNextPokemonSprite = nextAfterNextPokemon['sprites']['other']['home']['front_shiny'];

//     const nextPokemonSprite = nextPokemon['sprites']['other']['home']['front_shiny'];
//     imgElement2.src =`${nextPokemonSprite}`; 
//     imgElement2_2.src =`${nextPokemonSprite}`; 
//     imgElement3.src =`${nextAfterNextPokemonSprite}`; 
// }


function showEvolutionDetails(evolutionJSON) {
    //     const chainNumber = getChainNumberFromURL(evolutionJSON.url);
    //     writeNames(evolutionJSON, chainNumber);
    //     fillImages(chainNumber);
    // }

    // function getChainNumberFromURL(url) {
    //     // Extract chain number from URL
    //     const parts = url.split('/');
    //     return parseInt(parts[parts.length - 2]);
    // }

    // function writeNames(evolutionJSON, chainNumber) {
    //     // Write names based on chain number
    //     switch (chainNumber) {
    //         case 1:
    //             document.getElementById('evolutionName2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
    //             document.getElementById('evolutionName2_2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
    //             document.getElementById('evolutionName3').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['evolves_to'][0]['species']['name']}`;
    //             break;
    //         // Add more cases for other chain numbers if needed
    //     }
    // }





    ///////////////////////////////////////////// Moves /////////////////////////////////////////////






    ///////////////////////////////////////////// General BigCard /////////////////////////////////////////////

    function showTab(tabName) {
        let selectedTabPage = document.getElementById(tabName);
        const allTabs = document.querySelectorAll('.singleDetail');
        allTabs.forEach(tab => tab.classList.add('d-none-tabs'));
        selectedTabPage.classList.remove('d-none-tabs');
    }

    function styleBigCard(currentBigPokemon) {
        let bigCardUpperHalf = document.getElementById('pokedex');
        colorElement(bigCardUpperHalf, currentBigPokemon['types'][0]['type']['name']);

        typeContainerSingle.classList.add('typeContainer');
        typeContainerSingle.style.backgroundColor = getDarkerTypeColor(currentBigPokemon['types'][0]['type']['name']);

        if (currentBigPokemon['types'].length > 1) {
            let type2ContainerSingle = document.getElementById(`typeContainer2Single${currentBigPokemon['name']}`);
            type2ContainerSingle.classList.add('typeContainer');
            type2ContainerSingle.style.backgroundColor = getDarkerTypeColor(currentBigPokemon['types'][0]['type']['name']);
        }
    }

    function colorElement(cardElement, type) {
        cardElement.style.backgroundColor = getTypeColor(type);
    }


    function colorTypeBoxes(typeContainer, type) {
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

}
