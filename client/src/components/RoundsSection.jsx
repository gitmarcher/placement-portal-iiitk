import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";

const RoundsSection = ({ formData, setRounds }) => {
  const [rounds, setLocalRounds] = useState(formData.rounds || []);

  useEffect(() => {
    setLocalRounds(formData.rounds || []);
  }, [formData.rounds]);

  const addRound = () => {
    const newRounds = [
      ...rounds,
      { round_number: "", round_name: "", description: "" }
    ];
    setLocalRounds(newRounds);
    setRounds(newRounds);
  };

  const updateRound = (index, field, value) => {
    const updatedRounds = rounds.map((round, i) =>
      i === index ? { ...round, [field]: value } : round
    );
    setLocalRounds(updatedRounds);
    setRounds(updatedRounds);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-medium text-[#EB3030] mb-3">Rounds</h2>
      <div className="space-y-3">
        {rounds.map((round, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row gap-2 bg-[#FDE6E6] rounded-md p-2"
          >
            <input
              name="round_number"
              value={round.round_number || ""}
              onChange={(e) =>
                updateRound(index, "round_number", e.target.value)
              }
              placeholder="No."
              className="w-full md:w-20 p-2 border border-[#DDDDDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB3030] bg-white text-gray-700 placeholder-[#DDDDDD] text-sm"
            />
            <input
              name="round_name"
              value={round.round_name || ""}
              onChange={(e) => updateRound(index, "round_name", e.target.value)}
              placeholder="Name"
              className="w-full md:w-40 p-2 border border-[#DDDDDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB3030] bg-white text-gray-700 placeholder-[#DDDDDD] text-sm"
            />
            <input
              name="description"
              value={round.description || ""}
              onChange={(e) =>
                updateRound(index, "description", e.target.value)
              }
              placeholder="Description"
              className="w-full p-2 border border-[#DDDDDD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB3030] bg-white text-gray-700 placeholder-[#DDDDDD] text-sm"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addRound}
        className="mt-4 flex items-center gap-1.5 px-3 py-1.5 bg-[#EB3030] text-white text-sm font-medium rounded-md hover:bg-[#D00000] focus:outline-none focus:ring-2 focus:ring-[#EB3030] transition-colors duration-200"
      >
        <FaPlus className="w-3 h-3" />
        Add Round
      </button>
    </div>
  );
};

export default RoundsSection;
