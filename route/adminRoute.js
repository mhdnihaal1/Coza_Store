const express = require('express')
const admin_route = express();
const session  = require('express-session')
const config = require('../config/config')

admin_route.use(session({secret:config.sessionSecret,
    resave:true,
    saveUninitialized:true
}));


admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));
 
const adminMiddle = require('../middleware/adminMiddle');
const adminController = require ("../controller/adminController");

//--------------------------adminLogin-----------------------------

admin_route.get('/adminLogin',adminController.adminLogin)
admin_route.post('/adminLogin',adminController.adminLoginVerify)


//===================brand
admin_route.get('/ChartbrandOverview',adminController.brandchart);

//=====================graph

admin_route.get('/dashboard',adminMiddle.isLogin,adminController.dashboardLoad)
admin_route.get('/ChartDailyOverview',adminController.ChartDailyOverview)
admin_route.get('/ChartWeekOverview',adminController.ChartWeekOverview)
admin_route.get('/ChartMonthlyOverview',adminController.ChartMonthlyOverview)
admin_route.post('/ChartCustomOverview',adminController.ChartCustomOverview)
admin_route.get('/ChartYearlyOverview',adminController.ChartYearlyOverview)

//====================report
admin_route.get('/reportDailyOverview',adminController.reportDailyOverview)
admin_route.get('/reportWeeklyOverview',adminController.reportWeeklyOverview) 
admin_route.get('/reportMonthlyOverview',adminController.reportMonthlyOverview)
admin_route.post('/customDate',adminController.customDate)
admin_route.post('/dashboarddownloadpdfreport',adminController.downloadreport)
admin_route.post('/dashboarddownloadexcelreport',adminController.downloadexcelreport)

//======================breakup 

admin_route.get('/breakup',adminController.breakup)


//---------------------------user Details-------------------------

admin_route.get('/userDetails',adminMiddle.isLogin,adminController.userDetailsLoad)
admin_route.post('/userDetails/Block',adminController.blockingUser)
admin_route.post('/userDetails/UnBlock',adminController.unblockingUser)

//============================ orders ===================

admin_route.get('/orders',adminMiddle.isLogin,adminController.ordersLoad)


admin_route.get('/orderDetails/:_id',adminMiddle.isLogin,adminController.orderDetailsLoad)
admin_route.post('/orderDetails',adminController.orderDetails)

//========================offers====================

admin_route.get('/offer',adminMiddle.isLogin,adminController.offerLoad)

admin_route.get('/addoffer',adminMiddle.isLogin,adminController.addofferLoad)
admin_route.post('/addoffer',adminController.addoffer)

//============================coupon============

admin_route.get('/coupon',adminMiddle.isLogin,adminController.Loadcoupon)

admin_route.get('/addcoupon',adminMiddle.isLogin,adminController.Loadaddcoupon)
admin_route.post('/addcoupon',adminController.addcoupon)
admin_route.post('/deletecoupon',adminController.deletecoupon)

//=====================discount==================

admin_route.get('/discount',adminMiddle.isLogin,adminController.Loaddiscount)

admin_route.get('/adddiscount',adminMiddle.isLogin,adminController.Loadadddiscount)
admin_route.post('/adddiscount',adminController.adddiscount)



module.exports = admin_route;