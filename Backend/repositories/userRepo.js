const pool = require('../db');

// Add new user to database
exports.create = async (name, username, password) => {
    const sql = 'INSERT INTO User (name, tradeCount, username, password) VALUES (?, 0, ?, ?)';
    const [result] = await pool.query(sql, [name, username, password]);
    const newUser = {
        uID: result.insertId,
        name,
        username
    }
    return { user: newUser };
}

// get uID of login credentials
exports.login = async (username, password) => {
    const sql = 'SELECT * FROM User WHERE username=? AND password=?'
    const [results] = await pool.query(sql, [username, password]);
    return results.length === 1 ? { message: "Login successful", user: results[0] } : false;
}

// Update a user's display name
exports.setName = async (uID, name) => {
    const sql = 'UPDATE User SET name=? WHERE uID=?';
    const [result] = await pool.query(sql, [name, uID]);
    return result;
}

// Get a user's details by their uID
exports.user = async (uID) => {
    const sql = '\
    SELECT uID as id, name as displayName, tradeCount, username \
    FROM User WHERE uID=?';
    const [rows] = await pool.query(sql, [uID]);
    return rows[0];
}

// Get all users with usernames or names that contain the prompt
exports.users = async (prompt) => {
    const sql = 'SELECT uID, name, username FROM User WHERE username LIKE ? OR name LIKE ?';
    const [rows] = await pool.query(sql, [`%${prompt}%`, `%${prompt}%`]);
    return rows;
}

// Get all pokemon associated with a given user
exports.pokemon = async (uID) => {
    const sql = `SELECT
        mp.instanceID AS id, p.pID, p.name, mp.nickname,
        p.type1, p.type2,
        p.hp, p.atk, p.def, p.spAtk, p.spDef, p.speed,
        mp.hpEV, mp.atkEV, mp.defEV, mp.spAtkEV, mp.spDefEV, mp.speedEV,
        mp.hpIV, mp.atkIV, mp.defIV, mp.spAtkIV, mp.spDefIV, mp.speedIV,
        v.type1 vtype1, v.type2 vtype2,
        v.hp vhp, v.atk vatk, v.def vdef, v.spAtk vspAtk, v.spDef vspDef, v.speed vspeed,
        mp.level, mp.form, mp.nature, icon, v.imgID, mp.showcase

        FROM MyPokemon mp
        JOIN Pokedex p ON mp.pID = p.pID
        JOIN (
            SELECT h.instanceID, icon FROM heldItems h, items i, MyPokemon mp2
            WHERE h.instanceID=mp2.instanceID AND h.item=i.name
            UNION
            SELECT instanceID, null as icon FROM MyPokemon mp2 
            WHERE mp2.instanceID NOT IN ( Select instanceID FROM HeldItems )
        ) as ico ON mp.instanceID=ico.instanceID
        LEFT JOIN (
            SELECT name, img_suffix AS imgID, hp, atk, def, spDef, spAtk, speed, type1, type2
            FROM PokemonVariants pv
        ) as v ON v.name=mp.form
        WHERE mp.uID = ?
        ORDER BY pID`;
    const [rows] = await pool.query(sql, [uID]);
    const formatted = rows.map((row) => ({
        id: row.id,
        pID: row.pID,
        name: (row.form === 'original' || row.form === null) ? row.name : row.form,
        types: row.vtype1 ? row.vtype2 ? [row.vtype1, row.vtype2] 
            : [row.vtype1] : row.type2 ? [row.type1, row.type2] : [row.type1],
        stats: {
            hp: row.vhp === null ? row.hp : row.vhp,
            atk: row.vatk === null ? row.atk : row.vatk,
            def: row.vdef === null ? row.def : row.vdef,
            spAtk: row.vspAtk === null ? row.spAtk : row.vspAtk,
            spDef: row.vspDef === null ? row.spDef : row.vspDef,
            speed: row.vspeed === null ? row.speed : row.vspeed,
        },
        evs: {
            hp: row.hpEV,
            atk: row.atkEV,
            def: row.defEV,
            spAtk: row.spAtkEV,
            spDef: row.spDefEV,
            speed: row.speedEV
        },
        ivs: {
            hp: row.hpIV,
            atk: row.atkIV,
            def: row.defIV,
            spAtk: row.spAtkIV,
            spDef: row.spDefIV,
            speed: row.speedIV
        },
        level: row.level,
        nature: row.nature,
        nickname: row.nickname,
        showcase: row.showcase[0]===1,
        item: row.icon,
        imgID: row.imgID ?? row.pID.toString().padStart(3, '0')
    }));
    return formatted;
}
