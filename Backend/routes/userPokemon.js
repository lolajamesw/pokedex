const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/userPokemonController');
const { validateToken } = require('../middleware/JWT');

router.get('/', controller.getUserPokemon);
router.delete('/', validateToken, controller.deleteUserPokemon);
router.get('/tera-type', controller.getTeraType);
router.patch('/tera-type/:type', validateToken, controller.setTeraType);
router.get('/evs-ivs', controller.getEVsIVs);
router.patch('/evs-ivs', validateToken, controller.setEVsIVs);
router.get('/moves', controller.getMoves);
router.post('/moves/:aID', validateToken, controller.learnMove);
router.delete('/moves/:aID', validateToken, controller.forgetMove);
router.get('/teams', controller.getTeams);
router.patch('/nature/:nature', validateToken, controller.setNature);
router.patch('/ability/:ability', validateToken, controller.setAbility);
router.patch('/variant/:variant', validateToken, controller.setVariant);
router.patch('/favourite/:favourite', validateToken, controller.setFavourite);
router.patch('/item/:item', validateToken, controller.setItem);

module.exports = router;