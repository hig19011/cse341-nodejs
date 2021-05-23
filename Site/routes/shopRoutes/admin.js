const path = require('path');
const express = require('express');
const {body} = require('express-validator/check');

const adminController = require('../../controllers/shopControllers/admin');
const isAuth = require('../../middleware/is-auth');
const router = express.Router();



router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product',
  [
    body('title', 'Product Title is required').isString().isLength({min:3}).trim(),
    body('imageUrl', 'Product Title is required').isURL(),
    body('price').isFloat(),
    body('description').isLength({min:3, max: 400}).trim(),
    body('height').isFloat(),
    body('width').isFloat(),
    body('depth').isFloat(),
    body('weight').isFloat()
  ], 
  isAuth, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product',
  [
    body('title', 'Product Title is required').isString().isLength({min:3}).trim(),
    body('imageUrl', 'Product Title is required').isURL(),
    body('price').isFloat(),
    body('description').isLength({min:3, max: 400}).trim(),
    body('height').isFloat(),
    body('width').isFloat(),
    body('depth').isFloat(),
    body('weight').isFloat()
  ],
  isAuth,
  adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
