import { Routes, Route, Navigate } from 'react-router';
import Auth from './pages/Auth';
import { ReactNode } from 'react';
import useAuth, { AuthProvider } from './hooks/useAuth';
import Dashboard from './pages/Dashboard';

function App(): ReactNode {
  const PrivateRoute = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" replace />;
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/login" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />
        <Route path="/reset-password" element={<Auth />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
