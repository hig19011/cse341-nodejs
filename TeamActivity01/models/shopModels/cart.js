const fs = require('fs');
const path = require('path');
const dirName = require('../../util/path');

const p = path.join(dirName, 'data', 'shop', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {

    //fetch the previous cart
    fs.readFile(p, (err, fileContents) => {
      let cart = {products: [], totalPrice: 0}
      if(!err) {
        cart = JSON.parse(fileContents);
      }

      // analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];
 
      // Add new product / increase quantity
      let updatedProduct;
      if(existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;      
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = {id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct]
      }

      cart.totalPrice = cart.totalPrice + +productPrice; 
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContents) => {
      if(err) {
        return;
      }
      
      const updatedCart = {...JSON.parse(fileContents)};      
      const product = updatedCart.products.find(prod => prod.id === id);
      if(!product) {
        return;
      }
      const productQty = product.qty;
      updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  };

  static getCart(cb) {
    fs.readFile(p, (err, fileContents) => {
      const cart = JSON.parse(fileContents);
      if(err) {
        cb(null)
      } else {
        cb(cart);
      }
    });
  }

}