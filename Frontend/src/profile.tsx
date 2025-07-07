"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, Plus } from "lucide-react"
import "./profile.css"


type PokemonSummaryType = {
  nickname: string,
  level: number,
  name: string
}

type PokemonDetailType = {
  id: number,
  number: number,
  name: string,
  types: string[],
  stats: PokemonStatType,
  level: number,
  nickname: string,
  showcase: boolean
};

type PokemonStatType = {
    hp: number,
    atk: number,
    def: number,
    spAtk: number,
    spDef: number,
    speed: number
}

function PokemonCard({ pokemon, isSelected, onSelect, showSelectButton }) {
  return (
    <div className={`showcase-card ${isSelected ? "showcase-card-selected" : ""}`}>
      <div className="showcase-card-header">
        <div className="showcase-level">Lv. {pokemon.level}</div>
        {showSelectButton && "id" in pokemon && (
          <button
            className={`select-button ${isSelected ? "select-button-selected" : ""}`}
            onClick={() => onSelect?.(pokemon)}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        )}
      </div>
      <div className="showcase-card-content">
        <h3 className="showcase-nickname">{pokemon.nickname}</h3>
        <p className="showcase-species">{pokemon.name}</p>
      </div>
    </div>
  )
}

function PokemonSelectionModal({ isOpen, onClose, userPokemon, selectedPokemon, onSelectionChange }) {
  const [tempSelected, setTempSelected] = useState(selectedPokemon)

  const handlePokemonSelect = (pokemon) => {
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
    setTempSelected(selectedPokemon)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Select Your Showcased Pokémon (Choose up to 6)</h2>
        </div>
        <div className="modal-body">
          <div className="selection-count">Selected: {tempSelected.length}/6</div>
          <div className="pokemon-selection-grid">
            {userPokemon.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                isSelected={tempSelected.some((p) => p.id === pokemon.id)}
                onSelect={handlePokemonSelect}
                showSelectButton={true}
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

export default function Profile() {
  const [pokemonList, setPokemonList] = useState<PokemonDetailType[]>([]);
  const [user, setUser] = useState({id: 4, tradeCount: 0, displayName: "", username: "" })
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedDisplayName, setEditedDisplayName] = useState(user.displayName)
  const [isPokemonModalOpen, setIsPokemonModalOpen] = useState(false)
  const [showcasedPokemon, setShowcasedPokemon] = useState<PokemonSummaryType[]>([])

  useEffect(() => {
    fetch("http://localhost:8081/user/4")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Failed to fetch user: ", err));
  }, [])

  useEffect(() => {
      fetch("http://localhost:8081/userPokemon")
        .then((res) => res.json())
        .then((data) => setPokemonList(data))
        .catch((err) => console.error("Failed to fetch Pokémon:", err));
    }, [])

    useEffect(() => {
      const showcased = pokemonList.filter(
        (p) => p.showcase===true,
      );
      const formatted = showcased.map((pokemon) => ({
        nickname: pokemon.nickname,
        level: pokemon.level,
        name: pokemon.name
      }));
      setShowcasedPokemon(formatted);
      console.log("list: ", pokemonList);
      console.log("Showcased: ", showcasedPokemon);
      console.log("Initial Showcase list: ", showcased);
    }, [pokemonList])
  

  const handleSaveDisplayName = async () => {
    try {
      console.log("Updating user's name");
      const response = await fetch("http://localhost:8081/updateUserDisplayName", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({uID: 4, name: editedDisplayName})
      })
    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }
    setUser({ ...user, displayName: editedDisplayName }) // Update database
    setIsEditingName(false)
  } 

  const handleCancelEdit = () => {
    setEditedDisplayName(user.displayName)
    setIsEditingName(false)
  }

  const handleShowcaseChange = async (selectedPokemon) => {
    // Call setShowcased to selected pokemon
    try {
      console.log("Marking Pokemon: ", selectedPokemon.map((p)=>(p.nickname)));
      const response = await fetch("http://localhost:8081/setShowcased", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({instanceIDs: selectedPokemon.map((p)=>(p.id)), user: 4}),
      });
      // Convert UserPokemon to ShowcasedPokemon format
      const newShowcase = selectedPokemon.map((pokemon) => ({
        nickname: pokemon.nickname,
        level: pokemon.level,
        name: pokemon.name,
      }))
      setShowcasedPokemon(newShowcase)

    } catch (err) {
      console.error("Error showcasing Pokémon: ", err);
      alert("Something went wrong adding the Pokémon.")
    }

    
  }

  // Convert showcased Pokemon to UserPokemon format for selection
  const selectedForModal = showcasedPokemon.map((pokemon, index) => {
    const userPokemon = pokemonList.find(
      (p) => p.nickname === pokemon.nickname && p.level === pokemon.level && p.name === pokemon.name,
    )
    return userPokemon || { id: index, ...pokemon }
  })

  return (
    <div className="profile-container">
      {/* Profile Header */}
      <div className="profile-card">
        <div className="profile-card-content">
          <div className="profile-info">
            {/* Profile Picture */}
            <div className="profile-avatar">
              <div className="avatar-fallback">{user.displayName.charAt(0)}</div>
            </div>

            {/* Profile Info */}
            <div className="profile-details">
              {/* Display Name */}
              <div className="name-section">
                {isEditingName ? (
                  <div className="name-edit">
                    <input
                      value={editedDisplayName}
                      onChange={(e) => setEditedDisplayName(e.target.value)}
                      className="name-input"
                    />
                    <button className="edit-button edit-button-save" onClick={handleSaveDisplayName}>
                      <Save className="edit-icon" />
                    </button>
                    <button className="edit-button edit-button-cancel" onClick={handleCancelEdit}>
                      <X className="edit-icon" />
                    </button>
                  </div>
                ) : (
                  <div className="name-display">
                    <h1 className="profile-name">{user.displayName}</h1>
                    <button className="edit-button edit-button-ghost" onClick={() => setIsEditingName(true)}>
                      <Edit2 className="edit-icon" />
                    </button>
                  </div>
                )}
                <p className="profile-username">@{user.username}</p>
              </div>

              {/* Stats */}
              <div className="profile-stats">
                <div className="stat-item">
                  <div className="stat-number">{user.tradeCount}</div>
                  <div className="stat-label">Trades</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{pokemonList.length}</div>
                  <div className="stat-label">Pokémon Caught</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showcased Pokemon */}
      <div className="showcase-section">
        <div className="showcase-header">
          <h2 className="showcase-title">Showcased Pokémon</h2>
          <button className="edit-showcase-button" onClick={() => setIsPokemonModalOpen(true)}>
            <Edit2 className="edit-showcase-icon" />
            Edit Showcase
          </button>
        </div>

        {showcasedPokemon.length > 0 ? (
          <div className="showcase-grid">
            {showcasedPokemon.map((pokemon, index) => (
              <PokemonCard key={`${pokemon.nickname}-${index}`} pokemon={pokemon} />
            ))}
            {/* Empty slots */}
            {Array.from({ length: 6 - showcasedPokemon.length }).map((_, index) => (
              <div key={`empty-${index}`} className="empty-slot">
                <button className="empty-slot-button" onClick={() => setIsPokemonModalOpen(true)}>
                  <Plus className="empty-slot-icon" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-showcase">
            <p className="no-showcase-text">No Pokémon showcased yet</p>
            <button className="add-showcase-button" onClick={() => setIsPokemonModalOpen(true)}>
              <Plus className="add-showcase-icon" />
              Add Pokémon to Showcase
            </button>
          </div>
        )}
      </div>

      {/* Pokemon Selection Modal */}
      <PokemonSelectionModal
        isOpen={isPokemonModalOpen}
        onClose={() => setIsPokemonModalOpen(false)}
        userPokemon={pokemonList}
        selectedPokemon={selectedForModal}
        onSelectionChange={handleShowcaseChange}
      />
    </div>
  )
}
