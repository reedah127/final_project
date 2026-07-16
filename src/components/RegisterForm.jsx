import React, { useState } from 'react';

export default function RegisterForm({ API_URL, triggerAlert, toggleForm }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      triggerAlert(data.message, 'success');
      toggleForm();
    } catch (err) {
      triggerAlert(err.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h3>Create Account</h3>
      <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit" className="btn btn-primary">Sign Up</button>
      <p>Already have an account? <span onClick={toggleForm} className="form-toggle-link">Login here</span></p>
    </form>
  );
}
