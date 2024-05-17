const User = require("../model/userModel");
const Product = require("../model/productModel");
const Wishlist = require("../model/wishlistModel");
const Categroy = require("../model/categoryModel");
const Order = require("../model/orderModel");
const Address = require("../model/userAddressModel");
const Wallet = require("../model/walletModel");
const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomString = require("randomstring");
const config = require("../config/config");
const generateOtp = require("otp-generator");
const mongoose = require("mongoose");

const Razorpay = require("razorpay");
const crypto = require("crypto");

const sendMail = require("../sendEmail");
const sendEmailresetpassword = require("../sendEmailresetpassword");

function generateOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const loadRegister = async (req, res) => {
  try {
    res.render("registration");
  } catch (error) {
    console.log(error.message);
    res.render("error", {
      message: "An error occurred while loading the registration page",
    });
  }
};

const insertUser = async (req, res) => {
  try {
    if (
      !/^[a-zA-Z\s]*$/.test(req.body.name) ||
      !/^\d+$/.test(req.body.mobile)
    ) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid Name or Mobile " });
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).*$/;

    if (!passwordRegex.test(req.body.password)) {
      res
        .status(400)
        .json({
          message: "Password must include  numbers , letters and symbols.",
        });
    }

    if (req.body.password !== req.body.checkPassword) {
      return res
        .status(400)
        .json({ ok: false, message: "Passwords do not match." }); 
    }

    const spassword = await securePassword(req.body.password);

    const user = {
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
    };

    req.session.user = user;

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    sendMail(req.body.name, req.body.email, otp);

    req.session.otp = otp;

    console.log("Verification email sent successfully. OTP:", req.session.otp);
    return res
      .status(200)
      .json({ ok: true, message: "Registration successful." });
  } catch (error) {
    console.error("Error during user registration:");
  }
};

//-------------------------------------otp page--------------------------------

const loadOtp = async (req, res) => {
  try {
    res.render("otpGenerator");
  } catch (error) {
    console.log(error.message);
  }
};

const submitOTP = async (req, res) => {
  try {
    console.log(req.body);

    const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;

    const enteredOtp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    console.log("session otp", req.session.otp);
    const storedOtp = req.session.otp;
    console.log("entered otp: " + enteredOtp);
    console.log(req.session.user);
    const useremail = req.session.user.email;

    if (enteredOtp === storedOtp) {
      console.log("Entered OTP is correct: " + enteredOtp);
      const userInfo = new User({
        name: req.session.user.name,
        email: req.session.user.email,
        password: req.session.user.password,
        mobile: req.session.user.mobile,
        is_verified: 1,
      });
      console.log(userInfo);

      try {
        await userInfo.save();
        console.log("User info saved successfully");
        res.status(200).json({ message: "success" });
      } catch (saveError) {
        console.error("Error saving user info:", saveError);
        return res
          .status(500)
          .json({ error: "An error occurred while saving user info" });
      }
    } else {
      res.status(400).json({ message: "Wrong OTP" });
    }
  } catch (error) {
    console.log("submitOTP has an error: ", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred during OTP submission" });
  }
};

//=====resend otp

const resendOTP = async (req, res) => {
  try {
    const name = req.body.name;

    const newotp = await generateOTP();
    console.log("otp2", newotp);

    req.session.otp = newotp;

    await sendMail(req.session.user.name, req.session.user.email, newotp);

  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred while resending OTP");
  }
};

//--------------------------------------------login user methods started---------------------------------

const loginload = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const password = req.body.password;
    console.log(password);

    const USER = await User.findOne({ email: email });

    const userId = USER._id;
    req.session.USER = USER;
    console.log(req.session.USER._id);

    if (!USER) {
      return res.render("login", { message: "Invalid user" });
    }
    const userpassword = await bcrypt.compare(password, USER.password);
    if (!userpassword) {
      return res.render("login", { message: "Invalid user" });
    }

    if (USER.is_verified != 1) {
      res.render("error", {
        message: "Incorrect password or user not verified.",
      });
    }

    req.session.USER = USER;

    res.redirect("/");
  } catch (error) {
    console.log(error.message);
    res.render("error", {
      message: "An error occurred while loading the home page.",
    });
  }
};

