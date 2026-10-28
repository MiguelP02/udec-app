import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type SessionStatus = 'signed-out' | 'unverified' | 'signed-in';

export const DEMO_EMAIL = 'test@gmail.com';
export const DEMO_PASSWORD = 'test123';

type SessionValue = {
  status: SessionStatus;
  email: string | null;
  signIn: (email: string, password: string) => boolean;
  signUp: (email: string) => void;
  markVerified: () => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('signed-out');
  const [email, setEmail] = useState<string | null>(null);

  const value = useMemo<SessionValue>(
    () => ({
      status,
      email,
      signIn: (candidateEmail, candidatePassword) => {
        const isDemo =
          candidateEmail.trim().toLowerCase() === DEMO_EMAIL && candidatePassword === DEMO_PASSWORD;
        if (!isDemo) return false;
        setEmail(DEMO_EMAIL);
        setStatus('signed-in');
        return true;
      },
      signUp: (newEmail) => {
        setEmail(newEmail.trim().toLowerCase());
        setStatus('unverified');
      },
      markVerified: () => setStatus('signed-in'),
      signOut: () => {
        setEmail(null);
        setStatus('signed-out');
      },
    }),
    [status, email],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de SessionProvider');
  return value;
}
