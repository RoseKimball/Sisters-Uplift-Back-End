const express = require('express');

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//controller
const { create, listAll, remove, read, update, list, productsCount, listRelated, searchFilters } = require('../controllers/product');

//routes
router.post('/', authCheck, adminCheck, create);
router.get('/products/total', productsCount)
router.get('/products/:count', listAll);
router.delete('/:slug', authCheck, adminCheck, remove);
router.get('/:slug', read);
router.put('/:slug', authCheck, adminCheck, update);
router.post('/products', list);
router.get('/related/:productId', listRelated);
router.post('/search/filters', searchFilters)


module.exports = router;