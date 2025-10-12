import { useState } from "react";
import { X, Star } from "lucide-react";

import pokeIcon from "./../assets/pokeIcon.png";
import { MyPokemon, Item, CardPokemon } from "../types/pokemon-details";


type InputType = {
    items: Item[];
    variants: CardPokemon[];
    heldItem: string | null;
    instanceID: number;
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>;
    setShowItemSelector: React.Dispatch<React.SetStateAction<boolean>>;
    removeItem: () => void;
    updateVariant: (form: string, findFunc: (variant: CardPokemon) => boolean) => void;
}

export default function ItemSelectorModal({ 
    items, variants, heldItem, instanceID, updatePokemonDetail, setShowItemSelector, removeItem, updateVariant 
}: InputType) {

    const [expandAll, setExpandAll] = useState(false);
    const [collapsedItems, setCollapsedItems] = useState(new Set(items.map((item) => item.name)));

    const giveItem = async (item: Item) => {
        try {
        const response = await fetch("http://localhost:8081/setHeldItem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: instanceID, item: item.name }),
        });

        if (response.ok) {
            updatePokemonDetail((prev) => {
                if (items.find((item) => item.name === prev?.heldItem)?.variant && !item.variant) {
                    updateVariant(
                        variants.find((variant) => variant.form === 'original')?.name ?? "", 
                        (variant) => variant.form === 'original'
                    );
                }
                return ({ ...prev, heldItem: item.name, heldItemIcon: item.icon } as MyPokemon)
            });
            if (item.variant) {
                updateVariant(item.variant, (variant) => variant.name === item.variant);
            }            
            setShowItemSelector(false);
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

    const toggleExpandAll = () => {
        if (expandAll) {
        // Collapse all
        setCollapsedItems(new Set(items.map((item) => item.name)))
        setExpandAll(false)
        } else {
        // Expand all
        setCollapsedItems(new Set())
        setExpandAll(true)
        }
    }

    const toggleItemCollapse = (itemId: string) => {
        setCollapsedItems((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(itemId)) {
            newSet.delete(itemId)
        } else {
            newSet.add(itemId)
        }
        return newSet
        })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full mx-4 shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="modal-header flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Select Item</h3>
            <div className="flex items-center gap-2">
                <button
                onClick={toggleExpandAll}
                className="bg-white px-3 py-1 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                {expandAll ? "Collapse All" : "Expand All"}
                </button>
                <button
                onClick={() => setShowItemSelector(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                <X className="h-5 w-5" />
                </button>
            </div>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {items.map((item) => {
                const isCollapsed = collapsedItems.has(item.name)
                const isSelected = heldItem === item.name

                return (
                <div
                    key={item.name}
                    className={`border rounded-lg transition-colors ${
                    isSelected ? "bg-white border-primary bg-primary/5" : "bg-white border-border hover:border-primary"
                    }`}
                >
                    {/* Item Header - Always Visible */}
                    <div
                    className="flex items-center gap-4 p-4 cursor-pointer"
                    onClick={() => toggleItemCollapse(item.name)}
                    >
                    <img
                        src={item.icon==="null" ? pokeIcon : item.icon}
                        alt={item.name}
                        width={35}
                        height={35}
                        className="mx-auto"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground">{item.name}</h4>
                        {isSelected && (
                        <div className="text-primary">
                            <Star className="h-4 w-4 fill-current" />
                        </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                        onClick={(e) => {
                            e.stopPropagation()
                            giveItem(item)
                        }}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors text-green-600 ${
                            isSelected
                            ? "bg-green-200 text-primary"
                            : "bg-green-100 text-primary hover:bg-green-200"
                        }`}
                        >
                        {isSelected ? "Selected" : "Select"}
                        </button>
                        <div className={`transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}>
                        <svg
                            className="h-4 w-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        </div>
                    </div>
                    </div>

                    {/* Item Description - Collapsible */}
                    {!isCollapsed && (
                    <div className="px-4 pb-4 border-t border-border/50 pt-3 mt-1">
                        <p className="text-sm text-foreground leading-relaxed">{item.effect}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                    )}
                </div>
                )
            })}
            </div>

            <div className="p-4 mt-4 pt-4">
            <div className="flex gap-3">
                <button
                onClick={() => setShowItemSelector(false)}
                className="bg-white flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                >
                Cancel
                </button>
                {heldItem && (
                <button
                    onClick={() => {
                    removeItem()
                    setShowItemSelector(false)
                    }}
                    className="flex-1 px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                    Remove Item
                </button>
                )}
            </div>
            </div>
        </div>
        </div>
    )
}