import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import { useFavorites } from "./FavoritesContext"; // Cambiado a FavoritesContext
import { useCart } from "../components/CartContext"; // Contexto de carrito
import "./Favorites.css";

const Favorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const { addToCart } = useCart();
    const navigate = useNavigate(); // Inicializamos useNavigate para la navegación

    // Función para navegar a la página de detalles de la receta
    const goToRecipeDetails = (recipeId) => {
        navigate(`/recipe/${recipeId}`, { state: { fromFavorites: true } }); // Pasamos el estado fromFavorites
    };

    return (
        <div>
            <h1>Your Favorites</h1>
            {favorites.length === 0 ? (
                <p>You have no favorite recipes yet!</p>
            ) : (
                <div className="favorites-container">
                    {favorites.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="favorite-item"
                            onClick={() => goToRecipeDetails(recipe.id)} // Navegar al hacer clic en todo el contenedor
                        >
                            <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="favorite-image"
                            />
                            <div className="favorite-info">
                                <h3>{recipe.title}</h3> {/* El título sigue siendo estático */}
                                <h4>
                                    <i className="bx bx-time-five"></i>
                                    {recipe.readyInMinutes} minutes
                                </h4>
                                <p>
                                    {recipe.summary
                                        ? recipe.summary.replace(/(<([^>]+)>)/gi, "")
                                        : "No description available."}
                                </p>
                            </div>
                            <div className="favorite-buttons">
                                <button onClick={(e) => { e.stopPropagation(); removeFavorite(recipe.id); }}>
                                    <i className="bx bx-trash"></i>
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); addToCart(recipe); }}>
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
