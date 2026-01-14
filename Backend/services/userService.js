const repo = require('../repositories/userRepo');

exports.getUser = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await repo.user(uID);
};

exports.addUser = async (name, username, password) => {
    return await repo.create(name, username, password);
};

exports.userExists = async (username) => {
    return await repo.exists(username);
}

exports.login = async (username, password) => {
    return await repo.login(username, password);
};

exports.setDisplayName = async (uID, name) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await repo.setName(uID, name);
};

exports.findUsers = async (prompt) => {
    return await repo.users(prompt);
};

exports.getUserPokemon = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await repo.pokemon(uID);
};

exports.addUserPokemon = async (uID, name, nickname, level) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid instance ID');
    return await repo.addPokemon(uID, name, nickname, level);
};