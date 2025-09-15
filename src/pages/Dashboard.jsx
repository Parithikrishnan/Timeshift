import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard({ user }) {
  const [summary, setSummary] = useState({
    todayHours: 0,
    activeTime: 0,
    idleTime: 0,
    breaks: 0,
    pendingLeave: 0,
    approvedLeave: 0,
    notifications: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(prev => ({
        ...prev,
        todayHours: prev.todayHours + 0.05,
        activeTime: prev.activeTime + 0.04,
        idleTime: prev.idleTime + 0.01,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
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

        <section className="summary-section">
          <h2>Summary</h2>
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Today's Hours</h3>
              <p>{summary.todayHours.toFixed(2)}h</p>
            </div>
            <div className="summary-card">
              <h3>Active Time</h3>
              <p>{summary.activeTime.toFixed(2)}h</p>
            </div>
            <div className="summary-card">
              <h3>Idle Time</h3>
              <p>{summary.idleTime.toFixed(2)}h</p>
            </div>
            <div className="summary-card">
              <h3>Breaks</h3>
              <p>{summary.breaks}m</p>
            </div>
            <div className="summary-card">
              <h3>Pending Leave</h3>
              <p>{summary.pendingLeave}</p>
            </div>
            <div className="summary-card">
              <h3>Approved Leave</h3>
              <p>{summary.approvedLeave}</p>
            </div>
            <div className="summary-card">
              <h3>Notifications</h3>
              <p>{summary.notifications}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
