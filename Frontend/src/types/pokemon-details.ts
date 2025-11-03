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

export interface PokemonStats {
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

export interface MyCardPokemon {
    pID: number;
    id: number;
    name: string;
    nickname?: string;
    types: string[];
    stats: PokemonStats;
    level: number
    imgID: string;
    mega?: boolean;
    item: string | null;
};

export interface Ability {
    name: string;
    effect: string;
    description: string;

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
    nature: string;
    ability: string;
    tIDs: number[];
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
  id: number;
  types: string[];
  name: string;
  nickname?: string;
  item?: string;
  tID?: number | null;
  imgID: string;
};

export interface EffectType {
  type: string;
  atkAvg: number;
  defAvg: number;
}

export interface User {
  id: number;
  tradeCount: number;
  displayName: string;
  username: string;
}

export interface Team {
  id: number;
  name: string;
  pokemon: PokemonSummary[];
  typeSummary: EffectType[];
  showTypeSummary: boolean;
}

export interface Nature {
  nature: string;
  strength: keyof PokemonStats;
  weakness: keyof PokemonStats;
}

export const natures: Nature[] = [
  {
    nature: "Hardy",
    strength: "atk",
    weakness: "atk"
  }, 
  {
    nature: "Lonely",
    strength: "atk",
    weakness: "def"
  }, 
  {
    nature: "Adamant",
    strength: "atk",
    weakness: "spAtk"
  }, 
  {
    nature: "Naughty",
    strength: "atk",
    weakness: "spDef"
  }, 
  {
    nature: "Brave",
    strength: "atk",
    weakness: "speed"
  }, 
  {
    nature: "Bold",
    strength: "def",
    weakness: "atk"
  }, 
  {
    nature: "Docile",
    strength: "def",
    weakness: "def"
  }, 
  {
    nature: "Impish",
    strength: "def",
    weakness: "spAtk"
  }, 
  {
    nature: "Lax",
    strength: "def",
    weakness: "spDef"
  }, 
  {
    nature: "Relaxed",
    strength: "def",
    weakness: "speed"
  },
  {
    nature: "Modest",
    strength: "spAtk",
    weakness: "atk"
  }, 
  {
    nature: "Mild",
    strength: "spAtk",
    weakness: "def"
  }, 
  {
    nature: "Bashful",
    strength: "spAtk",
    weakness: "spAtk"
  }, 
  {
    nature: "Rash",
    strength: "spAtk",
    weakness: "spDef"
  }, 
  {
    nature: "Quiet",
    strength: "spAtk",
    weakness: "speed"
  },
  {
    nature: "Calm",
    strength: "spDef",
    weakness: "atk"
  }, 
  {
    nature: "Gentle",
    strength: "spDef",
    weakness: "def"
  }, 
  {
    nature: "Careful",
    strength: "spDef",
    weakness: "spAtk"
  }, 
  {
    nature: "Quirky",
    strength: "spDef",
    weakness: "spDef"
  }, 
  {
    nature: "Sassy",
    strength: "spDef",
    weakness: "speed"
  },
  {
    nature: "Timid",
    strength: "speed",
    weakness: "atk"
  }, 
  {
    nature: "Hasty",
    strength: "speed",
    weakness: "def"
  }, 
  {
    nature: "Jolly",
    strength: "speed",
    weakness: "spAtk"
  }, 
  {
    nature: "Naive",
    strength: "speed",
    weakness: "spDef"
  }, 
  {
    nature: "Serious",
    strength: "speed",
    weakness: "speed"
  }, 
]
