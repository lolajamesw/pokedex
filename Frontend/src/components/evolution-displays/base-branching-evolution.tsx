import { PokemonSummary, PokedexPokemon, MyPokemon, Evolution } from "../../types/pokemon-details.ts";
import { Link } from "react-router-dom";

type Input = {
    evolutions: Evolution[],
    selectedName: string,
}

export default function BaseBranchingEvolutionContent({evolutions, selectedName}: Input) {
    return (
        // Base Branching Evolution Layout (Eevee-style)
        <div className="space-y-8">
            {/* Base Pokemon */}
            <div className="flex justify-center">
            <div className="text-center">
                <div
                className={`p-4 rounded-lg border-2 transition-all duration-200 border-green-500 bg-green-50`}
                >
                <img
                    src={`https://www.serebii.net/pokemon/art/${evolutions[0].base.imgID}.png`}
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
                    to={`/pokedex/${evo.stage1.pID}`}
                    key={evo.stage1.pID}
                    style={{ textDecoration:"none", color: "inherit" }}>
                    {/* Connection Line */}
                    <div className="evolution-connection-line absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 hidden sm:block"></div>

                    <div className="text-center p-3 rounded-lg">
                    <div
                        className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                        evo.stage1.name === selectedName
                            ? "border-green-500 bg-green-50"
                            : "border-border hover:border-muted-foreground"
                        } hover:shadow-md transition-all duration-200 pokemon-card-hover`}
                    >
                        <img
                        src={`https://www.serebii.net/pokemon/art/${evo.stage1.imgID}.png`}
                        alt={evo.stage1.name}
                        width={80}
                        height={80}
                        className="mx-auto"
                        />
                    </div>
                    <h4 className="font-semibold mt-2 text-sm text-foreground">{evo.stage1.name}</h4>
                    <div className="pokemon-types mx-auto w-fit">
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
        )
}