const userRepo = require('../repositories/userRepo');

exports.getUser = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await userRepo.user(uID);
};

exports.addUser = async (name, username, password) => {
    return await userRepo.create(name, username, password);
};

exports.login = async (username, password) => {
    return await userRepo.login(username, password);
};

exports.setDisplayName = async (uID, name) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await userRepo.setName(uID, name);
};

exports.findUsers = async (prompt) => {
    return await userRepo.users(prompt);
};

exports.getUserPokemon = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await userRepo.pokemon(uID);
};