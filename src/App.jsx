import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TimeTracker from "./components/TimeTracker";
import Notifications from "./components/Notifications";

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

        {/* Register page */}
        <Route
          path="/register"
          element={user ? <Navigate to="/login" /> : <Registration onRegister={handleRegister} />}
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
        <Route path="/notifications" element={<Notifications/>} />
      </Routes>
    </Router>
  );
}

export default App;
