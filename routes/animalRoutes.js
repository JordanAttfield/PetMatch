const express = require('express')
const router = express.Router()
const animalController = require('../controllers/animalController')

// Animal Route
router.route('/')
    .get(animalController.getAllAnimals)
    .post(animalController.createNewAnimal)

router.route("/:id")
  .patch(animalController.updateAnimal)
  .delete(animalController.deleteAnimal);


module.exports = router