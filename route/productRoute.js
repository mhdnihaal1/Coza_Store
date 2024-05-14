const express = require('express')
const product_route = express();
const session  = require('express-session')
const config = require('../config/config')

product_route.use(session({secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}));

const userMiddle = require('../middleware/userMiddle')
const upload = require('../middleware/upload')

product_route.set('view engine','ejs')
product_route.set('views','./views/admin')

product_route.use(express.json())
product_route.use(express.urlencoded({extended:true}))
 
const adminMiddle = require('../middleware/adminMiddle')

const productController = require ("../controller/productController");


//-------------------------product Details-------------------

product_route.get('/productDetails',adminMiddle.isLogin,productController.productDetailsLoad);
product_route.post('/productDetails/List',productController.productlist);
product_route.post('/productDetails/UnList',productController.productunlist);
product_route.post('/productDetails0',productController.addoffertoproduct);
product_route.post('/productDetails1',productController.removeofferfromproduct);
product_route.post('/productDetails2',productController.adddiscounttoproduct);



product_route.get('/addproduct',adminMiddle.isLogin,productController.addproductLoad)
product_route.post('/addproduct',upload.array('productImage',4),productController.addProduct)

product_route.get('/editproduct/:id',adminMiddle.isLogin,productController.editProductLoad)
product_route.post('/editproduct',upload.array('productImage',4),productController.editProduct)



module.exports=product_route;