/*******************************************************************************
 * Feel free to remove this comment block and all other comments after pulling. 
 * They're for information purposes only.
 * 
 * This layout is provided to you for an easy and quick setup to either pull
 * or use to correct yours after working at least 1 hour on Team Activity 02.
 * Throughout the course, we'll be using Express.js for our view engines.
 * However, feel free to use pug or handlebars ('with extension hbs'). You will
 * need to make sure you install them beforehand according to the reading from
 * Udemy course. 
 * IMPORTANT: Make sure to run "npm install" in your root before "npm start"
 *******************************************************************************/
// Our initial setup (package requires, port number setup)
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require("./routes");
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
var cookieParser = require('cookie-parser');

const csrf = require('csurf');
const flash = require('connect-flash');
const cors = require('cors'); // Place this with other requires (like 'path' and 'express')

const User = require('./models/shopModels/user');

const corsOptions = {
   origin: "https://cse341-gh-site.herokuapp.com/",
   optionsSuccessStatus: 200
};
 
const options = {
   useUnifiedTopology: true,
   useNewUrlParser: true,
   useCreateIndex: true,
   useFindAndModify: false,
   family: 4
};

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000
const MONGODB_URL = process.env.MONGODB_URL;


const app = express();
const store = new MongoDbStore({ uri: MONGODB_URL, collections: 'sessions' });
const csrfProtection = csrf({cookie:true });

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(cors(corsOptions))
   .use(bodyParser({ extended: false })) // For parsing the body of a POST
   .use(bodyParser.json())
   //.use(express.json({extended:false}))
   .use(session({ secret: 'Blue Licorice', resave: false, saveUninitialized: false, store: store }))
   .use(cookieParser())
   .use(csrfProtection)
   .use(flash())
   .use((req, res, next) => {
      res.locals.isAuthenticated = req.session.isLoggedIn;
      res.locals.csrfToken = req.csrfToken();
      if(req.session.isLoggedIn && req.session.user){
         res.locals.userName = req.session.user.firstName;
      }
      next();
   })
   .use((req, res, next) => {      
      if (!req.session.user) {
         return next();
      }
      User.findById(req.session.user._id)
         .then(user => {
            //throw new Error('test');
            if(!user) {
               return next();
            }
            req.user = user;
            next();
         })
         .catch(err => {
            next(new Error(err));
         });      
   })
   .use('/', routes);

mongoose
   .connect(MONGODB_URL, options)
   .then(result => {
      console.log("Connected:");
      app.listen(PORT, () => console.log(`Listening on ${PORT}`));
   })
   .catch(err => {
      console.log(err);
   });

