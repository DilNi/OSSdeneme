// Gerekli modüllerin yüklenmesi
const path = require("path");
const rootDir = require("./util/path");
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const fs = require('fs');
const TestScore = require('./models/testScore'); 

// Express uygulamasının oluşturulması
const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');

// Multer ayarları -> resim_yol için
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, 'image-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });


// EJS şablon motorunu kullanmak için yapılandırma
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// body-parser'ın yapılandırılması
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));
app.use(express.static(path.join(rootDir, "views")));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb', extended: true}));
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
app.post('/dashboard', upload.single('resim_yol'),(req, res) => {
  if (!req.session.adminLoggedIn) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const { subject, difficulty,  description, options, correctOption } = req.body;
  const resim_yol = req.file ? '/uploads/' + req.file.filename : ''; 
  let resim_yol_data = null;
  let contentType = null; 
  if (req.file) {
    resim_yol_data = fs.readFileSync(req.file.path);
    contentType = req.file.mimetype;
  }
  const newQuestion = new Question({
    subject,
    difficulty,
    resim_yol: {
      data: resim_yol_data,
      contentType: contentType
    },
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
  if (!req.session.adminLoggedIn) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const questionId = req.params.id;

  Question.findOneAndDelete({ _id: questionId, user: req.session.adminLoggedIn._id })
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
  if (!req.session.adminLoggedIn) {
    req.flash('message', 'Önce giriş yapmalısınız.');
    res.redirect('/login');
    return;
  }

  const questionId = req.params.id;
  const { subject, difficulty,resim_yol, description, options, correctOption } = req.body;

  Question.findOneAndUpdate(
    { _id: questionId, user: req.session.adminLoggedIn._id },
    { subject, difficulty,resim_yol, description,options,correctOption },
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
//********************************************************************************************************************* */

// Define route handlers
app.get('/user/math', (req, res) => {

  res.render('user/math');
});

app.get('/user/tur', (req, res) => {

  res.render('user/tur');
});

app.get('/user/chem', (req, res) => {
  res.render('user/chem');
});

app.get('/getQuestions', async (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    const questions = await Question.find({ subject, difficulty });

    // Resim verilerini Base64 formatında JSON'a çeviriyoruz
    const questionsWithImages = questions.map((question) => {
      if (question.resim_yol && question.resim_yol.data) {
        const base64Data = question.resim_yol.data.toString('base64');
        const resim_yol = {
          contentType: question.resim_yol.contentType,
          data: base64Data,
        };
        return { ...question.toObject(), resim_yol };
      } else {
        return question.toObject();
      }
    });

    res.json({ questions: questionsWithImages });
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ message: 'Bir hata oluştu' });
  }
});

// Oturum bilgilerini almak için fonksiyonlar
function getUserEmailFromSession(req) {
  if (req.session.user) {
    return req.session.user.email;
  }
  return null;
}

function getUserIdFromSession(req) {
  if (req.session.user) {
    return req.session.user._id;
  }
  return null;
}



// app.js

// Kullanıcının quiz sonuçlarını kaydetmek için POST endpoint'i
app.post('/saveQuizScore', async (req, res) => {
  const { correctCount, incorrectCount, blankCount, score, subject,  tarih} = req.body;
  const userEmail = getUserEmailFromSession(req); // Oturumdan e-posta alınır
  const userId = getUserIdFromSession(req); // Oturumdan kullanıcı ID'si alınır
  if (!userEmail || !userId) {
    return res.status(401).send('Yetkisiz kullanıcı');
  }

  try {
    const testScore = new TestScore({
      user: userId,
      subject: subject,
      total: correctCount + incorrectCount + blankCount,
      correctCount,
      incorrectCount,
      blankCount,
      score,
      completionDate: new Date(tarih),
    });

    await testScore.save();
    res.status(201).send('Quiz skoru başarıyla kaydedildi.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Veritabanına kaydedilemedi.');
  }
});






//*************************************************** */
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
