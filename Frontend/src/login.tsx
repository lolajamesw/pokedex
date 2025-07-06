import { Link } from 'react-router-dom';
import "./login.css"

export default function LoginPage({ setIsLoggedIn }) {
  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: validate credentials here, then:
    setIsLoggedIn(true);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Enter your username" required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="./create-account">Create one</Link>
      </p>
    </div>
  );
}