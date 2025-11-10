const pool = require('../db');

exports.pokedex = async (uID) => {
    const sql = 'SELECT \
        p.pID, \
        p.name, \
        p.type1, p.type2, \
        p.hp, p.atk, p.def, \
        p.spAtk, p.spDef, p.speed, \
        EXISTS ( \
            SELECT 1  \
            FROM MyPokemon mp  \
            WHERE mp.pID = p.pID AND mp.uID = ? \
        ) AS caught \
        FROM Pokedex p';
    const [rows] = await pool.query(sql, [uID]);
    const formatted = rows.map((row) => ({
        pID: row.pID,
        name: row.name,
        types: row.type2 ? [row.type1, row.type2] : [row.type1],
        stats: {
            hp: row.hp,
            atk: row.atk,
            def: row.def,
            spAtk: row.spAtk,
            spDef: row.spDef,
            speed: row.speed
        },
        imgID: row.pID.toString().padStart(3, '0'),
        caught: !!row.caught
    }));
    return formatted;
}

exports.types = async () => {
    const sql = 'SELECT * FROM Types';
    const [rows] = await pool.query(sql, []);
    return rows;
}

exports.names = async () => {
    const sql = 'SELECT name FROM Pokedex ORDER BY name';
    const [rows] = await pool.query(sql, []);
    const formatted = rows.map((row) => row.name);
    return formatted;
}

exports.pokemon = async (pID) => {
    const sql = `
        SELECT 
            pID, 
            name, 
            type1, type2, 
            hp, atk, def, 
            spAtk, spDef, speed, 
            legendary, 
            description
        FROM Pokedex WHERE pID=?`;
    const [rows] = await pool.query(sql, [pID]);
    const formatted = rows.map((row) => ({
                pID: row.pID,
                name: row.name,
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
                imgID: row.pID.toString().padStart(3, '0')
            }));
    return formatted[0];
}

exports.attacks = async (pID) => {
    const sql = '\
        SELECT \
            a.aID, \
            a.attack_name, \
            type, \
            category, \
            power, \
            accuracy, \
            PP, \
            effect, \
            tm \
        FROM Attacks a, LearnableAttacks l \
        WHERE pID=? AND a.aID=l.aID';
    const [rows] = await pool.query(sql, [pID]);
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

exports.evolutions = async (pID) => {
    const sql = `
        WITH tripleEvo AS (
            SELECT
                p1.pID as pID1
              , p1.name as name1
              , p1.type1 as type11
              , p1.type2 as type21
              , p2.pID as pID2
              , p2.name as name2
              , p2.type1 as type12
              , p2.type2 as type22
              , p3.pID as pID3
              , p3.name as name3
              , p3.type1 as type13
              , p3.type2 as type23
            FROM evolutions e1, evolutions e2, Pokedex p1, Pokedex p2, Pokedex p3
            WHERE e1.evolvesInto = e2.evolvesFrom AND p1.pID=e1.evolvesFrom
                AND p2.pID=e1.evolvesInto AND p3.pID=e2.evolvesInto
        ), doubleEvo AS (
            SELECT
                p1.pID as pID1
              , p1.name as name1
              , p1.type1 as type11
              , p1.type2 as type21
              , p2.pID as pID2
              , p2.name as name2
              , p2.type1 as type12
              , p2.type2 as type22
              , NULL as pID3
              , NULL as name3
              , NULL as type13
              , NULL as type23
            FROM evolutions, Pokedex p1, Pokedex p2
            WHERE p1.pID=evolvesFrom AND p2.pID=evolvesInto AND NOT EXISTS (
                SELECT * FROM tripleEvo
                WHERE (evolvesFrom = pID1 AND evolvesInto = pID2)
                OR (evolvesFrom = pID2 AND evolvesInto = pID3)
            )
        )
        SELECT *
        FROM (SELECT * FROM tripleEvo UNION SELECT * FROM doubleEvo) as evo
        WHERE (pID1 = ? OR pID2 = ? OR pID3 = ?);`
    const [rows] = await pool.query(sql, [pID, pID, pID]);
    const formatted = rows.map((row) => ({
        base: {
            pID: row.pID1,
            name: row.name1,
            types: row.type21 ? [row.type11, row.type21] : [row.type11],
            imgID: row.pID1.toString().padStart(3, '0'),
        },
        stage1: {
            pID: row.pID2,
            name: row.name2,
            types: row.type22 ? [row.type12, row.type22] : [row.type12],
            imgID: row.pID2.toString().padStart(3, '0'),
        },
        stage2: {
            pID: row.pID3,
            name: row.name3,
            types: row.type23 ? [row.type13, row.type23] : [row.type13],
            imgID: row.pID3?.toString().padStart(3, '0'),
        }
    }));
    return formatted;
}

exports.variants = async (pID) => {
    const sql = '\
        SELECT \
            pID, \
            name, \
            form, \
            type1, type2, \
            hp, atk, def, \
            spAtk, spDef, speed, \
            mega, \
            description, \
            img_suffix \
        FROM PokemonVariants WHERE pID=?';
    const [rows] = await pool.query(sql, [pID]);
    const formatted = rows.map((row) => ({
        pID: row.pID,
        name: row.name,
        form: row.form,
        types: row.type2 ? [row.type1, row.type2] : [row.type1],
        stats: {
            hp: row.hp,
            atk: row.atk, 
            def: row.def, 
            spAtk: row.spAtk, 
            spDef: row.spDef, 
            speed: row.speed
        },
        mega: row.mega[0] === 1, 
        description: row.description,
        imgID: row.img_suffix
    }));
    return formatted;
}

exports.items = async (pID) => {
    const sql = `\
    (\
        SELECT name, effect, description, icon, null AS variant 
        FROM Items WHERE type!='mega-stones'
    ) UNION (
        SELECT i.name, effect, description, icon, result AS Variant 
        FROM Items i, MegaStones m WHERE type='mega-stones' AND pID=? 
            AND i.name=m.name
    )
    ORDER BY name`;
    const [rows] = await pool.query(sql, [pID]);
    return rows;
}

exports.abilities = async (pID, variant) => {
    const sql = '\
        with aNames as (\
            SELECT DISTINCT(ability) FROM PokemonAbilities \
            WHERE pID=? AND (variant=? || variant=\'original\')\
        ) \
        SELECT a.name, a.effect, a.description \
        FROM aNames n JOIN Abilities a ON n.ability=a.name';
    const [rows] = await pool.query(sql, [pID, variant]);
    return rows;
}
