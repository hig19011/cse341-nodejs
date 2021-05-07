const routes = require('express').Router();
const team = require('./teamRoutes');
const prove = require('./proveRoutes');
const shop = require('./shopRoutes');


routes.use('/team', team)
  .use('/prove', prove)
  .use('/shop', shop)
  .get('/', (req, res, next) => {
    res.render('pages/team/index', { title: 'Welcome to my CSE341 repo', path: '/' })
  })
  .use((req, res, next) => {
    // 404 page
    res.render('pages/404', { title: '404 - Page Not Found', path: req.url })
  });

module.exports = routes;