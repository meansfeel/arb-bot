import React, { useState } from 'react';
import axios from 'axios';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      alert('Login successful');
    } catch (error) {
      alert('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        id="login-username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        autoComplete="username"
      />
      <input
        type="password"
        id="login-password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        autoComplete="current-password"
      />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
