-- Fancy Feature 5: Display complex Pokedex information and move list
-- complex pokemon info
SELECT p.pid, p.name, p.type1, p.type2, p.HP, p.Atk, p.Def, p.SpAtk, p.SpDef, p.Speed, CAST(p.Legendary AS UNSIGNED) as Legendary, p.Description, UP.caught_count
FROM pokedex p, Users_pokedex UP
WHERE p.pid = UP.pid AND UP.pid = 1;

-- pokemon evolutions
SELECT 
e.evolvesFrom, e.evolvesInto
FROM 
pokedex p, evolutions E 
WHERE (E.evolvesFrom = p.pid OR E.evolvesInto = p.pid) AND p.pid = 1;

-- move list
SELECT LA.aid, A.attack_name, A.type, A.category, A.power, A.accuracy, A.PP, A.effect
FROM attacks A, learnableattacks LA
WHERE LA.pid = 1 AND
	LA.aid = A.aid;
