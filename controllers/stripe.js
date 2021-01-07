const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
    //find user
    const user = await User.findOne({email: req.user.email}).exec();
    //get user cart total
    const {cartTotal} = await Cart.findOne({orderedBy: user._id}).exec();
    console.log('cart total charged', cartTotal)
    // create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal * 100,
        currency: 'usd'
    })

    console.log('payment intent', paymentIntent.client_secret)

    res.json({
        clientSecret: paymentIntent.client_secret
    })

}
