// src/pages/WorkerProfilePage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import WorkerReviews from "../components/WorkerReviews";
import {WorkerLikes} from "./WorkerLikes";

const WorkerProfilePage = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
 

  useEffect(() => {
    const fetchWorker = async () => {
      const docRef = doc(db, "workers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setWorker({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchWorker();
  }, [id]);

  if (!worker) return <div className="p-6 text-gray-600">Loading...</div>;

  const whatsappLink = `https://wa.me/${worker.whatsapp}?text=Hi%20${encodeURIComponent(
    worker.name
  )},%20I%20found%20your%20profile%20on%20gigworkers.live%20and%20would%20like%20to%20connect%20regarding%20your%20services.`;

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-xl border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{worker.name}</h1>
      <p className="text-sm text-gray-500 mb-4">City: {worker.city}</p>

      {/* Skills */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {worker.skills?.map((item, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-full"
            >
              {item.skill}
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      {worker.skills?.some(skill => skill.services?.length > 0) && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Services</h2>
          {worker.skills.map((item, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-medium text-gray-700">{item.skill}</p>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {item.services?.map((service, sIdx) => (
                  <li key={sIdx}>
                    {service.name} - ₹{service.estimate} {service.comments && <span>({service.comments})</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Status */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Profile Status</h2>
        <p className="text-sm">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${
              worker.isActive ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          {worker.isActive ? "Active" : "Inactive"}
        </p>
      </div>

      {/* Availability */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Availability</h2>
        <p className="text-sm text-gray-700">
          {worker.available ? "Available for work" : "Not available"}
        </p>
      </div>

      {/* Portfolio */}
      {worker.portfolio && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Portfolio</h2>
          <a
            href={worker.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            {worker.portfolio}
          </a>
        </div>
      )}

      {/* Estimate Cost */}
      {worker.estimate && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Estimated Cost</h2>
          <p className="text-sm text-gray-700">₹{worker.estimate}</p>
        </div>
      )}

{/* Likes */}
<WorkerLikes workerId={worker.id} />
 {/* WhatsApp Button */}
 {worker.whatsapp && (
        <div className="mt-4">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            📱 WhatsApp
          </a>
        </div>
      )}
      {/* Comments */}
      {worker.comments && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">Comments</h2>
          <p className="text-sm text-gray-700">{worker.comments}</p>
        </div>
      )}
<WorkerReviews
  workerId={worker.id}
  reviews={worker.reviews || []}
  onNewReview={(updatedReviews) =>
    setWorker((prev) => ({ ...prev, reviews: updatedReviews }))
  }
/>

      

     
    </div>
  );
};

export default WorkerProfilePage;
