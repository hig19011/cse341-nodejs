//TA03 PLACEHOLDER
const express = require('express');
const router = express.Router();
const https = require('https');

const options = {
    hostname: 'byui-cse.github.io',
    port: 443,
    path: '/cse341-course/lesson03/items.json',
    method: 'GET'
}

router.get('/',(req, res, next) => {

    const dataReq = https.request(options, res => {
        console.log('statusCode: ${req.statusCode')

        res.on('data', d => {
            process.stdout.write(d);
        });
    }, )

    dataReq.on('error', error => {
        console.error(error);
    });

    dataReq.end();

    //https://byui-cse.github.io/cse341-course/lesson03/items.json
    res.render('pages/team/ta03', { 
        title: 'Team Activity 03', 
        path: '/ta03',
    });
});

module.exports = router;