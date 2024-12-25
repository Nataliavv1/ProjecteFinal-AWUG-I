import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function HomeChoose() {
    return (
        <section className="container-choose">
            <div className="home-container-choose">
                <div home-cards-container>
                    <h3 className="home-choose-uppertitle">Our service</h3>
                    <h1 className="home-choose-title">Why choose us?</h1>
                    <p className="home-choose-subtitle">Make cooking simple, fast, and personalized. Discover quick recipes, plan meals easily, and enjoy healthy options tailored to you.</p>
                </div>
                <div className="home-containers">
                    <div className="home-subcontainers">
                        <i className="bx bx-time icons-choose"></i>
                        <h2 className="home-choose-title2">Fast and Easy Recipes</h2>
                        <p className="home-choose-subtitle2">Discover quick, delicious meals ready in minutes. Perfect for busy days!</p>
                    </div>
                    <div className="home-subcontainers">
                        <i className="bx bx-calendar-week icons-choose"></i>
                        <h2 className="home-choose-title2">Meal Planning</h2>
                        <p className="home-choose-subtitle2">Plan your meals, filter by diet, and generate shopping lists effortlessly.</p>
                    </div>
                    <div className="home-subcontainers">
                        <i class='bx bx-bowl-hot icons-choose'></i>
                        <h2 className="home-choose-title2">Healthy & Flexible Options</h2>
                        <p className="home-choose-subtitle2">Explore vegetarian, gluten-free, and low-calorie recipes tailored to your needs.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeChoose;
