const wrapper = document.querySelector('.wrapper');
const wrapper1 = document.querySelector('.wrapper_1');
const wrapper2 = document.querySelector('.wrapper');


const btnPopup = document.querySelector('.btnLogin-popup');
const btn1 = document.querySelector('.btn_1');
const iconClose = document.querySelector('.icon-close');


btnPopup.addEventListener('click', () => {
  wrapper.classList.add('active-popup');
  wrapper1.style.display = 'none';
});

iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

btn1.addEventListener('click', () => {
  window.location.href = "quiz.ejs";
});


// //matematik için script-------------------------------------------------
// let currentIndex = 0; // Mevcut soru dizini
// let mathQuestions = []; // Soruları tutacak dizi

// const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');
// const difficultyContainer = document.getElementById('difficultyContainer');
// const questionsContainer = document.getElementById('questionsContainer');
// loadQuestionsBtn.addEventListener('click', async () => {
//   const difficulty = document.getElementById('difficulty').value;
//   try {
//     const response = await fetch(`/getMathQuestions?difficulty=${difficulty}`);
//     const data = await response.json();
//     mathQuestions = data.mathQuestions;

//     // Başlangıçta ilk soruyu göster
//     currentIndex = 0;
//     showQuestion(currentIndex);
//     // Zorluk seçme kısmını gizle, soruların listelendiği bölümü göster
//     difficultyContainer.style.display = 'none';
//     questionsContainer.style.display = 'block';
//   } catch (err) {
//     console.error('Hata:', err);
//   }
// });
// function showQuestion(index) {
//   const questionsContainer = document.getElementById('questionsContainer');
//   questionsContainer.innerHTML = ''; // Önceki soruyu temizle

//   const question = mathQuestions[index];

//   const questionTemplate = document.getElementById('questionTemplate').cloneNode(true);
//   questionTemplate.style.display = 'block';

//   const questionDescription = questionTemplate.querySelector('.questionDescription');
//   questionDescription.textContent = question.description;

//   const optionsContainer = questionTemplate.querySelector('.ml-md-3');
//   optionsContainer.innerHTML = '';
//   question.options.forEach((option, idx) => {
//     const label = document.createElement('label');
//     label.className = 'options';
//     label.innerHTML = `
// <span class="optionText">${option}</span>
// <input type="radio" name="radio" value="${idx}">
// <span class="checkmark"></span>
// `;
//     optionsContainer.appendChild(label);
//   });

//   const questionImage = questionTemplate.querySelector('#questionImage');
//   // Soruya ait resim varsa, questionImage src'sine resim yolu ekleyin.
//   if (question.resim_yol && question.resim_yol.data) {
//     questionImage.src = `data:${question.resim_yol.contentType};base64,${question.resim_yol.data.toString('base64')}`;
//   } else {
//     // Soruya ait resim yoksa, resim alanını gizleyin.
//     questionImage.style.display = 'none';
//   }

//   questionsContainer.appendChild(questionTemplate);
// }



// function navigateQuestion(direction) {
//   currentIndex += direction;
//   if (currentIndex < 0) {
//     currentIndex = 0;
//   } else if (currentIndex >= mathQuestions.length) {
//     currentIndex = mathQuestions.length - 1;
//   }
//   showQuestion(currentIndex);
// }

  // script.js dosyası
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



  loadQuestionsBtn.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    try {
      const response = await fetch(`/getQuestions?subject=${subject}&difficulty=${difficulty}`);
      const data = await response.json();
      questions = data.questions;

      // Başlangıçta ilk soruyu göster
      currentIndex = 0;
      showQuestion(currentIndex);
      // Zorluk seçme kısmını gizle, soruların listelendiği bölümü göster
      difficultyContainer.style.display = 'none';
      questionsContainer.style.display = 'block';
    } catch (err) {
      console.error('Hata:', err);
    }
  });


  
}


function navigateQuestion(direction) {
  let questions = [];
  let currentIndex = 0;
  currentIndex += direction;
  if (currentIndex < 0) {
    currentIndex = 0;
  } else if (currentIndex >= questions.length) {
    currentIndex = questions.length - 1;
  }
  showQuestion(currentIndex);
}















  

  


