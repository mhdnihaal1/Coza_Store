const User = require("../model/userModel");
const Orders = require("../model/orderModel");
const Offer = require("../model/offerModel");
const Coupon = require("../model/couponModel");
const Wallet = require("../model/walletModel");
const Discount = require("../model/discountModel");
const bcrypt = require('bcrypt');
const nodemailer=require('nodemailer');
const randomString = require("randomstring");
const config=require('../config/config')
const generateOtp=require('otp-generator')
const twit = require('twit')
const mongoose = require('mongoose');

 

//  function generateOTP() {
//   // Generate a random 6-digit number
//   const otp = Math.floor(100000 + Math.random() * 900000);
//   return otp.toString();
// }

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//============brandchart===========

const brandchart = async (req, res) => {
  try {
    console.log('brand')
      let dataArray = [];

      // Find all orders
      const orders = await Orders.find();

      // Initialize an object to store counts for each product category
      const categoryCounts = {};

      // Loop through each order
      orders.forEach(order => {
          // Loop through each product in the order
          order.products.forEach(product => {
              // Check if the product is delivered
              if (product.orderStatus === "Delivered") {
                  // Get the product category
                  const category = product.productId.productCategory;

                  // Increment the count for the product category
                  categoryCounts[category] = (categoryCounts[category] || 0) + 1;
              }
          });
      });

      // Convert the categoryCounts object to an array of objects
      Object.keys(categoryCounts).forEach(category => {
          const count = categoryCounts[category];
          dataArray.push({ category, count }); // Using ES6 shorthand for object property assignment
      });

      // Send the response
      res.json({ incomeData: dataArray });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
  }
};

//============================graph showing

const dashboardLoad =async (req,res)=>{
  try{
//  const userId = rea.session.USER._id;
    const order = await Orders.find({'products.orderStatus': 'Delivered' }).populate('userId').populate('products.productId');
     console.log(typeof order[0].products)
    const totalAmount = order.reduce((total, order) => {
     return total + parseInt(order.TotalAmount.replace("₹", ""), 10);
     }, 0);

      const countoforders = await Orders.find({ 'products.orderStatus': 'Delivered' }).countDocuments();

      let totalDiscount = 0;

      order.forEach((order) => {
        if (Array.isArray(order.products)) {
            order.products.forEach((product) => {
                if (product.productId.discount && product.productId.discount[0] && product.productId.discount[0].discountPrice) {
                    totalDiscount += product.productId.discount[0].discountPrice;
                }
            });
        } else {
            console.error('order.products is not an array');
        }
    });

      // console.log('Total discount:', totalDiscount);

      const topSellingProducts = await Orders.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalQuantity: { $sum: "$products.Quantity" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            totalQuantity: 1,
            productDetails: 1,
          },
        },
      ]);    
      


res.render('dashboard',{totalAmount,countoforders,totalDiscount,topSellingProducts});
  }catch(error){ 
    console.log(error.message)
    res.status(500).send('Internal Server Error');
  }
}

const ChartDailyOverview =async(req,res)=>{

  try{
 console.log('Daily')
    const currentDate = new Date();
    const sixDaysAgo = new Date(currentDate)
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 1)

    const orders =await Orders.find({createdAt:{$gte:sixDaysAgo,$lte:currentDate}})

    const incomeData = [];

    for (let i = 1; i <= 1; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        let totalIncome = 0;
        for (const order of orders) { 
            if (order.createdAt.getDate() === date.getDate()) {
                totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
            }
        }

        incomeData.unshift(totalIncome);
    }
  
    const dataArray = Array.isArray(incomeData) ? incomeData : [incomeData];
    res.json({ incomeData: dataArray });
    
  }catch(error){
    console.log(error)
  }
}

