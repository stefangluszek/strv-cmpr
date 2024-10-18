const express = require('express');
const axios = require('axios');
const router = express.Router();

// Workouts route: fetch paginated Run workouts from Strava API
router.get('/workouts', async (req, res) => {
    const accessToken = req.query.access_token;
    const page = parseInt(req.query.page) || 1;  // Default to page 1 if no page query parameter
    const limit = 9;  // Limit results to 9 per page

    if (!accessToken) {
        return res.send('Access token is missing or invalid');
    }

    try {
        // Fetch user's workouts from Strava API with pagination
        const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { per_page: limit, page: page }
        });

        // Filter the workouts to only include 'Run' types
        const runs = response.data.filter(workout => workout.type === 'Run');

        // Render the workouts page, passing the runs, current page, and access token
        res.render('workouts', { workouts: runs, page, accessToken });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.send('Error fetching workouts');
    }
});

module.exports = router;
