import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./Login";
import { LogoutButton } from "./Logout";
import { Profile } from "./Profile";
import { useCart } from "../components/CartContext";
import logo from "../img/icon.png";
import "./Header.css";

function Header() {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/favorites");
    }
  };

  const handleCartClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  const handleDropdownChange = (e) => {
    const value = e.target.value;
    if (value !== "all") {
      navigate(`/${value}`);
    } else {
      navigate("/");
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <header className="App-header">
      <div className="header-top">
        <Link to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </Link>

        <div className="input-group">
          <select
            className="dropdown"
            onChange={handleDropdownChange}
            value={location.pathname.replace("/", "") || "all"}
          >
            <option value="all">All</option>
            <option value="recipes">Recipes</option>
            <option value="service">Service</option>
            <option value="restaurants">Restaurants</option>
          </select>
          <input
            type="text"
            className="input"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="button--submit" onClick={handleSearch}>
            <i className="bx bx-search"></i>
          </button>
        </div>

        <div className="user-actions">
          {isAuthenticated ? (
            <>
              <Profile />
              <LogoutButton />
            </>
          ) : (
            <LoginButton />
          )}
          <button onClick={handleFavoriteClick} className="favorite-button">
            <i className="bx bx-heart"></i>
          </button>
          <button onClick={handleCartClick} className="cart-button">
            <i className="bx bx-receipt"></i>
            <span className="cart-text">Cart: {cart.length}</span>
          </button>
        </div>
      </div>

      <nav className="navigation">
        <ul>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/recipes"
              className={location.pathname === "/recipes" ? "active" : ""}
            >
              Recipes
            </Link>
          </li>
          <li>
            <Link
              to="/service"
              className={location.pathname === "/service" ? "active" : ""}
            >
              Service
            </Link>
          </li>
          <li>
            <Link
              to="/restaurants"
              className={location.pathname === "/restaurants" ? "active" : ""}
            >
              Restaurants
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
