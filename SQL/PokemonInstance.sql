--selects all the information for a specific pokemon instance owned by the user
--This will not be displayed in a table format because there is only one pokemon to see.
SELECT 
    nickname,
    level,
    Pokedex.name AS Species,
    type,
    favourite,
    onteam,
    showcase,
    date_added
FROM (MyPokemon JOIN Pokedex ON MyPokemon.pokemon_id = Pokedex.pid)
WHERE pokemon_id = {pid} AND user_id = {uid} AND instance_id = {iid};

--to populate the current attack list:
SELECT
    attack_name, 
    type, 
    category, 
    power, 
    accuracy, 
    PP, 
    effect
FROM Attacks, CurrentAttacks
WHERE CurrentAttacks.aid = Atacks.aid 
    AND CurrentAttacks.pid = {pid}
    AND CurrentAttacks.uid = {uid}
    AND CurrentAttacks.instance_id = {iid};

--pid, uid, and iid, are all supplied by the calling program, usually from selecting an entry in the "My Pokemon" table
