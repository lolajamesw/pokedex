import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/login.css"
import { USER_API_URL } from './constants';
import { AtSign, LockKeyhole, User } from 'lucide-react';

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !username || !password) {
      alert("Please fill in required fields.");
      return;
    }

    try {
      const response = await fetch(
        USER_API_URL + `/create?name=${name}&username=${username}&password=${password}`, 
        { method: "POST" }
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
        console.error("Failed to create account:", errMsg);

        alert("Failed to create account. Please check your name, username, and password.\nUsernames must be unique\nPasswords must be between 8 and 20 characters, contain at least 2 numbers, and at least 1 special character.");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      alert("Something went wrong during account creation.");
    }
  };

  return (
    <div className="h-screen w-full bg-[url('/mick-haupt-KtTF68ZjBak-unsplash.jpg')] bg-center bg-cover p-4 flex flex-col items-center">
      <div className="auth-container">
        <h2>Create Account</h2>
        <form className="auth-form" onSubmit={handleCreateAccount}>
          <div className="input-group">
            <label>Name</label>
            <div className='username flex items-center'>
              <User className="icon -mr-7 ml-2 mb-4 text-gray-500"/>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter your name" 
                required 
                className='indent-5'
              />
            </div>
          </div>
          <div className="input-group">
            <label>Username</label>
            <div className='username flex items-center'>
              <AtSign className="icon -mr-7 ml-2 mb-4 text-gray-500"/>
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
            <label>Password (8+ characters)</label>
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
          <button type="submit">Create Account</button>
        </form>
        <div className='flex items-center my-4'>
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
          Already have an account? <Link to="/create-account"> Login</Link>
        </p>
      </div>
    </div>
  );
}