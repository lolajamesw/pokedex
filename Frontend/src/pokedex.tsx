"use client"

import { useState, useEffect, useMemo } from "react"
import { Pagination } from '@mui/material'
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
  const [displayedPokemon, setDisplayed] = useState<Pokemon[]>([])
  const [page, setPage] = useState(1);
  const pageSize = 40
  
  useEffect(() => {
    fetch(`http://localhost:8081/pokemon?uID=${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setPokemonList(data))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  useEffect(() => {setPage(1)}, [filteredAndSortedPokemon])

  useEffect(() => {
    setDisplayed(filteredAndSortedPokemon.slice((page-1)*pageSize, page*pageSize));
  }, [filteredAndSortedPokemon, page])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

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
          Showing {(page-1)*pageSize+1}-{Math.min(page*pageSize, filteredAndSortedPokemon.length)} of {filteredAndSortedPokemon.length} Pokémon
          {filteredAndSortedPokemon.length >  pageSize &&  
            <Pagination 
              page={page}
              count={Math.ceil(filteredAndSortedPokemon.length / pageSize)}
              onChange={handlePageChange}
              size="small"
              hideNextButton
              hidePrevButton
            />
          }
        </div>

        {/* Pokemon Grid */}
        <div className="pokemon-grid">
          {displayedPokemon.map((pokemon) => (
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

        <div className="mx-auto">
          <Pagination 
            page={page}
            count={Math.ceil(filteredAndSortedPokemon.length / pageSize)}
            siblingCount={2}
            onChange={handlePageChange}
            size="large"
          />
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