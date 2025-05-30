import { useState, useEffect } from "react";
import cityList from "../Json/cities.json"; // adjust the path if needed

const CitySelector = ({ selectedCity, setSelectedCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCities(cityList);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectCity = (city) => {
    setSelectedCity(city);
    setSearchTerm("");
  };

  const clearSelection = () => {
    setSelectedCity("");
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Select City</label>
      <input
        type="text"
        className="border px-3 py-1 rounded w-full mb-2"
        placeholder="Search city..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && filteredCities.length > 0 && (
        <ul className="border rounded bg-white max-h-40 overflow-y-auto shadow-md">
          {filteredCities.map((city) => (
            <li
              key={city}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => selectCity(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {selectedCity && (
        <div className="mt-3 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {selectedCity}
          </span>
          <button
            onClick={clearSelection}
            className="text-red-500 font-bold text-lg leading-none"
            aria-label="Clear selected city"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default CitySelector;
