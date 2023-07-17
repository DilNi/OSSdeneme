const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// GET login
router.get('/', (req, res) => {
  res.render('login');
});

// POST login
router.post('/', userController.loginUser);

module.exports = router;