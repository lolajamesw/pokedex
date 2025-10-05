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

async function getVariantDetails(url) {
  try {
    const res = await axios.get(url);
    const res2 = await axios.get(res.data.forms[0].url);

    var name = res2.data.names.find(n => n.language.name === 'en').name;
    var form = res2.data.form_names.find(n => n.language.name === 'en').name;

    const details = {
      name: name,
      form: form,
      type1: res.data.types[0].type.name,
      type2: res.data.types.length === 1 ? 
      "" : res.data.types[1].type.name,
      hp: res.data.stats[0].base_stat,
      atk: res.data.stats[1].base_stat,
      def: res.data.stats[2].base_stat,
      spAtk: res.data.stats[3].base_stat,
      spDef: res.data.stats[4].base_stat,
      speed: res.data.stats[5].base_stat,
      mega: res2.data.is_mega ? 1 : 0
    };

    return details;
  } catch (error) {
    console.error(`Error getting details from ${url}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  for (let pID=1; pID<7; pID++) {
    const res = await  axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pID}`);
    const variants = res.data.varieties; 
    let i=2
    for (const variant of variants.filter((variant) => !variant.is_default)) {
      const details = await getVariantDetails(variant.pokemon.url);
      // console.log(res.data.form_descriptions);
      try {
        await connection.execute(
          `INSERT INTO PokemonVariants(pID, name, form, type1, type2, hp, atk, def, spAtk, spDef, speed, mega, img_suffix) 
           VALUES (${pID}, '${details.name}', '${details.form}', '${details.type1}', ${details.type2 ? `'${details.type2}'` : 'null'}, 
            ${details.hp}, ${details.atk}, ${details.def}, ${details.spAtk}, ${details.spDef}, 
            ${details.speed}, ${details.mega}, 'f${i++}');`
        );
      } catch (err) {
        console.error(`DB error on variant ${variant.pokemon.name}:`, err.message);
      }
    }
  }
  await connection.end();  
}


// Error getting details from https://pokeapi.co/api/v2/pokemon/10093/: Cannot read properties of undefined (reading 'name')
// DB error on variant raticate-totem-alola: Cannot read properties of null (reading 'name')
// Error getting details from https://pokeapi.co/api/v2/pokemon/10158/: Cannot read properties of undefined (reading 'name')
// DB error on variant pikachu-starter: Cannot read properties of null (reading 'name')
// Error getting details from https://pokeapi.co/api/v2/pokemon/10149/: Cannot read properties of undefined (reading 'name')
// DB error on variant marowak-totem: Cannot read properties of null (reading 'name')
// DB error on variant tauros-paldea-combat-breed: Data too long for column 'form' at row 1
// DB error on variant tauros-paldea-blaze-breed: Data too long for column 'form' at row 1
// Error getting details from https://pokeapi.co/api/v2/pokemon/10159/: Cannot read properties of undefined (reading 'name')
// DB error on variant eevee-starter: Cannot read properties of null (reading 'name')
// Error getting details from https://pokeapi.co/api/v2/pokemon/10116/: Cannot read properties of undefined (reading 'name')
// DB error on variant greninja-battle-bond: Cannot read properties of null (reading 'name')
// DB error on variant zygarde-10: Duplicate entry '10% Zygarde' for key 'pokemonvariants.PRIMARY'

updateDatabase();