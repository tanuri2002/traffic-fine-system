export function validateReferenceNumber(ref) {
  if (!ref || ref.trim() === '') return 'Reference number is required.';
  if (ref.trim().length < 3) return 'Reference number must be at least 3 characters.';
  return null;
}

export function validateCategoryId(cat) {
  if (!cat || cat.trim() === '') return 'Category ID is required.';
  return null;
}

export function validateCardNumber(card) {
  if (!card) return 'Card number is required.';
  const cleaned = card.replace(/\s+/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return 'Card number must be 13 to 19 digits.';
  return null;
}

export function validateExpiryDate(expiry) {
  if (!expiry) return 'Expiry date is required.';
  const m = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!m) return 'Expiry must be in MM/YY format.';
  const month = parseInt(m[1], 10);
  const year = parseInt(m[2], 10) + 2000;
  const now = new Date();
  const exp = new Date(year, month);
  if (exp <= now) return 'Card is expired.';
  return null;
}

export function validateCVV(cvv) {
  if (!cvv) return 'CVV is required.';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits.';
  return null;
}
