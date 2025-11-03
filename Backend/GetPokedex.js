// Requires: npm install axios mysql2
require('dotenv').config();
const axios = require('axios');
const mysqlPromise = require('mysql2/promise');

// Replace with your actual DB info
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};



async function getVariantDetails(pID) {
  try {
    const speciesRes = await axios.get('https://pokeapi.co/api/v2/pokemon-species/' + pID)
    const pokeRes = await axios.get('https://pokeapi.co/api/v2/pokemon/' + pID);

    const entry = speciesRes.data.flavor_text_entries.find(e => e.language.name === 'en');
    let desc = '';
    if (entry) {
      desc = entry.flavor_text.replace(/\f/g, ' ').replace(/\s+/g, ' ').replace(/\n/g, '').trim();
    }

    const details = {
      name: speciesRes.data.names.find((n) => n.language.name === "en").name,
      type1: pokeRes.data.types[0].type.name,
      type2: pokeRes.data.types.length === 1 ? 
        "" : pokeRes.data.types[1].type.name,
      hp: pokeRes.data.stats[0].base_stat,
      atk: pokeRes.data.stats[1].base_stat,
      def: pokeRes.data.stats[2].base_stat,
      spAtk: pokeRes.data.stats[3].base_stat,
      spDef: pokeRes.data.stats[4].base_stat,
      speed: pokeRes.data.stats[5].base_stat,
      legendary: speciesRes.data.is_legendary ? 1 : 0,
      description: desc,
    };

    return details;
  } catch (error) {
    console.error(`Error getting details from ${url}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let pID=912; pID<913; pID++) {
      const details = await getVariantDetails(pID);
      console.log(details.description)
      try {
        await connection.execute(
          `INSERT INTO Pokedex(pID, name, type1, type2, hp, atk, def, spAtk, spDef, speed, legendary, description) 
           VALUES (${pID}, '${details.name}', '${details.type1}', ${details.type2 ? `'${details.type2}'` : 'null'}, 
            ${details.hp}, ${details.atk}, ${details.def}, ${details.spAtk}, ${details.spDef}, 
            ${details.speed}, ${details.legendary}, '${details.description}');`
        );
      } catch (err) {
        console.error(`DB error on pokemon ${details.name}:`, err.message);
      }
    }
  await connection.end();  
}


updateDatabase();