const express = require('express');
var router = express.Router();

let books = [];

router.get('/', (req, res, next)=>{
  res.render('book-list', {
    pageTitle: 'Book List',
    path: '/'
  });
});

router.get('/add-book', (req,res,next) => {
  res.render('add-book', {
    pageTitle: 'Add Book',
    path: '/add-book'
  });
});

router.post('/add-book',(req, res, next)=>{
  var book = {title: req.body.name, description: req.body.description };
  books.push(book);
  res.redirect('/', 302);
});



module.exports = router;