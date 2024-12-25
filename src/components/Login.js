import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import "./Header.css";

export const LoginButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <button 
      onClick={isAuthenticated ? () => logout({ returnTo: window.location.origin }) : loginWithRedirect} 
      className="login-button"
    >
      <i className='bx bx-user'></i>
      <span className="login-text">
        {isAuthenticated ? `${user.name}` : 'Sign Up'}
      </span>             
    </button>
  );
};


