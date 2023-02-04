const mongoose = require('mongoose');  

const AnimalSchema = new mongoose.Schema({
    animalType: {
        type: String,
        required: true
    },
    name: {
        type: String,  
    },
    age: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    notes: {
        type: String,
    },
    adopted: {
        type: Boolean,
        default: false,
        required: true
    }
})

module.exports = mongoose.model('Animal', AnimalSchema)