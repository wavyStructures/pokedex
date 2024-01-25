let currentPokemon;

function init() {
    let smallCards = document.getElementById('smallCard');
    loadPokemon();
}






async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/charmander';
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('loaded Pokemon', currentPokemon,);
    console.log(currentPokemon['name']);


    renderPokemonInfo();
}

function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'];

    let type = currentPokemon['types'][0]['type']['name'];
    document.getElementById('typeContainer').innerHTML = type;

    let imageContainer = document.getElementById('image');
    let image = currentPokemon['sprites']['front_default'];
    imageContainer.src = `${image}`;

    let speciesBox = document.getElementById('species');
    speciesBox.innerHTML = generateSpecies();
}

function generateSpecies() {
    return `
    <span>$</span>
   
    
    
    `;
}