--Retrieves information for a user's profile
SELECT 
    username,
    Name,
    tradeCount
FROM User;

--Showcase would also be displayed on the profile page
SELECT 
    nickname,
    level,
    Pokedex.name AS Species
FROM MyPokemon JOIN Pokedex ON MyPokemon.pokemon_id = Pokedex.pid
WHERE MyPokemon.showcase = 1;

