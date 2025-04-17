import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const res = await axios.get("http://localhost:3001/api/teams");
    setTeams(res.data);
  };

  const handleAddTeam = async () => {
    if (!newTeam.trim()) return;
    await axios.post("http://localhost:3001/api/teams", { name: newTeam });
    setNewTeam("");
    fetchTeams();
  };

  const handleDeleteTeam = async (id) => {
    await axios.delete(`http://localhost:3001/api/teams/${id}`);
    fetchTeams();
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 border-r border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Danh sách ban</h2>

      <ul className="space-y-2 mb-4">
        {teams.map((team) => (
          <li
            key={team.id}
            onClick={() => onSelectTeam(team)}
            className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1 cursor-pointer"
          >
            <span>{team.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteTeam(team.id);
              }}
              className="text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="Thêm ban mới"
          className="flex-1 px-2 py-1 rounded border dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleAddTeam}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
        >
          Thêm
        </button>
      </div>
    </aside>
  );
}
