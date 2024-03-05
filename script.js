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
    renderCards();
    createLetters();
}


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
    return `<div id="smallCardSingle${currentPokemon['name']}" class="smallCardSingle" onclick="openBigCard(${currentPokemon['id']})">
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

async function openBigCard(pokemonId) {      
    let url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`; 
    let response = await fetch(url);
    bigCardJSONforDetails = await response.json();
    currentBigPokemon = pokemonMap.get(pokemonId);                                             //dafür erstmal per ID Poki raussuchen

    console.log('currentBig is: ', currentBigPokemon);

    let mainPage = document.querySelector('.main-page');
    mainPage.classList.add('d-none');                                                               //mainPage ausblenden
    let BigCardPage = document.getElementById('bigCardPage');
    BigCardPage.classList.remove('d-none');  
    BigCardPage.innerHTML = generateBigCard(currentBigPokemon);
    styleBigCard(currentBigPokemon, pokemonId);
    getEvolutionUrl(currentBigPokemon);
}

    



async function getEvolutionUrl(currentBigPokemon){
    let url = currentBigPokemon['species']['url'];
    let response = await fetch(url); 
    let urlEvolutionJSON = await response.json();

    let urlEvolution = urlEvolutionJSON['evolution_chain']['url'];
    // console.log('urlEvolution is: ', urlEvolution);
    // console.log('die vorherige URL für evolution is: ', url);

    await getEvolutionDetails(urlEvolution);
}


async function getEvolutionDetails(urlEvolution){
    let url = urlEvolution;
    let response = await fetch(urlEvolution);
    evolutionJSON = await response.json();

    // console.log('evolutionJSON is: ', evolutionJSON);

    showEvolutionDetails(evolutionJSON);

    return evolutionJSON;
}


function showEvolutionDetails(evolutionJSON){
// console.log('showEvo Versuch zeigt dieses: ', evolutionJSON['chain']['evolves_to'][0]['species']['name']);

if(evolutionJSON['chain']['evolves_to'][0]['species']['name']){
    document.getElementById('evolutionName2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
    document.getElementById('evolutionName2_2').innerHTML = `${evolutionJSON['chain']['evolves_to'][0]['species']['name']}`;
    let imgElement2 = document.querySelector("#evolutionCircle2 .imageEvolution");
    let imgElement2_2 = document.querySelector("#evolutionCircle2Line2 .imageEvolution");
    
const currentPokemonId = currentBigPokemon['id'];
// console.log('Id current: ', currentPokemonId);

const nextPokemonId = currentPokemonId + 1;
// console.log('Id next is: ', nextPokemonId);

const nextPokemon = pokemonData.find(pokemon => pokemon.id === nextPokemonId);
// console.log('next Poki is: ', nextPokemon);

if (nextPokemon) {
    const nextPokemonSprite = nextPokemon['sprites']['other']['home']['front_shiny'];
    imgElement2.src =`${nextPokemonSprite}`; 
    imgElement2_2.src =`${nextPokemonSprite}`; 
//    console.log(nextPokemonSprite);
} else {
//   console.log("Next Pokémon not found.");
}
   }
}

function closeBigCard(event) {
        if (event.target.id === 'bigBox') {         //onclick-event-Ziel mit DOM id bigBox, aber nicht die children, deswegen Klick auf Karte effektlos
         document.getElementById('bigCardPage').classList.add('d-none');
         document.querySelector('.main-page').classList.remove('d-none');
     }
}


generateBigCard(currentBigPokemon, evolutionJSON);

function generateBigCard(currentBigPokemon, evolutionJSON) {
    const type1 = currentBigPokemon['types'][0]['type']['name'];
    const type2 = currentBigPokemon['types'][1] ? currentBigPokemon['types'][1]['type']['name'] : '';
    const darkerTypeColor = getDarkerTypeColor(type1);

    console.log('stats is: ', currentBigPokemon['stats']);


    return `
    <div class="bigBox" id="bigBox" onclick="closeBigCard(event)">
    <div class="all">
        <div><img src="./img/left-arrow.png" onclick="showPreviousBig(currentBigPokemon)" class="nextPrevArrows"></div>
        <div class="pokedexAndInfoContainer" id="pokedexAndInfoContainer">
            <div id="pokedex">
                <h2 id="pokemonNameSingle">${currentBigPokemon['name']}</h2>
                <div id="typeContainerSingle">${type1}</div>
                ${type2 ? `<div id="typeContainer2Single${currentBigPokemon['name']}">${type2}</div>` : '' }
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
                            <canvas id="myChart"></canvas>
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
for (let p=0;p<flavorTexts.length;p++){
    let text = flavorTexts[i].text.Content;
    let newText = text.replace('U+000c', '');
    flavorTexts[i].textContent = newText;
}


getBaseStats(currentBigPokemon);



getEvolutionUrl(currentBigPokemon);


function showNextBig(currentBigPokemon){
    let nextBigPokemonID;
    if(currentBigPokemon['id'] === (pokemonData.length - 1))
    {  
        nextBigPokemonID = 1;
    } else {nextBigPokemonID = currentBigPokemon['id']+1;     
    }
    openBigCard(nextBigPokemonID);    
}


function showPreviousBig(currentBigPokemon){
    let nextBigPokemonID;
    if(currentBigPokemon['id'] === 1)
    {  
    nextBigPokemonID = (pokemonData.length - 1)  ;
    } else {nextBigPokemonID = currentBigPokemon['id']-1;     
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

function getBaseStats(currentBigPokemon){
    
 statsJSONarray = currentBigPokemon['stats'];
let baseStats = [];

if (Array.isArray(statsJSONarray)) {
    for (let s = 0; s < statsJSONarray.length; s++) {
        let singleStatFromArray = statsJSONarray[s];
        baseStats.push(singleStatFromArray);
        console.log('baseStats gepushte sind: ', baseStats);
    }
} else {
    console.error("Stats data is not an array.");
}



alert(Array.isArray(statsJSONarray));
}
 




///////////////////////////////////////////// Evolution /////////////////////////////////////////////


///////////////////////////////////////////// Moves /////////////////////////////////////////////






///////////////////////////////////////////// General BigCard /////////////////////////////////////////////

function showTab(tabName) {
    let selectedTabPage = document.getElementById(tabName);
    const allTabs = document.querySelectorAll('.singleDetail');
    allTabs.forEach(tab => tab.classList.add('d-none-tabs'));
    selectedTabPage.classList.remove('d-none-tabs');
}

function styleBigCard(currentBigPokemon){
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


