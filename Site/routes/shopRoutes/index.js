const shopRoutes = require('express').Router();
//const mongoConnect = require('../../util/shop/database').mongoConnect;
const User = require('../../models/shopModels/user');
const mongoose = require('mongoose');


shopRoutes
   .use((req, res, next) => {
      User.findById('6098ad2e4627cfc1441ffd9a')
         .then(user => {
            req.user = user;
            next();
         })
         .catch(err => console.log(err));
   })
   .use('/', require('./shop'))
   .use('/admin', require('./admin'))
   .use('', (req, res, next) => {
      res.status(404).render('pages/shop/404', { pageTitle: 'Page Not Found', path: '' });
   });

mongoose.connect('mongodb+srv://gene:cit341@cluster0.okvaf.mongodb.net/Shop?retryWrites=true&w=majority')
   .then(result => {
      User.findOne().then(user => {
         if (!user) {
            const user = new User({
               name: 'Gene',
               email: 'hig19011@byui.edu',
               cart: {
                  items: []
               }
            });
            user.save();
         }
      });      
   })
   .catch(err => console.log(err));
// mongoConnect(() =>{   
// });


module.exports = shopRoutes;