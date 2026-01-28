"use client";

import { useState } from "react";
import { MCQ } from "./mcq";

/**
 * Example usage of the MCQ component
 * This demonstrates how to use the MCQ component with state management
 */
export function MCQExample() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [crossedOptions, setCrossedOptions] = useState({});

  const question = "In a lean environment, the decoupling point CANNOT be located at which of the following points?";
  
  const options = [
    { id: "1", text: "Final assembly point" },
    { id: "2", text: "A point at the beginning of the assembly process" },
    { id: "3", text: "Suppliers" },
    { id: "4", text: "Finished goods inventory" },
  ];

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
    console.log("Selected option:", optionId);
  };

  const handleOptionCross = (optionId, isCrossed) => {
    setCrossedOptions((prev) => ({
      ...prev,
      [optionId]: isCrossed,
    }));
    console.log(`Option ${optionId} ${isCrossed ? "crossed" : "uncrossed"}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-secondary rounded-xl">
      <MCQ
        question={question}
        options={options}
        selectedOptionId={selectedOption}
        onOptionSelect={handleOptionSelect}
        onOptionCross={handleOptionCross}
        crossedOptions={crossedOptions}
      />
    </div>
  );
}
