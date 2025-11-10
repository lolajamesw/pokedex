const pokemonRepo = require('../repositories/pokemonRepo');

exports.getPokedex = async (uID) => {
    if (!Number.isInteger(uID) || uID < 0) throw new Error('Invalid user ID');
    return await pokemonRepo.pokedex(uID);
};

exports.getTypes = async () => {
    return await pokemonRepo.types();
}

exports.getNames = async () => {
    return await pokemonRepo.names();
}

exports.getPokemon = async (pID) => {
    return await pokemonRepo.pokemon(pID);
}

exports.getAttacks = async (pID) => {
    return await pokemonRepo.attacks(pID);
}

exports.getItems = async (pID) => {
    return await pokemonRepo.items(pID);
}

exports.getEvolutions = async (pID) => {
    return await pokemonRepo.evolutions(pID);
}

exports.getVariants = async (pID) => {
    return await pokemonRepo.variants(pID);
}

exports.getAbilities = async (pID, variant) => {
    return await pokemonRepo.abilities(pID, variant);
}