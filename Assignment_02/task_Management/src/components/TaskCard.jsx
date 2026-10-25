
import { useState } from "react";

function TaskCard({ task, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const saveTask = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Task title is required");
      return;
    }

    updateTask({
      ...task,
      title: title,
      description: description,
    });

    setIsEditing(false);
  };

  return (
    <div className="task-card">
      {isEditing ? (
        <form onSubmit={saveTask}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />

          <div className="card-actions">
            <button type="submit" className="save-btn">
              Save
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h3>{task.title}</h3>

          <p>{task.description || "No description provided."}</p>

          <label className="status-label">Change Status</label>

          <select
            value={task.status}
            onChange={(e) =>
              updateTask({
                ...task,
                status: e.target.value,
              })
            }
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>

          <div className="card-actions">
            <button
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => {
                if (window.confirm("Delete this task?")) {
                  deleteTask(task.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskCard;
