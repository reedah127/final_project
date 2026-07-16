import React from 'react';

export default function Header({ isLoggedIn, username, onLogout }) {
  return (
    <header className="app-header">
      <h1>Task Tracker</h1>
      {isLoggedIn && (
        <div className="user-profile-menu">
          <span className="user-greeting">User: <strong>{username}</strong></span>
          <button onClick={onLogout} className="btn btn-logout">Logout</button>
        </div>
      )}
    </header>
  );
}
