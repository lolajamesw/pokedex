import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { Badge } from "./components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Progress } from "./components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs.tsx"
import { ArrowRight, Shield, Swords, Footprints, Heart, Users, Star } from "lucide-react"
import "./pokedex.css"
import "./details.css"

type PokemonStatType = {
    hp: number,
    atk: number,
    def: number,
    spAtk: number,
    spDef: number,
    speed: number
}

type AttackStatType = {
    power: number,
    accuracy: number,
    pp: number
}

type AttackDetailType = {
    id: number,
    name: string,
    type: string,
    category: string,
    stats: AttackStatType,
    effect: string
}

type PokemonDetailType = {
  id: number,
  pID: number,
  name: string,
  nickname: string,
  level: number,
  onTeam: boolean,
  favourite: boolean,
  types: string[],
  stats: PokemonStatType,
  legendary: boolean,
  description: string,
  learnableAttacks: AttackDetailType[],
  knownAttacks: AttackDetailType[],
};

type PokemonSummary = {
    id: number,
    name: string,
    types: string[],
    image: string
}

function PokemonSummary(id, name, types, img) {
  this.id = id; this.name = name; this.types=types; this.image=img;
}

type Evolution = {
    base: PokemonSummary,
    stage1: PokemonSummary,
    stage2: PokemonSummary
}

