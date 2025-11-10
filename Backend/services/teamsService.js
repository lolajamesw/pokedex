const teamRepo = require('../repositories/teamRepo');

exports.getTeams = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid team ID');
    return await teamRepo.teams(uID);
};

exports.addTeam = async (uID, name) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await teamRepo.create(uID, name);
};

exports.deleteTeam = async (tID) => {
    if (!Number.isInteger(tID) || tID < 0) throw new Error('Invalid team ID');
    return await teamRepo.delete(tID);
};

exports.setTeamPokemon = async (tID, ids) => {
    if (!Number.isInteger(tID) || tID < 0) throw new Error('Invalid team ID');
    if (!ids.every((id) => id === null || (Number.isInteger(id) && id >= 0))) 
        throw new Error('Invalid Pokemon ID');
    return await teamRepo.setPokemon(tID, ids);
};

exports.setTeamName = async (tID, name) => {
    if (!Number.isInteger(tID) || tID < 0) throw new Error('Invalid team ID');
    return await teamRepo.setName(tID, name);
};
