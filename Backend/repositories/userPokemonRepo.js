const pool = require('../db');

exports.pokemon = async (instanceID) => {
    const sql = '\
    SELECT \
        mp.instanceID, mp.pID, mp.form, p.name, nickname, \
        mp.nature, mp.ability, level, type1, type2, \
        favourite, legendary, p.description,\
        hp, atk, def, spAtk, spDef, speed, \
        mi.item, mi.icon \
    FROM Pokedex p \
    RIGHT JOIN MyPokemon mp ON p.pID=mp.pID \
    LEFT JOIN (\
        SELECT h.item, i.icon, h.instanceID \
        FROM Items i, HeldItems h \
        WHERE h.instanceID=? AND i.name=h.item\
    ) as mi ON mi.instanceID=mp.instanceID \
    WHERE mp.instanceID=?';
    const [rows] = await pool.query(sql, [instanceID, instanceID]);
    const formatted = rows.map((row) => ({
        id: row.instanceID,
        pID: row.pID,
        name: row.name,
        form: row.form,
        nickname: row.nickname,
        level: row.level,
        nature: row.nature,
        ability: row.ability,
        favourite: row.favourite[0]===1,
        tIDs: [],
        types: row.type2 ? [row.type1, row.type2] : [row.type1],
        stats: {
            hp: row.hp,
            atk: row.atk,
            def: row.def,
            spAtk: row.spAtk,
            spDef: row.spDef,
            speed: row.speed
        },
        legendary: row.legendary[0] === 1, 
        description: row.description,
        heldItem: row.item,
        heldItemIcon: row.icon,
        imgID: row.pID.toString().padStart(3, '0')
    }));
    return formatted[0];
}

exports.addPokemon = async (uID, name, nickname, level) => {
    const pIDsql = 'SELECT pID FROM Pokedex WHERE LOWER(name) = LOWER(?)'
    const [ pIDs ] = await pool.query(pIDsql, name);
    if (pIDs.length === 0) 
        return res.status(400).send("Pokémon not found in Pokedex.");
    const pID = pIDs[0].pID;

    const sql = 'INSERT INTO MyPokemon(\
        pID, uID, nickname, form, nature, level, dateAdded, \
        hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV, \
        hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV \
    ) \
    VALUES (\
        ?, ?, ?, ?, ?, ?, NOW(), \
        ?, ?, ?, ?, ?, ?, \
        ?, ?, ?, ?, ?, ?\
    )';
    await pool.query(sql, [
        pID, uID, nickname || null, 'original', 'Hardy', level, 
        0, 0, 0, 0, 0, 0,
        31, 31, 31, 31, 31, 31
    ]);
    return "Pokémon added successfully.";
}

exports.delPokemon = async (instanceID) => {
    const sql = 'DELETE FROM MyPokemon WHERE instanceID=?';
    await pool.query(sql, [instanceID]);
    return "Pokémon forgotten successfully";
}

exports.teraType = async (instanceID) => {
    const sql = 'SELECT teraType FROM MyPokemon WHERE instanceID=?';
    const [rows] = await pool.query(sql, [instanceID]);
    return rows[0];
}

exports.setTeraType = async (instanceID, type) => {
    const sql = 'UPDATE MyPokemon SET teraType=? WHERE instanceID=?';
    await pool.query(sql, [type, instanceID]);
    return "Pokémon tera type set successfully";
}

exports.EVsIVs = async (instanceID) => {
    const sql = '\
    SELECT \
        hpEV, atkEV, defEV, spAtkEV, spDefEV, speedEV, \
        hpIV, atkIV, defIV, spAtkIV, spDefIV, speedIV \
    FROM MyPokemon WHERE instanceID=?';
    const [rows] = await pool.query(sql, [instanceID]);
    return rows[0];
}

