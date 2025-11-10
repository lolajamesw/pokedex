const analyticsRepo = require('../repositories/analyticsRepo');

exports.getTeamTypeSummary = async (tID) => {
    if (!Number.isInteger(tID) || tID < 0) throw new Error('Invalid team ID');
    return await analyticsRepo.typeSummary(tID);
};

exports.getTeamExportText = async (tID) => {
    if (!Number.isInteger(tID) || tID < 0) throw new Error('Invalid team ID');
    return await analyticsRepo.export(tID);
};

exports.getBestOpponent = async (name, uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await analyticsRepo.opponent(name, uID);
};