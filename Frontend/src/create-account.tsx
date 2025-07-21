import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css"

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!name || !username || !password) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/createAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          username: username,
          password: password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        setUsername("");
        setPassword("");
        localStorage.setItem("uID", user.uID);
        navigate("/pokedex");
      } else {
        const errMsg = await response.text();
        console.error("Failed to create account:", errMsg);

        alert("Failed to create account. Please check your name, username, and password.\nUsernames must be unique\nPasswords must be between 8 and 20 characters, contain at least 2 numbers, and at least 1 special character.");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      alert("Something went wrong during account creation.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form className="auth-form" onSubmit={handleCreateAccount}>
        <div className="input-group">
          <label>Name</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your name" 
            required 
          />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Choose a username" 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Choose a password" 
            required 
          />
        </div>
        <button type="submit">Create Account</button>
      </form>
      <p>
        <Link to="/login">Already have an account? Login here</Link>
      </p>
    </div>
  );
}