const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb+srv://gene:cit341@cluster0.okvaf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(result => {
    console.log('Connected!');
  })
  .catch(err => {
    console.log(err);
  });