// src/components/WorkerReviews.jsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const WorkerReviews = ({ workerId, reviews = [], onNewReview }) => {
  const [newReview, setNewReview] = useState("");
  const hasReviewed = sessionStorage.getItem(`reviewed-${workerId}`);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedReview = newReview.trim();
    if (!trimmedReview || hasReviewed) return;

    const updatedReviews = [trimmedReview, ...reviews];

    try {
      await updateDoc(doc(db, "workers", workerId), {
        reviews: updatedReviews,
      });

      onNewReview(updatedReviews); // update parent state
      sessionStorage.setItem(`reviewed-${workerId}`, "true"); // prevent further reviews this session
      setNewReview("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-1">Leave a Review</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write your review..."
          className="flex-1 border px-3 py-1 rounded text-sm"
          disabled={hasReviewed}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm"
          disabled={hasReviewed}
        >
          Submit
        </button>
      </form>

      {reviews.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-1">Reviews</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {reviews.map((review, idx) => (
              <li key={idx}>{review}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
};


export default WorkerReviews;
