import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { FaEdit, FaTrash } from "react-icons/fa";

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    // Retrieve tasks from localStorage safely
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });
  const [taskInput, setTaskInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Update localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

const addTask = () => {
    if (taskInput.trim() === "") return;
    
    const newTask = {
        text: taskInput,
        completed: false,
        createdAt: new Date().toISOString(),  // Only createdAt is set
        updatedAt: null,  // No updated date initially
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTaskInput("");  // Clear input field
};



  const toggleTaskComplete = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, i) =>
        i === index ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() } : task
      )
    );
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

const editTask = (index) => {
    const newTaskText = prompt("Edit your task:", tasks[index].text);
    if (newTaskText !== null && newTaskText.trim() !== "") {
        const updatedTasks = [...tasks];
        updatedTasks[index].text = newTaskText;
        updatedTasks[index].updatedAt = new Date().toISOString(); // Update time when edited
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }
};




  const updateStats = () => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    if (completedTasks === totalTasks && totalTasks > 0) {
      blastConfetti();
    }

    return { completedTasks, totalTasks, progress };
  };

  const blastConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const { completedTasks, totalTasks, progress } = updateStats();

  return (
    <div className="container">
      <div className="stats-container">
        <div className="details">
          <h1>Todo App</h1>
          <p>Keep it up!</p>
          <div id="progressbar">
            <div id="progress" style={{ width: `${progress}%`, height: "10px" }}></div>
          </div>
        </div>
        <div className="stats-numbers">
          <p id="numbers">{completedTasks}/{totalTasks}</p>
        </div>
      </div>
      <form onSubmit={addTask}>
        <input type="text" value={taskInput} onChange={(e) => setTaskInput(e.target.value)} placeholder="Write your task" />
        <button id="newTask" type="submit">+</button>
      </form>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <div className="task-row">
              
              <div>

              <input id="check" type="checkbox" checked={task.completed} onChange={() => toggleTaskComplete(index)} />
              </div>
              <span className={`task-text ${task.completed ? "completed" : ""}`}>{task.text}</span>
              <span className="task-date">
    {task.updatedAt
        ? `Updated On : ${new Date(task.updatedAt).toLocaleDateString()}`
        : `Created On : ${new Date(task.createdAt).toLocaleDateString()}`
    }
</span>


              <button className="icon-button" onClick={() => editTask(index)}>
                <FaEdit />
              </button>
              <button className="icon-button delete" onClick={() => deleteTask(index)}>
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h1 id="msg">
   <p>
  {totalTasks === 0 
      ? "" 
      : completedTasks === totalTasks 
          ? "Tasks Completed 🎉" 
          : "Complete the Task Soon"
  }
</p>

</h1>

    </div>
    
  );
};

export default Todo;
