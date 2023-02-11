const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @dec Get all users (GET)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()  //stops find method from returning password and returning whole document
    // Checking if user exists, then return users
    if (!users) {
        return res.status(400).json({message: 'No users were found'})
    }
    res.json(users)
})

// Create New User (POST)
const createNewUser = asyncHandler(async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ message: "ID field is required" });
    }    
    const { username, password, roles } = req.body
    // Ensure all fields are filled in
    if (!username || !password || !roles.length) {
        return res.status(400).json({ message: 'All data fields are required'})
    }
    // Checking user doesn't already exist
    const duplicate = await User.findOne({ username }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: 'Username already exists in database'})
    }
    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10)

    const userObject = { username, "password": hashedPassword, roles }

    //Creating user
    const user = await User.create(userObject)

    if (user) {
        res.status(201).json({ message: 'User successfully created'})
    } else {
        res.status(400).json({ message: 'User could not be created'})
    }

})

// Update User (PATCH)
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles } = req.body
    // Ensure all fields are filled in
    if (!id || !username || !roles.length) {
        return res.status(400).json({ message: 'All data fields are required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'No user matching that ID was found'})
    }
    // Checking user doesn't already exist
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists in the database' })
    }

    user.username = username
    user.roles = roles

    if (password) {
        user.password = await bcrypt.hash(password, 10)
    }

    const updateUser = await user.save()

    res.json({ message: 'Updated user'})

})

// @dec Delete User (DELETE)
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ message: 'User ID is required'})
    }

    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'No user was found'})
    }

    const result = await user.deleteOne()

    res.json({ message: 'User deleted successfully' })

})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}