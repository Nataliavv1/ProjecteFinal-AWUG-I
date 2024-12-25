import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import User1 from "../img/User1.png";
import User2 from "../img/User2.png";
import User3 from "../img/User3.png";

function HomeTestimonials() {
    return (
        <section className="container-testimonials">
            <div className="home-container-testimonials">
                <div home-cards-container>
                    <h3 className="home-testimonials-uppertitle">Testimonials</h3>
                    <h1 className="home-testimonials-title">What our Users Are Saying</h1>
                    <p className="home-testimonials-subtitle">Making cooking faster, easier, and more enjoyable every day!</p>
                </div>
                <div className="home-containers">
                    <div className="home-subcontainers">
                        <img src={User1} className="icons-testimonials" alt="Time" />
                        <h2 className="home-testimonials-title2">Maria S.</h2>
                        <p className="home-testimonials-subtitle2">Taste Buddy transformed my meal planning!</p>
                    </div>
                    <div className="home-subcontainers">
                        <img src={User2} className="icons-testimonials" alt="Planner" />
                        <h2 className="home-testimonials-title2">John L.</h2>
                        <p className="home-testimonials-subtitle2">The best tool for busy days. I love the recipe filters!</p>
                    </div>
                    <div className="home-subcontainers">
                        <img src={User3} className="icons-testimonials" alt="Recipe" />
                        <h2 className="home-testimonials-title2">Emma T.</h2>
                        <p className="home-testimonials-subtitle2">Finally, a platform that fits my gluten-free lifestyle!</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeTestimonials;
