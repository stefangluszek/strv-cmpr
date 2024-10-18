const express = require('express');
const app = express();
const path = require('path');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');

require('dotenv').config(); // Load .env variables

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Add this new route at the top of your routes
app.get('/', (req, res) => {
    res.render('index');
});

// Use the auth and workout routes
app.use(authRoutes);     // For authentication
app.use(workoutRoutes);  // For workouts

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
