import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({ onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3001/api/teams");
      setTeams(res.data);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeam = async () => {
    if (!newTeam.trim()) return;
    try {
      await axios.post("http://localhost:3001/api/teams", { name: newTeam });
      setNewTeam("");
      fetchTeams();
    } catch (error) {
      console.error("Failed to add team:", error);
    }
  };

  const handleDeleteTeam = async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3001/api/teams/${id}`);
      fetchTeams();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  return (
    <aside className="sidebar animate-fade-in">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold">Team Manager</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Manage your teams and tasks
        </p>
      </div>

      {/* Add Team Form */}
      <div className="p-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTeam();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={newTeam}
            onChange={(e) => setNewTeam(e.target.value)}
            placeholder="Tên ban mới"
            className="input flex-1"
          />
          <button 
            type="submit"
            className="btn-primary whitespace-nowrap"
            aria-label="Thêm ban mới"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <title>Add team</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm</span>
          </button>
        </form>
      </div>

      {/* Teams List */}
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
          Danh sách ban ({teams.length})
        </h2>
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status" aria-label="Loading..." />
            </div>
          ) : teams.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có ban nào được tạo
            </div>
          ) : (
            teams.map((team) => (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team)}
                type="button"
                className="sidebar-item group animate-slide-in w-full text-left flex items-center"
                aria-label={`Select team ${team.name}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white flex-shrink-0">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <span className="flex-1 font-medium">{team.name}</span>
                <button
                  onClick={(e) => handleDeleteTeam(e, team.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  type="button"
                  aria-label={`Delete team ${team.name}`}
                >
                  <svg 
                    className="w-5 h-5 text-red-500 hover:text-red-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Delete team</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
