import { useState, useEffect } from "react"
import { MyPokemon, Nature, natures, PokemonStats } from "../../types/pokemon-details.ts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card.tsx"
import { Progress } from "../ui/progress.tsx";
import { Heart, Shield, ShieldHalf, SlidersHorizontal, Sparkle, Sparkles, Sword, Swords, Wind } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select.tsx"
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import { USER_POKEMON_API_URL } from "../../constants.ts";

type Inputs = {
    pokemon: MyPokemon,
    updatePokemon: React.Dispatch<React.SetStateAction<MyPokemon | null>>,
    editable?: boolean,
}

export default function MyPokemonStatsCard({ pokemon, updatePokemon, editable=true }: Inputs) {
    const [nature, setNature] = useState<Nature>(natures.filter((n) => n.nature === pokemon.nature)[0]);
    const [evs, setEvs] = useState<PokemonStats>({hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0})
    const [ivs, setIvs] = useState<PokemonStats>({hp: 0, atk: 0, def: 0, spAtk: 0, spDef: 0, speed: 0})
    const [evPool, setEvPool] = useState<number>(508);

    const getStatColor = (stat: number) => {
        if (stat >= 300) return "bg-green-500";
        if (stat >= 200) return "bg-yellow-500";
        if (stat >= 100) return "bg-orange-500";
        return "bg-red-500";
    };

    const getStatIcon = (stat: string) => {
        switch (stat) {
            case "hp":
                return <Heart className="h-4 w-4" />
            case 'atk':
                return <Sword className="h-4 w-4" />
            case 'def':
                return <Shield className="h-4 w-4" />
            case 'spAtk':
                return <Swords className="h-4 w-4" />
            case 'spDef':
                return <ShieldHalf className="h-4 w-4" />
            case 'speed':
                return <Wind className="h-4 w-4" />
        }
    }

    const getNewStat = (stat: keyof PokemonStats, value: number) => {
        const natureMult = nature.strength === nature.weakness ? 1 
        : stat === nature.strength ? 1.1 
        : stat === nature.weakness ? 0.9 
        : 1;
        return Math.floor((
            value + (
                value / 50 + evs[stat] / 100 + ivs[stat] / 100
            ) * pokemon.level
        ) * natureMult);
    }

    const mapStats = () => {
        return {
            hp: getNewStat('hp', pokemon.stats.hp),
            atk: getNewStat('atk', pokemon.stats.atk),
            def: getNewStat('def', pokemon.stats.def),
            spAtk: getNewStat('spAtk', pokemon.stats.spAtk),
            spDef: getNewStat('spDef', pokemon.stats.spDef),
            speed: getNewStat('speed', pokemon.stats.speed)
        }
    }

    const [stats, setStats] = useState<PokemonStats>(mapStats());

    const updateNature = async (newNature: string) => {
        const response = await fetch(
            USER_POKEMON_API_URL + pokemon.id + '/nature/' + newNature, { method: "PATCH" }
        );
        if (response.ok) {
            updatePokemon((prev) => ({
                ...prev,
                nature: newNature,
            } as MyPokemon));
            setNature(natures.filter((n) => n.nature === newNature)[0]);
        } else {
            const errMsg = await response.text();
            console.error("Failed to update Pokémon nature:", errMsg);
            alert("Failed to update Pokémon nature. See console for details.");
        }
    }

    const handleInputChange = (
        stat: keyof PokemonStats, 
        value: number, 
        setter: React.Dispatch<React.SetStateAction<PokemonStats>>,
        min: number, max: number
    ) => {
        value = Math.max(Math.min(value, max), min)
        if (setter === setEvs) {
        setEvPool((prev) => evPool + evs[stat] - value)
        }
        setter((prev) => ({
            ...prev,
            [stat]: value
        } as PokemonStats));
    };

    const commitSliderChange = () => {
        fetch(USER_POKEMON_API_URL + pokemon.id + '/evs-ivs', {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ instanceID: pokemon.id, hpEV: evs.hp, atkEV: evs.atk, defEV: evs.def,
                spAtkEV: evs.spAtk, spDefEV: evs.spDef, speedEV: evs.speed, hpIV: ivs.hp, atkIV: ivs.atk, defIV: ivs.def,
                spAtkIV: ivs.spAtk, spDefIV: ivs.spDef, speedIV: ivs.speed
             }),
        });
    }

    useEffect(() => setStats(mapStats()), [nature, evs, ivs])
    useEffect(() => {
        const setEVsIVs = async () => {
            const EVsIVsRes = await fetch(USER_POKEMON_API_URL + pokemon.id + '/evs-ivs');
            const EVsIVsData = await EVsIVsRes.json();
            console.log("fetched EV / IV data");
            const newEVs = ({
                hp: EVsIVsData.hpEV,
                atk: EVsIVsData.atkEV,
                def: EVsIVsData.defEV,
                spAtk: EVsIVsData.spAtkEV,
                spDef: EVsIVsData.spDefEV,
                speed: EVsIVsData.speedEV
            } as PokemonStats);
            setEvs(() => newEVs);
            setIvs(() => ({
                hp: EVsIVsData.hpIV,
                atk: EVsIVsData.atkIV,
                def: EVsIVsData.defIV,
                spAtk: EVsIVsData.spAtkIV,
                spDef: EVsIVsData.spDefIV,
                speed: EVsIVsData.speedIV
            } as PokemonStats));
            setEvPool(508 - Object.values(newEVs).reduce((sum, value) => sum + value, 0));
        }
        setEVsIVs();
    }, [])

    return (
        <Card>
            <CardHeader>
            <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Stats
                </CardTitle>
                {editable ? 
                    <Select value={nature.nature} onValueChange={(selected) => updateNature(selected)}>
                        <SelectTrigger className="w-50">
                            <div className="flex items-center gap-2">
                                <div className="text-green-500">{getStatIcon(nature.strength)}</div>
                                <div className="text-red-500">{getStatIcon(nature.weakness)}</div>
                                <span>{nature.nature}</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {natures.map((nature) => (
                            <SelectItem key={nature.nature} value={nature.nature}>
                                <div className="flex items-center gap-2">
                                    <div className="text-green-500">{getStatIcon(nature.strength)}</div>
                                    <div className="text-red-500">{getStatIcon(nature.weakness)}</div>
                                    <span>{nature.nature}</span>
                                </div>
                            </SelectItem>
                            ))}
                        </SelectContent>
                    </Select> 
                    : 
                    <Card className="w-50 h-10 p-2 px-4 rounded-md">
                        <div className="flex items-center gap-2">
                            <div className="text-green-500">{getStatIcon(nature.strength)}</div>
                            <div className="text-red-500">{getStatIcon(nature.weakness)}</div>
                            <span>{nature.nature}</span>
                        </div>
                    </Card>
                }
                
            </div>
            <CardDescription>The current statistical values for this Pokémon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
            <div className="grid gap-3">
                {Object.entries(stats).map(([stat, value]) => (
                    <Card key={stat} className="p-3 border-gray-200 bg-white hover:!bg-muted hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                        <div key={stat} className="space-y-2">
                            <div className="flex justify-between items-center">
                            <div className="flex justify-left">
                                <span className="mt-1 mr-1">{getStatIcon(stat)}</span>
                                <span className="font-medium capitalize">
                                    {
                                        stat === "hp"
                                            ? "HP"
                                            : stat === "spAtk"
                                                ? "Sp. Attack"
                                                : stat === "spDef"
                                                    ? "Sp. Defense"
                                                    : stat.charAt(0).toUpperCase() + stat.slice(1)
                                        
                                    } 
                                </span>
                                <span className="text-muted-foreground ml-2">{`(Base value: ${pokemon.stats[stat as keyof PokemonStats]})`}</span>
                            </div>
                            <span className="font-bold">{value}</span>
                            </div>
                            <Progress value={(value / 500) * 100} color={getStatColor(value)} className="h-2" />
                            <div className="md:flex">
                                {/* EV */}
                                <div className="w-full md:w-2/3 flex">
                                    <span className="font-medium mr-2">EV:</span>
                                    {editable ? 
                                        <Input
                                            className="w-14 md:w-13 mr-2"
                                            value={evs[stat as keyof PokemonStats]}
                                            size="small"
                                            disableUnderline={true}
                                            onChange={(event) => handleInputChange(stat as keyof PokemonStats, Number(event.target.value), setEvs, 0, Math.min(252, evPool+evs[stat as keyof PokemonStats]))}
                                            inputProps={{
                                            step: 1,
                                            min: 0,
                                            max: Math.min(252, evPool+evs[stat as keyof PokemonStats]),
                                            type: 'number',
                                            'aria-labelledby': 'input-slider',
                                            }}
                                        />
                                        :
                                        <span className="w-12 md:w-11 mr-2">
                                            {evs[stat as keyof PokemonStats]}
                                        </span>
                                    }
                                    {editable ? 
                                        <Slider 
                                            size="small"
                                            min={0}
                                            max={252}
                                            step={1}
                                            onChange={(event, ev) => handleInputChange(stat as keyof PokemonStats, Math.min(ev, evPool+evs[stat as keyof PokemonStats]), setEvs, 0, Math.min(252, evPool+evs[stat as keyof PokemonStats]))}
                                            onChangeCommitted={commitSliderChange}
                                            value={evs[stat as keyof PokemonStats]}
                                            sx={{
                                                color: "#7a8ae6ff"
                                            }}
                                        />
                                        :
                                        <Progress 
                                            className="my-auto"
                                            value={evs[stat as keyof PokemonStats] * 100 / 252} 
                                            color="bg-indigo-400"
                                        />
                                    }
                                </div>
                                {/* IV */}
                                <div className="w-full md:w-1/3 flex">
                                <span className="font-medium md:ml-4 mr-2">IV:</span>
                                {editable ? 
                                    <Input
                                        className="w:15 md:w-14 mr-1"
                                        value={ivs[stat as keyof PokemonStats]}
                                        size="small"
                                        disableUnderline={true}
                                        onChange={(event) => handleInputChange(stat as keyof PokemonStats, Number(event.target.value), setIvs, 0, 31)}
                                        inputProps={{
                                        step: 1,
                                        min: 0,
                                        max: 31,
                                        type: 'number',
                                        'aria-labelledby': 'input-slider',
                                        }}
                                    />
                                    :
                                    <span className="w-14 md:w-13 mr-2">
                                        {ivs[stat as keyof PokemonStats]}
                                    </span>
                                }
                                {editable ?
                                    <Slider 
                                        className="mr-2"
                                        size="small"
                                        min={0}
                                        max={31}
                                        step={1}
                                        onChange={(event, iv) => handleInputChange(stat as keyof PokemonStats, iv, setIvs, 0, 31)}
                                        onChangeCommitted={commitSliderChange}
                                        value={ivs[stat as keyof PokemonStats]}
                                        sx={{
                                            color: "#7a8ae6ff"
                                        }}
                                    />
                                    :
                                    <Progress 
                                        className="my-auto"
                                        value={ivs[stat as keyof PokemonStats] * 100 / 31} 
                                        color="bg-indigo-400"
                                    />
                                }
                            </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Card className={`p-3 border-gray-200 ${!evPool ? 'bg-muted':''}`}>
                <div className="flex justify-between mb-2">
                    <div className="font-medium flex gap-2">
                        <Sparkles className="h-4 w-4 mt-1"/> 
                        <span>Available EVs</span>
                    </div>
                    <span className="font-bold">{String(evPool)}</span>
                </div>
                <Progress value={(evPool) / 508 * 100} color={getStatColor(evPool)}/>
            </Card>
            <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                    {Object.values(stats).reduce((sum, value) => sum + value, 0)}
                </span>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}