import { PokemonSummary, Team } from "../../types/pokemon-details";
import { useState, useEffect } from "react"
import PokeTile from "./pokeTile";

type Inputs = {
    isOpen: boolean,
    onClose: () => void,
    userPokemon: PokemonSummary[],
    teams: Team[],
    currentTeam: number,
    onSelectionChange: (p: PokemonSummary[]) => Promise<void>,
    title: string,
    filterFunc: (p: PokemonSummary) => void,
}

export default function PokeSelectionModal({ isOpen, onClose, userPokemon, teams, currentTeam, onSelectionChange, title, filterFunc }: Inputs) {
  const [tempSelected, setTempSelected] = useState<PokemonSummary[]>([]);
  useEffect(() => {
    setTempSelected(teams.find((team) => team.id === currentTeam)?.pokemon ?? []);
  }, [currentTeam])

  const handlePokemonSelect = (pokemon: PokemonSummary) => {
    const isAlreadySelected = tempSelected.some((p) => p.id === pokemon.id)

    if (isAlreadySelected) {
      setTempSelected(tempSelected.filter((p) => p.id !== pokemon.id))
    } else if (tempSelected.length < 6) {
      setTempSelected([...tempSelected, pokemon])
    }
  }

  const handleSave = () => {
    onSelectionChange(tempSelected)
    onClose()
  }

  const handleCancel = () => {
    setTempSelected(teams.filter((team) => team.id === currentTeam)[0].pokemon)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title} (Choose up to 6)</h2>
        </div>
        <div className="modal-body">
          <div className="selection-count">Selected: {tempSelected.length}/6</div>
          <div className="pokemon-selection-grid">
            {userPokemon.map((pokemon) => (
              <PokeTile
                key={pokemon.id}
                pokemon={pokemon}
                targetPage=""
                isSelected={tempSelected.some((p) => p.id === pokemon.id)}
                onSelect={handlePokemonSelect}
                simplified={true}
              />
            ))}
          </div>
          <div className="modal-actions">
            <button className="modal-button modal-button-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="modal-button modal-button-save" onClick={handleSave}>
              Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}