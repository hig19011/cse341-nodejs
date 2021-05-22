const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport')



const User = require('../../models/shopModels/user')

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {   
    api_key: process.env.SEND_GRID 
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('pages/shop/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  User.findOne({email: email})
    .then(user => {
      if(!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/shop/auth/login')
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            if(err){
              console.log(err);
            }
            return res.redirect('/shop/');
          });         
        }
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/shop/auth/login')
      })
      .catch(err => {
        return res.redirect('/shop/auth/login')
      })
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


exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('pages/shop/auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
    .then(userDoc => {
      if(userDoc) {
        req.flash('error','Email already exists. Either login in with the email or register a different email.');
        return res.redirect('/shop/auth/signup');
      }
      return bcrypt.hash(password, 12)
        .then( hashedPassword => {
          const user = new User({
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then( result => {
          res.redirect('/shop/auth/login');
          return transporter.sendMail({
            to: email,
            from: 'hig19011@byui.edu',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
          });
          
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));
};