const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const contrastToggle = document.querySelector('.contrast-toggle');

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

contrastToggle?.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(enabled));
});

document.querySelector('#feedback-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const topic = document.querySelector('#topic').value;
  const message = document.querySelector('#form-message');
  if (topic) {
    message.textContent = `ขอบคุณสำหรับความสนใจในหัวข้อ “${topic}” — แบบฟอร์มนี้เป็นส่วนหนึ่งของต้นแบบเว็บไซต์`;
    event.target.reset();
  }
});
