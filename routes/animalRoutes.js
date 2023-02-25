const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const uploadImage = require('../middleware/uploadImage');

// Animal Route
router.route('/')
  .get(animalController.getAllAnimals)
  .post(uploadImage, animalController.createNewAnimal);

router.route('/:id')
  .patch(animalController.updateAnimal)
  .delete(animalController.deleteAnimal);

module.exports = router;
