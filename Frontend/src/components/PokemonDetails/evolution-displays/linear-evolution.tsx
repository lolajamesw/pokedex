import { PokemonSummary } from "../../types/pokemon-details.ts";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type Input = {
    evolutionaryLine: PokemonSummary[],
    selectedName: string,
}

export default function LinearEvolutionContent({evolutionaryLine, selectedName}: Input) {
    return (
        // Linear Evolution Layout
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {evolutionaryLine.map((evo: any, index: number) => (
            <div key={evo.pID} className="flex items-center gap-4">
                <Link
                    to={`/pokedex/${evo.pID}`}
                    key={evo.pID}
                    style={{ textDecoration:"none", color: "inherit" }}>
                    <div className="text-center">
                        <div
                            className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                                evo.name === selectedName
                                ? "border-green-500 bg-green-50"
                                : "border-border hover:border-muted-foreground"
                            }`}
                        >
                            <img
                                src={`https://www.serebii.net/pokemon/art/${evo.imgID}.png`}
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
        )
}