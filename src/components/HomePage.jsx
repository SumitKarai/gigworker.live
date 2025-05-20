import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "workers"));
        const workerList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWorkers(workerList);
        setFilteredWorkers(workerList);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  useEffect(() => {
    let filtered = workers;

    if (selectedCity) {
      filtered = filtered.filter(worker => worker.city === selectedCity);
    }

    if (selectedSkill) {
      filtered = filtered.filter(worker =>
        worker.skills?.some(skill => skill.skill === selectedSkill)
      );
    }

    setFilteredWorkers(filtered);
  }, [selectedCity, selectedSkill, workers]);

  const uniqueCities = [...new Set(workers.map(w => w.city))];
  const allSkills = workers.flatMap(w => w.skills?.map(s => s.skill));
  const uniqueSkills = [...new Set(allSkills)];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Workers</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={selectedCity}
          onChange={e => setSelectedCity(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Cities</option>
          {uniqueCities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={selectedSkill}
          onChange={e => setSelectedSkill(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Skills</option>
          {uniqueSkills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {filteredWorkers.map(worker => (
  <div
    key={worker.id}
    className="border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    {/* Name & Availability */}
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-semibold text-gray-800">{worker.name}</h2>
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full ${
          worker.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
        }`}
      >
        {worker.available ? "Available" : "Unavailable"}
      </span>
    </div>

    {/* City */}
    <p className="text-sm text-gray-500 mb-1">City: {worker.city}</p>

    {/* Skill Tags */}
    <div className="flex flex-wrap gap-2 mt-2">
      {worker.skills?.map((skillObj, idx) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
        >
          {skillObj.skill}
        </span>
      ))}
    </div>

    {/* Status and Likes */}
    <div className="flex justify-between items-center mt-4">
      <div className="text-sm text-gray-600">
        <span
          className={`inline-block w-2 h-2 rounded-full mr-2 ${
            worker.isActive ? "bg-green-500" : "bg-gray-400"
          }`}
        ></span>
        {worker.isActive ? "Active Profile" : "Inactive Profile"}
      </div>

      <div className="text-sm text-gray-600">👍 {worker.likes || 0}</div>
    </div>

    {/* See Profile Button */}
    {worker.available && worker.isActive && (
      <button
        onClick={() => navigate(`/worker/${worker.id}`)}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg"
      >
        See Profile
      </button>
    )}
  </div>
))}
    </div>
  );
}

export default Home;
