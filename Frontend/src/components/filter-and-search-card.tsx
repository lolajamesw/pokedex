import { Search, SortAsc, SortDesc } from "lucide-react";
import { useEffect, useState } from "react";
import { CardPokemon, PokemonStats } from "../types/pokemon-details";

type Inputs<T extends CardPokemon> = {
    pokemonList: T[],
    setSortedPokemon: React.Dispatch<React.SetStateAction<T[]>>,
    extraFilterLabel?: string,
    extraFilterAttr?: keyof T,
}

export default function FilterAndSearchCard<T extends CardPokemon>({ pokemonList, setSortedPokemon, extraFilterLabel, extraFilterAttr } : Inputs<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [sortBy, setSortBy] = useState("number");
    const [sortOrder, setSortOrder] = useState("asc");
    const [allTypes, setAllTypes] = useState<string[]>([]);
    const [extraFilter, setExtraFilter] = useState<boolean>(false);

    useEffect(() => {
        setAllTypes(
            Array.from(
                new Set(pokemonList.flatMap((p) => p.types))
            ).sort()
        );
    }, [pokemonList])

    useEffect(() => {
        // Filter pokemon that match the search bar
        const filtered = pokemonList.filter((pokemon) => {
          const matchesSearch =
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pokemon.pID.toString().includes(searchTerm) ||
            ('nickname' in pokemon && !!pokemon.nickname && 
                String(pokemon.nickname).toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesType = filterType === "all" || pokemon.types.includes(filterType);
          const matchesExtraFilter = !extraFilterAttr || !extraFilter || !!(pokemon[extraFilterAttr])
    
          return matchesSearch && matchesType && matchesExtraFilter
        })
        // Sort the pokemon that remain after filtering
        filtered.sort((a, b) => {
          let aValue, bValue
          switch (sortBy) {
            case "name":
                if (!('nickname' in a && 'nickname' in b)) {
                    aValue = a.name
                    bValue = b.name
                    break;
                }
                aValue = a.nickname === null ? a.name : a.nickname
                bValue = b.nickname === null ? b.name : b.nickname
                break;
            case "pID":
              aValue = a[sortBy as keyof CardPokemon]
              bValue = b[sortBy as keyof CardPokemon]
              break
            default:
              aValue = a.stats[sortBy as keyof PokemonStats]
              bValue = b.stats[sortBy as keyof PokemonStats]
          }
    
          if (typeof aValue === "string" && typeof bValue === "string")
            return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
          else 
            return sortOrder === "asc" ? Number(aValue) - Number(bValue) : Number(bValue) - Number(aValue)
        })
        // Return the filtered and sorted pokemon
        setSortedPokemon(filtered);
      }, [searchTerm, sortBy, sortOrder, filterType, extraFilter, pokemonList])

    return (
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
                  <option value="pID">Number</option>
                  <option value="name">Name</option>
                  <option value="hp">HP</option>
                  <option value="atk">Attack</option>
                  <option value="def">Defense</option>
                  <option value="spAtk">Sp. Attack</option>
                  <option value="spDef">Sp. Defense</option>
                  <option value="speed">Speed</option>
                </select>
                <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="sort-button">
                  {sortOrder === "asc" ? <SortAsc className="sort-icon" /> : <SortDesc className="sort-icon" />}
                </button>
                {!!extraFilter &&
                    <div className="checkbox-container">
                        <input
                        type="checkbox"
                        id="caught-only"
                        checked={extraFilter}
                        onChange={(e) => setExtraFilter(e.target.checked)}
                        className="checkbox"
                        />
                        <label htmlFor="caught-only" className="checkbox-label">
                            {extraFilterLabel}
                        </label>
                    </div>
                }
              </div>
            </div>
          </div>
        </div>
    )
}