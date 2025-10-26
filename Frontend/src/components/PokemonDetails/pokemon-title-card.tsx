import { Badge } from "../ui/badge"
import { PokedexPokemon, MyPokemon } from "../../types/pokemon-details";

type InputType = {
    pokemon: PokedexPokemon | MyPokemon;
    topRight?: React.ReactNode;
    statusIndicators?: React.ReactNode;
    teraType?: React.ReactNode;
    nickname?: string;
    level?: number;
}


export default function PokemonTitleCard({ pokemon, nickname, level, topRight, statusIndicators, teraType: itemElement }: InputType) {
    return (
        <div>
            <div className="card overflow-hidden">
                <div className="p-0">
                    <div className={`gradient-${pokemon.types[0].toLowerCase()} p-6 text-white relative`}>
                        {/* Top Right Controls */}
                        {topRight} {/* insert */}

                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={`https://www.serebii.net/pokemon/art/${pokemon.imgID}.png`}
                                    alt={pokemon.name}
                                    width={200}
                                    height={200}
                                    className="rounded-lg bg-white/35 p-4"
                                />
                                <Badge className="absolute -top-2 -right-2 bg-white/70 text-black">
                                    #{pokemon.pID.toString().padStart(3, "0")}
                                </Badge>
                                {/* Status Indicators on Pokemon Image */}
                                {statusIndicators}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 mb-2">
                                    <h1 className="text-4xl font-bold text-white">{nickname || pokemon.name}</h1>
                                    <div className="flex items-center gap-2 justify-center md:justify-start">
                                    {level && <span className="text-xl font-semibold text-white/90">Lv. {level}</span>}
                                    {nickname && <span className="text-lg text-white/75">({pokemon.name})</span>}
                                    </div>
                                </div>

                                {/* Status Text Indicators */}
                                <div className="flex mb-2 gap-2 justify-center md:justify-start">
                                    {pokemon.types.map((type) => (
                                        <span key={type} className={`badge badge-type type-${type.toLowerCase()}`}>
                                            {type}
                                        </span>
                                    ))}
                                </div>
                                {itemElement}
                                <p className="text-white/90 max-w-2xl">{pokemon.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}