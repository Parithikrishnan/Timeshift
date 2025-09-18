import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import "../styles/Admin.css";

function Admin() {
  const [employees, setEmployees] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch all sessions grouped by user email and date
  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "time-duration"));
      const data = {};

      querySnapshot.forEach((doc) => {
        const entry = doc.data();
        if (!data[entry.user]) data[entry.user] = {};
        const date = entry.date || "Unknown Date";
        if (!data[entry.user][date]) data[entry.user][date] = [];
        data[entry.user][date].push({ id: doc.id, ...entry });
      });

      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employee logs:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const openModal = (user) => setSelectedUser(user);
  const closeModal = () => setSelectedUser(null);

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <section className="employee-list">
        <h2>Employees</h2>
        {Object.keys(employees).length === 0 ? (
          <p>No employee details found.</p>
        ) : (
          <ul>
            {Object.keys(employees).map((user) => (
              <li key={user} onClick={() => openModal(user)}>
                {user}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <span className="modal-close" onClick={closeModal}>&#10006;</span>
            <h2>{selectedUser}</h2>

            <div className="sessions-wrapper">
              {Object.keys(employees[selectedUser]).map((date) => (
                <div key={date} className="date-group">
                  <h3>Date: {date}</h3>
                  {employees[selectedUser][date].map((session, idx) => (
                    <div key={session.id} className="session-card">
                      <h4>Session {idx + 1}</h4>
                      <p><strong>Start:</strong> {session.sessionStart}</p>
                      <p><strong>End:</strong> {session.sessionEnd}</p>
                      <p><strong>Total Work:</strong> {session.totalWorkDuration} ms</p>
                      <p><strong>Total Pause:</strong> {session.pauseDuration} ms</p>
                      <p><strong>Pause Count:</strong> {session.pauseCount}</p>

                      <h5>Logs:</h5>
                      <ul className="logs-list">
                        {session.logs?.map((log, i) => (
                          <li key={i} className="log-item">
                            <p><strong>Type:</strong> {log.type}</p>
                            <p><strong>Note:</strong> {log.note}</p>
                            <p><strong>Time:</strong> {log.time}</p>
                            {log.duration && <p><strong>Duration:</strong> {log.duration} ms</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
