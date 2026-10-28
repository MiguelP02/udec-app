import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type SessionStatus = 'signed-out' | 'unverified' | 'signed-in';

export const DEMO_EMAIL = 'mantoniopaez@ucundinamarca.edu.co';
export const DEMO_PASSWORD = 'test123';
const MIN_PASSWORD_LENGTH = 6;

type SessionValue = {
  status: SessionStatus;
  email: string | null;
  signIn: (email: string, password: string) => boolean;
  signUp: (email: string) => void;
  markVerified: () => void;
  signOut: () => void;
  /** Devuelve false si la contraseña actual no coincide o la nueva es demasiado corta. */
  changePassword: (current: string, next: string) => boolean;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<SessionStatus>('signed-out');
  const [email, setEmail] = useState<string | null>(null);
  // Demo: la contraseña vive en memoria; se pierde al cerrar la app.
  const [password, setPassword] = useState(DEMO_PASSWORD);

  const value = useMemo<SessionValue>(
    () => ({
      status,
      email,
      signIn: (candidateEmail, candidatePassword) => {
        const isDemo =
          candidateEmail.trim().toLowerCase() === DEMO_EMAIL && candidatePassword === password;
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
      changePassword: (current, next) => {
        if (current !== password) return false;
        if (next.length < MIN_PASSWORD_LENGTH) return false;
        setPassword(next);
        return true;
      },
    }),
    [status, email, password],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de SessionProvider');
  return value;
}
