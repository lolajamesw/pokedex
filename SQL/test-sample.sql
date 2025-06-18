-- Basic Feature 3: View Pokedex
SELECT 
    P.pid,
    P.Name,
    P.type1ID,
    P.type2ID,
    P.HP,
    P.Attack,
    P.Defense,
    P.SpAtk,
    P.SpDef,
    P.Speed,
    COUNT(MP.instance_id) AS caught_count
FROM 
    Pokedex P LEFT OUTER JOIN My_pokemon MP 
ON P.pid = MP.pid AND MP.uid = 4
GROUP BY 
    P.pid, P.Name, P.type1ID, P.type2ID, P.HP, P.Attack, P.Defense,
    P.SpAtk, P.SpDef, P.Speed,
ORDER BY 
    P.pid;

--filtering
CREATE VIEW Users_pokedex AS
SELECT 
    P.pid,
    P.Name,
    P.type1ID,
    P.type2ID,
    P.HP,
    P.Attack,
    P.Defense,
    P.SpAtk,
    P.SpDef,
    P.Speed,
    COUNT(MP.instance_id) AS caught_count
FROM 
    Pokedex P LEFT OUTER JOIN My_pokemon MP 
ON P.pid = MP.pid AND MP.uid = 4 
GROUP BY 
    P.pid, P.Name, P.type1ID, P.type2ID, P.HP, P.Attack, P.Defense,
    P.SpAtk, P.SpDef, P.Speed
ORDER BY 
    P.pid;

SELECT * FROM Users_pokedex WHERE type1ID = 'Grass' OR type1ID = 'Grass';

-- Basic Feature 2: Display complex Pokedex information and move list
SELECT 
p.pid, p.name, p.type1ID, p.type2ID, p.HP, p.Attack, p.Defense, p.SpAtk, p.SpDef, p.Speed, p.Legendary, p.Description,
e.pIDfrom, e.pIDinto, UP.caught_count
FROM 
Pokedex p, Evolutions E, users_pokedex UP
WHERE p.pid = UP.pid AND p.pid = {selected_pokemon_pid} 
AND (E.pIDfrom = p.pid OR E.pIDinto = p.pid);

-- move list
SELECT LA.aid, A.attack_name, A.type, A.category, A.power, A.accuracy, A.PP, A.effect
FROM Attacks A, Learnable_attacks LA
WHERE LA.pid = {selected_pokemon_pid} AND
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
