import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import DietaryIcon from "../components/DietaryIcon"; // Componente de íconos
import "boxicons/css/boxicons.min.css"; // Asegúrate de importar Boxicons
import "./HomeDetails.css";

function HomeDetails() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { cart, addToCart, removeFromCart } = useCart();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const navigate = useNavigate();
    const location = useLocation();  // Hook para obtener la ubicación actual

    const [expandedSections, setExpandedSections] = useState({
        description: true, // Esta sección está abierta por defecto
        ingredients: false,
        nutritionalInfo: false,
        additionalInfo: false,
        dietaryRestrictions: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(
                    `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=d0fba68ef5204602ac929844f28b7d5f`
                );
                const data = await response.json();

                if (response.ok) {
                    setRecipe(data);
                } else {
                    throw new Error(data.message || "Recipe not found.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    const toggleSaveRecipe = () => {
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

    const addToCartHandler = (e) => {
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const nutritionalInfo =
        recipe.nutrition && recipe.nutrition.nutrients ? recipe.nutrition.nutrients : [];

    // Función para manejar el botón de "Back"
    const handleBackButtonClick = () => {
        // Verificamos si estamos regresando desde una página específica
        const fromPage = location.state?.fromFavorites; // Verificamos si vinimos de Favoritos
        const fromCart = location.state?.fromCart; // Verificamos si vinimos del carrito
        const fromRecipeList = location.state?.fromRecipeList; // Verificamos si vinimos de RecipeList
        const fromSearchResults = location.state?.fromSearchResults; // Verificamos si vinimos de SearchResults
    
        if (fromPage) {
            navigate("/favorites"); // Regresa a la página de favoritos
        } else if (fromCart) {
            navigate("/cart"); // Regresa a la página del carrito
        } else if (fromRecipeList) {
            navigate("/recipes"); // Regresa a la página de recetas
        } else if (fromSearchResults) {
            navigate("/searchresults"); // Regresa a la página de búsqueda
        } else {
            navigate("/"); // Página predeterminada (inicio)
        }
    };

    return (
        <section className="recipe-detail">
            <div className="recipe-detail-container">
                {/* Botón de volver con ícono */}
                <button className="back-btn" onClick={handleBackButtonClick}>
                    <p><i className="bx bx-arrow-back"></i> BACK</p>
                </button>
                <div className="recipe-detail-header">
                    <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
                    <div className="recipe-detail-info">
                        <h1>{recipe.title}</h1>
                        <p>
                            <i className="bx bx-time-five"></i> {recipe.readyInMinutes} minutes
                        </p>
                        {/* Sección de Descripción */}
                        <div className="recipe-description">
                            <h3 onClick={() => toggleSection("description")}>
                                Description{" "}
                                <i
                                    className={`bx ${expandedSections.description ? "bx-chevron-up" : "bx-chevron-down"
                                        }`}></i>
                            </h3>
                            {expandedSections.description && (
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: recipe.summary || "No description available for this recipe.",
                                    }}
                                />
                            )}
                        </div>
                        {/* Sección de Dietary Restrictions */}
                        <div className="dietary-restrictions">
                            <h3 onClick={() => toggleSection("dietaryRestrictions")}>
                                Dietary Restrictions{" "}
                                <i
                                    className={`bx ${expandedSections.dietaryRestrictions
                                            ? "bx-chevron-up"
                                            : "bx-chevron-down"
                                        }`}></i>
                            </h3>
                            {expandedSections.dietaryRestrictions && (
                                <div className="dietary-icons">
                                    {recipe.diets && recipe.diets.length > 0 ? (
                                        recipe.diets.map((diet, index) => (
                                            <DietaryIcon key={index} diet={diet} />
                                        ))
                                    ) : (
                                        <p>No dietary restrictions found for this recipe.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Sección de Ingredientes */}
                        <div className="ingredients-section">
                            <h3 onClick={() => toggleSection("ingredients")}>
                                Ingredients{" "}
                                <i
                                    className={`bx ${expandedSections.ingredients ? "bx-chevron-up" : "bx-chevron-down"
                                        }`}></i>
                            </h3>
                            {expandedSections.ingredients && (
                                <ul>
                                    {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
                                        recipe.extendedIngredients.map((ingredient, index) => (
                                            <li key={index}>
                                                {ingredient.originalString || ingredient.name}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No ingredients available for this recipe.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                        {/* Información Nutricional */}
                        <div className="nutritional-info">
                            <h3 onClick={() => toggleSection("nutritionalInfo")}>
                                Nutritional Information{" "}
                                <i
                                    className={`bx ${expandedSections.nutritionalInfo ? "bx-chevron-up" : "bx-chevron-down"
                                        }`}></i>
                            </h3>
                            {expandedSections.nutritionalInfo && (
                                <ul>
                                    {nutritionalInfo.length > 0 ? (
                                        nutritionalInfo.map((nutrient) => (
                                            <li key={nutrient.title}>
                                                {nutrient.title}: {nutrient.amount} {nutrient.unit}
                                            </li>
                                        ))
                                    ) : (
                                        <p>No nutritional information available.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                        {/* Información Adicional */}
                        <div className="recipe-extra-info">
                            <h3 onClick={() => toggleSection("additionalInfo")}>
                                Additional Information{" "}
                                <i
                                    className={`bx ${expandedSections.additionalInfo ? "bx-chevron-up" : "bx-chevron-down"
                                        }`}></i>
                            </h3>
                            {expandedSections.additionalInfo && (
                                <div>
                                    <p>
                                        <strong>Serves:</strong> {recipe.servings} people
                                    </p>
                                    <p>
                                        <strong>Cost per serving:</strong> ${recipe.pricePerServing.toFixed(2)}
                                    </p>
                                    <p>
                                        <strong>Calories per serving:</strong>{" "}
                                        {nutritionalInfo.find((n) => n.title === "Calories")?.amount || "N/A"} kcal
                                    </p>
                                </div>
                            )}
                        </div>
                        {/* Botones */}
                        <div className="recipe-actions-below">
                            <button onClick={toggleSaveRecipe}>
                                <i
                                    className={favorites.some((fav) => fav.id === recipe.id)
                                        ? "bx bxs-heart"
                                        : "bx bx-heart"
                                    }
                                ></i>{" "}
                            </button>
                            <button onClick={addToCartHandler}>
                                <i
                                    className={cart.some((item) => item.id === recipe.id)
                                        ? "bx bxs-plus"
                                        : "bx bx-plus"
                                    }
                                ></i>{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeDetails;
