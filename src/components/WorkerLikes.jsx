// src/components/WorkerLikes.jsx
import { useEffect, useState } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const WorkerLikes = ({ workerId }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const checkLikeStatus = async () => {
      const likedStatus = sessionStorage.getItem(`liked_${workerId}`);
      if (likedStatus === "true") setLiked(true);

      const docSnap = await getDoc(doc(db, "workers", workerId));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setLikes(data.likes || 0);
      }
    };

    checkLikeStatus();
  }, [workerId]);

  const handleLike = async () => {
    if (liked) return;

    const newLikes = likes + 1;

    await updateDoc(doc(db, "workers", workerId), {
      likes: newLikes,
    });

    setLikes(newLikes);
    setLiked(true);
    sessionStorage.setItem(`liked_${workerId}`, "true");
  };

  return (
    <div className="mb-4 flex items-center gap-3">
      <button
        onClick={handleLike}
        disabled={liked}
        className={`px-3 py-1 rounded text-sm font-medium ${
          liked ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        👍 {liked ? "Liked" : "Like"}
      </button>
      <span className="text-sm text-gray-700">Total Likes: {likes}</span>
    </div>
  );
};

