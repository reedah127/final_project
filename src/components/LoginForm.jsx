import React, { useState } from 'react';

export default function LoginForm({ API_URL, triggerAlert, onLoginSuccess, toggleForm }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login credentials invalid');
      
      onLoginSuccess(data.token, data.username);
    } catch (err) {
      triggerAlert(err.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3>Account Login</h3>
      <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" className="btn btn-primary">Log In</button>
      <p>Need a new account? <span onClick={toggleForm} className="form-toggle-link">Register here</span></p>
    </form>
  );
}
