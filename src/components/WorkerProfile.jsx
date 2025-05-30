import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { WorkerLikes } from "./WorkerLikes";
import WorkerReviews from "./WorkerReviews";
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkIcon from '@mui/icons-material/Work';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const docRef = doc(db, "workers", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWorker({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Worker not found");
        }
      } catch (err) {
        setError("Failed to fetch worker");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto p-6 bg-red-50 border border-red-200 rounded-lg shadow mt-6 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
      <p className="text-red-700">{error}</p>
    </div>
  );

  const whatsappLink = `https://wa.me/91${worker.whatsapp}`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-4xl font-bold text-blue-600">
            {worker.name ? (
              <PersonIcon style={{ fontSize: '3rem', color: '#3b82f6' }} />
            ) : (
              worker.name.charAt(0)
            )}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{worker.name}</h1>
          <p className="text-gray-600 mb-4 italic">{worker.bio || "No bio available"}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              worker.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}>
              {worker.isActive ? (
                <CheckCircleIcon style={{ fontSize: '1rem', marginRight: '0.25rem' }} />
              ) : (
                <CancelIcon style={{ fontSize: '1rem', marginRight: '0.25rem' }} />
              )}
              {worker.isActive ? "Active" : "Inactive"}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
              worker.available ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
            }`}>
              {worker.available ? (
                <CheckCircleIcon style={{ fontSize: '1rem', marginRight: '0.25rem' }} />
              ) : (
                <CancelIcon style={{ fontSize: '1rem', marginRight: '0.25rem' }} />
              )}
              {worker.available ? "Available" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
            <WorkIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
            Professional Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <EmailIcon className="text-gray-500 mr-2" fontSize="small" />
              <span className="text-gray-700">{worker.email}</span>
            </div>
            {worker.portfolio && (
              <div className="flex items-center">
                <LinkIcon className="text-gray-500 mr-2" fontSize="small" />
                <a href={worker.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View Portfolio
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2 flex items-center">
            <LocationOnIcon style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} />
            Location
          </h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <LocationOnIcon className="text-gray-500 mr-2" fontSize="small" />
              <span className="text-gray-700">
                {worker.area}, {worker.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {(worker.skills || []).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">Services & Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(worker.services || []).map((service, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-800">{service.name}</h3>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-green-600 font-bold flex items-center">
                  <CurrencyRupeeIcon fontSize="small" />
                  {service.estimate.toLocaleString('en-IN') || 'Not specified'}
                </span>
                {worker.isActive && worker.available && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200 flex items-center"
                  >
                    <WhatsAppIcon fontSize="small" className="mr-1" />
                    Inquire
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      {worker.isActive && worker.available && (
        <div className="flex justify-center mb-8">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            <WhatsAppIcon className="mr-2" />
            Contact on WhatsApp
          </a>
        </div>
      )}

      {/* Likes Component */}
      <div className="mb-8">
        <WorkerLikes workerId={worker.id} />
      </div>

      {/* Reviews Component */}
      <WorkerReviews
        workerId={worker.id}
        reviews={worker.reviews || []}
        onNewReview={(updated) =>
          setWorker((prev) => ({ ...prev, reviews: updated }))
        }
      />
    </div>
  );
};

export default WorkerProfile;