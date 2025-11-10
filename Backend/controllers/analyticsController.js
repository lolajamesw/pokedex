const asyncHandler = require('../middleware/asyncHandler');
const analyticsService = require('../services/analyticsService');

exports.getTeamTypeSummary = asyncHandler(async (req, res) => {
    const tID = Number(req.params.tID);
    const summary = await analyticsService.getTeamTypeSummary(tID);
    if (!summary) return res.status(404).json({ message: 'Summary couldn\'t be produced' });
    res.json(summary);
});

exports.getTeamExportText = asyncHandler(async (req, res) => {
    const tID = Number(req.params.tID);
    const text = await analyticsService.getTeamExportText(tID);
    if (!text) return res.status(404).json({ message: 'Export text couldn\'t be produced' });
    res.json(text);
});

exports.getBestOpponent = asyncHandler(async (req, res) => {
    const pokemonName = req.params.name;
    const uID = Number(req.params.uID);
    const opponent = await analyticsService.getBestOpponent(pokemonName, uID);
    if (!opponent) return res.status(404).json({ message: 'Opponent(s) couldn\'t be decided' });
    res.json(opponent);
});
