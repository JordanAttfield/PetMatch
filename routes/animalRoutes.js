const express = require('express')
const router = express.Router()
const animalController = require('../controllers/animalController')

// Animal Route
router.route('/')
    .get(animalController.getAllAnimals)
    .post(animalController.createNewAnimal)
    .patch(animalController.updateAnimal)


router.route('/:id')
    .delete(animalController.deleteAnimal)


module.exports = router