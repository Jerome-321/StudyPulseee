const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
const registerForm = container.querySelector('.sign-up form');
const loginForm = container.querySelector('.sign-in form');

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  alert('Registered! Please login.');
  container.classList.add('signup-hidden');
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  alert('Logged in! Redirecting...');
  window.location.href = 'dashboard.html';
});
registerBtn.addEventListener('click', () => {
  container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
  container.classList.remove("active");
});

// ✅ Only ONE submit handler for registerForm
registerForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get form values
  const firstName = registerForm.querySelector('input[name="first_name"]').value;
  const lastName = registerForm.querySelector('input[name="last_name"]').value;
  const email = registerForm.querySelector('input[name="email"]').value;

  // Save to localStorage
  localStorage.setItem('user_firstname', firstName);
  localStorage.setItem('user_lastname', lastName);
  localStorage.setItem('user_email', email);

  alert('Registered! Please login.');
  container.classList.add('signup-hidden');
});

// Login redirect
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  alert('Logged in! Redirecting...');
  window.location.href = 'dashboard.html';
});

