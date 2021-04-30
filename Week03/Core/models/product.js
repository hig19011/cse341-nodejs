const fs = require('fs');
const path = require('path');
const dirName = require('../util/path');


const p = path.join(dirName, 'data', 'products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContents) => {
    if (err) {
      cb([])
    } else {
      cb(JSON.parse(fileContents));
    }
  });
}

module.exports = class Product {

  constructor(title) {
    this.title = title;
  }

  save = () => {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll = (cb) => {
    getProductsFromFile(cb);
  };

}