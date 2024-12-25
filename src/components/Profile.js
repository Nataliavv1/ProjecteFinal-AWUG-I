import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import "./Header.css";

export const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return null;

  return (
    <div className="profile">
      {/*<p>Email: {user.email}</p>*/}
      <img src={user.picture} alt={user.name} />
      <h2>{`${user.name}`}</h2>
    </div>
  );
};
