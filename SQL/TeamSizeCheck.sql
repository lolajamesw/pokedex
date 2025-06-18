--enforces that a user can have no more than 6 pokemon on their team
CREATE ASSERTION max_6_on_team 
CHECK NOT EXISTS(
    SELECT user_id, COUNT(instance_id) AS numTeam FROM(
        SELECT user_id, instance_id 
        FROM MyPokemon 
        WHERE onTeam = 1
    )
    WHERE numTeam > 6
);
