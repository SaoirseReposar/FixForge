const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const { registerUser, login, logout } = require('../controllers/auth'); // Import functions from auth.js

// Middleware to parse JSON
router.use(express.json());

// Home page route
router.get('/', homeController.getHomePage);

// About page route
router.get('/about', homeController.getAboutPage);

// Contact page route
router.get('/contact', homeController.getContactPage);

// Products page route
router.get('/products', homeController.getProductsPage);

// Login and register page
router.get('/login-reg', homeController.getLoginPage);

// Route to register a user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', login);

// Route to logout a user
router.post('/logout', logout);

module.exports = router;
