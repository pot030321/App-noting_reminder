import React from "react";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <Sidebar />
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Chọn một ban để xem công việc</h1>
      </div>
    </div>
  );
}