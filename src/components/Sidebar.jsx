import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/chatContext';

const Sidebar = () => {
  const [input, setInput] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);

  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedUser(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div className={`bg-gradient-to-br from-[#0f0c29] via-[#1a1a3a] to-[#24243e] h-full p-6 rounded-r-3xl overflow-y-auto text-white shadow-[8px_0_30px_-15px_rgba(109,40,217,0.3)] transition-all duration-500 ${selectedUser ? 'max-md:hidden' : ''}`}>
      {/* Header */}
      <div className="sticky top-0 z-20 pb-6 bg-gradient-to-b from-[#0f0c29]/90 via-[#1a1a3a]/90 to-[#24243e]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200 tracking-tight">
              ChatSphere
            </h1>
            <span className="ml-2 text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full border border-white/10">
              beta
            </span>
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition-all duration-300 group relative"
            >
              <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <img 
                src={assets.menu_icon} 
                alt="Menu" 
                className="w-6 h-6 filter brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity duration-200" 
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl animate-fadeIn z-30 overflow-hidden">
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      navigate('profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 text-sm text-white/90 hover:bg-white/10 rounded-lg flex items-center gap-3 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
                  >
                    <div className="p-1 bg-white/10 rounded-lg">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>Edit Profile</span>
                  </button>
                  <div className="border-t border-white/10" />
                  <button
                    onClick={logout}
                    className="w-full px-4 py-3 text-sm text-white/90 hover:bg-red-500/20 rounded-lg flex items-center gap-3 transition-all duration-300 hover:translate-x-2 hover:shadow-lg"
                  >
                    <div className="p-1 bg-red-500/20 rounded-lg">
                      <svg className="w-4 h-4 text-red-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 shadow-inner hover:shadow-[0_0_15px_-5px_rgba(109,40,217,0.5)] transition-all duration-500">
          <div className="p-1 bg-white/10 rounded-lg">
            <svg className="h-5 w-5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6M5 10a7 7 0 1114 0 7 7 0 01-14 0z" />
            </svg>
          </div>
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent flex-1 text-sm placeholder:text-white/40 focus:outline-none text-white/90 tracking-wide"
            placeholder="Search users..."
            value={input}
          />
          {input && (
            <button 
              onClick={() => setInput('')}
              className="p-1 text-white/40 hover:text-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Users List */}
      <div className="mt-4 space-y-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({ ...prev, [user._id]: 0 }));
            }}
            onMouseEnter={() => setHoveredUser(user._id)}
            onMouseLeave={() => setHoveredUser(null)}
            className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 cursor-pointer group ${
              selectedUser?._id === user._id
                ? 'bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] shadow-lg'
                : hoveredUser === user._id
                ? 'bg-white/10 backdrop-blur-sm'
                : 'bg-transparent hover:bg-white/5'
            }`}
          >
            <div className="relative">
              <div className={`absolute inset-0 rounded-full ${
                onlineUsers.includes(user._id) 
                  ? 'bg-green-500/30 animate-pulse' 
                  : 'bg-transparent'
              }`}></div>
              <img
                src={user?.profilePic || assets.avatar_icon}
                alt={user.fullName}
                className={`w-14 h-14 rounded-full object-cover border-2 transition-all duration-500 ${
                  selectedUser?._id === user._id
                    ? 'border-white/90'
                    : onlineUsers.includes(user._id)
                    ? 'border-green-400/80'
                    : 'border-white/20'
                } group-hover:border-purple-300`}
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-[#1a1a3a] rounded-full shadow-md"></span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate text-white group-hover:text-white transition-colors duration-300">
                  {user.fullName}
                </p>
                {user.isAdmin && (
                  <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-500/30">
                    admin
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1 ${
                onlineUsers.includes(user._id)
                  ? 'text-green-300'
                  : 'text-white/50'
              }`}>
                {onlineUsers.includes(user._id) ? 'Online now' : 'Offline'}
              </p>
            </div>
            {unseenMessages[user._id] > 0 && (
              <div className="absolute right-4 animate-spring">
                <span className="bg-red-400 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-md">
                  {unseenMessages[user._id]}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-xl"></div>
            <div className="relative bg-gradient-to-br from-[#7c3aed]/10 to-[#6d28d9]/20 p-8 rounded-full border border-white/10">
              <svg className="h-20 w-20 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white/90 mb-2">
            {input ? 'No matches found' : 'Your contacts list is empty'}
          </h3>
          <p className="text-sm text-white/50 max-w-xs mb-6">
            {input 
              ? "Try adjusting your search query" 
              : "Start connecting with people to see them here"}
          </p>
          {!input && (
            <button 
              className="px-6 py-2.5 bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] text-white rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95"
              onClick={() => navigate('/invite')}
            >
              <span className="relative z-10">Invite Friends</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;