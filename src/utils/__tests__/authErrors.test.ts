import { getAuthErrorMessage } from '../authErrors';

describe('getAuthErrorMessage', () => {
    it('shows the same message for wrong password and unknown user (security)', () => {
        expect(getAuthErrorMessage({ code: 'auth/invalid-credential' })).toBe('Wrong email or password.');
        expect(getAuthErrorMessage({ code: 'auth/user-not-found' })).toBe('Wrong email or password.');
    });

    it('explains common sign up errors', () => {
        expect(getAuthErrorMessage({ code: 'auth/email-already-in-use' })).toBe(
            'An account with this email already exists.',
        );
    });

    it('explains network errors', () => {
        expect(getAuthErrorMessage({ code: 'auth/network-request-failed' })).toContain('No internet');
    });

    it('returns a general message for unknown errors', () => {
        expect(getAuthErrorMessage({ code: 'auth/something-new' })).toBe('Something went wrong. Please try again.');
        expect(getAuthErrorMessage(new Error('boom'))).toBe('Something went wrong. Please try again.');
        expect(getAuthErrorMessage(null)).toBe('Something went wrong. Please try again.');
    });
});