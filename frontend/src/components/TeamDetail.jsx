import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetail({ team, onSelectMember, selectedMember }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editingMember, setEditingMember] = useState(null);

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
        phone: newPhone,
        email: newEmail,
        notification_enabled: true
      });
      setNewMember("");
      setNewPhone("");
      setNewEmail("");
      fetchMembers();
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

  const handleEditMember = async (member) => {
    setEditingMember(member);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/members/${editingMember.id}`, editingMember);
      setEditingMember(null);
      fetchMembers();
    } catch (error) {
      console.error("Failed to update member:", error);
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

      {/* Updated Add Member Form */}
      <form onSubmit={handleAddMember} className="mb-6">
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Tên thành viên"
            className="input"
          />

          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="input flex-1"
            />

            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="input flex-1"
            />
          </div>

          <button type="submit" className="btn-primary" aria-label="Thêm thành viên">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Thêm</span>
          </button>
        </div>
      </form>

      {/* Updated Members List */}
      <div>
        <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-3">
          Danh sách thành viên
        </h3>
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              {editingMember?.id === member.id ? (
                <form onSubmit={handleSaveEdit} className="w-full flex gap-2">
                  <input
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({...editingMember, name: e.target.value})}
                    className="input flex-1"
                  />
                  <input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({...editingMember, phone: e.target.value})}
                    className="input flex-1"
                    placeholder="Phone"
                  />
                  <input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({...editingMember, email: e.target.value})}
                    className="input flex-1"
                    placeholder="Email"
                  />
                  <button type="submit" className="btn-primary">Save</button>
                  <button 
                    type="button" 
                    onClick={() => setEditingMember(null)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <button
                    onClick={() => onSelectMember(member)}
                    className={`flex-1 p-4 rounded-lg ${
                      selectedMember?.id === member.id
                        ? "bg-blue-50 dark:bg-blue-900"
                        : "bg-white dark:bg-gray-700"
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.phone && <span>📞 {member.phone}</span>}
                        {member.email && <span> 📧 {member.email}</span>}
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditMember(member)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
