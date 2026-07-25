// require('dotenv').config();
// const pool = require('./db');

// (async () => {
//   try {
//     const [rows] = await pool.query('SELECT 1 + 1 AS result');
//     console.log('✅ DB connected:', rows);
//   } catch (err) {
//     console.error('❌ DB connection failed:', err.message);
//   }
//   process.exit();
// })();

require('dotenv').config();
const pool = require('./db');

(async () => {
  try {
    const [columns] = await pool.query('DESCRIBE officer_registry');
    console.log('--- COLUMNS ---');
    console.table(columns);

    const [rows] = await pool.query('SELECT * FROM officer_registry');
    console.log('--- DATA ---');
    console.table(rows);
  } catch (err) {
    console.error('Error:', err.message);
  }
  process.exit();
})();