//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();

router.get('/',(req, res, next) => {

    const https = report

    //https://byui-cse.github.io/cse341-course/lesson03/items.json
    res.render('pages/team/ta03', { 
        title: 'Team Activity 03', 
        path: '/ta03',
    });
});

module.exports = router;