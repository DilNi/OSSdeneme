// Gerekli modüllerin yüklenmesi
const path = require("path");
const rootDir = require("./util/path");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

// Express uygulamasının oluşturulması
const app = express();

// EJS şablon motorunu kullanmak için yapılandırma
app.set('view engine', 'ejs');

// body-parser'ın yapılandırılması
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));

// express-session'ın yapılandırılması
app.use(session({
  secret: 'gizli_anahtar',
  resave: true,
  saveUninitialized: true
}));

// connect-flash'ın yapılandırılması
app.use(flash());

// MongoDB bağlantısı
mongoose.connect('mongodb+srv://Yagmur:saydam14@cluster0.3qhe1pz.mongodb.net/<quiz>', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB bağlantısı başarılı!');
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
  });

const User = require('./models/Users');

// Ana sayfa
app.get('/', (req, res) => {
  res.render('index', { message: req.flash('message') });
});

// Kayıt sayfası
app.get('/register', (req, res) => {
  res.render('register', { message: req.flash('message') });
});

// Kayıt işlemi
app.post('/register', (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email,
    password
  });

  newUser.save()
    .then(() => {
      req.flash('message', 'Kayıt başarıyla tamamlandı. Giriş yapabilirsiniz.');
      res.redirect('/login');
    })
    .catch(err => {
      console.error('Kayıt hatası:', err);
      req.flash('message', 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/register');
    });
});

// Giriş sayfası
app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('message') });
});

// Giriş işlemi
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@example.com' && password === 'admin123') {
    req.session.adminLoggedIn = true;
    return res.redirect('/admin/dashboard'); // Admin paneline yönlendirme
  }

  User.findOne({ email, password })
    .then(user => {
      if (user) {
        req.session.user = user;
        return res.redirect('/quiz'); // Kullanıcı girişi başarılı ise quiz sayfasına yönlendirme
      } else {
        req.flash('message', 'Geçersiz kullanıcı adı veya şifre.'); // Hatalı giriş durumunda hata mesajı ekleme
        return res.redirect('/login');
      }
    })
    .catch(err => {
      console.error('Giriş hatası:', err);
      req.flash('message', 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/login');
    });
});

// Çıkış işlemi
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

const quizRouter = require('./routes/user');
app.use('/quiz', quizRouter);
app.use('/user', quizRouter);

// Admin dashboard sayfası
app.get('/admin/dashboard', (req, res) => {
  if (req.session.adminLoggedIn) {
    res.render('admin/dashboard', { message: req.flash('message') });
  } else {
    res.redirect('/login');
  }
});

const questionController = require('./controllers/questionController');

// Soru ekleme isteğine yönelik yönlendirme
app.post('/admin/save-question', questionController.addQuestion, () => {
  res.render('index', { message: req.flash('message') });

});


// Diğer yönlendirmeler ve middleware'ler

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


