const Product = require('../../models/shopModels/product');
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
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('pages/shop/shop/index', {
        prods: products,
        pageTitle: 'Home',
        path: '/'
      });
    });
};

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
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(req.user);
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
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
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('pages/shop/shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products: products
      });
      order.save();
    })
    .then(result => {
      return req.user.clearCart();
    }).then(() => {
      res.redirect('pages/shop/shop/orders');
    })
    .catch(err => console.log(err));
}

exports.getCheckout = (req, res, next) => {
  res.render('pages/shop/shot/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};