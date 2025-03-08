const { Pool } = require('pg');

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost', // Replace with your database host
  database: 'fixforge_db', // Replace with your database name
  password: 'postgres', // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;