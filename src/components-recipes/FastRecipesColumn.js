import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../components/FavoritesContext'; // Importar contexto de favoritos
import { useCart } from '../components/CartContext'; // Importar el hook de carrito
import { useAuth0 } from '@auth0/auth0-react'; // Importar hook de autenticación
import "./FastRecipesColumn.css"; // Asegúrate de tener la hoja de estilos correspondiente

function FastRecipesColumn() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false); // Estado para mostrar el mensaje de login

  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Usamos el contexto de favoritos
  const { cart, addToCart, removeFromCart } = useCart(); // Usamos el hook del carrito
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Usamos isAuthenticated para saber si el usuario está logueado

  const navigate = useNavigate();

  useEffect(() => {
    const API_KEY = "540464a4610b4e4c9488d105323ad0af"; // API key
    const URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=16`;

    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          // Filtrar las recetas con tiempo de preparación entre 0 y 30 minutos
          const filteredRecipes = data.recipes.filter(
            (recipe) => recipe.readyInMinutes >= 0 && recipe.readyInMinutes <= 30
          );
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

  const addToCartHandler = (recipe, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar mensaje si no está logueado
      return;
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id); // Si ya está en el carrito, lo elimina
    } else {
      addToCart(recipe); // Si no está, lo agrega al carrito
    }
  };

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar mensaje si no está logueado
      return;
    }

    if (favorites.some((fav) => fav.id === recipe.id)) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  const handleLoginRedirect = () => {
    loginWithRedirect(); // Redirige a la página de login cuando el usuario hace clic
  };

  const handleCloseLoginMessage = () => {
    setShowLoginMessage(false); // Cierra el mensaje
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading fastest recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <section className="container-populars">
      <div className="home-populars-texts">
        <h3 className="home-populars-title">Fastest Recipes</h3>
        <p className="home-populars-subtitle">
          Find quick and easy recipes to satisfy your hunger in no time!
        </p>
      </div>

      {showLoginMessage && (
        <div className="login-message">
          <p>You need to log in to save recipes or add them to your cart.</p>
          <div className="button-container">
            <button
              className="login-button"
              onClick={handleLoginRedirect}
            >
              Log In
            </button>
            <button
              className="close-button"
              onClick={handleCloseLoginMessage}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="carousel-multiple">
        <div className="carousel-track">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="carousel-item"
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              >
                <div className="recipe-card">
                  <div className="recipe-image1">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="carousel-image"
                    />
                  </div>
                  <div className="recipe-info">
                    <h4 className="carousel-title">{recipe.title}</h4>
                    <div className="carousel-meta">
                      <span>
                        <i className="bx bx-time-five"></i> {recipe.readyInMinutes} min
                      </span>
                      <span>
                        <i
                          className={favorites.some((fav) => fav.id === recipe.id) ? "bx bxs-heart" : "bx bx-heart"}
                        ></i>
                      </span>
                      <span>
                        <i
                          className={cart.some((item) => item.id === recipe.id) ? "bx bxs-plus" : "bx bx-plus"}
                        ></i>
                      </span>
                    </div>
                    <div className="carousel-actions">
                      <button
                        className={`save-btn ${
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
                        className="details-button"
                        onClick={(e) => addToCartHandler(recipe, e)} // Llama a la función para agregar/eliminar del carrito
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
            ))
          ) : (
            <p>No recipes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FastRecipesColumn;