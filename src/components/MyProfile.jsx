import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'workers', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleAvailability = async () => {
    if (!auth.currentUser || !userData) return;
    
    try {
      const userRef = doc(db, 'workers', auth.currentUser.uid);
      await updateDoc(userRef, {
        available: !userData.available
      });
      setUserData({ ...userData, available: !userData.available });
    } catch (error) {
      console.error("Error updating availability:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!userData) return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Profile Not Found</h2>
      <p className="mb-4">User not logged in or data not available.</p>
      <Link to="/login" className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Go to Login
      </Link>
    </div>
  );

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return 'Not available';
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 mb-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
        <Link 
          to="/edit-profile" 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Edit Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
          <div className="space-y-3">
            <ProfileField label="Name" value={userData.name} />
            <ProfileField label="Email" value={auth.currentUser?.email} />
            <ProfileField label="City" value={userData.city} />
            <ProfileField label="Area" value={userData.area} />
            <ProfileField label="WhatsApp" value={userData.whatsapp} />
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Professional Information</h3>
          <div className="space-y-3">
            <ProfileField label="Status" value={userData.isActive ? 'Active' : 'Inactive'} />
            <p className="ml-4 text-sm text-gray-500">Note: If active then</p>
            <p className="ml-4 text-sm text-gray-500">1. Your profile will be shown on top in search results</p>
            <p className="ml-4 text-sm text-gray-500">2. Your Whats app button is enabled, anybody can directly contact you on Whats app</p>
            <div className="flex items-center">
              <p className="font-medium text-gray-700 mr-2">Availability:</p>
              <button
                onClick={toggleAvailability}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${userData.available ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${userData.available ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className="ml-2 text-gray-800">
                {userData.available ? 'Available' : 'Not Available'}
              </span>
            </div>
            <p className="ml-4 text-sm text-gray-500">Note: If not available then Whats app button will be disabled </p>
            <ProfileField label="Likes" value={userData.likes || 0} />
            <ProfileField label="Reviews" value={userData.reviews?.length || 0} />
            <div>
              <p className="font-medium text-gray-700">Portfolio:</p>
              {userData.portfolio ? (
                <a href={userData.portfolio} className="text-blue-600 hover:underline break-all" target="_blank" rel="noopener noreferrer">
                  {userData.portfolio}
                </a>
              ) : (
                <span className="text-gray-500">Not set</span>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Skills</h3>
          {userData.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No skills added</p>
          )}
        </div>

        {/* Services Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Services</h3>
          {userData.services?.length > 0 ? (
            <ul className="space-y-3">
              {userData.services.map((service, index) => (
                <li key={index} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="font-medium">{service.name}</div>
                  <div className="text-green-600">₹{service.estimate || 'Price not set'}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No services added</p>
          )}
        </div>

        {/* Additional Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg col-span-1 md:col-span-2">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfileField label="User ID" value={userData.userId} />
            <ProfileField label="Account Created" value={formatDate(userData.createdAt)} />
            <div className="md:col-span-2">
              <p className="font-medium text-gray-700">Bio:</p>
              <p className="mt-1 text-gray-800 whitespace-pre-line">
                {userData.bio || 'No bio added'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable profile field component
const ProfileField = ({ label, value }) => (
  <div>
    <p className="font-medium text-gray-700">{label}:</p>
    <p className="text-gray-800">{value || 'Not set'}</p>
  </div>
);

export default MyProfile;