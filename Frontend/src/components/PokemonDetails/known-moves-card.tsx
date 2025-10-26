import { Swords, X, Plus } from "lucide-react"
import { CardTitle } from "../ui/card";
import { MyPokemon, AttackDetails } from "../../types/pokemon-details"
import PokemonMovesCard from "./learnable-moves-card";


type Inputs = {
    pokemon: MyPokemon,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>
    editable?: boolean,
}

export default function MyPokemonMovesCard({ pokemon, updatePokemonDetail, editable=true }: Inputs) {

    const learnMove = async (moveToLearn: AttackDetails) => {
        try {
        const response = await fetch("http://localhost:8081/learnMove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: pokemon.id, aID: moveToLearn.id }),
        });

        if (response.ok) {
            // Refresh details after update
            const overviewRes = await fetch(`http://localhost:8081/userPokemon/${pokemon.id}`);
            const overviewData = await overviewRes.json();
            const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pokemon.pID}`);
            const attackData = await attackRes.json();
            const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${pokemon.id}`);
            const knownData = await knownRes.json();

            const combined: MyPokemon = { ...overviewData, attacks: attackData, knownAttacks: knownData };
            updatePokemonDetail(combined);
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

    const forgetMove = async (moveToForget: AttackDetails) => {
        try {
        const response = await fetch("http://localhost:8081/unlearnMove", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: pokemon.id, aID: moveToForget.id }),
        });

        if (response.ok) {
            // Refresh details after update
            const overviewRes = await fetch(`http://localhost:8081/userPokemon/${pokemon.id}`);
            const overviewData = await overviewRes.json();
            const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pokemon.pID}`);
            const attackData = await attackRes.json();
            const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${pokemon.id}`);
            const knownData = await knownRes.json();

            const combined: MyPokemon = { ...overviewData, attacks: attackData, knownAttacks: knownData };
            updatePokemonDetail(combined);
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

    const isMoveKnown = (move: AttackDetails) =>
        pokemon.knownAttacks.some((knownMove) => knownMove.id === move.id);

    
    return (
        <div className="space-y-3">
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:shadow-md"
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
                        {editable && 
                            <button
                                onClick={() => forgetMove(move)}
                                className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                title="Forget this move"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        }
                        </div>
                    </div>
                    ))}
                </div>
                )}
                </div>
            </div>
            {editable && 
                <PokemonMovesCard pokemon={pokemon} knownMoves={pokemon.knownAttacks.map((move) => move.name)} learnButton={(move) => 
                    isMoveKnown(move) ? (
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
                    )
                }/>
            }
        </div>
    )
}