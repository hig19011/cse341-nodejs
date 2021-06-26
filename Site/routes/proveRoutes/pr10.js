const express = require('express');
const router = express.Router();

const baseData = require('../../data/pr10-data.json');

router.get('/', (req, res, next) => {
  res.render('pages/prove/prove10/pr10', {
      title: 'Prove 10',
      path: '/prove/pr10'
  });
});

router.get('/fetchAll', (req, res, next) => {
  res.json(baseData);
});

router.post('/addName', (req, res, next) => {
  if(req.body.newName !== undefined){
    var name = req.body.newName;
    var soloMovies = req.body.soloMovies;
    var favoriteColor = req.body.favoriteColor;

    var hasName = baseData.avengers.some(n => n.name.toLowerCase() === name.toLowerCase());
    if(hasName){
      res.sendStatus(200);    
      return;  
    }


    baseData.avengers.push({name: name, soloMovies: soloMovies, favoriteColor: favoriteColor});
    res.sendStatus(200);    
  }
  else {
    res.sendStatus(400);
  }
});


module.exports = router;