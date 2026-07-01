/* CV Gratuit Pro — interactions modernes */

const fields = {
  fullname: 'previewName',
  jobtitle: 'previewJob',
  email: 'previewEmail',
  phone: 'previewPhone',
  address: 'previewAddress',
  website: 'previewWebsite',
  summary: 'previewSummary',
  skills: 'previewSkills',
  education: 'previewEducation',
  eduDate: 'previewEduDate',
  expRole: 'previewExpRole',
  expCompany: 'previewExpCompany',
  expDate: 'previewExpDate',
  expLocation: 'previewExpLocation',
  expDescription: 'previewExpDescription'
};

const defaults = {};

function $(id) {
  return document.getElementById(id);
}

function updatePreview(inputId) {
  const input = $(inputId);
  const preview = $(fields[inputId]);
  if (!input || !preview) return;
  const value = input.value.trim();
  preview.textContent = value || '—';
}

function saveData() {
  const data = {};
  Object.keys(fields).forEach((id) => {
    const input = $(id);
    if (input) data[id] = input.value;
  });
  localStorage.setItem('cv-gratuit-pro-data', JSON.stringify(data));
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem('cv-gratuit-pro-data') || '{}');
    Object.keys(fields).forEach((id) => {
      const input = $(id);
      if (!input) return;
      defaults[id] = input.value;
      if (saved[id]) input.value = saved[id];
      updatePreview(id);
    });
  } catch (error) {
    console.warn('Données locales non chargées', error);
  }
}

function resetData() {
  Object.keys(fields).forEach((id) => {
    const input = $(id);
    if (!input) return;
    input.value = defaults[id] || '';
    updatePreview(id);
  });
  localStorage.removeItem('cv-gratuit-pro-data');
}

function setupGenerator() {
  Object.keys(fields).forEach((id) => {
    const input = $(id);
    if (!input) return;
    input.addEventListener('input', () => {
      updatePreview(id);
      saveData();
    });
  });

  const printBtn = $('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      document.body.classList.add('printing-cv');
      setTimeout(() => window.print(), 120);
      setTimeout(() => document.body.classList.remove('printing-cv'), 800);
    });
  }

  const resetBtn = $('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetData);
}

function setupNavigation() {
  const hamburger = $('hamburger-toggle');
  const nav = $('nav-links');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
      if (nav) nav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

function setupScrollSpy() {
  const sections = [...document.querySelectorAll('main section[id]')];
  const links = [...document.querySelectorAll('.nav-link')];
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      links.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

function setupReveal() {
  const items = document.querySelectorAll('.advantage-card, .template-card, .conseil-card, .faq-item, .form-panel, .preview-panel, .stat');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(18px)';
    item.style.transition = `opacity .55s ease ${index * 35}ms, transform .55s ease ${index * 35}ms`;
    observer.observe(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupGenerator();
  setupNavigation();
  setupScrollSpy();
  setupReveal();
});
