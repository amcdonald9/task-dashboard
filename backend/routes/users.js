const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/', userController.getAllUsers);

// Create a new user
router.post('/', userController.createUser);

// Delete a user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router; // <-- must export router, not controller
