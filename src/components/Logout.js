import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import "./Header.css";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })} className="logout-button">
      <span className="logout-text"> Log out</span>
    </button>
  );
};
