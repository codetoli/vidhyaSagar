// src/pages/admin/AdminLogin.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { FiAlertCircle, FiMail, FiLock } from 'react-icons/fi';
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
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
   
 <div className="min-h-screen bg-[#f3f6f9] flex items-start justify-center px-4 py-6 sm:py-10">
  <a
    href="/"
    className="absolute top-4 right-4 sm:top-5 sm:right-5 text-sm text-slate-600 px-3 py-1 rounded-full transition-all z-20"
  >
    HOME / ADMIN
  </a>

    <div className="w-full max-w-md mx-auto">
      
     
    
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
        className="w-full"
      >
        <div className="bg-white rounded-[28px] shadow-xl overflow-hidden">
          <div className="px-8 pt-10 pb-8 text-center">
            <div className="mx-auto w-14 h-14 rounded-xl bg-[#183b78] flex items-center justify-center shadow-sm">
              <FiLock size={20} className="text-white" />
            </div>
            <h2 className="text-[#123764] text-xl sm:text-2xl font-bold mt-6">ADMIN LOGIN</h2>
             <h2 className="text-[#123764] text-xl sm:text-2xl font-bold mt-6">VIDHYA SAGAR SCHOOL</h2>
            <p className="text-slate-400 text-sm mt-1">Authorized Personnel Only</p>
          </div>

          <div className="px-6 pb-8 sm:px-8">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  <FiAlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <label className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiMail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Admin Email"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#183b78] focus:ring-2 focus:ring-[#183b78]/10 outline-none transition text-base bg-slate-50"
                />
              </label>

              <label className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <FiLock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-[#183b78] focus:ring-2 focus:ring-[#183b78]/10 outline-none transition text-base bg-slate-50"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-[#183b78] hover:bg-[#0f2e63] text-white font-semibold text-sm sm:text-base shadow-md transition-all duration-150 disabled:opacity-60"
              >
                {loading ? 'Signing In...' : 'ENTER ADMIN CONTROL'}
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