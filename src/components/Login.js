import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  // 自動填充管理員賬號（僅在開發環境）
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setUsername('meansfeel123');
      setPassword('Cs6626719!');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 檢查是否是管理員賬號
      const isAdmin = username === 'meansfeel123';
      console.log('Login attempt:', { username, isAdmin });

      const result = await login(username, password);
      console.log('Login result:', result);

      if (result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Login failed:', result.message);
        setError(result.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          padding: theme.spacing(3)
        }}
      >
        <Card 
          elevation={3} 
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography 
              component="h1" 
              variant="h5" 
              align="center" 
              gutterBottom
              sx={{ 
                fontWeight: 500,
                color: theme.palette.primary.main
              }}
            >
              Arbitrage Booster Bot
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2, width: '100%' }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                sx={{ mb: 2 }}
                error={!!error}
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                error={!!error}
                InputProps={{
                  sx: { borderRadius: 1.5 }
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !username || !password}
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  backgroundColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
