let colors = {
    "normal": "#A8A878",
    "fighting": "#C03028",
    "flying": "#A890F0",
    "poison": "#7C538C",
    "ground": "#E0C068",
    "rock": "#B8A038",
    "bug": "#A8B820",
    "ghost": "#705898",
    "steel": "#B8B8D0",
    "fire": "#FB6C6C",
    "water": "#76BDFE",
    "grass": "#48D0B0",
    "electric": "#FFD86F",
    "psychic": "#F85888",
    "ice": "#98D8D8",
    "dragon": "#7038F8",
    "dark": "#705848"
};


function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}


