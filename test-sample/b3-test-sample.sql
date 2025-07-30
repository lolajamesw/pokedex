-- Basic Feature 3: mark pokemon 
-- mark a pokemon as favourite
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


-- remove a pokemon from team and add a new one to the team
UPDATE MyPokemon
SET onTeam=0
WHERE instanceID = 6;

UPDATE MyPokemon
SET onTeam = 1 
WHERE instanceID = 8;

-- view results
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

