import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const predefinedSkills = {
  Electrician: ["Wiring", "Fan Repair", "Light Installation"],
  Plumber: ["Tap Fixing", "Leak Repair", "Bathroom Fitting"],
  Carpenter: ["Furniture Making", "Wood Polishing", "Door Fitting"]
};

const WorkerProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    city: "",
    skills: [{ skill: "", services: [] }],
    bio: "",
    whatsapp: "",
    available: false,
    portfolio: ""
  });

  const cities = [
    "Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai",
    "Hyderabad", "Ahmedabad", "Pune", "Jaipur", "Lucknow"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSkillChange = (index, skill) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index].skill = skill;
    updatedSkills[index].services = skill
      ? predefinedSkills[skill].map(name => ({ name, selected: false, estimate: "" }))
      : [];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const toggleService = (skillIndex, serviceIndex) => {
    const updatedSkills = [...formData.skills];
    const svc = updatedSkills[skillIndex].services[serviceIndex];
    svc.selected = !svc.selected;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleEstimateChange = (skillIndex, serviceIndex, estimate) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[skillIndex].services[serviceIndex].estimate = estimate;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, { skill: "", services: [] }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skills: formData.skills.map(({ skill, services }) => ({
        skill,
        services: services
          .filter(s => s.selected)
          .map(s => ({ name: s.name, estimate: s.estimate }))
      })),
      available: formData.available,
      portfolio: formData.portfolio,
      bio: formData.bio,
      whatsapp: formData.whatsapp,
      isActive: false, // default
      likes: 0,
      reviews: [], // optional initial placeholder for future reviews
      createdAt: serverTimestamp()
    };

    try {
      const docRef = await addDoc(collection(db, "workers"), payload);
      console.log("Profile created with ID:", docRef.id);
      alert("Profile created successfully!");
      // Optionally reset form
    } catch (error) {
      console.error("Error adding profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold">Create Worker Profile</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="area"
        value={formData.area}
        onChange={handleChange}
        placeholder="Area (e.g., Andheri West)"
        className="w-full p-2 border rounded"
        required
      />
      <select
        name="city"
        value={formData.city}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      <h3 className="font-semibold pt-4">Skills and Services</h3>
      {formData.skills.map((skillObj, skillIndex) => (
        <div key={skillIndex} className="border p-3 rounded space-y-2 bg-gray-50">
          <select
            value={skillObj.skill}
            onChange={e => handleSkillChange(skillIndex, e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Skill</option>
            {Object.keys(predefinedSkills).map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          {skillObj.services.length > 0 && (
            <div className="space-y-1">
              {skillObj.services.map((svc, svcIndex) => (
                <div key={svc.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={svc.selected}
                    onChange={() => toggleService(skillIndex, svcIndex)}
                    className="h-4 w-4"
                  />
                  <span className="flex-1">{svc.name}</span>
                  {svc.selected && (
                    <input
                      type="number"
                      min="0"
                      value={svc.estimate}
                      onChange={e => handleEstimateChange(skillIndex, svcIndex, e.target.value)}
                      placeholder="Estimate (₹)"
                      className="w-32 p-2 border rounded"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addSkill}
        className="text-blue-600 font-semibold"
      >
        + Add Another Skill
      </button>

      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        placeholder="Short Bio"
        className="w-full p-2 border rounded"
        rows={3}
      />

      <input
        name="whatsapp"
        value={formData.whatsapp}
        onChange={handleChange}
        placeholder="WhatsApp Number"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="portfolio"
        value={formData.portfolio}
        onChange={handleChange}
        placeholder="Portfolio Link (optional)"
        className="w-full p-2 border rounded"
      />
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="available"
          checked={formData.available}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <span>Available for Work</span>
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit Profile
      </button>
    </form>
  );
};

export default WorkerProfileForm;
