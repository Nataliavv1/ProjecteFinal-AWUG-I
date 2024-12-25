import React from "react";
import { useFavorites } from "./FavoritesContext";  // Cambiado a FavoritesContext
import { useCart } from "../components/CartContext";  // Contexto de carrito
import "./Favorites.css";

const Favorites = () => {
    const { favorites, removeFavorite } = useFavorites();
    const { addToCart } = useCart();

    // Función para agregar receta al carrito
    const addRecipeToCart = (recipe) => {
        addToCart(recipe);
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
                                <h4><i class='bx bx-time-five' ></i>{recipe.readyInMinutes} minutes</h4>
                                <p>{recipe.summary ? recipe.summary.replace(/(<([^>]+)>)/gi, "") : "No description available."}</p>
                            </div>
                            <div className="favorite-buttons">
                                <button onClick={() => removeFavorite(recipe.id)}><i className="bx bx-trash"></i></button>
                                <button onClick={() => addRecipeToCart(recipe)}><i className="bx bx-plus"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;


