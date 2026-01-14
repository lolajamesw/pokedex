import { Ban, Filter, SquaresIntersect, SquaresUnite, Swords } from "lucide-react"
import { MyPokemon, PokedexPokemon, AttackDetails } from "../../types/pokemon-details"
import "./../../css/moves.css"
import { useEffect, useRef, useState } from "react"
import { POKEMON_API_URL } from "../../constants"
import { Checkbox, ListItemText, MenuItem, Select, SelectChangeEvent, ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material"

type Inputs = {
    pokemon: MyPokemon | PokedexPokemon,
    learnButton?: (move: AttackDetails) => React.ReactNode,
    knownMoves?: string[],
}

export default function PokemonMovesCard({ pokemon, learnButton, knownMoves=[] }: Inputs) {
    const [types, setTypes] = useState<string[]>([]);
    const [filteredTypes, filterTypes] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [tm, setTm] = useState<boolean | null>(null);
    const [sortOrder, setSortOrder] = useState<string[]>([]);
    const [moves, setMoves] = useState<AttackDetails[]>(pokemon.attacks);
    const [filterOpen, setFilterOpen] = useState<Boolean>(false);
    const filterDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch(POKEMON_API_URL + 'types')
            .then((res) => res.json())
            .then((types) => setTypes(types.map((type:{type:string}) => type.type)))
            .then(() => filterTypes(types))
            .catch((err) => console.log("Unable to fetch types: " + err))
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('.MuiPopover-root') || target.closest('.MuiMenu-root'))
                return;
            if (filterOpen && filterDiv.current && !filterDiv.current.contains(e.target as Node)) {
                setFilterOpen(false)
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [filterOpen])

    useEffect(() => {
        const remainingAttrs = ['Name', 'Power', 'Accuracy', 'PP', 'Type', 'Category'].filter((attr) => !(sortOrder.includes(attr)));
        console.log([...sortOrder, ...remainingAttrs])
        setMoves(pokemon.attacks.filter((move) => (
            (tm===null || (tm && move.TM) || !(tm || move.TM)) &&
            (filteredTypes.length === 0 || filteredTypes.includes(move.type)) &&
            (categories.length===0 || categories.includes(move.category.toLowerCase()))
        )).sort((a, b) => {
            const compare = (a: AttackDetails, b: AttackDetails, attr: String) => {
                switch (attr) {
                    case 'Name': 
                        return a.name > b.name ? 1 : -1;
                    case 'Power': 
                        return (a.stats.power || 0) === (b.stats.power || 0) ? 0 : 
                        (a.stats.power || 0) > (b.stats.power || 0) ? -1 : 1;
                    case 'Accuracy': 
                        return (a.stats.accuracy || 0) === (b.stats.accuracy || 0) ? 0 : 
                        (a.stats.accuracy || 0) > (b.stats.accuracy || 0) ? -1 : 1;
                    case 'PP': 
                        return a.stats.pp === b.stats.pp ? 0 : 
                        a.stats.pp > b.stats.pp ? -1 : 1;
                    case 'Type': 
                        return a.type === b.type ? 0 : 
                        a.type > b.type ? 1 : -1;
                    case 'Category': 
                        return a.category === b.category ? 0 : 
                        a.category > b.category ? 1 : -1;
                    default: return 5;
                }
            }
            for (const elem of [...sortOrder, ...remainingAttrs]) {
                if (compare(a, b, elem) !== 0) return compare(a, b, elem);
            }
            return 0;
        }))
    }, [filteredTypes, categories, tm, sortOrder])

    const updateFilteredTypes = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        const newTypes = typeof value === 'string' ? value.split(',') : value;
        filterTypes(newTypes);
    }

    const updateSortOrder = (event: SelectChangeEvent<string[]>) => {
        const { target: { value } } = event;
        const newOrder = typeof value === 'string' ? value.split(',') : value;
        setSortOrder(newOrder);
    }
    
    return (
        <div className="card">
            <div className="card-top">
                <div className="card-header">
                    <h3 className="card-title flex items-center gap-2">
                        <Swords className="h-5 w-5" />
                        Learnable Moves
                    </h3>
                    <p className="card-description">Moves that this Pokémon can learn through leveling up and TMs</p>
                </div>
                <button className="filter-button" onClick={() => setFilterOpen(!filterOpen)}><Filter/></button>
            </div>
            <div className="card-content">
            {filterOpen &&
                <div ref={filterDiv} className="filter-modal">
                    <div className="filter-group">
                        <label>Move Type</label>
                        <Select
                            multiple
                            value={filteredTypes}
                            onChange={updateFilteredTypes}
                            renderValue={(types) => !types ? "All types" : [...types].join(', ')}
                            className="type-select input"
                        >
                            {types.map((type) => (
                            <MenuItem key={type} value={type}>
                                <Checkbox checked={filteredTypes.includes(type)} />
                                <ListItemText primary={type} />
                            </MenuItem>
                            ))}
                        </Select>                 
                    </div>
                    <div className="filter-group">
                        <label>Move Category</label>
                        <ToggleButtonGroup 
                            value={categories} 
                            onChange={(e, val) => {if (val !== null) setCategories(val)}} 
                            size="small"
                            className="input"
                        >
                            <Tooltip title="Physical Attack">
                            <ToggleButton value={'physical'}><img src='/physical-move.png' width={35}/></ToggleButton>
                            </Tooltip>
                            <Tooltip title="Special Attack">
                            <ToggleButton value={'special'}><img src='/special-move.png' width={35}/></ToggleButton>
                            </Tooltip>  
                            <Tooltip title="Status Effect">
                            <ToggleButton value={'status'}><img src='/status-move.png' width={35}/></ToggleButton>
                            </Tooltip>              
                        </ToggleButtonGroup>
                    </div>
                    <div className="filter-group">
                        <label>TM</label>
                        <ToggleButtonGroup 
                            value={tm} 
                            onChange={(e, val) => {setTm(val)}} 
                            size="small" exclusive
                            className="input"
                        >
                            <Tooltip title="Obtainable by TM">
                            <ToggleButton value={true}><img src='/tm.png' width={24}/></ToggleButton>
                            </Tooltip>
                            <Tooltip title="Not Obtainable by TM">
                            <ToggleButton value={false}><Ban/></ToggleButton>
                            </Tooltip>              
                        </ToggleButtonGroup>      
                    </div>
                    <div className="filter-group">
                        <label>Order By</label>
                        <Select
                            multiple
                            value={sortOrder}
                            onChange={updateSortOrder}
                            renderValue={(attrs) =>[...attrs].join(', ')}
                            className="type-select input"
                        >
                            {['Name', 'Power', 'Accuracy', 'PP', 'Type', 'Category'].map((attr) => (
                            <MenuItem key={attr} value={attr}>
                                <Checkbox checked={sortOrder.includes(attr)} />
                                <ListItemText primary={attr} />
                            </MenuItem>
                            ))}
                        </Select>         
                    </div>
                </div>
            }
            <div className="move-grid moves-container space-y-3 max-h-155 overflow-y-auto">
                {moves.map((move, index) => (
                <div
                    key={index}
                    className={`${knownMoves.includes(move.name) ? "outline-3 outline-black" : ""} move-card bg-${move.type.toLowerCase()}`}
                >
                    <div className="head">
                        <h2 className="move-name">{move.name}</h2>
                        {learnButton && learnButton(move)}
                    </div>
                    <div className="move-body">
                        <div className="move-categorization">
                            <div className={`type outline-2 outline-slate-200/50 type-${move.type.toLowerCase()}`}>{move.type}</div>
                            <div className={`category `}>
                                    <img src={'/' + move.category.toLowerCase() + '_move.png'}/>
                                </div>
                                {move.TM && 
                                    <div className="tm"><img src='/tm.png' width={35}/></div>
                                }
                        </div>
                        <div className="move-stats bg-white/65">
                            <div>
                                <h4 className="value-title">Power</h4>
                                <h1 className="value">{move.stats.power || "—"}</h1>
                            </div>
                            <div>
                                <h4 className="value-title">Accuracy</h4>
                                <h1 className="value">{move.stats.accuracy || '—'}</h1>
                            </div>
                            <div>
                                <h4 className="value-title">PP</h4>
                                <h1 className="value">{move.stats.pp}</h1>
                            </div>
                            <div className="description">
                                <p>{move.effect}</p>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>
    )
}

