import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/login.css"
import { USER_API_URL } from './constants';
import { LockKeyhole, User } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const response = await fetch(
        USER_API_URL + `/login?username=${username}&password=${password}`, 
        { method: "POST"}
      );
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
    <div className="h-screen w-full bg-[url('/mick-haupt-KtTF68ZjBak-unsplash.jpg')] bg-center bg-cover p-4 flex flex-col items-center">
      <div className="auth-container">
        <h2>Login</h2>
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label>Username</label>
            <div className='username flex items-center'>
              <User className="icon -mr-7 ml-2 mb-4 text-gray-500"/>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Enter your username" 
                required 
                className='indent-5'
              />
            </div>
            
          </div>
          <div className="input-group">
            <label>Password</label>
            <div className='username flex items-center'>
              <LockKeyhole className="icon -mr-7 ml-2 mb-4 text-gray-500"/>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password" 
                required 
                className='indent-5'
              />
            </div>
          </div>
          <Link to="/create-account" className="password-reset">Forgot password?</Link>
          <button type="submit">Login</button>
        </form>
        <div className='flex items-center mt-5'>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent0"></div>
          <span className="px-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <button className='google'>
          <img 
            src="/icons8-google-48.png" 
            alt="Google sign-in" 
            width="30" 
          />
          Continue with Google
        </button>
        <p className="create-account">
          Don't have an account? <Link to="/create-account"> Sign up</Link>
        </p>
      </div>
      <div className='bg-white/70 px-1 rounded-md shadow-sm ml-auto'>
        <p>
          Photo by <a href="https://unsplash.com/@rocinante_11?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Mick Haupt</a> on <a href="https://unsplash.com/photos/red-ceramic-mug-on-brown-wooden-table-KtTF68ZjBak?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
        </p>
      </div>
    </div>
  );
}