const fetch = require('node-fetch');

const basePath = 'https://pokeapi.co/api/v2/pokemon';


exports.getPokemon = async (offset, limit) => {
  const path = basePath + "?offset=" + offset + "&limit=" + limit;
  var response = await fetch(path);
  return await response.json();  
}