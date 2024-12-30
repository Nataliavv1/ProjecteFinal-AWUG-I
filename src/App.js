import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components-home/Home";
import Recipes from "./components/Recipes";
import Service from "./components/Service";
import Restaurants from "./components/Restaurants";
import Favorites from "./components/Favorites"; // Página de favoritos
import Cart from "./components/Cart"; // Página de carrito
import LoginPage from "./components/LoginPage"; // Asegúrate de importar correctamente la página de login
import HomeDetails from "./components-home/HomeDetails"; // Importa el componente de detalles

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
        <Route path="/favorites" element={<Favorites />} />  {/* Página de favoritos */}
        <Route path="/cart" element={<Cart />} />  {/* Página de carrito */}
        <Route path="/login" element={<LoginPage />} />  {/* Página de login */}
        <Route path="/recipe/:recipeId" element={<HomeDetails />} />  {/* Página de detalles de receta */}
      </Routes>
    </Router>
  );
}

export default App;

