import React from 'react';
import { AuthProvider, useAuth } from 'universal-auth-kit/client';

// Login component using the auth hook
function LoginForm() {
  const { login, user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    try {
      await login(username, password);
      alert('Login successful!');
    } catch (error) {
      alert('Login failed!');
    }
  };
  
  if (user) {
    return <div>You are logged in as {user.username}</div>;
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input id="username" name="username" type="text" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}

// Main app component
export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <h1>Universal Auth Kit Example</h1>
        <LoginForm />
      </div>
    </AuthProvider>
  );
}
