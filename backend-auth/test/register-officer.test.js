const test = require('node:test');
const assert = require('node:assert/strict');
const fineController = require('../fineController');
const Officer = require('../Officer');

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('rejects officer registration when the admin registry entry does not match the submitted identity', async () => {
  const originalRegistryLookup = Officer.findOfficerRegistryByBadgeNumber;
  const originalExistingLookup = Officer.findOfficerByBadgeNumber;
  const originalCreateOfficer = Officer.createOfficer;

  Officer.findOfficerRegistryByBadgeNumber = async () => ({
    badgeNumber: 'B123',
    name: 'Approved Officer',
    phone: '0771234567',
    district: 'Colombo',
    active: 1
  });
  Officer.findOfficerByBadgeNumber = async () => null;
  Officer.createOfficer = async () => ({
    id: 55,
    badgeNumber: 'B123',
    name: 'Submitted Officer',
    phone: '0777654321',
    district: 'Colombo',
    role: 'officer'
  });

  try {
    const req = {
      body: {
        badgeNumber: 'B123',
        name: 'Submitted Officer',
        phone: '0777654321',
        district: 'Colombo',
        password: 'secret123'
      }
    };
    const res = createResponse();

    await fineController.registerOfficer(req, res, () => {
      throw new Error('next should not be called');
    });

    assert.equal(res.statusCode, 403);
    assert.match(res.body.message, /admin-approved|administrator/i);
  } finally {
    Officer.findOfficerRegistryByBadgeNumber = originalRegistryLookup;
    Officer.findOfficerByBadgeNumber = originalExistingLookup;
    Officer.createOfficer = originalCreateOfficer;
  }
});
