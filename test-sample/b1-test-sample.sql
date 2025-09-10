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