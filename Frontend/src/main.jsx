import { StrictMode, useState, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/navbar.js'
import PokemonInterface from './pokedex.js'
import PokemonDetail from './pokemonDetail.js'
import MyPokeDetail from './myPokemonDetail.js'
import Profile from './profile.js'
import MyPokedex from './my-pokemon.js'
import LoginPage from './login.js'
import CreateAccountPage from './create-account.js'
import Battle from './battle.js'
import SearchUserPage from './search-user.js'
import ViewProfile from './view-profile.js'
import ViewPokeDetail from './view-pokemon-detail.js'
import { USER_API_URL } from './constants.js'

function MainApp() {
  const [currentPage, setCurrentPage] = useState("pokedex")
  const location = useLocation();
  const hideNavbar = location.pathname === "/login" || location.pathname === "/create-account";
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      if (location.pathname === "/login" || location.pathname === "/create-account") 
        return;
      try {
        console.log(USER_API_URL + 'auth');
        const auth = await fetch(USER_API_URL + 'auth', {
          method: 'GET',
          credentials: 'include',
          samesite: 'lax',
        });
        const data = await auth.json()
        console.log('auth', data)
        console.log(!!auth.ok)
        if (auth.ok) setAuthenticated(true);
        else setAuthenticated(false)
      } catch (err) {
        console.log(err);
        setAuthenticated(false);
      }
    }
    setAuthenticated(null)
    authenticate();
  }, [location])

  function ProtectedRoute({ children }) {
    if (authenticated === null) return children; // or spinner
      return authenticated ? children : <Navigate to="/login" replace />;
  };

  return (
    <div>
      {!hideNavbar && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />}
      <main>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute><Navigate to= "/pokedex" /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-account" element={<CreateAccountPage />} />
          <Route path="/pokedex" element={<PokemonInterface />} />
          <Route path="/pokedex/:id" element={<ProtectedRoute><PokemonDetail /></ProtectedRoute>} />
          <Route path="/my-pokemon/:pID/:id" element={<ProtectedRoute><MyPokeDetail /></ProtectedRoute>} />
          <Route path="/view-pokemon/:pID/:id" element={<ProtectedRoute><ViewPokeDetail /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-pokemon" element={<ProtectedRoute><MyPokedex /></ProtectedRoute>} />
          <Route path="/battle" element={<ProtectedRoute><Battle /></ProtectedRoute>} />
          <Route path="/view-profile/:uID" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
          <Route path="/search-user" element={<ProtectedRoute><SearchUserPage /></ProtectedRoute>} />
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
