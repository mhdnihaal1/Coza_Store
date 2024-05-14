const Product = require("../model/productModel");
const Offer = require("../model/offerModel");
const Discount= require("../model/discountModel")
const Category=require("../model/categoryModel")
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const config = require("../config/config");
const twit = require("twit");
const path = require('path')

//------------------- product page

const productDetailsLoad =async (req,res)=>{
    try{
        const discount = await Discount.find()
        const offer=await Offer.find();
        const products = await Product.find()

        res.render('productDetails',{products,offer,discount})
      
    }catch(error){
      console.log(error.message)
      res.status(500).send('Internal Server Error')
    }
  }
  
  //---------------------- for product list and  unlist----------

  const productlist = async (req,res)=>{
    try{
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        const{
            productId:productId,
            productState:productState
        }=req.body

    console.log(productState);
    console.log(productId);
    console.log('hloooooooooooooo');

    const productid = await Product.findOne({_id:productId})

    if(!productid){
      res.json("category not found")
    }
    productid.is_Listed=false;
    console.log(productid);
   const saved = await productid.save()

  res.json({ message: "List successfully" });

    }catch(error){
     console.log(error)
    }
}



const productunlist = async (req,res)=>{
    try{
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        const Id=req.body.productId
        console.log(Id);
        const{
            productId:productId,
            productState:productState
        }=req.body

    console.log(productState);
    console.log(productId);
    console.log('hloooooooooooooo');

    const productid = await Product.findOne({_id:productId})

    if(!productid){
      res.json("category not found")
    }
    productid.is_Listed=true;
    console.log(productid);

   const saved = await productid.save()

  res.json({ message: "unList successfully" });

    }catch(error){
     console.log(error);
    }
}


const addoffertoproduct = async (req, res) => {
  try {
       const { productId,offerId } = req.body;
console.log(productId,offerId );
      const product = await Product.findOne({_id:productId});

      if (!product) {
          return res.status(404).json({ error: 'Product not found' });
      }

      const offer = await Offer.findOne({ _id: offerId });

    if (!offer) { 
      return res.status(404).json({ error: 'Offer not found' });
    }

      if (product.offerDetails.length !== 1) {
        product.offerDetails.push({
          offerName: offer.offerName,
          offerPrice: offer.offerPrice,
          offerStarted: offer.offerStarted,
          offerEnd: offer.offerEnd,
          offerId:offerId
        });
    

        await product.save();

        return res.status(200).json({ message: 'Offer added to product successfully' });
    } else {
        return res.status(400).json({ error: 'Cannot add more than one offerDetails' });
    }
     
  } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
  }
};

const removeofferfromproduct = async (req, res) => {
  try {
      const { productId, offerId } = req.body;
      console.log(productId,offerId+'nihal' );

      const product = await Product.findById(productId);
      
      // Check if product and product.offerDetails exist and offerDetails is an array
      if (!product ) {
          return res.status(404).send({ message: 'Product not found or offerDetails missing' });
      }

      // Use filter to remove the element with matching offerId
      product.offerDetails = product.offerDetails.filter(offer => !offer.offerId.equals(offerId));

      // Save the updated product
      const savedProduct = await product.save();

      res.send({ message: 'Offer removed successfully', product: savedProduct });
  } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'An error occurred while removing the offer' });
  }
};


const adddiscounttoproduct = async (req, res) => {
  try {
    const { productId, discountId } = req.body;
    console.log(productId, discountId);

    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const discount = await Discount.findOne({ _id: discountId });
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }

    // Check if the product already has a discount applied
    if (product.discount.length === 0) {
      product.discount.push({
        discountPrice: discount.discountPrice,
        discountStarted: discount.discountStarted,
        discountEnd: discount.discountEnd,
        discountId: discountId
      });

      await product.save();
      return res.status(200).json({ message: 'discount added to product successfully' });
    } else {
      return res.status(400).json({ error: 'Cannot add more than one discount' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

  //------------------------------product adding page
  
  const addproductLoad =async (req,res)=>{
    try{
      const category= await Category.find();

       res.render('addproduct',{category}) 
  
    }catch(error){
      console.log(error.message)
      res.status(500).send('Internal Server Error');
    }
  }
  const addProduct = async (req, res) => {
    try {
      console.log('addproduct')
          console.log(req.files);
      let paths = []; // Initialize an array to store image paths

      if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
          paths.push(req.files[i].path);
          
        }
      }
      console.log(req.body.formData)
      // Create a new product instance
      const product = new Product({
        productName:req.body.productName,
        productPrice:req.body.productPrice,
        productQuantity:req.body.productQuantity,
        productCategory:req.body.productCategory,
        productDetails:req.body.productDetails,
        productDescription:req.body.productDescription,
        productImage:paths
      });
      
     
    
      const savedProduct = await product.save();
      console.log(savedProduct);

      res.redirect('/productDetails')
    
      // if (savedProduct) {
      // res.status(200).json({status:'success'});
      // }
    
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    } 
  };
  


  const editProductLoad= async (req,res)=>{
     try{
       const id= req.params.id
        // console.log(id);
        // console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        const product = await Product.findOne({_id:id});
        const category= await Category.find();
      // console.log(product);
     res.render('editproduct',{product,category})
     }catch(error){
        console.log(error);
        res.redirect('/404')

     }
  }

    //edit Product details
    const editProduct = async (req, res) => {

      try {
        // console.log('jjjjjjjjjjjjjjjjjjjj');
        // console.log(req.body._id);

        let paths = []; // Initialize an array to store image paths
        if (req.files) {
          for (let i = 0; i < req.files.length; i++) {
            paths.push(req.files[i].path);
          }
        }
        console.log(paths);
        if (paths.length !== 0 && paths.every(path => path !== undefined )&& paths.length>=4 ) {
          const Path1 = "/uploads/" + path.basename(paths[0]);
          const Path2 = "/uploads/" + path.basename(paths[1]);
          const Path3 = "/uploads/" + path.basename(paths[2]);
          const Path4 = "/uploads/" + path.basename(paths[3]);

    
          await Product.findByIdAndUpdate(
            { _id: req.body._id },
            {
              $set: {
                productName: req.body.productName,
                productCategory:req.body.categoryName,
                productPrice: req.body.productPrice,
                productQuantity: req.body.productQuantity,
                productDescription: req.body.productDescription,
                productImage: [Path1,Path2,Path3,Path4],
              },
            }
          );
        } else {
          await Product.findByIdAndUpdate(
            { _id: req.body._id },
            {
              $set: {
                productName: req.body.productName,
                productCategory:req.body.categoryName,
                productPrice: req.body.productPrice,
                productQuantity: req.body.productQuantity,
                productDescription: req.body.productDescription,
            
              },
            }
          );
        }
        res.redirect("/productDetails");
      } catch (error) {
        console.log(error.message);
        // res.status(500).render('error', { error: error.message });
      }
    };
    
 //======================================   users  ===========================================

 

  module.exports={
    productDetailsLoad,
    addproductLoad,
    addProduct,
    editProductLoad,
    editProduct,
    productlist,
    productunlist,
    addoffertoproduct,
    removeofferfromproduct,
    adddiscounttoproduct
  }
  