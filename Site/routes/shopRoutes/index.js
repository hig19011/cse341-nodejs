const shopRoutes = require('express').Router();
const { request } = require('express');
const errorRoutes = require('../../controllers/shopControllers/error');

shopRoutes
   
   .use('/', require('./shop'))
   .use('/admin', require('./admin'))
   .use('/auth', require('./auth'))
   .get('/500',errorRoutes.get500)
   .use('', errorRoutes.get404)
   .use((error, req, res, next) => {
      //res.redirect('/shop/500');
      res.status(500).render('pages/shop/500', { 
         pageTitle: 'Error!', 
         path: '/500',
         isAuthenticated: req.session.isLoggedIn 
      });  
   });

module.exports = shopRoutes;