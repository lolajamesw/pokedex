"use client"

import { useState } from "react"
import { Edit2, Save, X, Plus } from "lucide-react"
import "./profile.css"

// Mock user data based on User table query
const mockUser = {
  username: "trainer_red",
  Name: "Trainer Red", // Display name from database
  tradeCount: 47,
}

// Mock showcased Pokemon data based on showcase query
const mockShowcasedPokemon = [
  { nickname: "Bulby", level: 45, Species: "Bulbasaur" },
  { nickname: "Flame", level: 52, Species: "Charizard" },
  { nickname: "Sparky", level: 38, Species: "Pikachu" },
  { nickname: "Ivy", level: 48, Species: "Venusaur" },
  { nickname: "Splash", level: 41, Species: "Blastoise" },
  { nickname: "Freeze", level: 55, Species: "Articuno" },
]

// Mock user's Pokemon collection for selection (would come from another query)
const mockUserPokemon = [
  { id: 1, nickname: "Bulby", level: 45, Species: "Bulbasaur" },
  { id: 2, nickname: "Ivy Jr", level: 32, Species: "Ivysaur" },
  { id: 3, nickname: "Ivy", level: 48, Species: "Venusaur" },
  { id: 4, nickname: "Ember", level: 28, Species: "Charmander" },
  { id: 5, nickname: "Blaze", level: 35, Species: "Charmeleon" },
  { id: 6, nickname: "Flame", level: 52, Species: "Charizard" },
  { id: 7, nickname: "Squirt", level: 25, Species: "Squirtle" },
  { id: 8, nickname: "Turtle", level: 38, Species: "Wartortle" },
  { id: 9, nickname: "Splash", level: 41, Species: "Blastoise" },
  { id: 10, nickname: "Sparky", level: 38, Species: "Pikachu" },
  { id: 11, nickname: "Freeze", level: 55, Species: "Articuno" },
  { id: 12, nickname: "Thunder", level: 58, Species: "Zapdos" },
  { id: 13, nickname: "Inferno", level: 60, Species: "Moltres" },
]

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
        <p className="showcase-species">{pokemon.Species}</p>
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
  const [user, setUser] = useState(mockUser)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedDisplayName, setEditedDisplayName] = useState(user.Name)
  const [isPokemonModalOpen, setIsPokemonModalOpen] = useState(false)
  const [showcasedPokemon, setShowcasedPokemon] = useState(mockShowcasedPokemon)

  const handleSaveDisplayName = () => {
    setUser({ ...user, Name: editedDisplayName })
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditedDisplayName(user.Name)
    setIsEditingName(false)
  }

  const handleShowcaseChange = (selectedPokemon) => {
    // Convert UserPokemon to ShowcasedPokemon format
    const newShowcase = selectedPokemon.map((pokemon) => ({
      nickname: pokemon.nickname,
      level: pokemon.level,
      Species: pokemon.Species,
    }))
    setShowcasedPokemon(newShowcase)
  }

  // Convert showcased Pokemon to UserPokemon format for selection
  const selectedForModal = showcasedPokemon.map((pokemon, index) => {
    const userPokemon = mockUserPokemon.find(
      (p) => p.nickname === pokemon.nickname && p.level === pokemon.level && p.Species === pokemon.Species,
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
              <div className="avatar-fallback">{user.Name.charAt(0)}</div>
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
                    <h1 className="profile-name">{user.Name}</h1>
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
                  <div className="stat-number">{mockUserPokemon.length}</div>
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
        userPokemon={mockUserPokemon}
        selectedPokemon={selectedForModal}
        onSelectionChange={handleShowcaseChange}
      />
    </div>
  )
}
