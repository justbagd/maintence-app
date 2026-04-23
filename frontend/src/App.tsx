import { AuthProvider } from '@/contexts/AuthContext';
import { AppRouter } from '@/router';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="bottom-right" richColors />
    </AuthProvider>
  );
}
