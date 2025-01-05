import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components-home/Home";
import Recipes from "./components-recipes/Recipes";
import Service from "./components/Service";
import Restaurants from "./components/Restaurants";
import Favorites from "./components/Favorites";
import Cart from "./components/Cart";
import LoginPage from "./components/LoginPage";
import HomeDetails from "./components-home/HomeDetails";
import SearchResults from "./components/SearchResults"; // Ruta corregida

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
        <Route path="/recipe/:recipeId" element={<HomeDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;
