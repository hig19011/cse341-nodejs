const shopRoutes = require('express').Router();

shopRoutes
   .use('/', require('./shop'))
   .use('/admin', require('./admin'))    
   .use((req, res, next) => {
    // 404 page
    res.render('pages/shop/404', { title: '404 - Page Not Found', path: req.url })
  });

module.exports = shopRoutes;