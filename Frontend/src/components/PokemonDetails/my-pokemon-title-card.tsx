import { Heart, Star, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import pokeIcon from "./../../assets/pokeIcon.png";
import { MyPokemon, CardPokemon, Item } from "../../types/pokemon-details";
import PokemonTitleCard from "./pokemon-title-card";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";

type InputType = {
    items: Item[];
    variants: CardPokemon[];
    pokemon: MyPokemon;
    editable?: boolean;
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>;
}


export default function MyPokemonTitleCard({items, variants, pokemon, editable=true, updatePokemonDetail}: InputType) {
    // Item-relevant states
    const [teraType, setTeraType] = useState(pokemon.types[0]);
    const [types, setTypes] = useState<string[]>([])

    useEffect(() => {
        const fetchTypes = async () => {
            const typeRes = await fetch('http://localhost:8081/types');
            const typeData = await typeRes.json();
            console.log("fetched type data");
            setTypes(typeData.map((type: {type: string}) => type.type));
        }
        fetchTypes();
    }, [])

    useEffect(() => {
        const fetchType = async () => {
            const typeRes = await fetch(`http://localhost:8081/teraType/${pokemon.id}`);
            const typeData = await typeRes.json();
            console.log("fetched type data");
            if (typeData.teraType !== null)
                setTeraType(typeData.teraType);
        }
        fetchType();
    }, [])
    
    /* ---------- Release Pokemon Call ---------- */

    const ReleasePokemon = async () => {
    try {
        console.log("Releasing Pokemon: ", pokemon.nickname);
        await fetch("http://localhost:8081/dropPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instanceID: pokemon.id,
        }),
        });
        // Navigate back to myPokemon since this pokemon doesn't 
        // exist anymore and hence lacks a detail page
        location.href = '/my-pokemon'
    } catch (err) {
        console.error("Error releasing Pokémon: ", err);
        alert("Something went wrong releasing the Pokémon.");
    }
    };

    /* ---------- Favourite Toggle ---------- */

    const toggleFavorite = async () => {
    try {
        console.log("Marking Pokemon: ", pokemon.nickname);
        await fetch("http://localhost:8081/setFavourite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            instanceID: pokemon.id,
            user: localStorage.getItem("uID"),
            value: Number(!pokemon.favourite),
        }),
        });

        // Update state optimistically
        updatePokemonDetail((prev) => (prev ? { ...prev, favourite: !prev.favourite } : prev));
    } catch (err) {
        console.error("Error favouriting Pokémon: ", err);
        alert("Something went wrong favouriting the Pokémon.");
    }
    };

    const setType = async (type: string) => {
        try {
            const response = await fetch("http://localhost:8081/setTeraType", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                instanceID: pokemon.id,
                type: type,
            }),
            });
            if (response.ok) setTeraType(type);
            else console.error("Error setting tera type")
        } catch (err) {
            console.error("Error setting tera type: ", err);
            alert("Something went wrong setting the Pokémon's tera type.");
        }
    }

    return (
        <div>
            <PokemonTitleCard
                pokemon = {pokemon}
                nickname = {pokemon.nickname}
                level = {pokemon.level}

                topRight = {editable ? 
                    <div className="absolute top-4 right-4 flex items-center gap-3">
                        {/* Favorite Button */}
                        <button
                            onClick={toggleFavorite}
                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                                pokemon.favourite
                                ? "bg-white/20 text-yellow-300 hover:bg-white/30"
                            : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                            }`}
                            title={pokemon.favourite ? "Remove from favorites" : "Add to favorites"}
                        >
                            {pokemon.favourite ? <Heart className="h-6 w-6 fill-current" /> : <Heart className="h-6 w-6" />}
                        </button>
                        {/* Release Button */}
                        <button
                            onClick={ReleasePokemon}
                            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 
                                bg-white/10 text-white/60 hover:bg-white/20 hover:text-white`}
                            title="Release this Pokemon"
                        >
                            <LogOut className="h-6 w-6" />
                        </button>
                    </div>
                    : undefined
                }

                statusIndicators = {
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                        {pokemon.favourite && (
                        <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                            <Heart className="h-3 w-3 text-yellow-800 fill-current" />
                        </div>
                        )}
                        {pokemon.tIDs.length > 0 && (
                        <div className="bg-green-400 rounded-full p-1.5 shadow-lg">
                            <Star className="h-3 w-3 text-green-800 fill-current" />
                        </div>
                        )}
                        {pokemon.heldItemIcon && 
                            <img
                                src={pokemon.heldItemIcon==="null" || !(pokemon.heldItemIcon) ? pokeIcon : pokemon.heldItemIcon}
                                alt={'what'}
                                width={25}
                                height={25}
                                className="mx-auto bg-blue-400 rounded-full"
                            />
                        }
                    </div>
                }
                teraType={
                    <div className="mx-auto md:mx-0 mb-2 py-1 w-3/5 flex space-x-2 justify-center items-center md:justify-start">
                        <span>Tera type:</span>
                        {editable ? 
                            <Select value={teraType} onValueChange={setType}>
                                <SelectTrigger className={`w-30 h-7 border-white/50 type-${teraType.toLowerCase()} rounded-xl`}>
                                    <div className="flex items-center font-semibold gap-2">
                                        <span>{teraType}</span>
                                    </div>
                                </SelectTrigger>
                                <SelectContent align="center" className="border-transparent shadow-none bg-transparent w-30">
                                    {types.map((type) => (
                                    <SelectItem key={type} value={type} 
                                        className={`my-1 px-3 py-1 w-auto h-7 rounded-full flex justify-center 
                                            type-${type.toLowerCase()} border border-white/75 shadow-md
                                            hover:scale-105 active:scale-95 data-[state=checked]:text-white 
                                            `}
                                        >
                                        <div className="text-white font-semibold">
                                            <span>{type}</span>
                                        </div>
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            :
                            <span key={teraType} className={`badge badge-type type-${teraType.toLowerCase()}`}>
                                {teraType}
                            </span>
                        }
                    </div>
                }
            />
        </div>
    )
}
