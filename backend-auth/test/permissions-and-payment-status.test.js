const test = require('node:test');
const assert = require('node:assert/strict');
const fineController = require('../fineController');
const Officer = require('../Officer');
const Fine = require('../Fine');

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

test('rejects officer registry creation when the requester is not an admin', async () => {
  const originalCreateOfficerRegistry = Officer.createOfficerRegistry;
  Officer.createOfficerRegistry = async () => {
    throw new Error('should not be called');
  };

  try {
    const req = {
      body: {
        badgeNumber: 'B123',
        name: 'Officer One',
        phone: '0771234567',
        district: 'Colombo',
        active: true
      },
      user: { role: 'officer' }
    };
    const res = createResponse();

    await fineController.createOfficerRegistryEntry(req, res, () => {
      throw new Error('next should not be called');
    });

    assert.equal(res.statusCode, 403);
    assert.match(res.body.message, /admin access required/i);
  } finally {
    Officer.createOfficerRegistry = originalCreateOfficerRegistry;
  }
});

test('returns an approval-style payment status when a fine is completed', async () => {
  const originalFindFineByReferenceWithDetails = Fine.findFineByReferenceWithDetails;
  const originalUpdateFineAsPaidIfUnpaid = Fine.updateFineAsPaidIfUnpaid;
  const originalCreatePayment = Fine.createPayment;
  const originalFindPaidFineByReferenceWithDetails = Fine.findPaidFineByReferenceWithDetails;

  Fine.findFineByReferenceWithDetails = async () => ({
    id: 7,
    referenceNumber: 'REF-1001',
    status: 'UNPAID',
    category: {
      id: 2,
      code: 'TKT',
      title: 'Traffic Ticket',
      amountLkr: 2500
    },
    officer: {
      badgeNumber: 'B123',
      phone: '0771234567'
    }
  });
  Fine.updateFineAsPaidIfUnpaid = async () => {};
  Fine.createPayment = async () => ({ insertId: 11 });
  Fine.findPaidFineByReferenceWithDetails = async () => ({
    id: 7,
    referenceNumber: 'REF-1001',
    status: 'PAID',
    category: {
      id: 2,
      code: 'TKT',
      title: 'Traffic Ticket',
      amountLkr: 2500
    },
    officer: {
      badgeNumber: 'B123',
      phone: '0771234567'
    }
  });

  try {
    const req = {
      body: {
        referenceNumber: 'REF-1001',
        categoryCode: 'TKT',
        channel: 'WEB',
        cardholderName: 'Jane Doe',
        cardNumber: '4111111111111111',
        expiryDate: '12/30',
        cvv: '123'
      }
    };
    const res = createResponse();

    await fineController.completeFinePayment(req, res, () => {
      throw new Error('next should not be called');
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.fine.status, 'PAID');
    assert.equal(res.body.fine.paymentStatus, 'APPROVED');
  } finally {
    Fine.findFineByReferenceWithDetails = originalFindFineByReferenceWithDetails;
    Fine.updateFineAsPaidIfUnpaid = originalUpdateFineAsPaidIfUnpaid;
    Fine.createPayment = originalCreatePayment;
    Fine.findPaidFineByReferenceWithDetails = originalFindPaidFineByReferenceWithDetails;
  }
});
