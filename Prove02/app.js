var PORT = process.env.PORT || 3000;

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const bookRoutes = require('./routes/books');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bookRoutes);

app.listen(PORT);
