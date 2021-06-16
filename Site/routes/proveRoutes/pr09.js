const express = require('express');
const router = express.Router();

const pokemonController = require('../../controllers/prove/prove09/pokemon');

router.get('/', pokemonController.getPokemon);

module.exports = router;