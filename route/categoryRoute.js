const express = require('express')
const category_route = express();
const session  = require('express-session')
const config = require('../config/config')

category_route.use(session({secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}));

const userMiddle = require('../middleware/userMiddle')

category_route.set('view engine','ejs')
category_route.set('views','./views/admin')

category_route.use(express.json())
category_route.use(express.urlencoded({extended:true}))
 
const adminMiddle = require('../middleware/adminMiddle')

const categoryController = require ("../controller/categoryController");

category_route.get('/category',adminMiddle.isLogin,categoryController.categoryLoad)
category_route.post('/category/List',categoryController.categoryList)
category_route.post('/category/UnList',categoryController.categoryUnList)

category_route.get('/addcategory',adminMiddle.isLogin,categoryController.addCategory)
category_route.post('/addcategory',categoryController.addcategoryPost)

category_route.get('/editcategory/:id',adminMiddle.isLogin,categoryController.editCategoryLoad)
category_route.post('/editcategory',categoryController.editCategory)

module.exports = category_route;