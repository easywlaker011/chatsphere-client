import React, { useContext, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      if (currState === "Sign Up" && !isDataSubmitted) {
        setIsDataSubmitted(true);
        return;
      }

      await login(currState === "Sign Up" ? 'signup' : 'login', { fullName, email, password, bio });
    } catch (error) {
      setFormError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
    setIsDataSubmitted(false);
    setFormError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.1
            }}
          />
        ))}
      </div>

      {/* Glow Effects */}
      <div className="absolute -top-1/4 -right-1/4 w-3/4 h-3/4 rounded-full bg-purple-600/10 filter blur-[100px]"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 rounded-full bg-indigo-600/10 filter blur-[100px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-4 sm:px-6 lg:px-8">
        {/* Branding Section */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-lg">
          <div className="mb-8 relative group">
            <img
              src={assets.logo_big}
              alt="Logo"
              className="w-48 lg:w-56 drop-shadow-xl transform transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md -z-10 scale-90 group-hover:scale-100 transition-all duration-500"></div>
          </div>

          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 animate-text">ChatSphere</span>
          </h1>

          <p className="text-lg lg:text-xl text-white/80 max-w-md leading-relaxed">
            Connect with friends and colleagues in our secure, private environment designed for seamless communication.
          </p>

          <div className="mt-8 flex space-x-4">
            <div classNamea="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
              <span className="text-sm text-white/80">5,000+ active users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <span className="text-sm text-white/80">End-to-end encrypted</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-md relative">
          {/* Form Floating Border Effect */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-75 blur-lg group-hover:opacity-100 transition duration-500 animate-border"></div>

          <form
            onSubmit={onSubmitHandler}
            className="relative bg-[#0f0e17]/90 backdrop-blur-2xl border border-[#ffffff15] rounded-2xl p-8 shadow-2xl overflow-hidden"
          >
            {/* Form Top Decoration */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>

            {/* Form Header */}
            <div className="flex justify-between items-center mb-8 relative">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currState === "Sign Up" ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-sm text-white/60 mt-1">
                  {currState === "Sign Up"
                    ? "Join our community today"
                    : "Sign in to continue your journey"}
                </p>
              </div>

              {isDataSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsDataSubmitted(false)}
                  className="p-2 rounded-lg hover:bg-[#ffffff10] transition-colors duration-200 group"
                  aria-label="Go back"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white group-hover:text-purple-300 transition-colors duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-6 p-4 bg-gradient-to-r from-rose-900/50 to-rose-800/50 border border-rose-700/50 rounded-lg text-white text-sm flex items-start backdrop-blur-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 flex-shrink-0 text-rose-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{formError}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5">
              {currState === "Sign Up" && !isDataSubmitted && (
                <div className="relative">
                  <input
                    onChange={(e) => setFullName(e.target.value)}
                    value={fullName}
                    type="text"
                    placeholder="Full Name"
                    required
                    className="input-field"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              <div className="relative">
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="Email Address"
                  required
                  className="input-field pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  minLength="6"
                  className="input-field pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-purple-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>

              {currState === "Sign Up" && isDataSubmitted && (
                <div className="relative">
                  <textarea
                    onChange={(e) => setBio(e.target.value)}
                    value={bio}
                    placeholder="Tell us about yourself..."
                    required
                    rows={4}
                    className="input-field resize-none pl-10"
                  />
                  <div className="absolute top-3 left-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Terms */}
              <div className="mb-2 flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 text-purple-600 bg-[#ffffff10] border-[#ffffff30] rounded focus:ring-purple-500 focus:ring-2"
                  />
                </div>
                <label htmlFor="terms" className="ml-3 text-sm text-white/80">
                  I agree to the <a href="#" className="text-purple-300 hover:underline hover:text-purple-200 transition-colors">Terms of Service</a> and <a href="#" className="text-purple-300 hover:underline hover:text-purple-200 transition-colors">Privacy Policy</a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 flex items-center justify-center rounded-xl text-white font-medium transition-all duration-300 relative overflow-hidden group ${
                  isLoading
                    ? 'bg-purple-700/70 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/40'
                }`}
              >
                <span className="relative z-10">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : currState === "Sign Up" ? isDataSubmitted ? 'Complete Registration' : 'Continue' : 'Login'}
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>

            {/* Switch Auth State */}
            <div className="mt-6 text-center text-sm text-white/80">
              {currState === "Sign Up" ? (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setCurrState("Login"); resetForm(); }}
                    className="text-purple-300 hover:text-purple-200 hover:underline transition-colors font-medium"
                  >
                    Login here
                  </button>
                </p>
              ) : (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setCurrState("Sign Up"); resetForm(); }}
                    className="text-purple-300 hover:text-purple-200 hover:underline transition-colors font-medium"
                  >
                    Sign up now
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(0) translateX(20px); }
          75% { transform: translateY(20px) translateX(10px); }
        }

        @keyframes animate-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes animate-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-border {
          background-size: 400% 400%;
          animation: animate-border 3s ease infinite;
        }

        .animate-text {
          background-size: 200% 200%;
          animation: animate-text 3s ease infinite;
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: white;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .input-field::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .input-field:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.2);
          background-color: rgba(255, 255, 255, 0.08);
        }

        .input-field:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default LoginPage;