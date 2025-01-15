import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate
import { useCart } from "../components/CartContext";
import { useFavorites } from "../components/FavoritesContext";
import "./Cart.css";

const Cart = () => {
    const { cart, removeFromCart } = useCart();
    const { addFavorite } = useFavorites();
    const [ingredients, setIngredients] = useState({});
    const [servings, setServings] = useState({});
    const [purchasedIngredients, setPurchasedIngredients] = useState({});
    const [steps, setSteps] = useState({});
    const [expand, setExpand] = useState({});
    const [readyTimes, setReadyTimes] = useState({});
    const navigate = useNavigate(); // Hook para la navegación
    //const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
    //const API_KEY = '540464a4610b4e4c9488d105323ad0af'; // Usar esta cuando nos quedemos sin puntos en la otra
    const API_KEY = 'a797b5406ec54ebf950e8bb6af3eef5b';

    const fetchIngredientsForServings = async (recipeId, numberOfServings) => {
        const URL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
        try {
            const response = await fetch(URL);
            const data = await response.json();

            const adjustedIngredients = data.extendedIngredients
                .filter((ingredient) => ingredient.amount > 0 && ingredient.unit)
                .map((ingredient) => ({
                    ...ingredient,
                    amount: ((ingredient.amount || 0) / data.servings) * numberOfServings,
                }));

            setIngredients((prev) => ({
                ...prev,
                [recipeId]: adjustedIngredients,
            }));

            setServings((prev) => ({
                ...prev,
                [recipeId]: numberOfServings,
            }));
        } catch (error) {
            console.error("Error fetching ingredients for servings:", error);
        }
    };

    const handleServingsChange = (recipeId, increment) => {
        setServings((prev) => {
            const newServings = (prev[recipeId] || 1) + increment;
            if (newServings < 1) return prev;
            fetchIngredientsForServings(recipeId, newServings);
            return { ...prev, [recipeId]: newServings };
        });
    };

    const toggleIngredientPurchased = (recipeId, ingredientIndex) => {
        setPurchasedIngredients((prev) => {
            const updated = { ...prev };
            if (!updated[recipeId]) updated[recipeId] = [];
            updated[recipeId][ingredientIndex] = !updated[recipeId][ingredientIndex];
            return updated;
        });
    };

    const toggleExpand = (recipeId, type) => {
        setExpand((prev) => ({
            ...prev,
            [recipeId]: {
                ...prev[recipeId],
                [type]: !prev[recipeId]?.[type],
            },
        }));
    };

    useEffect(() => {
        const fetchInitialIngredients = async (recipeId) => {
            const URL = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`;
            try {
                const response = await fetch(URL);
                const data = await response.json();

                const initialIngredients = data.extendedIngredients
                    .filter((ingredient) => ingredient.amount > 0 && ingredient.unit)
                    .map((ingredient) => ({
                        ...ingredient,
                        amount: ingredient.amount / data.servings,
                    }));

                setIngredients((prev) => ({
                    ...prev,
                    [recipeId]: initialIngredients,
                }));

                setServings((prev) => ({
                    ...prev,
                    [recipeId]: 1,
                }));

                setSteps((prev) => ({
                    ...prev,
                    [recipeId]: data.analyzedInstructions[0]?.steps || [],
                }));

                setReadyTimes((prev) => ({
                    ...prev,
                    [recipeId]: data.readyInMinutes,
                }));

                // Establecer las secciones como desplegadas al inicio
                setExpand((prev) => ({
                    ...prev,
                    [recipeId]: {
                        ingredients: true,
                        steps: true,
                    },
                }));
            } catch (error) {
                console.error("Error fetching initial ingredients:", error);
            }
        };

        cart.forEach((recipe) => {
            if (!ingredients[recipe.id]) {
                fetchInitialIngredients(recipe.id);
            }
        });
    }, [cart]);

    // Función para navegar a los detalles de la receta
    const goToRecipeDetails = (recipeId) => {
        navigate(`/recipe/${recipeId}`, { state: { fromCart: true } }); // Pasamos el estado desde el carrito
    };

    return (
        <div className="cart-container">
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul className="cart-list">
                    {cart.map((recipe) => (
                        <li
                            key={recipe.id}
                            className="cart-item"
                            onClick={() => goToRecipeDetails(recipe.id)} // Navegar al hacer clic en todo el contenedor
                        >
                            <div className="recipe-header">
                                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                                <div className="recipe-details">
                                    <div className="recipe-title-container">
                                        <h3>{recipe.title}</h3>
                                        <div className="action-buttons">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFromCart(recipe.id);
                                                }}
                                                className="icon-button delete"
                                                aria-label="Remove from cart"
                                            >
                                                <i className="bx bx-trash"></i>
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addFavorite(recipe);
                                                }}
                                                className="icon-button favorite"
                                                aria-label="Save to favorites"
                                            >
                                                <i className="bx bx-heart"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <h4>
                                        <i className="bx bx-time-five"></i>
                                        {recipe.readyInMinutes} minutes
                                    </h4>
                                    <div className="servings-control">
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleServingsChange(recipe.id, -1);
                                        }} disabled={servings[recipe.id] === 1}>-</button>
                                        <span>Servings: {servings[recipe.id] || 1}</span>
                                        <button onClick={(e) => {
                                            e.stopPropagation();
                                            handleServingsChange(recipe.id, 1);
                                        }}>+</button>
                                    </div>
                                    <div className="collapsible-section">
                                        <h4 onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(recipe.id, "ingredients");
                                        }}>
                                            Ingredients
                                            <i className={`bx ${expand[recipe.id]?.ingredients ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                                        </h4>
                                        {expand[recipe.id]?.ingredients && (
                                            <ul className="ingredients-list">
                                                {ingredients[recipe.id]?.map((ingredient, index) => (
                                                    <li key={index}>
                                                        <input
                                                            type="checkbox"
                                                            checked={purchasedIngredients[recipe.id]?.[index] || false}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                toggleIngredientPurchased(recipe.id, index);
                                                            }}
                                                        />
                                                        {ingredient.amount.toFixed(1)} {ingredient.unit} {ingredient.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="collapsible-section">
                                        <h4 onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(recipe.id, "steps");
                                        }}>
                                            Steps
                                            <i className={`bx ${expand[recipe.id]?.steps ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
                                        </h4>
                                        {expand[recipe.id]?.steps && (
                                            <ol className="steps-list">
                                                {steps[recipe.id]?.map((step, index) => (
                                                    <li key={index}>{step.step}</li>
                                                ))}
                                            </ol>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Cart;
