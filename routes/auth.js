const express = require('express');
const axios = require('axios');
const router = express.Router();

// Strava OAuth callback route
router.get('/auth/strava/callback', async (req, res) => {
    const code = req.query.code;

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        });

        const accessToken = tokenResponse.data.access_token;

        // Redirect to workouts page with access_token in query
        res.redirect(`/workouts?access_token=${accessToken}`);
    } catch (error) {
        console.error('Error getting access token:', error);
        res.send('Failed to authenticate with Strava');
    }
});

module.exports = router;
