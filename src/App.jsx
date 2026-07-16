import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Message from './components/Message';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isRegistering, setIsRegistering] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState(null);

  const API_URL = 'http://localhost:5050/api';

  const handleLogin = (jwtToken, user) => {
    setToken(jwtToken);
    setUsername(user);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('username', user);
    triggerAlert('Logged in successfully!', 'success');
  };

  const handleLogout = () => {
    setToken(null);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    triggerAlert('Logged out successfully.', 'success');
  };

  const triggerAlert = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="app-container">
      <Header isLoggedIn={!!token} username={username} onLogout={handleLogout} />
      
      <main className="main-content">
        <Message message={message} />

        {!token ? (
          <div className="auth-card">
            {isRegistering ? (
              <RegisterForm API_URL={API_URL} triggerAlert={triggerAlert} toggleForm={() => setIsRegistering(false)} />
            ) : (
              <LoginForm API_URL={API_URL} triggerAlert={triggerAlert} onLoginSuccess={handleLogin} toggleForm={() => setIsRegistering(true)} />
            )}
          </div>
        ) : (
          <div className="dashboard-grid">
            <div className="form-pane">
              <h2>{taskToEdit ? 'Edit Task' : 'Create Task'}</h2>
              <TaskForm 
                API_URL={API_URL} 
                token={token} 
                taskToEdit={taskToEdit} 
                clearEdit={() => setTaskToEdit(null)} 
                onTaskSaved={() => setRefreshTrigger(prev => prev + 1)} 
                triggerAlert={triggerAlert} 
              />
            </div>
            <div className="list-pane">
              <h2>Your Tasks</h2>
              <TaskList 
                API_URL={API_URL} 
                token={token} 
                refreshTrigger={refreshTrigger} 
                onEditClick={(task) => setTaskToEdit(task)} 
                onTasksUpdated={() => setRefreshTrigger(prev => prev + 1)} 
                triggerAlert={triggerAlert} 
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
