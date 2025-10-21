import { Swords } from "lucide-react"
import { MyPokemon, PokedexPokemon, AttackDetails } from "../../types/pokemon-details"

type Inputs = {
    pokemon: MyPokemon | PokedexPokemon,
    learnButton?: (move: AttackDetails) => React.ReactNode,
    knownMoves?: string[],
}

export default function PokemonMovesCard({ pokemon, learnButton, knownMoves=[] }: Inputs) {
    return (
        <div className="card">
            <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
                <Swords className="h-5 w-5" />
                Learnable Moves
            </h3>
            <p className="card-description">Moves that this Pokémon can learn through leveling up and TMs</p>
            </div>
            <div className="card-content">
            <div className="moves-container space-y-3 max-h-96 overflow-y-auto">
                {pokemon.attacks.map((move, index) => (
                <div
                    key={index}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 border
                    rounded-lg ${knownMoves.includes(move.name) ? "bg-green-50/50 border-green-200" : ""} 
                    hover:bg-muted/50 transition-colors pokemon-card-hover`}
                >
                    <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">{move.name}</h4>
                        <span className={`badge type-${move.type.toLowerCase()} text-white text-xs`}>{move.type}</span>
                        <span className="badge badge-outline text-xs">{move.category}</span>
                        {move.TM ? <span className="badge badge-tm text-white text-xs">T/M</span>:""}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>Power: {move.stats.power || "—"}</span>
                        <span>Accuracy: {move.stats.accuracy}%</span>
                        <span>PP: {move.stats.pp}</span>
                    </div>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        <span className="badge badge-outline">
                            {move.effect}
                        </span>
                        {learnButton && learnButton(move)}
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    )
}