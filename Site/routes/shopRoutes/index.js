const shopRoutes = require('express').Router();

shopRoutes
   .use((req, res, next) => {
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      if(req.session.isLoggedIn){
         res.locals.userName = req.session.user.firstName;
      }
      next();
   })
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