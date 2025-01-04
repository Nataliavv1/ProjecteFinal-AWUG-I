// src/components-recipe/FastRecipesColumn.js

import React from 'react';
import { useNavigate } from 'react-router-dom';

function FastRecipesColumn({ fastestRecipes }) {
  const navigate = useNavigate();

  return (
    <aside className="fast-recipes">
      <h3>Fastest Recipes</h3>
      <ul>
        {fastestRecipes.map((recipe) => (
          <li
            key={recipe.id}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
            className="fast-recipe-card"
          >
            <img src={recipe.image} alt={recipe.title} />
            <span>{recipe.title}</span>
            <span>
              <i className="bx bx-time-five"></i> {recipe.readyInMinutes} min
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default FastRecipesColumn;
