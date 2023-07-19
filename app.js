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
const Question = require('./models/Question');

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
    Question.find({})
      .then(questions => {
        res.render('admin/dashboard', { questions, message: req.flash('message') });
      })
      .catch(err => {
        console.error('Soru çekme hatası:', err);
        req.flash('message', 'Soruları çekerken bir hata oluştu. Lütfen tekrar deneyin.');
        res.redirect('/admin/dashboard');
      });
  } else {
    req.flash('message', 'Önce giriş yapmalısınız.'); // Giriş yapmadan erişim engelleme
    res.redirect('/login');
  }
});


const questionController = require('./controllers/questionController');


// Soru ekleme isteğine yönelik yönlendirme
app.post('/admin/dashboard', questionController.addQuestion);


//------------------------------------------------------------------------------------------------------------------------------
app.get('/dashboard', (req, res) => {
  if (!req.session.adminLoggedIn) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  Question.find({ user: req.session.adminLoggedIn._id })
    .then(questions => {
      res.render('admin/dashboard', { user: req.session.adminLoggedIn, questions, message: req.flash('message') });
    })
    .catch(err => {
      console.error('Soru çekme hatası:', err);
      req.flash('message', 'Soruları çekerken bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/dashboard');
    });
});


// Soru ekleme işlemi
app.post('/dashboard', (req, res) => {
  if (!req.session.adminLoggedIn) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const { subject, difficulty, description, options, correctOption } = req.body;

  const newQuestion = new Question({
    subject,
    difficulty,
    description,
    options,
    correctOption,
    user: req.session.adminLoggedIn._id
  });

  newQuestion.save()
    .then(() => {
      req.flash('message', 'Soru başarıyla eklendi.');
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error('Soru ekleme hatası:', err);
      req.flash('message', 'Soru eklerken bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/dashboard');
    });
});

// Soru silme işlemi
app.post('/dashboard/delete/:id', (req, res) => {
  if (!req.session.user) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const questionId = req.params.id;

  Question.findOneAndDelete({ _id: questionId, user: req.session.user._id })
    .then(() => {
      req.flash('message', 'Soru başarıyla silindi.');
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error('Soru silme hatası:', err);
      req.flash('message', 'Soru silerken bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/dashboard');
    });
});

// Soru güncelleme işlemi
app.post('/dashboard/update/:id', (req, res) => {
  if (!req.session.user) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const questionId = req.params.id;
  const { subject, difficulty, description, options, correctOption } = req.body;

  Question.findOneAndUpdate(
    { _id: questionId, user: req.session.user._id },
    { subject, difficulty, description,options,correctOption },
    { new: true }
  )
    .then(question => {
      if (!question) {
        req.flash('message', 'Soru bulunamadı veya güncelleme yetkiniz yok.');
        res.redirect('/dashboard');
        return;
      }

      req.flash('message', 'Soru başarıyla güncellendi.');
      res.redirect('/dashboard');
    })
    .catch(err => {
      console.error('Soru güncelleme hatası:', err);
      req.flash('message', 'Soru güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      res.redirect('/dashboard');
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
