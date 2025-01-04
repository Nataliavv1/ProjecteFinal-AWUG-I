// src/components-recipe/TitleAndSubtitle.js

import React from 'react';
import './Recipes.css'; // Asegúrate de que el archivo CSS esté vinculado

function TitleAndSubtitle() {
  return (
    <div className="title-container">
      <h1>RECIPES</h1>
      <h2>
        Explore Our <span className="highlighted-word">Recipes</span>
      </h2>
      <p>Find delicious recipes for every taste and occasion. Quick, easy, and tailored to your needs!</p>
    </div>
  );
}

export default TitleAndSubtitle;

