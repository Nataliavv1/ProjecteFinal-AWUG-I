import React, { useState } from "react";

function Filters({ onApplyFilters, onClearFilters }) {
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCookingTime, setSelectedCookingTime] = useState([]);

  const handleCuisineChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCuisine(value);
    onApplyFilters({
      cuisine: value,
      mealType: selectedMealType,
      dietary: selectedDietary,
      cookingTime: selectedCookingTime,
    });
  };

  const handleMealTypeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedMealType(value);
    onApplyFilters({
      cuisine: selectedCuisine,
      mealType: value,
      dietary: selectedDietary,
      cookingTime: selectedCookingTime,
    });
  };

  const handleDietaryChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedDietary(value);
    onApplyFilters({
      cuisine: selectedCuisine,
      mealType: selectedMealType,
      dietary: value,
      cookingTime: selectedCookingTime,
    });
  };

  const handleCookingTimeChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCookingTime(value);
    onApplyFilters({
      cuisine: selectedCuisine,
      mealType: selectedMealType,
      dietary: selectedDietary,
      cookingTime: value,
    });
  };

  const handleClearAll = () => {
    setSelectedCuisine([]);
    setSelectedMealType([]);
    setSelectedDietary([]);
    setSelectedCookingTime([]);
    onClearFilters();
  };

  return (
    <div className="filters-container">
      <h3>Filters</h3>
      <label>
        Cuisine
        <select multiple value={selectedCuisine} onChange={handleCuisineChange}>
          <option value="italian">Italian</option>
          <option value="indian">Indian</option>
          <option value="mexican">Mexican</option>
          <option value="chinese">Chinese</option>
          <option value="french">French</option>
        </select>
      </label>

      <label>
        Meal Type
        <select multiple value={selectedMealType} onChange={handleMealTypeChange}>
          <option value="main course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="appetizer">Appetizer</option>
          <option value="breakfast">Breakfast</option>
          <option value="soup">Soup</option>
        </select>
      </label>

      <label>
        Dietary Preferences
        <select multiple value={selectedDietary} onChange={handleDietaryChange}>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten free">Gluten Free</option>
          <option value="ketogenic">Ketogenic</option>
        </select>
      </label>

      <label>
        Cooking Time
        <select multiple value={selectedCookingTime} onChange={handleCookingTimeChange}>
          <option value="under-30">Under 30 mins</option>
          <option value="30-60">30-60 mins</option>
          <option value="over-60">Over 60 mins</option>
        </select>
      </label>

      <button onClick={handleClearAll}>Clear All Filters</button>
    </div>
  );
}

export default Filters;
