import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider, db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserInit = async (user) => {
    const userRef = doc(db, 'workers', user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || '',
        createdAt: serverTimestamp(),
        isActive: false,
        likes: 0,
        reviews: [],
        bio: '',
        portfolio: '',
        whatsapp: '',
        available: true,
      });
      console.log('✅ Firestore document created');
    } else {
      console.log('ℹ️ User already exists in Firestore');
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    try {
      const userCredential = isLogin
        ? await signInWithEmailAndPassword(auth, email, password)
        : await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      await handleUserInit(user);
    } catch (error) {
      console.error('Auth error:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      navigate('/my-profile');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await handleUserInit(user);
    } catch (error) {
      console.error('Google Sign-In error:', error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      navigate('/my-profile'); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleEmailAuth}
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
        </button>
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-blue-600 hover:underline"
        >
          Switch to {isLogin ? 'Sign Up' : 'Login'}
        </button>
        <div className="flex items-center justify-center space-x-2">
          <span className="h-px w-full bg-gray-300" />
          <span className="text-gray-500">or</span>
          <span className="h-px w-full bg-gray-300" />
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
            className="w-5 h-5"
          >
            <path
              fill="currentColor"
              d="M488 261.8c0-17.8-1.6-35-4.6-51.8H249v98.1h134.7c-5.6 30-22.7 55.5-48.5 72.5l78.4 60.8c45.9-42.4 72.4-104.7 72.4-179.6zM249 492c65.6 0 120.8-21.8 161-59.2l-78.4-60.8c-21.8 14.6-49.7 23.4-82.6 23.4-63.6 0-117.6-42.9-136.9-100.7H29.7v63.3C70.5 437.1 155.9 492 249 492zM112.1 291.7c-4.8-14.3-7.6-29.5-7.6-45s2.8-30.7 7.6-45L29.7 138.4C10.6 173.3 0 210.6 0 249s10.6 75.7 29.7 110.6l82.4-68.0zM249 100.6c35.8 0 68 12.3 93.3 36.3l70.1-70.1C348.2 23.3 299 0 249 0 155.9 0 70.5 54.9 29.7 138.4l82.4 68.0C131.4 143.5 185.4 100.6 249 100.6z"
            />
          </svg>
          <span>{loading ? 'Processing...' : 'Sign in with Google'}</span>
        </button>
      </div>
    </div>
  );
};

export default Signup;
