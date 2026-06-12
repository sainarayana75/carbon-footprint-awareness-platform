const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Configure Helmet for security headers (and adjust CSP for single-page apps)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://*"],
        connectSrc: ["'self'", "https://*"]
      }
    }
  })
);

// 2. Strict CORS Configuration mapping only safe request flows
const allowedOrigins = [
  'http://localhost:5173', // Vite development server
  'http://localhost:8080'  // Production port
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('CORS Policy: Request from this origin is not allowed.'));
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// 3. Body Parsing Middleware
app.use(express.json());

// 4. Serve React build output statically in production
app.use(express.static(path.join(__dirname, 'public')));

// 5. Mount API Routes
app.use('/api', apiRouter);

// 6. SPA Route Handler - Redirect all other traffic to built index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. Global Error Handler - Neutralize server crashes and hide debugging stack details
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: 'An unexpected error occurred.',
    message: process.env.NODE_ENV === 'production' ? message : err.message
  });
});

// Start Express Listener
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[EcoSphere Backend] Running securely on port ${PORT}`);
  });
}

module.exports = app;
