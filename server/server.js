const express = require('express');
const cors=require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mainRoutes = require('./cooking.js');
dotenv.config();
const app = express();
const connectToMongoDB = require('./src/db/db.js');

app.use(express.json());
app.use(cookieParser());

// CORS configuration for deployment
console.log('FRONTEND_URL from env:', process.env.FRONTEND_URL);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174', // Allow both common Vite ports
  'http://localhost:3000'  // Also allow common React dev port
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Placement Portal API is running');
});

app.use(mainRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server is running on port ${PORT}`);
});
