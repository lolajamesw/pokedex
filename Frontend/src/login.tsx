import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./login.css"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in required fields.");
      return;
    }

    console.log(localStorage.getItem("server"));

    try {
      const response = await fetch(`http://${localStorage.getItem("server")}/userLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        console.error("Failed to login:", errMsg);

        alert("Failed to login. Please check your username and password.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      alert("Something went wrong during login.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label>Username</label>
          <input 
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)} 
            placeholder="Enter your username" 
            required 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password" 
            required 
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p className="create-account">
        <Link to="/create-account">Don't have an account? Create one</Link>
      </p>
    </div>
  );
}