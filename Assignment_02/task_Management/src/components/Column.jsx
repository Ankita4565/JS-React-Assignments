
import TaskCard from "./TaskCard";

function Column({ status, tasks, updateTask, deleteTask }) {
  return (
    <div className={`column ${status.replace(" ", "-").toLowerCase()}`}>
      <div className="column-header">
        <h2>{status}</h2>
        <span className="task-count">{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-message">No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Column;
