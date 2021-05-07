const Product = require('../../models/shopModels/product');
const Cart = require('../../models/shopModels/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('pages/shop/shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/products'
    });
  });  
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('pages/shop/shop/product-detail', {
      pageTitle: product.title,
      path: '/products',
      product: product
    })
  });  
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render('pages/shop/shop/index', {
      prods: products,
      pageTitle: 'Home',
      path: '/'
    });
  });  
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {   
      const cartProducts = [];
      for(product of products) {
        const cartProductData = cart.products.find(prod=> prod.id === product.id)
        if(cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('pages/shop/shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      });
    });
  });  
};

exports.postCart = (req,res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/shop/cart')
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/shop/cart');
  });
}

exports.getOrders= (req, res, next) => {
  res.render('pages/shop/shop/orders', {
    pageTitle: 'Your Orders',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('pages/shop/shot/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};