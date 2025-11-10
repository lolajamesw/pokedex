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

async function getItemInfo(url) {
  try {
    const res = await axios.get(url);
    const entries = res.data.flavor_text_entries;
    const effects = res.data.effect_entries;
    var icon = "";
    try {icon = res.data.sprites.default;}
    catch (error) {}
    

    // Prefer first English entry
    var entry = entries.find(e => e.language.name === 'en');
      // Normalize whitespace and line breaks
    entry = (entry ?? {text: ""}).text.replace(/\f/g, ' ').replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();

    // Prefer first English entry
    var effect = effects.find(e => e.language.name === 'en');
    // Normalize whitespace and line breaks
    effect = (effect ?? {effect: ""}).effect.replace(/\f/g, ' ').replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();

    //get icon address

    return [effect, entry, icon];
  } catch (error) {
    console.error(`Error fetching url ${url}:`, error.message);
  }
  return null;
}


async function updateDatabase() {
  const connection = await mysqlPromise.createConnection(dbConfig);
  const res = await  axios.get("https://pokeapi.co/api/v2/item-category/44/");
  const items = res.data.items;

  for (const item of items) {
    const info = await getItemInfo(item.url, false);
    if (info) {
      try {
        await connection.execute(
          `INSERT INTO Items(name, effect, speciesSpecific, description, type, icon) 
           VALUES ('${item.name}', '${info[0]}', 1, '${info[1]}', 'mega-stones', '${info[2]}');`
        );
      } catch (err) {
        console.error(`DB error on item ${item.name}:`, err.message);
      }
    } else {
      console.warn(`No English flavor text for item ${item.name}`);
    }

  }
  // console.log(items[1].url);
  // const info = await getItemInfo(items[0].url, false);
  // console.log(info);

  // try {
  //   await connection.execute(
  //     `INSERT INTO Items(name, effect, speciesSpecific, description) 
  //       VALUES ('${items[0].name}', '${info[0]}', 0, '${info[1]}');`
  //   );
  // } catch (err) {
  //   console.error(`DB error on item ${items[0].name}:`, err.message);
  // }

  await connection.end();


  
}

// Note that this didn't finish all items. error message below:
// DB error on item bright-powder: Duplicate entry 'bright-powder' for key 'items.PRIMARY'
// DB error on item quick-claw: Data too long for column 'effect' at row 1
// DB error on item kings-rock: Data too long for column 'effect' at row 1
// DB error on item light-clay: Data too long for column 'effect' at row 1
// DB error on item power-herb: Data too long for column 'effect' at row 1
// DB error on item focus-sash: Data too long for column 'effect' at row 1
// DB error on item icy-rock: Data too long for column 'effect' at row 1
// DB error on item smooth-rock: Data too long for column 'effect' at row 1
// DB error on item heat-rock: Data too long for column 'effect' at row 1
// DB error on item damp-rock: Data too long for column 'effect' at row 1
// DB error on item air-balloon: Data too long for column 'effect' at row 1
// DB error on item red-card: Data too long for column 'effect' at row 1
// DB error on item eject-button: Data too long for column 'effect' at row 1
// Error fetching url https://pokeapi.co/api/v2/item/1176/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item throat-spray
// Error fetching url https://pokeapi.co/api/v2/item/1177/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item eject-pack
// Error fetching url https://pokeapi.co/api/v2/item/1178/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item heavy-duty-boots
// Error fetching url https://pokeapi.co/api/v2/item/1179/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item blunder-policy
// Error fetching url https://pokeapi.co/api/v2/item/1180/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item room-service
// Error fetching url https://pokeapi.co/api/v2/item/1181/: Cannot read properties of undefined (reading 'effect')
// No English flavor text for item utility-umbrella
// Error fetching url https://pokeapi.co/api/v2/item/1696/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item booster-energy
// Error fetching url https://pokeapi.co/api/v2/item/1697/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item ability-shield
// Error fetching url https://pokeapi.co/api/v2/item/1698/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item clear-amulet
// Error fetching url https://pokeapi.co/api/v2/item/1699/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item mirror-herb
// Error fetching url https://pokeapi.co/api/v2/item/1700/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item punching-glove
// Error fetching url https://pokeapi.co/api/v2/item/1701/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item covert-cloak
// Error fetching url https://pokeapi.co/api/v2/item/1702/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item loaded-dice
// Error fetching url https://pokeapi.co/api/v2/item/2105/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item fairy-feather
// Error fetching url https://pokeapi.co/api/v2/item/2106/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item wellspring-mask
// Error fetching url https://pokeapi.co/api/v2/item/2107/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item hearthflame-mask
// Error fetching url https://pokeapi.co/api/v2/item/2108/: Cannot read properties of undefined (reading 'text')
// No English flavor text for item cornerstone-mask

updateDatabase();