const bcrypt = require('bcryptjs');
const pool = require('../database');

// User class for database interactions
class User {
  // Find a user by username
  static async findByUsername(username) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0]; // Return the user if found
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw new Error('Error finding user by username');
    }
  }

  // Create a new user
  static async create(name, email, username, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const result = await pool.query(
        'INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, username, hashedPassword]
      );
      return result.rows[0]; 
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }
}


// Authentication controller functions
const authController = {

  // Register a new user
  registerUser: async (req, res) => {
    const { name, email, username, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
    try {
      const existingUser = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Email or Username already exists' });
      }

  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await pool.query(
        'INSERT INTO users (name, email, username, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, username',
        [name, email, username, hashedPassword]
      );
  
      res.status(201).json({ message: 'Registration successful', user: newUser.rows[0] }); 
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },
  

  // Login user
  login: async (req, res) => {
    const { username, password } = req.body;
  
    try {

      // Check if user exists
      const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // Compare the hashed password with the one from the database
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid username or password' });
      }
  
      // If login is successful, store user info in session
      req.session.userId = user.rows[0].id; // Save user ID in session
      req.session.username = user.rows[0].username;
  
      // Redirect to the profile page after successful login
      res.redirect('/profile');  // Redirect to the profile page
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  },
  
  
  // Logout user
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed' });
      }

      // Log the session after destruction to confirm it's cleared
      console.log('Session destroyed:', req.session);

      // Clear the session cookie
      res.clearCookie('connect.sid', { path: '/' });

      res.status(200).json({ success: true, message: 'Logout successful' });
    });
  },
};

module.exports = { User, authController };
