import { Redirect } from 'expo-router';
import { useSession } from '../providers/demo-session-provider';

// Ruta raíz sin protección: decide a dónde va el usuario según su sesión.
export default function Index() {
  const { status } = useSession();
  return <Redirect href={status === 'signed-in' ? '/chats' : '/login'} />;
}
