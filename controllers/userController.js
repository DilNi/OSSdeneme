const User = require('../models/Users');

// Kullanıcı kaydı formunu göster
exports.showRegisterForm = (req, res) => {
  res.render('register');
};

// Kullanıcı kaydını işle
exports.registerUser = (req, res) => {
  const {email, password } = req.body;
  const user = new User({ email, password });

  user.save()
    .then(() => {
      res.redirect('/register');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Sunucu hatası');
    });
};

exports.showQuizPage = (req, res) => {
  // Kullanıcının quiz sayfasını gösterme işlemleri
  res.render('quiz', { message: req.flash('message') });
};

