import React from 'react';
import './Service.css'; // Ensure the CSS file is linked
import Footer from "../components/Footer";

function TitleAndSubtitle() {
  return (
    <div>
    <div className="title-container">
      <h1>WELCOME TO TasteBuddy</h1>
      <h2>
        Dive Into <span className="highlighted-word">Flavor</span>
      </h2>
      <p>
        Hungry for inspiration? TasteBuddy serves up a world of recipes and
        delicious details! Explore mouthwatering dishes, complete with
        step-by-step instructions and ingredient lists tailored to make your
        cooking experience a breeze. Pro tip: Sign up or log in to unlock the
        magic—save your faves, build your recipe box, and add ingredients to
        your cart like a pro.
      </p>
      <p>
        Filter recipes to suit your vibe—whether you’re looking for quick eats,
        budget-friendly options, or cuisine by type. Fancy something specific?
        Use our powerful search tool to find dishes by ingredients, dietary
        needs, or the name of the dish. Oh, and don’t miss the “Restaurant
        Finder”! Discover top-rated spots near you with interactive maps,
        complete with ratings, locations, and pricing info. TasteBuddy: your
        passport to a world of flavor!
      </p>
      
    </div>
    {/* Añadimos el componente Footer */}
    <Footer />
    </div>

  );
}

export default TitleAndSubtitle;

