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

  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    getProductsFromFile((products) => {
      products.push(this);
      console.log(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log(err);
      });
    });
  };

  static fetchAll = (cb) => {
    getProductsFromFile(cb);
  };

}