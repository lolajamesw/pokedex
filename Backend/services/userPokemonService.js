const userPokemonRepo = require('../repositories/userPokemonRepo');

exports.getUserPokemon = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.pokemon(instanceID);
};

exports.addUserPokemon = async (uID, name, nickname, level) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.addPokemon(uID, name, nickname, level);
};

exports.deleteUserPokemon = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.delPokemon(instanceID);
};

exports.getTeraType = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.teraType(instanceID);
};

exports.setTeraType = async (instanceID, type) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.setTeraType(instanceID, type);
};

exports.getEVsIVs = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.EVsIVs(instanceID);
};

exports.setEVsIVs = async (instanceID, values) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.setEVsIVs(instanceID, values);
};

exports.getMoves = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.moves(instanceID);
};

exports.learnMove = async (instanceID, aID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    if (!Number.isInteger(aID) || aID < 0) throw new Error('Invalid attack ID');
    return await userPokemonRepo.learnMove(instanceID, aID);
};

exports.forgetMove = async (instanceID, aID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    if (!Number.isInteger(aID) || aID < 0) throw new Error('Invalid attack ID');
    return await userPokemonRepo.forgetMove(instanceID, aID);
};

exports.getTeams = async (instanceID) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.teams(instanceID);
};

exports.setNature = async (instanceID, nature) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.setNature(instanceID, nature);
};

exports.setAbility = async (instanceID, ability) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.setAbility(instanceID, ability);
};

exports.setVariant = async (instanceID, variant) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    return await userPokemonRepo.setVariant(instanceID, variant);
};

exports.setFavourite = async (instanceID, favourite) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    if (favourite !== 1 && favourite !== 0) throw new Error('Favourite value must be 1 or 0')
    return await userPokemonRepo.setFavourite(instanceID, favourite);
};

exports.setItem = async (instanceID, item) => {
    if (!Number.isInteger(instanceID) || instanceID < 0) throw new Error('Invalid instance ID');
    if (item === 'megaStone') {
        return await userPokemonRepo.addMegaStone(instanceID);
    } else if (item) {
        return await userPokemonRepo.setItem(instanceID, item)
    } else {
        return await userPokemonRepo.deleteItem(instanceID);
    }
};