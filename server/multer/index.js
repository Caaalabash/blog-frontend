const multer = require('multer');
const config = require('../config')
const storage = multer.diskStorage({
  //设置上传后文件路径，uploads文件夹会自动创建。
  destination: function (req, file, cb) {
    let path
    if(file.fieldname==='audio'){
      path = config.upload.audio
    }else{
      path = config.upload.img
    }
    cb(null, path);
  },
  //给上传文件重命名，获取添加后缀名
  filename: function (req, file, cb) {
    const fileFormat = (file.originalname).split(".");
    cb(null, file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
//添加配置文件到muler对象。
const upload = multer({
  storage: storage
});

//导出对象
module.exports = upload;
