import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager({ memberId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [memberId]);

  const fetchTasks = async () => {
    const res = await axios.get(`http://localhost:3001/api/tasks/member/${memberId}`);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    await axios.post("http://localhost:3001/api/tasks", {
      description: newTask,
      deadline: newDeadline,
      status: "doing",
      member_id: memberId,
    });
    setNewTask("");
    setNewDeadline("");
    fetchTasks();
  };

  const toggleStatus = async (task) => {
    await axios.put(`http://localhost:3001/api/tasks/${task.id}`, {
      description: task.description,
      deadline: task.deadline,
      status: task.status === "done" ? "doing" : "done",
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3001/api/tasks/${id}`);
    fetchTasks();
  };

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Mô tả công việc"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="w-full mb-2 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
        />
        <input
          type="date"
          value={newDeadline}
          onChange={(e) => setNewDeadline(e.target.value)}
          className="w-full mb-2 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={addTask}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Thêm nhiệm vụ
        </button>
      </div>

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <div>
              <p className={`font-medium ${task.status === "done" ? "line-through" : ""}`}>{task.description}</p>
              <small className="text-gray-500">Deadline: {task.deadline || "Không có"}</small>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleStatus(task)}
                className="text-sm text-blue-600 hover:underline"
              >
                {task.status === "done" ? "Hoàn thành" : "Đang làm"}
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                &times;
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
