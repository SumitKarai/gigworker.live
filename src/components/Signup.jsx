// src/components/Signup.jsx
import React, { useState } from 'react';
import { auth, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/profile-form');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/profile-form');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded" />
      <button onClick={handleEmailSignup} className="w-full bg-blue-500 text-white p-2 rounded">Sign Up with Email</button>
      <button onClick={handleGoogleSignup} className="w-full bg-red-500 text-white p-2 rounded">Continue with Google</button>
    </div>
  );
};

export default Signup;
