WITH FX as (
	SELECT type1, type2, (
		CASE 
        WHEN double_strength=1 THEN 2
        WHEN half_strength=1 THEN 0.5
        ELSE 0
        END
	) as effect FROM TypeFX
), `full` as (
	SELECT * FROM FX
    UNION
    SELECT t1.type as type1, t2.type as type2, 1 as effect
    FROM Types t1, Types t2
    WHERE t1.type!=t2.type AND t2.type NOT IN (
		SELECT type2 FROM typeFX t WHERE t.type1=t1.type
	)
), crossed as (
	SELECT t1.type1 typeA, t2.type1 typeB, t1.type2, 
    (t1.effect*t2.effect) as effect
    FROM `full` t1, `full` t2 WHERE t1.type1!=t2.type1 AND t1.type2=t2.type2
)

SELECT type2, SUM(effect) as effects FROM (
	SELECT type2, effect
    FROM crossed WHERE typeA IN (
		SELECT type1 from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=typeB
	) UNION
    SELECT type2, effect FROM `full` WHERE type1 IN (
		SELECT type1 FROM Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=""
	)
) as totaled
GROUP BY type2;
    
    
    SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1;
    
WITH FX as (
	SELECT type1, type2, (
		CASE 
        WHEN double_strength=1 THEN 2
        WHEN half_strength=1 THEN 0.5
        ELSE 0
        END
	) as effect FROM TypeFX
), `full` as (
	SELECT * FROM FX
    UNION
    SELECT t1.type as type1, t2.type as type2, 1 as effect
    FROM Types t1, Types t2
    WHERE t1.type!=t2.type AND t2.type NOT IN (
		SELECT type2 FROM typeFX t WHERE t.type1=t1.type
	)
), crossed1 as (
	SELECT t1.type1 typeA, t2.type1 typeB, t1.type2, 
    (t1.effect*t2.effect) as effect
    FROM `full` t1, `full` t2 WHERE t1.type1!=t2.type1 AND t1.type2=t2.type2
), crossed2 as (
	SELECT t1.type1, t1.type2 as typeA, t2.type2 as typeB, 
    (t1.effect*t2.effect) as effect
    FROM full t1, full t2 WHERE t1.type1=t2.type1 AND t1.type2!=t2.type2
)

SELECT atk.type, SUM(atk.effect) as atkSum, SUM(def.effect) as defSum FROM (
	SELECT type1 type, effect*(
		SELECT COUNT(*) from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type1=typeA AND p.type2=typeB
	) as effect
    FROM crossed2 WHERE typeA IN (
		SELECT p.type1 from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=typeB
	) UNION
    SELECT type1 type, effect*(
		SELECT COUNT(*) from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type1=full.type2 AND p.type2=""
	) FROM `full` WHERE type2 IN (
		SELECT p.type1 FROM Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=""
	)
) as def, (
	SELECT type2 as type, effect*(
		SELECT COUNT(*) from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type1=typeA AND p.type2=typeB
	) as effect
    FROM crossed1 WHERE typeA IN (
		SELECT type1 from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=typeB
	) UNION
    SELECT type2 type, effect*(
		SELECT COUNT(*) from Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type1=full.type1 AND p.type2=""
	) as effect FROM `full` WHERE type1 IN (
		SELECT type1 FROM Pokedex p WHERE pID IN (
			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
        )
        AND p.type2=""
	)
) as atk WHERE def.type=atk.type
GROUP BY atk.type;

-- SELECT type2, SUM(effect) as effects FROM (
-- 	SELECT type2, effect
--     FROM crossed1 WHERE typeA IN (
-- 		SELECT type1 from Pokedex p WHERE pID IN (
-- 			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
--         )
--         AND p.type2=typeB
-- 	) UNION
--     SELECT type2, effect FROM `full` WHERE type1 IN (
-- 		SELECT type1 FROM Pokedex p WHERE pID IN (
-- 			SELECT pID FROM MyPokemon WHERE uID=10 AND onteam=1
--         )
--         AND p.type2=""
-- 	)
-- ) as totaled
-- GROUP BY type2;