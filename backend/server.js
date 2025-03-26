const express = require('express');
const colors = require('colors');
require('dotenv').config({ path: './backend/.env' });

const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const path = require('path');

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is missing from .env file'.red);
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Serve Frontend (only in production)
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(frontendPath));

  app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));
} else {
  app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to the Support Desk API' }));
}

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`.cyan.bold));
