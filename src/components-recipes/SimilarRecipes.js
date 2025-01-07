import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import "./SimilarRecipes.css";

function SimilarRecipes({ ingredients }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  
  // Convertir la lista de ingredientes en un string para la búsqueda
  const ingredientList = ingredients.map(ingredient => ingredient.name).join(",");

  const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&includeIngredients=${ingredientList}&number=10`;

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);

      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          if (data.results && data.results.length > 0) {
            setRecipes(data.results); // Guardamos las recetas de la API
          } else {
            setError("No similar recipes found.");
          }
        } else {
          setError(data.message || "The recipes could not be loaded.");
        }
      } catch (error) {
        setError(error.message || "An error occurred while fetching recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [ingredients]); // Dependencia de ingredientes para hacer una nueva llamada si cambian

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const addToCartHandler = (recipe, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id);
    } else {
      addToCart(recipe);
    }
  };

  const navigate = useNavigate();

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  if (loading) {
    return <div>Loading similar recipes...</div>;
  }

  if (error) {
    return <div>{`Error: ${error}`}</div>;
  }

  return (
    <div className="similar-recipes-container">
      <h2>Similar Recipes</h2>
      <div className="similar-recipes-list">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <img src={recipe.image} alt={recipe.title} />
            <h3>{recipe.title}</h3>
            <div className="recipe-actions">
              <button
                className={`save-btn ${
                  favorites.some((fav) => fav.id === recipe.id) ? "saved" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveRecipe(recipe);
                }}
              >
                <i className={`bx ${favorites.some((fav) => fav.id === recipe.id) ? "bxs-heart" : "bx-heart"}`}></i>
              </button>
              <button
                onClick={(e) => addToCartHandler(recipe, e)}
              >
                <i className={`bx ${cart.some((item) => item.id === recipe.id) ? "bxs-plus" : "bx-plus"}`}></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarRecipes;
