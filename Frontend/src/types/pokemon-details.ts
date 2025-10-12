export interface Item{
  name: string;
  effect: string;
  description: string;
  icon: string;
  variant: string | null
}

export interface Evolution {
  base: PokemonSummary;
  stage1: PokemonSummary;
  stage2: PokemonSummary;
};

type PokemonStats = {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
};

type AttackStatType = {
  power: number;
  accuracy: number;
  pp: number;
};

export interface AttackDetails {
  id: number;
  name: string;
  type: string;
  category: string;
  stats: AttackStatType;
  effect: string;
  TM: boolean;
};

export interface CardPokemon {
    pID: number;
    name: string;
    form?: string;
    types: string[];
    description?: string;
    stats: PokemonStats;
    imgID: string;
    mega?: boolean;
};

export interface PokedexPokemon {
    pID: number;
    name: string;
    form: string;
    types: string[];
    stats: PokemonStats;
    legendary: boolean;
    description: string;
    attacks: AttackDetails[];
    imgID: string;
};

export interface MyPokemon {
    id: number; // instance ID (user-owned Pokémon)
    pID: number; // Pokémon species ID
    form: string;
    imgID: string;
    name: string;
    nickname: string;
    level: number;
    onTeam: boolean;
    favourite: boolean;
    types: string[];
    stats: PokemonStats;
    legendary: boolean;
    description: string;
    attacks: AttackDetails[];
    knownAttacks: AttackDetails[];
    heldItem: string | null;
    heldItemIcon: string | null;
}

export interface PokemonSummary {
  pID: number;
  name: string;
  types: string[];
  imgID: string;
};
