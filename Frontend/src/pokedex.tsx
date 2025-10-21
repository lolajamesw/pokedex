"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { Link } from "react-router-dom"
import "./css/pokedex.css"
import PokeCard from './components/pokeCard.js'
import FilterAndSearchCard from "./components/filter-and-search-card.js"

type PokemonStats = {
  hp: number,
  atk: number,
  def: number,
  spAtk: number,
  spDef: number,
  speed: number,
}

type Pokemon = {
  pID: number,
  number: number,
  name: string,
  types: string[],
  stats: PokemonStats,
  caught: boolean,
  imgID: string,
}

export default function Pokedex() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [filteredAndSortedPokemon, setSortedPokemon] = useState<Pokemon[]>([])
  useEffect(() => {
    fetch(`http://localhost:8081/pokemon?uID=${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setPokemonList(data))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])
  console.log(pokemonList.filter((pokemon) => pokemon['caught']))

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="pokedex-container ">
        <div className="pokedex-header">
          <h1 className="pokedex-title">Pokédex</h1>
          <p className="pokedex-subtitle">Browse and manage your Pokémon collection</p>
        </div>

        {/* Filters and Search */}
        <FilterAndSearchCard 
          pokemonList={pokemonList} 
          setSortedPokemon={setSortedPokemon} 
          extraFilterLabel="Caught Only"
          extraFilterAttr="caught"
        />

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredAndSortedPokemon.length} of {pokemonList.length} Pokémon
        </div>

        {/* Pokemon Grid */}
        <div className="pokemon-grid">
          {filteredAndSortedPokemon.map((pokemon) => (
            // <PokemonCard key={pokemon.id} pokemon={pokemon} />
            <Link
              to={`/pokedex/${pokemon.pID}`}
              key={pokemon.pID}
              style={{ textDecoration:"none", color: "inherit" }}
            >
              <PokeCard pokemon={pokemon} numberVisible={true}/>
            </Link>
          ))}
        </div>

        {filteredAndSortedPokemon.length === 0 && (
          <div className="no-results">
            <p>No Pokémon found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}