const crypto = require('crypto'); // used for created email reset token
const bcrypt = require('bcryptjs'); // used for encrypting email password
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport')
const { validationResult } = require('express-validator/check');

const User = require('../../models/shopModels/user')

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SEND_GRID
  }
}));

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('pages/shop/auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: message,
    oldInput: {      
      email: '',
      password: ''      
    },
    validationErrors: []
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.render('pages/shop/auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: errors.array()[0].msg,
      oldInput: {      
        email: email,
        password: password      
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('pages/shop/auth/login', {
          pageTitle: 'Login',
          path: '/login',
          errorMessage: 'Invalid email or password.',
          oldInput: {      
            email: email,
            password: password      
          },
          validationErrors: []
        });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) {
                console.log(err);
              }
              return res.redirect('/shop/');
            });
          }
          return res.status(422).render('pages/shop/auth/login', {
            pageTitle: 'Login',
            path: '/login',
            errorMessage: 'Invalid email or password.',
            oldInput: {      
              email: email,
              password: password      
            },
            validationErrors: []
          });
        })
        .catch(err => {
          return res.redirect('/shop/auth/login')
        })
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log('Logout error: ' + err);
    }
    res.redirect('/shop/');
  });
};


exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('pages/shop/auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMessage: message,
    oldInput: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  });
};

exports.postSignup = (req, res, next) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if(!errors.isEmpty()) { 
    return res.status(422).render('pages/shop/auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password,
        confirmPassword: confirmPassword
      },
      validationErrors: errors.array()
    });
  }
  bcrypt.hash(password, 12)
  .then(hashedPassword => {
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
  .then(result => {
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
  })  
  .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render('pages/shop/auth/reset', {
    pageTitle: 'Reset',
    path: '/reset',
    errorMessage: message,
    oldInput: {      
      email: ''        
    },
    validationErrors: []
  });
}

exports.postReset = (req, res, next) => {  
  const errors = validationResult(req);
  if(!errors.isEmpty()) {   
    return res.render('pages/shop/auth/reset', {
      pageTitle: 'Reset',
      path: '/reset',
      errorMessage: errors.array()[0].msg,
      oldInput: {      
        email: req.body.email          
      },
      validationErrors: errors.array()
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/shop/auth/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No account with that email found.');
          return res.redirect('/shop/auth/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(result => {     
          const emailBody = `<p>You requested a password reset</p>
              <p>Click this <a href="${process.env.API_ENDPOINT}/shop/auth/reset/${token}">link</a> to set a new password</p>
            `;
          console.log(emailBody);
          return transporter.sendMail({
          to: req.body.email,
          from: 'hig19011@byui.edu',
          subject: 'Password reset',
          html: emailBody
        });
      })
      .then(data => {
        res.redirect('/shop/');
      })
      .catch(err => {
        console.log(err);
      });
  });
}
  
exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()} })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }      
      res.render('pages/shop/auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
        oldInput: {      
          password: req.body.password
        },
        validationErrors: []
      });
    })
    .catch(err => {
      console.log(err);
    }); 
};



exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  const errors = validationResult(req);
  if(!errors.isEmpty()) {  
    res.render('pages/shop/auth/new-password', {
      pageTitle: 'New Password',
      path: '/new-password',
      errorMessage: errors.array()[0].msg,
      userId: userId,
      passwordToken: passwordToken,
      oldInput: {      
        email: newPassword         
      },
      validationErrors: errors.array()
    });
  }

  let resetUser; 
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
  .then(user => {    
    resetUser = user;
    return bcrypt.hash(newPassword, 12);
  })
  .then(hashedPassword => {    
    resetUser.password = hashedPassword;
    resetUser.restToken = null;
    resetUser.resetTokenExpiration = null;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/shop/auth/login');
  })
  .catch(err => {
    console.log(err);
  });
};