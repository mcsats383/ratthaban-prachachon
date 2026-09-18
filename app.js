const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.primary-nav');
const contrastToggle = document.querySelector('.contrast-toggle');
const REPORT_BUFFER_KEY = 'ratthaban-report-buffer-v1';

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

function readReportBuffer() {
  try { return JSON.parse(localStorage.getItem(REPORT_BUFFER_KEY) || '[]'); }
  catch { return []; }
}
function writeReportBuffer(items) { localStorage.setItem(REPORT_BUFFER_KEY, JSON.stringify(items)); }
function updateBufferCount() {
  const count = document.querySelector('#buffer-count');
  if (count) count.textContent = readReportBuffer().length;
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
  const buffer = readReportBuffer();
  buffer.push(item);
  writeReportBuffer(buffer);
  document.querySelector('#report-message').textContent = `บันทึกแบบร่างแล้ว รหัสอ้างอิง ${item.id} — ยังไม่ได้ส่งให้หน่วยงานจริง`;
  reportForm.reset();
  updateBufferCount();
});

document.querySelector('#export-reports')?.addEventListener('click', () => {
  const data = readReportBuffer();
  const status = document.querySelector('#buffer-status');
  if (!data.length) {
    status.textContent = 'ยังไม่มีข้อมูลสำหรับส่งออก';
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `ratthaban-reports-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
  status.textContent = 'ส่งออกไฟล์แล้ว โปรดจัดเก็บไฟล์อย่างปลอดภัย';
});

document.querySelector('#clear-reports')?.addEventListener('click', () => {
  if (confirm('ต้องการล้างข้อมูลการแจ้งเบาะแสที่เก็บไว้ในเครื่องนี้หรือไม่')) {
    localStorage.removeItem(REPORT_BUFFER_KEY);
    updateBufferCount();
    document.querySelector('#buffer-status').textContent = 'ล้างข้อมูลในเครื่องแล้ว';
  }
});

updateBufferCount();
