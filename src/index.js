import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { FavoritesProvider } from "./components/FavoritesContext";
import { CartProvider } from "./components/CartContext";

const domain = "dev-757jqha3ylhymbpr.us.auth0.com";
const clientId = "R4iwdps23uNQ8YF843qglGLu15Y9rF0T";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: window.location.origin }}
    >
        <FavoritesProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </FavoritesProvider>
    </Auth0Provider>
);
