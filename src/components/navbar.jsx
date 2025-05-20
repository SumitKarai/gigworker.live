import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isWorker, setIsWorker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "workers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        setIsWorker(docSnap.exists());
      } else {
        setIsWorker(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">GigWorkers</Link>
      <div className="space-x-4">
        {user ? (
          <>
            {isWorker && (
              <Link to="/profile" className="hover:underline">
                Worker Profile
              </Link>
            )}
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
