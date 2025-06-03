import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  if (!authUser) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-purple-500/20 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-purple-500/20 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-purple-500/20 rounded"></div>
            <div className="h-4 bg-purple-500/20 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  const [selectedImage, setSelectedImage] = useState(null);
  const [email, setEmail] = useState(authUser.email || '');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(authUser.phoneNumber || '');
  const [name, setName] = useState(authUser.fullName || '');
  const [bio, setBio] = useState(authUser.bio || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  const initialData = {
    name: authUser.fullName || '',
    bio: authUser.bio || '',
    email: authUser.email || '',
    phoneNumber: authUser.phoneNumber || '',
    image: null,
  };

  useEffect(() => {
    const changesDetected =
      name !== initialData.name ||
      bio !== initialData.bio ||
      email !== initialData.email ||
      phoneNumber !== initialData.phoneNumber ||
      selectedImage !== initialData.image ||
      password.trim() !== ''; // Password always treated as a change if non-empty

    setHasChanges(changesDetected);
  }, [name, bio, email, password, phoneNumber, selectedImage]);


  useEffect(() => {
    const changesDetected =
      name !== initialData.name ||
      bio !== initialData.bio ||
      selectedImage !== initialData.image;
    setHasChanges(changesDetected);
  }, [name, bio, selectedImage]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });
        navigate('/');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate('/');
      };
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const payload = {
    fullName: name,
    bio,
    email,
    phoneNumber,
  };
  if (password.trim()) payload.password = password;


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 left-10 w-80 h-80 bg-purple-500 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full filter blur-[120px]"></div>
      </div>

      <div className="w-full max-w-4xl backdrop-blur-xl bg-[#0f0c29]/80 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 transform transition-all duration-500 hover:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.3)]">
        <div className="flex flex-col lg:flex-row">
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex-1 p-8 lg:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-200 tracking-tight">
                Profile Settings
              </h2>
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-white/80 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {showError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl backdrop-blur-sm flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 text-red-300 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-100 font-medium">No changes detected</p>
                  <p className="text-red-200/80 text-sm mt-1">Please make changes before saving</p>
                </div>
              </div>
            )}

            {/* Avatar Upload */}
            <div className="mb-8">
              <label htmlFor="avatar" className="block text-sm font-medium text-white/80 mb-4">
                Profile Picture
              </label>
              <div
                className="flex items-center gap-6 cursor-pointer group"
                onClick={triggerFileInput}
                onMouseEnter={() => setIsHoveringAvatar(true)}
                onMouseLeave={() => setIsHoveringAvatar(false)}
              >
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 opacity-0 ${isHoveringAvatar ? 'opacity-100' : ''
                    } transition-opacity duration-300`}></div>
                  <img
                    src={selectedImage ? URL.createObjectURL(selectedImage) : authUser.profilePic || assets.avatar_icon}
                    className={`w-20 h-20 rounded-full object-cover border-2 transition-all duration-500 ${selectedImage ? 'border-white/50' : 'border-white/20'
                      } ${isHoveringAvatar ? 'scale-105 border-purple-300' : ''}`}
                    alt="Profile"
                  />
                  <div className={`absolute inset-0 rounded-full flex items-center justify-center opacity-0 ${isHoveringAvatar ? 'opacity-100' : ''
                    } transition-opacity duration-300`}>
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-white/80 group-hover:text-white transition-colors duration-300 font-medium">
                    {selectedImage ? 'Change photo' : 'Upload photo'}
                  </span>
                  <p className="text-sm text-white/50 mt-1">JPG, PNG or GIF (max 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  type="file"
                  id="avatar"
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-3">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bio Input */}
            <div className="mb-8">
              <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-3">
                Bio
              </label>
              <div className="relative">
                <textarea
                  id="bio"
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  placeholder="Tell something about yourself..."
                  required
                  rows={4}
                  className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center pointer-events-none">
                  <span className="text-xs text-white/30">{bio.length}/150</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !hasChanges}
              className={`w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl transition-all duration-500 shadow-lg ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90 hover:shadow-[0_10px_20px_-5px_rgba(124,58,237,0.4)]'
                } ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''} relative overflow-hidden group`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </form>

          {/* Decorative Sidebar */}
          <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gradient-to-b from-purple-500/10 to-indigo-600/10 border-l border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full filter blur-[80px] transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
            <div className="relative z-10 text-center">
              <img
                src={assets.logo_icon}
                className="w-48 h-48 object-contain mb-6 transform transition-all duration-500 hover:scale-105 ml-17"
                alt="QuickChat Logo"
              />
              <h3 className="text-xl font-bold text-white mb-2">Personalize Your Profile</h3>
              <p className="text-white/60 max-w-xs">Make it uniquely yours with a photo and details that represent you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;