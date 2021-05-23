const express = require('express');
const {check, body} = require('express-validator/check');

const authController = require('../../controllers/shopControllers/auth');
const User = require('../../models/shopModels/user');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login',
  [ 
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail(),
    body('password', 'Password has to be valid.')
      .isLength({min: 5})
      .isAlphanumeric()
      .trim(),
  ]
  , authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', 
  [
    check('firstName', 'First Name is required').isAlpha().trim(),
    check('lastName', 'Last Name is required').isAlpha().trim(),
    check('phone', 'A valid phone number is required').isMobilePhone().trim(),
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
      .custom((value, {req}) => {
        return User.findOne({ email: value })
          .then(userDoc => {
            if (userDoc) {
              return Promise.reject('Email already exists. Either login in with the email or register a different email.');
            }
          });
        }),
    body('password', 'Please enter a password with only numbers and text and at least 5 characters')
      .isLength({min:5})
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .trim()
      .custom((value, {req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords have to match!');      
        }
        return true;
      })
  ],
  authController.postSignup)
router.post('/logout', authController.postLogout);
router.get('/reset', authController.getReset);
router.post('/reset',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .normalizeEmail()
  ], authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', 
  [
    body('password', 'Please enter a password with only numbers and text and at least 5 characters')
      .isLength({min:5})
      .isAlphanumeric()
      .trim()
  ], 
  authController.postNewPassword);


module.exports = router;