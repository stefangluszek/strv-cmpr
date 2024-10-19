require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const selectRouter = require('./routes/select');

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Use cookie parser middleware
app.use(cookieParser());

// Configure session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Use the secret key from the .env file
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the auth and workout routes
app.use(authRoutes);     // For authentication
app.use(workoutRoutes);  // For workouts
app.use(selectRouter);

app.get('/', (req, res) => {
    res.render('index');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
