import { PokemonSummary } from "../types/pokemon-details"
import { Link } from "react-router-dom"
import pokeIcon from "./../assets/pokeIcon.png";

type Inputs = {
    pokemon: PokemonSummary;
    isSelected?: boolean;
    onSelect?: (pokemon: PokemonSummary) => void;
    simplified?: boolean;
}

export default function PokeTile({ pokemon, isSelected=false, onSelect, simplified=false }: Inputs) {
  return (
    <div className={"showcase-card"}>
        <Link
            to={`/my-pokemon/${pokemon.pID}/${pokemon.id}`}
            key={pokemon.id}
            style={{ textDecoration:"none", color: "inherit" }}
        >
            <div className="showcase-card-header">
                {!simplified && 
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start mb-3">
                        {pokemon.types.map((type) => (
                        <span key={type} className={`badge badge-type type-${type.toLowerCase()}  text-white`}>
                            {type}
                        </span>
                        ))}
                    </div>
                }
                <span>
                    {pokemon.item && <img
                        src={pokemon.item==="null" ? pokeIcon : pokemon.item}
                        alt={"Held item"}
                        width={30}
                        height={30}
                        className="mx-auto"
                    />}
                </span>
                {simplified && 
                    <button
                        className={`select-button ${isSelected ? "select-button-selected" : ""}`}
                        onClick={() => onSelect?.(pokemon)}
                    >
                        {isSelected ? "Selected" : "Select"}
                    </button>
                }
                
            </div>
            <div className="showcase-card-content">
            {!simplified &&
                <div className="pokemon-image">
                    <img
                    src={`https://www.serebii.net/pokemon/art/${pokemon.imgID}.png`}
                    alt={pokemon.name}
                    width={100}
                    height={100}
                    className="rounded-lg bg-white/20 p-0"
                    />
                </div>
            }
            <h3 className="showcase-nickname">{pokemon.nickname}</h3>
            <p className="showcase-species">{pokemon.name}</p>
            {simplified && 
                <div className="flex flex-wrap gap-1 justify-center">
                    {pokemon.types.map((type) => (
                    <span key={type} className={`badge badge-type type-${type.toLowerCase()}  text-white`}>
                        {type}
                    </span>
                    ))}
                </div>
            }
            </div>
        </Link>
    </div>
  )
}