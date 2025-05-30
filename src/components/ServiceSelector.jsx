import { useState } from "react";

const ServiceSelector = ({ selectedServices, setSelectedServices }) => {
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceEstimate, setNewServiceEstimate] = useState("");

  const addService = (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;
    
    if (selectedServices.find(s => s.name.toLowerCase() === newServiceName.toLowerCase())) {
      alert("This service already exists!");
      return;
    }

    setSelectedServices([
      ...selectedServices,
      { 
        name: newServiceName.trim(), 
        estimate: newServiceEstimate 
      }
    ]);
    setNewServiceName("");
    setNewServiceEstimate("");
  };

  const removeService = (serviceName) => {
    setSelectedServices(
      selectedServices.filter(service => service.name !== serviceName)
    );
  };

  const updateEstimate = (serviceName, estimate) => {
    setSelectedServices(
      selectedServices.map(service =>
        service.name === serviceName
          ? { ...service, estimate }
          : service
      )
    );
  };

  return (
    <div className="mb-6">
      <label className="block font-semibold mb-1">Add Your Services</label>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border px-3 py-1 rounded flex-1"
          placeholder="Service name (e.g., Plumbing Repair)"
          value={newServiceName}
          onChange={(e) => setNewServiceName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addService()}
        />
        <input
          type="number"
          className="border px-3 py-1 rounded w-24"
          placeholder="₹ Price"
          value={newServiceEstimate}
          onChange={(e) => setNewServiceEstimate(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addService()}
        />
        <button
          onClick={addService}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-4 space-y-3">
          {selectedServices.map((service) => (
            <div
              key={service.name}
              className="flex items-center gap-3 border p-2 rounded"
            >
              <span className="font-medium flex-1">{service.name}</span>
              <input
                type="number"
                placeholder="₹ Price"
                value={service.estimate}
                onChange={(e) =>
                  updateEstimate(service.name, e.target.value)
                }
                className="border px-2 py-1 rounded w-24 text-sm"
              />
              <button
                onClick={() => removeService(service.name)}
                className="text-red-500 text-lg font-bold"
                aria-label="Remove service"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;