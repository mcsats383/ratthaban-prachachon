const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const contrastToggle = document.querySelector('.contrast-toggle');
const REPORT_BUFFER_KEY = 'ratthaban-report-buffer-v1';
const FEEDBACK_BUFFER_KEY = 'ratthaban-feedback-buffer-v1';

menuToggle?.addEventListener('click', () => {
  const isOpen = nav?.classList.toggle('open') ?? false;
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

contrastToggle?.addEventListener('click', () => {
  const enabled = document.body.classList.toggle('high-contrast');
  contrastToggle.setAttribute('aria-pressed', String(enabled));
  try { localStorage.setItem('ratthaban-high-contrast', String(enabled)); } catch {}
});

try {
  if (localStorage.getItem('ratthaban-high-contrast') === 'true') {
    document.body.classList.add('high-contrast');
    contrastToggle?.setAttribute('aria-pressed', 'true');
  }
} catch {}

function readBuffer(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}
function writeBuffer(key, items) { localStorage.setItem(key, JSON.stringify(items)); }

const feedbackForm = document.querySelector('#feedback-form');
feedbackForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const topic = document.querySelector('#topic')?.value;
  const message = document.querySelector('#form-message');
  if (!topic) return;
  const items = readBuffer(FEEDBACK_BUFFER_KEY);
  items.push({ topic, createdAt: new Date().toISOString() });
  writeBuffer(FEEDBACK_BUFFER_KEY, items);
  if (message) message.textContent = `ขอบคุณสำหรับความคิดเห็นเรื่อง “${topic}” — บันทึกไว้ในเครื่องนี้แล้ว (ข้อมูลสาธิต) `;
  feedbackForm.reset();
});

function updateReportCount() {
  const count = document.querySelector('#buffer-count');
  if (count) count.textContent = readBuffer(REPORT_BUFFER_KEY).length;
}

const reportForm = document.querySelector('#report-form');
reportForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const item = {
    id: crypto.randomUUID ? crypto.randomUUID() : `report-${Date.now()}`,
    type: document.querySelector('#report-topic').value,
    detail: document.querySelector('#report-detail').value.trim(),
    contact: document.querySelector('#report-contact').value.trim(),
    createdAt: new Date().toISOString(),
    status: 'รอส่งต่อ (ต้นแบบ)'
  };
  const buffer = readBuffer(REPORT_BUFFER_KEY);
  buffer.push(item);
  writeBuffer(REPORT_BUFFER_KEY, buffer);
  document.querySelector('#report-message').textContent = `บันทึกแบบร่างแล้ว รหัสอ้างอิง ${item.id} — ยังไม่ได้ส่งให้หน่วยงานใด`;
  reportForm.reset();
  updateReportCount();
});

document.querySelector('#export-reports')?.addEventListener('click', () => {
  const data = readBuffer(REPORT_BUFFER_KEY);
  const status = document.querySelector('#buffer-status');
  if (!data.length) { if (status) status.textContent = 'ยังไม่มีข้อมูลสำหรับส่งออก'; return; }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ratthaban-reports-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  if (status) status.textContent = 'ส่งออกไฟล์แล้ว โปรดจัดเก็บไฟล์อย่างปลอดภัย';
});

document.querySelector('#clear-reports')?.addEventListener('click', () => {
  if (confirm('ต้องการล้างข้อมูลการแจ้งเบาะแสที่เก็บไว้ในเครื่องนี้หรือไม่')) {
    localStorage.removeItem(REPORT_BUFFER_KEY);
    updateReportCount();
    const status = document.querySelector('#buffer-status');
    if (status) status.textContent = 'ล้างข้อมูลในเครื่องแล้ว';
  }
});

// Add consistent legal/help links to the existing footer without duplicating page markup.
const footerBottom = document.querySelector('.footer-bottom');
if (footerBottom && !footerBottom.querySelector('.footer-links')) {
  const links = document.createElement('span');
  links.className = 'footer-links';
  links.innerHTML = '<a href="contact.html">ติดต่อเรา</a> · <a href="privacy.html">ความเป็นส่วนตัว</a> · <a href="terms.html">เงื่อนไขการใช้งาน</a>';
  footerBottom.appendChild(links);
}

updateReportCount();
