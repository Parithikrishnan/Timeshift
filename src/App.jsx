import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TimeTracker from "./components/TimeTracker";
import Admin from "./pages/Admin";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      console.log("Logged in user:", userCredential.user);
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Check if current user is admin by email
  const isAdmin = user?.email === "admin@sk.in";

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to={isAdmin ? "/admin" : "/dashboard"} />
          )}
        />
        <Route
          path="/dashboard"
          element={user && !isAdmin ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/time-tracker"
          element={user && !isAdmin ? <TimeTracker user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={user && isAdmin ? <Admin user={user} /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
