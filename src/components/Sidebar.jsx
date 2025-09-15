import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "Clock In/Out", path: "/time-tracker", icon: "⏱️" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>TimeTracker</h1>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            <span className="icon">{link.icon}</span>
            <span className="link-text">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;
