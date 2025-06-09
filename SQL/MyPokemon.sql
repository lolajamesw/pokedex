--Selects all of the user's caught pokemon instances, along with some relevant species information
WITH fulldata AS (SELECT * FROM MyPokemon JOIN Pokedex ON MyPokemon.pokemon_id = Pokedex.pid)
SELECT --user can choose columns, ordering, and filtering (where)
    nickname,
    level,
    Pokedex.name AS Species,
    favourite,
    onteam,
    showcase
FROM fulldata
ORDER BY DateAdded DESC;    
