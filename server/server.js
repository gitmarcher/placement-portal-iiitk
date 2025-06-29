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
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
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
