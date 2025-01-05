import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useFavorites } from "../components/FavoritesContext"; // Importar el contexto de favoritos
import { useCart } from "../components/CartContext"; // Importar el hook del carrito
import "../components-recipes/Recipes.css";
import Footer from "../components/Footer";

function SearchResults() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda
  const [showLoginMessage, setShowLoginMessage] = useState(false); // Estado para mostrar el mensaje de login

  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Usamos el contexto de favoritos
  const { cart, addToCart, removeFromCart } = useCart(); // Usamos el hook de carrito
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Usamos isAuthenticated para saber si el usuario está logueado

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  useEffect(() => {
    const fetchRecipes = async () => {
      setSearchTerm(query); // Establecer el término de búsqueda

      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=540464a4610b4e4c9488d105323ad0af`);
        const data = await response.json();

        if (response.ok) {
          setRecipes(data.results || []); // Asegúrate de que siempre sea un arreglo
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
  }, [query]); // El término de búsqueda cambia si se actualiza el query

  const addToCartHandler = (recipe, e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar el mensaje si no está logueado
      return; // No redirigir hasta que el usuario haga clic en "Log In"
    }

    if (cart.some((item) => item.id === recipe.id)) {
      removeFromCart(recipe.id); // Si ya está en el carrito, lo elimina
    } else {
      addToCart(recipe); // Si no está, lo agrega al carrito
    }
  };

  const toggleSaveRecipe = (recipe) => {
    if (!isAuthenticated) {
      setShowLoginMessage(true); // Mostrar el mensaje si no está logueado
      return; // No redirigir hasta que el usuario haga clic en "Log In"
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

  const handleRecipeClick = (recipe) => {
    // Limpiar el campo de búsqueda cuando se hace clic en una receta
    setSearchTerm(""); // Esto limpiará el campo de búsqueda
    navigate(`/recipe/${recipe.id}`, { state: { fromSearchResults: true } });
  };

  if (loading) {
    return (
      <div className="loading-container1">
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container1">
        <p>{`Error: ${error}`}</p>
      </div>
    );
  }

  return (
    <section className="container-populars1">
      <div className="home-container-populars1">
        {/* Mensaje de Login */}
        {showLoginMessage && (
          <div className="login-message1">
            <p>You need to log in to save recipes or add them to your cart.</p>
            <div className="button-container1">
              <button
                className="login-button1"
                onClick={handleLoginRedirect} // Solo redirige cuando el usuario hace clic
              >
                Log In
              </button>
              <button
                className="close-button1"
                onClick={handleCloseLoginMessage} // Cierra el mensaje
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="recipe-list1">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card1"
                onClick={() => handleRecipeClick(recipe)} // Limpiar búsqueda al hacer clic
              >
                <div className="recipe-image1">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image1"
                  />
                </div>
                <div className="recipe-info1">
                  <h3 className="carousel-title1">{recipe.title}</h3>
                  <div className="carousel-meta1">
                    {recipe.readyInMinutes != null ? (
                      <span>
                        <i className="bx bx-time-five"></i>{" "}
                        {recipe.readyInMinutes} min
                      </span>
                    ) : (
                      <span>Time not available</span> // Si no hay tiempo, mostramos un mensaje
                    )}
                    <button
                      className={`save-btn1 ${favorites.some((fav) => fav.id === recipe.id) ? "saved1" : ""}`}
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
                        className={favorites.some((fav) => fav.id === recipe.id)
                          ? "bx bxs-heart"
                          : "bx bx-heart"
                        }
                      ></i>
                    </button>

                    <button
                      className="details-button1"
                      onClick={(e) => addToCartHandler(recipe, e)} // Llama a la función para agregar/eliminar del carrito
                      aria-label={
                        cart.some((item) => item.id === recipe.id)
                          ? "Remove from cart"
                          : "Add to cart"
                      }
                    >
                      <i
                        className={cart.some((item) => item.id === recipe.id)
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
      {/* Añadimos el componente Footer */}
      <Footer />
    </section>
  );
}

export default SearchResults;
