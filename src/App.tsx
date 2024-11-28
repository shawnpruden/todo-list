import { Routes, Route } from 'react-router';
import Auth from './pages/Auth';
import { ReactNode } from 'react';
import { AuthProvider } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';

function App(): ReactNode {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/login" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />
        <Route path="/reset-password" element={<Auth />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
