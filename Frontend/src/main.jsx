import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar.js'
import PokemonInterface from './pokedex.js'
import PokemonDetail from './pokemonDetail.js'
import MyPokeDetail from './myPokemonDetail.js'
import Profile from './profile.js'
import MyPokedex from './my-pokemon.js'

function MainApp() {
  const [currentPage, setCurrentPage] = useState("pokedex")

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {/* {currentPage === "pokedex" && <PokemonInterface />}
        {currentPage === "profile" && <Profile />}
        {currentPage === "pokedex/:id" && <PokemonDetail />} */}
        <Routes>
          <Route path="/" element={<Navigate to= "/pokedex" />} />
          <Route path="/pokedex" element={<PokemonInterface />} />
          <Route path="/pokedex/:id" element={<PokemonDetail />} />
          <Route path="/my-pokemon/:pID/:id" element={<MyPokeDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-pokemon" element={<MyPokedex />} />
        </Routes>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  </StrictMode>
)
