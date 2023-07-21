exports.addQuestion = async (req, res) => {
  try { 
    const { subject, difficulty, resim_yol, description, options, correctOption } = req.body;

    // Soru verilerini kullanarak yeni bir Question nesnesi oluştur
    const newQuestion = new Question({
      subject,
      difficulty,
      resim_yol,
      description,
      options,
      correctOption,
    });

    // Yeni soruyu veritabanına kaydet
    await newQuestion.save();

    // Başarılı yanıtı döndür ve /admin/dashboard yoluna yönlendir
    req.flash('message', 'Soru başarıyla eklendi.');
    res.redirect('/admin/dashboard');
  } catch (error) {
    // Hata durumunda hata yanıtını döndür ve /admin/dashboard yoluna yönlendir
    req.flash('message', 'Soru eklerken bir hata oluştu. Lütfen tekrar deneyin.');
    res.redirect('/admin/dashboard');
  }
};
// Soruyu sil
exports.deleteQuestion = (req, res) => {
  const questionId = req.params.id;

  Ouestion.findOneAndDelete({ _id: questionId, user: req.session.adminLoggedIn })
    .then(() => {
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Sunucu hatası');
    });
};
