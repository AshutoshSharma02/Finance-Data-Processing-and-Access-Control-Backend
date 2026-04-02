// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Apply Rate Limiting (Max 100 requests per 15 minutes per IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: { msg: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Middleware to parse JSON bodies
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
    res.send('<h1>🚀 Finance API is Running!</h1><p>The backend is active and listening on port 5000.</p>');
});

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/records', require('./routes/records'));
app.use('/api/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`🚀 SERVER STARTED SUCCESSFULLY!`);
    console.log(`🌍 Local Access: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
    console.log('MongoDB Connected Successfully\n');
});
