"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, Plus, SaveIcon, DownloadIcon, ReceiptText } from "lucide-react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, User } from "./types/pokemon-details"
import PokeTile from "./components/pokeTile"
import PokeSelectionModal from "./components/pokeSelectModal"
import TypeSummary from "./components/typeSummary"
import UserTitleCard from "./components/userTitleCard"
import TeamExportModal from "./components/team-export-modal"

export default function Profile() {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false)
  const [isExportTeamModalOpen, setIsExportTeamModalOpen] = useState(false)
  const [myTeam, setMyTeam] = useState<PokemonSummary[]>([])
  const [teamSummary, setTeamSummary] = useState<EffectType[]>([])

  useEffect(() => {
      fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`)
        .then((res) => res.json())
        .then((data) => setPokemonList(data))
        .catch((err) => console.error("Failed to fetch Pokémon:", err));
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8081/teamSummary/${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setTeamSummary(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));
  }, [])

  useEffect(() => {
    setMyTeam(pokemonList.filter(
      (p) => p.onTeam===true,
    ));
  }, [pokemonList])

  const handleTeamChange = async (selectedPokemon: PokemonSummary[]) => {
    // Call setShowcased to selected pokemon
    try {
      console.log("Marking Pokemon: ", selectedPokemon.map((p)=>(p.nickname)));
      const response = await fetch("http://localhost:8081/setTeam", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({instanceIDs: selectedPokemon.map((p)=>(p.id)), user: localStorage.getItem("uID")}),
      });

      setMyTeam(selectedPokemon);

      const teamSum = await fetch(`http://localhost:8081/teamSummary/${localStorage.getItem("uID")}`);
      const teamSumData = await teamSum.json();
      setTeamSummary(teamSumData);

    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="profile-container">
        <UserTitleCard pokemonCaught={pokemonList.length} uID={localStorage.getItem("uID") ?? '0'} editable={true}/>
    
        {/* Pokemon on my Team */} 
        <div className="flex flex-col gap-[1rem] p-4 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="showcase-header">
            <h2 className="showcase-title">My Team</h2>
            <div className="space-x-3">
              <button className="edit-showcase-button" onClick={() => setIsExportTeamModalOpen(true)}>
                <ReceiptText className="edit-showcase-icon" />
                Export Team
              </button>
              <button className="edit-showcase-button" onClick={() => setIsEditTeamModalOpen(true)}>
                <Edit2 className="edit-showcase-icon" />
                Edit Team
              </button>
            </div>
          </div>
          {/* still working */}
          {myTeam.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1rem]">
              {myTeam.map((pokemon, index) => (
                <PokeTile key={`${pokemon.nickname}-${index}`} pokemon={pokemon} targetPage="my-pokemon"/>
              ))}
              {/* Empty slots */}
              {Array.from({ length: 6 - myTeam.length }).map((_, index) => (
                <div key={`empty-${index}`} className="empty-slot">
                  <button className="empty-slot-button" onClick={() => {setIsEditTeamModalOpen(true)}}>
                    <Plus className="empty-slot-icon" />
                  </button>
                </div>
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

        <TeamExportModal 
          isOpen={isExportTeamModalOpen}
          onClose={() => setIsExportTeamModalOpen(false)}
        />

        {/* Pokemon Team Selection Modal */}
        <PokeSelectionModal
          isOpen={isEditTeamModalOpen}
          onClose={() => setIsEditTeamModalOpen(false)}
          userPokemon={pokemonList}
          selectedPokemon={myTeam}
          onSelectionChange={handleTeamChange}
          title="Select the Pokémon for Your Team"
          filterFunc={(p) => p.onTeam===true}
        />
      </div>
    </div>
  )
}
