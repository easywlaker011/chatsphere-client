import React, { useContext } from 'react';
import ChatContainer from '../components/ChatContainer';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { ChatContext } from '../../context/chatContext';

const HomePage = () => {
  const { selectedUser } = useContext(ChatContext);
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 sm:p-6 lg:p-8">
      <div className={`backdrop-blur-lg bg-[#ffffff08] border border-[#ffffff15] rounded-3xl overflow-hidden h-full w-full mx-auto grid grid-cols-1 relative transition-all duration-500 ease-in-out shadow-2xl ${
        selectedUser 
          ? 'md:grid-cols-[minmax(300px,0.8fr)_minmax(400px,2fr)_minmax(250px,0.7fr)]' 
          : 'md:grid-cols-[minmax(300px,0.6fr)_minmax(400px,1fr)]'
      }`}>
        <Sidebar/>
        <ChatContainer/>
        {selectedUser && <RightSidebar />}
      </div>
    </div>
  );
};

export default HomePage;