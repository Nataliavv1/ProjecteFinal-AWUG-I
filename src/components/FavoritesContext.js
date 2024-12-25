import React, { createContext, useContext, useState } from "react";

// Crear el contexto
const FavoritesContext = createContext();

// Hook personalizado para usar el contexto
export const useFavorites = () => {
    return useContext(FavoritesContext);
};

// Proveedor del contexto
export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    // Función para agregar un favorito solo si no está ya en favoritos
    const addFavorite = (recipe) => {
        // Verificar si la receta ya está en los favoritos
        if (!favorites.some(fav => fav.id === recipe.id)) {
            setFavorites((prevFavorites) => [...prevFavorites, recipe]);
        } else {
            console.log("This recipe is already in your favorites.");
        }
    };

    // Función para eliminar un favorito
    const removeFavorite = (id) => {
        setFavorites((prevFavorites) =>
            prevFavorites.filter((recipe) => recipe.id !== id)
        );
    };

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
};
