// Home.js
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import home from "../img/home.png";
import HomeChoose from "./Home-Choose";
import HomeTestimonials from "./Home-Testimonials";
import HomePopulars from "./Home-Populars"; // Importamos el componente HomePopulars
import Footer from "../components/Footer";

function Home() {
  return (
    <section>
      <div className="home-container">
        <div className="home-buttons-container">
          <h1 className="home-title">
            Discover, <span className="destacar">plan</span> and cook like never before.
          </h1>
          <p className="home-subtitle">
            Find quick recipes, plan your meals and adapt each dish to your lifestyle. Your new kitchen companion is here!
          </p>
          <div className="home-buttons">
            <Link to="/recipes" className="home-button find-button">
              Find Recipes
            </Link>
            <Link to="/restaurants" className="home-button explore-button">
              Explore More
            </Link>
          </div>
        </div>
        <div className="home-image-container">
          <img src={home} className="home-image" alt="Cooking" />
        </div>
      </div>
      {/* Añadimos el componente HomeChoose */}
      <HomeChoose />

      {/* Añadimos el componente HomePopulars */}
      <HomePopulars />

      {/* Añadimos el componente HomeTestimonials */}
      <HomeTestimonials />

      {/* Añadimos el componente Footer */}
      <Footer />
    </section>
  );
}

export default Home;