const MyPokeDetail = () => {
    const { id, pID } = useParams<{ id: string, pID: string}>();
    const [pokemon, setPokemonDetail] = useState<PokemonDetailType | null>(null);
    const [evolutions, setEvolutions] = useState<Evolution[] | null>(null);
    const isBranchingEvolution = 133 == Number(id);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("id:", id, "pID:",pID);

                const overviewRes = await fetch(`http://localhost:8081/userPokemon/${id}`);
                const overviewData = await overviewRes.json();

                const attackRes = await fetch(`http://localhost:8081/pokemon/attacks/${pID}`);
                const attackData = await attackRes.json();

                const knownRes = await fetch(`http://localhost:8081/pokemon/knownAttacks/${id}`)
                const knownData = await knownRes.json();

                const combined: PokemonDetailType = {
                    ...overviewData,
                    learnableAttacks: attackData,
                    knownAttacks: knownData,
                };

                setPokemonDetail(combined);

                const evolutionRes = await fetch(`http://localhost:8081/pokemon/evolutions/${pID}`);
                const evolutionData = await evolutionRes.json();
                console.log("fetched evolution data");
                setEvolutions(evolutionData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [id])

    if (!pokemon) return <div>Loading...first {id}</div>;
    console.log("learnableAttacks: ", pokemon.learnableAttacks);
    const placeholderImg = "/placeholder.png";    
    var evolutionaryLine: PokemonSummary[] = [];
    if (evolutions) {
      if (evolutions.length>1 && evolutions[0].stage1.id===evolutions[1].stage1.id) evolutionaryLine = [evolutions[0].base, evolutions[0].stage1]
      else if (evolutions.length == 0) evolutionaryLine = [new PokemonSummary(pokemon.pID, pokemon.name, pokemon.types, placeholderImg)];
      else if (!evolutions[0].stage2.id) evolutionaryLine = [evolutions[0].base, evolutions[0].stage1];
      else evolutionaryLine = [evolutions[0].base, evolutions[0].stage1, evolutions[0].stage2];
    }
    else return <div>Loading...second</div>;
    const getEvolutionType = () => {
        if (evolutions.length<2) return "linear"; // Charizard
        let myBool=true;
        for (let i=0; i<evolutions.length; i++)
          if (evolutions[i].stage2.id!=null) myBool=false
        if (myBool) return "base_branching" // Eevee
        for (let i=1; i<evolutions.length; i++)
          if (evolutions[i].stage1.id!=evolutions[i-1].stage1.id) myBool=true;
        if (!myBool) return "middle_branching";
        return "random_branching"
      }
    const evolutionType = getEvolutionType()

    const getTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            Fire: "bg-red-500",
            Flying: "bg-blue-400",
            Dragon: "bg-purple-600",
            Special: "bg-pink-500",
            Physical: "bg-orange-500",
            Grass: "bg-green-600",
            Electric: "bg-yellow-500",
            Ground: "bg-yellow-700",
            Ghost: "bg-purple-800",
            Poison: "bg-purple-600",
            Water: "bg-blue-700",
            Psychic: "bg-pink-600",
        }
        return colors[type] || "bg-gray-500"
    }

    const getStatColor = (stat: number) => {
        if (stat >= 100) return "bg-green-500"
        if (stat >= 80) return "bg-yellow-500"
        if (stat >= 60) return "bg-orange-500"
        return "bg-red-500"
    }

    // return (<div className="bg-testcolor w-32 h-32">
    //   Test box
    //   </div>);

  const toggleFavorite = async () => {
    try {
      console.log("Marking Pokemon: ", pokemon.nickname);
      const response = await fetch("http://localhost:8081/setFavourite", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({instanceID: pokemon.id, user: 4, value:Number(!pokemon.favourite)}),
      });
      // Convert UserPokemon to ShowcasedPokemon format
      setPokemonDetail((prev) => {
      if (!prev) return prev;  
      return {...prev, favourite: !prev.favourite,};});

    } catch (err) {
      console.error("Error favouriting Pokémon: ", err);
      alert("Something went wrong favouriting the Pokémon.")
    }
    
  }

    return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="card overflow-hidden">
          <div className="p-0">
            <div className={`gradient-${pokemon.types[0].toLowerCase()} p-6 text-white relative`}>
              {/* Top Right Controls */}
              <div className="absolute top-4 right-4 flex items-center gap-3">
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    pokemon.favourite
                      ? "bg-white/20 text-yellow-300 hover:bg-white/30"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                  }`}
                  title={pokemon.favourite ? "Remove from favorites" : "Add to favorites"}
                >
                  {pokemon.favourite ? <Heart className="h-6 w-6 fill-current" /> : <Heart className="h-6 w-6" />}
                </button>

                {/* Pokemon ID Badge */}
                <span className="badge badge-default bg-white text-black px-3 py-1">
                  #{pokemon.pID.toString().padStart(3, "0")}
                </span>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-0">
                <div className="relative">
                  <img
                    src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${pokemon.pID.toString().padStart(3, "0")}.png`}
                    alt={pokemon.name}
                    width={200}
                    height={200}
                    className="rounded-lg bg-white/20 p-4"
                  />
                  {/* Status Indicators on Pokemon Image */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    {pokemon.favourite && (
                      <div className="bg-yellow-400 rounded-full p-1.5 shadow-lg">
                        <Heart className="h-3 w-3 text-yellow-800 fill-current" />
                      </div>
                    )}
                    {pokemon.onTeam && (
                      <div className="bg-green-400 rounded-full p-1.5 shadow-lg">
                        <Star className="h-3 w-3 text-green-800 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 mb-2">
                    <h1 className="text-4xl font-bold text-white">{pokemon.nickname || pokemon.name}</h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="text-xl font-semibold text-white/90">Lv. {pokemon.level}</span>
                      {pokemon.nickname && <span className="text-lg text-white/75">({pokemon.name})</span>}
                    </div>
                  </div>

                  {/* Status Text Indicators */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
                    {pokemon.types.map((type) => (
                      <Badge key={type} className={`${getTypeColor(type)} text-white`}>
                        {type}
                      </Badge>
                    ))}
                    {pokemon.favourite && (
                      <span className="badge bg-yellow-400/20 text-yellow-100 border border-yellow-300/30">
                        ⭐ Favorite
                      </span>
                    )}
                    {pokemon.onTeam && (
                      <span className="badge bg-green-400/20 text-green-100 border border-green-300/30">
                        🌟 Team Member
                      </span>
                    )}
                  </div>

                  <p className="text-white/90 max-w-2xl">{pokemon.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="stats" className="space-y-3">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Base Stats
                </CardTitle>
                <CardDescription>The base statistical values for this Pokémon</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3">
                  {Object.entries(pokemon.stats).map(([stat, value]) => (
                    <div key={stat} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">
                          {stat === "hp"
                            ? "HP"
                            : stat === "spAtk"
                              ? "Sp. Attack"
                              : stat === "spDef"
                                ? "Sp. Defense"
                                : stat.charAt(0).toUpperCase() + stat.slice(1)}
                        </span>
                        <span className="font-bold">{value}</span>
                      </div>
                      <div className="relative">
                        <Progress value={(value / 150) * 100} className="h-2" />
                        <div
                          className={`absolute top-0 left-0 h-2 rounded-full ${getStatColor(value)}`}
                          style={{ width: `${(value / 150) * 100}%` }}
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
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title flex items-center gap-2">
                  <Footprints className="h-5 w-5" />
                  Evolution Line
                </h3>
                <p className="card-description">
                  {evolutionType === "linear"
                    ? "The complete evolutionary chain for this Pokémon"
                    : evolutionType === "base_branching"
                      ? "All possible evolution paths from the base form"
                      : evolutionType === "random_branching"
                        ? "Random evolution paths - determined by personality value"
                        : "Evolution chain with branching paths"}
                </p>
              </div>
              <div className="card-content">
                {evolutionType === "linear" && (
                  // Linear Evolution Layout
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    {evolutionaryLine.map((evo: any, index: number) => (
                      <div key={evo.id} className="flex items-center gap-4">
                        <Link
                              to={`/pokedex/${evo.id}`}
                              key={evo.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                          <div className="text-center">
                            <div
                              className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                                evo.name === pokemon.name
                                  ? "border-green-500 bg-green-50"
                                  : "border-border hover:border-muted-foreground"
                              }`}
                            >
                              <img
                                src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.id.toString().padStart(3, "0")}.png`}
                                alt={evo.name}
                                width={80}
                                height={80}
                                className="mx-auto"
                              />
                            </div>
                            <h3 className="font-semibold mt-2 text-foreground">{evo.name}</h3>
                          </div>
                          {index < evolutionaryLine.length - 1 && (
                            <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                          )}
                        </Link>
                      </div>
                    ))}
                  </div>
                )}

                {evolutionType === "base_branching" && (
                  // Base Branching Evolution Layout (Eevee-style)
                  <div className="space-y-8">
                    {/* Base Pokemon */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all duration-200 border-green-500 bg-green-50`}
                        >
                          <img
                            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evolutions[0].base.id.toString().padStart(3, "0")}.png`}
                            alt={evolutions[0].base.name}
                            width={80}
                            height={80}
                            className="mx-auto"
                          />
                        </div>
                        <h3 className="font-semibold mt-2 text-foreground">{evolutions[0].base.name}</h3>
                      </div>
                    </div>

                    {/* Evolution Paths */}
                    <div className="evolution-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {evolutions.map((evo: any) => (
                        <div key={evo.id} className="relative">
                          <Link
                              to={`/pokedex/${evo.stage1.id}`}
                              key={evo.stage1.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                            {/* Connection Line */}
                            <div className="evolution-connection-line absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 hidden sm:block"></div>

                            <div className="text-center p-3 border rounded-lg hover:shadow-md transition-all duration-200 pokemon-card-hover">
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                                  evo.stage1.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.stage1.id.toString().padStart(3, "0")}.png`}
                                  alt={evo.stage1.name}
                                  width={60}
                                  height={60}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-sm text-foreground">{evo.stage1.name}</h4>
                              <div className="pokemon-types">
                                    {evo.stage1.types.map((type) => (
                                    <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
                                        {type}
                                    </span>
                                    ))}
                                  </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evolutionType === "random_branching" && (
                  // Random Branching Evolution Layout (Wurmple-style)
                  <div className="space-y-8">
                    {/* Base Pokemon */}
                    <div className="flex justify-center">
                      <div className="text-center">
                        <div
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            evolutions[0].base.name === pokemon.name
                              ? "border-green-500 bg-green-50"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <img
                            src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evolutions[0].base.id.toString().padStart(3, "0")}.png`}
                            alt={evolutions[0].base.name}
                            width={80}
                            height={80}
                            className="mx-auto"
                          />
                        </div>
                        <h3 className="font-semibold mt-2 text-foreground">{evolutions[0].base.name}</h3>
                      </div>
                    </div>

                    {/* Random Evolution Branches */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {evolutions.map((branch: any, branchIndex: number) => (
                        <div key={branchIndex} className="space-y-4">
                          {/* Branch Header */}
                          <div className="text-center">
                            <span className="badge bg-yellow-100 text-yellow-800 border border-yellow-300">
                              Path {branchIndex + 1}
                            </span>
                          </div>

                          {/* Stage 1 Evolution */}
                          <div className="text-center">
                            <Link
                              to={`/pokedex/${branch.stage1.id}`}
                              key={branch.stage1.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                                  branch.stage1.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${branch.stage1.id.toString().padStart(3, "0")}.png`}
                                  alt={branch.stage1.name}
                                  width={70}
                                  height={70}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-foreground">{branch.stage1.name}</h4>
                            </Link>
                          </div>

                          {/* Arrow Down */}
                          <div className="flex justify-center">
                            <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90" />
                          </div>

                          {/* Stage 2 Evolution */}
                          <div className="text-center">
                            <Link
                              to={`/pokedex/${branch.stage2.id}`}
                              key={branch.stage2.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                              <div
                                className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 pokemon-card-hover ${
                                  branch.stage2.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${branch.stage2.id.toString().padStart(3, "0")}.png`}
                                  alt={branch.stage2.name}
                                  width={70}
                                  height={70}
                                  className="mx-auto"
                                />
                              </div>
                              <h4 className="font-semibold mt-2 text-foreground">{branch.stage2.name}</h4>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evolutionType === "middle_branching" && (
                  // Middle Branching Evolution Layout (Gloom-style)
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-6">
                      {evolutionaryLine.map((stage: any, stageIndex: number) => (
                        <div key={stage.id} className="flex flex-col items-center">
                          <Link
                              to={`/pokedex/${stage.id}`}
                              key={stage.id}
                              style={{ textDecoration:"none", color: "inherit" }}>
                            {/* Current Stage Pokemon */}
                            <div className="text-center mb-4">
                              <div
                                className={`p-4 rounded-lg border-2 transition-all duration-200 pokemon-card-hover ${
                                  stage.name === pokemon.name
                                    ? "border-green-500 bg-green-50"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                <img
                                  src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${stage.id.toString().padStart(3, "0")}.png`}
                                  alt={stage.name}
                                  width={80}
                                  height={80}
                                  className="mx-auto"
                                />
                              </div>
                              <h3 className="font-semibold mt-2 text-foreground">{stage.name}</h3>
                            </div>

                            {/* Arrow to next stage (if not last and no branching) */}
                            {stageIndex < evolutionaryLine.length - 1 && (
                              <div className="mt-4">
                                <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                              </div>
                            )}
                          </Link>
                        </div>
                      ))}
                      {/* Branching Evolutions (if any) */}
                        {true && (
                          <div className="space-y-4">
                            {/* Connection indicator */}
                            <div className="flex justify-center">
                              <div className="w-px h-8 bg-border"></div>
                            </div>

                            {/* Evolution options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              {evolutions.map((evo: any) => (
                                <div key={evo.stage2.id} className="relative">
                                  <Link
                                    to={`/pokedex/${evo.stage2.id}`}
                                    key={evo.stage2.id}
                                    style={{ textDecoration:"none", color: "inherit" }}>
                                    {/* Connection Line to center */}
                                    <div className="evolution-connection-line absolute -top-4 left-1/2 transform -translate-x-1/2 w-px h-4 hidden sm:block"></div>

                                    <div className="text-center p-3 border rounded-lg hover:shadow-md transition-all duration-200 pokemon-card-hover">
                                      <div
                                        className={`p-3 rounded-lg border-2 mx-auto w-fit transition-all duration-200 ${
                                          evo.stage2.name === pokemon.name
                                            ? "border-green-500 bg-green-50"
                                            : "border-border hover:border-muted-foreground"
                                        }`}
                                      >
                                        <img
                                          src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${evo.stage2.id.toString().padStart(3, "0")}.png`}
                                          alt={evo.stage2.name}
                                          width={60}
                                          height={60}
                                          className="mx-auto"
                                        />
                                      </div>
                                      <h4 className="font-semibold mt-2 text-sm text-foreground">{evo.stage2.name}</h4>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Evolution Methods Legend */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-foreground">Evolution Methods:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      • <strong>Level Up:</strong> Reach required level
                    </div>
                    <div>
                      • <strong>Random:</strong> Based on personality value
                    </div>
                    <div>
                      • <strong>Stones:</strong> Use evolution stones
                    </div>
                    <div>
                      • <strong>Trade:</strong> Trade with specific items
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="moves" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Current Moves
                </CardTitle>
                <CardDescription>Moves that this Pokémon has learned through leveling up and TMs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pokemon.knownAttacks.map((move, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{move.name}</h4>
                          <Badge className={`${getTypeColor(move.type)} text-white text-xs`}>{move.type}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {move.category}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Power: {move.stats.power}</span>
                          <span>Accuracy: {move.stats.accuracy}%</span>
                          <span>PP: {move.stats.pp}</span>
                        </div>
                      </div>
                      <p>{move.effect}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5" />
                  Learnable Moves
                </CardTitle>
                <CardDescription>Moves that this Pokémon can learn through leveling up and TMs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pokemon.learnableAttacks.map((move, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{move.name}</h4>
                          <Badge className={`${getTypeColor(move.type)} text-white text-xs`}>{move.type}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {move.category}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Power: {move.stats.power}</span>
                          <span>Accuracy: {move.stats.accuracy}%</span>
                          <span>PP: {move.stats.pp}</span>
                        </div>
                      </div>
                      <p>{move.effect}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
};



export default MyPokeDetail;
