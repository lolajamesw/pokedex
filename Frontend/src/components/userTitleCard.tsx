import { useState, useEffect } from "react"
import { Save, X, Edit2 } from "lucide-react"
import { User } from "../types/pokemon-details"

type Input = {
  pokemonCaught: number;
  uID: string;
  editable: boolean;
}

export default function UserTitleCard({ pokemonCaught, uID, editable }: Input) {
    const [user, setUser] = useState<User>({id: parseInt(uID), tradeCount: 0, displayName: "", username: "" })
    const [isEditingName, setIsEditingName] = useState(false)
    const [editedDisplayName, setEditedDisplayName] = useState(user.displayName)

    useEffect(() => {
        fetch("http://localhost:8081/user/" + uID)
          .then((res) => res.json())
          .then((data) => setUser(data))
          .catch((err) => console.error("Failed to fetch user: ", err));
    }, [])

    const handleSaveDisplayName = async () => {
    try {
        console.log("Updating user's name");
        const response = await fetch("http://localhost:8081/updateUserDisplayName", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({uID: uID, name: editedDisplayName})
        })
    } catch (err) {
        console.error("Error updating user's name: ", err);
        alert("Something went wrong updating your name.")
    }
    setUser({ ...user, displayName: editedDisplayName }) // Update database
    setIsEditingName(false)
    } 

    const handleCancelEdit = () => {
    setEditedDisplayName(user.displayName)
    setIsEditingName(false)
    }

    return (
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
                      {editable && 
                        <button   
                          className="edit-button edit-button-ghost" 
                          onClick={() => setIsEditingName(true)}
                        >
                          <Edit2 className="edit-icon" />
                        </button>
                      }
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
                    <div className="stat-number">{pokemonCaught}</div>
                    <div className="stat-label">Pokémon Caught</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}