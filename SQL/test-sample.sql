-- Basic Feature 1: View Pokedex
SELECT 
    P.pid,
    P.Name,
    P.type1,
    P.type2,
    P.HP,
    P.Atk,
    P.Def,
    P.SpAtk,
    P.SpDef,
    P.Speed,
    COUNT(MP.instanceID) AS caught_count
FROM 
    pokedex P LEFT OUTER JOIN Mypokemon MP 
ON P.pid = MP.pid AND MP.uid = 4
GROUP BY 
    P.pid, P.Name, P.type1, P.type2, P.HP, P.Atk, P.Def,
    P.SpAtk, P.SpDef, P.Speed
ORDER BY 
    P.pid;

-- filtering
DROP VIEW IF EXISTS `Users_pokedex`;
CREATE VIEW Users_pokedex AS
SELECT 
    P.pid,
    P.Name,
    P.type1,
    P.type2,
    P.HP,
    P.Atk,
    P.Def,
    P.SpAtk,
    P.SpDef,
    P.Speed,
    COUNT(MP.instanceID) AS caught_count
FROM 
    pokedex P LEFT OUTER JOIN Mypokemon MP 
ON P.pid = MP.pid AND MP.uid = 4 
GROUP BY 
    P.pid, P.Name, P.type1, P.type2, P.HP, P.Atk, P.Def,
    P.SpAtk, P.SpDef, P.Speed
ORDER BY 
    P.pid;

SELECT * FROM Users_pokedex WHERE type1 = 'Grass' OR type2 = 'Grass';

-- Basic Feature 2: Display complex Pokedex information and move list
-- complex pokemon info
SELECT p.pid, p.name, p.type1, p.type2, p.HP, p.Atk, p.Def, p.SpAtk, p.SpDef, p.Speed, p.Legendary, p.Description, UP.caught_count
FROM pokedex p, Users_pokedex UP
WHERE p.pid = UP.pid AND UP.pid = 1;

-- pokemon evolutions
SELECT 
e.pIDfrom, e.pIDinto
FROM 
pokedex p, evolutions E 
WHERE (E.pIDfrom = p.pid OR E.pIDinto = p.pid) AND p.pid = 1;

-- move list
SELECT LA.aid, A.attack_name, A.type, A.category, A.power, A.accuracy, A.PP, A.effect
FROM attacks A, learnableattacks LA
WHERE LA.pid = 1 AND
	LA.aid = A.aid;

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
