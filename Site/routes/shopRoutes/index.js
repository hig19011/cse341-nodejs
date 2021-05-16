const shopRoutes = require('express').Router();

shopRoutes
   .use('/', require('./shop'))
   .use('/admin', require('./admin'))
   .use('/auth', require('./auth'))
   .use('', (req, res, next) => {
      res.status(404).render('pages/shop/404', { 
         pageTitle: 'Page Not Found', 
         path: '',
         isAuthenticated: req.session.isLoggedIn });  
   });

module.exports = shopRoutes;