const mongodb = require('mongodb');
const Product = require('../../models/shopModels/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render('pages/shop/admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
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

  const product = new Product(null, title, imageUrl, description, price, height, width, depth, weight, req.user._id);
  product.save().then(result => {
    console.log('Created Product')
    res.redirect('/shop/admin/products');
  });

};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('pages/shop/admin/products', {
        prods: products,
        pageTitle: 'Shop',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
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
        product: product
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  const updateHeight = req.body.height;
  const updateWidth = req.body.width;
  const updateDepth = req.body.depth;
  const updateWeight = req.body.weight;

  const updatedProduct = new Product(new ObjectId(prodId), updatedTitle, updatedImageUrl, updatedDesc, updatedPrice, updateHeight, updateWidth, updateDepth, updateWeight);
  updatedProduct.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/shop/admin/products');      
    })
    .catch(err => console.log(err));  
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;  
  Product.deleteById(prodId)
  .then(()=> {
    console.log('DESTROYED PRODUCT')
    res.redirect('/pages/shop/admin/products');
  })
  .catch(err => console.log(err));
}



// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;  
//   Product.deleteById(prodId);
//   res.redirect('pages/shop/admin/products');
// }