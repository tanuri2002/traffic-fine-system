const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
if (!secret) {
  console.error('Error: JWT_SECRET is not defined in .env file.');
  process.exit(1);
}

// Mock payload representing an authorized user/admin/officer
const payload = {
  id: 1,
  username: 'admin_test',
  role: 'admin'
};

// Generate token (expires in 24 hours)
const token = jwt.sign(payload, secret, { expiresIn: '24h' });

console.log('\n=============================================');
console.log('JWT Token Generated Successfully!');
console.log('=============================================');
console.log('\nCopy and paste this token into your Authorization header (Bearer <token>) or client request:');
console.log(`\n${token}\n`);
console.log('=============================================\n');
