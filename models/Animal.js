const mongoose = require('mongoose');  

const AnimalSchema = new mongoose.Schema({
  animalType: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
    required: true,
  },
  photo: {
    data: Buffer,
    contentType: String,
    filename: String,
  },
  medications: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  adopted: {
    type: Boolean,
    default: false,
    required: true,
  },
});

module.exports = mongoose.model('Animal', AnimalSchema)