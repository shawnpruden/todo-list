import { Routes, Route } from 'react-router';
import Auth from './pages/Auth';
import { ReactNode } from 'react';

function App(): ReactNode {
  return (
    <Routes>
      <Route path="/login" element={<Auth />} />
      <Route path="/sign-up" element={<Auth />} />
      <Route path="/reset-password" element={<Auth />} />
    </Routes>
  );
}

export default App;
