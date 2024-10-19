require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const addressRoutes = require('./routes/addressRoutes');
const cors = require('cors');


const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/addresses', addressRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});