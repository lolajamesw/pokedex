import { Sparkles } from "lucide-react"
import { CardPokemon, MyPokemon, PokedexPokemon } from "../../types/pokemon-details.ts"
import PokeCard from "./../pokeCard.tsx";

type Inputs<T extends PokedexPokemon> = {
    variants: CardPokemon[],
    currentForm: string,
    instanceID?: number,
    editable?: boolean,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<T | null>>,
}

export default function PokemonVariantCard<T extends PokedexPokemon>({ variants, currentForm, instanceID, editable=true, updatePokemonDetail }: Inputs<T>) {
    const updateVariantDisplay = (variant: CardPokemon) => {
        updatePokemonDetail((prev) => ({
            ...prev,
            name: variant.name,
            form: variant.form,
            types: variant.types,
            description: variant.description,
            stats: variant.stats,
            imgID: variant.imgID,
        } as T))
    }

    const setMegaStone = async(variant: CardPokemon) => {
        const response = await fetch("http://localhost:8081/setHeldItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: instanceID, mega: true }),
        })
        if (response.ok) {
            const overviewRes = await fetch(`http://localhost:8081/userPokemon/${instanceID}`);
            const overviewData: MyPokemon = await overviewRes.json();
            updatePokemonDetail((prev) => {
                if (prev && 'heldItem' in prev && 'heldItemIcon' in prev) {
                    return {
                        ...prev,
                        heldItem: overviewData.heldItem,
                        heldItemIcon: overviewData.heldItemIcon
                    } 
                } 
                return prev
            })
        } else {
            const errMsg = await response.text();
            console.error("Failed to update Pokémon megaStone:", errMsg);
            alert("Failed to update Pokémon megaStone. See console for details.");
        }
    }

    const selectVariant = async (variant: CardPokemon) => {
        if (instanceID) {
            try {
                const response = await fetch("http://localhost:8081/setVariant", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ instanceID: instanceID, form: variant.name }),
                });
                if (variant.mega) {
                    setMegaStone(variant);
                }
                if (response.ok) {
                    updateVariantDisplay(variant)
                } else {
                    const errMsg = await response.text();
                    console.error("Failed to update Pokémon variant:", errMsg);
                    alert("Failed to update Pokémon variant. See console for details.");
                }
            } catch (err) {
                console.error("Error updating Pokémon variant:", err);
                alert("Something went wrong updating Pokémon variant.");
            }  
        }
        else {
            updateVariantDisplay(variant);
        }
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
                        onClick={() => {if (editable) selectVariant}}
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