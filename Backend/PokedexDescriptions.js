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

async function fetchFlavorText(pID) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pID}`);
    const entries = res.data.flavor_text_entries;

    // Prefer first English entry
    const entry = entries.find(e => e.language.name === 'en');
    if (entry) {
      // Normalize whitespace and line breaks
      return entry.flavor_text.replace(/\f/g, ' ').replace(/\s+/g, ' ').trim();
    }
  } catch (error) {
    console.error(`Error fetching pID ${pID}:`, error.message);
  }
  return null;
}

async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
// 265, 268, 277, 292, 303, 313, 331, 353, 356, 368, 373, 375, 721
  for (let pID = 721; pID <= 721; pID++) {
    const flavorText = await fetchFlavorText(pID);
    if (flavorText) {
      try {
        await connection.execute(
          'UPDATE pokedex SET description = ? WHERE pID = ?',
          [flavorText, pID]
        );
        console.log(`Updated pID ${pID}`);
      } catch (err) {
        console.error(`DB error on pID ${pID}:`, err.message);
      }
    } else {
      console.warn(`No English flavor text for pID ${pID}`);
    }
  }

  await connection.end();
}

updateDatabase();