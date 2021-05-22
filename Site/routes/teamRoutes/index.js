const teamRoutes = require('express').Router();

teamRoutes
    .use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    })
   .use('/ta01', require('./ta01'))
   .use('/ta02', require('./ta02')) 
   .use('/ta03', require('./ta03')) 
   .use('/ta04', require('./ta04'))
   .use('/ta05', require('./ta05'))
   .get('/', (req, res, next) => {
     // This is the primary index, always handled last. 
     res.render('pages/team/index', {
       title: 'Welcome to my CSE341 repo', 
       path: '/team'});     
    })
   .use((req, res, next) => {
     // 404 page
     res.render('pages/404', {title: '404 - Page Not Found', path: req.url})
   });

module.exports = teamRoutes;