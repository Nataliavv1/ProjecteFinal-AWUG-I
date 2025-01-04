// HomePopulars.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext"; // Importar el contexto
import { useAuth0 } from "@auth0/auth0-react"; // Importar el hook useAuth0
import { useCart } from "../components/CartContext"; // Importar el hook del carrito
import "./Home-Populars.css";

function HomePopulars() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoginMessage, setShowLoginMessage] = useState(false); // Estado para mostrar el mensaje

  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Usa el contexto de favoritos
  const { cart, addToCart, removeFromCart } = useCart(); // Usamos el hook de carrito
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Usamos isAuthenticated para saber si el usuario está logueado
  const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  const URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=16`;

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          setRecipes(data.recipes);
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
      setShowLoginMessage(true); // Mostrar mensaje si no está logueado
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
      <div className="loading-container">
        <p>Loading recipes...</p>
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
    <section className="container-populars no-index-padding">
      <div className="home-container-populars">
        <div className="home-populars-texts">
          <h1 className="home-populars-title">
          Discover some of our recipes
          </h1>
          <p className="home-populars-subtitle">
            Discover tasty recipes ready in minutes. Cook easy, fast, and full of flavor. Perfect for busy days or last-minute meals.
          </p>
        </div>

        {showLoginMessage && (
          <div className="login-message">
            <p>You need to log in to save recipes or add them to your cart.</p>
            <div className="button-container">
              <button
                className="login-button"
                onClick={loginWithRedirect}
              >
                Log In
              </button>
              <button
                className="close-button"
                onClick={() => setShowLoginMessage(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="carousel-multiple">
          <button
            className="carousel-btn prev"
            onClick={prevRecipes}
            disabled={currentIndex === 0}
          >
            <i className="bx bx-chevron-left"></i>
          </button>

          <div className="carousel-track">
            {recipes.slice(currentIndex, currentIndex + 4).map((recipe) => (
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
                    <h3 className="carousel-title">{recipe.title}</h3>

                    <div className="carousel-meta">
                      <span>
                        <i className="bx bx-time-five"></i>{" "}
                        {recipe.readyInMinutes} min
                      </span>

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

                      {/* Botón para carrito usando detalles-button */}
                      <button
                        className="details-button"
                        onClick={(e) => {
                          addToCartHandler(recipe, e); // Llama a la función para agregar/eliminar del carrito
                        }}
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
            className="carousel-btn next"
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

export default HomePopulars;
