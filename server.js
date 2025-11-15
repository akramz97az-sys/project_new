// backend-api/server.js
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./app/routes/authRoutes');
const userRoutes = require('./app/routes/userRoutes');
const cors = require('cors'); 
const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

app.use(express.json()); 
app.use(cors());

app.use('/api/users', userRoutes);

app.use('/api', authRoutes); 

app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});