
const express = require('express');
const router = express.Router();
const https = require('https');


router.get('/', (req, res, next) => {
    getList(data => {
        res.render('pages/team/ta05', {
            title: 'Team Activity 05',
            path: '/ta05',
            counter: req.session.counter,
            theme: req.session.theme
        });
    })
});

router.post('/change-style', (req, res, next) => {
  if(!req.session.theme) {
    req.session.theme = 'dark';
  } else if( req.session.theme == 'light') {
      req.session.theme = 'dark';
  } else {
    req.session.theme = 'light';
  }
  res.redirect('/team/ta05')
})

router.post('/counter', (req, res, next) => {
  if(!req.session.counter) {
    req.session.counter = 0;
  }
    let counter = req.session.counter + 1;
    req.session.counter = counter;
    console.log(req.session.counter);
    res.redirect('/team/ta05')
    
})


router.post('/reset', (req, res, next) => {
    req.session.destroy();
    res.redirect('/team/ta05')    
})


module.exports = router;