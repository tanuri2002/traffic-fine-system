export function validateReferenceNumber(v) {
    if (!v || v.trim() === '') return 'Reference number is required.';
    if (!/^[A-Z0-9-]+$/i.test(v.trim())) return 'Reference number must contain only letters, numbers, and hyphens.';
    return null;
}
export function validateBadgeNumber(v) {
    if (!v || v.trim() === '') return 'Badge number is required.';
    return null;
}
export function validatePassword(v) {
    if (!v) return 'Password is required.';
    if (v.length < 6) return 'Password must be at least 6 characters.';
    return null;
}
export function validateVehicleRefId(v) {
    if (!v || v.trim() === '') return 'Vehicle reference ID is required.';
    return null;
}
export function validateCategoryId(v) {
    if (!v || v.trim() === '') return 'Category ID is required.';
    return null;
}
export function validateCardNumber(v) {
    if (!v || v.trim() === '') return 'Card number is required.';
    const cleaned = v.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return 'Card number must be 13-19 digits.';
    return null;
}
export function validateExpiryDate(v) {
    if (!v || v.trim() === '') return 'Expiry date is required.';
    if (!/^\d{2}\/\d{2}$/.test(v.trim())) return 'Use MM/YY format.';
    const [mm, yy] = v.trim().split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Month must be 01-12.';
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) return 'Card is expired.';
    return null;
}
export function validateCVV(v) {
    if (!v || v.trim() === '') return 'CVV is required.';
    if (!/^\d{3,4}$/.test(v.trim())) return 'CVV must be 3 or 4 digits.';
    return null;
}
