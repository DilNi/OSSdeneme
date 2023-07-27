const wrapper = document.querySelector('.wrapper');
const wrapper1 = document.querySelector('.wrapper_1');
const wrapper2 = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const btn1 = document.querySelector('.btn_1');
const iconClose = document.querySelector('.icon-close');

registerLink.addEventListener('click', () => {
  wrapper.classList.add('active');
});

loginLink.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

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


//matematik için script-------------------------------------------------
let currentIndex = 0; // Mevcut soru dizini
let mathQuestions = []; // Soruları tutacak dizi

const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');
const difficultyContainer = document.getElementById('difficultyContainer');
const questionsContainer = document.getElementById('questionsContainer');
loadQuestionsBtn.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    try {
        const response = await fetch(`/getMathQuestions?difficulty=${difficulty}`);
        const data = await response.json();
        mathQuestions = data.mathQuestions;

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
function showQuestion(index) {
    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = ''; // Önceki soruyu temizle

    const question = mathQuestions[index];

    const questionTemplate = document.getElementById('questionTemplate').cloneNode(true);
    questionTemplate.style.display = 'block';

    const questionDescription = questionTemplate.querySelector('.questionDescription');
    questionDescription.textContent = question.description;

    const optionsContainer = questionTemplate.querySelector('.ml-md-3');
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

    const questionImage = questionTemplate.querySelector('#questionImage');
    // Soruya ait resim varsa, questionImage src'sine resim yolu ekleyin.
    if (question.resim_yol && question.resim_yol.data) {
        questionImage.src = `data:${question.resim_yol.contentType};base64,${question.resim_yol.data.toString('base64')}`;
    } else {
        // Soruya ait resim yoksa, resim alanını gizleyin.
        questionImage.style.display = 'none';
    }

    questionsContainer.appendChild(questionTemplate);
}



function navigateQuestion(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = 0;
    } else if (currentIndex >= mathQuestions.length) {
        currentIndex = mathQuestions.length - 1;
    }
    showQuestion(currentIndex);
}

//**------------------------------------------------------------------------- */


//türkçe için script *--------------------------------------------------------------