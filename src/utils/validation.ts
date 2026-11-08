
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | undefined {
  if (!email.trim()) return 'Email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email';
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  return undefined;
}

export interface PasswordCheck {
  label: string;
  passed: boolean;
}

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { label: 'At least 8 characters', passed: password.length >= 8 },
    { label: 'One uppercase letter (A-Z)', passed: /[A-Z]/.test(password) },
    { label: 'One number (0-9)', passed: /\d/.test(password) },
    { label: 'One special character (!@#$...)', passed: /[^A-Za-z0-9\s]/.test(password) },
  ];
}

export function validateNewPassword(password: string): string | undefined {
  if (!password) return 'Password is required';
  const failed = getPasswordChecks(password).find((check) => !check.passed);
  if (!failed) return undefined;
  // "One number (0-9)" -> "Password needs one number (0-9)"
  return `Password needs ${failed.label.charAt(0).toLowerCase()}${failed.label.slice(1)}`;
}

export function validatePasswordMatch(password: string, confirm: string): string | undefined {
  if (password !== confirm) return 'Passwords do not match';
  return undefined;
}

/** For grams and nutrition goals: must be a number between min and max. */
export function validateNumber(
  value: string,
  { min = 0, max = 100000, label = 'Value' }: { min?: number; max?: number; label?: string } = {},
): string | undefined {
  if (!value.trim()) return `${label} is required`;
  const num = Number(value.replace(',', '.'));
  if (Number.isNaN(num)) return `${label} must be a number`;
  if (num <= min) return `${label} must be greater than ${min}`;
  if (num > max) return `${label} must be ${max} or less`;
  return undefined;
}
