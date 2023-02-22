const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const multer = require('multer');
const upload = multer();

// Animal Route
router.route('/')
  .get(animalController.getAllAnimals)
  .post(upload.single('photo'), animalController.createNewAnimal);

router.route('/:id')
  .patch(upload.single('photo'), animalController.updateAnimal)
  .delete(animalController.deleteAnimal);

module.exports = router;
