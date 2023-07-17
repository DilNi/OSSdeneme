const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');


// GET register 
router.get('/', userController.showRegisterForm);

// POST register
router.post('/', userController.registerUser);

module.exports = router;