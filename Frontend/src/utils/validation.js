export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 100;
export const EVENT_NAME_MAX_LENGTH = 150;
export const EVENT_DESCRIPTION_MAX_LENGTH = 2000;
export const EVENT_LOCATION_MAX_LENGTH = 200;
export const MAX_SEAT_ROWS = 100;
export const MAX_SEATS_PER_ROW = 100;

export function getPasswordValidationError(password) {
  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`;
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain a lowercase letter.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain an uppercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain a number.";
  }

  return "";
}

export function isValidFutureDate(value) {
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date > new Date();
}
