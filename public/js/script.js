
async function loadQuestionsForSubject(subject) {
  let currentIndex = 0; // Mevcut soru dizini
  let questions = []; // Soruları tutacak dizi

  const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');
  const difficultyContainer = document.getElementById('difficultyContainer');
  const questionsContainer = document.getElementById('questionsContainer');
  const questionTemplate = document.getElementById('questionTemplate').cloneNode(true);
  const questionDescription = questionTemplate.querySelector('.questionDescription');
  const optionsContainer = questionTemplate.querySelector('.ml-md-3');
  const questionImage = questionTemplate.querySelector('#questionImage');
  const prevQuestionBtn = document.getElementById('prevQuestionBtn');
  const nextQuestionBtn = document.getElementById('nextQuestionBtn');
  const navigationButtons = document.querySelector('.navigation-buttons');



  const finishBtn = document.createElement('button');
  finishBtn.id = 'finishBtn';
  finishBtn.className = 'btn btn-primary';
  finishBtn.textContent = 'Bitir';

  function showFinishButton() {
    const navigationButtons = document.querySelector('.navigation-buttons');
    if (currentIndex === questions.length - 1) {
      nextQuestionBtn.style.display = 'none';
      navigationButtons.appendChild(finishBtn);
    } else {
      nextQuestionBtn.style.display = 'block';
      if (navigationButtons.contains(finishBtn)) {
        navigationButtons.removeChild(finishBtn);
      }
    }


    
  }







  loadQuestionsBtn.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    try {
      const response = await fetch(`/getQuestions?subject=${subject}&difficulty=${difficulty}`);
      const data = await response.json();
      questions = data.questions;
      // random 3 soru seçiyor
      questions = _.shuffle(questions);
      questions = questions.slice(0, 3);

      // Başlangıçta ilk soruyu göster
      currentIndex = 0;
      showQuestion(currentIndex);


      // Zorluk seçme kısmını gizle, soruların listelendiği bölümü göster
      difficultyContainer.style.display = 'none';
      questionsContainer.style.display = 'block';
      navigationButtons.style.display = 'flex';


    } catch (err) {
      console.error('Hata:', err);
    }
  });
  // İleri ve geri butonları
  nextQuestionBtn.addEventListener('click', () => {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      showQuestion(currentIndex);

    }
    showFinishButton();
  });
  prevQuestionBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showQuestion(currentIndex);

    }
    showFinishButton();
  });


  if (currentIndex === questions.length - 1) {
    nextQuestionBtn.disabled = true; // Son soruda
  } else {
    nextQuestionBtn.disabled = false;
  }

  function showQuestion(index) {
    questionsContainer.innerHTML = ''; // Önceki soruyu temizle
    const question = questions[index];
    questionTemplate.style.display = 'block';
    questionDescription.textContent = question.description;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, idx) => {
      const label = document.createElement('label');
      label.className = 'options';
      label.innerHTML = `
        <input type="radio" name="radio" value="${idx}">
        <span class="checkmark"></span>
        <span class="optionText">${option}</span>
      `;
      optionsContainer.appendChild(label);
    });
    //resim

    if (question.resim_yol && question.resim_yol.data) {
      questionImage.src = `data:${question.resim_yol.contentType};base64,${question.resim_yol.data.toString('base64')}`;
    } else {
      questionImage.style.display = 'none';
    }

    questionsContainer.appendChild(questionTemplate);

    showFinishButton();
  }



























  
const resultPopup = document.querySelector('.result-popup');
const closePopupBtn = document.getElementById('closePopupBtn');
const correctCountSpan = document.getElementById('correctCount');
const incorrectCountSpan = document.getElementById('incorrectCount');
const totalScoreSpan = document.getElementById('totalScore');
const correctAnswersList = document.getElementById('correctAnswersList');



// Bitir butonuna tıklanınca sonuçları göster
finishBtn.addEventListener('click', () => {
  showResult();
});

// Popup kapatma işlemi
closePopupBtn.addEventListener('click', () => {
  resultPopup.style.display = 'none';
});

// Sonuçları gösteren fonksiyon
function showResult() {
  let correctCount = 0;
  let incorrectCount = 0;

  // Kullanıcının verdiği cevapları al
  const userAnswers = [];
  const questionElements = document.querySelectorAll('.question');
  questionElements.forEach((questionElement, index) => {
    const selectedOption = questionElement.querySelector('input[name="radio"]:checked');
    if (selectedOption) {
      const selectedAnswer = parseInt(selectedOption.value);
      userAnswers.push(selectedAnswer);
    } else {
      userAnswers.push(-1); // Kullanıcı cevap vermediyse -1 olarak işaretle
    }
  });

  // Doğru ve yanlış cevapları kontrol et
  userAnswers.forEach((selectedAnswer, index) => {
    if (selectedAnswer === questions[index].correctOption) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });
  // Sonuçları popup içerisine yazdır
  correctCountSpan.textContent = correctCount;
  incorrectCountSpan.textContent = incorrectCount;
  totalScoreSpan.textContent = calculateTotalScore(correctCount);
  correctAnswersList.innerHTML = '';
  questions.forEach((question, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. Soru: ${ question.options[question.correctOption]}`;
    correctAnswersList.appendChild(listItem);
  });

  // Popup'ı göster
  resultPopup.style.display = 'block';
  resultPopup.classList.add('show');
}

// Toplam puanı hesaplayan fonksiyon
function calculateTotalScore(correctCount) {
  const maxScore = questions.length * 10; // Her bir soru 10 puan değerinde kabul edelim
  const score = correctCount * 10; // Doğru cevap sayısını puan olarak alalım
  return score;
}




}
