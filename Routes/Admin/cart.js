const express = require('express');
const router = express.Router();
const cartController = require('../../Controller/Admin/cart');

router.post('/addToCart', cartController.addToCart);
router.get('/getAllCartProductsByVender/:id', cartController.getAllCartProductsByVender);
router.delete('/DeleteAllCartProductsByVender/:id', cartController.DeleteAllCartProductsByVender);
router.delete('/removeInCartOfVender/:productId/:vendorId', cartController.removeInCartOfVender);
router.put("/priceIncAnddec",cartController.priceIncAnddec)
router.delete("/deleteCartVendor/:id",cartController.deleteCartVendor)
module.exports = router;