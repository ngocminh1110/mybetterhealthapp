const MESSAGES: Record<string, string> = {
    // Sign in
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/wrong-password': 'Wrong email or password.',
    'auth/user-not-found': 'Wrong email or password.',
    'auth/invalid-email': 'Please enter a valid email.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',

    // Sign up
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'This password is too weak.',

    // General
    'auth/network-request-failed': 'No internet connection. Please check your network.',
    'auth/missing-email': 'Please enter your email.',
};

export function getAuthErrorMessage(error: unknown): string {
    const code =
        error && typeof error === 'object' && 'code' in error ? String((error as { code: unknown }).code) : '';
    return MESSAGES[code] ?? 'Something went wrong. Please try again.';
}