exports.setEVsIVs = async (instanceID, vals) => {
    const sql = '\
    UPDATE MyPokemon \
    SET hpEV=?, atkEV=?, defEV=?, spAtkEV=?, spDefEV=?, speedEV=?, \
    hpIV=?, atkIV=?, defIV=?, spAtkIV=?, spDefIV=?, speedIV=? \
    WHERE instanceID=?';
    const [rows] = await pool.query(sql, [
        vals.hpEV, vals.atkEV, vals.defEV, vals.spAtkEV, vals.spDefEV, vals.speedEV,
        vals.hpIV, vals.atkIV, vals.defIV, vals.spAtkIV, vals.spDefIV, vals.speedIV,
        instanceID
    ]);
    return "Pokémon EVs and IVs set successfully";
}

exports.moves = async (instanceID) => {
    const sql = '\
    SELECT \
        a.aID, a.attack_name, type, category, power, accuracy, PP, effect, tm \
    FROM Attacks a, CurrentAttacks c \
    WHERE instanceID=? AND a.aID=c.aID';
    const [rows] = await pool.query(sql, [instanceID]);
    const formatted = rows.map((row) => ({
        id: row.aID,
        name: row.attack_name,
        type: row.category,
        category: row.type,
        stats: {
            power: row.power,
            accuracy: row.accuracy,
            pp: row.PP
        },
        effect: row.effect,
        TM: row.tm[0]===1
    }));
    return formatted;
}

exports.learnMove = async (instanceID, aID) => {
    const sql = 'INSERT INTO CurrentAttacks (instanceID, aID) VALUES (?, ?)';
    const [rows] = await pool.query(sql, [instanceID, aID]);
    return "Pokémon move learned successfully";
}

exports.forgetMove = async (instanceID, aID) => {
    const sql = 'DELETE FROM CurrentAttacks WHERE instanceID = ? AND aID = ?';
    const [rows] = await pool.query(sql, [instanceID, aID]);
    return "Pokémon move forgotten successfully";
}

exports.teams = async (instanceID) => {
    const sql = 'SELECT tID FROM Teams WHERE  \
        p1=? OR p2=? OR p3=? OR p4=? OR p5=? OR p6=?';
    const [rows] = await pool.query(
        sql, 
        [instanceID, instanceID, instanceID, instanceID, instanceID, instanceID]
    );
    const formatted = rows.map((row) => (row.tID));
    return formatted;
}

exports.setNature = async (instanceID, nature) => {
    const sql = 'UPDATE MyPokemon SET nature=? WHERE instanceID=?';
    const [rows] = await pool.query(sql, [nature, instanceID]);
    return 'Pokémon nature set successfully';
}

exports.setAbility = async (instanceID, ability) => {
    const sql = 'UPDATE MyPokemon SET ability=? WHERE instanceID=?';
    const [rows] = await pool.query(sql, [ability, instanceID]);
    return 'Pokémon ability set successfully';
}

exports.setVariant = async (instanceID, variant) => {
    const sql = 'UPDATE MyPokemon SET form=? WHERE instanceID=?';
    const [rows] = await pool.query(sql, [variant, instanceID]);
    return 'Pokémon variant set successfully';
}

exports.setFavourite = async (instanceID, favourite) => {
    const sql = 'UPDATE MyPokemon SET favourite=? WHERE instanceID=?';
    const [rows] = await pool.query(sql, [favourite ? 1 : 0, instanceID]);
    return 'Pokémon set as favourite successfully';
}

exports.deleteItem = async (instanceID) => {
    const sql = 'DELETE FROM HeldItems WHERE instanceID=?'
    await pool.query(sql, [instanceID]);
    return 'Pokémon item dropped successfully';
}

exports.setItem = async (instanceID, item) => {
    await this.deleteItem(instanceID);
    const sql = 'INSERT INTO HeldItems(instanceID, item) VALUES(?, ?)';
            
    const [rows] = await pool.query(sql, [instanceID, item]);
    return 'Pokémon item set successfully';
}

exports.addMegaStone = async (instanceID) => {
    const sql = 'SELECT name FROM MegaStones WHERE result=(SELECT form FROM MyPokemon WHERE instanceID=?)';
    const [megaStones] = await pool.query(sql, [instanceID]);
    if (megaStones.length < 1) throw new Error('Could not find related mega stone');
    else await this.setItem(instanceID, megaStones[0].name);
    return 'Pokémon Mega Stone set successfully';
}
