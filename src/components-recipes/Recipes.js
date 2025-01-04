// src/components-recipes/Recipes.js

import React, { useEffect, useState } from 'react';
import { useFavorites } from '../components/FavoritesContext';
import { useCart } from '../components/CartContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import TitleAndSubtitle from './TitleAndSubtitle';
import RecipeList from './RecipeList';
import Filters from './Filters';
import Pagination from './Pagination';
import FastRecipesColumn from './FastRecipesColumn';
import Footer from "../components/Footer";
import './Recipes.css';

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);
  const recipesPerPage = 6;
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const API_KEY = 'd0fba68ef5204602ac929844f28b7d5f';
  const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=100`;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          setRecipes(data.results);
          setFilteredRecipes(data.results); // Al inicio, no hay filtro, por lo que mostramos todas las recetas
        } else {
          throw new Error(data.message || 'The recipes could not be loaded.');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const addToCartHandler = (recipe, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return loginWithRedirect();
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id);
    } else {
      addToCart(recipe);
    }
  };

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      return loginWithRedirect();
    }

    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const onApplyFilters = (filters) => {
    let filteredData = [...recipes];

    if (filters.cuisine && filters.cuisine.length > 0) {
      filteredData = filteredData.filter(recipe => filters.cuisine.includes(recipe.cuisine));
    }
    if (filters.mealType && filters.mealType.length > 0) {
      filteredData = filteredData.filter(recipe => filters.mealType.includes(recipe.mealType));
    }
    if (filters.dietary && filters.dietary.length > 0) {
      filteredData = filteredData.filter(recipe => filters.dietary.includes(recipe.dietary));
    }
    if (filters.cookingTime && filters.cookingTime.length > 0) {
      filteredData = filteredData.filter(recipe => filters.cookingTime.includes(recipe.readyInMinutes));
    }
    if (filters.difficulty && filters.difficulty.length > 0) {
      filteredData = filteredData.filter(recipe => filters.difficulty.includes(recipe.difficulty));
    }

    setFilteredRecipes(filteredData);
  };

  // Filtrar las recetas más rápidas
  const fastestRecipes = recipes
    .filter((recipe) => recipe.readyInMinutes !== undefined)
    .sort((a, b) => a.readyInMinutes - b.readyInMinutes)
    .slice(0, 5);

  if (loading) {
    return <div className="loading-container">Loading recipes...</div>;
  }

  if (error) {
    return <div className="error-container">{`Error: ${error}`}</div>;
  }

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  return (
    <section className="container-recipes">
      <div className="main-content">
        <TitleAndSubtitle />
        <RecipeList
          recipes={currentRecipes}
          addToCartHandler={addToCartHandler}
          toggleSaveRecipe={toggleSaveRecipe}
          favorites={favorites}
          cart={cart}
        />
      </div>

      <FastRecipesColumn fastestRecipes={fastestRecipes} />
      {/* Añadimos el componente Footer */}
      <Footer />
    </section>
  );
}

export default Recipes;
