import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { Ability } from "../../types/pokemon-details";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useState } from "react";
import { USER_POKEMON_API_URL } from "../../constants";

type Inputs = {
    abilities: Ability[],
    instanceID?: string,
    selectedAbility?: string,
    editable?: boolean
}

export default function AbilityCard({ abilities, instanceID, selectedAbility, editable=true }: Inputs) {
    const [expanded, setExpanded] = useState<string[]>([])
    const [setAbility, setSetAbility] = useState<string | undefined>(selectedAbility)

    useEffect(() => setSetAbility(selectedAbility), [selectedAbility])

    function toTitleCase(str: string) {
        return str.replace(
            /[\w+]*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        );
    }

    const toggleExpanded = (e: React.MouseEvent, ability: string) => {
        e.stopPropagation();
        if (expanded.includes(ability))
            setExpanded(expanded.filter((a) => a !== ability))
        else
            setExpanded([...expanded, ability])      
    }

    const selectAbility = async (ability: string) => {
        const newAbility = ability === setAbility ? undefined : ability;
        try {
            const response = await fetch(
                USER_POKEMON_API_URL + instanceID + '/ability/' + (newAbility ?? null),
                { method: "PATCH" }
            );
            if (response.ok) {
                setSetAbility(newAbility)
            } else {
                const errMsg = await response.text();
                console.error("Failed to update Pokémon ability:", errMsg);
                alert("Failed to update Pokémon ability. See console for details.");
            }
        } catch (err) {
            console.error("Error updating Pokémon ability:", err);
            alert("Something went wrong updating Pokémon ability.");
        }  
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Abilities</CardTitle>
                <CardDescription>The Abilities this pokemon can have</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {abilities.map((ability) => (
                    <div
                        key={ability.name}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 pl-5 pr-5 border
                            rounded-lg transition-colors hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                            ${ability.name === setAbility ? "border-black bg-muted" : "border-gray-300"}`}
                        onClick={!!instanceID && editable ? 
                            () => {selectAbility(ability.name)} : 
                            (e: React.MouseEvent) => {toggleExpanded(e, ability.name)}}
                    >
                        <div className="w-full">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-semibold text-lg text-foreground">{toTitleCase(ability.name)}</h2>
                                </div>
                                <div className="flex gap-4">
                                    <span>{ability.effect}</span>
                                </div>
                            </div>
                            {expanded.includes(ability.name) && 
                                <div className="mt-3 pt-1 w-full text-muted-foreground border-t border-muted-foreground">
                                    <span className="whitespace-pre-line">{ability.description}</span>
                                </div>
                            }
                        </div>
                        <div>
                            <button 
                                className="mtb-autp ml-2 p-2 bg-black/0 text-black/75 rounded-full 
                                    transition-all duration-200 hover:scale-110 hover:bg-black/4"
                                onClick={(e: React.MouseEvent) => toggleExpanded(e, ability.name)}
 
                            >
                                {expanded.includes(ability.name) 
                                ? <ChevronsDownUpIcon className="h-8 w-8"/> 
                                : <ChevronsUpDownIcon className="h-8 w-8"/>}
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}