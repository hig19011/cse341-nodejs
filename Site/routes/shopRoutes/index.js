const shopRoutes = require('express').Router();
const mongoConnect = require('../../util/shop/database').mongoConnect
const User = require('../../models/shopModels/user');

shopRoutes
   .use((req, res, next) =>{
      User.findById('60983d97cf15132ad799b31d')
         .then(user => {
            req.user = new User(user._id, user.name, user.email, user.cart);
            next();
         })
         .catch(err => console.log(err));
   })
   .use('/', require('./shop'))
   .use('/admin', require('./admin'))
   .use('', (req, res, next) => {
      res.status(404).render('pages/shop/404', { pageTitle: 'Page Not Found', path: '' });
   });

mongoConnect(() =>{   
});


module.exports = shopRoutes;