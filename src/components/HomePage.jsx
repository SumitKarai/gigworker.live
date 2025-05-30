import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { 
  LocationOn as LocationIcon,
  Work as WorkIcon,
  ThumbUp as LikeIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  Verified as ActiveIcon,
  Block as InactiveIcon
} from "@mui/icons-material";

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [allCities, setAllCities] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const snapshot = await getDocs(collection(db, "workers"));
        const workerList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        // Extract unique cities and skills
        const uniqueCities = Array.from(new Set(workerList.map(w => w.city).filter(Boolean)))
        const allSkillsList = workerList.flatMap(w => w.skills || []);
        const uniqueSkills = Array.from(new Set(allSkillsList));
        
        setAllCities(uniqueCities);
        setAllSkills(uniqueSkills);
  
        // Sort workers: isActive → available → likes descending
        const sortedWorkers = [...workerList].sort((a, b) => {
          if (b.isActive !== a.isActive) return b.isActive - a.isActive;
          if (b.available !== a.available) return b.available - a.available;
          return (b.likes || 0) - (a.likes || 0);
        });
  
        setWorkers(sortedWorkers);
        setFilteredWorkers(sortedWorkers);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
  
    fetchWorkers();
  }, []);

  useEffect(() => {
    let filtered = [...workers];
  
    if (cityFilter) {
      filtered = filtered.filter(worker => worker.city === cityFilter);
    }
  
    if (skillFilter) {
      const skillLower = skillFilter.toLowerCase();
      filtered = filtered.filter(worker =>
        (worker.skills || []).some(skill =>
          skill.toLowerCase().includes(skillLower))
      );
    }
  
    setFilteredWorkers(filtered);
  }, [cityFilter, skillFilter, workers]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Find Skilled Workers</h1>
          <p className="text-gray-600 mt-2">
            {filteredWorkers.length} {filteredWorkers.length === 1 ? "worker" : "workers"} available
          </p>
        </div>
        
        <div className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="text-gray-400" />
            </div>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Cities</option>
              {allCities.map((city, idx) => (
                <option key={idx} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Search by skill (e.g., Plumber)"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {filteredWorkers.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center">
          <p className="text-gray-500 text-lg">No workers found matching your criteria</p>
          <button 
            onClick={() => {
              setCityFilter("");
              setSkillFilter("");
            }}
            className="mt-4 text-blue-600 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <div 
              key={worker.id} 
              className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                worker.isActive ? "border-gray-200" : "border-gray-300 opacity-90"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      worker.isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                    }`}>
                      <PersonIcon />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">
                        {worker.name || "No Name"}
                      </h2>
                      {worker.isActive ? (
                        <span className="flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          <ActiveIcon className="mr-1" fontSize="small" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          <InactiveIcon className="mr-1" fontSize="small" />
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <LocationIcon className="mr-1" fontSize="small" />
                      <span>
                        {worker.area ? `${worker.area}, ` : ""}
                        {worker.city || "Unknown location"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {worker.available ? (
                      <AvailableIcon className="text-green-500 mr-1" fontSize="small" />
                    ) : (
                      <UnavailableIcon className="text-red-500 mr-1" fontSize="small" />
                    )}
                    <span className={worker.available ? "text-green-600" : "text-red-600"}>
                      {worker.available ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <LikeIcon className="text-blue-500 mr-1" fontSize="small" />
                    <span>{worker.likes || 0} likes</span>
                  </div>
                </div>

                {worker.skills && worker.skills.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <WorkIcon className="mr-1" fontSize="small" />
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {worker.skills.map((skill, i) => (
                        <span
                          key={i}
                          className={`inline-block text-xs px-2 py-1 rounded-full ${
                            worker.isActive 
                              ? "bg-blue-50 text-blue-800" 
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/worker/${worker.id}`)}
                  className={`mt-6 w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    worker.isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  
                >
                  {worker.isActive ? "View Profile" : "Profile Inactive"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;