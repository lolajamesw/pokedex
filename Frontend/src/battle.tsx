"use client"

import type React from "react"
import { Link } from "react-router-dom"

import { useState } from "react"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Search, Zap, Shield, Sword } from "lucide-react"

interface CounterPokemon {
  id: number
  instance: number
  name: string
  type1: string
  type2?: string | null
  level: number
  cp: number
  effectiveness_score: number
}

interface CounterResponse {
  targetPokemon: string
  targetPID: number
  counters: CounterPokemon[]
}

export default function PokemonCounterPage() {
  const [pokemonName, setPokemonName] = useState("")
  const [results, setResults] = useState<CounterResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pokemonName.trim()) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://localhost:8081/opponent/${pokemonName.trim().toLowerCase()}/${localStorage.getItem("uID")}`)
      if (!response.ok) {
        throw new Error("Failed to find counters")
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError("Failed to find Pokemon counters. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      Fire: "bg-red-500",
      Water: "bg-blue-500",
      Grass: "bg-green-500",
      Electric: "bg-yellow-500",
      Psychic: "bg-pink-500",
      Ice: "bg-cyan-500",
      Dragon: "bg-purple-600",
      Dark: "bg-gray-800",
      Fighting: "bg-red-700",
      Poison: "bg-purple-500",
      Ground: "bg-yellow-600",
      Flying: "bg-indigo-400",
      Bug: "bg-green-400",
      Rock: "bg-yellow-800",
      Ghost: "bg-purple-700",
      Steel: "bg-gray-500",
      Fairy: "bg-pink-300",
      Normal: "bg-gray-400",
    }
    return colors[type] || "bg-gray-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Pokemon Counter Finder</h1>
          <p className="text-gray-600">Find the best Pokemon from your collection to counter any opponent</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search for Counters
            </CardTitle>
            <CardDescription>Enter a Pokemon name to find the best counters from your collection</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                placeholder="Enter Pokemon name (e.g., Pikachu)"
                value={pokemonName}
                onChange={(e) => setPokemonName(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !pokemonName.trim()}>
                {loading ? "Searching..." : "Find Counters"}
              </Button>
            </form>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">
                Best Counters for <Link
                    to={`/pokedex/${results.targetPID}`}
                    key={results.targetPID}
                    style={{ textDecoration:"none", color: "inherit" }}
                  ><span className="underlined text-blue-600 capitalize">{results.targetPokemon}</span>
                  </Link>
              </h2>
              <p className="text-gray-600">Found {results.counters.length} Pokemon in your collection</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.counters.map((pokemon) => (
                <Card key={pokemon.id} className="hover:shadow-lg transition-shadow">
                  <Link
                    to={`/my-pokemon/${pokemon.id}/${pokemon.instance}`}
                    key={pokemon.id}
                    style={{ textDecoration:"none", color: "inherit" }}
                  >   
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg capitalize">{pokemon.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <Zap className="w-4 h-4" />
                          {pokemon.effectiveness_score}%
                        </div>
                      </div>
                      <div className="pokemon-image">
                        <img
                          src={`https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/${pokemon.id.toString().padStart(3, "0")}.png`}
                          alt={pokemon.name}
                          width={200}
                          height={200}
                          className="rounded-lg bg-white/20 p-4"
                        />
                      </div>
                      <div className="flex gap-2">
                        <span key={pokemon.type1} className={`type-badge type-${pokemon.type1.toLowerCase()}`}>
                          {pokemon.type1}
                        </span>
                        {pokemon.type2 && (
                          <span key={pokemon.type2} className={`type-badge type-${pokemon.type2.toLowerCase()}`}>
                            {pokemon.type2}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-blue-500" />
                          <span>Level {pokemon.level}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sword className="w-4 h-4 text-red-500" />
                          <span>{pokemon.cp} CP</span>
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {results.counters.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    No effective counters found in your collection for {results.targetPokemon}.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
