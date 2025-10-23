"use client"

import { useState, useEffect } from "react"
import { LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import pokeIcon from "./assets/pokeIcon.png";
import "./css/pokedex.css"
import "./css/my-pokemon.css"
import PokeCard from "./components/pokeCard";
import { MyCardPokemon, Nature, natures, PokemonStats } from "./types/pokemon-details";
import FilterAndSearchCard from "./components/filter-and-search-card";
import NewPokemonModal from "./components/new-pokemon-modal";

export default function MyPokedex() {
  const [pokemonList, setPokemonList] = useState<MyCardPokemon[]>([])
  const [filteredAndSortedPokemon, setSortedPokemon] = useState<MyCardPokemon[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");

    const ReleasePokemon = async (instanceID: number) => {
    try {
      console.log("Releasing Pokemon: ", instanceID);
      await fetch("http://localhost:8081/dropPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instanceID: instanceID,
        }),
      });
      setPokemonList(pokemonList.filter((pokemon) => pokemon.id !=instanceID));
      console.log(pokemonList);
    } catch (err) {
      console.error("Error releasing Pokémon: ", err);
      alert("Something went wrong releasing the Pokémon.");
    }
  };

  const getNewStat = (stat: string, value: number, ev: number, iv: number, level: number, nature: Nature) => {
      const natureMult = nature.strength === nature.weakness ? 1 
      : stat === nature.strength ? 1.1 
      : stat === nature.weakness ? 0.9 
      : 1;
      return Math.floor((
          value + (
              value / 50 + ev / 100 + iv / 100
          ) * level
      ) * natureMult);
  }

  // Fetch pokemon details and update stats with getNewStat
  useEffect(() => {
    fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setPokemonList(data.map((p: any) => {
        console.log(p);
        p.stats = Object.fromEntries(
          Object.entries(p.stats).map(([stat, value]) => [
            stat,
            getNewStat(
              stat, 
              Number(value), 
              p.evs[stat], 
              p.ivs[stat], 
              p.level, 
              natures.filter((n) => n.nature === p.nature)[0]
            )
          ])
        )
        console.log(p);
        return p as MyCardPokemon
      })))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="pokedex-container">
        {bannerMessage && (
          <div className="banner">
            <p>{bannerMessage}</p>
          </div>
        )}
        <div className="pokedex-header">
          <h1 className="pokedex-title">My Pokédex</h1>
          <p className="pokedex-subtitle">Browse and manage your Pokémon collection</p>
        </div>

        {/* Filters and Search */}
        <FilterAndSearchCard pokemonList={pokemonList} setSortedPokemon={setSortedPokemon}/>

        {/* Results Count */}
        <div className="results-container">
          <div className="results-count">
            Showing {filteredAndSortedPokemon.length} of {pokemonList.length} Pokémon
          </div>
          {/* Add new pokemon */}
          <div>
            <button onClick={() => setIsModalOpen(true)} className="enter-pokemon-button">
              + Add Pokemon
            </button>

            {isModalOpen && (
              <NewPokemonModal 
                setPokemonList={setPokemonList} 
                setBannerMessage={setBannerMessage}
                setIsModalOpen={setIsModalOpen}
              />
            )}
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className="pokemon-grid">
          {filteredAndSortedPokemon.map((pokemon) => (
            <Link
              to={`/my-pokemon/${pokemon.pID}/${pokemon.id}`}
              key={pokemon.id}
              style={{ textDecoration:"none", color: "inherit" }}
            >
              <PokeCard 
                pokemon={pokemon} 
                numberVisible={true}
                cornerVisible={true}
                cornerElement={
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      ReleasePokemon(pokemon.id);
                    }}
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 
                      bg-black/5 text-black/75 hover:bg-black/2
                    `}
                    title="Release this Pokemon"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                }
                extraElement={pokemon.item != null ? (
                  <span>
                    <img
                      src={pokemon.item==="null" ? pokeIcon : pokemon.item}
                      alt={pokemon.item}
                      width={30}
                      height={30}
                      className="mx-auto"
                    />
                  </span>
                ) : <div></div>}
              />
            </Link>
          ))}
        </div>
        {/* No pokemon to display */}
        {filteredAndSortedPokemon.length === 0 && (
          <div className="no-results">
            <p>No Pokémon found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}