const home = async (req, res) => {
  try {
    console.log("home entered");
    const user = await User.find();
    const product = await Product.find();
    res.render("home", { product, user });
  } catch (error) {
    console.log(error.message);
    res.redirect('/404')

  }
};

//============error====================

const Error = async(req,res)=>{ 
  try{
   res.render('404')
  }catch(error){
    console.log(error)
  }
}

//---------logout-----------------
const userLogout = async (req, res) => {
  try {
    console.log("logout started");
    await req.session.destroy();
    console.log(req.session);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

//--------------------forget password-----------------------

const forgetLoad = async (req, res) => {
  try {
    res.render("forget");
  } catch (error) {
    console.log(error.message);
  }
};

const forgetVerify = async (req, res) => {
  try {
    const email = req.body.email;

    req.session.email = email;

    const otp = generateOTP();
    console.log(otp);
    sendEmailresetpassword(req.body.email, otp);

    req.session.otp = otp;

    res.redirect("/otpResetPassword");

    console.log("Your OTP has been sent successfully via email.");
  } catch (error) {
    console.error("Error:", error.message);

    res.status(500).send("Internal Server Error");
  }
};

//-----------------------------------otp for reset password------------------

const otpresetpasswordload = async (req, res) => {
  try {
    res.render("otpResetPassword");
  } catch (error) {
    console.log(error.message);
  }
};

const otpresetpasswordverify = async (req, res) => {
  try {

    const { otp1, otp2, otp3, otp4, otp5, otp6 } = req.body;
    const enterotp = otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
    const sessionotp = req.session.otp;


    console.log(sessionotp + "sessionotp");
    console.log(enterotp + "enterotp");

    if (enterotp === sessionotp) {
      res.render("resetPassword");
    } else {
      res.render("otpResetPassword", { message: "OTP not matched" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//--------------------reset password---------

const loadResetPassword = async (req, res) => {
  try {
    res.render("resetPassword");
  } catch (error) {
    console.log(error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const email = req.session.email;

    const spassword = await securePassword(req.body.password);

    const newpassword = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: spassword } },
      { new: true }
    );

    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

//----------------------------------   product  ----------------------------------------------
const productLoad = async (req, res) => {
  try {
    const nameOfuser = req.session.USER ? req.session.USER.name : null;
    const { id, search } = req.query;

    console.log(search);

    let searchproduct = [];
    let product = [];

    if (search) {
      product = await Product.find({
        productName: { $regex: ".*" + search + ".*", $options: "i" },
      });
    } else {
      product = await Product.find();
    }

    console.log('search'+product);


    


    if (req.query.sort === "high to low") {
      product = await Product.find().sort({ productPrice: -1 });
    } else if (req.query.sort === "low to high") {
      product = await Product.find().sort({ productPrice: 1 });
    } else if (req.query.sort === "A to Z") {
      product = await Product.find().sort({ productName: 1 });
    } else if (req.query.sort === "Z to A") {
      product = await Product.find().sort({ productName: -1 });
    } else if (req.query.sort === "Popularity") {
      product = await Product.find({ productPrice: { $gt: "50000" } }).sort({
        productPrice: 1,
      });
    } else if (req.query.sort === "New arrivals") {
      product = await Product.find({
        createdAt: { $gte: "2024-03-20T14:10:34.241+00:00" },
      }).sort({ productName: 1 });
    } else if (req.query.sort === "Featured") {
      product = await Product.find({ productPrice: { $gte: "20000" } }).sort({
        productPrice: 1,
      });
    }else if (req.query.category === "allproducts") {
      product = await Product.find();
    }else if (req.query.category === "Samsung") {
      product = await Product.find({productCategory:'Samsung'});
    }else if (req.query.category === "Iphone") {
      product = await Product.find({productCategory:'Iphone'});
    }else if (req.query.category === "Redmi") {
      product = await Product.find({productCategory:'Redmi'});
    }else if (req.query.category === "Realme") {
      product = await Product.find({productCategory:'Realme'});
    }


    const categorys = await Categroy.find();
    const category1 = await Categroy.findById(id);
    const category = await Product.find({ productCategory: category1 });

    res.render("product", {
      product,
      searchproduct,
      categorys,
      category,
    });
  } catch (error) {
    console.log(error.message);
    res.redirect('/404')

    res.status(500).send("Internal Server Error");
  }
};

//==========addtowishlist
const addproduct = async (req, res) => {
  try {
    console.log("kooi");
    const productId = req.body.productId;

    console.log(req.session.USER._id);

    const existingwishlist = await Wishlist.findOne({
      userId: req.session.USER._id,
    });

    if (existingwishlist) {
      console.log("hloo");

      const productInwishlist = await Wishlist.findOne({
        userId: req.session.USER._id,
        products: { $elemMatch: { productId: productId } },
      });

      // console.log(productInwishlist);
      if (!productInwishlist) {
        existingwishlist.products.push({
          productId: productId,
        });
        await existingwishlist.save();
        return res
          .status(200)
          .json({ message: "Product added to wishlist successfully" });
      } else {
        console.log("Product is already in the wishlist");
      }
    } else {
      const wishlist = new Wishlist({
        userId: req.session.USER._id,
        products: [
          {
            productId: productId,
          },
        ],
      });
      await wishlist.save();
      return res
        .status(200)
        .json({ message: "Product added to wishlist successfully" });
    }

    const products = await Product.find();

    if (existingwishlist && existingwishlist.products.length === 0) {
      res.render("wishlist", { message: "Your wishlist is empty!" });
    }
  } catch (error) {
    console.log(error);
  }
};

//===================================

const productDetailsLoad = async (req, res) => {
  try {
    if (req.session.USER) {
      const id = req.params.id;
      console.log(id);
      const products = await Product.findOne({ _id: id });
      const productcategory = await Product.find({
        productCategory: products.productCategory,
      });

      res.render("productDetail", { products, productcategory });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log('productdetails'+error.message);
    res.redirect('/404')
  }
};

const productdetails = async (req, res) => {
  try {
    console.log("productDetail page");
    const productId = req.body.productId;

    console.log(req.session.USER._id);

    const existingCart = await Cart.findOne({ userId: req.session.USER._id });

    const product = await Product.findById(productId);

    if (!product || product.productQuantity <= 0) {
      res.status(404).json({ message: "Product not available" });
    }

    if (existingCart) {
      console.log("existingCart");

      // const productInCart = existingCart.products.find(
      //   (product) => product.productId === productId
      // );

      const productInCart = await Cart.findOne({
        userId: req.session.USER._id,
        products: { $elemMatch: { productId: productId } },
      });

      // console.log(productInwishlist);
      if (!productInCart) {
        existingCart.products.push({
          productId: productId,
          Quantity: 1,
      });
      await existingCart.save(); 
        return res
          .status(200)
          .json({ message: "Product added to cart successfully" });
      } else {
        console.log("Product is already in the cart");
      }
    
    } else {
      const cart = new Cart({
        userId: req.session.USER._id,
        products: [
          {
            productId: productId,
          },
        ],
      });
      await cart.save();
    }

    const products = await Product.find();

    // if (existingCart && existingCart.products.length === 0) {
    //   res.render("cart", { message: "Your cart is empty!" });
    // }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};




const wishlistCart = async (req, res) => {
  try {
    console.log("productDetail page");
    const productId = req.body.productId;
   
    console.log(req.session.USER._id);

    const existingCart = await Cart.findOne({ userId: req.session.USER._id });

    const product = await Product.findById(productId);

    if (!product || product.productQuantity <= 0) {
      res.status(404).json({ message: "Product not available" });
    }

    if (existingCart) {
      console.log("existingCart");

      const productInCart = existingCart.products.find(
        (product) => product.productId === productId
      );

      if (!productInCart) {
        existingCart.products.push({
          productId: productId,
          Quantity: 1,
      });
      await existingCart.save(); 
        return res
          .status(200)
          .json({ message: "Product added to cart successfully" });
      } else {
        console.log("Product is already in the cart");
      }
    
    } else {
      const cart = new Cart({
        userId: req.session.USER._id,
        products: [
          {
            productId: productId,
          },
        ],
      });
      await cart.save();
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



//----------------------------about

const aboutLoad = async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log(error);
  }
};

//--------------contact

const contactLoad = async (req, res) => {
  try {
    res.render("contact");
  } catch (error) {
    console.log(error);
  }
};

//----------------------cart

const cartLoad = async (req, res) => {
  try {
    if (req.session.USER) {
      const userId = req.session.USER._id;
      const coupon = await Coupon.find();

      const cart = await Cart.findOne({ userId: userId })
        .populate("userId")
        .populate("products.productId");
      res.render("cart", { cart, coupon });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    
  }
};

const addcart = async (req, res) => {
  try {
  
  } catch (error) {
    console.log(error);
  }
};

//================removecart

const removeCart = async (req, res) => {
  try {
    console.log("removeCart");
    const { cartId, productId,index } = req.body;
 
    const usercart = await Cart.findOne({ _id: cartId });

    usercart.products.splice(index, 1);
    usercart.updatedAt = Date.now();
    const saved = await usercart.save();

    res.status(200).json({ error: "Success" });
  } catch (error) {
    console.log(error);
  }
};

//=================================cartquantity

const quantity = async (req, res) => {
  try {
    console.log("quantity ");
    const { cartId, productid, productId, Quantity } = req.body;

    const cart = await Cart.findOne({ _id: cartId }).populate(
      "products.productId"
    );
    if (cart) {
      let exceedsLimit = false; // Flag to track if any product quantity exceeds the limit

      cart.products.forEach((product) => {
        const productQuantity = product.productId.productQuantity;
        console.log("Product Quantity:", productQuantity);

        if (productQuantity < Quantity) {
          exceedsLimit = true;
        }
      });
      if (exceedsLimit) {
        return res.status(400).json({ message: "Product count exceeds." });
      }
    } else {
      console.log("Cart not found");
    }

    const saved = await Cart.findOneAndUpdate(
      { _id: cartId, "products._id": productid },
      { $set: { "products.$.Quantity": Quantity } },
      { new: true }
    );
    // }
    if (!saved) {
      return res.status(404).json({ message: "Cart or product not found." });
    }
    return res.status(200).json({ message: "quantity moved" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//============================userProfile=

const userProfile = async (req, res) => {
  try {
    if (req.session.USER) {
      const User1 = req.session.USER._id;
      const user = await User.findById(User1);
      res.render("userProfile", { user });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
  }
};
const userProfileEdit = async (req, res) => {
  try {
    const userId = req.session.USER._id;
    const { name, email, password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.redirect("/userProfile");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//=================address=====

const address = async (req, res) => {
  try {
    const id = req.session.USER._id;
    const address = await Address.findOne({ userId: id });
    if (!address) {
      console.log("add address first");
    }

    res.render("address", { address });
  } catch (error) {
    console.log(error);
    res.redirect('/404')
  }
};

const addressEdit = async (req, res) => {
  try {
    const { _id, index, name, mobile, Housenumber, area, state, pincode } =
      req.body;

    const trimmedId = _id.trim();

    const updatedAddress = {
      "address.$.name": name,
      "address.$.mobile": mobile,
      "address.$.Housenumber": Housenumber,
      "address.$.area": area,
      "address.$.state": state,
      "address.$.pincode": pincode,
    };
    console.log(updatedAddress);

    const userId = req.session.USER._id;
    const address = await Address.findOneAndUpdate(
      { userId: userId, "address._id": trimmedId }, 
      { $set: updatedAddress }, 
      { new: true }
    );

    if (!address) {
      return res.status(404).send("Address not found");
    }
    res.redirect("/address");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const addressDelete = async (req, res) => {
  try {
    const { addressId } = req.body;
    console.log(addressId + "One");

    const deletedAddress = await Address.findOneAndUpdate(
      { "address._id": addressId }, 
      { $pull: { address: { _id: addressId } } },
      { new: true }
    );
    if (deletedAddress) {
      res.sendStatus(200);
    } else {
      res.status(404).send("Address not found");
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).send("Internal Server Error");
  }
};
//===========================addaddress

const addaddressLoad = async (req, res) => {
  try {
    res.render("addaddress");
  } catch (error) {
    console.log(error);
  }
};

const addaddress = async (req, res) => {
  try {
    const existingAddress = await Address.findOne({
      userId: req.session.USER._id,
    });

    if (existingAddress) {
      existingAddress.address.push({
        name: req.body.name,
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        Housenumber: req.body.housenumber,
        area: req.body.area,
        city: req.body.city,
        state: req.body.select,
        landmark: req.body.landmark,
        official: req.body.official,
      });

      await existingAddress.save();
    } else {
      const newAddress = new Address({
        userId: req.session.USER._id,
        address: [
          {
            name: req.body.name,
            mobile: req.body.mobile,
            pincode: req.body.pincode,
            Housenumber: req.body.housenumber,
            area: req.body.area,
            city: req.body.city,
            state: req.body.select,
            landmark: req.body.landmark,
            official: req.body.official,
          },
        ],
      });

      await newAddress.save();
    }
    res.redirect("/addaddress");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" }); 
  }
};

//=====================userProfilepasswordchange

const userProfilepasswordchange = async (req, res) => {
  try {
    res.render("userProfilepasswordchange");
  } catch (error) {
    console.log(error);
  }
};
const profilepasswordchange = async (req, res) => {
  try {
    const password = req.body.password;
    const newpassword = req.body.newpassword;
    const confirm = req.body.confirm;

    const userId = req.session.USER._id;
    const user = await User.findOne({ _id: userId });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      if (newpassword === confirm) {
        const hashedPassword = await bcrypt.hash(confirm, 10);

        user.password = hashedPassword;
        await user.save();
        console.log("Password updated successfully");
        res.redirect("/userProfilepasswordchange");
        return;
      } else {
        console.log("New password does not match the confirmation");
        res.redirect("/userProfilepasswordchange");
        return;
      }
    } else {
      console.log("Old password is incorrect");
      res.redirect("/profile");
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

//==============================wishlist

const wishlist = async (req, res) => {
  try {
    console.log("User wishlist...");
    const userId = req.session.USER._id;

    const wishlist = await Wishlist.findOne({ userId: userId }).populate(
      "products.productId"
    );

    res.render("wishlist", { wishlist });
  } catch (error) {
    console.log(error);
  }
};

const removewishlist = async (req, res) => {
  try {
    console.log("removewishlist");
    const { wishlistId, productId,index } = req.body;
   

    const userwishlist = await Wishlist.findById(wishlistId);

    // const existproduct = userwishlist.products.findIndex((product) => {
    //   product.productId.toString() === productId;
    // });

    userwishlist.products.splice(index, 1);
    const saved = await userwishlist.save();
 
    res.status(200).json({ message: "Wishlist removed" });
  } catch (error) {
    console.log(error);
  }
};



//=======================checkout

const checkoutLoad = async (req, res) => {
  try {
    console.log("Checkout process started");

    const id = req.session.USER._id;

    const wallet = await Wallet.findOne({ userId: id });
      const  walletn = Number(wallet.balance);
 

     const coupon = await Coupon.find();
     const address = await Address.findOne({ userId: id });
     const cart = await Cart.findOne({ userId: id })
      .populate("userId")
      .populate("products.productId");
    res.render("checkout", { address, cart, coupon,walletn });
  } catch (error) {
    console.log(error);
  }
};

const checkout = async (req, res) => {
  try {
    console.log("Checkout process started");
    const { index, userid, addressid, TotalPrice, paymentmethod, couponprice } =req.body;
    const user = req.session.USER._id;

    if (paymentmethod === 'Wallet') {
      const wallet = await Wallet.findOne({ userId: user });
  
  

       const Wallet=  wallet.balance - TotalPrice
         await Wallet.save()
  }
  
  
    const cart = await Cart.findOne({ userId: user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const address = await Address.findOne({ userId: userid });
    // console.log(address);
    if (!address || !address.address || index < 0) {
      return res
        .status(404)
        .json({ message: "Address not found or index out of range" });
    }

    const chosenAddress = address.address[index - 1];
    const items = cart.products;

    const newOrder = new Order({
      userId: user,
      products: items,
      address: chosenAddress,
      payment: paymentmethod,
      TotalAmount: TotalPrice,
      couponprice: couponprice,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const savedOrder = await newOrder.save();
    if (savedOrder) {
    }

    await Cart.findOneAndDelete({ userId: user });

    for (const item of items) {
      const product = await Product.findOne(item.productId);
      if (product) {
        product.productQuantity -= item.Quantity;

        await product.save();
      }
    }

    console.log("Order placed successfully");
    res.status(200).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const checkoutAddress = async (req, res) => {
  try {
    const filter = { userId: req.session.USER._id };
    let updatedAddress;

    if (
      req.body.name &&
      req.body.mobile &&
      req.body.pincode &&
      req.body.housenumber &&
      req.body.area &&
      req.body.city &&
      req.body.select &&
      req.body.official
    ) {
      const update = {
        $push: {
          address: {
            name: req.body.name,
            mobile: req.body.mobile,
            pincode: req.body.pincode,
            Housenumber: req.body.housenumber,
            area: req.body.area,
            city: req.body.city,
            state: req.body.select,
            landmark: req.body.landmark,
            official: req.body.official,
          },
        },
      };

      const options = { upsert: true, new: true };

      updatedAddress = await Address.findOneAndUpdate(filter, update, options);
    } else {
      const newAddress = new Address({
        userId: req.session.USER._id,
        address: [
          {
            name: req.body.name,
            mobile: req.body.mobile,
            pincode: req.body.pincode,
            Housenumber: req.body.housenumber,
            area: req.body.area,
            city: req.body.city,
            state: req.body.select,
            landmark: req.body.landmark,
            official: req.body.official,
          },
        ],
      });

      updatedAddress = await newAddress.save();
    }

    res.redirect("/checkout");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding/updating address");
  }
};

const checkouteditaddress = async (req, res) => {
  try {
    const {
      _id,
      index,
      name,
      mobile,
      Housenumber,
      area,
      state,
      pincode,
      official,
      city,
      landmark,
    } = req.body;

    const trimmedId = _id.trim();

    const updatedAddress = {
      "address.$.name": name,
      "address.$.mobile": mobile,
      "address.$.Housenumber": Housenumber,
      "address.$.area": area,
      "address.$.state": state,
      "address.$.pincode": pincode,
      "address.$.official": official,
      "address.$.city": city,
      "address.$.landmark": landmark,
    };

    const userId = req.session.USER._id;
    const address = await Address.findOneAndUpdate(
      { userId: userId, "address._id": trimmedId },
      { $set: updatedAddress },
      { new: true }
    );

    if (!address) {
      return res.status(404).send("Address not found");
    }
    res.redirect("/checkout");
  } catch (error) {
    console.log(error);
  }
};

const chooseAddress = async (req, res) => {
  try {
    console.log("chooseaddress");
    const { paymentmethod, index, addressid, userid } = req.body;
    const address = await Address.findOne({ userId: userid });
    if (!address) {
      return res.status(404).json({ error: "address not found" });
    }

    const chosenAddress = address.address[index];
    if (!chosenAddress) {
      return res.status(404).json({ error: "Address not found" });
    }

    const order = await Order.findOneAndUpdate(
      { userId: userid },
      { $push: { address: chosenAddress } },
      { new: true }
    );

    res.status(200).json({ message: "Address chosen successfully." });
  } catch (error) {
    console.log(error);
  }
};

const Addcoupon = async (req, res) => {
  try {
    const userId = req.session.USER._id;
    const totalprice = req.body.totalprice;
    const couponPrice = req.body.couponPrice;
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user." });
    }

    //  ================for coupon price exceeds

    if (couponPrice - totalprice > 0) {
      return res
        .status(400)
        .json({ message: "Coupon Price exceeds limit is." });
    }

    cart.couponPrice = couponPrice;
    const saved = await cart.save();

    if (saved) {
      return res.status(200).json({ message: "Coupon added successfully!." });
    }
  } catch (error) {
    console.log(error);
  }
};

const removecoupon = async (req, res) => {
  try {
    const userId = req.session.USER._id;
    const coupon = req.body.couponPrice;

    const remove = await Cart.updateOne(
      { userId: userId },
      { $unset: { couponPrice: "" } }
    );

    if (remove) {
      res.redirect("/checkout");
    }
  } catch (error) {
    console.log(error);
  }
};

//=================order

const orderLoad = async (req, res) => {
  try {
    res.render("order");
  } catch (error) {
    console.log(error);
  }
};
//====================orderhistory=========

const orderhistoryLoad = async (req, res) => {
  try {
    const user = req.session.USER._id;
    const orders = await Order.find({ userId: user })
      .populate("userId")
      .populate("products.productId")
      .sort({ createdAt: -1 });
    res.render("orderhistory", { orders });
  } catch (error) {
    console.log(error);
  }
};

const userorderDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const orders = await Order.findOne({ _id: id })
      .populate("userId")
      .populate("products.productId")
      .sort({ createdAt: -1 });

    let TotalAmountString = orders.TotalAmount;
    TotalAmountString = TotalAmountString.replace("₹", "");
    const TotalAmountNumber = Number(TotalAmountString);
    if (!isNaN(TotalAmountNumber)) {
      // console.log("TotalAmount as a number:", TotalAmountNumber);
    } else {
      // console.error("Failed to convert TotalAmount to a number");
    }

    res.render("orderDetail", { orders, TotalAmountNumber });
  } catch (error) {
    console.log(error);
    res.redirect('/404')

  }
};

const cancelOrder = async (req, res) => {
  try {
    console.log(req.body);
    const userId = req.session.USER._id;
    const orderId = req.body.orderId;
    const index = req.body.index;
    const productId = req.body.id;
    const productprice = req.body.productprice;
    const TotalAmount = req.body.TotalAmount;


    const order = await Order.findOne({ _id: orderId });

    if (order.payment == "Onlinepayment") {
      const wallet = await Wallet.findOne({ userId: userId });

      if (wallet) {
        const newEntry = {
          Reason: "Canceled",
          amount: productprice,
          transaction: "Deposits",
          date: new Date(),
        };

        const amountToAdd = parseFloat(productprice);

        wallet.history.push(newEntry);

        wallet.balance = parseFloat(wallet.balance) + amountToAdd;

        await wallet.save();

        console.log("New history entry added for user's wallet.");
      } else {
        const newWallet = new Wallet({
          userId: userId,
          balance: TotalAmount,
          history: [
            {
              Reason: "cancelproduct",
              amount: TotalAmount,
              transaction: "Deposit",
              date: new Date(),
            },
          ],
        });

        await newWallet.save();

        console.log("New wallet created for the user.");
      }
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId, "products._id": productId },
      {
        $set: {
          orderStatus: "cancelled",
          "products.$.orderStatus": "cancelled",
        },
      },
      { new: true }
    );
    console.log("cancelled");
    res.redirect("/orderDetail");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to cancel order." });
  }
};

const returnOrder = async (req, res) => {
  try {
    console.log('returnOrder ')
    const userId = req.session.USER._id;
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    const productprice = req.body.productprice;
   
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID." });
    }
            //===================
            const wallet = await Wallet.findOne({userId :userId})
          if (wallet) {
            const newEntry = {
              Reason: "Returned",
              amount: wallet.amount + productprice, 
              transaction: "Deposits",
              date: new Date(),
            };
      
            const amountToAdd = parseFloat(productprice);
      
            wallet.history.push(newEntry);
      
            wallet.balance = parseFloat(wallet.balance) + amountToAdd;
      
            await wallet.save();
      
            console.log("New history entry added for user's wallet.");
          } else {
            const newWallet = new Wallet({
              userId: userId,
              balance: productprice,
              history: [
                {
                  Reason: "returnedproduct",
                  amount: productprice,
                  transaction: "Deposit",
                  date: new Date(),
                },
              ],
            });
      
            await newWallet.save();
      
            console.log("New wallet created for the user.");
          }
      
      

    const orders = await Order.find({ _id: orderId });

  


    
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          orderStatus: "Request",
          "products.$[].orderStatus": "Request",
        },
      },
      { new: true }
    );
    console.log("Returned");
    res.redirect("/orderDetail");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to return order." });
  }
};

const invoice = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.find({ _id: orderId })
      .populate("userId")
      .populate("products.productId");
    let orders = false;
    order.forEach((order1) => {
      orders = order1.products.every(
        (product) => product.orderStatus === "Delivered"
      );
      console.log(`Order ${order1._id}: All products delivered? ${orders}`);
    });

  
    if (orders == true) {
      res.status(200).json({ order });
    }
  } catch (error) {
    console.log(error);
  }
};

//====================================wallet

const wallet = async (req, res) => {
  try {
    const userId = req.session.USER._id;
    const wallet = await Wallet.findOne({ userId: userId });
   
    if (wallet) {
      const sortedHistory = wallet.history.sort((a, b) => b.date - a.date);
      res.render("wallet", { wallet, history: sortedHistory });
    } else { 
      res.render('wallet',{wallet})
    }
  
  } catch (error) {
    console.log(error);
    res.redirect('/404');
  }
};


const razorpayCOD = async(req,res)=>{
  console.log("Razorpayayment");
  console.log(req.body);

  const { payment_id, order_id, signature } = req.body;

  const data = `${order_id}|${payment_id}`;

  const generated_signature = crypto
    .createHmac("sha256", "IFfmtKIgHPG3MPVxoTeBwEbb")
    .update(data)
    .digest("hex");

  if (generated_signature !== signature) {
    console.log("true?");
    return res.status(200).json({ message: "payment successful" });
  } else {
    return res
      .status(400)
      .json({
        success: false,
        message: "Payment signature verification failed",
      });
  }
}


const Razorpayayment = async (req, res) => {
  console.log("Razorpayayment");
  console.log(req.body);

  const { payment_id, order_id, signature } = req.body;

  const data = `${order_id}|${payment_id}`;

  const generated_signature = crypto
    .createHmac("sha256", "IFfmtKIgHPG3MPVxoTeBwEbb")
    .update(data)
    .digest("hex");

  if (generated_signature !== signature) {
    console.log("true?");
    return res.status(200).json({ message: "payment successful" });
  } else {
    return res
      .status(400)
      .json({
        success: false,
        message: "Payment signature verification failed",
      });
  }
};

const paymentOnOrders = async (req, res) => {
  try {

    console.log('paymentOnOrders');
    const {  orderID } = req.body;
    console.log('controller'+orderID)

    const updatedOrder = await Order.updateOne(
      { _id: orderID },
      { $set: { payment: ["Onlinepayment"] } }
    );
    console.log(updatedOrder)

    const { payment_id, order_id, signature } = req.body;

    const data = `${order_id}|${payment_id}`;

    const generated_signature = crypto
      .createHmac("sha256", "IFfmtKIgHPG3MPVxoTeBwEbb")
      .update(data)
      .digest("hex");

    if (generated_signature !== signature) {
      console.log("true?");
      res.status(200).json({ message: "payment successful" });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Payment signature verification failed",
        });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadRegister,
  insertUser,
  loginload,
  verifyLogin,
  userLogout,
  forgetLoad,
  forgetVerify,
  otpresetpasswordload,
  otpresetpasswordverify,
  loadResetPassword,
  resetPassword,
  loadOtp,
  submitOTP,
  resendOTP,
  home,
  Error,  
  productLoad,
  addproduct,
  productDetailsLoad,
  productdetails,
  wishlistCart,
  aboutLoad,
  contactLoad,

  //-------cart

  cartLoad,
  addcart,
  removeCart,
  quantity,

  //--------userProfile

  userProfile,
  userProfileEdit,
  addaddressLoad,
  addaddress,
  address,
  addressEdit,
  addressDelete,
  userProfilepasswordchange,
  profilepasswordchange,
  wishlist,
  removewishlist,
  checkoutLoad,
  checkout,
  checkoutAddress,
  checkouteditaddress,
  chooseAddress,
  Addcoupon,
  removecoupon,

  //==========order

  orderLoad,
  orderhistoryLoad,
  userorderDetail,
  cancelOrder,
  returnOrder,
  invoice,
  //=======wallet
  wallet,

  //razorpay
  razorpayCOD,
  Razorpayayment,
  paymentOnOrders,
};
