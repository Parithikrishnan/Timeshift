import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Register.css"; // Separate CSS for register page

function Registration({ onRegister }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(name, email, password);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-app-title">Time Tracker</h1>
        <h2 className="register-title">Create your account</h2>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label>Name</label>
          </div>

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

          <button type="submit" className="register-btn">Register</button>
        </form>

        <div className="register-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
