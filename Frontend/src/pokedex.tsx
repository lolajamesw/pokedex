import PokemonInterface from './pokedex.js'
"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, SortAsc, SortDesc } from "lucide-react"
import { Link } from "react-router-dom"
import "./pokedex.css"

function PokemonCard({ pokemon }) {
  return (
    <div className="pokemon-card">
      <Link
        to={`/pokedex/${pokemon.number}`}
        key={pokemon.number}
        style={{ textDecoration:"none", color: "inherit" }}
      >
        <div className="pokemon-card-header">
          <div className="pokemon-title-row">
            <h3 className="pokemon-title">
              #{pokemon.number.toString().padStart(3, "0")} {pokemon.name}
            </h3>
            <div className="pokemon-badges">{pokemon.caught && <span className="badge badge-caught">Caught</span>}</div>
          </div>
          <div className="pokemon-image">
            <img
              src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${pokemon.number.toString().padStart(3, "0")}.png`}
              alt={pokemon.name}
              width={200}
              height={200}
              className="rounded-lg bg-white/20 p-4"
            />
          </div>
          <div className="pokemon-types">
            {pokemon.types.map((type) => (
              <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="pokemon-card-content">
          <div className="pokemon-stats">
            <div className="stat-row">
              <span className="stat-label">HP:</span>
              <span className="stat-value">{pokemon.stats.hp}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Attack:</span>
              <span className="stat-value">{pokemon.stats.attack}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Defense:</span>
              <span className="stat-value">{pokemon.stats.defense}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Sp. Atk:</span>
              <span className="stat-value">{pokemon.stats.spAttack}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Sp. Def:</span>
              <span className="stat-value">{pokemon.stats.spDefense}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Speed:</span>
              <span className="stat-value">{pokemon.stats.speed}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function Pokedex() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("number")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterType, setFilterType] = useState("all")
  const [showCaughtOnly, setShowCaughtOnly] = useState(false)
  const [pokemonList, setPokemonList] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/pokemon")
      .then((res) => res.json())
      .then((data) => setPokemonList(data))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  const filteredAndSortedPokemon = useMemo(() => {
  const filtered = pokemonList.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.number.toString().includes(searchTerm)
    const matchesType = filterType === "all" || pokemon.types.includes(filterType)
    const matchesCaught = !showCaughtOnly || pokemon.caught

    return matchesSearch && matchesType && matchesCaught
  })

  filtered.sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "number":
        aValue = a.number
        bValue = b.number
        break
      case "hp":
        aValue = a.stats.hp
        bValue = b.stats.hp
        break
      case "attack":
        aValue = a.stats.attack
        bValue = b.stats.attack
        break
      case "defense":
        aValue = a.stats.defense
        bValue = b.stats.defense
        break
      case "spAttack":
        aValue = a.stats.spAttack
        bValue = b.stats.spAttack
        break
      case "spDefense":
        aValue = a.stats.spDefense
        bValue = b.stats.spDefense
        break
      case "speed":
        aValue = a.stats.speed
        bValue = b.stats.speed
        break
      default:
        aValue = a.number
        bValue = b.number
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue
  })

  return filtered
}, [searchTerm, sortBy, sortOrder, filterType, showCaughtOnly, pokemonList])

  const allTypes = Array.from(new Set(pokemonList.flatMap((p) => p.types))).sort()

  return (
    <div className=" bg-gradient-to-br from-orange-50 to-red-50">
      <div className="pokedex-container ">
        <div className="pokedex-header">
          <h1 className="pokedex-title">Pokédex</h1>
          <p className="pokedex-subtitle">Browse and manage your Pokémon collection</p>
        </div>

        {/* Filters and Search */}
        <div className="filters-card">
          <div className="filters-header">
            <h3 className="filters-title">Filters & Search</h3>
          </div>
          <div className="filters-content">
            <div className="search-row">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  placeholder="Search by name or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="type-select">
                <option value="all">All Types</option>
                {allTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="controls-row">
              <div className="sort-controls">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="number">Number</option>
                  <option value="name">Name</option>
                  <option value="hp">HP</option>
                  <option value="attack">Attack</option>
                  <option value="defense">Defense</option>
                  <option value="spAttack">Sp. Attack</option>
                  <option value="spDefense">Sp. Defense</option>
                  <option value="speed">Speed</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="sort-button">
                  {sortOrder === "asc" ? <SortAsc className="sort-icon" /> : <SortDesc className="sort-icon" />}
                </button>
              </div>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="caught-only"
                  checked={showCaughtOnly}
                  onChange={(e) => setShowCaughtOnly(e.target.checked)}
                  className="checkbox"
                />
                <label htmlFor="caught-only" className="checkbox-label">
                  Show caught only
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredAndSortedPokemon.length} of {pokemonList.length} Pokémon
        </div>

        {/* Pokemon Grid */}
        <div className="pokemon-grid">
          {filteredAndSortedPokemon.map((pokemon) => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
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