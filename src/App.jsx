import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TimeTracker from "./components/TimeTracker";

function App() {
  // Simple authentication state (mock)
  const [user, setUser] = useState(null);

  // Mock login logic
  const handleLogin = (email, password) => {
    if (email && password) {
      setUser({ email, name: "John Doe" });
      return true;
    }
    return false;
  };

  // Mock register logic
  const handleRegister = (name, email, password) => {
    if (name && email && password) {
      setUser({ email, name });
      return true;
    }
    return false;
  };

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />
        <Route path="/time-tracker" element={<TimeTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
