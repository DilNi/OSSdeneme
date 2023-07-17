const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/login', (req, res) => {
  res.render('login', { admin: true, message: req.query.message }); // Admin giriş sayfasını gösterme işlemleri
});



router.post('/register', adminController.registerUser);
router.get('/dashboard', (req, res) => {
  // Admin panelini gösterme işlemleri
  if (req.session.adminLoggedIn === true) {
    res.render('dashboard');
  } else {
    res.redirect('/admin/login'); // Hatalı giriş durumunda admin login sayfasına yönlendirme
  }
});



router.post('/login', (req, res) => {
  // Admin giriş işlemleri
  const { email, password } = req.body;

  if (email === 'admin@example.com' && password === 'admin123') {
    req.session.adminLoggedIn = true;
    return res.redirect('/admin/dashboard'); // Admin paneline yönlendirme
  }

  return res.redirect('/login?message=Hatalı%20giriş%20bilgileri'); // Hatalı giriş durumunda login sayfasına yönlendirme
});

exports.saveQuestion = (req, res) => {
  // Soru kaydetme işlemleri
};


router.post('/ion', adminController.saveQuestion);

module.exports = router;
