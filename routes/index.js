// routes/index.js
const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home page route
router.get('/', homeController.getHomePage);

// About page route
router.get('/about', homeController.getAboutPage);

// Contact page route
router.get('/contact', homeController.getContactPage);

// Products page route
router.get('/products', homeController.getProductsPage);

module.exports = router;