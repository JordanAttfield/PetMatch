const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const uploadImage = require('../middleware/uploadImage');
const path = require('path')
const fs = require('fs')


// Animal Route
router.route('/')
  .get(animalController.getAllAnimals)
  .post(uploadImage, animalController.createNewAnimal);

router.route('/:id')
  .patch(animalController.updateAnimal)
  .delete(animalController.deleteAnimal);

// Route to view uploaded images
router.get('/images/:filename', (req, res) => {
  const imagePath = path.join(__dirname, '..', 'uploads', req.params.filename);
  
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

module.exports = router;
