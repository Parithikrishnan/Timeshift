import React, { useState, useEffect, useRef } from "react";
import "../styles/TimeTracker.css";

function TimeTracker() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [mouseActivity, setMouseActivity] = useState(0);
  const [notes, setNotes] = useState("");
  const [sessions, setSessions] = useState([]);

  const timerRef = useRef(null);
  const sessionStartRef = useRef(null);

  const startTimer = () => {
    if (!isClockedIn) {
      setIsClockedIn(true);
      setIsPaused(false);
      sessionStartRef.current = new Date();
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isClockedIn) {
      setIsPaused(true);
      clearInterval(timerRef.current);
    }
  };

  const resumeTimer = () => {
    if (isClockedIn && isPaused) {
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const clockOut = () => {
    if (isClockedIn) {
      const sessionEnd = new Date();
      const duration = seconds;

      const newSession = {
        start: sessionStartRef.current.toLocaleTimeString(),
        end: sessionEnd.toLocaleTimeString(),
        duration,
        notes,
        mouseActivity,
      };

      setSessions([newSession, ...sessions]);
      setIsClockedIn(false);
      setIsPaused(false);
      clearInterval(timerRef.current);
      setSeconds(0);
      setMouseActivity(0);
      setNotes("");
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      if (isClockedIn && !isPaused) {
        setMouseActivity((prev) => prev + 1);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isClockedIn, isPaused]);

  const formatTime = (sec) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="time-tracker-page">
      <div className="tracker-left">
        <h2>Time Tracker</h2>

        <div className="clock-display">
          <span className={`timer ${isPaused ? "paused" : ""}`}>
            {formatTime(seconds)}
          </span>
        </div>

        <textarea
          className="notes"
          placeholder="Add notes for this session..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="tracker-buttons">
          {!isClockedIn && (
            <button className="clock-btn clock-in" onClick={startTimer}>
              Clock In
            </button>
          )}
          {isClockedIn && !isPaused && (
            <button className="clock-btn pause" onClick={pauseTimer}>
              Pause
            </button>
          )}
          {isClockedIn && isPaused && (
            <button className="clock-btn resume" onClick={resumeTimer}>
              Resume
            </button>
          )}
          {isClockedIn && (
            <button className="clock-btn clock-out" onClick={clockOut}>
              Clock Out
            </button>
          )}
        </div>

        <div className="mouse-activity">
          Mouse Movements: <span>{mouseActivity}</span>
        </div>
      </div>

      <div className="tracker-right">
        <h3>Previous Sessions</h3>
        {sessions.length === 0 && <p>No sessions yet.</p>}
        {sessions.map((s, index) => (
          <div key={index} className="session-card">
            <p>
              <strong>Start:</strong> {s.start} | <strong>End:</strong> {s.end}
            </p>
            <p>
              <strong>Duration:</strong> {formatTime(s.duration)}
            </p>
            <p>
              <strong>Notes:</strong> {s.notes || "None"}
            </p>
            <p>
              <strong>Mouse Movements:</strong> {s.mouseActivity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimeTracker;
