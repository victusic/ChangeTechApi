import { Router } from 'express';
const router = Router();

const productPageController = require('../controllers/productPage.controller');

router.get('/priceCategory/:category', productPageController.getPriceCategory);
router.get('/product/params/:id', productPageController.getProductParams);
router.get('/product/shops/:id', productPageController.getProductShops);
router.get('/products', productPageController.getProducts);

module.exports = router