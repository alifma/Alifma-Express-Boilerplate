
// Ambil Multer dan Path
const multer = require('multer')
const path = require('path')

// Response Helper 
const { error } = require('./response')

// Definisi Filename dan Tempat Penyimpanan
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/img')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`)
  }
})

// Definisi Rule File yang akan diupload
const multerUpload = multer({
  storage: multerStorage,
  limits: {
      fileSize: 1 * 1024 * 1024 //1MB
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const allowedType = ['.jpg','.JPG','.jpeg','.JPEG','.PNG','.png']
    if(allowedType.includes(ext)) {
      cb(null, true)
    }else{
      cb({message: 'Error File Type'}, false)
    }
  }
})

// Definisi File mana yang akan diupload
const singleUpload = (req, res, next) =>   {
  const multerSingle = multerUpload.single('image')
  multerSingle(req, res, (err) => {
    if(err){
      error(res, 400, 'Error File Upload', err.message, {})
    }else{
      next()
    }
  })
}

// Exports Module
module.exports = {singleUpload}