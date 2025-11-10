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

async function getItemInfo(id) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/ability/${id}`);
    const entries = res.data.effect_entries;    
    const name = res.data.name;

    // Prefer first English entry
    const entry = entries.find(e => e.language.name === 'en');
      // Normalize whitespace and line breaks
    const effect = (entry?.short_effect ?? {text: ""}).replace(/\f/g, ' ').replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    const description = (entry?.effect ?? {text: ""}).replace(/"/g, '\"');


    return [name, effect, description];
  } catch (error) {
    console.error(`Error fetching url https://pokeapi.co/api/v2/ability/${id}:`, error.message);
  }
  return null;
}

async function connectAbility(url) {
  try {
    const res = await axios.get(url);
    const abilities = res.data.abilities.map((a) => a.ability.name);    
    
    const formRes = await axios.get(res.data.forms[0].url)
    var variant;
    if (formRes.data.names.length === 0) {
      variant = 'original'
    } else {
      variant = formRes.data.names
      variant = variant.find(e => e.language.name === 'en').name;
    }

    return {
      abilities: abilities,
      variant: variant
    };
  } catch (error) {
    console.error(`Error fetching url ${url}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let i=231; i<=367; i++) {
    const ability = await getItemInfo(i);
    if (ability) {
      try {
        await connection.execute(
          `INSERT INTO Abilities(name, effect, description) 
           VALUES ("${ability[0]}", "${ability[1]}", "${ability[2]}");`
        );
      } catch (err) {
        console.error(`DB error on ability ${ability[0]}:`, err);
      }
    } else {
      console.warn(`No English flavor text for ability`);
    }

  }
  

  await connection.end();
}

async function updateLinks() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let pID=898; pID<=898; pID++) {
    console.log(pID);
    const res = await  axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pID}`);
    const varieties = res.data.varieties; 
    for (const variety of varieties) {
      const details = await connectAbility(variety.pokemon.url);
      if (details) {
        console.log(details)
        for (const ability of details.abilities) {
          console.log(ability)
          try {
            await connection.execute(
              `INSERT INTO PokemonAbilities(pID, variant, ability) VALUES (${pID}, '${details.variant}', '${ability}');`
            );
          } catch (err) {
            console.error(`DB error on PokemonAbilities ${pID}, ${details.variant} ${ability}:`, err);
          }
        }
      } else {
        console.warn(`Issue fetching pokemon detials`);
      }
    } // 898
  }
  

  await connection.end();
}

// updateDatabase();
updateLinks();