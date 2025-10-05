/**
 * MyPokeDetail.tsx
 * 
 * A React component for displaying detailed information about a user's Pokémon, 
 * including stats, moves, evolutions, and trade history. 
 * Allows interactions such as teaching/forgetting moves and marking a Pokémon as a favourite.
 */

import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import pokeIcon from "./assets/pokeIcon.png";

// UI components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx";
import { ArrowRight, Shield, Swords, Footprints, Heart, X, 
          Plus, Star, Sparkles, ArrowLeftRight, Calendar, User, LogOut } from "lucide-react";

// Styles
import "./pokedex.css";
import "./details.css";
import "./profile.css";

/* ---------- Type Definitions ---------- */

/**
 * Represents a Pokémon involved in a trade.
 * (Temporary, will be removed with market system.)
 */
type TradedPokemonType = {
  pokemon: string;
  nickname: string;
  level: number;
  types: string[];
};

/**
 * Represents a single trade record.
 */
type TradeType = {
  id: number;
  date: Date;
  fromTrainer: string;
  toTrainer: string;
  tradedAway: TradedPokemonType;
  tradedFor: TradedPokemonType;
  notes: string;
};

/**
 * Pokémon stat distribution.
 */
type PokemonStatType = {
  hp: number;
  atk: number;
  def: number;
  spAtk: number;
  spDef: number;
  speed: number;
};

/**
 * Attack stats (power, accuracy, etc.).
 */
type AttackStatType = {
  power: number;
  accuracy: number;
  pp: number;
};

/**
 * Detailed attack info.
 */
type AttackDetailType = {
  id: number;
  name: string;
  type: string;
  category: string;
  stats: AttackStatType;
  effect: string;
  TM: boolean;
};

/**
 * Full Pokémon detail object.
 */
type PokemonDetailType = {
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
  stats: PokemonStatType;
  legendary: boolean;
  description: string;
  learnableAttacks: AttackDetailType[];
  knownAttacks: AttackDetailType[];
  heldItem: string | null;
  heldItemIcon: string | null;
};

type PokemonVariant = {
  pID: number,
  name: string,
  form: string,
  types: string[],
  description: string,
  stats: PokemonStatType,
  mega: boolean,
  imgID: string
}

/**
 * Compact Pokémon info used for evolution chains.
 */
type PokemonSummary = {
  id: number;
  name: string;
  types: string[];
  image: string;
};

/**
 * Evolution chain for a species.
 */
type Evolution = {
  base: PokemonSummary;
  stage1: PokemonSummary;
  stage2: PokemonSummary;
};

type Item = {
  name: string;
  effect: string;
  description: string;
  icon: string;
}


/* ---------- Main Component ---------- */

