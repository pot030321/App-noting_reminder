import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TeamDetail({ team }) {
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");

  useEffect(() => {
    fetchMembers();
  }, [team]);

  const fetchMembers = async () => {
    const res = await axios.get(`http://localhost:3001/api/members/team/${team.id}`);
    setMembers(res.data);
  };

  const handleAddMember = async () => {
    if (!newMember.trim()) return;
    await axios.post("http://localhost:3001/api/members", {
      name: newMember,
      team_id: team.id,
    });
    setNewMember("");
    fetchMembers();
  };

  const handleDeleteMember = async (id) => {
    await axios.delete(`http://localhost:3001/api/members/${id}`);
    fetchMembers();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{team.name}</h2>

      <ul className="space-y-2 mb-4">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center bg-white dark:bg-gray-700 px-3 py-2 rounded shadow"
          >
            <span>{member.name}</span>
            <button
              onClick={() => handleDeleteMember(member.id)}
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
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          placeholder="Thêm thành viên"
          className="flex-1 px-2 py-1 rounded border dark:bg-gray-800 dark:border-gray-600"
        />
        <button
          onClick={handleAddMember}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          Thêm
        </button>
      </div>
    </div>
  );
}
