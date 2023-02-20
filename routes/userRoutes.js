const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/admin');


// User Route
router.route('/')
    .get(userController.getAllUsers)
    .post(userController.registerUser)

router.route("/:id")
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.route('/login')
.post(userController.loginUser)

router.route('/login/admin')
.post(userController.loginAdmin)


module.exports = router