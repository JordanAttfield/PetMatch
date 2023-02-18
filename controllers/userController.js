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

const createNewUser = asyncHandler(async (req, res) => {   
    const { username, password, roles } = req.body
    // Check if required fields are present
    if (!username || !password || !roles.length) {
      return res.status(400).json({ message: 'All data fields are required' });
    }
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      roles,
    });
    const user = await newUser.save();
    
    return res.status(201).json({ message: 'User successfully created' });
  });


// Update User (PATCH)
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles } = req.body;
    
    // Validate required fields
    if (!id || !username || !roles.length) {
        return res.status(400).json({ message: 'ID, username and roles are required fields' });
    }

    // Check if user exists
    const user = await User.findById(id).exec();
    if (!user) {
        return res.status(400).json({ message: 'No user matching that ID was found' });
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Username already exists in the database' });
    }

    // Update user details
    user.username = username;
    user.roles = roles;
    if (password) {
        user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
});


// Delete User (DELETE)
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params

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