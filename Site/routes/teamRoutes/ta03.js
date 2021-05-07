
const express = require('express');
const router = express.Router();
const https = require('https');


router.get('/', (req, res, next) => {
    getList(data => {
        res.render('pages/team/ta03', {
            title: 'Team Activity 03',
            path: '/ta03',
            data: data
        });
    })
});

router.post('/', (req, res, next) => {

    getList(data => {
        data = data.filter(d => d.tags.includes(req.body.keyword));
        res.render('pages/team/ta03', {
            title: 'Team Activity 03',
            path: '/ta03',
            data: data
        });
    });    
})

const options = {
    hostname: 'byui-cse.github.io',
    port: 443,
    path: '/cse341-course/lesson03/items.json',
    method: 'GET'
}

getList = (cb) => {
    let jsonResponse = '';
    const dataReq = https.request(options, dataRes => {

        dataRes.on('data', data => {
            jsonResponse = jsonResponse + data;
        });

        dataRes.on('end', () => {
            cb(JSON.parse(jsonResponse))
        });
    });

    dataReq.on('error', error => {
        console.error(error);
    });

    dataReq.end();
}

module.exports = router;