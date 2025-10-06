import { Heart, X, Plus, Star, LogOut } from "lucide-react";
import { useState } from "react";
import ItemSelectorModal from "./item-selector-modal";
import { Badge } from "./ui/badge"

import pokeIcon from "./../assets/pokeIcon.png";
import { MyPokemon, PokedexPokemon, Item } from "../types/pokemon-details";
import PokemonTitleCard from "./pokemon-title-card";

type InputType = {
    items: Item[];
    pokemon: MyPokemon;
    fromPokedex: boolean;
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>;
}


export default function MyPokemonTitleCard({items, pokemon, fromPokedex=false, updatePokemonDetail}: InputType) {
    // Item-relevant states
    const [showItemSelector, setShowItemSelector] = useState(false);
    
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

    const removeItem = async () => {
        try {
        const response = await fetch("http://localhost:8081/setHeldItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: pokemon.id, item: null }),
        });

        if (response.ok) {
            updatePokemonDetail((prev) => ({ ...prev, heldItem: null, heldItemIcon: null } as MyPokemon));
            setShowItemSelector(false);
        } else {
            const errMsg = await response.text();
            console.error("Failed to update Pokémon moveset:", errMsg);
            alert("Failed to update Pokémon moveset. See console for details.");
        }
        } catch (err) {
        console.error("Error updating Pokémon item:", err);
        alert("Something went wrong updating Pokémon heldItem.");
        }
    }

    return (
        <div>
            <PokemonTitleCard
                pokemon = {pokemon}
                nickname = {pokemon.nickname}
                level = {pokemon.level}

                topRight = {
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
                }

                statusIndicators = {
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                        {pokemon.favourite && (
                        <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                            <Heart className="h-3 w-3 text-yellow-800 fill-current" />
                        </div>
                        )}
                        {pokemon.onTeam && (
                        <div className="bg-green-400 rounded-full p-1.5 shadow-lg">
                            <Star className="h-3 w-3 text-green-800 fill-current" />
                        </div>
                        )}
                    </div>
                }

                itemElement = {
                    <div>
                        {/* Held Item Display */}
                        {pokemon.heldItem && !fromPokedex && (
                            <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                                <span className="text-sm text-white/75">Holding:</span>
                                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1">
                                    <span className="text-lg">
                                        <img
                                            src={pokemon.heldItemIcon==="null" || !(pokemon.heldItemIcon) ? pokeIcon : pokemon.heldItemIcon}
                                            alt={pokemon.heldItem}
                                            width={25}
                                            height={25}
                                            className="mx-auto"
                                        />
                                    </span>
                                    <span className="text-sm font-medium text-white">{pokemon.heldItem}</span>
                                    <button
                                        onClick={removeItem}
                                        className="p-1 rounded-full bg-white/20 text-white/60 hover:bg-white/30 hover:text-white transition-colors"
                                        title="Remove held item"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Give Item Button */}
                        <div className="flex justify-center md:justify-start mb-3">
                            <button
                                onClick={() => setShowItemSelector(true)}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/90 hover:text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                <Plus className="h-4 w-4" />
                                {pokemon.heldItem ? "Change Item" : "Give Item"}
                            </button>
                        </div>
                    </div>
                }
            />
            {/* Item Selector Modal */}
            {showItemSelector && <ItemSelectorModal 
                items={items}
                heldItem={pokemon.heldItem}
                instanceID={pokemon.id}
                updatePokemonDetail={updatePokemonDetail}
                setShowItemSelector={setShowItemSelector}
                removeItem={removeItem}
            />}
        </div>
    )
}
