import React, { useState } from "react";
import "../styles/Login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // reset error before new login attempt
    onLogin(email, password, setError);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-app-title">Time Tracker</h1>
        <h2 className="auth-title">Login to your account</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Password</label>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-btn">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
