INSERT INTO `Types`(`type`) VALUES 
('Normal'), ('Fire'), ('Water'), ('Electric'), ('Grass'),
('Ice'), ('Fighting'), ('Poison'), ('Ground'), ('Flying'),
('Psychic'), ('Bug'), ('Rock'), ('Ghost'), ('Dragon'), 
('Steel'), ('Dark'), ('Fairy')
;
DELETE FROM TypeFX WHERE True;
INSERT INTO `TypeFX`(type1, type2, double_strength, half_strength, no_impact) VALUES 
('Normal', 'Rock', 0, 1, 0), ('Normal', 'Ghost', 0, 0, 1), ('Normal', 'Steel', 0, 1, 0),

('Fire', 'Fire', 0, 1, 0), ('Fire', 'Water', 0, 1, 0), ('Fire', 'Grass', 1, 0, 0),
('Fire', 'Ice', 1, 0, 0), ('Fire', 'Bug', 1, 0, 0), ('Fire', 'Rock', 0, 1, 0), 
('Fire', 'Dragon', 0, 1, 0), ('Fire', 'Steel', 1, 0, 0),

('Water', 'Fire', 1, 0, 0), ('Water', 'Water', 0, 1, 0), ('Water', 'Grass', 0, 1, 0),
('Water', 'Ground', 1, 0, 0), ('Water', 'Rock', 1, 0, 0), ('Water', 'Dragon', 0, 1, 0),

('Electric', 'Water', 1, 0, 0), ('Electric', 'Electric', 0, 1, 0), ('Electric', 'Grass', 0, 1, 0),
('Electric', 'Ground', 0, 0, 1), ('Electric', 'Flying', 1, 0, 0), ('Electric', 'Dragon', 0, 1, 0),

('Grass', 'Fire', 0, 1, 0), ('Grass', 'Water', 1, 0, 0), ('Grass', 'Grass', 0, 1, 0),
('Grass', 'Poison', 0, 1, 0), ('Grass', 'Ground', 1, 0, 0), ('Grass', 'Flying', 0, 1, 0),
('Grass', 'Bug', 0, 1, 0), ('Grass', 'Rock', 1, 0, 0), ('Grass', 'Dragon', 0, 1, 0),
('Grass', 'Steel', 0, 1, 0),

('Ice', 'Water', 0, 1, 0), ('Ice', 'Grass', 1, 0, 0), ('Ice', 'Ice', 0, 1, 0),
('Ice', 'Ground', 1, 0, 0), ('Ice', 'Flying', 1, 0, 0), ('Ice', 'Dragon', 1, 0, 0),
('Ice', 'Steel', 0, 1, 0),

('Poison', 'Grass', 1, 0, 0), ('Poison', 'Poison', 0, 1, 0), ('Poison', 'Ground', 0, 1, 0), 
('Poison', 'Rock', 0, 1, 0), ('Poison', 'Ghost', 0, 1, 0),
('Poison', 'Steel', 0, 0, 1), ('Poison', 'Fairy', 1, 0, 0),

('Ground', 'Fire', 1, 0, 0), ('Ground', 'Electric', 1, 0, 0), ('Ground', 'Grass', 0, 1, 0),
('Ground', 'Poison', 1, 0, 0), ('Ground', 'Flying', 0, 0, 1), ('Ground', 'Bug', 0, 1, 0),
('Ground', 'Rock', 1, 0, 0), ('Ground', 'Steel', 1, 0, 0),

('Flying', 'Electric', 0, 1, 0), ('Flying', 'Grass', 1, 0, 0), ('Flying', 'Fighting', 1, 0, 0),
('Flying', 'Bug', 1, 0, 0), ('Flying', 'Rock', 0, 1, 0), ('Flying', 'Steel', 0, 1, 0),

('Psychic', 'Fighting', 1, 0, 0), ('Psychic', 'Poison', 1, 0, 0), 
('Psychic', 'Psychic', 0, 1, 0), ('Psychic', 'Steel', 0, 1, 0), ('Psychic', 'Dark', 0, 0, 1),

('Bug', 'Fire', 0, 1, 0), ('Bug', 'Grass', 1, 0, 0), ('Bug', 'Fighting', 0, 1, 0),
('Bug', 'Poison', 0, 1, 0), ('Bug', 'Flying', 0, 1, 0), ('Bug', 'Psychic', 1, 0, 0),
('Bug', 'Ghost', 0, 1, 0), ('Bug', 'Steel', 0, 1, 0), ('Bug', 'Dark', 1, 0, 0), 
('Bug', 'Fairy', 0, 1, 0),

('Rock', 'Fire', 1, 0, 0), ('Rock', 'Ice', 1, 0, 0), ('Rock', 'Fighting', 0, 1, 0),
('Rock', 'Ground', 0, 1, 0), ('Rock', 'Flying', 1, 0, 0), ('Rock', 'Bug', 1, 0, 0),
('Rock', 'Steel', 0, 1, 0),

('Ghost', 'Normal', 0, 0, 1), ('Ghost', 'Psychic', 0, 0, 1), ('Ghost', 'Ghost', 1, 0, 0),
('Ghost', 'Dark', 0, 1, 0),

('Dragon', 'Dragon', 1, 0, 0), ('Dragon', 'Steel', 0, 1, 0), ('Dragon', 'Fairy', 0, 0, 1),

('Fighting', 'Normal', 1, 0, 0), ('Fighting', 'Flying', 0, 1, 0), ('Fighting', 'Poison', 0, 1, 0), 
('Fighting', 'Rock', 1, 0, 0), ('Fighting', 'Bug', 0, 1, 0), ('Fighting', 'Ghost', 0, 0, 1),
('Fighting', 'Steel', 1, 0, 0), ('Fighting', 'Psychic', 0, 1, 0), ('Fighting', 'Ice', 1, 0, 0),
('Fighting', 'Dark', 1, 0, 0), ('Fighting', 'Fairy', 0, 1, 0),

('Steel', 'Rock', 1, 0, 0), ('Steel', 'Steel', 0, 1, 0), ('Steel', 'Fire', 0, 1, 0), 
('Steel', 'Water', 0, 1, 0), ('Steel', 'Psychic', 0, 1, 0), ('Steel', 'Ice', 1, 0, 0), 
('Steel', 'Fairy', 1, 0, 0),

('Dark', 'Fighting', 0, 1, 0), ('Dark', 'Ghost', 1, 0, 0), ('Dark', 'Psychic', 1, 0, 0), 
('Dark', 'Dark', 0, 1, 0), ('Dark', 'Fairy', 0, 1, 0), 

('Fairy', 'Fighting', 1, 0, 0), ('Fairy', 'Poison', 0, 1, 0), ('Fairy', 'Steel', 0, 1, 0), 
('Fairy', 'Fire', 0, 1, 0), ('Fairy', 'Dragon', 1, 0, 0), ('Fairy', 'Dark', 1, 0, 0)
;