const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/teams/type-summary/:tID', analyticsController.getTeamTypeSummary);
router.get('/teams/export/:tID', analyticsController.getTeamExportText);
router.get('/opponents/:name/:uID', analyticsController.getBestOpponent);

module.exports = router;