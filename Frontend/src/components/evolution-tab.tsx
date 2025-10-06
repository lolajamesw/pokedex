import { PokemonSummary, PokedexPokemon, MyPokemon, Evolution } from "../types/pokemon-details.ts";
import BaseBranchingEvolutionContent from "./evolution-displays/base-branching-evolution.tsx";
import LinearEvolutionContent from "./evolution-displays/linear-evolution.tsx";
import { TabsContent } from "./ui/tabs.tsx";
import { Footprints } from "lucide-react";
import { useMemo } from "react";
import RandomBranchingEvolutionContent from "./evolution-displays/random-branching-evolution.tsx";
import MiddleBranchingEvolutionContent from "./evolution-displays/middle-branching-evolution.tsx";

type Input = {
    pokemon: PokedexPokemon | MyPokemon
    evolutions: Evolution[],
}


export default function EvolutionTab({ pokemon, evolutions }: Input) {

    const getEvolutionType = () => {
        if (evolutions.length < 2) return "linear"; // Ex: Charizard
        else if (!(evolutions.filter((evo) => evo.stage2.pID)).length) return "base_branching"; // Ex: Eevee
        else if ((evolutions.filter((evo) => evo.stage1.pID !== evolutions[0].stage1.pID)).length) return "random_branching"; // Ex: Wurmple
        return "middle_branching"; // Ex: Ralts
    };

    const evolutionType = useMemo(getEvolutionType, [evolutions])

    // Build evolution line depending on branching
    const evolutionaryLine = useMemo(() => {
        if (evolutions.length > 1 && evolutions[0].stage1.pID === evolutions[1].stage1.pID)
            return [evolutions[0].base, evolutions[0].stage1];
        else if (evolutions.length === 0)
            return [{pID: pokemon.pID, name: pokemon.name, types: pokemon.types, imgID: pokemon.imgID} as PokemonSummary];
        else if (!evolutions[0].stage2.pID)
            return [evolutions[0].base, evolutions[0].stage1];
        else return [evolutions[0].base, evolutions[0].stage1, evolutions[0].stage2];
    }, [evolutions])
    


    return (
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

                    {evolutionType === "linear" && <LinearEvolutionContent 
                        evolutionaryLine={evolutionaryLine}
                        selectedName = {pokemon.name}
                    />}

                    {evolutionType === "base_branching" && <BaseBranchingEvolutionContent 
                        evolutions={evolutions}
                        selectedName={pokemon.name}
                    />}

                    {evolutionType === "random_branching" && <RandomBranchingEvolutionContent
                        evolutions={evolutions}
                        selectedName={pokemon.name}
                    />}

                    {evolutionType === "middle_branching" && <MiddleBranchingEvolutionContent
                        evolutionaryLine={evolutionaryLine}
                        evolutions={evolutions}
                        selectedName={pokemon.name}
                    />}

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
    )
}