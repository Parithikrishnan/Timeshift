import React, { useState } from "react";
import "../styles/Notification.css";

function Notifications() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Time Tracker UI", status: "Not Done" },
    { id: 2, title: "Add Dashboard Analytics", status: "Not Done" },
    { id: 3, title: "Integrate Mouse Tracking", status: "Not Done" },
  ]);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [note, setNote] = useState("");
  const [logs, setLogs] = useState([]);

  // Handle status change
  const handleStatusChange = (taskId, status) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          if (task.status === "Done") return task; // Cannot revert Done
          return { ...task, status };
        }
        return task;
      })
    );

    if (status !== "Not Done") {
      setEditingTaskId(taskId);
      setNote("");
    } else {
      setEditingTaskId(null);
    }
  };

  // Save note and log
  const handleSaveNote = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Update logs once
    setLogs((prevLogs) => [
      { task: task.title, status: task.status, note },
      ...prevLogs,
    ]);

    setEditingTaskId(null);
    setNote(""); // Clear note input
  };

  return (
    <div className="notifications-page">
      <div className="tasks-panel">
        <h2>Task Assignments</h2>
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <p className="task-title">{task.title}</p>
            <p className={`task-status ${task.status.replace(" ", "-").toLowerCase()}`}>
              Status: {task.status}
            </p>

            <div className="status-buttons">
              <button
                className="status-btn in-progress"
                disabled={task.status === "Done"}
                onClick={() => handleStatusChange(task.id, "In Progress")}
              >
                In Progress
              </button>
              <button
                className="status-btn done"
                disabled={task.status === "Done"}
                onClick={() => handleStatusChange(task.id, "Done")}
              >
                Done
              </button>
              <button
                className="status-btn not-done"
                disabled={task.status === "Done"}
                onClick={() => handleStatusChange(task.id, "Not Done")}
              >
                Not Done
              </button>
            </div>

            {editingTaskId === task.id && (
              <div className="commit-section">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add commit message or notes..."
                />
                <button className="save-btn" onClick={() => handleSaveNote(task.id)}>
                  Save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="logs-panel">
        <h2>Activity Logs</h2>
        {logs.length === 0 && <p>No actions yet.</p>}
        {logs.map((log, index) => (
          <div key={index} className="log-card">
            <p><strong>Task:</strong> {log.task}</p>
            <p><strong>Status:</strong> {log.status}</p>
            <p><strong>Message:</strong> {log.note || "None"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
