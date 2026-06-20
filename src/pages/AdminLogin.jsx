// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate                = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   
 <div className="relative min-h-screen bg-gradient-to-br from-[#0a2540] via-[#12395a] to-[#1b4f72]">
  <a
    href="/"
    className="absolute top-25 right-30 bg-orange-900 text-white font-bold px-5 py-3 rounded-full transition-all duration-300 hover:bg-orange-500 hover:scale-105 shadow-md hover:shadow-lg"
  >
    HOME/ADMIN
  </a>

    
    <div className="min-h-screen  flex items-center justify-center p-6">
      
     
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
      
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#4a2574] px-8 py-10 text-center relative">
            
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-3xl">🎓</span>
              </div>
               
              <div>
                <h1 className="text-white text-2xl font-bold tracking-wide">
                  VIDHYA SAGAR SCHOOL
                </h1>
                <p className="text-[#d6bbf2] text-sm font-medium mt-2 uppercase tracking-[0.25em]">
                  Admin Login
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <p className="text-center text-gray-600 text-sm mb-8">
              Only authorized administrators are allowed to access the dashboard.
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
                <FiAlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Admin Email"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#4a2574] focus:ring-4 focus:ring-purple-100 outline-none transition text-sm"
              />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Admin Password"
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-[#4a2574] focus:ring-4 focus:ring-purple-100 outline-none transition text-sm"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-[#8a44d6] hover:bg-[#7333b9] text-white font-semibold text-lg shadow-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Log In"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default AdminLogin;