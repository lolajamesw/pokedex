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



async function getVariantDetails(id) {
  try {
    const res = await axios.get('https://pokeapi.co/api/v2/evolution-chain/' + id);
    if (res.data.chain.evolves_to.length === 0) return false;

    let details = res.data.chain.evolves_to.map((e) => ({
      from: res.data.chain.species.url.split('/')[6], 
      to: e.species.url.split('/')[6],
    }));

    for (const evo of res.data.chain.evolves_to) {
      details = [...details, ...evo.evolves_to.map((e) => ({
        from: evo.species.url.split('/')[6],
        to: e.species.url.split('/')[6]
      }))]
    }


    return details;
  } catch (error) {
    console.error(`Error getting details from ${id}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let pID=375; pID<549; pID++) {
      const details = await getVariantDetails(pID);
      console.log(pID);
      if (!details) continue;
      for (const evo of details) {
        try {
          await connection.execute(
            `INSERT INTO Evolutions(evolvesFrom, evolvesInto) 
            VALUES (${evo.from}, ${evo.to});`
          );
        } catch (err) {
          console.error(`DB error on pokemon ${details.name}:`, err.message);
        }
      }
    }
  await connection.end();  
}

// 374-549
updateDatabase();