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
app.use(cors({origin: 'http://localhost:5173', credentials: true}));



app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(mainRoutes);


const IP = process.env.IP || 'localhost';
const PORT = process.env.PORT || 8000;

app.listen( PORT , IP , () => {
    connectToMongoDB();
    console.log(`Server is running on http://${IP}:${PORT}`);
});
