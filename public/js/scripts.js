document.addEventListener("DOMContentLoaded", function () {
  updateNavbar();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');

  if (isLoggedIn && window.location.pathname.endsWith('login-reg.html')) {
    window.location.href = '/user_account.html';
  }

  document.getElementById('login-button')?.addEventListener('click', handleLogin);
  document.getElementById('register-button')?.addEventListener('click', handleRegister);
  document.getElementById('logout-button')?.addEventListener('click', handleLogout);
});

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Invalid username or password') {
        alert(data.message);
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", data.user.username); 
        updateNavbar();
        window.location.href = '/user_account.html';
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      alert('An error occurred. Please try again later.');
    });
}


function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;

  if (!isValidEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (name && email && username && password) {
    fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message === 'Registration successful') {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", data.user.username); 
          updateNavbar();
          window.location.href = '/user_account.html';
        } else {
          alert('Registration failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
      });
  } else {
    alert('Please fill out all fields');
  }
}

function handleLogout(event) {
  event.preventDefault();

  fetch('/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        clearLoginState();
        window.location.href = '/login-reg.html';
      } else {
        alert('Logout failed: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
      alert('An error occurred. Please try again later.');
    });
}

function saveLoginState(username) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', username);
  updateNavbar();
}

function clearLoginState() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  updateNavbar();
}

function updateNavbar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  document.getElementById('login-text')?.classList.toggle('hidden', isLoggedIn);
  document.getElementById('user-icon')?.classList.toggle('hidden', !isLoggedIn);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
