import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import WorkerProfileForm from './components/WorkerProfileForm';
import Navbar from './components/navbar';
import WorkerProfilePage from './components/WorkerProfilePage';

function PrivateRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        {/* Public Home with listing and auth links */}
        <Route path="/" element={<HomePage />} />
        <Route path="/worker/:id" element={<WorkerProfilePage />} />


        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <WorkerProfileForm />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
