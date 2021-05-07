//TA02 PLACEHOLDER
// Remember, you can make more of these placeholders yourself! 
const express = require('express');
const router = express.Router();
let errorMessage = "";

let users = ['Jim','Amy','Bart'];

router.get('/',(req, res, next) => {
    res.render('pages/team/ta02', { 
        title: 'Team Activity 02', 
        path: '/team/ta02',
        users: users,
        errorMessage: errorMessage
    });
    errorMessage = "";
});

router.post('/addUser', (req, res, next) => {
    if(!users.includes(req.body.user)) {
        users.push(req.body.user);        
    } else {
        errorMessage = "User name " + req.body.user + " already exists.";
    }   
    
    res.redirect(302,'/team/ta02');
});

router.post('/removeUser', (req, res, next) => {
    var user = req.body.user;
    var orgCount = users.length;
    users = users.filter(x=>x !== user)
    var finalCount = users.length;
    if(orgCount == finalCount){
        errorMessage = "User name " + user + " not found in the list.";
    }

    res.redirect(302,'/team/ta02');
});

module.exports = router;