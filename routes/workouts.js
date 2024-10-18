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

        // Collect unique gear IDs
        const gearIds = new Set(runs.map(run => run.gear_id).filter(Boolean));

        // Fetch gear data for each unique gear ID
        const gearMap = new Map();
        for (const gearId of gearIds) {
            try {
                const gearResponse = await axios.get(`https://www.strava.com/api/v3/gear/${gearId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                gearMap.set(gearId, gearResponse.data);
            } catch (gearError) {
                console.error(`Error fetching gear data for ID ${gearId}:`, gearError);
                gearMap.set(gearId, { name: 'Unknown' });
            }
        }

        // Add gear data to each run
        const runsWithGear = runs.map(run => ({
            ...run,
            gear: gearMap.get(run.gear_id) || { name: 'Unknown' }
        }));

        // Render the workouts page, passing the runs with gear data, current page, and access token
        res.render('workouts', { workouts: runsWithGear, page, accessToken });
    } catch (error) {
        console.error('Error fetching workouts:', error);
        res.send('Error fetching workouts');
    }
});

module.exports = router;
