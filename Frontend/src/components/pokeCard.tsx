import { CardPokemon, Nature, PokemonStats } from "../types/pokemon-details"


type PokeCardInput = {
    cornerVisible?: boolean,
    onClick?: (variant: CardPokemon) => void,
    pokemon: CardPokemon,
    nature?: Nature,
    defaultDescription?: string,
    cornerElement?: React.ReactNode,
    extraElement?: React.ReactNode,
    numberVisible? : boolean,
}

const getFormBadgeColor = (form: string) => {
switch (form.toLowerCase()) {
    case "original":
    return "bg-gray-300 text-gray-900"
    case "alolan":
    return "bg-blue-100 text-blue-800"
    case "galarian":
    return "bg-purple-100 text-purple-800"
    case "hisuian":
    return "bg-pink-900 text-gray-200"
    case "mega x":
    case "mega y":
    case "mega":
    return "bg-red-500 text-white"
    case "gigantamax":
    return "bg-pink-500 text-white"
    default:
    return "bg-yellow-200 text-yellow-700"
}
}

export default function PokeCard({pokemon, nature, defaultDescription="", onClick, numberVisible=false, cornerVisible=false, cornerElement, extraElement}: PokeCardInput) { 
    return (
    <div
        className={`border bg-white rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        cornerVisible
            ? "border-primary ring-2 ring-primary/20"
            : "border-border "
        }`}
        onClick={() => {onClick ? onClick(pokemon) : () => {}}}
    >
        <div className="pokemon-card-header">
        <div className="pokemon-title-row">
            <h3 className="pokemon-title">
                {`${numberVisible ? `#${pokemon.pID.toString().padStart(3, '0')}` : ""}  ${'nickname' in pokemon && pokemon.nickname ? pokemon.nickname : pokemon.name}`}
                {'nickname' in pokemon && !!pokemon.nickname && <span className="pokemon-nickname">({pokemon.name})</span>}
            </h3>
            <div className="pokemon-badges">{cornerVisible && cornerElement}</div>
        </div>
        <div className="pokemon-image w-[200px] h-[200px] flex items-center justify-center overflow-hidden">
        <img
            src={`https://www.serebii.net/pokemon/art/${pokemon.imgID}.png`}
            alt={pokemon.name}
            // width={200}
            className="rounded-lg bg-white/20 p-2 h-[100%]"
            />
        </div>
        <div className="flex flex-row items-center justify-between">
            <div className={`pokemon-types ${(pokemon.form && !extraElement) && "justify-center"} flex gap-1`}>
                {pokemon.types.map((type: string) => (
                <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                    {type}
                </span>
                ))}
                {(pokemon.form && !extraElement) &&
                    <span key={pokemon.form} className={`ml-3 badge ${getFormBadgeColor(pokemon.form)}`}>
                        {pokemon.form}
                    </span>}
            </div>
            {extraElement}
        </div>
        
        {/* Variant Description */}
        <div className="pt-1">
            <p className="text-xs text-muted-foreground leading-relaxed">
            {pokemon.description ?? defaultDescription}
            </p>
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
            <span className="stat-value">{pokemon.stats.atk}</span>
            </div>
            <div className="stat-row">
            <span className="stat-label">Defense:</span>
            <span className="stat-value">{pokemon.stats.def}</span>
            </div>
            <div className="stat-row">
            <span className="stat-label">Sp. Atk:</span>
            <span className="stat-value">{pokemon.stats.spAtk}</span>
            </div>
            <div className="stat-row">
            <span className="stat-label">Sp. Def:</span>
            <span className="stat-value">{pokemon.stats.spDef}</span>
            </div>
            <div className="stat-row">
            <span className="stat-label">Speed:</span>
            <span className="stat-value">{pokemon.stats.speed}</span>
            </div>
        </div>
        </div>
    </div>
    )
}