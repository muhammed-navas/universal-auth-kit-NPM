const express = require('express');
const cookieParser = require('cookie-parser');
const { authMiddleware, authRoutes } = require('universal-auth-kit/server');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Auth routes
app.use('/auth', authRoutes);

// Public route
app.get('/api/public', (req, res) => {
  res.json({ message: 'This is a public route' });
});

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ 
    message: 'This is a protected route', 
    user: req.user 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
