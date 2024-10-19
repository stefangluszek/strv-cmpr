const express = require('express');
const router = express.Router();

router.post('/workouts/select', (req, res) => {
    const selectedWorkouts = req.body.selectedWorkouts;

    if (!Array.isArray(selectedWorkouts) || selectedWorkouts.length !== 2) {
        return res.status(400).send('Please select exactly two workouts.');
    }

    // Store the selected workouts in the session
    req.session.selectedWorkouts = selectedWorkouts;

    // Redirect to the comparison page
    res.redirect('/workouts/compare');
});

module.exports = router;
