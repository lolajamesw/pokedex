const asyncHandler = require('../middleware/asyncHandler');
const service = require('../services/userPokemonService');

// GET /users/pokemon/:id
exports.getUserPokemon = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const pokemon = await service.getUserPokemon(instanceID);
  if (!pokemon) return res.status(404).json({ message: 'Pokemon not found' });
  res.json(pokemon);
});

// POST /users/pokemon
exports.addUserPokemon = asyncHandler(async (req, res) => {
  uID = Number(req.params.id);
  // prefer body: { name, nickname, level }
  const { name, nickname, level = 100 } = req.body;
  if (!uID || !name) return res.status(400).json({ message: 'uID and name required' });

  const pokemon = await service.addUserPokemon(Number(uID), name, nickname, Number(level));
  res.status(201).json(pokemon);
});

// DELETE /users/pokemon/:id
exports.deleteUserPokemon = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  await service.deleteUserPokemon(instanceID);
  res.status(204).end();
});

// GET /users/pokemon/:id/tera-type
exports.getTeraType = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const teraType = await service.getTeraType(instanceID);
  if (!teraType) return res.status(404).json({ message: 'Pokemon tera type not found' });
  res.json(teraType);
});

// PATCH /users/pokemon/:id/tera-type
exports.setTeraType = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const teraType = req.params.type;
  if (!teraType) return res.status(400).json({ message: 'teraType required' });
  const result = await service.setTeraType(instanceID, teraType);
  res.status(200).json(result);
});

// GET /users/pokemon/:id/evs-ivs
exports.getEVsIVs = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const EVsIVs = await service.getEVsIVs(instanceID);
  if (!EVsIVs) return res.status(404).json({ message: 'Pokemon EVs and IVs not found' });
  res.json(EVsIVs);
});

// PATCH /users/pokemon/:id/evs-ivs
exports.setEVsIVs = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const values = req.body.values || req.body;
  if (!values) return res.status(400).json({ message: 'EV/IV values required' });
  const EVsIVs = await service.setEVsIVs(instanceID, values);
  res.status(200).json(EVsIVs);
});

// GET /users/pokemon/:id/moves
exports.getMoves = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const moves = await service.getMoves(instanceID);
  if (!moves) return res.status(404).json({ message: "Pokemon's learned moves not found" });
  res.json(moves);
});

// POST /users/pokemon/:id/moves/:aID
exports.learnMove = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const aID = Number(req.params.aID);
  if (!Number.isInteger(aID)) return res.status(400).json({ message: 'aID required' });
  const move = await service.learnMove(instanceID, aID);
  res.status(201).json(move);
});

// DELETE /users/pokemon/:id/moves/:aID
exports.forgetMove = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const aID = Number(req.params.aID);
  if (!Number.isInteger(aID)) return res.status(400).json({ message: 'aID required' });
  await service.forgetMove(instanceID, aID);
  res.status(204).end();
});

// GET /users/pokemon/:id/teams
exports.getTeams = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const tIDs = await service.getTeams(instanceID);
  if (!tIDs) return res.status(404).json({ message: 'Teams the pokemon is on were not found' });
  res.json(tIDs);
});

// PATCH /users/pokemon/:id/nature
exports.setNature = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const nature = req.params.nature;
  if (typeof nature === 'undefined') return res.status(400).json({ message: 'nature required' });
  const result = await service.setNature(instanceID, nature);
  res.status(200).json(result);
});

// PATCH /users/pokemon/:id/ability
exports.setAbility = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const ability = req.params.ability === 'null' ? null : req.params.ability;
  if (typeof ability === 'undefined') return res.status(400).json({ message: 'ability required' });
  const result = await service.setAbility(instanceID, ability);
  res.status(200).json(result);
});

// PATCH /users/pokemon/:id/variant
exports.setVariant = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const variant  = req.params.variant;
  if (typeof variant === 'undefined') return res.status(400).json({ message: 'variant required' });
  const result = await service.setVariant(instanceID, variant);
  res.status(200).json(result);
});

// PATCH /users/pokemon/:id/favourite
exports.setFavourite = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const favourite = Number(req.params.favourite);
  if (typeof favourite === 'undefined') return res.status(400).json({ message: 'favourite required' });
  const result = await service.setFavourite(instanceID, favourite);
  res.status(200).json(result);
});

// PATCH /users/pokemon/:id/item
exports.setItem = asyncHandler(async (req, res) => {
  const instanceID = Number(req.params.id);
  const item = req.params.item === 'null' ? null : req.params.item;
  if (typeof item === 'undefined') return res.status(400).json({ message: 'item required' });
  const result = await service.setItem(instanceID, item);
  res.status(200).json(result);
});
