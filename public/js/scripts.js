document.addEventListener("DOMContentLoaded", function () {
  // Update the navbar based on login state
  updateNavbar();

  // Check login status on page load
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');

  // Update the UI based on login status
  if (isLoggedIn) {
    showProfilePage(username);
  } else {
    showLoginPage();
  }

  // Handle login button click
  document.getElementById('login-button')?.addEventListener('click', function (event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Invalid username or password') {
            alert(data.message); 
        } else {
            handleLogin(username);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    });
});

  // Handle register button click
  document.getElementById('register-button')?.addEventListener('click', function (event) {
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === 'Registration successful') { 
            handleLogin(username);
          } else {
            alert('Registration failed: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Error during registration:', error);
          alert('An error occurred. Please try again later.');
        });
    } else {
      alert('Please fill out all fields');
    }
  });

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Handle logout button click
  document.getElementById('logout-button')?.addEventListener('click', function () {
    handleLogout();
  });
});

// Function to handle login
function handleLogin(username) {
  // Save login state in localStorage
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('username', username);

  // Update the UI
  updateNavbar();
  showProfilePage(username);
}

// Function to handle logout
function handleLogout() {
  // Clear login state from localStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');

  // Update the UI
  updateNavbar();
  showLoginPage();
}

// Function to show the profile page
function showProfilePage(username) {
  // Hide the login/register section and show the profile section
  document.getElementById('login-register-section').classList.add('hidden');
  document.getElementById('profile-section').classList.remove('hidden');

  // Update the profile information
  document.getElementById('profile-username').textContent = username;
  document.getElementById('profile-email').textContent = "user@example.com";

  // Change the navbar to show the user icon and "Profile" link
  document.getElementById('login-text').textContent = 'Profile';
  document.getElementById('user-icon').classList.remove('hidden');
}

// Function to show the login page
function showLoginPage() {
  // Hide the profile section and show the login/register section
  document.getElementById('profile-section').classList.add('hidden');
  document.getElementById('login-register-section').classList.remove('hidden');

  // Reset the navbar to show "Login" again and hide the user icon
  document.getElementById('login-text').textContent = 'Login';
  document.getElementById('user-icon').classList.add('hidden');
}

// Function to update the navbar based on login status
function updateNavbar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');

  if (isLoggedIn) {
    // Only show the user icon and hide the "Profile" text
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('user-icon').classList.remove('hidden');
  } else {
    // Show "Login" text and hide the user icon
    document.getElementById('login-text').textContent = 'Login';
    document.getElementById('login-text').classList.remove('hidden');
    document.getElementById('user-icon').classList.add('hidden');
  }
}

