import { PokemonSummary, PokedexPokemon, MyPokemon, Evolution } from "../../types/pokemon-details.ts";
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom";

type Input = {
    evolutionaryLine: PokemonSummary[],
    evolutions: Evolution[],
    selectedName: string,
}

export default function MiddleBranchingEvolutionContent({evolutionaryLine, evolutions, selectedName}: Input) {

    return (
        // Middle Branching Evolution Layout (Gloom-style)
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-6">
            {evolutionaryLine.map((stage: any, stageIndex: number) => (
                <div key={stage.pID} className="flex flex-col items-center">
                <Link
                    to={`/pokedex/${stage.pID}`}
                    key={stage.pID}
                    style={{ textDecoration:"none", color: "inherit" }}>
                    {/* Current Stage Pokemon */}
                    <div className="text-center mb-4">
                    <div
                        className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                        stage.name === selectedName
                            ? "border-green-500 bg-green-50"
                            : "border-border hover:border-muted-foreground"
                        }`}
                    >
                        <img
                        src={`https://www.serebii.net/pokemon/art/${stage.imgID}.png`}
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

                    {/* Evolution options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {evolutions.map((evo: any) => (
                        <div key={evo.stage2.pID} className="relative">
                        {/* Connection indicator */}
                        <div className="mx-auto w-fit -mt-3 mb-3">
                            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                        </div>
                        <Link
                            to={`/pokedex/${evo.stage2.pID}`}
                            key={evo.stage2.pID}
                            style={{ textDecoration:"none", color: "inherit" }}>

                            <div className="text-center p-3 rounded-lg">
                            <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                                evo.stage2.name === selectedName
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                } hover:shadow-md transition-all duration-200 pokemon-card-hover`}
                            >
                                <img
                                src={`https://www.serebii.net/pokemon/art/${evo.stage2.imgID}.png`}
                                alt={evo.stage2.name}
                                width={80}
                                height={80}
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
    )
}