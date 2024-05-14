    const User = require("../model/userModel");

    const isBlock = async (req, res, next) => {
        try {
            if (req.session.USER) {
                const { _id } = req.session.USER;
                console.log(_id+'idoooooooooo');
                const user = await User.findById(_id);

                if (user && !user.is_Blocked == true) { 
                    next();
                } else {
                    req.session.destroy();
                    return res.redirect('/login'); 
                }
            } else {
                return res.redirect('/login');
            }
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };

    module.exports={
        isBlock
    }