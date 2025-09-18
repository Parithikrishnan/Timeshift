import React, { useState } from "react";
import "../styles/TimeTracker.css";
import { db } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore";

function TimeTracker({ user }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [pauseStart, setPauseStart] = useState(null);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [pauseCount, setPauseCount] = useState(0);
  const [logs, setLogs] = useState([]);
  const [totalDuration, setTotalDuration] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalNote, setModalNote] = useState("");

  // Format duration helper
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const getTodayDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Save session to Firestore
  const saveSession = async (sessionData) => {
    try {
      await addDoc(collection(db, "time-duration"), sessionData);
      console.log("Session saved:", sessionData);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleClockIn = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setLogs([{ type: "Clock In", time: now.toLocaleTimeString(), note: "Day started" }]);
    setPauseCount(0);
    setPauseDuration(0);
    setTotalDuration(0);
  };

  const openModal = (action) => {
    setModalAction(action);
    setModalNote("");
    setModalVisible(true);
  };

  const submitModal = () => {
    const now = new Date();

    if (modalAction === "Pause") {
      setPauseStart(now);
      setIsPaused(true);
      setPauseCount(prev => prev + 1);
      setLogs(prev => [...prev, { type: "Pause", time: now.toLocaleTimeString(), note: modalNote }]);
    } else if (modalAction === "Clock Out") {
      const workDuration = now - startTime - pauseDuration;
      const newLog = { type: "Clock Out", time: now.toLocaleTimeString(), note: modalNote, duration: workDuration };
      const fullSession = [...logs, newLog];

      // Save session
      saveSession({
        user: user.email,
        date: getTodayDate(),
        sessionStart: startTime.toLocaleTimeString(),
        sessionEnd: now.toLocaleTimeString(),
        totalWorkDuration: workDuration,
        pauseDuration: pauseDuration,
        pauseCount: pauseCount,
        logs: fullSession,
      });

      // Update state for display, then reset for next session
      setLogs(fullSession);
      setTotalDuration(workDuration);
      setIsRunning(false);
      setIsPaused(false);
      setStartTime(null);
      setPauseStart(null);
      setPauseDuration(0);
      setPauseCount(0);
    }

    setModalVisible(false);
  };

  const handleResume = () => {
    if (!isPaused) return;
    const now = new Date();
    const pauseDiff = now - pauseStart;
    setPauseDuration(prev => prev + pauseDiff);
    setIsPaused(false);
    setLogs(prev => [...prev, { type: "Resume", time: now.toLocaleTimeString(), note: "Work resumed" }]);
  };

  return (
    <div className="time-tracker-container">
      {/* Left Panel */}
      <div className="left-panel">
        <h1 className="title">Time Tracker</h1>
        <div className="btn-group">
          {!isRunning && <button className="btn start" onClick={handleClockIn}>Clock In</button>}
          {isRunning && !isPaused && <button className="btn pause" onClick={() => openModal("Pause")}>Pause</button>}
          {isPaused && <button className="btn resume" onClick={handleResume}>Resume</button>}
          {isRunning && <button className="btn stop" onClick={() => openModal("Clock Out")}>Clock Out</button>}
        </div>

        <div className="summary">
          <h2>Summary</h2>
          <p><span>Start Time:</span> {startTime ? startTime.toLocaleTimeString() : "--"}</p>
          <p><span>Total Pauses:</span> {pauseCount}</p>
          <p><span>Pause Duration:</span> {formatDuration(pauseDuration)}</p>
          <p><span>Total Work:</span> {totalDuration > 0 ? formatDuration(totalDuration) : "--"}</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="right-panel">
        <h2>Daily Log</h2>
        <ul>
          {logs.map((log, idx) => (
            <li key={idx}>
              <div className="log-header">
                <span className="log-type">{log.type}</span>
                <span className="log-time">{log.time}</span>
              </div>
              {log.note && <p className="log-note">💬 {log.note}</p>}
              {log.duration && <p className="log-duration">⏳ {formatDuration(log.duration)}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="modal-backdrop">
          <div className="modal">
            <span className="modal-close" onClick={() => setModalVisible(false)}>&#10006;</span>
            <h3>{modalAction} Note</h3>
            <textarea
              placeholder="Describe your task..."
              value={modalNote}
              onChange={(e) => setModalNote(e.target.value)}
            />
            <button className="btn submit" onClick={submitModal}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimeTracker;
