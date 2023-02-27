const Animal = require('../models/Animal')
const asyncHandler = require('express-async-handler')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Get all Animals (GET)
const getAllAnimals = asyncHandler(async (req, res) => {
    try {
        const animals = await Animal.find().lean()

        if (animals.length === 0) {
            return res.status(404).json({ message: 'No animals were found' })
        }

        res.json(animals)
    } catch (error) {
        res.status(500).json({ message: 'Error occured while fetching all animals' })
    }
})

// Create New Animal (POST)
const createNewAnimal = asyncHandler(async (req, res) => {
  try {
    const { animalType, name, age, sex, medications, notes, adopted } = req.body;

    // Ensure all fields are entered
    if (!animalType || !name || !age || !sex || !medications || !notes) {
      return res.status(400).json({ message: 'All data fields are required' });
    }

    // Checking animal doesn't already exist
    const duplicateName = await Animal.findOne({ name }).lean().exec();
    if (duplicateName) {
      return res.status(409).json({ message: 'That animal already exists in database' });
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
        filename: file.filename,
        data: file.buffer,
        contentType: file.mimetype,
      },
      medications,
      notes,
      adopted,
    });

    //Creating animal
    const createdAnimal = await newAnimal.save();
    return res.status(201).json({ message: 'Animal successfully added' });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'One or more fields are invalid' });
    } else if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(409).json({ message: 'That animal already exists in database' });
    } else if (err.message === 'Photo file is required') {
      return res.status(400).json({ message: 'Photo file is required' });
    } else {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  }
});

const updateAnimal = asyncHandler(async (req, res) => {
  try {
    const { _id, animalType, name, age, sex, medications, notes, adopted } = req.body;

    // Validate required fields
    if (!_id || !animalType || !name || !age || !sex || !medications || !notes) {
      return res.status(400).json({ message: 'All data fields are required' });
    }

    // Check if animal exists
    const animal = await Animal.findById(_id).exec();
    if (!animal) {
      return res.status(400).json({ message: 'No animal matching that ID was found' });
    }

    try {
      // Check for duplicates
      const duplicate = await Animal.findOne({ name }).exec();
      if (duplicate && duplicate._id.toString() !== animal._id.toString()) {
        return res.status(409).json({ message: 'Animal with this name already exists in the database' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error checking for duplicate animal', error });
    }

    // Get the file object from the request
    const file = req.file;

    // Update animal details
    animal.animalType = animalType;
    animal.name = name;
    animal.age = age;
    animal.sex = sex;
    animal.medications = medications;
    animal.notes = notes;
    animal.adopted = adopted;

    try {
      // Check if file exists and update the photo data and contentType
      if (file) {
        animal.photo = {
          data: file.buffer,
          contentType: file.mimetype,
        };
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error updating photo', error });
    }

    try {
      // Save updated animal to database
      await animal.save();
    } catch (error) {
      return res.status(500).json({ message: 'Error saving updated animal to database', error });
    }

    res.status(200).json({ message: 'Animal updated successfully', animal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Delete Animal (DELETE)
const deleteAnimal = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).json({ message: "Animal ID is required" });
    }

    const animal = await Animal.findById(id).exec();

    if (!animal) {
      return res.status(400).json({ message: "No animal was found" });
    }

    const result = await animal.deleteOne();

    res.json({ message: "Animal deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid animal ID" });
    }

    res.status(500).json({ message: "Server error" });
  }
});


module.exports = {
    getAllAnimals,
    createNewAnimal,
    updateAnimal,
    deleteAnimal
}