SELECT
	pID,
    name,
    type1,
    type2,
    hp,
    atk,
    def,
    spAtk,
    spDef,
    speed,
    CAST(legendary AS UNSIGNED) AS legendary
FROM pokedex;
SELECT * FROM attacks;
SELECT * FROM learnableattacks;
SELECT * FROM user;
SELECT 
    instanceId,
    pid,
    uid,
    nickname,
    level,
    CAST(favourite AS UNSIGNED) AS favourite, -- list columns explicitly so we can cast our bits to unsigned ints for display
    CAST(onTeam AS UNSIGNED) AS onTeam,
    CAST(showcase AS UNSIGNED) AS showcase,
    dateAdded
FROM MyPokemon;
