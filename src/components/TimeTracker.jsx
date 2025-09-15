import React, { useState } from "react";
import "../styles/TimeTracker.css";

function TimeTracker() {
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

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
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
      setPauseCount((prev) => prev + 1);
      setLogs((prev) => [...prev, { type: "Pause", time: now.toLocaleTimeString(), note: modalNote }]);
    } else if (modalAction === "Clock Out") {
      const duration = now - startTime - pauseDuration;
      const newLog = { type: "Clock Out", time: now.toLocaleTimeString(), note: modalNote, duration };
      setLogs((prev) => [...prev, newLog]);
      setTotalDuration(duration);

      // Reset all session states to default for next session
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
    setPauseDuration((prev) => prev + pauseDiff);
    setIsPaused(false);
    setLogs((prev) => [...prev, { type: "Resume", time: now.toLocaleTimeString(), note: "Work resumed" }]);
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
