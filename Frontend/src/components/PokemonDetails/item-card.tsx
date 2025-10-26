import { useEffect, useState } from "react";
import { X, Star, ChevronsUpDownIcon, ChevronsDownUpIcon } from "lucide-react";

import pokeIcon from "./../../assets/pokeIcon.png";
import { CardPokemon, Item, MyPokemon } from "../../types/pokemon-details";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { giveItem, removeItem } from "../../item-functions";

type Inputs = {
    variants: CardPokemon[];
    heldItem: string | null;
    instanceID: number;
    updatePokemonDetail: React.Dispatch<React.SetStateAction<MyPokemon | null>>;
    pID: string;
    name: string;
    editable?: boolean;
}

export default function ItemCard({ 
    pID, name, variants, heldItem, instanceID, updatePokemonDetail, editable=true 
}: Inputs) {
    const [items, setItems] = useState<Item[]>([]);
    const [expandAll, setExpandAll] = useState(false);
    const [expanded, setExpanded] = useState(new Set(items.map((item) => item.name)));
    
    useEffect (() => {
        const fetchItems = async () => {
            const itemsRes = await fetch(`http://localhost:8081/pokemon/items/${pID}`);
            const itemData = await itemsRes.json();
            console.log("fetched item data");
            setItems(itemData);
        }
        fetchItems();
    }, [])

    function toTitleCase(str: string) {
        return str.replace(
            /[\w+]*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    const toggleExpandAll = () => {
        if (expandAll) {
        // Collapse all
        setExpanded(new Set())
        setExpandAll(false)
        } else {
        // Expand all
        setExpanded(new Set(items.map((item) => item.name)))
        setExpandAll(true)
        }
    }

    const toggleExpanded = (e: React.MouseEvent, item: string) => {
        e.stopPropagation();
        setExpanded((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(item)) {
                newSet.delete(item)
            } else {
                newSet.add(item)
            }
            return newSet
        }) 
    }

    return(
        <Card>
            <CardHeader>
                <div className="flex justify-between pl-2 pr-4">
                    <div>
                        <CardTitle>Items</CardTitle>
                        <CardDescription>The Abilities this pokemon can have</CardDescription>
                    </div>
                    <button 
                        className="w-30 text-white rounded-lg bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 active:scale-97"
                        onClick={toggleExpandAll}
                        >
                        {expandAll ? 'Collapse All' : 'Expand All'}
                    </button>
                </div>
                
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 space-y-3 space-x-3">
                    {items.map((item) => (
                    <div
                        key={item.name}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 pl-5 pr-5 border
                            rounded-lg transition-colors hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                            ${item.name === heldItem ? "border-black bg-muted" : "border-gray-300"}`}
                        onClick={ 
                            (e) => {
                                if (editable) {
                                    if (item.name === heldItem) 
                                        removeItem(items, heldItem, name, variants, instanceID, updatePokemonDetail) 
                                    else 
                                        giveItem(item, items, variants, instanceID, updatePokemonDetail)
                                    }
                                else
                                    toggleExpanded(e, item.name)
                            }
                        } 
                    >
                        <div className="w-full">
                                <div className="flex items-center gap-2 mb-1">
                                    <img
                                        src={item.icon==="null" ? pokeIcon : item.icon}
                                        alt={item.name}
                                        width={35}
                                        height={35}
                                        className=""
                                    />
                                    <h2 className="font-semibold text-lg text-foreground">{toTitleCase(item.name)}</h2>
                                </div>
                            {expanded.has(item.name) && 
                                <div>
                                    <span>{item.effect}</span>
                                    <div className="mt-2 pt-1 w-full border-t border-muted-foreground"></div>
                                    <span className="whitespace-pre-line text-muted-foreground">{item.description}</span>
                                </div>
                            }
                        </div>
                        <div className="self-stretch pt-2 pb-2">
                            <button 
                                className="h-full w-12 ml-2 bg-black/0 text-black/50 rounded-full 
                                    transition-all duration-200 hover:scale-110 hover:bg-black/4 
                                    hover:text-black/70 active:scale-95"
                                onClick={(e: React.MouseEvent) => toggleExpanded(e, item.name)}
 
                            >
                                {expanded.has(item.name) 
                                ? <ChevronsDownUpIcon className="m-auto h-8 w-8"/> 
                                : <ChevronsUpDownIcon className="m-auto h-8 w-8"/>}
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}