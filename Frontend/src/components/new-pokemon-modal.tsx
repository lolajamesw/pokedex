import Autocomplete from "@mui/material/Autocomplete"
import { FormEvent, useEffect, useState } from "react";
import { MyCardPokemon } from "../types/pokemon-details";
import TextField from "@mui/material/TextField";

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
    useEffect(() => {
        fetch(`http://localhost:8081/pokemonNames`)
          .then((res) => res.json())
          .then((data) => setPokemonNames(data))
          .catch((err) => console.error("Failed to fetch Pokémon:", err));
      }, [])

    const handleAddPokemon = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!newPokemonName || !newLevel) {
          alert("Please fill in required fields.");
          return;
        }
    
        try {
          const response = await fetch("http://localhost:8081/addPokemon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pokemonName: newPokemonName,
              nickname: newNickname,
              level: parseInt(newLevel),
              uID: localStorage.getItem("uID")
            }),
          });
    
          if (response.ok) {
            const displayNickname = newNickname || newPokemonName;
            setBannerMessage(
              `Congratulations! You caught a level ${newLevel} ${newPokemonName} named ${displayNickname}!`
            );
            setTimeout(() => setBannerMessage(""), 4000);
    
            setIsModalOpen(false);
            setNewPokemonName("");
            setNewNickname("");
            setNewLevel("100");
    
            const updated = await fetch(`http://localhost:8081/userPokemon?uID=${localStorage.getItem("uID")}`).then((r) => r.json());
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
                <button className="close-button" onClick={() => setIsModalOpen(false)}>
                    &times;
                </button>
                </div>

                <form className="pokemon-form" onSubmit={handleAddPokemon}>
                <div className="input-row">
                    <div className="input-group">
                    <label>Pokemon</label>
                    <Autocomplete
                        // disablePortal
                        options={pokemonNames}
                        sx={{
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                            border: "0px solid #ccc",   // normal border
                            }
                        },
                        }}
                        popupIcon={null}
                        disableClearable
                        autoSelect
                        autoHighlight
                        freeSolo={false}
                        inputValue={newPokemonName}
                        onInputChange={(event, newInputValue) => {setNewPokemonName(newInputValue)}}                          
                        renderInput={
                        (params) => <TextField 
                            {...params} 
                            size="small" 
                            fullWidth
                            sx={{
                                "& .MuiInputBase-input": {
                                height: "30px",      // optional: controls text height
                                }
                            }}
                            InputProps={{
                                ...params.InputProps as any, // ✅ cast here
                            }}
                        />
                        }
                    />
                    </div>
                    <div className="input-group">
                    <label>Nickname</label>
                    <input
                        type="text"
                        placeholder="e.g., Sparky"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                    />
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
                </div>

                <div className="modal-actions">
                    <button type="button" className="cancel-button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                    </button>
                    <button type="submit" className="add-button">
                    Add Pokémon
                    </button>
                </div>
                </form>
            </div>
            </div>
    )
}