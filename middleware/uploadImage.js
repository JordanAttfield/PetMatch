const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Check that the uploaded file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter 
}).single('photo'); 

const uploadImage = (req, res, next) => {
  console.log('Middleware called')
  upload(req, res, function (err) {
    if (err) {
      console.log(err)
      res.status(400).json({ success: false, message: err.message });
    } else {
        console.log(req.file)
      req.body.photo = req.file.filename;
      next();
    }
  });
};

module.exports = uploadImage;
