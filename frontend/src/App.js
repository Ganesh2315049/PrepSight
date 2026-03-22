import React, { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExperiencePage from './pages/ExperiencePage';
import AddExperiencePage from './pages/AddExperiencePage';
import OAuthSuccessPage from './pages/OAuthSuccessPage';
import AdminPage from './pages/AdminPage';
import AppLayout from './components/AppLayout';

const getStoredAuth = () => {
  const token = localStorage.getItem('prepsight_token');
  const username = localStorage.getItem('prepsight_username');
  const role = localStorage.getItem('prepsight_role');
  if (!token || !username || !role) {
    return null;
  }
  return { token, username, role };
};

function ProtectedRoute({ auth, children }) {
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RoleRoute({ auth, allowedRoles, children }) {
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(auth?.role)) {
    return <Navigate to="/experiences" replace />;
  }

  return children;
}

function App() {
  const [auth, setAuth] = useState(getStoredAuth);

  const authApi = useMemo(
    () => ({
      auth,
      login: ({ token, username, role }) => {
        localStorage.setItem('prepsight_token', token);
        localStorage.setItem('prepsight_username', username);
        localStorage.setItem('prepsight_role', role);
        setAuth({ token, username, role });
      },
      logout: () => {
        localStorage.removeItem('prepsight_token');
        localStorage.removeItem('prepsight_username');
        localStorage.removeItem('prepsight_role');
        setAuth(null);
      }
    }),
    [auth]
  );

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      <Routes>
        <Route path="/login" element={<LoginPage authApi={authApi} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth-success" element={<OAuthSuccessPage authApi={authApi} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute auth={auth}>
              <AppLayout authApi={authApi} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage authApi={authApi} />} />
          <Route
            path="admin"
            element={
              <RoleRoute auth={auth} allowedRoles={["ADMIN"]}>
                <AdminPage authApi={authApi} />
              </RoleRoute>
            }
          />
          <Route path="experiences" element={<ExperiencePage authApi={authApi} />} />
          <Route
            path="add-experience"
            element={
              <RoleRoute auth={auth} allowedRoles={["USER", "ADMIN"]}>
                <AddExperiencePage authApi={authApi} />
              </RoleRoute>
            }
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to={auth?.token ? (auth?.role === 'ADMIN' ? '/admin' : '/dashboard') : '/login'} replace />}
        />
      </Routes>
    </>
  );
}

export default App;
