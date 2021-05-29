const Product = require('../../models/shopModels/product');
const User = require('../../models/shopModels/user');
const Order = require('../../models/shopModels/order');
const { getDb } = require('../../util/shop/database');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {      
      res.render('pages/shop/shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/products'
      });
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('pages/shop/shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product: product
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      let miniList = getRandom(products, 3)

      res.render('pages/shop/shop/index', {
        prods: miniList,
        pageTitle: 'Home',
        path: '/'
      });
    });
};

function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('pages/shop/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {      
      return req.user.addToCart(product);
    })
    .then(result => {
      res.redirect('/shop/cart');
    });

}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postCartIncrementProduct = (req, res, next) => {
  const prodId = req.body.productId;  
  req.user.incrementProduct(prodId)
    .then(result => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      console.log('Error: ' + err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.postCartDecrementProduct = (req, res, next) => {
  const prodId = req.body.productId;  
  req.user.decrementProduct(prodId)
    .then(result => {
      res.redirect('/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('pages/shop/shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });

      var total = 0;
      products.forEach(x => total = total + (x.quantity * x.product.price))
      const order = new Order({
        user: {
          email: req.session.user.email,
          userId: req.session.user
        },        
        products: products,
        totalCost: total.toFixed(2)
      });
      order.save();
    })
    .then(result => {
      return req.user.clearCart();
    }).then(() => {
      res.redirect('/shop/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

exports.throwError = (req, res, next) => {
  throw new Error("Error: This is a test error.")
}

exports.getCheckout = (req, res, next) => {
  res.render('pages/shop/shot/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};