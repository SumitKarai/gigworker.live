// src/components/Login.jsx
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile-form');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/profile-form');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Log In</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded" />
      <button onClick={handleEmailLogin} className="w-full bg-blue-500 text-white p-2 rounded">Log In with Email</button>
      <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white p-2 rounded">Continue with Google</button>
    </div>
  );
};

export default Login;
