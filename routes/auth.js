const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/auth/strava', (req, res) => {
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&scope=activity:read_all`;
    res.redirect(authUrl);
});

// Strava OAuth callback route
router.get('/auth/strava/callback', async (req, res) => {
    const { code } = req.query;

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post('https://www.strava.com/oauth/token', {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code: code,
            grant_type: 'authorization_code'
        });


        const { access_token, refresh_token, expires_at } = tokenResponse.data;

        // Fetch athlete data
        const athleteResponse = await axios.get('https://www.strava.com/api/v3/athlete', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const athleteData = athleteResponse.data;

        // Store tokens and athlete data in cookies
        res.cookie('access_token', access_token, { httpOnly: true, secure: true, maxAge: (expires_at - Math.floor(Date.now() / 1000)) * 1000 });
        req.session.athleteData = athleteData;

        // Redirect to workouts page or home page
        res.redirect('/workouts');
    } catch (error) {
        console.error('Error during Strava authentication:', error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = router;
