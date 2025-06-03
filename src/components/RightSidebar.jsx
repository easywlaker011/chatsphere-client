import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/chatContext';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "anticipate"
    }
  })
};

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [isHovering, setIsHovering] = useState(null);
  
  useEffect(() => {
    if (messages) {
      setMsgImages(
        messages.filter(msg => msg?.image).map(msg => msg.image)
      );
    }
  }, [messages]);

  if (!selectedUser) return null;

  return (
    <div className={`relative bg-gradient-to-br from-[#1e1b4b] via-[#1e1f38] to-[#0f172a] text-white w-full h-full flex flex-col shadow-2xl rounded-xl overflow-hidden ${selectedUser ? "max-md:hidden" : ""}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div 
            key={i}
            className="absolute rounded-full bg-purple-900/10 blur-xl"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            variants={floatingVariants}
            animate="float"
            custom={i}
          />
        ))}
      </div>
      
      <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-600/80 scrollbar-track-transparent relative z-10'>
        <div className='pt-16 flex flex-col items-center gap-5 px-8'>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 15 }}
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="relative rounded-full"
              animate={{
                boxShadow: onlineUsers?.includes(selectedUser._id) 
                  ? ["0 0 0 0 rgba(74, 222, 128, 0.4)", "0 0 0 15px rgba(74, 222, 128, 0)"]
                  : "none"
              }}
              transition={{
                repeat: Infinity,
                duration: 2
              }}
            >
              <img
                src={selectedUser?.profilePic || assets.avatar_icon}
                alt="Profile"
                className='w-32 h-32 rounded-full border-4 border-purple-500/80 shadow-2xl object-cover ring-2 ring-white/20 hover:ring-purple-400 transition-all duration-300'
                loading="lazy"
              />
            </motion.div>
            
            {onlineUsers?.includes(selectedUser._id) && (
              <motion.div 
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-1 shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div className="bg-white rounded-full p-1">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className='flex flex-col items-center gap-1 w-full'
          >
            <h1 className='text-2xl font-bold flex items-center gap-3 select-none bg-gradient-to-r from-purple-300 via-pink-300 to-white bg-clip-text text-transparent'>
              {selectedUser.fullName}
              <motion.div
                animate={{ rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-purple-400"
              >
                ✨
              </motion.div>
            </h1>
            <motion.p 
              className='text-sm font-light text-center text-white/80 max-w-[280px] italic bg-white/5 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10'
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {selectedUser.bio || 'No bio available'}
            </motion.p>
          </motion.div>
        </div>

        {/* Заменили hr на motion.div */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className='border-t-2 border-purple-500/20 my-8 mx-8 rounded-full relative overflow-hidden'
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
            animate={{ x: [-100, 100] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className='px-8 pb-8'
        >
          <div className='flex items-center justify-between mb-6'>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className='text-base font-bold tracking-wide uppercase text-purple-300'>
                Shared Media
              </p>
            </motion.div>
            <motion.span 
              className='text-xs font-medium select-none bg-purple-900/50 px-2 py-1 rounded-full border border-purple-700/50'
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.5 }}
            >
              {msgImages.length} {msgImages.length === 1 ? 'item' : 'items'}
            </motion.span>
          </div>

          <div className="max-h-[260px] overflow-y-auto grid grid-cols-3 gap-3 scrollbar-thin scrollbar-thumb-purple-500/70 scrollbar-track-transparent">
            <AnimatePresence>
              {msgImages.length ? (
                msgImages.map((url, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={staggerVariants}
                    onClick={() => window.open(url, '_blank', 'noopener,noreferrer')} 
                    className='cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/30 relative group'
                    onMouseEnter={() => setIsHovering(index)}
                    onMouseLeave={() => setIsHovering(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={url} 
                      className='w-full h-full object-cover aspect-square rounded-xl group-hover:brightness-75 transition duration-300' 
                      alt={`Media ${index + 1}`}
                      loading="lazy"
                      onError={(e) => { e.target.src = assets.avatar_icon }}
                    />
                    <AnimatePresence>
                      {isHovering === index && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8 text-white/90" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-3 flex flex-col items-center justify-center py-10"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 text-purple-500/30 mb-3" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-white/50 italic select-none">No media shared yet</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className='p-5 border-t border-purple-700/30 bg-gradient-to-t from-[#1e1b4b]/90 to-transparent relative z-10'>
        <motion.button 
          whileHover={{ 
            scale: 1.02,
            background: [
              'linear-gradient(to bottom right, #9333ea, #db2777, #e11d48)',
              'linear-gradient(to bottom right, #7c3aed, #be185d, #dc2626)'
            ]
          }}
          whileTap={{ scale: 0.98 }}
          onClick={logout} 
          className="w-full relative overflow-hidden group text-white text-sm font-bold py-2 rounded-lg bg-gradient-to-br from-purple-700 via-pink-700 to-red-600 shadow-lg shadow-pink-800/50"
        >
          Log Out
          <span className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-600 to-red-500 opacity-30 blur-sm transition-all duration-500 group-hover:opacity-80 rounded-lg"></span>
        </motion.button>
      </div>
    </div>
  )
}

export default RightSidebar;
