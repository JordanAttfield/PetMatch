const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Use try/catch to prevent OverwriteModelError
let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', userSchema);
}

// Add a method to the schema to check if a user is an admin
userSchema.methods.isAdminUser = function() {
  return this.isAdmin === true;
}

module.exports = User;
