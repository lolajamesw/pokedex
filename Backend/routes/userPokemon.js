const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/userPokemonController');

router.get('/', controller.getUserPokemon);
router.post('/', controller.addUserPokemon);
router.delete('/', controller.deleteUserPokemon);
router.get('/tera-type', controller.getTeraType);
router.patch('/tera-type/:type', controller.setTeraType);
router.get('/evs-ivs', controller.getEVsIVs);
router.patch('/evs-ivs', controller.setEVsIVs);
router.get('/moves', controller.getMoves);
router.post('/moves/:aID', controller.learnMove);
router.delete('/moves/:aID', controller.forgetMove);
router.get('/teams', controller.getTeams);
router.patch('/nature/:nature', controller.setNature);
router.patch('/ability/:ability', controller.setAbility);
router.patch('/variant/:variant', controller.setVariant);
router.patch('/favourite/:favourite', controller.setFavourite);
router.patch('/item/:item', controller.setItem);

module.exports = router;