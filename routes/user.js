const express = require('express')

const router = express.Router();

const { authCheck } = require("../middlewares/auth");

const { userCart, getUserCart, emptyCart, saveAddress } = require('../controllers/user');

router.post('/cart', authCheck, userCart);
router.get('/cart', authCheck, getUserCart);
router.put('/cart', authCheck, emptyCart);
router.post('/address', authCheck, saveAddress)

module.exports = router;