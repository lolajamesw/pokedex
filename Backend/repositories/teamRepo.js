const pool = require('../db');

exports.teams = async (uID) => {
    const sql='SELECT * FROM Teams WHERE uID=?';
    const [rows] = await pool.query(sql, [uID]);
    const formatted = rows.map((row) => ({
        id: row.tID,
        name: row.name,
        pokemon: [row.p1, row.p2, row.p3, row.p4, row.p5, row.p6]
            .filter((p) => p !== null)
            .map((p) => ({id: p}))
    }));
    return formatted;
};

exports.create = async (uID, name) => {
    const sql='INSERT INTO Teams(uID, name) VALUES (?, ?)';
    const [rows] = await pool.query(sql, [uID, name]);
    return {
        message: 'Team added successfully',
        tID: rows.insertId
    };
};

exports.delete = async (tID) => {
    const sql='DELETE FROM Teams WHERE tID=?';
    const [rows] = await pool.query(sql, [tID]);
    return 'Team deleted successfully';
};

exports.setPokemon = async (tID, ids) => {
    const sql='\
    UPDATE Teams \
    SET \
    p1=?, p2=?, p3=?, p4=?, p5=?, p6=? \
    WHERE tID=?';
    await pool.query(
        sql, 
        [ids[0], ids[1], ids[2], ids[3], ids[4], ids[5], tID]
    );
    return 'Team Pokemon updated successfully';

};

exports.setName = async (tID, name) => {
    const sql='UPDATE Teams SET name=? WHERE tID=?';
    await pool.query(sql, [name, tID]);
    return 'Team name updated successfully';

};