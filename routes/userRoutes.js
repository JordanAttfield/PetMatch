const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// User Route
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.registerUser)

router.route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/login')
.post(userController.loginUser)

module.exports = router