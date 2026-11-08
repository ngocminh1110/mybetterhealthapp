import { getPasswordChecks, validateEmail, validateNewPassword, validateNumber, validatePassword, validatePasswordMatch } from '../validation';

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('minh@example.com')).toBeUndefined();
  });

  it('rejects empty and invalid emails', () => {
    expect(validateEmail('')).toBe('Email is required');
    expect(validateEmail('minh@')).toBe('Please enter a valid email');
  });
});

describe('validatePassword (sign in)', () => {
  it('only checks that a password was typed', () => {
    expect(validatePassword('')).toBe('Password is required');
    expect(validatePassword('abc')).toBeUndefined();
  });
});

describe('validateNewPassword (sign up)', () => {
  it('accepts a strong password', () => {
    expect(validateNewPassword('Health#2026')).toBeUndefined();
  });

  it('returns the first rule that fails', () => {
    expect(validateNewPassword('')).toBe('Password is required');
    expect(validateNewPassword('Ab1!')).toBe('Password needs at least 8 characters');
    expect(validateNewPassword('health#2026')).toBe('Password needs one uppercase letter (A-Z)');
    expect(validateNewPassword('Health#abc')).toBe('Password needs one number (0-9)');
    expect(validateNewPassword('Health2026')).toBe('Password needs one special character (!@#$...)');
  });

  it('lists every rule with passed / not passed', () => {
    expect(getPasswordChecks('Abcdefgh').map((c) => c.passed)).toEqual([true, true, false, false]);
  });
});

describe('validatePasswordMatch', () => {
  it('detects different passwords', () => {
    expect(validatePasswordMatch('abcdef', 'abcdeg')).toBe('Passwords do not match');
    expect(validatePasswordMatch('abcdef', 'abcdef')).toBeUndefined();
  });
});

describe('validateNumber', () => {
  it('accepts numbers with a comma as decimal separator', () => {
    expect(validateNumber('12,5', { label: 'Amount' })).toBeUndefined();
  });

  it('rejects empty, text, zero and too large values', () => {
    expect(validateNumber('', { label: 'Amount' })).toBe('Amount is required');
    expect(validateNumber('abc', { label: 'Amount' })).toBe('Amount must be a number');
    expect(validateNumber('0', { label: 'Amount' })).toBe('Amount must be greater than 0');
    expect(validateNumber('5000', { label: 'Amount', max: 2000 })).toBe('Amount must be 2000 or less');
  });
});
