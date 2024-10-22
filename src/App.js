import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/protected`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessage(response.data.message);
          setIsLoggedIn(true);
        } else {
          setMessage('Please log in');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setMessage('Error: ' + error.message);
        setIsLoggedIn(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMessage('Please log in');
  };

  return (
    <div className="App">
      <h1>Welcome to My React App</h1>
      {isLoggedIn ? (
        <>
          <p>{message}</p>
          <UserProfile />
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Login setIsLoggedIn={setIsLoggedIn} />
          <Register />
        </>
      )}
    </div>
  );
}

export default App;
