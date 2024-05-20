
const mongoose=require('mongoose')
require('dotenv').config();

const mongoUri = process.env.MONGODBATLAS;
mongoose.connect(mongoUri); 
const path = require('path');

const express=require('express')
// const passport = require('passport')
const session = require('express-session')
require('./oauth');
//const //serveStatic = require('serve-static')
const app=express()
const passport = require('passport')
app.use(express.static(path.resolve(__dirname,'public')));
app.use('/uploads',express.static('uploads'));



// const servicesotp=require('../services/GenerateOTP')
// const servicesmail=require('../services/sendEmail')
 const nocache = require('nocache')
 app.use(nocache())

 //========================this is for google login in===================

// function isLoggedIn(req,res,next){
// req.user ? next() :res.sendStatus(401)
// }

//  app.get('/',(req,res)=>{
//     res.sendFile('index.html');
//  })

// app.use(session({
//     secret:'mysecret ',
//     resave:false,
//     saveUnitialized:true,
//     cookie:{secure:false}
// }));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true ,// Provide a value for saveUninitialized
 
}));

app.use(passport.initialize());
app.use(passport.session())

//----------for admin routes

const adminRoute = require ('./route/adminRoute')
app.use('/',adminRoute)


//----------for user routes
const userRoute = require('./route/userRoute')
app.use('/',userRoute)



//----------for category routes
const categoryRoute = require('./route/categoryRoute')
app.use('/',categoryRoute)

//---------for product routes

const productRoute = require('./route/productRoute')
app.use('/',productRoute)


const port =3000;

app.listen(port,()=>{
console.log('server is working...')
})



