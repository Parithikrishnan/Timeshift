import React from "react";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

function Dashboard({ user }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
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
      </div>
    </div>
  );
}

export default Dashboard;
