import Autocomplete from "@mui/material/Autocomplete"
import { FormEvent, useEffect, useState, useRef } from "react";
import { MyCardPokemon } from "../types/pokemon-details";
import TextField from "@mui/material/TextField";
import { POKEMON_API_URL, USER_API_URL, USER_POKEMON_API_URL } from "../constants";

type Inputs = {
    setPokemonList: React.Dispatch<React.SetStateAction<MyCardPokemon[]>>,
    setBannerMessage: React.Dispatch<React.SetStateAction<string>>,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function NewPokemonModal({ setPokemonList, setBannerMessage, setIsModalOpen }: Inputs) {
    const [newPokemonName, setNewPokemonName] = useState("");
    const [newNickname, setNewNickname] = useState("");
    const [newLevel, setNewLevel] = useState("100");
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);
    const pokemonInputRef = useRef<HTMLInputElement>(null);
    const pokemonNamesRef = useRef<HTMLDataListElement>(null);

    useEffect(() => {
        fetch(POKEMON_API_URL + 'names')
          .then((res) => res.json())
          .then((data) => setPokemonNames(data))
          .catch((err) => console.error("Failed to fetch Pokémon:", err));
    }, [])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab" && pokemonInputRef.current && pokemonNamesRef.current) {
        const value = pokemonInputRef.current.value.toLowerCase();
        const options = Array.from(pokemonNamesRef.current.options) as HTMLOptionElement[];

        // Find first option that starts with the input
        const match = options.find(opt => opt.value.toLowerCase().startsWith(value));

        if (match) {
          e.preventDefault(); // prevent default tab behavior
          pokemonInputRef.current.value = match.value;
          setNewPokemonName(match.value);
        }
      }
    };

    const handleAddPokemon = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!newPokemonName || !newLevel) {
          alert("Please fill in required fields.");
          return;
        }
    
        try {
          const response = await fetch(USER_POKEMON_API_URL, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: newPokemonName,
              nickname: newNickname,
              level: parseInt(newLevel),
            }),
          });
    
          if (response.ok) {
            setTimeout(() => setBannerMessage(""), 4000);
    
            setIsModalOpen(false);
            setNewPokemonName("");
            setNewNickname("");
            setNewLevel("100");
    
            const updated = await fetch(USER_API_URL + 'pokemon', {credentials: "include"})
              .then((r) => r.json());
            setPokemonList(updated);
          } else {
            const errMsg = await response.text();
            console.error("Failed to add Pokémon:", errMsg);
    
            alert("Failed to add Pokémon. See console for details.");
          }
        } catch (err) {
          console.error("Error adding Pokémon:", err);
          alert("Something went wrong adding the Pokémon.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content large">
                <div className="modal-header">
                <h2>Add New Pokémon</h2>
                </div>

                <form className="pokemon-form" onSubmit={handleAddPokemon}>
                <div className="input-row">
                  <div className="input-group">
                    <label>Pokemon</label>
                    <input
                      type="text"
                      required
                      spellCheck={false}
                      value={newPokemonName}
                      onChange={(e) => setNewPokemonName(e.target.value)}
                      list="pokemonNames"
                      ref={pokemonInputRef}
                      onKeyDown={handleKeyDown}
                    />
                    <datalist id="pokemonNames" ref={pokemonNamesRef}>
                      {pokemonNames.map((pokemon) => <option value={pokemon}>{pokemon}</option>)}
                    </datalist>
                  </div>
                  <div className="input-group">
                    <label>Level</label>
                    <input
                        type="number"
                        placeholder="e.g., 25"
                        min={1}
                        max={100}
                        value={newLevel}
                        onChange={(e) => setNewLevel(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        required
                    />
                  </div>
                  <div className="input-group">
                    <label>Nickname</label>
                    <input
                        type="text"
                        spellCheck={false}
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
                    </div>
                </div>

                <div className="add-pokemon-modal-actions">
                    <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                    </button>
                    <button type="submit" className="add-button" disabled={!pokemonNames.includes(newPokemonName) || !newLevel}>
                    Add Pokémon
                    </button>
                </div>
                </form>
            </div>
            </div>
    )
}