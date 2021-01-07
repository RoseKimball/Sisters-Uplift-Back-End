const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const mongoose = require('mongoose')

exports.userCart = async (req, res) => {
    // console.log(req.body)
    const {cart} = req.body;

    let products = [];

    const user = await User.findOne({email: req.user.email}).exec();

    let cartExistsByThisUser = await Cart.findOne({orderedBy: user._id}).exec();

    if(cartExistsByThisUser) {
        cartExistsByThisUser.remove();
        console.log('removed old cart');
    }

    for(let i = 0; i < cart.length; i ++) {
        let object = {};

        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;

        let productFromDb = await Product.findById(cart[i]._id).select('price').exec();
        object.price = productFromDb.price;

        products.push(object);

    }

    console.log('products', products);

    let cartTotal = 0;

    for(let i = 0; i < products.length; i ++) {
        cartTotal = cartTotal + products[i].price * products[i].count;
    }

    console.log('cartTotal', cartTotal);

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id
    }).save();

    console.log('new cart', newCart)
    res.json({ok: true})
} 

exports.getUserCart = async (req, res) => {
    const user = await User.findOne({email: req.user.email}).exec();

    let cart = await Cart.findOne({orderedBy: user._id}).populate('products.product', '_id title price').exec();

    const {products, cartTotal} = cart;

    res.json({products, cartTotal});
} 

exports.emptyCart = async (req, res) => {
    console.log('email emptyCart', req.user.email)
    const user = await User.findOne({email: req.user.email}).exec();
    if(mongoose.Types.ObjectId.isValid(user._id)) {
        console.log('user id backend', user._id)
        const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
        console.log('cart removed by id', cart)
    }

    res.json({ok: true});
} 

exports.saveAddress = async (req, res) => {
    let user = await User.findOneAndUpdate({email: req.user.email}, {address: req.body.address}).exec();
    return res.json({ok: true});
} 