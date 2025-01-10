import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext"; // Contexto de favoritos
import { useAuth0 } from "@auth0/auth0-react"; // Hook de autenticación
import { useCart } from "../components/CartContext"; // Contexto de carrito
import "./SimilarRecipes.css"; // Cambié el nombre del archivo CSS a SimilarRecipes4.css

function SimilarRecipes({ ingredients }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchSimilarRecipes = async () => {
      try {
        const ingredientList = ingredients
          .map((ingredient) => ingredient.name)
          .join(",");
        const URL = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientList}&number=16`;
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          // Solicitar detalles completos para cada receta
          const recipesWithDetails = await Promise.all(
            data.map(async (recipe) => {
              const detailsResponse = await fetch(
                `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
              );
              const detailsData = await detailsResponse.json();
              return {
                ...recipe,
                readyInMinutes: detailsData.readyInMinutes, // Agregar tiempo de cocción
              };
            })
          );
          setRecipes(recipesWithDetails);
        } else {
          throw new Error(data.message || "The recipes could not be loaded.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (ingredients && ingredients.length > 0) {
      fetchSimilarRecipes();
    }
  }, [ingredients]);

  const nextRecipes = () => {
    if (currentIndex + 4 < recipes.length) {
      setCurrentIndex((prevIndex) => Math.min(prevIndex + 4, recipes.length - 4));
    }
  };

  const prevRecipes = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 4, 0));
    }
  };

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

  if (loading) {
    return (
      <div className="loading-container4">
        <p>Loading similar recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container4">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <section className="container-populars4 no-index-padding">
      <div className="home-container-populars4">
        <div className="home-populars-texts4">
          <h1 className="home-populars-title4">Similar Recipes</h1>
          <p className="home-populars-subtitle4">
            Explore recipes similar to the one you're viewing.
          </p>
        </div>

        {showLoginMessage && (
          <div className="login-message4">
            <p>You need to log in to save recipes or add them to your cart.</p>
            <div className="button-container4">
              <button className="login-button4" onClick={loginWithRedirect}>
                Log In
              </button>
              <button
                className="close-button4"
                onClick={() => setShowLoginMessage(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="carousel-multiple4">
          <button
            className="carousel-btn4 prev4"
            onClick={prevRecipes}
            disabled={currentIndex === 0}
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          <div className="carousel-track4">
            {recipes.slice(currentIndex, currentIndex + 4).map((recipe) => (
              <div
                key={recipe.id}
                className="carousel-item4"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <div className="recipe-card4">
                  <div className="recipe-image14">
                    <img
                      src={`https://spoonacular.com/recipeImages/${recipe.id}-480x360.jpg`}
                      alt={recipe.title}
                      className="carousel-image4"
                    />
                  </div>
                  <div className="recipe-info4">
                    <h3 className="carousel-title4">{recipe.title}</h3>

                    <div className="carousel-meta4">
                      {/* Mostrar el tiempo de cocción si está disponible */}
                      <span>
                        {recipe.readyInMinutes ? (
                          <>
                            <i className="bx bx-time-five"></i> {recipe.readyInMinutes} minutes
                          </>
                        ) : (
                          "Time not available"
                        )}
                      </span>

                      <button
                        className={`save-btn4 ${
                          favorites.some((fav) => fav.id === recipe.id)
                            ? "saved"
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
                        className="details-button4"
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
              </div>
            ))}
          </div>

          <button
            className="carousel-btn4 next4"
            onClick={nextRecipes}
            disabled={currentIndex + 4 >= recipes.length}
          >
            <i className="bx bx-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}

export default SimilarRecipes;

