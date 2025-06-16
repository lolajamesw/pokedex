--need some kind of check on quantities
--inputs: {current_user_id, pokemon_species_id, pokemon_instance_id, fav, show, team}
UPDATE MyPokemon
SET favourite = fav, showcase = show, onTeam = team 
WHERE user_id = current_user_id AND pokemon_id = pokemon_species_id AND instance_id = pokemon_instance_id;