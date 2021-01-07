const express = require('express');

const router = express.Router();

//middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//controller
const { create, read, update, remove, list } = require('../controllers/category');

//routes
router.post('/', authCheck, adminCheck, create); // add a category
router.get('/categories', list);                         // get all categories
router.get('/:slug', read); // get a single category 
router.put('/:slug', authCheck, adminCheck, update); //update a category
router.delete('/:slug', authCheck, adminCheck, remove);   // delete a category

module.exports = router;

