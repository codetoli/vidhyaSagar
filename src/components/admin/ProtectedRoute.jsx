// src/components/admin/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { FiLoader } from 'react-icons/fi';

const ProtectedRoute = ({ children }) => {
  const [user, setUser]       = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f2460] flex items-center justify-center">
        <FiLoader size={36} className="text-orange-400 animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;