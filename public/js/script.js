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
