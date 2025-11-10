import { USER_POKEMON_API_URL } from "./constants";
import { CardPokemon, Item, MyPokemon } from "./types/pokemon-details";

export async function removeItem(
    items: Item[],
    heldItem: string,
    pName: string,
    variants: CardPokemon[],
    instanceID: number,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>
) {
    try {
        const response = await fetch(
            USER_POKEMON_API_URL + instanceID + '/item/null', 
            {method: "PATCH"}
        );

        if (response.ok) {
            const prevItem = items.find((item) => item.name === heldItem);
            if (prevItem && prevItem.variant === pName) {
                updateVariant(
                    variants.find((variant) => variant.form === 'original')?.name ?? "", 
                    variants, instanceID, updatePokemonDetail,
                    (variant) => variant.form === 'original'
                );
            }
            updatePokemonDetail((prev) => ({ ...prev, heldItem: null, heldItemIcon: null } as MyPokemon));
        } else {
            const errMsg = await response.text();
            console.error("Failed to update Pokémon moveset:", errMsg);
            alert("Failed to update Pokémon moveset. See console for details.");
        }
    } catch (err) {
        console.error("Error updating Pokémon item:", err);
        alert("Something went wrong updating Pokémon heldItem.");
    }
}


export async function giveItem(
    item: Item,
    items: Item[],
    variants: CardPokemon[],
    instanceID: number,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>
) {
    try {
    const response = await fetch(
        USER_POKEMON_API_URL + instanceID + '/item/' + item.name, 
        {method: "PATCH"}
    );

    if (response.ok) {
        updatePokemonDetail((prev) => {
            if (items.find((item) => item.name === prev?.heldItem)?.variant && !item.variant) {
                updateVariant(
                    variants.find((variant) => variant.form === 'original')?.name ?? "", 
                    variants, instanceID, updatePokemonDetail,
                    (variant) => variant.form === 'original'
                );
            }
            return ({ ...prev, heldItem: item.name, heldItemIcon: item.icon } as MyPokemon)
        });
        if (item.variant) {
            updateVariant(item.variant, 
                variants, instanceID, updatePokemonDetail, 
                (variant) => variant.name === item.variant);
        }            
    } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon moveset:", errMsg);
        alert("Failed to update Pokémon moveset. See console for details.");
    }
    } catch (err) {
        console.error("Error updating Pokémon item:", err);
        alert("Something went wrong updating Pokémon heldItem.");
    }       
}


const updateVariant = async(
    form: string, 
    variants: CardPokemon[],
    instanceID: number,
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>,
    findFunc: (variant: CardPokemon) => boolean
) => {
    const response = await fetch(
        USER_POKEMON_API_URL + instanceID + '/variant/' + form, 
        {method: "PATCH"}
    );
    if (response.ok) {
        const variant = variants.find(findFunc);
        updatePokemonDetail((prev) => ({
            ...prev,
            name: variant?.name,
            form: variant?.form,
            types: variant?.types,
            description: variant?.description,
            stats: variant?.stats,
            imgID: variant?.imgID,
        } as MyPokemon))
    } else {
        const errMsg = await response.text();
        console.error("Failed to update Pokémon variant:", errMsg);
        alert("Failed to update Pokémon variant. See console for details.");
    }
    
}