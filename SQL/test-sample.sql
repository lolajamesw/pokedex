-- Basic Feature 3: add a new pokemon instance
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

-- Basic Feature 4: mark a pokemon as favourite
UPDATE MyPokemon
SET favourite = 1
WHERE instanceID = 11;

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
WHERE uid = 6;


-- Basic Feature 4: remove a pokemon from team and add a new one to the team
UPDATE MyPokemon
SET onTeam=0
WHERE instanceID = 6;

UPDATE MyPokemon
SET onTeam = 1 
WHERE instanceID = 8;

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
WHERE uid = 4;