const category = require("../model/categoryModel");
const bcrypt = require("bcrypt");
const randomString = require("randomstring");
const config = require("../config/config");
const twit = require("twit");

const categoryLoad = async (req, res) => {
  try {

    const cats = await category.find();
  //console.log(cats)
    res.render("category",{cats});
  } catch (error) {
    console.log(error.message);
  }
};



const categoryList=async(req,res)=>{
  try{
    console.log("hiii");
    const id=req.body.categoryId;
    console.log(id)

    const categoryId = await category.findOne({_id:id})

    if(!categoryId){
      res.json("category not found")
    }
    categoryId.is_Listed=true;
   const saved = await categoryId.save()

  res.json({ message: "List successfully" });

  }catch(error){
    console.log(error.message)
    res.status(500).send('Internal Server Error');
  }
}



const categoryUnList=async(req,res)=>{
  try{

    const id=req.body.categoryId;
    console.log(id)

    const categoryId = await category.findOne({_id:id})

    if(!categoryId){
      res.json("category not found")
    }
    categoryId.is_Listed=false;
   const saved = await categoryId.save()

  res.json({ message: "UnList successfully" });

  }catch(error){
    console.log(error.message)
    res.status(500).send('Internal Server Error');
  }
}


const addCategory = async (req, res) => {
  try {
    const Category= await category.find() ;
    res.render("addcategory",{Category});
  } catch (error) {
    console.log(error.message);
  }
};

const addcategoryPost = async (req, res) => {
  try {
    const categoryName1 = req.body.categoryName1; // Correctly access the categoryName1 from the request body
    console.log(categoryName1);
    const existingCategory= await category.findOne({category: { $regex: new RegExp(`^${categoryName1}$`, "i") } })

    // const existingCategory = await category.findOne({ category: categoryName1 });
    console.log(existingCategory);

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    } else {
      const cat = new category({ category: categoryName1 });
      await cat.save();

      res.status(201).json({ message: "Category created successfully" });
    }
  } catch (error) {
    console.log(error.message);
    // Send a JSON response indicating an internal server error
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const editCategoryLoad = async (req,res)=>{

  try{
  const id= req.params.id;
console.log(id);
    const Cats = await category.findOne({_id:id});
console.log(Cats);
        res.render('editcategory',{Cats})

  }catch(error){
    console.log(error)
    res.redirect('/404')

  }
}


const editCategory = async (req, res) => {
  try {
    console.log('hiii');
    // const category=req.body.categoryName;
    const Id = req.body.categoryid;
    const categorya=req.body.categoryName
    console.log(Id)
    console.log(categorya)

    const valid= await category.findOne({category: { $regex: new RegExp(`^${categorya}$`, "i") } })
console.log(valid);
if(valid){
  return res.status(400).json({ message: "Category already exists" });

}else{
      const saved = await category.findByIdAndUpdate({_id:Id},{$set:{category:categorya}})
  
console.log(saved);
   // category.categoryName = req.body.categoryName;
    const saaved =await saved.save();
    if(saaved){
      res.status(201).json({ message: "Category edited successfully" });
    }
}


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  categoryLoad,
  categoryList,
  categoryUnList,
  addCategory,
  addcategoryPost,
  editCategoryLoad,
  editCategory
};
