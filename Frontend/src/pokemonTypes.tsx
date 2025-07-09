type PokemonStatType = {
    hp: number,
    atk: number,
    def: number,
    spAtk: number,
    spDef: number,
    speed: number
}

type AttackStatType = {
    power: number,
    accuracy: number,
    pp: number
}

type AttackDetailType = {
    id: number,
    name: string,
    type: string,
    category: string,
    stats: AttackStatType,
    effect: string
}

type PokemonDetailType = {
  id: number;
  name: string;
  types: string[],
  stats: PokemonStatType,
  legendary: boolean,
  description: string,
  attacks: AttackDetailType[],
  caught_count: number
};

type PokemonSummary = {
    id: number,
    name: string,
    types: string[],
    image: string
}

function PokemonSummary(id, name, types, img) {
  this.id = id; this.name = name; this.types=types; this.image=img;
}

type Evolution = {
    base: PokemonSummary,
    stage1: PokemonSummary,
    stage2: PokemonSummary
}