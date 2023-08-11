const User = require('../models/Users');
const TestScore = require('../models/testScore');

// Kullanıcı kaydı formunu göster
exports.showRegisterForm = (req, res) => {
  res.render('register');
};

// Kullanıcı kaydını işle
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // E-posta adresiyle zaten kayıtlı bir kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      req.flash('message', 'Bu e-posta adresi zaten kullanılıyor. Lütfen farklı bir e-posta deneyin.');
      return res.redirect('/register');
    }

    const newUser = new User({ email, password });

    await newUser.save();

    req.flash('message', 'Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz.');
    res.redirect('/login');
  } catch (error) {
    console.error('Kayıt hatası:', error);
    req.flash('message', 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    res.redirect('/register');
  }
};
exports.showQuizPage = async (req, res) => {
  try {
    const userId = req.session.user._id; // Oturumdan kullanıcı kimliğini al

    if (!userId) {
      req.flash('message', 'Önce giriş yapmalısınız.');
      return res.redirect('/login'); // Oturum açılmamışsa giriş sayfasına yönlendir
    }

    const testScores = await TestScore.find({ user: userId });

    res.render('quiz', { testScores, message: req.flash('message') });
  } catch (error) {
    console.error(error);
    req.flash('message', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.redirect('/login'); // Hata durumunda giriş sayfasına yönlendir
  }
};
