import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import {
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import SkillsSelector from './SkillsSeletor';
import CitySelector from './CitySelector';
import ServiceSelector from './ServiceSelector';

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    city: '',
    bio: '',
    portfolio: '',
    whatsapp: '',
    available: false,
    skills: [],
    services: [],
  });

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState("");
  const [services, setServices] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, 'workers', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || '',
            area: data.area || '',
            city: data.city || '',
            bio: data.bio || '',
            portfolio: data.portfolio || '',
            whatsapp: data.whatsapp || '',
            available: data.available || false,
            skills: data.skills || [],
            services: data.services || [],
          });
          setCity(data.city || '');
          setSkills(data.skills || []);
          setServices(data.services || []);
        }
        setLoading(false);
      }
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;
    try {
      const userRef = doc(db, 'workers', userId);
      await updateDoc(userRef, {
        ...formData,
        city,
        skills,
        services,
      });
      alert('Profile updated!');
      navigate('/my-profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />

        <input name="area" placeholder="Area" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded-md" />

        <CitySelector selectedCity={city} setSelectedCity={setCity} />
  

        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" placeholder="Bio" className="w-full p-2 border rounded-md" />

        <input name="portfolio" placeholder="Portfolio Link" value={formData.portfolio} onChange={handleChange} className="w-full p-2 border rounded-md" />
        <input
  name="whatsapp"
  placeholder="WhatsApp Number"
  value={formData.whatsapp}
  onChange={handleChange}
  className="w-full p-2 border rounded-md"
/>

        <div className="flex items-center space-x-2">
          <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} />
          <label>Available for work</label>
        </div>

        <SkillsSelector selectedSkills={skills} setSelectedSkills={setSkills} />
        <ServiceSelector
        selectedServices={services}
        setSelectedServices={setServices}
      />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
