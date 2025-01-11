import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "../components/CartContext";
import "./FastRecipesColumn.css";

function FastRecipesColumn() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  //const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  const API_KEY = "540464a4610b4e4c9488d105323ad0af";
  const URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=25`;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          const filteredRecipes = data.recipes
            .filter((recipe) => recipe.readyInMinutes <= 30)
            .sort((a, b) => a.readyInMinutes - b.readyInMinutes);
          setRecipes(filteredRecipes);
        } else {
          throw new Error(data.message || "The recipes could not be loaded.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      setShowLoginMessage(true);
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
      setShowLoginMessage(true);
      return;
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id);
    } else {
      addToCart(recipe);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`, {
      state: { fromRecipeList: true },
    });
  };

  const closeLoginMessage = () => {
    setShowLoginMessage(false);
  };

  if (loading) {
    return (
      <div className="loading-container3">
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container3">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <section className="container-populars3">
      <div className="home-populars-texts3">
        <h1 className="home-populars-title3">Quick & Easy Recipes</h1>
        <p className="home-populars-subtitle3">
          Discover delicious recipes you can make in 30 minutes or less. Perfect
          for busy days!
        </p>
      </div>

      <div className="recipe-list3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card3"
            onClick={() => handleRecipeClick(recipe.id)}
          >
            <div className="recipe-image3">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-image3"
              />
            </div>
            <div className="recipe-info3">
              <h3 className="carousel-title3">{recipe.title}</h3>
              <div className="carousel-meta3">
                <span>
                  <i className="bx bx-time-five"></i> {recipe.readyInMinutes}{" "}
                  min
                </span>
                <button
                  className={`save-btn3 ${
                    favorites.some((fav) => fav.id === recipe.id)
                      ? "saved3"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveRecipe(recipe);
                  }}
                  aria-label={
                    favorites.some((fav) => fav.id === recipe.id)
                      ? "Remove from saved recipes"
                      : "Save recipe"
                  }
                >
                  <i
                    className={
                      favorites.some((fav) => fav.id === recipe.id)
                        ? "bx bxs-heart"
                        : "bx bx-heart"
                    }
                  ></i>
                </button>

                <button
                  className="details-button3"
                  onClick={(e) => addToCartHandler(recipe, e)}
                  aria-label={
                    cart.some((item) => item.id === recipe.id)
                      ? "Remove from cart"
                      : "Add to cart"
                  }
                >
                  <i
                    className={
                      cart.some((item) => item.id === recipe.id)
                        ? "bx bxs-plus"
                        : "bx bx-plus"
                    }
                  ></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showLoginMessage && (
        <div className="login-message3">
          <p>You must be logged in to perform this action.</p>
          <div className="button-container3">
            <button
              className="login-button3"
              onClick={() => loginWithRedirect()}
            >
              Log In
            </button>
            <button className="close-button3" onClick={closeLoginMessage}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default FastRecipesColumn;
