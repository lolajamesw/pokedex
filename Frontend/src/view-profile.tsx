"use client"

import { useState, useEffect } from "react"
import { Edit2, Plus, ReceiptText } from "lucide-react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, User } from "./types/pokemon-details"
import PokeTile from "./components/pokeTile"
import PokeSelectionModal from "./components/pokeSelectModal"
import TypeSummary from "./components/typeSummary"
import UserTitleCard from "./components/userTitleCard"
import TeamExportModal from "./components/team-export-modal"
import { useParams } from "react-router-dom"

export default function ViewProfile() {
  const { uID, } = useParams<{ uID: string }>();
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
  const [isExportTeamModalOpen, setIsExportTeamModalOpen] = useState(false)
  const [myTeam, setMyTeam] = useState<PokemonSummary[]>([])
  const [teamSummary, setTeamSummary] = useState<EffectType[]>([])

  useEffect(() => {
      fetch(`http://localhost:8081/userPokemon?uID=${uID}`)
        .then((res) => res.json())
        .then((data) => setPokemonList(data))
        .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8081/teamSummary/${uID}`)
      .then((res) => res.json())
      .then((data) => setTeamSummary(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));
  }, [])

  useEffect(() => {
    setMyTeam(pokemonList.filter(
      (p) => p.onTeam===true,
    ));
  }, [pokemonList])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="profile-container">
        <UserTitleCard pokemonCaught={pokemonList.length} uID={uID ?? '0'} editable={false}/>
    
        {/* Pokemon on my Team */} 
        <div className="flex flex-col gap-[1rem] p-4 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="showcase-header">
            <h2 className="showcase-title">My Team</h2>
          </div>
          {/* still working */}
          {myTeam.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1rem]">
              {myTeam.map((pokemon, index) => (
                <PokeTile key={`${pokemon.nickname}-${index}`} pokemon={pokemon} targetPage="view-pokemon"/>
              ))}
            </div>
          ) : (
            <div className="no-showcase">
              <p className="no-showcase-text">No Pokémon are on your team yet</p>
              <button className="add-showcase-button" onClick={() => setIsEditTeamModalOpen(true)}>
                <Plus className="add-showcase-icon" />
                Add Pokémon to Showcase
              </button>
            </div>
          )}
        </div>
        
        <TypeSummary teamSummary={teamSummary}/>
      </div>
    </div>
  )
}
