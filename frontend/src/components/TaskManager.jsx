import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager({ memberId }) {
  const [tasks, setTasks] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [companyBranch, setCompanyBranch] = useState(""); // New state for company branch

  useEffect(() => {
    if (memberId) {
      fetchTasks();
    }
  }, [memberId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/tasks/member/${memberId}`);
      setTasks(res.data.tasks);
      setMemberInfo({
        ...res.data.member,
        notification_enabled: res.data.member.notification_enabled ?? true
      });
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const [newDeadlineTime, setNewDeadlineTime] = useState("09:00");
  const [notificationTime, setNotificationTime] = useState(30);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await axios.post("http://localhost:3001/api/tasks", {
        description: newTask,
        deadline: newDeadline,
        deadlineTime: newDeadlineTime,
        notificationTime: notificationTime,
        status: "doing",
        member_id: memberId,
        companyBranch: companyBranch, // Add company branch to the request
      });
      setNewTask("");
      setNewDeadline("");
      setNewDeadlineTime("09:00");
      setCompanyBranch(""); // Reset company branch field
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
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Member Info */}
      {/* Member Info section update */}
      {memberInfo && (
        <div className="card">
          <h3 className="font-semibold mb-2">Thông tin thành viên</h3>
          <p><strong>Tên:</strong> {memberInfo.name}</p>
          <p><strong>Số điện thoại:</strong> {memberInfo.phone || "Chưa có"}</p>
          <p><strong>Email:</strong> {memberInfo.email || "Chưa có"}</p>
          <p>
            <strong>Trạng thái thông báo:</strong>{" "}
            <span className={`badge ${memberInfo.notification_enabled ? 'badge-green' : 'badge-yellow'}`}>
              {memberInfo.notification_enabled ? "Đã bật" : "Đã tắt"}
            </span>
          </p>
        </div>
      )}

      {/* Add Task Form */}
      <div className="card">
        <h3 className="font-semibold mb-4">Thêm công việc mới</h3>
        <form onSubmit={addTask} className="space-y-4">
          {/* New Company Branch field */}
          <input
            type="text"
            placeholder="Chi nhánh công ty"
            value={companyBranch}
            onChange={(e) => setCompanyBranch(e.target.value)}
            className="input w-full"
          />
          
          {/* Changed from input to textarea for task description */}
          <textarea
            placeholder="Mô tả công việc"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="input w-full"
            rows={4}
            style={{ resize: "vertical" }}
          />
          
          <div className="flex gap-2">
            <input
              type="date"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="input flex-1"
              min={new Date().toISOString().split('T')[0]}
            />
            <input
              type="time"
              value={newDeadlineTime}
              onChange={(e) => setNewDeadlineTime(e.target.value)}
              className="input w-32"
            />
            <select
              value={notificationTime}
              onChange={(e) => setNotificationTime(Number(e.target.value))}
              className="input w-48"
            >
              <option value={15}>Thông báo trước 15 phút</option>
              <option value={30}>Thông báo trước 30 phút</option>
              <option value={60}>Thông báo trước 1 giờ</option>
              <option value={120}>Thông báo trước 2 giờ</option>
              <option value={1440}>Thông báo trước 1 ngày</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={!newTask.trim()}>
            Thêm công việc
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Danh sách công việc</h3>
          <div className="flex gap-2">
            {["all", "doing", "done"].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`badge ${
                  filter === status
                    ? status === "doing" ? "badge-yellow"
                    : status === "done" ? "badge-green"
                    : "badge-blue"
                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                }`}
              >
                {status === "all" ? "Tất cả" : status === "doing" ? "Đang làm" : "Hoàn thành"} (
                {status === "all" ? tasks.length : tasks.filter(t => t.status === status).length})
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
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
                    {task.companyBranch && (
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {task.companyBranch}
                      </p>
                    )}
                    <p className={task.status === "done" ? "line-through text-gray-500" : ""}>
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`badge ${task.status === "done" ? "badge-green" : "badge-yellow"}`}>
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
                      aria-label="Toggle status"
                    >
                      {task.status === "done" ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors duration-200"
                      aria-label="Delete task"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
