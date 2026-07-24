require('dotenv').config();
const pool = require('./db');

(async () => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    console.log('Tables:', tables);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit();
})();