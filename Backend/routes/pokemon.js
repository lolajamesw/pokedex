const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');

router.get('/names', pokemonController.getNames);
router.get('/types', pokemonController.getTypes);
router.get('/:uID', pokemonController.getPokedex);
router.get('/:pID/details', pokemonController.getPokemon);
router.get('/:pID/moves', pokemonController.getAttacks);
router.get('/:pID/evolutions', pokemonController.getEvolutions);
router.get('/:pID/items', pokemonController.getItems);
router.get('/:pID/variants', pokemonController.getVariants);
router.get('/:pID/abilities/:variant', pokemonController.getAbilities);

module.exports = router;
