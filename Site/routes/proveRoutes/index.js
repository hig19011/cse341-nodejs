const proveRoutes = require('express').Router();
const router11 = require('./pr11').router;

proveRoutes
   .use('/pr01', require('./pr01'))
   .use('/pr02', require('./pr02')) 
   .use('/pr03', require('./pr03')) 
   .use('/pr04', require('./pr04'))
   .use('/pr08', require('./pr08'))
   .use('/pr09', require('./pr09'))
   .use('/pr10', require('./pr10'))
   .use('/pr11', router11)
   .get('/', (req, res, next) => {
     // This is the primary index, always handled last. 
     res.render('pages/prove/index', {
       title: 'Welcome to my CSE341 repo', 
       path: '/prove'});     
    });

module.exports = proveRoutes;