const ChartWeekOverview = async(req,res)=>{
  try{
    console.log('Weekly')
    const currentDate = new Date();
    const sixDaysAgo = new Date(currentDate)
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6)

    const orders =await Orders.find({createdAt:{$gte:sixDaysAgo,$lte:currentDate}})

    const incomeData = [];

    for (let i = 1; i <= 6; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        let totalIncome = 0;
        for (const order of orders) { 
            if (order.createdAt.getDate() === date.getDate()) {
                totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
            }
        }

        incomeData.unshift(totalIncome);
    }
  
    const dataArray = Array.isArray(incomeData) ? incomeData : [incomeData];
    res.json({ incomeData: dataArray });
    
  }catch(error){
    console.log(error)
  }
}


const ChartMonthlyOverview =async(req,res)=>{
  try{
    console.log('Monthly ')
    const currentDate = new Date();
    const sixDaysAgo = new Date(currentDate)
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 30)

    const orders =await Orders.find({createdAt:{$gte:sixDaysAgo,$lte:currentDate}})

    const incomeData = [];

    for (let i = 1; i <= 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        let totalIncome = 0;
        for (const order of orders) { 
            if (order.createdAt.getDate() === date.getDate()) {
                totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
            }
        }

        incomeData.unshift(totalIncome);
    }
  
    const dataArray = Array.isArray(incomeData) ? incomeData : [incomeData];
    res.json({ incomeData: dataArray });

  }catch(error){
    console.log(error)
  }
}

const ChartYearlyOverview = async (req, res) => {
  try {
    console.log('Yearly ');
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear(); 
    const currentYearStart = new Date(currentYear, 0, 1);     
    const currentYearEnd = new Date(currentYear, 11, 31); 

    const orders = await Orders.find({
      createdAt: { $gte: currentYearStart, $lte: currentYearEnd }
    });

    const incomeData = [];

    for (let i = 1; i <= 365; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      let totalIncome = 0;
      for (const order of orders) {
        if (order.createdAt.getDate() === date.getDate()) {
          totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
        }
      }

      incomeData.unshift(totalIncome);
    }

    const dataArray = Array.isArray(incomeData) ? incomeData : [incomeData];
    res.json({ incomeData: dataArray });

  } catch (error) {
    console.log(error);
  }
};

