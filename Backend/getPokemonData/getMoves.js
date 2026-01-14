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

async function getMoveDetails(id) {
  try {
    const res = await axios.get('https://pokeapi.co/api/v2/move/' + id);

    const details = {
      name: res.data.names.find(
        (name) => name.language.name === "en"
      ).name,
      type: res.data.type.name,
      category: res.data.damage_class.name,
      power: res.data.power,
      accuracy: res.data.accuracy,
      pp: res.data.pp,
      effect: res.data.effect_entries.length === 0 ? false : 
        res.data.effect_entries.find(
          (effect) => effect.language.name === "en"
        ).short_effect,
      pokemon: res.data.learned_by_pokemon.map((p) => p.name),
    };

    return details;
  } catch (error) {
    console.error(`Error getting details from move ${id}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let aID=1; aID<2; aID++) {
    try {
      const move = await getMoveDetails(aID);
      // console.log(move);
      await connection.execute(
        `INSERT INTO Moves(name, type, category, power, accuracy, PP, effect) 
          VALUES ('${move.name}', '${move.type}', '${move.category}', ${move.power}, ${move.accuracy}, ${move.pp}, "${move.effect}");`
      );
    } catch (err) {
      console.error(`DB error on move ${aID}:`, err.message);
    }
  }
  await connection.end();  
}


updateDatabase();