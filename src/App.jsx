import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid #374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#fff'
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#dc2626'
            }
          }
        }}
      />

      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/>} />
        <Route path='/profile' element={authUser ? <ProfilePage/> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;