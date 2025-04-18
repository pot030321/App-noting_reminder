import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetail({ team, onSelectMember, selectedMember }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (team?.id) {
      fetchMembers();
    }
  }, [team]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3001/api/members/team/${team.id}`);
      setMembers(res.data);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMember.trim()) return;
    
    try {
      await axios.post("http://localhost:3001/api/members", {
        name: newMember,
        team_id: team.id,
        phone: newPhone
      });
      setNewMember("");
      fetchMembers();
      setNewPhone("");
    } catch (error) {
      console.error("Failed to add member:", error);
    }
  };

  const handleDeleteMember = async (id) => {
    try {
      if (selectedMember?.id === id) {
        onSelectMember(null);
      }
      await axios.delete(`http://localhost:3001/api/members/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Team Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{team.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thành viên và công việc
          </p>
        </div>
        <div className="badge-blue">
          {members.length} thành viên
        </div>
      </div>

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} className="mb-6">
  <div className="flex gap-2">
    <input
      type="text"
      value={newMember}
      onChange={(e) => setNewMember(e.target.value)}
      placeholder="Tên thành viên"
      className="input flex-1"
    />

    <input
      type="tel"
      value={newPhone}
      onChange={(e) => setNewPhone(e.target.value)}
      placeholder="Số điện thoại"
      className="input w-40"
    />

    <button type="submit" className="btn-primary" aria-label="Thêm thành viên">
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <title>Add member</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span>Thêm</span>
    </button>
  </div>
</form>

      {/* Members List */}
      <div>
        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Danh sách thành viên
        </h3>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status" aria-label="Loading..." />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Chưa có thành viên nào
            </div>
          ) : (
            members.map((member) => (
              <button
                key={member.id}
                onClick={() => onSelectMember(member)}
                type="button"
                className={`flex justify-between items-center w-full p-4 rounded-lg transition-all duration-200 ${
                  selectedMember?.id === member.id
                    ? "bg-blue-50 dark:bg-blue-900 border-2 border-blue-500"
                    : "bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                }`}
                aria-label={`Select member ${member.name}`}
                aria-pressed={selectedMember?.id === member.id}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMember(member.id);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  type="button"
                  aria-label={`Delete member ${member.name}`}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <title>Delete member</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
