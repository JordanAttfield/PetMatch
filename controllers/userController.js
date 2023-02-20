const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

// Get all users (GET)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean()  //stops find method from returning password and returning whole document
    // Checking if user exists, then return users
    if (!users) {
        return res.status(400).json({message: 'No users were found'})
    }
    res.json(users)
})

const registerUser = asyncHandler(async (req, res) => {   
    const { username, password, isAdmin} = req.body
    // Check if required fields are present
    if (!username || !password) {
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
      isAdmin: isAdmin || false // default to false if not provided

    });
    const user = await newUser.save();
    
    return res.status(201).json({ message: 'User successfully created' });
  });


// Update User (PATCH)
const updateUser = asyncHandler(async (req, res) => {
    const { _id, username, password, isAdmin } = req.body;
    
    // Validate required fields
    if (!_id || !username) {
        return res.status(400).json({ message: 'ID, username are required fields' });
    }

    // Check if user exists
    const user = await User.findById(_id).exec();
    if (!user) {
        return res.status(400).json({ message: 'No user matching that ID was found' });
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate._id.toString() !== _id) {
        return res.status(409).json({ message: 'Username already exists in the database' });
    }

    // Update user details
    user.username = username;
    user.isAdmin = isAdmin;
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

// Login User 
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body

  // Check if required fields are present
  if (!username || !password) {
    return res.status(400).json({ message: 'Both username and password are required' })
  }

  // Check if user exists
  const user = await User.findOne({ username })
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  // Check if password is correct
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_ACCESS_TOKEN, {
    expiresIn: '1h'
  })

  res.setHeader('Content-Type', 'application/json');
  res.json({ message: 'Logged in successfully', token })
})

// Login an admin user
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the admin user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check if the user is an admin
    if (!user.isAdmin) {
      return res.status(401).json({ message: 'You are not authorized to access this endpoint' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate an access token
    const token = jwt.sign({ userId: user._id },process.env.SECRET_ACCESS_TOKEN);

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    getAllUsers,
    registerUser,
    updateUser,
    deleteUser,
    loginUser,
    loginAdmin,
   
}