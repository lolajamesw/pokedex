import { ChevronDown, ChevronUp, Edit2, Plus, ReceiptText, Save, Trash2, X } from "lucide-react";
import { Team } from "../../types/pokemon-details";
import PokeTile from "./pokeTile";
import TypeSummary from "./typeSummary";
import { useState } from "react";
import { TEAM_API_URL } from "../../constants";


type Inputs = {
    editable: true;
    team: Team;
    activeTeam: number;
    setActiveTeam: React.Dispatch<React.SetStateAction<number>>;
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    setRawTeams: React.Dispatch<React.SetStateAction<Team[]>>;
    setIsExportTeamModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsEditTeamModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | {
    editable?: false;
    team: Team;
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
}

export default function TeamCard(props: Inputs) {
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedName, setEditedName] = useState(props.team.name)
        
    const delTeam = async (id: number) => {
        if (!props.editable) return
        try {
        console.log("Forgetting Team");
        const response = await fetch(TEAM_API_URL + '/' + id, { method: "DELETE" });
        console.log('response: ' + response.ok)
        if (response.ok) {
          props.setTeams((teams) => teams.filter((team) => team.id !== props.team.id));
        }
        else throw(response.statusText)
        } catch (err) {
        console.error("Error showcasing Pokémon: ", err);
        alert("Something went wrong deleting the team.")
        }
    }

    const handleSaveDisplayName = async () => {
        if (!props.editable) return
        try {
            console.log("Updating user's name");
            await fetch(
              TEAM_API_URL + props.team.id + '/name/' + editedName, 
              { method: "POST" }
            );
        } catch (err) {
            console.error("Error updating user's name: ", err);
            alert("Something went wrong updating your name.")
        }
        props.setTeams((teams) => teams.map((team) => ({
            ...team,
            name: team.id===props.team.id ? editedName : team.name
        }))) // Update database
        setIsEditingName(false)
    }

    return (
        <div key={props.team.id.toString()} 
            className="flex flex-col gap-[1rem] p-4 bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
            <div className="showcase-header">
                {isEditingName ? (
                    <div className="name-edit">
                      <input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="name-input"
                      />
                      <button className="edit-button edit-button-save" onClick={handleSaveDisplayName}>
                        <Save className="edit-icon" />
                      </button>
                      <button className="edit-button edit-button-cancel" onClick={() => {
                            setEditedName(props.team.name);
                            setIsEditingName(false);
                        }}>
                        <X className="edit-icon" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h2 className="showcase-title">{props.team.name}</h2>
                      {props.editable && 
                        <button   
                          className="edit-button edit-button-ghost" 
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit2 className="edit-icon" />
                        </button>
                      }
                    </div>
                  )}
              <div className="space-x-3">

                {props.editable && <div
                    className="flex gap-2 m-2"
                >
                    <button className="team-button" onClick={() => {
                        props.setIsExportTeamModalOpen(true);
                        props.setActiveTeam(props.team.id);
                    }}>
                    <ReceiptText className="button-icon" />
                    Export
                    </button>
                    <button className="team-button" onClick={() => {
                        props.setIsEditTeamModalOpen(true);
                        props.setActiveTeam(props.team.id);
                    }}>
                    <Edit2 className="button-icon" />
                    Edit
                    </button>
                    <button className="team-button !bg-red-600 hover:!bg-red-700" 
                    onClick={() => delTeam(props.team.id)}
                    >
                    <Trash2 className="button-icon" />
                    Delete
                    </button>
                    
                </div>}
                
              </div>
            </div>
            {/* still working */}
            {props.team.pokemon.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[1rem]">
                {props.team.pokemon.map((pokemon, index) => (
                  <PokeTile 
                    key={`${pokemon.nickname}-${index}`} 
                    pokemon={pokemon} 
                    targetPage={props.editable ? "my-pokemon" : 'view-pokemon'}
                  />
                ))}
                {/* Empty slots */}
                {props.editable ? Array.from({ length: 6 - props.team.pokemon.length }).map((_, index) => 
                    <div key={`empty-${index}`} className="empty-slot">
                        <button className="empty-slot-button p-4" onClick={() => {
                            props.setIsEditTeamModalOpen(true);
                            props.setActiveTeam(props.team.id);
                            console.log(props.activeTeam);
                        }}>
                        <Plus className="empty-slot-icon" />
                        </button>
                    </div>
                ) : undefined}
              </div>
            ) : (
              <div className="no-showcase">
                <p className="no-showcase-text">{
                `No Pokémon are on ${props.editable ? 'your' : 'this'} team yet`
                }</p>
                {props.editable && 
                    <button className="add-showcase-button" onClick={() => {
                    props.setIsEditTeamModalOpen(true);
                    props.setActiveTeam(props.team.id);
                    }}>
                    <Plus className="add-showcase-icon" />
                    Add Pokémon to Team
                    </button>
                }
              </div>
            )}
            {props.team.pokemon.length > 0 &&
              <button className="mx-auto hover:bg-gray-100 p-3 rounded-full active:bg-gray-200 active:scale-90"
                onClick={() => props.setTeams((teams) => teams.map((prev) => ({
                  ...prev,
                  showTypeSummary: prev.id === props.team.id ? !prev.showTypeSummary : prev.showTypeSummary
                })))}>
                {props.team.showTypeSummary ? <ChevronUp/> : <ChevronDown/>}
              </button>
            }
            {props.team.pokemon.length > 0 &&props.team.showTypeSummary && 
              <TypeSummary teamSummary={props.team.typeSummary}/>
            }
        </div>
    )
}
