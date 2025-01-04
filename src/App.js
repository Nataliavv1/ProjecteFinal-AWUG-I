import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components-home/Home";
import Recipes from "./components-recipes/Recipes"; // Ruta de recetas
import Service from "./components/Service";
import Restaurants from "./components/Restaurants";
import Favorites from "./components/Favorites"; // Página de favoritos
import Cart from "./components/Cart"; // Página de carrito
import LoginPage from "./components/LoginPage"; // Página de login
import HomeDetails from "./components-home/HomeDetails"; // Detalles de receta

import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/service" element={<Service />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipe/:recipeId" element={<HomeDetails />} /> {/* Ruta de detalles de receta */}
      </Routes>
    </Router>
  );
}

export default App;
