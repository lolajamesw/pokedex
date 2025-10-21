import { MyPokemon, PokedexPokemon } from "../../types/pokemon-details"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress";
import { ChartBar, Heart, Shield, ShieldHalf, Sword, Swords, Wind } from "lucide-react"

type Inputs = {
    pokemon: PokedexPokemon | MyPokemon
}

export default function PokemonStatsCard({pokemon}: Inputs) {

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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5" />
                    Base Stats
                </CardTitle>
                <CardDescription>The base statistical values for this Pokémon</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="grid gap-3">
                    {Object.entries(pokemon.stats).map(([stat, value]) => (
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
                        </div>
                        <span className="font-bold">{value}</span>
                        </div>
                        <div className="relative">
                        <Progress value={(value / 500) * 100} className="h-2" />
                        <div
                            className={`absolute top-0 left-0 h-2 rounded-full ${getStatColor(value)}`}
                            style={{ width: `${Math.min((value / 500) * 100, 100)}%` }}
                        />
                        </div>
                    </div>
                    ))}
                </div>
            <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                    {Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)}
                </span>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}