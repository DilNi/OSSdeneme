
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
  });
  prevQuestionBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      showQuestion(currentIndex);

    }
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
  <span class="optionText">${option}</span>
  <input type="radio" name="radio" value="${idx}">
  <span class="checkmark"></span>
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

  }

}


