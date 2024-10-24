import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Paper, Avatar, TextField, Button, Snackbar, CircularProgress } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { AuthContext } from '../context/AuthContext';

function UserProfile() {
  const { user, login } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('No token found. Please log in.');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        setMessage('Error fetching user data: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/user`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      login(localStorage.getItem('token'), response.data);
      setEditing(false);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!userData) {
    return <Typography>No user data available.</Typography>;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h4" component="h1">
            User Profile
          </Typography>
        </Box>
        {editing ? (
          <Box component="form">
            <TextField
              fullWidth
              margin="normal"
              name="username"
              label="Username"
              value={userData.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              value={userData.email}
              onChange={handleChange}
            />
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
              Save
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1">Username: {userData.username}</Typography>
            <Typography variant="body1">Email: {userData.email}</Typography>
            <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mt: 2 }}>
              Edit Profile
            </Button>
          </>
        )}
      </Paper>
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </Box>
  );
}

export default UserProfile;
