import { Link } from 'react-router-dom';
import "./login.css"

export default function CreateAccountPage() {
  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <form className="auth-form">
        <div className="input-group">
          <label>Name</label>
          <input type="text" placeholder="Enter your name" required />
        </div>
        <div className="input-group">
          <label>Username</label>
          <input type="text" placeholder="Choose a username" required />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="Choose a password" required />
        </div>
        <button type="submit">Create Account</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}