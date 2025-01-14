import React, { useState } from "react";

const Filters = ({ onApplyFilters, onClearFilters }) => {
  const [filters, setFilters] = useState({
    cuisine: ["Any Cuisine"],
    mealType: ["Any Meal"],
    dietary: ["Any Dietary"],
    cookingTime: ["Any Time"],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: Array.isArray(prevFilters[name])
        ? [value]
        : prevFilters[name] === value
        ? []
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters);
  };

  return (
    <div className="filters-form">
      <form onSubmit={handleSubmit}>
        <div className="filter">
          <label>Cuisine</label>
          <select name="cuisine" onChange={handleChange}>
            <option value="Any Cuisine">Any Cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Indian">Indian</option>
            <option value="Mexican">Mexican</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

        <div className="filter">
          <label>Meal Type</label>
          <select name="mealType" onChange={handleChange}>
            <option value="Any Meal">Any Meal</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div>

        <div className="filter">
          <label>Dietary Preferences</label>
          <select name="dietary" onChange={handleChange}>
            <option value="Any Dietary">Any Dietary</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Gluten Free">Gluten Free</option>
          </select>
        </div>

        <div className="filter">
          <label>Cooking Time</label>
          <select name="cookingTime" onChange={handleChange}>
            <option value="Any Time">Any Time</option>
            <option value="Under 30 min">Under 30 min</option>
            <option value="30-60 min">30-60 min</option>
            <option value="Over 60 min">Over 60 min</option>
          </select>
        </div>

        <button type="submit">Apply Filters</button>
      </form>

      <button onClick={onClearFilters}>Clear Filters</button>
    </div>
  );
};

export default Filters;
