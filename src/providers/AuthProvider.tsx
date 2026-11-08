import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';


export interface AppUser {
  uid: string;
  email: string;
  displayName?: string;
}

export interface AuthContextValue {
  user: AppUser | null;
  initializing: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AppUser | null>(null);
  const initializing = false;

  const signIn = useCallback(async (email: string, _password: string) => {
    await wait(500);
    setUser({ uid: 'mock-user', email });
  }, []);

  const signUp = useCallback(async (email: string, _password: string, displayName?: string) => {
    await wait(500);
    setUser({ uid: 'mock-user', email, displayName });
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await wait(500);
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, initializing, signIn, signUp, resetPassword, signOut }),
    [user, initializing, signIn, signUp, resetPassword, signOut],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const value = use(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return value;
}
