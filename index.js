require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('./config/db')();

const app = express();
const PORT = process.env.PORT || 3333;

// Initial Middlewares
app.use(cors({
    origin: process.env.FRONT_END_URL, // Your frontend URL
    credentials: true, // Allow credentials (cookies)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Customize as needed
}));

app.use(express.static(path.join(__dirname, './client/dist')));



app.use('/uploads/products', express.static(path.join(__dirname, './public/uploads/products')));  
app.use(cookieParser());

// Increase body-parser limit
app.use(express.json({ limit: '100mb' })); // Set to a higher limit as needed
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist', 'index.html'));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));