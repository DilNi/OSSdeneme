const Question = require('../models/Question');

// S listele
exports.getQuestion = (req, res) => {
  Question.find({ user: req.user._id })
    .then(save_question => {
      res.render('save_question', { save_question });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Sunucu hatası');
    });
};


// Soru ekleme işlemini yöneten kontrolcü işlev
exports.addQuestion = async (req, res) => {
  try {
    const { subject, difficulty, question, options, correctOption } = req.body;

    // Soru verilerini kullanarak yeni bir Question nesnesi oluştur
    const newQuestion = new Question({
      subject,
      difficulty,
      question,
      options,
      correctOption,
    });

    // Yeni soruyu veritabanına kaydet
    await newQuestion.save();

    // Başarılı yanıtı döndür ve /admin/save_question yoluna yönlendir
    res.redirect('/admin/dashboard?success=true&message=Soru%20ba%C5%9Far%C4%B1yla%20eklendi.');
  } catch (error) {
    // Hata durumunda hata yanıtını döndür ve /admin/save_question yoluna yönlendir
    res.redirect(`/admin/save_question?success=false&error=${encodeURIComponent(error.message)}`);
  }
};
