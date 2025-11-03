"use client"

import { useState, useEffect } from "react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, Team } from "./types/pokemon-details"
import PokeTile from "./components/Profile/pokeTile"
import TypeSummary from "./components/Profile/typeSummary"
import UserTitleCard from "./components/Profile/userTitleCard"
import { useParams } from "react-router-dom"
import { ChevronDown, ChevronUp } from "lucide-react"
import TeamCard from "./components/Profile/team-card"

export default function ViewProfile() {
  const { uID, } = useParams<{ uID: string }>();
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch(`http://localhost:8081/pokemon/teams/${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setRawTeams(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));

    fetch(`http://localhost:8081/userPokemon?uID=${uID}`)
      .then((res) => res.json())
      .then((data) => setPokemonList(data))
      .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  useEffect(() => {
    const setTeamValues = async () => {
      let typeSummaries: {tID: number, summary: EffectType[]}[] = [];
      for (const team of rawTeams) {
        typeSummaries.push({
          tID: team.id,
          summary: await (await fetch(`http://localhost:8081/teamSummary/(${
            team.pokemon.map((p) => p.id).join(',')
          })`)).json()
        })
        console.log(typeSummaries)
      }
      setTeams(rawTeams.map((team) => ({
        id: team.id,
        name: team.name,
        pokemon: team.pokemon.map((id) => pokemonList.filter((p) => p.id === id.id)[0]),
        typeSummary: typeSummaries.filter((s) => s.tID === team.id)[0].summary,
        showTypeSummary: false
      })))
    }
    if (pokemonList.length > 0) {
      setTeamValues();
    }
    
  }, [rawTeams, pokemonList])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="profile-container">
        <UserTitleCard pokemonCaught={pokemonList.length} uID={uID ?? '0'} editable={false}/>
        {/* My Teams */} 
        {teams.map((team) => 
          <TeamCard 
            team={team}
            setTeams={setTeams}
          />
        )}
      </div>
    </div>
  )
}
