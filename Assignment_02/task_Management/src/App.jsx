
import { useEffect, useState } from "react";
import Board from "./components/Board";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="app">
      <header className="header">
        <h1>Task Management Board</h1>
        <p>Organize your work and track your progress.</p>
      </header>

      <Board tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;
