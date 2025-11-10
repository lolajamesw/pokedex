const asyncHandler = require('../middleware/asyncHandler');
const teamsService = require('../services/teamsService');

exports.getTeams = asyncHandler(async (req, res) => {
    const uID = Number(req.params.uID);
    const teams = await teamsService.getTeams(uID);
    if (!teams) return res.status(404).json({ message: 'Teams not found' });
    res.json(teams);
});

exports.addTeam = asyncHandler(async (req, res) => {
    const uID = Number(req.params.uID);
    const name = req.params.name;
    const team = await teamsService.addTeam(uID, name);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
});

exports.deleteTeam = asyncHandler(async (req, res) => {
    const tID = Number(req.params.tID);
    const team = await teamsService.deleteTeam(tID);
    res.json(team);
});

exports.setTeamPokemon = asyncHandler(async (req, res) => {
    const tID = Number(req.params.tID);
    const instanceIDs = JSON.parse(req.query.instanceIDs);
    const ids = [...instanceIDs, null, null, null, null, null, null]
    const team = await teamsService.setTeamPokemon(tID, ids);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
});

exports.setTeamName = asyncHandler(async (req, res) => {
    const tID = Number(req.params.tID);
    const name = req.params.name;
    const team = await teamsService.setTeamName(tID, name);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
});
