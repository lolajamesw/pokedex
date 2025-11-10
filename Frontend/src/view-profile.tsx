"use client"

import { useState, useEffect } from "react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, Team } from "./types/pokemon-details"
import UserTitleCard from "./components/Profile/userTitleCard"
import { useParams } from "react-router-dom"
import TeamCard from "./components/Profile/team-card"
import { ANALYTICS_API_URL, TEAM_API_URL, USER_API_URL } from "./constants"

export default function ViewProfile() {
  const { uID, } = useParams<{ uID: string }>();
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    fetch(TEAM_API_URL + '/' + uID)
      .then((res) => res.json())
      .then((data) => {console.log(data);return data;})
      .then((data) => setRawTeams(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));

    fetch(USER_API_URL + '/pokemon?uID=' + uID)
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
          summary: await (await fetch(
            ANALYTICS_API_URL + '/teams/type-summary/' + team.id
          )).json()
        })
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
