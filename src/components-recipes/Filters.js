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
            <option value="Asian">Asian</option>
            <option value="Mediterranian">Mediterranian</option>
            <option value="German">German</option>
            <option value="American">American</option>
            <option value="Latin American">Latin American</option>
          </select>
        </div>

        <div className="filter">
          <label>Meal Type</label>
          <select name="mealType" onChange={handleChange}>
            <option value="Any Meal">Any Meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>

        <div className="filter">
          <label>Dietary Preferences</label>
          <select name="dietary" onChange={handleChange}>
            <option value="Any Dietary">Any Dietary</option>
            <option value="vegan">Vegan</option>
            <option value="lacto ovo vegetarian">Vegetarian</option>
            <option value="gluten free">Gluten Free</option>
            <option value="dairy free">Dairy Free</option>
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
        <button class="button" type="submit">Apply Filters</button>  
      </form>

      <button class="button" onClick={onClearFilters}>Clear Filters</button>
    </div>
  );
};

export default Filters;
