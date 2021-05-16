const User = require('../../models/shopModels/user')

exports.getLogin = (req, res, next) => {
  res.render('pages/shop/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('6098ad2e4627cfc1441ffd9a')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        console.log(err);
        res.redirect('/shop/');
      });
      
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => { 
  req.session.destroy(err => {
    if(err) {
      console.log('Logout error: '+err);    
    }
    res.redirect('/shop/');
  });
};