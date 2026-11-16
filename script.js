/* Feature 1: accessible mobile navigation. */
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  toggle.querySelector('span').textContent = '+';
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
  toggle.querySelector('span').textContent = open ? '−' : '+';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

/* Feature 2: validate the contact form before a normal HTTPS POST.
   FormSubmit handles spam checks and email forwarding. The recipient must
   activate the form through the confirmation email after the first submission.
   No Gmail password or API key belongs in this public JavaScript file. */
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const sendButton = form.querySelector('button[type="submit"]');
const fields = ['name', 'email', 'message'].map(id => document.getElementById(id));
// Native validation remains available when JavaScript is disabled.
form.noValidate = true;

function validate(field) {
  const value = field.value.trim();
  let error = '';
  if (!value) error = `Please enter ${field.id === 'name' ? 'your name' : field.id === 'email' ? 'your email address' : 'a message'}.`;
  else if (field.id === 'email' && !field.validity.valid) error = 'Please enter a valid email address.';
  else if (field.id === 'message' && value.length < 10) error = 'Please enter at least 10 characters.';
  document.getElementById(`${field.id}-error`).textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
  return !error;
}
fields.forEach(field => field.addEventListener('input', () => {
  status.textContent = '';
  if (field.hasAttribute('aria-invalid')) validate(field);
}));
form.addEventListener('submit', event => {
  status.textContent = '';
  fields.forEach(field => { field.value = field.value.trim(); });
  const results = fields.map(validate);
  if (results.includes(false)) {
    event.preventDefault();
    fields[results.indexOf(false)].focus();
    return;
  }
  if (window.location.protocol === 'file:') {
    event.preventDefault();
    status.textContent = 'Please open this website through a local web server or the hosted link to send a message. You can also use the email or LinkedIn links.';
    return;
  }
  sendButton.disabled = true;
  status.textContent = 'Opening FormSubmit to complete your submission…';
  // Allow the browser to submit the form. Delivery is not confirmed here;
  // the provider displays the activation, spam-check or result page.
});
window.addEventListener('pageshow', () => {
  sendButton.disabled = false;
  status.textContent = '';
});

document.getElementById('year').textContent = new Date().getFullYear();
