import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFavorites } from "../components/FavoritesContext";
import { useCart } from "../components/CartContext";
import { useAuth0 } from "@auth0/auth0-react";
import "./HomeDetails.css";

function HomeDetails() {
    const { recipeId } = useParams(); // Obtener el ID de la receta desde la URL
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const { cart, addToCart, removeFromCart } = useCart();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=d0fba68ef5204602ac929844f28b7d5f`);
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
            loginWithRedirect(); // Redirigir al login si no está autenticado
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
            loginWithRedirect(); // Redirigir al login si no está autenticado
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

    // Nutritional information (if available)
    const nutritionalInfo = recipe.nutrition && recipe.nutrition.nutrients ? recipe.nutrition.nutrients : [];

    return (
        <section className="recipe-detail">
            <div className="recipe-detail-container">
                <button className="back-btn" onClick={() => navigate("/")}>Back</button>
                <div className="recipe-detail-header">
                    <img src={recipe.image} alt={recipe.title} className="recipe-detail-image" />
                    <h1>{recipe.title}</h1>
                    <p>{recipe.readyInMinutes} minutes</p>
                </div>

                {/* Descripción estructurada */}
                <div className="recipe-description">
                    <h3>Description:</h3>
                    <p dangerouslySetInnerHTML={{ __html: recipe.summary || "No description available for this recipe." }} />
                </div>

                {/* Mostrar restricciones dietéticas */}
                <div className="dietary-restrictions">
                    <h3>Dietary Restrictions:</h3>
                    <ul>
                        {recipe.diets && recipe.diets.length > 0 ? (
                            recipe.diets.map((diet, index) => (
                                <li key={index}>{diet}</li>
                            ))
                        ) : (
                            <p>No dietary restrictions found for this recipe.</p>
                        )}
                    </ul>
                </div>

                {/* Información nutricional */}
                <div className="nutritional-info">
                    <h3>Nutritional Information:</h3>
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
                </div>

                {/* Información adicional */}
                <div className="recipe-extra-info">
                    <h3>Additional Information:</h3>
                    <p><strong>Time:</strong> {recipe.readyInMinutes} minutes</p>
                    <p><strong>Serves:</strong> {recipe.servings} people</p>
                    <p><strong>Cost per serving:</strong> ${recipe.pricePerServing.toFixed(2)}</p>
                    <p><strong>Calories per serving:</strong> {nutritionalInfo.find(n => n.title === "Calories")?.amount || "N/A"} kcal</p>
                </div>

                {/* Recetas relacionadas */}
                <div className="related-recipes">
                    <h3>Users also liked:</h3>
                    <ul>
                        {recipe.relatedRecipes && recipe.relatedRecipes.length > 0 ? (
                            recipe.relatedRecipes.map((relatedRecipe) => (
                                <li key={relatedRecipe.id}>
                                    <a href={`https://spoonacular.com/recipes/${relatedRecipe.id}`}>{relatedRecipe.title}</a>
                                </li>
                            ))
                        ) : (
                            <p>No related recipes found.</p>
                        )}
                    </ul>
                </div>

                <div className="recipe-actions">
                    <button onClick={toggleSaveRecipe}>
                        {favorites.some((fav) => fav.id === recipe.id) ? "Remove from Favorites" : "Add to Favorites"}
                    </button>
                    <button onClick={addToCartHandler}>
                        {cart.some((item) => item.id === recipe.id) ? "Remove from Cart" : "Add to Cart"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default HomeDetails;
