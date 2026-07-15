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