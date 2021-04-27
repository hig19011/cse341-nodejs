const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use('/add-product',(req, res, next) => {
  res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>');
})

app.post('/product',(req, res, next) => {
  console.log(req.body);
  res.redirect('/');
  return res.end();
})


app.use('/users',(req, res, next)=> {
  console.log('users route');
  res.send("<h1>Users</h1>");
})

app.use('/',(req, res, next) => {
  console.log("base route");  
  res.send('<h1>Home page via Express</h1>');    
});


app.listen(3000); 