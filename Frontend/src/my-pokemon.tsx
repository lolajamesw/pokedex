"use client"

import { useState, useEffect, useMemo, FormEvent } from "react"
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField';
import { Search, SortAsc, SortDesc, LogOut } from "lucide-react"
import { Link } from "react-router-dom"
import pokeIcon from "./assets/pokeIcon.png";
import "./pokedex.css"
import "./my-pokemon.css"
import PokeCard from "./components/pokeCard";

type PokemonDetailType = {
  id: number,
  pID: number,
  name: string,
  form: string,
  types: string[],
  stats: PokemonStatType,
  level: number,
  nickname: string,
  showcase: boolean,
  item: string | null,
  imgID: string,
};

type PokemonStatType = {
    hp: number,
    atk: number,
    def: number,
    spAtk: number,
    spDef: number,
    speed: number
}



export default function MyPokedex() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("number")
  const [sortOrder, setSortOrder] = useState("asc")
  const [filterType, setFilterType] = useState("all")
  const [pokemonList, setPokemonList] = useState<PokemonDetailType[]>([])
  const [pokemonNames, setPokemonNames] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPokemonName, setNewPokemonName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [bannerMessage, setBannerMessage] = useState("");
  useEffect(() => {
    fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setPokemonList(data.map((pokemon: PokemonDetailType) => {
        if (pokemon.form !== 'original') pokemon.name = pokemon.form;
        return pokemon
      })))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])
  useEffect(() => {
    fetch(`http://localhost:8081/pokemonNames`)
      .then((res) => res.json())
      .then((data) => setPokemonNames(data))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  const filteredAndSortedPokemon = useMemo(() => {
  const filtered = pokemonList.filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pokemon.pID.toString().includes(searchTerm)
    const matchesType = filterType === "all" || pokemon.types.includes(filterType)

    return matchesSearch && matchesType
  })

  filtered.sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case "name":
        aValue = a.name
        bValue = b.name
        break
      case "number":
        aValue = a.pID
        bValue = b.pID
        break
      case "hp":
        aValue = a.stats.hp
        bValue = b.stats.hp
        break
      case "attack":
        aValue = a.stats.atk
        bValue = b.stats.atk
        break
      case "defense":
        aValue = a.stats.def
        bValue = b.stats.def
        break
      case "spAttack":
        aValue = a.stats.spAtk
        bValue = b.stats.spAtk
        break
      case "spDefense":
        aValue = a.stats.spDef
        bValue = b.stats.spDef
        break
      case "speed":
        aValue = a.stats.speed
        bValue = b.stats.speed
        break
      default:
        aValue = a.pID
        bValue = b.pID
    }

    if (typeof aValue === "string" && typeof bValue === "string")
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    else if (typeof aValue === "number" && typeof bValue === "number")
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    else 
      return sortOrder === "asc" ? a.pID - b.pID : b.pID - a.pID
  })

  return filtered
}, [searchTerm, sortBy, sortOrder, filterType, pokemonList])

  const allTypes = Array.from(new Set(pokemonList.flatMap((p) => p.types))).sort()
  const handleAddPokemon = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newPokemonName || !newLevel) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/addPokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pokemonName: newPokemonName,
          nickname: newNickname,
          level: parseInt(newLevel),
          uID: localStorage.getItem("uID")
        }),
      });

      if (response.ok) {
        const displayNickname = newNickname || newPokemonName;
        setBannerMessage(
          `Congratulations! You caught a level ${newLevel} ${newPokemonName} named ${displayNickname}!`
        );
        setTimeout(() => setBannerMessage(""), 4000);

        setIsModalOpen(false);
        setNewPokemonName("");
        setNewNickname("");
        setNewLevel("");

        const updated = await fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`).then((r) => r.json());
        setPokemonList(updated);
      } else {
        const errMsg = await response.text();
        console.error("Failed to add Pokémon:", errMsg);

        alert("Failed to add Pokémon. See console for details.");
      }
    } catch (err) {
      console.error("Error adding Pokémon:", err);
      alert("Something went wrong adding the Pokémon.");
    }
  };

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
      // Navigate back to myPokemon since this pokemon doesn't 
      // exist anymore and hence lacks a detail page
      // location.href = '/my-pokemon'
      setPokemonList(pokemonList.filter((pokemon) => pokemon.id !=instanceID));
      console.log(pokemonList);
    } catch (err) {
      console.error("Error releasing Pokémon: ", err);
      alert("Something went wrong releasing the Pokémon.");
    }
  };

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
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-container">
          <div className="results-count">
            Showing {filteredAndSortedPokemon.length} of {pokemonList.length} Pokémon
          </div>

          <div>
            <button onClick={() => setIsModalOpen(true)} className="enter-pokemon-button">
              + Add Pokemon
            </button>

            {isModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content large">
                  <div className="modal-header">
                    <h2>Add New Pokémon</h2>
                    <button className="close-button" onClick={() => setIsModalOpen(false)}>
                      &times;
                    </button>
                  </div>

                  <form className="pokemon-form" onSubmit={handleAddPokemon}>
                    <div className="input-row">
                      <div className="input-group">
                        <label>Pokemon</label>
                        <Autocomplete
                          // disablePortal
                          options={pokemonNames}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "& fieldset": {
                                border: "0px solid #ccc",   // normal border
                              }
                            },
                          }}
                          popupIcon={null}
                          disableClearable
                          autoSelect
                          autoHighlight
                          freeSolo={false}
                          inputValue={newPokemonName}
                          onInputChange={(event, newInputValue) => {setNewPokemonName(newInputValue)}}                          
                          renderInput={
                            (params) => <TextField {...params} size="small" fullWidth
                            sx={{
                              "& .MuiInputBase-input": {
                                height: 30,      // optional: controls text height
                              }
                            }}/>
                          }/>
                      </div>
                      <div className="input-group">
                        <label>Nickname</label>
                        <input
                          type="text"
                          placeholder="e.g., Sparky"
                          value={newNickname}
                          onChange={(e) => setNewNickname(e.target.value)}
                        />
                      </div>
                      <div className="input-group">
                        <label>Level</label>
                        <input
                          type="number"
                          placeholder="e.g., 25"
                          min={1}
                          max={100}
                          value={newLevel}
                          onChange={(e) => setNewLevel(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="add-button">
                        Add Pokémon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className="pokemon-grid">
          {filteredAndSortedPokemon.map((pokemon) => (
            // <PokemonCard key={pokemon.id} pokemon={pokemon} />
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
                    className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                      "bg-black/5 text-black/75 hover:bg-black/2"
                    }`}
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

        {filteredAndSortedPokemon.length === 0 && (
          <div className="no-results">
            <p>No Pokémon found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}