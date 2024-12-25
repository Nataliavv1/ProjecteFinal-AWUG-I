import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo from "../img/icon.png";

function Footer() {
    return (
        <footer className="footer-container">
            <div className="footer-logo">
                <img src={logo} alt="Logo" className="footer-logo-image" />
            </div>
            <div className="footer-links">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/recipes" className="footer-link">Recipes</Link>
                <Link to="/services" className="footer-link">Service</Link>
                <Link to="/restaurants" className="footer-link">Restaurant</Link>
                <Link to="/signup" className="footer-link">Sign Up</Link>
            </div>
            <hr class="footer-line" />
            <div className="footer-text">
                <p>© 2024 TasteBuddy. All rights reserved.<br /> Unauthorized use or duplication of content without express permission is prohibited.</p>
            </div>
        </footer>
    );
}

export default Footer;
