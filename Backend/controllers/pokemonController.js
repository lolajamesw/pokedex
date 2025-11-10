const asyncHandler = require('../middleware/asyncHandler');
const pokemonService = require('../services/pokemonService');

exports.getPokedex = asyncHandler(async (req, res) => {
    const uID = Number(req.params.uID);
    const pokedex = await pokemonService.getPokedex(uID);
    if (!pokedex) return res.status(404).json({ message: 'Pokemon not found' });
    res.json(pokedex);
});

exports.getNames = asyncHandler(async (req, res) => {
    const names = await pokemonService.getNames();
    if (!names) return res.status(404).json({ message: 'Pokemon names not found' });
    res.json(names);
});

exports.getTypes = asyncHandler(async (req, res) => {
    const types = await pokemonService.getTypes();
    if (!types) return res.status(404).json({ message: 'Types not found' });
    res.json(types);
});

exports.getPokemon = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const pokemon = await pokemonService.getPokemon(pID);
    if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });
    res.json(pokemon);
});

exports.getAttacks = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const attacks = await pokemonService.getAttacks(pID);
    if (!attacks) return res.status(404).json({ message: 'Attacks not found' });
    res.json(attacks);
});

exports.getItems = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const items = await pokemonService.getItems(pID);
    if (!items) return res.status(404).json({ message: 'Items not found' });
    res.json(items);
});

exports.getEvolutions = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const evolutions = await pokemonService.getEvolutions(pID);
    if (!evolutions) return res.status(404).json({ message: 'Evolutions not found' });
    res.json(evolutions);
});

exports.getVariants = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const variants = await pokemonService.getVariants(pID);
    if (!variants) return res.status(404).json({ message: 'Variants not found' });
    res.json(variants);
});

exports.getAbilities = asyncHandler(async (req, res) => {
    const pID = Number(req.params.pID);
    const variant = String(req.params.variant)
    const abilities = await pokemonService.getAbilities(pID);
    if (!abilities) return res.status(404).json({ message: 'Abilities not found' });
    res.json(abilities);
});
