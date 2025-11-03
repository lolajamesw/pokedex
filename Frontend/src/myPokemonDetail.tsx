/**
 * MyPokeDetail.tsx
 * 
 * A React component for displaying detailed information about a user's Pokémon, 
 * including stats, moves, evolutions, and trade history. 
 * Allows interactions such as teaching/forgetting moves and marking a Pokémon as a favourite.
 */

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// UI components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx";
import MyPokemonTitleCard from "./components/PokemonDetails/my-pokemon-title-card.tsx";
import EvolutionTab from "./components/PokemonDetails/evolution-tab.tsx";
import MyPokemonStatsCard from "./components/PokemonDetails/my-pokemon-stats-card.tsx";
import MyPokemonMovesCard from "./components/PokemonDetails/known-moves-card.tsx";
import PokemonVariantCard from "./components/PokemonDetails/pokemon-variant-card.tsx";
import AbilityCard from "./components/PokemonDetails/ability-card.tsx";
import ItemCard from "./components/PokemonDetails/item-card.tsx";

// types
import { Evolution, MyPokemon, CardPokemon, Item, Ability } from "./types/pokemon-details.ts"

// Styles
import "./css/pokedex.css";
import "./css/details.css";
import "./css/profile.css";

/* ---------- Main Component ---------- */

const MyPokeDetail = () => {
  // Grab Pokémon instance and species IDs from URL params
  const { id, pID } = useParams<{ id: string; pID: string }>();

  // State
  const [pokemon, setPokemonDetail] = useState<MyPokemon | null>(null);
  const [abilities, setAbilities] = useState<Ability[]>([]);
  const [variants, setVariants] = useState<CardPokemon[]>([]);
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [tabCols, setTabCols] = useState<string>('grid-cols-3');

  const fetchAbilities = async () => {
      const abilityRes = await fetch(`http://localhost:8081/pokemon/abilities/${pID}/'${pokemon?.name}'`);
      const abilityData = await abilityRes.json();
      console.log("fetched ability data");
      setAbilities(abilityData);
  }
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

        const teamRes = await fetch(`http://localhost:8081/pokemon/onTeams/${id}`);
        const teamData = await teamRes.json();

        // Combine into Pokémon detail object
        const combined: MyPokemon = {
          ...overviewData,
          attacks: attackData,
          knownAttacks: knownData,
          tIDs: teamData,
        };
        setPokemonDetail(combined);

        fetchAbilities();

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

        // 6. Fetch variant data
        const variantRes = await fetch(`http://localhost:8081/pokemon/variants/${pID}`);
        const variantData = await variantRes.json();
        variantData.map((data: CardPokemon) => {
          data.description = data.description ?? combined.description;
          return data;
        });
        console.log("fetched variant data");

        let original = variantData.filter((data: CardPokemon) => !(data.imgID));
        // Manage if default pokemon is itself a variant
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
          } as MyPokemon))
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
          } as CardPokemon;
          variantData.push(original);
        }
        setVariants(variantData);
        if (combined.form !== 'original')
          setPokemonDetail({...combined, ...variantData.find((variant: CardPokemon) => variant.name===combined.form)})
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {fetchAbilities()}, [pokemon])

  useEffect(() => {
    if (abilities.length > 0 && variants.length > 1) setTabCols('grid-cols-6');
    else if (abilities.length < 1 && variants.length <= 1) setTabCols('grid-cols-4');
    else setTabCols('grid-cols-5');
  }, [abilities, variants])

  if (!pokemon) return <div>Loading...first {id}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <MyPokemonTitleCard 
          items={items}
          variants={variants}
          pokemon={pokemon}
          updatePokemonDetail={setPokemonDetail}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="stats" className="space-y-3">
          <TabsList className={`grid w-full ${tabCols}`}>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            {abilities.length > 0 ? <TabsTrigger value="abilities">Abilities</TabsTrigger> : ""}
            {variants.length > 1 ? <TabsTrigger value="variants">Variants</TabsTrigger> : ""}
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            <MyPokemonStatsCard pokemon={pokemon} updatePokemon={setPokemonDetail}/>
          </TabsContent>

          <EvolutionTab
            pokemon = {pokemon}
            evolutions = {evolutions}
          />

          <TabsContent value="moves" className="space-y-4">
            <MyPokemonMovesCard pokemon={pokemon} updatePokemonDetail={setPokemonDetail}/>
          </TabsContent>

          <TabsContent value="abilities" className="space-y-3">
            <AbilityCard abilities={abilities} instanceID={id} selectedAbility={pokemon.ability}/>
          </TabsContent>

          <TabsContent value="variants" className="space-y-4">
              <PokemonVariantCard 
                variants={variants} 
                currentForm={pokemon.form} 
                updatePokemonDetail={setPokemonDetail}
                instanceID={pokemon.id}
              />
          </TabsContent>

          <TabsContent value="items" className="space-y-3">
            <ItemCard
              variants={variants}
              pID={pokemon.pID.toString()}
              name={pokemon.name}
              heldItem={pokemon.heldItem}
              instanceID={pokemon.id}
              updatePokemonDetail={setPokemonDetail}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};



export default MyPokeDetail;
