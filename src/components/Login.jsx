// Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const userRef = doc(db, "workers", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // If no profile found, initialize it
        await setDoc(userRef, {
          area: "",
          available: false,
          bio: "",
          city: "",
          createdAt: serverTimestamp(),
          isActive: false,
          likes: 0,
          name: "",
          portfolio: "",
          reviews: [],
          skills: [],
          services: [],
          estimate: "",
          whatsapp: ""
        });
      }

      navigate("/profile");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
