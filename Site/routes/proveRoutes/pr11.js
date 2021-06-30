const express = require('express');
const router = express.Router();
const io = require('../../util/socket');

const baseData = require('../../data/pr11-data.json');

router.get('/', (req, res, next) => {
  res.render('pages/prove/prove11/pr11', {
    title: 'Prove 11',
    path: '/prove/pr11'
  });
});

addName = (data, callback) => {
  var hasName = baseData.avengers.some(n => n.name.toLowerCase() === data.newName.toLowerCase());
  if (hasName) {
    callback("Duplicate Avenger"); 
    return;   
  }

  baseData.avengers.push({ name: data.newName, soloMovies: data.soloMovies, favoriteColor: data.favoriteColor });
  io.getIO().emit('avengers', { action: 'updatedList', data: baseData });
  callback("");
}

module.exports = {
  router: router,
  ioHandlers: (io, socket) =>{
    socket.on('fetchAll',()=>io.emit('avengers', { action: 'updatedList', data: baseData }));
    socket.on('addName', (data, callback) => addName(data, callback));
  }
};
