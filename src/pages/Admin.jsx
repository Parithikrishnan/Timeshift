import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../styles/Admin.css";

function Admin() {
  const [employees, setEmployees] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all time-duration logs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "time-duration"));
        const data = {};

        querySnapshot.forEach((doc) => {
          const entry = doc.data();
          if (!data[entry.user]) {
            data[entry.user] = [];
          }
          data[entry.user].push({ id: doc.id, ...entry });
        });

        setEmployees(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Format ms → h m s
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <p className="subtitle">All Employees & Work Sessions</p>

      <div className="employee-list">
        {Object.keys(employees).length === 0 ? (
          <p>No employee data available.</p>
        ) : (
          Object.keys(employees).map((userEmail) => (
            <div
              key={userEmail}
              className="employee-card"
              onClick={() => setSelectedUser(userEmail)}
            >
              <h3>{userEmail}</h3>
              <p>{employees[userEmail].length} session(s) logged</p>
            </div>
          ))
        )}
      </div>

      {/* Modal for details */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2>{selectedUser}'s Sessions</h2>
            <ul className="session-list">
              {employees[selectedUser].map((session) => (
                <li key={session.id} className="session-card">
                  <p>
                    <strong>Start:</strong> {session.sessionStart}
                  </p>
                  <p>
                    <strong>End:</strong> {session.sessionEnd}
                  </p>
                  <p>
                    <strong>Total Work:</strong>{" "}
                    {formatDuration(session.totalWorkDuration)}
                  </p>
                  <p>
                    <strong>Pause Duration:</strong>{" "}
                    {formatDuration(session.pauseDuration)}
                  </p>
                  <p>
                    <strong>Pauses:</strong> {session.pauseCount}
                  </p>

                  <details>
                    <summary>Logs</summary>
                    <ul>
                      {session.logs.map((log, idx) => (
                        <li key={idx}>
                          <span>{log.type} at {log.time}</span>
                          {log.note && <p>💬 {log.note}</p>}
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ))}
            </ul>
            <button className="close-btn" onClick={() => setSelectedUser(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
