import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/navbar.js'
import PokemonInterface from './pokedex.js'
import Profile from './profile.js'

function MainApp() {
  const [currentPage, setCurrentPage] = useState("pokedex")

  return (
    <div>
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main>
        {currentPage === "pokedex" && <PokemonInterface />}
        {currentPage === "profile" && <Profile />}
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
