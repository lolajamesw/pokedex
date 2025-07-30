-- Basic Feature 2: add a new pokemon instance
INSERT INTO MyPokemon(pid, uid, nickname, level, dateAdded)
VALUES ( 4, 5, 'Lemon', 3, NOW());

SELECT 
    instanceId,
    pid,
    uid,
    nickname,
    level,
    CAST(favourite AS UNSIGNED) AS favourite,
    CAST(onTeam AS UNSIGNED) AS onTeam,
    CAST(showcase AS UNSIGNED) AS showcase,
    dateAdded
FROM MyPokemon 
WHERE uid = 5;
