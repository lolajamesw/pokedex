const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { validateToken } = require('../middleware/JWT');

router.get('/', validateToken, teamController.getTeams);
router.post('/:name', validateToken, teamController.addTeam);
router.delete('/:tID', teamController.deleteTeam);
router.patch('/:tID/name', teamController.setTeamName);
router.patch('/:tID', teamController.setTeamPokemon);

module.exports = router;