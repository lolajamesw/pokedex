const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');

router.get('/:uID', teamController.getTeams);
router.post('/:uID/:name', teamController.addTeam);
router.delete('/:tID', teamController.deleteTeam);
router.patch('/:tID/name', teamController.setTeamName);
router.patch('/:tID', teamController.setTeamPokemon);

module.exports = router;