const isLogin = async (req, res, next) => {
    try {
       console.log("111333333");
       const user = req.session.USER;
      if (req.session.USER && user.is_verified === 1) {
       next()
      } else {
        res.redirect("/login");
      }
     
    } catch (error) { 
      console.log(error.message);
    }
  };
  
  const isLogout = async (req, res, next) => {
    try {
      if (req.session.USER) {
        res.redirect("/");
      }else{
          next();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  module.exports = {
    isLogin,
    isLogout,
  };
  