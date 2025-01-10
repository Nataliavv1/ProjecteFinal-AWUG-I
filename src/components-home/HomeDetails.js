import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import DietaryIcon from "../components/DietaryIcon"; // Componente de íconos
import "boxicons/css/boxicons.min.css"; // Asegúrate de importar Boxicons
import "./HomeDetails.css";
import SimilarRecipes from "../components-recipes/SimilarRecipes"; // Importar el componente SimilarRecipes
import Footer from "../components/Footer";

function HomeDetails() {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showLoginMessage, setShowLoginMessage] = useState(false); // Estado para mensaje de login

    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { cart, addToCart, removeFromCart } = useCart();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const navigate = useNavigate();
    const location = useLocation(); // Hook para obtener la ubicación actual

    const [expandedSections, setExpandedSections] = useState({
        description: true,
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
        // Desplazarse al principio de la página cuando se carga HomeDetails.js
        window.scrollTo(0, 0); // Esto mueve la página al principio

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
            setShowLoginMessage(true); // Mostrar mensaje si no está autenticado
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
            setShowLoginMessage(true); // Mostrar mensaje si no está autenticado
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

    const handleBackButtonClick = () => {
        const fromPage = location.state?.fromFavorites;
        const fromCart = location.state?.fromCart;
        const fromRecipeList = location.state?.fromRecipeList;
        const fromSearchResults = location.state?.fromSearchResults;

        if (fromPage) {
            navigate("/favorites");
        } else if (fromCart) {
            navigate("/cart");
        } else if (fromRecipeList) {
            navigate("/recipes");
        } else if (fromSearchResults) {
            navigate("/recipes");
        } else {
            navigate("/");
        }
    };

    return (
        <section className="recipe-detail">
            <div className="recipe-detail-container">
                {/* Botón de volver */}
                <button className="back-btn" onClick={handleBackButtonClick}>
                    <p>
                        <i className="bx bx-arrow-back"></i> BACK
                    </p>
                </button>

                {/* Mensaje emergente de login */}
                {showLoginMessage && (
                    <div className="login-message">
                        <p>You need to log in to save recipes or add them to your cart.</p>
                        <div className="button-container">
                            <button className="login-button" onClick={loginWithRedirect}>
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

                <div className="recipe-detail-header">
                    <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
                    <div className="recipe-detail-info">
                        <h1>{recipe.title}</h1>
                        <p>
                            <i className="bx bx-time-five"></i> {recipe.readyInMinutes} minutes
                        </p>
                        <div className="recipe-description">
                            <h3 onClick={() => toggleSection("description")}>
                                Description{" "}
                                <i
                                    className={`bx ${expandedSections.description ? "bx-chevron-up" : "bx-chevron-down"}`}
                                ></i>
                            </h3>
                            {expandedSections.description && (
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: recipe.summary || "No description available for this recipe.",
                                    }}
                                />
                            )}
                        </div>
                        <div className="dietary-restrictions">
                            <h3 onClick={() => toggleSection("dietaryRestrictions")}>
                                Dietary Restrictions{" "}
                                <i
                                    className={`bx ${
                                        expandedSections.dietaryRestrictions ? "bx-chevron-up" : "bx-chevron-down"
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
                        <div className="ingredients-section">
                            <h3 onClick={() => toggleSection("ingredients")}>
                                Ingredients{" "}
                                <i
                                    className={`bx ${expandedSections.ingredients ? "bx-chevron-up" : "bx-chevron-down"}`}
                                ></i>
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
                        <div className="nutritional-info">
                            <h3 onClick={() => toggleSection("nutritionalInfo")}>
                                Nutritional Information{" "}
                                <i
                                    className={`bx ${
                                        expandedSections.nutritionalInfo ? "bx-chevron-up" : "bx-chevron-down"
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
                        <div className="recipe-extra-info">
                            <h3 onClick={() => toggleSection("additionalInfo")}>
                                Additional Information{" "}
                                <i
                                    className={`bx ${
                                        expandedSections.additionalInfo ? "bx-chevron-up" : "bx-chevron-down"
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
                        <div className="recipe-actions-below">
                            <button onClick={toggleSaveRecipe}>
                                <i
                                    className={
                                        favorites.some((fav) => fav.id === recipe.id)
                                            ? "bx bxs-heart"
                                            : "bx bx-heart"
                                    }
                                ></i>{" "}
                            </button>
                            <button onClick={addToCartHandler}>
                                <i
                                    className={
                                        cart.some((item) => item.id === recipe.id)
                                            ? "bx bxs-plus"
                                            : "bx bx-plus"
                                    }
                                ></i>{" "}
                            </button>
                        </div>
                    </div>
                </div>
                <SimilarRecipes ingredients={recipe.extendedIngredients} />
            </div>
            {/* Añadimos el componente Footer */}
            <Footer />
        </section>
    );
}

export default HomeDetails;
