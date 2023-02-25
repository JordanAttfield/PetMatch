const multer = require('multer');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop()) // Use a unique filename for uploaded files
  }
});

// Set up Multer middleware
const upload = multer({ storage: storage });

// Middleware function to handle image uploads
const uploadImage = (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading image'
      });
    }
    next();
  });
};

module.exports = uploadImage;
