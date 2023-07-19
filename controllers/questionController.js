exports.addQuestion = async (req, res) => {
  try {
    const { subject, difficulty, description, options, correctOption } = req.body;

    // Soru verilerini kullanarak yeni bir Question nesnesi oluştur
    const newQuestion = new Question({
      subject,
      difficulty,
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
