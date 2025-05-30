import { useState } from "react";

const predefinedSkills = [
  // Healthcare & Medicine
  "Doctor", "Nurse", "Dentist", "Pharmacist", "Surgeon", "Psychiatrist", "Pediatrician", 
  "Veterinarian", "Optometrist", "Dietitian", "Paramedic", "Midwife", "Radiologist",

//  Engineering & Technology 
  "Software Engineer", "Mechanical Engineer", "Electrical Engineer", "Civil Engineer", 
  "Aerospace Engineer", "Biomedical Engineer", "Chemical Engineer", "Data Scientist", 
  "AI Specialist", "Robotics Engineer", "Cybersecurity Analyst", "Network Engineer",

  // # === Business & Finance ===
  "Accountant", "Financial Analyst", "Investment Banker", "Auditor", "Economist", 
  "Stockbroker", "Actuary", "Risk Manager", "Tax Consultant", "Business Analyst", 
  "Marketing Manager", "HR Manager", "Supply Chain Manager", "Entrepreneur",

  // # === Creative & Arts ===
  "Graphic Designer", "Animator", "Illustrator", "Musician", "Singer", "Actor", 
  "Film Director", "Screenwriter", "Photographer", "Painter", "Sculptor", 
  "Fashion Designer", "Interior Designer", "Architect", "Game Designer",

  // # === Education & Academia ===
  "Teacher", "Professor", "Researcher", "Librarian", "Tutor", "Education Consultant", 
  "Curriculum Developer", "School Principal", "Linguist", "Historian",

  // # === Legal & Law Enforcement ===
  "Lawyer", "Judge", "Paralegal", "Police Officer", "Detective", "Forensic Scientist", 
  "Coroner", "Private Investigator", "Probation Officer", "Immigration Officer",

  // # === Skilled Trades & Labor ===
  "Electrician", "Plumber", "Carpenter", "Welder", "Mason", "Blacksmith", "Mechanic", 
  "HVAC Technician", "Construction Worker", "Chef", "Baker", "Tailor", "Jeweler",

  // # === Social Services & Non-Profit ===
  "Social Worker", "Counselor", "Therapist", "NGO Worker", "Humanitarian Aid Worker", 
  "Community Manager", "Rehabilitation Specialist", "Childcare Worker",

  // # === Science & Research ===
  "Biologist", "Chemist", "Physicist", "Astronomer", "Geologist", "Meteorologist", 
  "Marine Biologist", "Geneticist", "Archaeologist", "Environmental Scientist",

  // # === Media & Communication ===
  "Journalist", "Reporter", "Editor", "PR Specialist", "Content Creator", "Copywriter", 
  "Translator", "Interpreter", "Broadcaster", "Podcaster", "Voice Actor",

  // # === Transportation & Logistics ===
  "Pilot", "Ship Captain", "Truck Driver", "Delivery Driver", "Logistics Manager", 
  "Flight Attendant", "Air Traffic Controller", "Railway Engineer", "Taxi Driver",

  // # === Agriculture & Environment ===
  "Farmer", "Agricultural Engineer", "Forester", "Fisherman", "Horticulturist", 
  "Environmental Consultant", "Wildlife Biologist", "Park Ranger",

  // # === Government & Public Service ===
  "Politician", "Diplomat", "Military Officer", "Firefighter", "Postal Worker", 
  "Urban Planner", "Public Administrator", "Customs Officer",

  // # === Sports & Fitness ===
  "Athlete", "Coach", "Personal Trainer", "Sports Physiotherapist", "Referee", 
  "Sports Agent", "Gym Instructor", "Yoga Teacher",

  // # === Hospitality & Tourism ===
  "Hotel Manager", "Tour Guide", "Travel Agent", "Event Planner", "Bartender", 
  "Waiter/Waitress", "Spa Therapist", "Cruise Director",

  // # === Religion & Spirituality ===
  "Priest", "Imam", "Rabbi", "Monk", "Yogi", "Spiritual Counselor", "Meditation Teacher",

  // # === Domestic & Personal Services ===
  "Maid", "Housekeeper", "Nanny", "Butler", "Personal Assistant", "Caregiver", 
  "Laundry Worker", "Gardener", "Chauffeur", "Security Guard",

  // # === Miscellaneous & Emerging Fields ===
  "Ethical Hacker", "Drone Operator", "Cryptocurrency Analyst", "Space Tourism Guide", 
  "Virtual Reality Developer", "Sustainability Consultant", "Crisis Manager"
]

const SkillsSelector = ({ selectedSkills, setSelectedSkills }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSkills = predefinedSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const addSkill = (skill) => {
    setSelectedSkills([...selectedSkills, skill]);
    setSearchTerm("");
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Skills</label>
      <input
        type="text"
        className="border px-3 py-1 rounded w-full mb-2"
        placeholder="Search skill..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && filteredSkills.length > 0 && (
        <ul className="border rounded bg-white max-h-40 overflow-y-auto shadow-md">
          {filteredSkills.map((skill) => (
            <li
              key={skill}
              className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
              onClick={() => addSkill(skill)}
            >
              {skill}
            </li>
          ))}
        </ul>
      )}

      {selectedSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="text-red-500 font-bold ml-1"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillsSelector;
