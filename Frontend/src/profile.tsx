"use client"

import { useState, useEffect, act } from "react"
import { Plus } from "lucide-react"
import "./css/profile.css"
import "./css/details.css"
import { PokemonSummary, EffectType, User, Team } from "./types/pokemon-details"
import PokeSelectionModal from "./components/Profile/pokeSelectModal"
import UserTitleCard from "./components/Profile/userTitleCard"
import TeamExportModal from "./components/Profile/team-export-modal"
import TeamCard from "./components/Profile/team-card"
import { ANALYTICS_API_URL, TEAM_API_URL, USER_API_URL } from "./constants"

export default function Profile() {
  const [pokemonList, setPokemonList] = useState<PokemonSummary[]>([]);
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [isExportTeamModalOpen, setIsExportTeamModalOpen] = useState(false);
  const [activeTeam, setActiveTeam] = useState(-1);
  const [rawTeams, setRawTeams] = useState<Team[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetch(TEAM_API_URL + '/' + localStorage.getItem("uID"))
      .then((res) => res.json())
      .then((data) => setRawTeams(data))
      .catch((err) => console.error("Failed to fetch team summary:", err));

    fetch(USER_API_URL + '/pokemon?uID=' + localStorage.getItem("uID"))
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

  const handleTeamChange = async (selectedPokemon: PokemonSummary[]) => {
    try {
      console.log("Marking Pokemon: ", selectedPokemon.map((p)=>(p.nickname)));
      const response = await fetch(
        TEAM_API_URL + '/' + activeTeam + '?instanceIDs=' 
        + JSON.stringify(selectedPokemon.map((p)=>(p.id))), 
        { method: "PATCH" }
      );
      console.log(activeTeam);
      console.log(selectedPokemon)
      if (response.ok) {
        const teamSum = await fetch(ANALYTICS_API_URL + '/teams/type-summary/' + activeTeam)
        const teamSumData = await teamSum.json();
        setTeams(teams.map((prev) => ({
          ...prev,
          pokemon: prev.id===activeTeam ? selectedPokemon : prev.pokemon,
          typeSummary: prev.id === activeTeam ? teamSumData : prev.typeSummary
        })));
        console.log(teams);
      }
    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }
  }

  const testFunc = async () => {
    fetch("http://localhost:8081/api/users/team/47/Team%205", { method: "POST" })
      .then(async r => { console.log('FETCH OK', r.status, r.statusText); console.log('headers:', [...r.headers]); console.log('body:', await r.text()); })
      .catch(err => console.error('FETCH ERROR', err));
  }

  const addTeam = async () => {
    try {
      console.log("Adding Team:", newName);
      const uID = localStorage.getItem("uID") || '';
      const teamName = newName === "" ? `Team ${teams.length + 1}` : newName;
      const encodedUrl = `${TEAM_API_URL}/${encodeURIComponent(uID)}/${encodeURIComponent(teamName)}`;
      const response = await fetch(encodedUrl, { method: "POST" });

      if (response.ok) {
        const ans = await response.json()
        setTeams((prev) => [...prev, ({
          id: Number(ans.tID),
          name: teamName,
          pokemon: [],
          typeSummary: [],
          showTypeSummary: false
        }) as Team])
      }
      else {
        throw(response)
      }
    } catch (err) {
      console.error("Error adding team:", err);
      alert("Something went wrong adding the team. See console for details.");
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

        <div className="mx-auto card flex p-2 space-x-2 items-center">
          <input 
            className="border border-gray-200 rounded-md p-2"
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)} 
            placeholder={'Team ' + (teams.length + 1) + '...'}
          />
          <button className="team-button" onClick={addTeam}>
            <Plus className="button-icon" />
            New Team
          </button>
        </div>

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
