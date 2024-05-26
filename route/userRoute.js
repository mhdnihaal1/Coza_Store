const express = require('express')
const user_route = express();
const session  = require('express-session')
const config = require('../config/config')

const passport = require("passport");

user_route.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false,  }
}));

const userblockMiddle = require('../middleware/userblockMiddle')
const userMiddle = require('../middleware/userMiddle')

user_route.set('view engine','ejs');
user_route.set('views','./views/users');

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))
 
const oauthController = require("../controller/oauthController");

const userController = require ("../controller/userController")


//--------------------------registration

user_route.get('/register',userMiddle.isLogout,userController.loadRegister)

user_route.post('/register',userMiddle.isLogout,userController.insertUser)

//------------------------login

user_route.get('/login',userMiddle.isLogout,userController.loginload)

 user_route.post('/login',userMiddle.isLogout,userController.verifyLogin)

//  -------------------- home

user_route.get('/',userController.home)
user_route.get('/404',userController.Error)


user_route.post('/logout',userController.userLogout) 

//---------------------------forget password

 user_route.get('/forget',userController.forgetLoad);
 user_route.post('/forget',userController.forgetVerify)

user_route.get('/otpResetPassword',userController.otpresetpasswordload)
user_route.post('/otpresetpasswordverify',userController.otpresetpasswordverify)

 user_route.get('/resetPassword',userController.loadResetPassword)
 user_route.post('/resetPassword',userController.resetPassword)

//-------------------otp verification--------------

user_route.get('/otpGenerator',userController.loadOtp)
user_route.post('/submitOTP',userController.submitOTP)
user_route.post('/resendOTP',userController.resendOTP)


//-----------------------------------product ----------------------

user_route.get('/product',userController.productLoad)
user_route.post('/product',userController.addproduct)
// user_route.get('/product',userController.productfilter)

user_route.get('/productDetail/:id',userblockMiddle.isBlock,userController.productDetailsLoad)
user_route.post('/productDetail',userController.productdetails)
user_route.post('/wishlistCart',userController.wishlistCart)



//---------------------about

user_route.get('/about',userController.aboutLoad)


//-------------------------contact

user_route.get('/contact',userController.contactLoad)

//------------------------------cart

user_route.get('/cart',userMiddle.isLogin,userblockMiddle.isBlock,userController.cartLoad)
user_route.post('/cart',userController.addcart)
user_route.post('/cart1',userController.removeCart)
user_route.post('/cart2',userController.quantity)

//----------------------------------userprofile
user_route.get('/userProfile',userMiddle.isLogin,userblockMiddle.isBlock,userController.userProfile)
user_route.post('/userProfileEdit',userMiddle.isLogin,userblockMiddle.isBlock,userController.userProfileEdit)

//=========================userAddress
user_route.get('/addaddress',userController.addaddressLoad)
user_route.post('/addaddress',userController.addaddress)

user_route.get('/address',userController.address)
user_route.post('/addressEdit',userController.addressEdit)
user_route.post('/deleteAddress',userController.addressDelete)

user_route.get('/userProfilepasswordchange',userMiddle.isLogin,userblockMiddle.isBlock,userController.userProfilepasswordchange)
user_route.post('/userProfilepasswordchange',userMiddle.isLogin,userblockMiddle.isBlock,userController.profilepasswordchange)


//======================wishlist
user_route.get('/wishlist',userController.wishlist)
user_route.post('/wishlist1',userController.removewishlist)
// user_route.post('/wishlistaddtocart',userController.wishlistCart)


//=======================checkout

user_route.get('/checkout',userController.checkoutLoad)
user_route.post('/checkout',userController.checkout)
user_route.post('/checkoutAddress',userController.checkoutAddress)
user_route.post('/checkoutEditAddress',userController.checkouteditaddress)
user_route.post('/chooseAddress',userController.chooseAddress)
user_route.post('/checkoutCoupon',userController.Addcoupon)
user_route.post('/checkoutCouponremove',userController.removecoupon)




//========================orders

user_route.get('/order',userController.orderLoad)

user_route.get('/orderhistory',userController.orderhistoryLoad)

user_route.get('/orderDetail/:id',userController.userorderDetail)
user_route.post('/orderDetail',userController.cancelOrder)
user_route.post('/orderDetail1',userController.returnOrder)
user_route.post('/invoice',userController.invoice)

//================================wallet

user_route.get('/wallet',userController.wallet)

//=============================razorpay
user_route.post('/verify-paymentCODonline',userController.razorpayCOD)
user_route.post('/verify-payment',userController.Razorpayayment)
user_route.post('/verify-paymentOnOrders',userController.paymentOnOrders)




//gogole
user_route.use(passport.initialize());
user_route.use(passport.session());

user_route.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

user_route.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure", 
  })
);

user_route.get("/auth/google/success",oauthController.success);
 
user_route.get("/auth/google/failure",  (req, res) => {
  res.send("something failed");
});

module.exports = user_route;