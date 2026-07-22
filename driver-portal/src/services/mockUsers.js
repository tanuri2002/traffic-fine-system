// Simple mock users for local development.
// Fields mirror database rows: badge_number, name, phone, district, password_hash, role
// For convenience the mock includes a plain `password` field used only in dev mock.

const mockUsers = [
  {
    badgeNumber: 'B12345',
    name: 'Hansadee Perera',
    phone: '+94123456789',
    district: 'Colombo',
    password: 'password123',
    passwordHash: 'dev-hash-1',
    role: 'officer',
  },
  {
    badgeNumber: 'B67890',
    name: 'S. Silva',
    phone: '+94771234567',
    district: 'Galle',
    password: 'secret',
    passwordHash: 'dev-hash-2',
    role: 'officer',
  },
];

export default mockUsers;

