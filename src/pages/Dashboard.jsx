import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function Dashboard({ user }) {
  const [sessions, setSessions] = useState([]);
  const [summary, setSummary] = useState({
    totalWork: 0,
    totalPause: 0,
    sessionCount: 0,
  });

const fetchSessions = async () => {
  if (!user?.email) return;

  try {
    const q = query(collection(db, "time-duration"), where("userEmail", "==", user.email));
    const querySnapshot = await getDocs(q);
    const userSessions = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      userSessions.push({
        totalWorkDuration: Number(data.totalWorkDuration || 0),
        pauseDuration: Number(data.pauseDuration || 0),
        ...data,
      });
    });

    setSessions(userSessions);

    // Calculate summary
    const totalWork = userSessions.reduce((sum, s) => sum + s.totalWorkDuration, 0);
    const totalPause = userSessions.reduce((sum, s) => sum + s.pauseDuration, 0);

    setSummary({
      totalWork,
      totalPause,
      sessionCount: userSessions.length,
    });
  } catch (err) {
    console.error("Error fetching sessions:", err);
  }
};

useEffect(() => {
  fetchSessions();
}, [user]);


  const chartData = sessions.slice(-7).map((s, idx) => ({
    name: `Session ${idx + 1}`,
    Work: Math.floor(s.totalWorkDuration / (1000 * 60)),
    Pause: Math.floor(s.pauseDuration / (1000 * 60)),
  }));

  const formatTime = (ms) => {
    const hrs = Math.floor(ms / 3600000);
    const mins = Math.floor((ms % 3600000) / 60000);
    return `${hrs}h ${mins}m`;
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>

        {/* Profile Section */}
        <section className="profile-section">
          <div className="profile-info">
            <div className="profile-pic">{user?.name?.charAt(0)}</div>
            <div>
              <h2>{user?.name || "Employee Name"}</h2>
              <p>{user?.email || "email@example.com"}</p>
              <p className="role">Role: Employee</p>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="summary-section">
          <h2>Summary</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>Total Sessions</h3>
              <p>{summary.sessionCount}</p>
            </div>
            <div className="card">
              <h3>Total Work</h3>
              <p>{formatTime(summary.totalWork)}</p>
            </div>
            <div className="card">
              <h3>Total Pause</h3>
              <p>{formatTime(summary.totalPause)}</p>
            </div>
          </div>
        </section>

        {/* Chart Section */}
        <section className="chart-section">
          <h2>Recent Sessions</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", border: "1px solid #000", color: "#000" }}
                />
                <Bar dataKey="Work" fill="#000" />
                <Bar dataKey="Pause" fill="#555" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-sessions">No sessions logged yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
