// Mock data and services for offline/testing without a real backend
export const mockFineDatabase = {
  REF001: {
    referenceNumber: 'REF001',
    driverName: 'John Doe',
    vehicleNumber: 'ABC-1234',
    violationType: 'Speed Limit Exceeded',
    amount: 150.0,
    violationDate: '2024-04-15',
    status: 'unpaid',
    location: 'Main Street'
  },
  REF002: {
    referenceNumber: 'REF002',
    driverName: 'Jane Smith',
    vehicleNumber: 'XYZ-5678',
    violationType: 'Running Red Light',
    amount: 250.0,
    violationDate: '2024-05-01',
    status: 'unpaid',
    location: 'Highway Intersection'
  }
};

export function getFineByReference(referenceNumber, categoryId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = String(referenceNumber).toUpperCase();
      const fine = mockFineDatabase[key];
      if (fine) {
        resolve({ data: fine });
      } else {
        resolve({ error: 'Fine not found' });
      }
    }, 400);
  });
}

export function processMockPayment(paymentData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const receiptNumber = `RCPT-${Date.now()}`;
      const tx = {
        transactionId: receiptNumber,
        receiptNumber,
        status: 'CONFIRMED',
        amount: paymentData.amount || 0
      };
      resolve({ data: tx });
    }, 800);
  });
}
