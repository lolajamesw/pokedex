const express = require('express');
const router = express.Router();

const pokemonRoutes = require('./pokemon');
const userPokemonRoutes = require('./userPokemon');
const analyticsRoutes = require('./analytics');
const teamRoutes = require('./team');
const userRoutes = require('./user');

router.use('/pokemon', pokemonRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users/base', userRoutes);
router.use('/users/team', teamRoutes);
router.use('/users/pokemon/:id', userPokemonRoutes);

module.exports = router;
