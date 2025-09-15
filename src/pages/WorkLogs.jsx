import React, { useState, useEffect } from "react";
import "../styles/WorkLogs.css";

function WorkLogs() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState("00:00:00");
  const [note, setNote] = useState("");
  const [sessions, setSessions] = useState([]);

  // Timer to update elapsed time
  useEffect(() => {
    let timer;
    if (isClockedIn && startTime) {
      timer = setInterval(() => {
        const diff = Date.now() - startTime;
        const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const m = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
        const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");
        setDuration(`${h}:${m}:${s}`);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn, startTime]);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setStartTime(Date.now());
  };

  const handleClockOut = () => {
    if (!note.trim()) {
      alert("Please add a note before clocking out!");
      return;
    }

    const newSession = {
      start: new Date(startTime).toLocaleString(),
      end: new Date().toLocaleString(),
      duration,
      note,
    };

    setSessions([newSession, ...sessions]);
    setIsClockedIn(false);
    setStartTime(null);
    setDuration("00:00:00");
    setNote("");
  };

  return (
    <div className="worklogs-card">
      <h2>Work Session</h2>
      <p className="timer">{duration}</p>

      {!isClockedIn ? (
        <button className="btn clock-in" onClick={handleClockIn}>Clock In</button>
      ) : (
        <>
          <textarea
            placeholder="Add description note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="note-input"
          />
          <button className="btn clock-out" onClick={handleClockOut}>Clock Out</button>
        </>
      )}

      <h3>Session Logs</h3>
      {sessions.length === 0 ? (
        <p className="muted">No sessions yet.</p>
      ) : (
        <table className="logs-table">
          <thead>
            <tr>
              <th>Start</th>
              <th>End</th>
              <th>Duration</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s, i) => (
              <tr key={i}>
                <td>{s.start}</td>
                <td>{s.end}</td>
                <td>{s.duration}</td>
                <td>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default WorkLogs;
