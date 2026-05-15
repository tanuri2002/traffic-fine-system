import { validateReferenceNumber, validateCategoryId, validateCardNumber, validateExpiryDate, validateCVV } from './validation';

test('validateReferenceNumber - empty and short', () => {
  expect(validateReferenceNumber('')).toMatch(/required/i);
  expect(validateReferenceNumber('ab')).toMatch(/at least 3/i);
  expect(validateReferenceNumber('REF123')).toBeNull();
});

test('validateCategoryId - empty', () => {
  expect(validateCategoryId('')).toMatch(/required/i);
  expect(validateCategoryId('CAT1')).toBeNull();
});

test('validateCardNumber - invalid and valid', () => {
  expect(validateCardNumber('')).toMatch(/required/i);
  expect(validateCardNumber('1234')).toMatch(/13 to 19 digits/i);
  // A valid Visa test number that passes Luhn
  expect(validateCardNumber('4242424242424242')).toBeNull();
});

test('validateExpiryDate - formats and expiry', () => {
  expect(validateExpiryDate('')).toMatch(/required/i);
  expect(validateExpiryDate('13/25')).toMatch(/MM\/YY/i);
  // Use a far future date to avoid flakiness
  expect(validateExpiryDate('12/99')).toBeNull();
});

test('validateCVV - invalid and valid', () => {
  expect(validateCVV('')).toMatch(/required/i);
  expect(validateCVV('12')).toMatch(/3 or 4 digits/i);
  expect(validateCVV('123')).toBeNull();
  expect(validateCVV('1234')).toBeNull();
});
