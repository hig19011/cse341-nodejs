//TA04 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {
    res.render('pages/team/ta04', { 
        title: 'Team Activity 04', 
        path: '/ta04'
    });
});

module.exports = router;