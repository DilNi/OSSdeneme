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


//*********************************************************************************************** */
// // quiz.js
// document.addEventListener('DOMContentLoaded', function () {
//   const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');

//   function fetchMathQuestions(difficulty) {
//     fetch(`/api/questions/math?difficulty=${difficulty}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Sunucudan geçersiz yanıt alındı.');
//         }
//         // JSON verisini döndürün
//         return response.json();
//       })
//       .then((data) => {
//         // Sadece matematik sorularını güncelleyin
//         updateTabContent('math', data);
//       })
//       .catch((error) => {
//         console.error('Hata oluştu:', error);
//       });
//   }

//   loadQuestionsBtn.addEventListener('click', function () {
//     const selectedDifficulty = document.getElementById('difficulty').value;
//     fetchMathQuestions(selectedDifficulty);
//   });

//   function updateTabContent(subject, questions) {
//     const tabContent = document.getElementById(subject);
//     tabContent.innerHTML = '';

//     if (questions && questions.length > 0) {
//       questions.forEach((question) => {
//         // Soruların listesi oluşturulacak
//         const questionElement = document.createElement('div');
//         // Soru içeriğini, seçenekleri ve diğer detayları burada oluşturun
//         questionElement.innerHTML = `
//           <div class="question ml-sm-5 pl-sm-5 pt-2">
//             <div class="py-2 h5"><b>Q. ${question.description}</b></div>
//             <div class="ml-md-3 ml-sm-3 pl-md-5 pt-sm-0 pt-3" id="options">
//               ${question.options.map((option, index) => `
//                 <label class="options">
//                   ${option}
//                   <input type="radio" name="radio" value="${index + 1}">
//                   <span class="checkmark"></span>
//                 </label>
//               `).join('')}
//             </div>
//           </div>
//         `;
//         tabContent.appendChild(questionElement);
//       });
//     } else {
//       const notLoadedMessage = document.createElement('p');
//       notLoadedMessage.textContent = 'Sorular henüz yüklenmedi.';
//       tabContent.appendChild(notLoadedMessage);
//     }
//   }
// });





const loadQuestionsBtn = document.getElementById('loadQuestionsBtn');
loadQuestionsBtn.addEventListener('click', async () => {
    const difficulty = document.getElementById('difficulty').value;
    try {
        const response = await fetch(`/getMathQuestions?difficulty=${difficulty}`);
        const data = await response.json();
        const mathQuestions = data.mathQuestions;

        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = ''; // Önceki soruları temizle

        mathQuestions.forEach(question => {
            // Soruları burada listeleme işlemi yapabilirsiniz
            const questionDiv = document.createElement('div');
            questionDiv.textContent = question.description;
            questionsContainer.appendChild(questionDiv);
        });
    } catch (err) {
        console.error('Hata:', err);
    }
});

<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.0/js/bootstrap.bundle.min.js"></script>