const MyPokeDetail = () => {
  // Grab Pokémon instance and species IDs from URL params
  const { id, pID } = useParams<{ id: string; pID: string }>();

  // State
  const [pokemon, setPokemonDetail] = useState<PokemonDetailType | null>(null);
  const [variants, setVariants] = useState<PokemonVariant[]>([]);
  const [evolutions, setEvolutions] = useState<Evolution[] | null>(null);
  // const [tradeHistory, setTradeHistory] = useState<TradeType[]>([]);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [expandAll, setExpandAll] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [collapsedItems, setCollapsedItems] = useState(new Set(items.map((item) => item.name)));

  /**
   * Fetch Pokémon details, evolutions, and trade history from backend.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("id:", id, "pID:", pID);

        // 1. Fetch overview info
        const overviewRes = await fetch(`http://localhost:8081/userPokemon/${id}`);
        const overviewData = await overviewRes.json();

        // 2. Fetch learnable attacks
        const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pID}`);
        const attackData = await attackRes.json();

        // 3. Fetch known attacks
        const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${id}`);
        const knownData = await knownRes.json();

        // Combine into Pokémon detail object
        const combined: PokemonDetailType = {
          ...overviewData,
          learnableAttacks: attackData,
          knownAttacks: knownData,
        };
        setPokemonDetail(combined);

        // 4. Fetch evolution data
        const evolutionRes = await fetch(`http://localhost:8081/pokemon/evolutions/${pID}`);
        const evolutionData = await evolutionRes.json();
        console.log("fetched evolution data");
        setEvolutions(evolutionData);

        // 5. Fetch item data
        const itemsRes = await fetch(`http://localhost:8081/pokemon/items/${pID}`);
        const itemData = await itemsRes.json();
        console.log("fetched item data");
        setItems(itemData);
        setCollapsedItems(new Set(items.map((item) => item.name)))

        // 6. Fetch variant data
        const variantRes = await fetch(`http://localhost:8081/pokemon/variants/${pID}`);
        const variantData = await variantRes.json();
        variantData.map((data: PokemonVariant) => {
          data.description = data.description ?? combined.description;
          return data;
        });
        console.log("fetched variant data");
        let original = variantData.filter((data: PokemonVariant) => !(data.imgID));
        if (original.length > 0) {
          original[0].imgID = combined.imgID;
          setPokemonDetail((prev) => ({
            ...prev,
            name: original[0].name,
            form: original[0].form,
            types: original[0].types,
            description: original[0].description,
            stats: original[0].stats,
            imgID: original[0].imgID
          } as PokemonDetailType))
        }
        else {
          original = {
            pID: combined.pID, 
            name: combined.name, 
            form: 'original',
            types: combined.types,
            description: combined.description,
            stats: combined.stats,
            imgID: combined.imgID
          } as PokemonVariant;
          variantData.push(original);
        }
        console.log(original)
        setVariants(variantData);
        console.log(variantData);

        // 6. Fetch trade history
        // const tradeRes = await fetch(`http://localhost:8081/pastTrades/${id}`);
        // const tradeData = await tradeRes.json();
        // console.log("fetched trade data");
        // setTradeHistory(tradeData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  if (!pokemon) return <div>Loading...first {id}</div>;

  /* ---------- Evolution Helpers ---------- */

  const placeholderImg = "/placeholder.png";
  let evolutionaryLine: PokemonSummary[] = [];

  if (evolutions) {
    // Build evolution line depending on branching
    if (evolutions.length > 1 && evolutions[0].stage1.id === evolutions[1].stage1.id)
      evolutionaryLine = [evolutions[0].base, evolutions[0].stage1];
    else if (evolutions.length === 0)
      evolutionaryLine = [{id: pokemon.pID, name: pokemon.name, types: pokemon.types, image: placeholderImg} as PokemonSummary];
    else if (!evolutions[0].stage2.id)
      evolutionaryLine = [evolutions[0].base, evolutions[0].stage1];
    else evolutionaryLine = [evolutions[0].base, evolutions[0].stage1, evolutions[0].stage2];
  } else return <div>Loading...second</div>;

  /**
   * Determine the evolution type (linear, branching, etc.).
   */
  const getEvolutionType = () => {
    if (evolutions.length < 2) return "linear"; // Ex: Charizard
    let myBool = true;

    for (let i = 0; i < evolutions.length; i++) if (evolutions[i].stage2.id != null) myBool = false;
    if (myBool) return "base_branching"; // Ex: Eevee

    for (let i = 1; i < evolutions.length; i++)
      if (evolutions[i].stage1.id != evolutions[i - 1].stage1.id) myBool = true;
    if (!myBool) return "middle_branching";

    return "random_branching";
  };
  const evolutionType = getEvolutionType();

  const selectVariant = (variant: PokemonVariant) => {
    setPokemonDetail((prev) => ({
      ...prev,
      name: variant.name,
      form: variant.form,
      types: variant.types,
      // region: variant.region,
      description: variant.description,
      stats: variant.stats,
      imgID: variant.imgID
    } as PokemonDetailType))
  }

  /* ---------- Item Management ---------- */
  const giveItem = async (item: string, icon: string) => {
    try {
      const response = await fetch("http://localhost:8081/setHeldItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceID: id, item: item }),
      });

      if (response.ok) {
        setPokemonDetail((prev) => ({ ...prev, heldItem: item, heldItemIcon: icon } as PokemonDetailType));
        setShowItemSelector(false);
      } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon moveset:", errMsg);
        alert("Failed to update Pokémon moveset. See console for details.");
      }
    } catch (err) {
      console.error("Error updating Pokémon item:", err);
      alert("Something went wrong updating Pokémon heldItem.");
    }
    
    
  }

  const removeItem = async () => {
    try {
      const response = await fetch("http://localhost:8081/setHeldItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceID: id, item: null }),
      });

      if (response.ok) {
        setPokemonDetail((prev) => ({ ...prev, heldItem: null, heldItemIcon: null } as PokemonDetailType));
        setShowItemSelector(false);
      } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon moveset:", errMsg);
        alert("Failed to update Pokémon moveset. See console for details.");
      }
    } catch (err) {
      console.error("Error updating Pokémon item:", err);
      alert("Something went wrong updating Pokémon heldItem.");
    }
  }

  const toggleExpandAll = () => {
    if (expandAll) {
      // Collapse all
      setCollapsedItems(new Set(items.map((item) => item.name)))
      setExpandAll(false)
    } else {
      // Expand all
      setCollapsedItems(new Set())
      setExpandAll(true)
    }
  }

  const toggleItemCollapse = (itemId: string) => {
    setCollapsedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const getFormBadgeColor = (form: string) => {
    switch (form.toLowerCase()) {
      case "original":
        return "bg-gray-300 text-gray-900"
      case "alolan":
        return "bg-blue-100 text-blue-800"
      case "galarian":
        return "bg-purple-100 text-purple-800"
      case "hisuian":
        return "bg-pink-900 text-gray-200"
      case "mega x":
      case "mega y":
      case "mega":
        return "bg-red-500 text-white"
      case "gigantamax":
        return "bg-pink-500 text-white"
      default:
        return "bg-yellow-200 text-yellow-700"
    }
  }

  /* ---------- Move Management ---------- */

  /**
   * Teach a new move to this Pokémon.
   */
  const learnMove = async (moveToLearn: AttackDetailType) => {
    try {
      const response = await fetch("http://localhost:8081/learnMove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceID: id, aID: moveToLearn.id }),
      });

      if (response.ok) {
        // Refresh details after update
        const overviewRes = await fetch(`http://localhost:8081/userPokemon/${id}`);
        const overviewData = await overviewRes.json();
        const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pID}`);
        const attackData = await attackRes.json();
        const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${id}`);
        const knownData = await knownRes.json();

        const combined: PokemonDetailType = { ...overviewData, learnableAttacks: attackData, knownAttacks: knownData };
        setPokemonDetail(combined);
      } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon moveset:", errMsg);
        alert("Failed to update Pokémon moveset. See console for details.");
      }
    } catch (err) {
      console.error("Error updating Pokémon moveset:", err);
      alert("Something went wrong updating Pokémon moveset.");
    }
  };

  /**
   * Forget a known move.
   */
  const forgetMove = async (moveToForget: AttackDetailType) => {
    try {
      const response = await fetch("http://localhost:8081/unlearnMove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instanceID: id, aID: moveToForget.id }),
      });

      if (response.ok) {
        // Refresh details after update
        const overviewRes = await fetch(`http://localhost:8081/userPokemon/${id}`);
        const overviewData = await overviewRes.json();
        const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pID}`);
        const attackData = await attackRes.json();
        const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${id}`);
        const knownData = await knownRes.json();

        const combined: PokemonDetailType = { ...overviewData, learnableAttacks: attackData, knownAttacks: knownData };
        setPokemonDetail(combined);
      } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon moveset:", errMsg);
        alert("Failed to update Pokémon moveset. See console for details.");
      }
    } catch (err) {
      console.error("Error updating Pokémon moveset:", err);
      alert("Something went wrong updating Pokémon moveset.");
    }
  };

  /**
   * Check if a move is already known by this Pokémon.
   */
  const isMoveKnown = (move: AttackDetailType) =>
    pokemon.knownAttacks.some((knownMove) => knownMove.id === move.id);

  /* ---------- Utilities ---------- */

  /**
   * Get a color class for stat bars based on value.
   */
  const getStatColor = (stat: number) => {
    if (stat >= 100) return "bg-green-500";
    if (stat >= 80) return "bg-yellow-500";
    if (stat >= 60) return "bg-orange-500";
    return "bg-red-500";
  };

  /**
   * Format date string for trade history.
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  /* ---------- Release Pokemon Call ---------- */

  const ReleasePokemon = async () => {
    try {
      console.log("Releasing Pokemon: ", pokemon.nickname);
      await fetch("http://localhost:8081/dropPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceID: pokemon.id,
        }),
      });
      // Navigate back to myPokemon since this pokemon doesn't 
      // exist anymore and hence lacks a detail page
      location.href = '/my-pokemon'
    } catch (err) {
      console.error("Error releasing Pokémon: ", err);
      alert("Something went wrong releasing the Pokémon.");
    }
  };

  /* ---------- Favourite Toggle ---------- */

  const toggleFavorite = async () => {
    try {
      console.log("Marking Pokemon: ", pokemon.nickname);
      await fetch("http://localhost:8081/setFavourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceID: pokemon.id,
          user: localStorage.getItem("uID"),
          value: Number(!pokemon.favourite),
        }),
      });

      // Update state optimistically
      setPokemonDetail((prev) => (prev ? { ...prev, favourite: !prev.favourite } : prev));
    } catch (err) {
      console.error("Error favouriting Pokémon: ", err);
      alert("Something went wrong favouriting the Pokémon.");
    }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="card overflow-hidden">
          <div className="p-0">
            <div className={`gradient-${pokemon.types[0].toLowerCase()} p-6 text-white relative`}>
              {/* Top Right Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-3">
                {/* Release Button */}
                <button
                  onClick={ReleasePokemon}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 
                    bg-white/10 text-white/60 hover:bg-white/20 hover:text-white`}
                  title="Release this Pokemon"
                >
                  <LogOut className="h-6 w-6" />
                </button>
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    pokemon.favourite
                      ? "bg-white/20 text-yellow-300 hover:bg-white/30"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                  }`}
                  title={pokemon.favourite ? "Remove from favorites" : "Add to favorites"}
                >
                  {pokemon.favourite ? <Heart className="h-6 w-6 fill-current" /> : <Heart className="h-6 w-6" />}
                </button>

                {/* Pokemon ID Badge */}
                <span className="badge badge-default bg-white text-black px-3 py-1">
                  #{pokemon.pID.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <img
                    src={`https://www.serebii.net/pokemon/art/${pokemon.imgID}.png`}
                    alt={pokemon.name}
                    width={200}
                    height={200}
                    className="rounded-lg bg-white/35 p-4"
                  />
                  {/* Status Indicators on Pokemon Image */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    {pokemon.favourite && (
                      <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                        <Heart className="h-3 w-3 text-yellow-800 fill-current" />
                      </div>
                    )}
                    {pokemon.onTeam && (
                      <div className="bg-green-400 rounded-full p-1.5 shadow-lg">
                        <Star className="h-3 w-3 text-green-800 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{pokemon.nickname || pokemon.name}</h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-xl font-semibold text-white/90">Lv. {pokemon.level}</span>
                      {pokemon.nickname && <span className="text-lg text-white/75">({pokemon.name})</span>}
                    </div>
                  </div>

                  {/* Status Text Indicators */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {pokemon.types.map((type) => (
                      <span key={type} className={`badge badge-type type-${type.toLowerCase()}`}>
                          {type}
                      </span>
                    ))}
                    {pokemon.favourite && (
                      <span className="badge badge-type bg-yellow-400/20 text-yellow-100 border border-yellow-300/30">
                        ⭐ Favorite
                      </span>
                    )}
                    {pokemon.onTeam && (
                      <span className="badge badge-type bg-green-400/20 text-green-100 border border-green-300/30">
                        🌟 Team Member
                      </span>
                    )}
                  </div>
                  {/* Held Item Display */}
                  {pokemon.heldItem && (
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                      <span className="text-sm text-white/75">Holding:</span>
                      <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                        <span className="text-lg">
                          <img
                            src={pokemon.heldItemIcon==="null" ? pokeIcon : pokemon.heldItemIcon}
                            alt={pokemon.heldItem}
                            width={25}
                            height={25}
                            className="mx-auto"
                          />
                        </span>
                        <span className="text-sm font-medium text-white">{pokemon.heldItem}</span>
                        <button
                          onClick={removeItem}
                          className="p-1 rounded-full bg-white/20 text-white/60 hover:bg-white/30 hover:text-white transition-colors"
                          title="Remove held item"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Give Item Button */}
                  <div className="flex justify-center md:justify-start mb-3">
                    <button
                      onClick={() => setShowItemSelector(true)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      {pokemon.heldItem ? "Change Item" : "Give Item"}
                    </button>
                  </div>
                  <p className="text-white/90 max-w-2xl">{pokemon.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Item Selector Modal */}
        {showItemSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="modal-header flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Select Item</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleExpandAll}
                    className="bg-white px-3 py-1 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    {expandAll ? "Collapse All" : "Expand All"}
                  </button>
                  <button
                    onClick={() => setShowItemSelector(false)}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {items.map((item) => {
                  const isCollapsed = collapsedItems.has(item.name)
                  const isSelected = pokemon.heldItem === item.name

                  return (
                    <div
                      key={item.name}
                      className={`border rounded-lg transition-colors ${
                        isSelected ? "bg-white border-primary bg-primary/5" : "bg-white border-border hover:border-primary"
                      }`}
                    >
                      {/* Item Header - Always Visible */}
                      <div
                        className="flex items-center gap-4 p-4 cursor-pointer"
                        onClick={() => toggleItemCollapse(item.name)}
                      >
                        <img
                          src={item.icon==="null" ? pokeIcon : item.icon}
                          alt={item.name}
                          width={35}
                          height={35}
                          className="mx-auto"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground">{item.name}</h4>
                          {isSelected && (
                            <div className="text-primary">
                              <Star className="h-4 w-4 fill-current" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              giveItem(item.name, item.icon)
                            }}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors text-green-600 ${
                              isSelected
                                ? "bg-green-200 text-primary"
                                : "bg-green-100 text-primary hover:bg-green-200"
                            }`}
                          >
                            {isSelected ? "Selected" : "Select"}
                          </button>
                          <div className={`transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}>
                            <svg
                              className="h-4 w-4 text-muted-foreground"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Item Description - Collapsible */}
                      {!isCollapsed && (
                        <div className="px-4 pb-4 border-t border-border/50 pt-3 mt-1">
                          <p className="text-sm text-foreground leading-relaxed">{item.effect}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="p-4 mt-4 pt-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowItemSelector(false)}
                    className="bg-white flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  {pokemon.heldItem && (
                    <button
                      onClick={() => {
                        removeItem()
                        setShowItemSelector(false)
                      }}
                      className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Remove Item
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="stats" className="space-y-4">
          <TabsList className={`grid w-full grid-cols-${variants.length > 1 ? '4' : '3'}`}>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            {variants.length > 1 ? <TabsTrigger value="variants">Variants</TabsTrigger> : ""}
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Base Stats
                </CardTitle>
                <CardDescription>The base statistical values for this Pokémon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  {Object.entries(pokemon.stats).map(([stat, value]) => (
                    <div key={stat} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">
                          {stat === "hp"
                            ? "HP"
                            : stat === "spAtk"
                              ? "Sp. Attack"
                              : stat === "spDef"
                                ? "Sp. Defense"
                                : stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </span>
                        <span className="font-bold">{value}</span>
                      </div>
                      <div className="relative">
                        <Progress value={(value / 150) * 100} className="h-2" />
                        <div
                          className={`absolute top-0 left-0 h-2 rounded-full ${getStatColor(value)}`}
                          style={{ width: `${Math.min((value / 150) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="font-bold text-lg">
                      {Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center gap-2">
                  <Footprints className="h-5 w-5" />
                  Evolution Line
                </h3>
                <p className="card-description">
                  {evolutionType === "linear"
                    ? "The complete evolutionary chain for this Pokémon"
                    : evolutionType === "base_branching"
                      ? "All possible evolution paths from the base form"
                      : evolutionType === "random_branching"
                        ? "Random evolution paths - determined by personality value"
                        : "Evolution chain with branching paths"}
                </p>
              </div>
              <div className="card-content">
                {evolutionType === "linear" && (
                  // Linear Evolution Layout
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                    {evolutionaryLine.map((evo: any, index: number) => (
                      <div key={evo.id} className="flex items-center gap-4">
                        <Link
                              to={`/pokedex/${evo.id}`}
                              key={evo.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                          <div className="text-center">
                            <div
                              className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                                evo.name === pokemon.name
                                  ? "border-green-500 bg-green-50"
                                  : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <img
                                src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.id.toString().padStart(3, "0")}.png`}
                                alt={evo.name}
                                width={80}
                                height={80}
                                className="mx-auto"
                              />
                            </div>
                            <h3 className="font-semibold mt-2 text-foreground">{evo.name}</h3>
                          </div>
                        </Link>
                        {index < evolutionaryLine.length - 1 && (
                            <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                          )}
                      </div>
                    ))}
                  </div>
                )}

                {evolutionType === "base_branching" && (
                  // Base Branching Evolution Layout (Eevee-style)
                  <div className="space-y-8">
                    {/* Base Pokemon */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all duration-200 border-green-500 bg-green-50`}
                        >
                          <img
                            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evolutions[0].base.id.toString().padStart(3, "0")}.png`}
                            alt={evolutions[0].base.name}
                            width={80}
                            height={80}
                            className="mx-auto"
                          />
                        </div>
                        <h3 className="font-semibold mt-2 text-foreground">{evolutions[0].base.name}</h3>
                      </div>
                    </div>

                    {/* Evolution Paths */}
                    <div className={`evolution-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${
                      evolutions.length % 4===0 ? 4 : evolutions.length % 3===0 ? 3 : 2
                    } gap-4`}>
                      {evolutions.map((evo: Evolution, index) => (
                        <div key={index} className="relative">
                          <Link
                              to={`/pokedex/${evo.stage1.id}`}
                              key={evo.stage1.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                            {/* Connection Line */}
                            <div className="evolution-connection-line absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 hidden sm:block"></div>

                            <div className="text-center p-3 border rounded-lg hover:shadow-md transition-all duration-200 pokemon-card-hover">
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                                  evo.stage1.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.stage1.id.toString().padStart(3, "0")}.png`}
                                  alt={evo.stage1.name}
                                  width={60}
                                  height={60}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-sm text-foreground">{evo.stage1.name}</h4>
                              <div className="pokemon-types">
                                    {evo.stage1.types.map((type) => (
                                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                                        {type}
                                    </span>
                                    ))}
                                  </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evolutionType === "random_branching" && (
                  // Random Branching Evolution Layout (Wurmple-style)
                  <div className="space-y-8">
                    {/* Base Pokemon */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            evolutions[0].base.name === pokemon.name
                              ? "border-green-500 bg-green-50"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <img
                            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evolutions[0].base.id.toString().padStart(3, "0")}.png`}
                            alt={evolutions[0].base.name}
                            width={80}
                            height={80}
                            className="mx-auto"
                          />
                        </div>
                        <h3 className="font-semibold mt-2 text-foreground">{evolutions[0].base.name}</h3>
                      </div>
                    </div>

                    {/* Random Evolution Branches */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {evolutions.map((branch: any, branchIndex: number) => (
                        <div key={branchIndex} className="space-y-4">
                          {/* Branch Header */}
                          <div className="text-center">
                            <span className="badge bg-yellow-100 text-yellow-800 border border-yellow-300">
                              Path {branchIndex + 1}
                            </span>
                          </div>

                          {/* Stage 1 Evolution */}
                          <div className="text-center">
                            <Link
                              to={`/pokedex/${branch.stage1.id}`}
                              key={branch.stage1.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                                  branch.stage1.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${branch.stage1.id.toString().padStart(3, "0")}.png`}
                                  alt={branch.stage1.name}
                                  width={70}
                                  height={70}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-foreground">{branch.stage1.name}</h4>
                            </Link>
                          </div>

                          {/* Arrow Down */}
                          <div className="flex justify-center">
                            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                          </div>

                          {/* Stage 2 Evolution */}
                          <div className="text-center">
                            <Link
                              to={`/pokedex/${branch.stage2.id}`}
                              key={branch.stage2.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                                  branch.stage2.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${branch.stage2.id.toString().padStart(3, "0")}.png`}
                                  alt={branch.stage2.name}
                                  width={70}
                                  height={70}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-foreground">{branch.stage2.name}</h4>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evolutionType === "middle_branching" && (
                  // Middle Branching Evolution Layout (Gloom-style)
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-6">
                      {evolutionaryLine.map((stage: any, stageIndex: number) => (
                        <div key={stage.id} className="flex flex-col items-center">
                          <Link
                              to={`/pokedex/${stage.id}`}
                              key={stage.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                            {/* Current Stage Pokemon */}
                            <div className="text-center mb-4">
                              <div
                                className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                                  stage.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${stage.id.toString().padStart(3, "0")}.png`}
                                  alt={stage.name}
                                  width={80}
                                  height={80}
                                  className="mx-auto"
                                />
                              </div>
                              <h3 className="font-semibold mt-2 text-foreground">{stage.name}</h3>
                            </div>
                          </Link>
                          {/* Arrow to next stage (if not last and no branching) */}
                            {stageIndex < evolutionaryLine.length - 1 && (
                              <div className="mt-4">
                                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                              </div>
                            )}
                        </div>
                      ))}
                      {/* Branching Evolutions (if any) */}
                        {true && (
                          <div className="space-y-4">
                            {/* Connection indicator */}
                            <div className="flex justify-center">
                              <div className="w-px h-8 bg-border"></div>
                            </div>

                            {/* Evolution options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {evolutions.map((evo: any) => (
                                <div key={evo.stage2.id} className="relative">
                                  <Link
                                    to={`/pokedex/${evo.stage2.id}`}
                                    key={evo.stage2.id}
                                    style={{ textDecoration:"none", color: "inherit" }}>
                                    {/* Connection Line to center */}
                                    <div className="evolution-connection-line absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 hidden sm:block"></div>

                                    <div className="text-center p-3 border rounded-lg hover:shadow-md transition-all duration-200 pokemon-card-hover">
                                      <div
                                        className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                                          evo.stage2.name === pokemon.name
                                            ? "border-green-500 bg-green-50"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                      >
                                        <img
                                          src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.stage2.id.toString().padStart(3, "0")}.png`}
                                          alt={evo.stage2.name}
                                          width={60}
                                          height={60}
                                          className="mx-auto"
                                        />
                                      </div>
                                      <h4 className="font-semibold mt-2 text-sm text-foreground">{evo.stage2.name}</h4>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Evolution Methods Legend */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-foreground">Evolution Methods:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      • <strong>Level Up:</strong> Reach required level
                    </div>
                    <div>
                      • <strong>Random:</strong> Based on personality value
                    </div>
                    <div>
                      • <strong>Stones:</strong> Use evolution stones
                    </div>
                    <div>
                      • <strong>Trade:</strong> Trade with specific items
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="moves" className="space-y-4">
            <div className="card">
              <div className="card-header">
                <CardTitle className="card-title flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Current Moves
                  <span className="text-sm font-normal text-muted-foreground">({pokemon.knownAttacks.length}/4)</span>
                </CardTitle>
                <p className="card-description">Moves that this Pokémon has learned through leveling up and TMs</p>
              </div>
              <div className="card-content">
                {pokemon.knownAttacks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No moves learned yet. Learn moves from the section below.</p>
                  </div>
                ) : (
                <div className="space-y-3">
                  {pokemon.knownAttacks.map((move, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg bg-green-50/50 border-green-200 hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{move.name}</h4>
                          <span className={`badge type-${move.type.toLowerCase()} text-white text-xs`}>{move.type}</span>
                          <span className="badge badge-outline text-xs">{move.category}</span>
                          {move.TM ? <span className="badge badge-tm text-white text-xs">T/M</span>:""}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Power: {move.stats.power}</span>
                          <span>Accuracy: {move.stats.accuracy}%</span>
                          <span>PP: {move.stats.pp}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        {move.effect !== "" ? 
                          <span className="badge badge-outline">
                              {move.effect}
                            </span> : <span></span>
                        }
                        <button
                          onClick={() => forgetMove(move)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          title="Forget this move"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
            <Card>
              <CardHeader>
                <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Swords className="h-5 w-5" />
                      Learnable Moves
                    </CardTitle>
                    <CardDescription>Moves that this Pokémon can learn through leveling up and TMs</CardDescription>
                  </div>
                  <p>Hello</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pokemon.learnableAttacks.map((move, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg
                      hover:bg-muted/50 transition-colors pokemon-card-hover ${isMoveKnown(move) ? "bg-green-50/50 border-green-200" : "hover:bg-muted/50 border-border"}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{move.name}</h4>
                          <span className={`badge type-${move.type.toLowerCase()} text-white text-xs`}>{move.type}</span>
                          <span className="badge badge-outline text-xs">{move.category}</span>
                          {move.TM ? <span className="badge badge-tm text-white text-xs">T/M</span>:""}
                          {isMoveKnown(move) && <span className="badge bg-green-100 text-green-800 text-xs">Known</span>}
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Power: {move.stats.power}</span>
                          <span>Accuracy: {move.stats.accuracy}%</span>
                          <span>PP: {move.stats.pp}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        {move.effect !== "" ? 
                          <span className="badge badge-outline">
                              {move.effect}
                            </span> : <span></span>
                        }
                        {isMoveKnown(move) ? (
                          <button
                            onClick={() => forgetMove(move)}
                            className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            title="Forget this move"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => learnMove(move)}
                            disabled={pokemon.knownAttacks.length>=4}
                            className={`p-1 rounded-full transition-colors ${
                              pokemon.knownAttacks.length<4
                                ? "bg-green-100 text-green-600 hover:bg-green-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                            title={
                              pokemon.knownAttacks.length < 4
                                ? "Learn this move"
                                : pokemon.knownAttacks.length >= 4
                                  ? "Cannot learn more moves (4/4 slots full)"
                                  : "Move already known"
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="variants" className="space-y-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Pokémon Variants
                </h3>
                <p className="card-description">
                  Different forms and regional variants of this Pokémon, including Mega Evolutions and regional forms
                </p>
              </div>
              <div className="card-content">
                {(() => {
                  return (
                    <div className="space-y-4">
                      <div className={`grid grid-cols-1 md:grid-cols-2 
                        lg:grid-cols-${!(variants.length%3) ? "3" : (variants.length % 4) ? "2" : "4"} gap-4`}>
                        {Object.entries(variants).map(([key, variant]: [string, PokemonVariant]) => {
                          const isSelected = pokemon.form === variant.form
                          return (
                            <div
                              key={key}
                              className={`border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                                isSelected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border hover:border-muted-foreground hover:bg-muted/30"
                              }`}
                              onClick={() => selectVariant(variant)}
                            >
                              <div className="pokemon-card-header">
                                <div className="pokemon-title-row">
                                  <h3 className="pokemon-title">
                                    {variant.name}
                                  </h3>
                                  <div className="pokemon-badges">{isSelected && <span className="badge badge-caught">Selected</span>}</div>
                                </div>
                                <div className="pokemon-image w-[200px] h-[200px] flex items-center justify-center overflow-hidden">
                                <img
                                    src={`https://www.serebii.net/pokemon/art/${variant.imgID}.png`}
                                    alt={pokemon.name}
                                    // width={200}
                                    className="rounded-lg bg-white/20 p-2 h-[100%]"
                                  />
                                </div>
                                <div className="pokemon-types flex justify-center gap-1">
                                  {variant.types.map((type) => (
                                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                                      {type}
                                    </span>
                                  ))}
                                  <span key={variant.form} className={`ml-3 badge ${getFormBadgeColor(variant.form)}`}>
                                    {variant.form}
                                  </span>
                                </div>
                                {/* Variant Description */}
                                <div className="pt-1">
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {variant.description ?? pokemon.description}
                                  </p>
                                </div>
                              </div>
                              <div className="pokemon-card-content">
                                <div className="pokemon-stats">
                                  <div className="stat-row">
                                    <span className="stat-label">HP:</span>
                                    <span className="stat-value">{variant.stats.hp}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Attack:</span>
                                    <span className="stat-value">{variant.stats.atk}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Defense:</span>
                                    <span className="stat-value">{variant.stats.def}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Sp. Atk:</span>
                                    <span className="stat-value">{variant.stats.spAtk}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Sp. Def:</span>
                                    <span className="stat-value">{variant.stats.spDef}</span>
                                  </div>
                                  <div className="stat-row">
                                    <span className="stat-label">Speed:</span>
                                    <span className="stat-value">{pokemon.stats.speed}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Variant Information */}
                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold mb-2 text-sm text-foreground">About Pokémon Variants</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                          <div>
                            <strong>Regional Forms:</strong> Pokémon that adapted to different environments
                            <br />
                            <strong>Mega Evolution:</strong> Temporary powerful transformations during battle
                          </div>
                          <div>
                            <strong>Gigantamax:</strong> Special Dynamax forms with unique appearances
                            <br />
                            <strong>Alternate Forms:</strong> Different appearances of the same species
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};



export default MyPokeDetail;
