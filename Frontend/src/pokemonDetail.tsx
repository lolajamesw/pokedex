import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx"
import { Shield, Swords } from "lucide-react"
import "./pokedex.css"
import "./details.css"
import PokemonTitleCard from "./components/pokemon-title-card.tsx";
import { PokedexPokemon, Evolution, CardPokemon } from "./types/pokemon-details.ts"
import EvolutionTab from "./components/evolution-tab.tsx";
import PokemonStatsCard from "./components/pokemon-stats-card.tsx";
import PokemonMovesCard from "./components/learnable-moves-card.tsx";
import PokemonVariantCard from "./components/pokemon-variant-card.tsx";

const PokemonDetail = () => {
    const { id: pID } = useParams<{ id: string}>();
    const [pokemon, setPokemonDetail] = useState<PokedexPokemon | null>(null);
    const [evolutions, setEvolutions] = useState<Evolution[]>([]);
    const [variants, setVariants] = useState<CardPokemon[]>([]);
     
    useEffect(() => {
        const fetchData = async () => {
            try {
                const overviewRes = await fetch(`http://localhost:8081/pokemon/${pID}`);
                const overviewData = await overviewRes.json();

                const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pID}`);
                const attackData = await attackRes.json();

                const combined: PokedexPokemon = {
                    ...overviewData,
                    attacks: attackData,
                    form: "original",
                };

                setPokemonDetail(combined);

                const evolutionRes = await fetch(`http://localhost:8081/pokemon/evolutions/${pID}`);
                const evolutionData = await evolutionRes.json();
                console.log("fetched evolution data");
                setEvolutions(evolutionData);


                // 3. Fetch variant data
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
                  } as PokedexPokemon))
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
                console.log(original)
                setVariants(variantData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [pID])

    if (!pokemon) return <div>Loading...first {pID}</div>;

    return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <PokemonTitleCard pokemon={pokemon} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="stats" className="space-y-3">
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
                <PokemonStatsCard pokemon={pokemon} />
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

          <EvolutionTab 
            pokemon={pokemon}
            evolutions={evolutions}
          />

          <TabsContent value="moves" className="space-y-4">
            <PokemonMovesCard pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="variants">
            <PokemonVariantCard variants={variants} updatePokemonDetail={setPokemonDetail} currentForm={pokemon.form}/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};



export default PokemonDetail;
