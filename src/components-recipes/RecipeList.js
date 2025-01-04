import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext"; // Importar el contexto
import { useAuth0 } from "@auth0/auth0-react"; // Importar el hook useAuth0
import { useCart } from "../components/CartContext"; // Importar el hook del carrito
import Filters from "./Filters"; // Importamos el componente de filtros
import Pagination from "./Pagination"; // Importamos el componente de paginación
import "./Recipes.css";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);
  const [recipesPerPage, setRecipesPerPage] = useState(20); // Número de recetas por página
  const [showLoginMessage, setShowLoginMessage] = useState(false); // Estado para mostrar el mensaje de login
  const [redirectToLogin, setRedirectToLogin] = useState(false); // Estado para controlar el redireccionamiento

  const { favorites, addFavorite, removeFavorite } = useFavorites(); // Usa el contexto de favoritos
  const { cart, addToCart, removeFromCart } = useCart(); // Usamos el hook de carrito
  const { isAuthenticated, loginWithRedirect } = useAuth0(); // Usamos isAuthenticated para saber si el usuario está logueado
  const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  const URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=4`; // Obtener 100 recetas

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          setRecipes(data.recipes);
          setFilteredRecipes(data.recipes); // Inicializamos con todas las recetas
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

  const handleApplyFilters = (filters) => {
    let updatedRecipes = [...recipes];

    // Comprobamos que el valor existe antes de aplicar el filtro
    if (filters.cuisine && filters.cuisine.length > 0) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.cuisines && recipe.cuisines.some(cuisine => filters.cuisine.includes(cuisine))
      );
    }

    if (filters.mealType && filters.mealType.length > 0) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.mealType && filters.mealType.includes(recipe.mealType)
      );
    }

    if (filters.dietary && filters.dietary.length > 0) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.dietary && recipe.dietary.some(diet => filters.dietary.includes(diet))
      );
    }

    if (filters.cookingTime && filters.cookingTime.length > 0) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.readyInMinutes && filters.cookingTime.includes(recipe.readyInMinutes)
      );
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.difficulty && filters.difficulty.includes(recipe.difficulty)
      );
    }

    setFilteredRecipes(updatedRecipes);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  const handleClearFilters = () => {
    // Reset the filters to default
    setFilteredRecipes(recipes);
    setCurrentPage(1); // Reset to first page
  };

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
        <Filters
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters} // Pasa la función para borrar los filtros
        />
        
        {showLoginMessage && (
          <div className="login-message1">
            <p>You need to log in to save recipes or add them to your cart.</p>
            <div className="button-container1">
              <button
                className="login-button1"
                onClick={handleLoginRedirect} // Solo redirige cuando el usuario hace clic en el botón
              >
                Log In
              </button>
              <button
                className="close-button1"
                onClick={() => setShowLoginMessage(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="recipe-list1">
          {filteredRecipes.slice((currentPage - 1) * recipesPerPage, currentPage * recipesPerPage).map((recipe) => (
            <div
              key={recipe.id}
              className="recipe-card1"
              onClick={() => navigate(`/recipe/${recipe.id}`, { state: { fromRecipes: true } })}
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
                  <span>
                    <i className="bx bx-time-five"></i>{" "}
                    {recipe.readyInMinutes} min
                  </span>
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
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          visiblePages={visiblePages}
          setVisiblePages={setVisiblePages}
          recipes={filteredRecipes}
          recipesPerPage={recipesPerPage}
        />
      </div>
    </section>
  );
}

export default RecipeList;
