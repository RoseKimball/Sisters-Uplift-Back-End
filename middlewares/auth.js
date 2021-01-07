const admin = require('../firebase/index');
const User = require('../models/user');

exports.authCheck = async (req, res, next) => {
    try {
        console.log('REACHED MIDDLEWARE AUTHCHECK')
        console.log('token recieved in authCheck', req.headers.authtoken);
        const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
        console.log('firebaseUser authcheck', firebaseUser);
        req.user = firebaseUser;
        next();
        console.log('MIDDLEWARE AUTH COMPLETE')
    } catch (err) {
        console.log(err)
        res.status(401).json({
            err: 'invalid or expired token'
        })

    }
}

exports.adminCheck = async (req, res, next) => {
    console.log('ADMIN CHECK REACHED')
    const {email} = req.user;

    const adminUser = await User.findOne({email: email}).exec();

    if(adminUser.role !== 'admin') {
        res.status(403).json({
            err: 'Admin resource. Acces denied.'
        })
    } else {
        console.log('ADMIN CHECK COMPLETE')
        next();
    }
}
