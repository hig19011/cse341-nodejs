const path = require('path');
const express = require('express');

const isAuth = require('../../middleware/is-auth');
const shopController = require('../../controllers/shopControllers/shop');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/products/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth,shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/cart-product-increment', isAuth, shopController.postCartIncrementProduct);
router.post('/cart-product-decrement', isAuth, shopController.postCartDecrementProduct);
router.get('/throw-error', shopController.throwError);
// router.get('/checkout', shopController.getCheckout);

module.exports = router;