// app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set up static file serving
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS as the template engine (optional)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use routes
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});