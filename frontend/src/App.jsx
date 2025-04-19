import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TeamDetail from "./components/TeamDetail";
import TaskManager from "./components/TaskManager";
import NotificationSettings from "./components/NotificationSettings";

export default function App() {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
    setSelectedMember(null); // Reset selected member when switching teams
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onSelectTeam={handleTeamSelect} />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {selectedTeam ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <TeamDetail 
                  team={selectedTeam} 
                  onSelectMember={handleMemberSelect}
                  selectedMember={selectedMember}
                />
              </div>
              
              <div className="card">
                {selectedMember ? (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      Công việc của {selectedMember.name}
                    </h2>
                    <TaskManager memberId={selectedMember.id} />
                    
                    {showNotificationSettings && (
                      <NotificationSettings
                        member={selectedMember}
                        onClose={() => setShowNotificationSettings(false)}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 py-12">
                    <div className="text-center">
                      <svg 
                        className="w-16 h-16 mx-auto mb-4 text-gray-400" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <title>Group icon</title>
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={1} 
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                        />
                      </svg>
                      <p className="text-lg">Chọn một thành viên để xem công việc</p>
                      <p className="mt-2 text-sm">
                        Bạn có thể thêm và quản lý công việc cho từng thành viên
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
              <div className="text-center">
                <svg 
                  className="w-24 h-24 mx-auto mb-6 text-gray-400" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>Building icon</title>
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
                <h1 className="text-3xl font-bold mb-4">Quản lý công việc</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Chọn một ban từ thanh bên để bắt đầu quản lý công việc
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}