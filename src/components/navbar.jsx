import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <nav className="p-4 bg-blue-600 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">
        GigWorkers
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link to={'my-profile'} className="hover:underline">
              My Profile
            </Link>
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signup" className="hover:underline">Become a Gig Worker</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
