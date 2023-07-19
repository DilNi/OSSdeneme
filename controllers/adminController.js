const Question = require('../models/Question');

exports.saveQuestion = (req, res) => {
  const { subject, difficulty, description, option1, option2, option3, option4, option5, correctOption } = req.body;

  const newQuestion = new Question({
    subject,
    difficulty,
    description,
    option1,
    option2,
    option3,
    option4,
    option5,
    correctOption
  });

  newQuestion.save()
    .then(() => {
      res.redirect('/admin/dashboard'); // Başarılı kayıt durumunda admin paneline yönlendir
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Soru kaydedilirken bir hata oluştu.');
    });
};

exports.registerUser = (req, res) => {
  const { email, password } = req.body;

  const user = new User({  email, password });

  user.save()
    .then(() => {
      res.redirect('/register');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Sunucu hatası');
    });
};