const ChartCustomOverview = async (req, res) => {
  try {
    const { StartDate, EndDate, data } = req.body;
    console.log(StartDate);
    console.log(EndDate);



    const startDate = new Date(StartDate);
    const endDate = new Date(EndDate);
    const currentDate = new Date();

          // Check if the provided dates are above the current date
          if (startDate > currentDate || endDate > currentDate) {
            return res.status(400).json({ error: 'Start date or end date cannot be in the future.' });
        }

    const timeDifference = endDate.getTime() - startDate.getTime();

    const gapDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    console.log(gapDays);

    const customOrders = await Orders.find({
      createdAt: { $gte: new Date(StartDate), $lt: new Date(EndDate) }
    }).populate('userId').populate('products.productId');

    console.log(customOrders);

    let totalIncome = 0;

    for (const order of customOrders) {
      totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
    }

    console.log("Total Income:", totalIncome);

    const incomeData = [];

    for (let i = 1; i <= gapDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      let totalIncome = 0;
      for (const order of customOrders) {
        if (order.createdAt.getDate() === date.getDate()) {
          totalIncome += parseInt(order.TotalAmount.replace("₹", ""), 10);
        }
      }
      incomeData.unshift(totalIncome);
    }

    console.log("Income Data:", incomeData);

    res.json({ totalIncome, incomeData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

//==========================sales report========================

const reportDailyOverview = async(req,res)=>{
  try{
    const oneDaysAgo = new Date();
    oneDaysAgo.setDate(oneDaysAgo.getDate() - 1);

const customOrders = await Orders.find({
  createdAt: { $gt: oneDaysAgo, $lt: new Date() }
}).sort({ createdAt: -1 }).populate('userId').populate('products.productId');

// Send the customOrders as JSON response
res.json({ customOrders });

  }catch(error){
    console.log(error)
  }
}

const reportWeeklyOverview=async(req,res)=>{
  try{
    const sixDaysAgo = new Date();
sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

const customOrders = await Orders.find({
  createdAt: { $gt: sixDaysAgo, $lt: new Date() }
}).sort({ createdAt: -1 }).populate('userId').populate('products.productId');

res.json({ customOrders });
  }catch(error){
    console.log(error)
  }
}

const reportMonthlyOverview =async(req,res)=>{ 
  try{
    const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const customOrders = await Orders.find({
  createdAt: { $gt: thirtyDaysAgo, $lt: new Date() }
}).sort({ createdAt: -1 }).populate('userId').populate('products.productId');

// Send the customOrders as JSON response
res.json({ customOrders });
  }catch(error){
    console.log(error)
  }
}

const customDate = async(req,res)=>{
  try{
    // console.log(1234)
    console.log(req.body);
   const {startDate,endDate} = req.body;

     const currentDate = new Date();

          // Check if the provided dates are above the current date
          if (startDate > currentDate || endDate > currentDate) {
            return res.status(400).json({ error: 'Start date or end date cannot be in the future.' });
        }

   const customOrders = await Orders.find({
    createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
  }).sort({ createdAt: -1 }).populate('userId').populate('products.productId')
  console.log(customOrders)
  res.json({customOrders});

}catch(error){
    console.log(error)
  }
}


const downloadreport = async(req,res)=>{
  try{
    const { start, end } = req.body;
    console.log("Start date:", start);
    console.log("End date:", end);

    var startDate = new Date(start);
    var startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    var endDate = new Date(end);
    var endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const orders = await Orders.find({
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
    }).populate('userId').populate('products.productId')
  
    console.log("orders for download", orders);
    res.status(200).json({ orders });
  }catch(error){
    console.log(error)
  }
}


const downloadexcelreport =async(req,res)=>{
  try{
    const { start, end } = req.body;
    console.log("Start date:", start);
    console.log("End date:", end);

    var startDate = new Date(start);
    var startOfDay = new Date(startDate);
    startOfDay.setHours(0, 0, 0, 0);

    var endDate = new Date(end);
    var endOfDay = new Date(endDate);
    endOfDay.setHours(23, 59, 59, 999);
    const orders = await Orders.find({
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }
    }).populate('userId').populate('products.productId')
  
    console.log("orders for download", orders);
    res.status(200).json({ orders });
  }catch(error){
    console.log(error)
  }
}
//================================breakup

const breakup = async(req,res)=>{
  try{   


    console.log(12345);
    const orders = await Orders.find()
    console.log(orders.length)

    let pending=0;
    let shipped=0;
    let delivered=0;
    let cancelled=0;
    let returned=0;

    for(let i=0;i<orders.length;i++){
      for(let j=0;j<orders[i].products.length;j++){
        if(orders[i].products[j].orderStatus == "pending"){
          pending += orders[i].products[j].Quantity
        }else if(orders[i].products[j].orderStatus == "Shipped"){
          shipped += orders[i].products[j].Quantity
        }else if(orders[i].products[j].orderStatus == "Delivered"){
          delivered += orders[i].products[j].Quantity
        }else if(orders[i].products[j].orderStatus == "cancelled"){
          cancelled += orders[i].products[j].Quantity
        }else if(orders[i].products[j].orderStatus == "Returned"){
          returned += orders[i].products[j].Quantity
        }
      }
    }

    console.log(pending,shipped,delivered)

const statusCounts =[pending,shipped,delivered,cancelled,returned]
    console.log(statusCounts)
    
    res.status(200).json({statusCounts})
    

  }catch(error){
    console.log(error)
  }
}
//=========================================

const adminLogin = async (req,res)=>{
try{
    res.render('adminLogin')
}catch(error){
console.log(error.message)
}
}

const adminLoginVerify = async (req, res) => {
  try {
     const enteremail = req.body.email;
     console.log(enteremail)
     const enterpassword = req.body.password;

    
 
     const admin = await User.findOne({ email: enteremail });

 
     if (!admin) {
       return res.send('adminLogin', { message: 'Invalid admin' });
     }
 
     const userpassword = await bcrypt.compare(enterpassword, admin.password);
 
     if (!userpassword) {
       return res.STATUS(200).json('adminLogin', { message: 'Invalid password' });
     }
 
     if (admin.is_admin == 1) {
      // req.session.ADMIN.email =enteremail
      // req.session.ADMIN.password =enterpassword
      // console.log(req.session.ADMIN.password)
      // console.log(req.session.ADMIN.email)
      req.session.admin='Admin';
      
        res.redirect('/dashboard');
     } else {
       // If the user is not an admin, render the admin login page with a message
        res.render('adminLogin', { message: 'admin is not an user' });
     }
  } catch (error) {
     console.log(error.message);
     return res.render('errorPage', { message: 'An error occurred' });
  }
 };
 


const userDetailsLoad = async (req, res) => {
  try {
    const users = await User.find({ is_admin: 0 });

   // console.log(users);
  
    res.render('userDetails', { users });

  } catch (error) {
    console.log(error.message);
    res.status(500).send('Internal Server Error');
  }
}
const blockingUser = async (req, res) => {
  try {
    const id = req.body.userId;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.is_Blocked = true; 
    const saved = await user.save();

    res.json({ message: "Blocked successfully" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
};



const unblockingUser=async(req,res)=>{
  try{

    const id=req.body.userId;
    console.log(id)

    const userId = await User.findOne({_id:id})

    if(!userId){
      res.json("user not found")
    }
    userId.is_Blocked=false;
   const saved = await userId.save()

  res.json({ message: "UnBlocked successfully" });

  }catch(error){
    console.log(error.message)
    res.status(500).send('Internal Server Error');
  }
}

const ordersLoad=async(req,res)=>{
  try{

    const orders = await Orders.find().populate('userId').populate('products.productId').sort({ createdAt: -1 }); 
      res.render('orders',{orders});
  }catch(error){
    console.log(error);
  }
}

const orderDetailsLoad = async (req,res)=>{
  try{
    console.log('orderDetails');
    const orderId = req.params._id;
    // console.log(orderId);
    const orders = await Orders.findOne({ _id: orderId }).populate('userId').populate('products.productId');
    // console.log(orders);
    res.render('orderDetails',{orders});

  }catch(error){
    console.log(error);
    res.redirect('/404')

  }
}

const orderDetails = async (req, res) => {
  console.log('orderdetailspost')
  try {
    const userId = req.body.userId;
      const status = req.body.Status;
      const orderId = req.body.orderId;

const orderr =await Orders.findOne({_id:orderId})
const productprice = orderr.TotalAmount

// if(status =='Accept'){
//       //===================
//       console.log(11)
//       console.log(typeof userId)
//       const wallet = await Wallet.findOne({userId :userId})
// console.log(22)
//     if (wallet) {
//       const newEntry = {
//         Reason: "Returned",
//         amount: wallet.amount + productprice, 
//         transaction: "Deposits",
//         date: new Date(),
//       };

//       const amountToAdd = parseFloat(productprice);

//       wallet.history.push(newEntry);

//       wallet.balance = parseFloat(wallet.balance) + amountToAdd;

//       await wallet.save();

//       console.log("New history entry added for user's wallet.");
//     } else {
//       const newWallet = new Wallet({
//         userId: userId,
//         balance: productprice,
//         history: [
//           {
//             Reason: "returnedproduct",
//             amount: productprice,
//             transaction: "Deposit",
//             date: new Date(),
//           },
//         ],
//       });

//       await newWallet.save();

//       console.log("New wallet created for the user.");
//     }

//   }

      // Find the order document by orderId
      const order = await Orders.findOne({ _id: orderId });

      if (!order) {
          return res.status(404).json({ error: 'Order not found' });
      }

      // Update the orderStatus in the products array
      order.products.forEach(product => {
          product.orderStatus = status;
      });

      // Save the updated order document
      await order.save();

      console.log('Order details updated successfully');
      res.status(200).json({ message: 'Order details updated successfully' });
  } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const offerLoad= async (req,res)=>{
  try{

    const offer=await Offer.find();

res.render('offer',{offer})
  }catch(error){
    console.log(error);
  }
}

const addofferLoad =async(req,res)=>{
  try{
   res.render('addoffer')
  }catch(error){
    console.log(error);
  }
}


const addoffer = async (req, res) => {
  try {
      const offerName = req.body.offerName;
      const offerPrice = req.body.offerPrice;
      const offerStarted = req.body.offerStarted;
      const offerEnd = req.body.offerEnd;

      const existingOffer = await Offer.findOne({ offerName: offerName });

      if (existingOffer) {
          return res.status(400).json({ error: 'Offer with the same name already exists' });
      }

      const offer = new Offer({
          offerName: offerName,
          offerPrice: offerPrice,
          offerStarted: offerStarted,
          offerEnd: offerEnd
      });

      await offer.save();
      return res.status(200).json({ message: 'Offer added successfully' });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};




const Loadcoupon = async(req,res)=>{
  try{
    const coupon=await Coupon.find();

     res.render('coupon',{coupon})
  }catch(error){
    console.log(error);
  }
}

const Loadaddcoupon = async(req,res)=>{
  try{
    res.render('addcoupon')
  }catch(error){
    console.log(error); 
  } 
}

const addcoupon = async (req, res) => {
  try {
    const couponData = req.body;

    const existingCoupon = await Coupon.findOne({ couponCode: req.body.couponCode });

    if (existingCoupon) {
        return res.status(400).json({ error: 'Offer with the same name already exists' });
    }

    const coupon = new Coupon({
      couponCode:req.body.couponCode,
      couponPrice:req.body.couponPrice,
      minimumPurchaseAmount:req.body.minimumPurchaseAmount,
      couponStarted:req.body.couponStarted,
      couponEnd:req.body.couponEnd

    });

    await coupon.save();
    res.redirect('/coupon');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deletecoupon = async (req, res) => {
  try {
    const { couponId } = req.body;
    console.log(couponId);

    const deletedCoupon = await Coupon.findOneAndDelete({ _id: couponId }); 

    console.log(deletedCoupon);

    if (!deletedCoupon) {
      return res.status(404).json({ error: 'Coupon not found.' });
    }

    res.status(200).json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete coupon.' });
  }
};



const Loaddiscount = async(req,res)=>{
  try{
    const discounts= await Discount.find()
    res.render('discount',{discounts})
  }catch(error){
    console.log(error)
  }
}

const Loadadddiscount = async(req,res)=>{
  try{
    res.render('adddiscount')
  }catch(error){
    console.log(error)
  }
}

const adddiscount=async (req,res)=>{
try{
  const discountData = req.body;


  const discount = new Discount({
    discountPrice:req.body.discountPrice,
    discountStarted:req.body.discountStarted,
    discountEnd:req.body.discountEnd

  });

  await discount.save();
  res.redirect('/discount')
} catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal server error" });
}
}

module.exports={
  adminLogin,
  adminLoginVerify,
  brandchart,
  dashboardLoad,
  ChartDailyOverview,
  ChartWeekOverview,
  ChartMonthlyOverview,
  ChartYearlyOverview,
  ChartCustomOverview,
  breakup,
  //-----------
  reportDailyOverview,
  reportWeeklyOverview,
  reportMonthlyOverview,
  downloadreport,
  downloadexcelreport,
  customDate,
  userDetailsLoad,
  blockingUser,
  unblockingUser,
  ordersLoad,
  orderDetailsLoad,
  orderDetails,
  offerLoad,
  addofferLoad,
  addoffer,
  Loadaddcoupon,
  addcoupon,
  deletecoupon,
  Loadcoupon,
  Loaddiscount,
  Loadadddiscount,
  adddiscount

}