import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useFavorites } from "../components/FavoritesContext"; // Contexto de favoritos
import { useCart } from "../components/CartContext"; // Hook del carrito
import "../components/SearchResults.css";

function SearchResults() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  useEffect(() => {
    const previousSearchResults = location.state?.searchResults;
    
    if (previousSearchResults) {
      // Si existen resultados anteriores en el estado de navegación, usarlos
      setRecipes(previousSearchResults);
      setLoading(false);
    } else if (query) {
      // Si hay un término de búsqueda en la URL, buscar recetas
      fetchRecipes(query);
    } else {
      setLoading(false); // Si no hay término de búsqueda, no hacer nada más
    }
  }, [query, location.state]);

  const fetchRecipes = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${searchQuery}&addRecipeInformation=true&apiKey=540464a4610b4e4c9488d105323ad0af`
      );
      const data = await response.json();

      if (response.ok) {
        setRecipes(data.results || []);
      } else {
        throw new Error(data.message || "The recipes could not be loaded.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandler = (recipe, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar mensaje de login si no está autenticado
      return;
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id);
    } else {
      addToCart(recipe);
    }
  };

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar mensaje de login si no está autenticado
      return;
    }

    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handleLoginRedirect = () => {
    loginWithRedirect();
  };

  const handleCloseLoginMessage = () => {
    setShowLoginMessage(false);
  };

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe.id}`, {
      state: {
        fromSearchResults: true,
        searchQuery: query,
        searchResults: recipes,
      },
    });
  };

  if (loading) {
    return (
      <div className="loading-container2">
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container2">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <section className="container-populars2">
      <div className="home-container-populars2">
        {/* Mensaje de Login */}
        {showLoginMessage && (
          <div className="login-message2">
            <p>You need to log in to save recipes or add them to your cart.</p>
            <div className="button-container2">
              <button
                className="login-button2"
                onClick={handleLoginRedirect}
              >
                Log In
              </button>
              <button
                className="close-button2"
                onClick={handleCloseLoginMessage}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="recipe-list2">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card2"
                onClick={() => handleRecipeClick(recipe)}
              >
                <div className="recipe-image2">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image2"
                  />
                </div>
                <div className="recipe-info2">
                  <h3 className="carousel-title2">{recipe.title}</h3>
                  <div className="carousel-meta2">
                    {recipe.readyInMinutes != null ? (
                      <span>
                        <i className="bx bx-time-five"></i>{" "}
                        {recipe.readyInMinutes} min
                      </span>
                    ) : (
                      <span>Time not available</span>
                    )}
                    <button
                      className={`save-btn2 ${
                        favorites.some((fav) => fav.id === recipe.id)
                          ? "saved2"
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
                      className="details-button2"
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
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchResults;
