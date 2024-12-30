import React, { useState, useEffect } from "react";
import { useFavorites } from "./FavoritesContext"; // Cambiado a FavoritesContext
import { useCart } from "../components/CartContext"; // Contexto de carrito
import "./Favorites.css";

const Favorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const { addToCart } = useCart();
    const [ingredients, setIngredients] = useState({});
    const [expand, setExpand] = useState({}); // Para manejar la expansión de secciones
    const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";

    // Función para obtener ingredientes de una receta favorita
    const fetchIngredients = async (recipeId) => {
        const URL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
        try {
            const response = await fetch(URL);
            const data = await response.json();
            const recipeIngredients = data.extendedIngredients || [];
            setIngredients((prev) => ({
                ...prev,
                [recipeId]: recipeIngredients,
            }));
        } catch (error) {
            console.error("Error fetching ingredients:", error);
        }
    };

    useEffect(() => {
        favorites.forEach((recipe) => {
            if (!ingredients[recipe.id]) {
                fetchIngredients(recipe.id);
            }
        });
    }, [favorites]);

    // Función para manejar la expansión de la sección de ingredientes
    const toggleExpand = (recipeId) => {
        setExpand((prev) => ({
            ...prev,
            [recipeId]: !prev[recipeId],
        }));
    };

    return (
        <div>
            <h1>Your Favorites</h1>
            {favorites.length === 0 ? (
                <p>You have no favorite recipes yet!</p>
            ) : (
                <div className="favorites-container">
                    {favorites.map((recipe) => (
                        <div key={recipe.id} className="favorite-item">
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="favorite-image"
                            />
                            <div className="favorite-info">
                                <h3>{recipe.title}</h3>
                                <h4>
                                    <i className="bx bx-time-five"></i>
                                    {recipe.readyInMinutes} minutes
                                </h4>
                                <p>
                                    {recipe.summary
                                        ? recipe.summary.replace(/(<([^>]+)>)/gi, "")
                                        : "No description available."}
                                </p>
                                {/* Ingredientes */}
                                <div className="collapsible-section">
                                    <h5 onClick={() => toggleExpand(recipe.id)}>
                                        Ingredients
                                        <i
                                            className={`bx ${
                                                expand[recipe.id] ? "bx-chevron-up" : "bx-chevron-down"
                                            }`}
                                        ></i>
                                    </h5>
                                    {expand[recipe.id] && (
                                        <ul className="ingredients-list">
                                            {ingredients[recipe.id]?.map((ingredient, index) => (
                                                <li key={index}>
                                                    {ingredient.amount.toFixed(1)} {ingredient.unit}{" "}
                                                    {ingredient.name}
                                                </li>
                                            )) || <p>Loading ingredients...</p>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="favorite-buttons">
                                <button onClick={() => removeFavorite(recipe.id)}>
                                    <i className="bx bx-trash"></i>
                                </button>
                                <button onClick={() => addToCart(recipe)}>
                                    <i className="bx bx-plus"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
