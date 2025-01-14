import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useCart } from "../components/CartContext";
import Filters from "./Filters";
import Pagination from "./Pagination";
import "./Recipes.css";
import FastRecipesColumn from "./FastRecipesColumn";

function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState([1, 2, 3, 4, 5]);
  const [recipesPerPage, setRecipesPerPage] = useState(20);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { cart, addToCart, removeFromCart } = useCart();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  //const API_KEY = "540464a4610b4e4c9488d105323ad0af";
  const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
  const URL = `https://api.spoonacular.com/recipes/random?apiKey=${API_KEY}&number=25`;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();

        if (response.ok) {
          setRecipes(data.recipes);
          setFilteredRecipes(data.recipes);
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

    // Filtro por tipo de cocina
    if (filters.cuisine && filters.cuisine.length > 0 && filters.cuisine[0] !== "Any Cuisine") {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.cuisines &&
        recipe.cuisines.some((cuisine) => filters.cuisine.includes(cuisine))
      );
    }

    // Filtro por tipo de comida
    if (filters.mealType && filters.mealType.length > 0 && filters.mealType[0] !== "Any Meal") {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.mealType && filters.mealType.includes(recipe.mealType)
      );
    }

    // Filtro por restricciones dietéticas
    if (filters.dietary && filters.dietary.length > 0 && filters.dietary[0] !== "Any Dietary") {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.dietary &&
        recipe.dietary.some((diet) => filters.dietary.includes(diet))
      );
    }

    // Filtro por tiempo de preparación
    if (filters.cookingTime && filters.cookingTime.length > 0 && filters.cookingTime[0] !== "Any Time") {
      updatedRecipes = updatedRecipes.filter((recipe) =>
        recipe.readyInMinutes &&
        filters.cookingTime.includes(recipe.readyInMinutes)
      );
    }

    console.log("Filtros aplicados:", filters);
    console.log("Recetas filtradas:", updatedRecipes);

    setFilteredRecipes(updatedRecipes);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredRecipes(recipes);
    setCurrentPage(1);
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

  const handleLoginRedirect = () => {
    loginWithRedirect();
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`, {
      state: { fromRecipeList: true },
    });
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
    <section className="container-recipes">
      <div className="filters-container">
        <Filters onApplyFilters={handleApplyFilters} onClearFilters={handleClearFilters} />
      </div>

      {showLoginMessage && (
        <div className="login-message1">
          <p>You need to log in to save recipes or add them to your cart.</p>
          <div className="button-container1">
            <button className="login-button1" onClick={handleLoginRedirect}>
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

      <div className="recipes-layout">
        <div className="recipe-list1">
          {filteredRecipes
            .slice(
              (currentPage - 1) * recipesPerPage,
              currentPage * recipesPerPage
            )
            .map((recipe) => (
              <div
                key={recipe.id}
                className="recipe-card1"
                onClick={() => handleRecipeClick(recipe.id)}
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
                      className={`save-btn1 ${
                        favorites.some((fav) => fav.id === recipe.id)
                          ? "saved1"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveRecipe(recipe);
                      }}
                      aria-label={favorites.some((fav) => fav.id === recipe.id)
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
                      className="details-button1"
                      onClick={(e) => addToCartHandler(recipe, e)}
                      aria-label={cart.some((item) => item.id === recipe.id)
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

        <FastRecipesColumn />
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        visiblePages={visiblePages}
        setVisiblePages={setVisiblePages}
        recipes={filteredRecipes}
        recipesPerPage={recipesPerPage}
      />
    </section>
  );
}

export default RecipeList;
