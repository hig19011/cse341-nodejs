const fs = require('fs');
const path = require('path');
const dirName = require('../../util/path');
const Cart = require('../../models/shopModels/cart');

const p = path.join(dirName, 'data', 'shop', 'products.json');

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

  constructor(id, title, imageUrl, description, price, height, width, depth, weight) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.weight = weight;
  }

  save = () => {
    getProductsFromFile((products) => {
      if(this.id) {
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        this.id = Math.random().toString();
        products.push(this);      
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  };

  static deleteById(id) {
    getProductsFromFile(products => {
      const product = products.find(prod => prod.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      console.log(JSON.stringify(updatedProducts));
      fs.writeFile(p, JSON.stringify(updatedProducts), err => {
        if(!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static fetchAll = (cb) => {
    getProductsFromFile(cb);
  };

  static findById = (id, cb) => {
    getProductsFromFile(products => {
      const product = products.find(p => p.id === id);
      cb(product);
    })
  }

  

}