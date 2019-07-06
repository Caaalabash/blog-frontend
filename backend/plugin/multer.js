const multer = require('multer')

module.exports = app => {
  const { upload } = app.app_config

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const path = file.fieldname === 'audio' ? upload.audio : upload.img

      cb(null, path)
    },
    filename: function (req, file, cb) {
      const fileFormat = (file.originalname).split('.')
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
    }
  })

  return multer({ storage })
}
