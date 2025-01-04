import React, { useState } from 'react';

function Filters({ onApplyFilters, onClearFilters }) {
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCookingTime, setSelectedCookingTime] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);

  const handleCuisineChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCuisine(value);
    onApplyFilters({ cuisine: value || [] });
  };

  const handleMealTypeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedMealType(value);
    onApplyFilters({ mealType: value || [] });
  };

  const handleDietaryChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDietary(value);
    onApplyFilters({ dietary: value || [] });
  };

  const handleCookingTimeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCookingTime(value);
    onApplyFilters({ cookingTime: value || [] });
  };

  const handleDifficultyChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedDifficulty(value);
    onApplyFilters({ difficulty: value || [] });
  };

  const handleClearAll = () => {
    // Reset all the selected filter values
    setSelectedCuisine([]);
    setSelectedMealType([]);
    setSelectedDietary([]);
    setSelectedCookingTime([]);
    setSelectedDifficulty([]);
    onClearFilters();  // Notify the parent to clear all filters
  };

  return (
    <div className="filters-container">
      <h3>Filters</h3>
      {/* Cuisine Filter */}
      <label>
        Cuisine
        <select multiple value={selectedCuisine} onChange={handleCuisineChange}>
          <option value="italian">Italian</option>
          <option value="mediterranean">Mediterranean</option>
          <option value="indian">Indian</option>
          <option value="chinese">Chinese</option>
          <option value="mexican">Mexican</option>
        </select>
      </label>

      {/* Meal Type Filter */}
      <label>
        Meal Type
        <select multiple value={selectedMealType} onChange={handleMealTypeChange}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </label>

      {/* Dietary Filter */}
      <label>
        Dietary
        <select multiple value={selectedDietary} onChange={handleDietaryChange}>
          <option value="low-calorie">Low-Calorie</option>
          <option value="vegan">Vegan</option>
          <option value="gluten-free">Gluten Free</option>
          <option value="dairy-free">Dairy Free</option>
        </select>
      </label>

      {/* Cooking Time Filter */}
      <label>
        Cooking Time (minutes)
        <select multiple value={selectedCookingTime} onChange={handleCookingTimeChange}>
          <option value="under-30">Under 30 mins</option>
          <option value="30-60">30-60 mins</option>
          <option value="over-60">Over 60 mins</option>
        </select>
      </label>

      {/* Difficulty Level Filter */}
      <label>
        Difficulty Level
        <select multiple value={selectedDifficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>

      {/* Button to clear all filters */}
      <button onClick={handleClearAll} className="clear-all-button">
        Clear All Filters
      </button>
    </div>
  );
}

export default Filters;
