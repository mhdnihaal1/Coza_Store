const path = require('path');
const multer = require('multer');




var  storage=multer.diskStorage({
destination:function(req,file,callback){
    callback(null,'uploads/')
},
filename:function(req,file,callback){
    let ext = path.extname(file.originalname)
    callback(null,Date.now() + ext)
}
})


var upload = multer ({
    storage:storage,
    // fileFilter:function(req,file,callback){
    //     if( 
    //         file.mimetype == 'image/png' ||
    //         file.mimetype == 'image/jpg' || 
    //         file.mimetype == 'image/jpeg' ||
    //         file.mimetype == 'image/gif'||
    //         file.mimetype == 'image/bmp'
    //         ) {
    //         callback(null,true)
    //     }else{
    //         console.log('Only jpg,jpeg and png file supported');
    //         callback(null,false)
    //     }
    // },
    limits:{
        fileSize: 1024*1024*2
    }
});


module.exports =  upload;