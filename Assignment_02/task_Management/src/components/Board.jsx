
import { useState } from "react";
import Column from "./Column";

function Board({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTask = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a task title");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      status: "To Do",
    };

    setTasks([...tasks, newTask]);

    setTitle("");
    setDescription("");
  };

  const updateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const statuses = ["To Do", "In Progress", "Done"];

  return (
    <div className="board">
      <form className="task-form" onSubmit={addTask}>
        <h2>Add New Task</h2>

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button type="submit">+ Add Task</button>
      </form>

      <div className="columns">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Board;
