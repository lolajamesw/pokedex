import { Sparkles } from "lucide-react"
import { CardPokemon, MyPokemon, PokedexPokemon } from "../types/pokemon-details"
import PokeCard from "./pokeCard.tsx";

type Inputs<T extends PokedexPokemon> = {
    variants: CardPokemon[],
    currentForm: string,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<T | null>>,
}

export default function PokemonVariantCard<T extends PokedexPokemon>({ variants, currentForm, updatePokemonDetail }: Inputs<T>) {
    const selectVariant = (variant: CardPokemon) => {
        updatePokemonDetail((prev) => ({
          ...prev,
          name: variant.name,
          form: variant.form,
          types: variant.types,
          description: variant.description,
          stats: variant.stats,
          imgID: variant.imgID
        } as T))
      }

    return (
        <div className="card">
            <div className="card-header">
            <h3 className="card-title flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Pokémon Variants
            </h3>
            <p className="card-description">
                Different forms and regional variants of this Pokémon, including Mega Evolutions and regional forms
            </p>
            </div>
            <div className="card-content">
            {(() => {
                return (
                <div className="space-y-4">
                    <div className={`grid grid-cols-1 md:grid-cols-2 
                    lg:grid-cols-${!(variants.length%3) ? "3" : (variants.length % 4) ? "2" : "4"} gap-4`}>
                    {Object.entries(variants).map(([key, variant]: [string, CardPokemon]) => 
                        <PokeCard
                        pokemon={variant}
                        onClick={selectVariant}
                        cornerVisible={currentForm === variant.form}
                        cornerElement = {
                            <div className="pokemon-badges">
                            <span className="badge badge-caught">Selected</span>
                            </div>
                        }
                        />
                    )}
                    </div>

                    {/* Variant Information */}
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm text-foreground">About Pokémon Variants</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                        <div>
                        <strong>Regional Forms:</strong> Pokémon that adapted to different environments
                        <br />
                        <strong>Mega Evolution:</strong> Temporary powerful transformations during battle
                        </div>
                        <div>
                        <strong>Gigantamax:</strong> Special Dynamax forms with unique appearances
                        <br />
                        <strong>Alternate Forms:</strong> Different appearances of the same species
                        </div>
                    </div>
                    </div>
                </div>
                )
            })()}
            </div>
        </div>
    )
}