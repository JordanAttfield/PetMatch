const Animal = require('../models/Animal')
const asyncHandler = require('express-async-handler')
const multer = require('multer');

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Get all Animals (GET)
const getAllAnimals = asyncHandler(async (req, res) => {
    const animals = await Animal.find().lean()  
    // Checking if animals exist, then return all animals
    if (!animals) {
        return res.status(400).json({message: 'No animals were found'})
    }
    res.json(animals)
})

// Create New Animal (POST)
const createNewAnimal = asyncHandler(async (req, res) => { 
    const { animalType, name, age, sex, medications, notes, adopted } = req.body
    // Ensure all fields are entered
    if (!animalType|| !name || !age || !sex || !medications || !notes ) {
        return res.status(400).json({ message: 'All data fields are required'})
    }
    // Checking animal doesn't already exist
    const duplicateName = await Animal.findOne({ name }).lean().exec()
    if (duplicateName) {
        return res.status(409).json({ message: 'That animal already exists in database'})
    }

    // Get the file object from the request
    const file = req.file;

    // Check if file exists
    if (!file) {
        return res.status(400).json({ message: 'Photo file is required' });
    }

    // Create a new animal object with the file data
    const newAnimal = new Animal({
        animalType,
        name,
        age,
        sex,
        photo: {
            data: file.buffer,
            contentType: file.mimetype
        },
        medications,
        notes,
        adopted
    })

    //Creating animal
    const createdAnimal = await newAnimal.save()
    return res.status(201).json({ message: 'Animal successfully added' });
});

// Update Animal (PATCH)
const updateAnimal = asyncHandler(async (req, res) => {
    const { _id, animalType, name, age, sex, medications, notes, adopted } = req.body;
    
    // Validate required fields
    if (!_id || !animalType|| !name || !age || !sex || !medications || !notes) {
    return res.status(400).json({ message: 'All data fields are required'})
}

    // Check if animal exists
    const animal = await Animal.findById(_id).exec();
    if (!animal) {
        return res.status(400).json({ message: 'No animal matching that ID was found' });
    }

    // Check for duplicates
    const duplicate = await Animal.findOne({ name }).exec();
    if (duplicate && duplicate._id.toString() !== animal._id.toString()) {
        return res.status(409).json({ message: 'Animal with this name already exists in the database' });
    }

   // Get the file object from the request
   const file = req.file;

   // Update animal details
   animal.animalType = animalType
   animal.name = name
   animal.age = age
   animal.sex = sex
   animal.medications = medications
   animal.notes = notes
   animal.adopted = adopted

    // Check if file exists and update the photo data and contentType
  if (file) {
    animal.photo = {
      data: file.buffer,
      contentType: file.mimetype,
    };
  }

  // Save updated animal to database
  await animal.save();

  res.status(200).json({ message: 'Animal updated successfully', animal });
});


// Delete Animal (DELETE)
const deleteAnimal = asyncHandler(async (req, res) => {
    const { id } = req.params

    if (!id) {
        return res.status(400).json({ message: 'Animal ID is required'})
    }

    const animal = await Animal.findById(id).exec()

    if (!animal) {
        return res.status(400).json({ message: 'No animal was found'})
    }

    const result = await animal.deleteOne()

    res.json({ message: 'Animal deleted successfully' })

})

module.exports = {
    getAllAnimals,
    createNewAnimal,
    updateAnimal,
    deleteAnimal
}