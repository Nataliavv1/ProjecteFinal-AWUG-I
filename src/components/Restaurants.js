import React, { useState, useEffect } from "react";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import "./Restaurants.css";
import markerIconImage from '../img/marker_map_icon.png';
import Footer from "../components/Footer";

const API_KEY = "d0fba68ef5204602ac929844f28b7d5f";
//const API_KEY = "540464a4610b4e4c9488d105323ad0af"; // Usar esta cuando nos quedemos sin puntos en la otra

function Restaurants() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [cuisine, setCuisine] = useState("");
  const [distance, setDistance] = useState(5);
  const [budget, setBudget] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("Any Price");
  const [minRating, setMinRating] = useState("");
  const [minRatingFilter, setMinRatingFilter] = useState("Any Rating");
  const [restaurantType, setRestaurantType] = useState("All Types");
  const [openingHours, setOpeningHours] = useState("Anytime");
  const [delivery, setDelivery] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(0);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state


  // Function to fetch latitude and longitude based on city & state
  const fetchCoordinates = async () => {
    if (!city || !state) return alert("Please enter both city and state.");
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=USA&format=json`
      );
      const data = await response.json();
      if (data.length > 0) {
        setLat(parseFloat(data[0].lat));
        setLng(parseFloat(data[0].lon));
        alert("Location found, please continue filling the form.");
      } else {
        alert("Location not found. Try a different city/state.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  // Fetch restaurants from Spoonacular
  const fetchRestaurants = async () => {
    if (!lat || !lng) return alert("Please enter a valid location.");
    setLoading(true); // Search button loading state
    try {
      const response = await fetch(
        `https://api.spoonacular.com/food/restaurants/search?lat=${lat}&lng=${lng}&cuisine=${cuisine}&distance=${distance}&budget=${budget}&min-rating=${minRating}&page=${page}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      setRestaurants(data.restaurants || []);
      updateMap(data.restaurants || []);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
    setLoading(false); // Search button loading state
  };

  // Update Leaflet map with restaurant markers
  const updateMap = (restaurants) => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      var markerIcon = L.icon({
        iconUrl: markerIconImage,
        iconSize:     [38, 38], // size of the icon
        iconAnchor:   [0, 19], // point of the icon which will correspond to marker's location
        popupAnchor:  [19, 19] // point from which the popup should open relative to the iconAnchor
      });



      restaurants.forEach((restaurant) => {
        L.marker([restaurant.address.latitude, restaurant.address.longitude], {icon: markerIcon})
          .addTo(map)
          .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.address.street_addr}`);
      });
    }
  };

  // Initialize Leaflet map after coordinates are set
  useEffect(() => {
    if (lat && lng && !map) {
      const newMap = L.map("map").setView([lat, lng], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(newMap);      
      setMap(newMap);
    }
  }, [lat, lng, map]);
  
  

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!lat || !lng) {
      await fetchCoordinates();
    }
    fetchRestaurants();
  };

  const displayedRestaurants = restaurants
    .filter(r => {
      if (restaurantType === 'All Types') {
        return true;
      }
      if (restaurantType === 'Vegan') {
        return r.cuisines.includes("Vegan");
      }
      if (restaurantType === 'Gluten Free') {
        return r.cuisines.includes("Gluten-Free");
      }
      if (restaurantType === 'Allergy Friendly') {
        return r.cuisines.includes("Allergy Friendly");
      }
    })
    .filter(r => {
      if (minRatingFilter === 'Any Rating') {
        return true;
      }
      if (minRatingFilter === '4+ Stars') {
        return r.weighted_rating_value >= 4;
      }
      if (minRatingFilter === '5 Stars') {
        console.log("minRatingFilter " + r.weighted_rating_value)
        return r.weighted_rating_value >= 5;
      }
    })
    .filter(r => {
      if (budgetFilter === 'Any Price') {
        return true;
      }
      if (budgetFilter === '$') {
        return r.dollar_signs <= 1;
      }
      if (budgetFilter === '$$') {
        return r.dollar_signs <= 2;
      }
      if (budgetFilter === '$$$') {
        return r.dollar_signs <= 3;
      }
      if (budgetFilter === '$$$$') {
        return r.dollar_signs <= 4;
      }
    })
    .filter(r => openingHours === 'Anytime' ? true : r.is_open)
    .filter(r => delivery ? r.delivery_enabled : true)
    .slice(0, 4); //aixo
  return (
    <div>
      <div class="restaurants-page-title-div">
        <p class="mini-title"> <span class="yellow-text">MAP</span> </p>
        <h1 >Find <span class="yellow-text">Restaurants</span> near you</h1>
        <p>Find the best restaurants near you. Discover flavors, check reviews, and choose the perfect spot for any occasion!</p>
      </div>
      <div class="restaurants-div">
        <form onSubmit={handleSearch}>
          <div class="location-form">
            <h2>First, let us know your location:</h2>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="State (e.g. CA, NY)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
            <button type="button" onClick={fetchCoordinates}>Get Location</button>
            <p>Only US locations, please</p>
          </div>

          <div class="restaurant-form">
          <h2>Now, what are your preferences?</h2>
            <div class="restaurant-form-input"> 
              <div class="restaurant-form-input-options">
                <label>Cuisine</label>
                <input
                  type="text"
                  placeholder="Italian, Mexican, etc."
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                />
              </div>
              <div class="restaurant-form-input-options">
              <label>Distance</label>
                <input
                  type="number"
                  placeholder="Enter radious in miles"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
              <div class="restaurant-form-input-options">
              <label>Budget</label>
                <input
                  type="number"
                  placeholder="Enter "
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <div class="restaurant-form-input-options">
                <label>Rating</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Min Rating (0-5)"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                />
              </div>
              <button type="submit" class="search-button" disabled={loading}>{loading ? <div className="loader"></div> : "Search"}</button>
            </div>
          </div>        
        </form>

        {/* Filter Section */}
        
          <h2>Here are some options to refine your search:</h2>
          <div className="restaurant-filters">
            <div>
              <span class="filter-options">Restaurant Type</span>
              <select value={restaurantType} onChange={(e) => setRestaurantType(e.target.value)}>
                <option value="All Types">All Types</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten Free">Gluten Free</option>
                <option value="Allergy Friendly">Allergy Friendly</option>
              </select>
            </div>

            <div>
              <span class="filter-options">Ratings</span>
              <select value={minRatingFilter} onChange={(e) => setMinRatingFilter(e.target.value)}>
                <option value="Any Rating">Any Rating</option>
                <option value="4+ Stars">4+ Stars</option>
                <option value="5 Stars">5 Stars</option>
              </select>
            </div>

            <div>
              <span class="filter-options">Price Range</span>
              <select value={budgetFilter} onChange={(e) => setBudgetFilter(e.target.value)}>
                <option value="Any Price">Any Price</option>
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </select>
            </div>
            
            <div>
              <span class="filter-options">Opening Hours</span>
              <select value={openingHours} onChange={(e) => setOpeningHours(e.target.value)}>
                <option value="Anytime">Anytime</option>
                <option value="Open Now">Open Now</option>
              </select>
            </div>

            <div class="special-features">
              <span>Special Features</span>
              <div class="filter-options">
                <label>
                  <input type="checkbox" checked={delivery} onChange={() => setDelivery(!delivery)} />
                  Delivery
                </label>
            </div>
          </div>
        </div>

        <div class="map-and-results">
          <h2 class="full-width">Our recommendations:</h2>
          <div id="map" style={{ height: "500px", width: "45%", marginTop: "10px" }}></div>

          <div class="results">
            <div class="results-boxes">
              {displayedRestaurants.length > 0 ? (
                displayedRestaurants.map((restaurant, index) => (
                  <div key={index} class="restaurant">
                    <img src={restaurant.food_photos?.[0] || restaurant.logo_photos?.[0]} alt={restaurant.name} width="100" />
                    <h3>{restaurant.name}</h3>
                    <p>📍 {restaurant.address.street_addr},</p> 
                    <p>{restaurant.address.city}</p>
                    <p>⭐ {restaurant.weighted_rating_value.toFixed(1)} ({restaurant.aggregated_rating_count} reviews)</p>
                    <p>{"$".repeat(restaurant.dollar_signs)} - 🕒{restaurant.is_open ? "Open Now" : "Not Open"}</p>
                  </div>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
          </div>
        </div>

        {restaurants.length > 4 && (
          <div class="results-pagination">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span> Page {page + 1} </span>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
        
      </div>
        {/* Añadimos el componente Footer */}
        <Footer />
    </div>
    
  ) 
}

export default Restaurants;
