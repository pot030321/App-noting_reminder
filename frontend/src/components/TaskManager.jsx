import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager({ memberId }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [filter, setFilter] = useState("all"); // all, doing, done
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (memberId) {
      fetchTasks();
    }
  }, [memberId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/tasks/member/${memberId}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      await axios.post("http://localhost:3001/api/tasks", {
        description: newTask,
        deadline: newDeadline,
        status: "doing",
        member_id: memberId,
      });
      setNewTask("");
      setNewDeadline("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleStatus = async (task) => {
    try {
      await axios.put(`http://localhost:3001/api/tasks/${task.id}`, {
        ...task,
        status: task.status === "done" ? "doing" : "done",
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Add Task Form */}
      <div className="card">
        <h3 className="font-semibold mb-4">Thêm công việc mới</h3>
        <form onSubmit={addTask} className="space-y-4">
          <input
            type="text"
            placeholder="Mô tả công việc"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="input"
          />
          <div className="flex gap-2">
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="input"
              min={new Date().toISOString().split('T')[0]}
            />
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
              disabled={!newTask.trim()}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <title>Add task</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Thêm</span>
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Danh sách công việc</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`badge ${
                filter === "all" ? "badge-blue" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              Tất cả ({tasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("doing")}
              className={`badge ${
                filter === "doing" ? "badge-yellow" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              Đang làm ({tasks.filter(t => t.status === "doing").length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("done")}
              className={`badge ${
                filter === "done" ? "badge-green" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
              }`}
            >
              Hoàn thành ({tasks.filter(t => t.status === "done").length})
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status" aria-label="Loading..." />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Không có công việc nào {filter !== "all" ? `đang ${filter === "done" ? "hoàn thành" : "làm"}` : ""}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border dark:border-gray-600 animate-slide-in"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className={task.status === "done" ? "line-through text-gray-500" : ""}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span 
                        className={`badge ${
                          task.status === "done" ? "badge-green" : "badge-yellow"
                        }`}
                      >
                        {task.status === "done" ? "Hoàn thành" : "Đang làm"}
                      </span>
                      {task.deadline && (
                        <span className="text-gray-500 dark:text-gray-400">
                          Hạn: {formatDate(task.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(task)}
                      className={`p-1.5 rounded-full transition-colors duration-200 ${
                        task.status === "done"
                          ? "text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900"
                          : "text-green-600 hover:bg-green-100 dark:hover:bg-green-900"
                      }`}
                      aria-label={task.status === "done" ? "Mark as doing" : "Mark as done"}
                      type="button"
                    >
                      {task.status === "done" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <title>Mark as doing</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <title>Mark as done</title>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                      aria-label={`Delete task ${task.description}`}
                      type="button"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <title>Delete task</title>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
