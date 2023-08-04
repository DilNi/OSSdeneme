function toggleNav() {
  const sideNav = document.getElementById("mySidenav");
  if (sideNav.style.width === "250px") {
      sideNav.style.width = "0";
  } else {
      sideNav.style.width = "250px";
  }
}








async function loadQuestionsForSubject(subject) {
  let currentIndex = 0; // Mevcut soru dizini
  let questions = []; // Soruları tutacak dizi
  let userAnswers = []; //kullanıcı cevaplarını tutacak dizi

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
  const answersContainer = document.querySelector('.answers');
  const timerContainer = document.querySelector('.timer');



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

  let scoreCalculated = false; 

  function checkAnswers() {
    if(!scoreCalculated) {
    let correctCount = 0;
    let incorrectCount = 0;
    let blankCount = 0;

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const correctOptionIndex = question.correctOption; // Assuming correctOption is the index of the correct answer in options array
      const userAnswerIndex = userAnswers[i];
      if (userAnswerIndex === undefined) {
        blankCount++;
      } else if (userAnswerIndex === correctOptionIndex) {
        correctCount++;
        
      } else {
        incorrectCount++;
        
      }
    }
  
const scoreTable = document.getElementById('scoreTable');
  const tbody = scoreTable.getElementsByTagName('tbody')[0];
  tbody.innerHTML = ''; // Clear the table body

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const correctOptionIndex = question.correctOption;
    const userAnswerIndex = userAnswers[i];
    const row = document.createElement('tr');

    const cellQuestion = document.createElement('td');
    cellQuestion.textContent = `Soru ${i + 1}`;
    row.appendChild(cellQuestion);

    const cellStatus = document.createElement('td');
    if (userAnswerIndex === undefined) {
      cellStatus.textContent = 'Cevaplanmadı';
    } else if (userAnswerIndex === correctOptionIndex) {
      cellStatus.textContent = 'Doğru';
    } else {
      cellStatus.textContent = 'Yanlış';
    }
    row.appendChild(cellStatus);

    const cellCorrectAnswer = document.createElement('td');
    cellCorrectAnswer.textContent = question.options[correctOptionIndex];
    row.appendChild(cellCorrectAnswer);

    tbody.appendChild(row);
  }

  scoreCalculated = true;
  }

  
    const popup = document.getElementById('popup');
    popup.style.display = 'block';
  
    // Reset the userAnswers array
    userAnswers = [];
  }

  function handleAnswerSelection() {
    const selectedOption = document.querySelector('input[name="radio"]:checked');
    if (selectedOption) {
      const selectedValue = parseInt(selectedOption.value);
      userAnswers[currentIndex] = selectedValue;
    }
    updateAnswerBoxes();
  }






  loadQuestionsBtn.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    try {
      const response = await fetch(`/getQuestions?subject=${subject}&difficulty=${difficulty}`);
      const data = await response.json();
      questions = data.questions;

      
    if (questions.length === 0) {
      console.error('Kayıtlı soru yok.');
      return;
    }
      // random 10 soru seçiyor
      questions = _.shuffle(questions);
      questions = questions.slice(0, 10);

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
    finishBtn.addEventListener('click', checkAnswers);
  });
  const popupCloseBtn = document.querySelector('.close');
  popupCloseBtn.addEventListener('click', () => {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
  });
  
  // Close the popup when the user clicks outside the popup content
  window.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    if (event.target === popup) {
      popup.style.display = 'none';
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
    answersContainer.style.display = 'flex';
    timerContainer.style.display = 'flex';
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
      questionImage.setAttribute('src', `data:${question.resim_yol.contentType};base64,${question.resim_yol.data.toString('base64')}`);
    } else {
      questionImage.style.display = 'none';
    }

    questionsContainer.appendChild(questionTemplate);
    const radioOptions = document.querySelectorAll('input[name="radio"]');
    radioOptions.forEach((radio) => {
      radio.addEventListener('change', handleAnswerSelection);
    });

    // Eğer kullanıcı daha önce bu soruyu cevapladıysa, işaretli radyo düğmesini yeniden işaretle
  const userAnswerIndex = userAnswers[index];
  if (userAnswerIndex !== undefined) {
    const radioOptions = document.querySelectorAll('input[name="radio"]');
    radioOptions[userAnswerIndex].checked = true;
  }


    showFinishButton();
    

    
  }

  function updateAnswerBoxes() {
    const answerBoxes = document.querySelectorAll('.answer-box');
  
    answerBoxes.forEach((box, index) => {
      const userAnswerIndex = userAnswers[index];
      const question = questions[index];
  
      if (userAnswerIndex === undefined) {
        // Kullanıcı bu soruyu cevaplamamış, boş bırakın
        box.textContent = `${index + 1}`;
        box.style.backgroundColor = 'white';
        
      } else {
        box.textContent = `${index + 1}`;
        box.style.backgroundColor = 'gray';
      }

    
    });


  }

  
function goToQuestion(currentIndex) {

  showQuestion(currentIndex);
}

  function createAnswerBoxes(questionCount) {
    const answersContainer = document.querySelector('.answers');
    
  
    // Soru sayısı kadar kutucuk oluştur
    for (let i = 0; i < questionCount; i++) {
        const answerBox = document.createElement('div');
        answerBox.classList.add('answer-box');
        answerBox.style.backgroundColor = 'gray';
        answerBox.addEventListener('click', () => {
          goToQuestion(i);
        });
        answersContainer.appendChild(answerBox);


    }
}

document.addEventListener('DOMContentLoaded', () => {
  
    createAnswerBoxes(10); 
    updateAnswerBoxes();
    const clearSelectionBtn = document.getElementById('clearSelectionBtn');

    // Temizleme düğmesine tıklandığında yapılacak işlemleri tanımlayın
    clearSelectionBtn.addEventListener('click', () => {
      const selectedOption = document.querySelector('input[name="radio"]:checked');

      if (selectedOption) {
        selectedOption.checked = false;
    
      
        // Kullanıcının cevabını sil
        userAnswers[currentIndex] = undefined;
        
        updateAnswerBoxes();
        

      }
      
    });

  
});



// SORULAR ARASINDA GEÇİŞ EKLE YANİ KUTUCUKLARA BASINCA SORULARA GEÇEBİLSİN , SORULARIN TEMIZLENMESINDE SORUN VAR!!!!!!!!!!!!!!!!!!!






























}
