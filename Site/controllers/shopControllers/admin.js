const mongodb = require('mongodb');
const { validationResult } = require('express-validator/check');

const Product = require('../../models/shopModels/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('pages/shop/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []   
  })
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const height = req.body.height;
  const width = req.body.width;
  const depth = req.body.depth;
  const weight = req.body.weight;

  const errors = validationResult(req);  
  if(!errors.isEmpty()) {
    return res.status(422).render('pages/shop/admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {      
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        height: height,
        width: width,
        depth: depth, 
        weight: weight
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }

  const product = new Product({ 
    title: title, 
    imageUrl: imageUrl, 
    description: description, 
    price: price,
    height: height,
    width: width,
    depth: depth,
    weight: weight,
    userId: req.user
  });

   product.save()
    .then(result => {
      console.log('Created Product')
      res.redirect('/shop/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {

  
  Product.find({userId: req.user._id})
    //.populate('userId')
    .then(products => {
      res.render('pages/shop/admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/shop/');
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/shop/');
      }
      res.render('pages/shop/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: false,
        product: product,        
        errorMessage: null,
        validationErrors: []

      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updatedHeight = req.body.height;
  const updatedWidth = req.body.width;
  const updatedDepth = req.body.depth;
  const updatedWeight = req.body.weight;
  const editMode = true;

  const errors = validationResult(req);
   if(!errors.isEmpty()) {
      return res.render('pages/shop/admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        hasError: true,       
        product: {      
          _id: prodId,
          title: updatedTitle,
          imageUrl: updatedImageUrl,
          price: updatedPrice,
          description: updatedDesc,
          height: updatedHeight,
          width: updatedWidth,
          depth: updatedDepth, 
          weight: updatedWeight
        },
        errorMessage: errors.array()[0].msg,
        validationErrors: errors.array()
    })
  }

  Product.findById(prodId).then(product => {
    if(product.userId.toString() !== req.user._id.toString()) {
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    product.height = updatedHeight;
    product.width = updatedWidth;
    product.depth = updatedDepth;
    product.weight = updatedWeight;
    return product.save()
      .then(result => {
        console.log('UPDATED PRODUCT!');
        res.redirect('/shop/admin/products');
      });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT')
      res.redirect('/shop/admin/products');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
