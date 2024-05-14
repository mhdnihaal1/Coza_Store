const isLogin = async (req, res, next) => {
  try {
    // console.log("111333333");
    // const user = req.session.USER;
    if ( req.session.admin == 'Admin') {
      next()
    } else {
      res.redirect("/adminLogin"); 
    }
  } catch (error) {
    console.log(error.message);
  } 
};

const isLogout = async (req, res, next) => {
  try {
    const user = req.session.USER;
    user.destroy();
    if (user) {
      res.redirect("/dashboard");
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};


// const isError = async(err,req,res,next)=>{
//   try{
//     // if(){
//     //   res.redirect
//     // }
//     next()
//   }catch(error){
//     console.log(error)
//   }
// }
module.exports = {
  isLogin,
  isLogout,
};
