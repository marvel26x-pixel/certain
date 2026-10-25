const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  }
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
if (form) {
const status = document.querySelector('#form-status');
const typeField = form.elements.type;
const businessField = form.querySelector('.business-field');
const businessInput = form.elements.business;
const submitButton = form.querySelector('button[type="submit"]');
const githubPages = window.GITHUB_PAGES === true;

if (githubPages) {
  status.textContent = 'Enquiry delivery is not connected on this static GitHub Pages site yet.';
  status.dataset.state = 'error';
  form.querySelector('.form-submit p').textContent = 'This static GitHub Pages version cannot send enquiries. A separate backend or approved form service must be connected.';
  submitButton.disabled = true;
}

function updateBusinessField() {
  const isTrade = ['Retailer', 'Distributor'].includes(typeField.value);
  businessField.hidden = !isTrade;
  businessInput.required = isTrade;
}

typeField.addEventListener('change', updateBusinessField);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (githubPages) return;
  status.textContent = '';
  status.dataset.state = '';

  const emailInput = form.elements.email;
  const phoneInput = form.elements.phone;
  emailInput.setCustomValidity('');
  phoneInput.setCustomValidity('');
  if (!emailInput.value.trim() && !phoneInput.value.trim()) {
    emailInput.setCustomValidity('Enter an email address or a phone number.');
    emailInput.reportValidity();
    return;
  }
  if (!form.reportValidity()) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Your enquiry could not be sent. Please try again.');
    status.textContent = result.message;
    status.dataset.state = 'success';
    form.reset();
    updateBusinessField();
  } catch (error) {
    status.textContent = error.message || 'A connection problem stopped your enquiry. Please try again.';
    status.dataset.state = 'error';
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send enquiry <span aria-hidden="true">↗</span>';
  }
});
}

document.querySelectorAll('a[href^="/"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    event.preventDefault();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => { window.location.href = destination.href; }, 180);
  });
});

const revealTargets = document.querySelectorAll('.catalogue-hero-art, .catalogue-products, .catalogue-cta');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => {
    target.classList.add('catalogue-reveal');
    revealObserver.observe(target);
  });
}