import { Search, SortAsc, SortDesc, SquaresIntersect, SquaresUnite } from "lucide-react";
import { useEffect, useState } from "react";
import { CardPokemon, PokemonStats } from "../types/pokemon-details";
import { Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";

type Inputs<T extends CardPokemon> = {
    pokemonList: T[],
    setSortedPokemon: React.Dispatch<React.SetStateAction<T[]>>,
    extraFilterLabel?: string,
    extraFilterAttr?: keyof T,
}

export default function FilterAndSearchCard<T extends CardPokemon>({ pokemonList, setSortedPokemon, extraFilterLabel, extraFilterAttr } : Inputs<T>) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("pID");
    const [sortOrder, setSortOrder] = useState("asc");
    const [allTypes, setAllTypes] = useState<string[]>([]);
    const [exactType, setExactType] = useState(false)
    const [extraFilter, setExtraFilter] = useState<boolean>(false);

    useEffect(() => {
        setAllTypes(
            Array.from(
                new Set(pokemonList.flatMap((p) => p.types))
            ).sort()
        );
    }, [pokemonList])

    const eqSet = (xs: Set<string>, ys: Set<string>) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

    useEffect(() => {
        // Filter pokemon that match the search bar
        const typeSet = new Set(filteredTypes);
        console.log(filteredTypes)
        console.log(typeSet)
        const filtered = pokemonList.filter((pokemon) => {
          const matchesSearch =
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pokemon.pID.toString().includes(searchTerm) ||
            ('nickname' in pokemon && !!pokemon.nickname && 
                String(pokemon.nickname).toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesType = typeSet.size===0 ? true : exactType ? (
            eqSet(new Set(pokemon.types), typeSet)
          ) : (
            typeSet.has(pokemon.types[0]) || (
              pokemon.types.length===2 && typeSet.has(pokemon.types[1])
            )
          );
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
      }, [searchTerm, sortBy, sortOrder, filteredTypes, extraFilter, exactType, pokemonList])

      const updateFilteredTypes = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        const newTypes = typeof value === 'string' ? value.split(',') : value;
        setFilteredTypes(
          newTypes,
        );
        if (newTypes.length === 0 || newTypes.length > 2)
          setExactType(false);
      };

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

              <ToggleButtonGroup 
                value={exactType} 
                onChange={(e, val) => {if (val !== null) setExactType(val)}} 
                size="small" exclusive
                disabled={filteredTypes.length === 0 || filteredTypes.length > 2}
              >
                <Tooltip title="types include">
                  <ToggleButton value={false}><SquaresUnite/></ToggleButton>
                </Tooltip>
                <Tooltip title="types match">
                  <ToggleButton value={true}><SquaresIntersect/></ToggleButton>
                </Tooltip>              
              </ToggleButtonGroup>

              <Select
                multiple
                value={filteredTypes}
                onChange={updateFilteredTypes}
                renderValue={(types) => types.length < 1 ? "All types" : [...types].join(', ')}
                className="type-select"
              >
                {allTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={filteredTypes.includes(type)} />
                    <ListItemText primary={type} />
                  </MenuItem>
                ))}
              </Select>
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