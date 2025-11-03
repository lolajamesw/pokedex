"use client"

import { useState, useEffect, act } from "react"
import { ChevronDown, ChevronUp, Edit2, Plus, ReceiptText, Trash2 } from "lucide-react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, User, Team } from "./types/pokemon-details"
import PokeSelectionModal from "./components/Profile/pokeSelectModal"
import UserTitleCard from "./components/Profile/userTitleCard"
import TeamExportModal from "./components/Profile/team-export-modal"
import TeamCard from "./components/Profile/team-card"

export default function Profile() {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isExportTeamModalOpen, setIsExportTeamModalOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(-1);
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8081/pokemon/teams/${localStorage.getItem("uID")}`)
      .then((res) => res.json())
      .then((data) => setRawTeams(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));

    fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`)
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

  const handleTeamChange = async (selectedPokemon: PokemonSummary[]) => {
    try {
      console.log("Marking Pokemon: ", selectedPokemon.map((p)=>(p.nickname)));
      const response = await fetch("http://localhost:8081/setTeam", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({instanceIDs: selectedPokemon.map((p)=>(p.id)), user: localStorage.getItem("uID"), team: activeTeam}),
      });

      setTeams(teams.map((prev) => ({
        ...prev,
        pokemon: prev.id===activeTeam ? selectedPokemon : prev.pokemon
      })));
      console.log(pokemonList)

      const teamSum = await fetch(`http://localhost:8081/teamSummary/(${
        teams.filter((t) => t.id===activeTeam)[0].pokemon.map((p) => p.id).join(',')
      })`)
      const teamSumData = await teamSum.json();
      setTeams(teams.map((prev) => ({
        ...prev,
        typeSummary: prev.id === activeTeam ? teamSumData : prev.typeSummary,
      })));

    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }
  }

  const addTeam = async () => {
    try {
      console.log("Adding Team:", newName);
      const response = await fetch("http://localhost:8081/addTeam", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          name: (newName === "" ? 'Team ' + (teams.length + 1) : newName),
          user: localStorage.getItem("uID")
        }),
      });
      if (response.ok) {
        fetch(`http://localhost:8081/pokemon/teams/${localStorage.getItem("uID")}`)
          .then((res) => res.json())
          .then((data) => setTeams((prev) => [...prev, ...data.filter((team: Team) => !prev.includes(team))]))
          .then(() => console.log("aligned"))
          .catch((err) => console.error("Failed to fetch team summary:", err));
      }
      else {
        throw(response)
      }
    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="profile-container">
        <UserTitleCard pokemonCaught={pokemonList.length} uID={localStorage.getItem("uID") ?? '0'} editable={true}/>
    
        {/* Pokemon on my Teams */}
        {teams.map((team) =>
          <TeamCard
            editable
            team={team}
            activeTeam={activeTeam}
            setActiveTeam={setActiveTeam}
            setTeams={setTeams}
            setRawTeams={setRawTeams}
            setIsExportTeamModalOpen={setIsExportTeamModalOpen}
            setIsEditTeamModalOpen={setIsEditTeamModalOpen}
          />
        )} 

        <form className="mx-auto card flex p-2 space-x-2 items-center">
          <input 
            className="border border-gray-200 rounded-md p-2"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)} 
            placeholder={'Team ' + (teams.length + 1)}
          />
          <button className="team-button" onClick={addTeam}>
            <Plus className="button-icon" />
            New Team
          </button>
        </form>

        <TeamExportModal 
          isOpen={isExportTeamModalOpen}
          onClose={() => setIsExportTeamModalOpen(false)}
          team={teams.find((team) => team.id === activeTeam)}
        />

        {/* Pokemon Team Selection Modal */}
        <PokeSelectionModal
          isOpen={isEditTeamModalOpen}
          onClose={() => setIsEditTeamModalOpen(false)}
          userPokemon={pokemonList}
          teams={teams}
          currentTeam={activeTeam}
          onSelectionChange={handleTeamChange}
          title="Select the Pokémon for Your Team"
          filterFunc={(p) => p.tID===activeTeam}
        />
      </div>
    </div>
  )
}
