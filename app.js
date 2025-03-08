const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

// Import the merged auth file
const { authController } = require('./controllers/auth');
app.use(express.json());

app.use(
  session({
    secret: 'secretkey', 
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to false if you're not using HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // Session duration
    },
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const homeController = require('./controllers/homeController');
app.get('/', homeController.getHomePage);
app.get('/about', homeController.getAboutPage);
app.get('/contact', homeController.getContactPage);
app.get('/products', homeController.getProductsPage);
app.get('/login-reg', homeController.getLoginPage);

// Authentication routes
app.post('/register', authController.registerUser);
app.post('/login', authController.login);
app.post('/logout', authController.logout);

// Profile route (protected)
app.get('/profile', (req, res) => {
  if (req.session.userId) {
    res.json({ user: { id: req.session.userId, username: req.session.username } });
  } else {
    res.redirect('/login-reg'); // Redirect to login form if not logged in
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
