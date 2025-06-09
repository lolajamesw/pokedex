--Adds a new pokemon with the given traits to the user's list of pokemon
INSERT INTO MyPokemon(pokemon_id, user_id, nickname, level, date_added)
VALUES ( {species id}, {user id}, {nickname}, {level}, NOW());

--from the entry page:
--species id comes from a searchable dropdown of species names from the pokedex
--user id comes from a stored variable for the signed in user
--nickname comes from a text box
--level comes from a text box (should be an integer)