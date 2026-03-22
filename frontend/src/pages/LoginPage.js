import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getGoogleLoginUrl, loginUser } from '../api';
import PrepSightLogo from '../components/PrepSightLogo';

const GoogleIcon = () => (
  <svg className="google-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.22 3.6l6.86-6.86C35.92 2.4 30.38 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.44 13.45 17.77 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.5 24.55c0-1.73-.15-3.39-.43-5.05H24v9.57h12.67c-.55 2.92-2.2 5.38-4.69 7.02l7.24 5.62c4.23-3.9 6.68-9.65 6.68-17.16z" />
    <path fill="#FBBC05" d="M10.54 28.59A14.44 14.44 0 0 1 9.76 24c0-1.6.27-3.15.78-4.59l-7.98-6.19A23.97 23.97 0 0 0 0 24c0 3.86.92 7.5 2.56 10.78l7.98-6.19z" />
    <path fill="#34A853" d="M24 48c6.38 0 11.74-2.1 15.65-5.71l-7.24-5.62c-2.01 1.35-4.59 2.13-8.41 2.13-6.23 0-11.56-3.95-13.46-9.3l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

function LoginPage({ authApi }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get('oauthError');
    if (oauthError) {
      toast.error('Google login failed. Please try again.');
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete('oauthError');
      setSearchParams(nextParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  if (authApi.auth?.token) {
    return <Navigate to={authApi.auth?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(formData);
      authApi.login(data);
      toast.success('Login successful');
      navigate(data.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="aurora-wave aurora-wave-1" />
      <div className="aurora-wave aurora-wave-2" />
      <div className="light-streak streak-1" />
      <div className="light-streak streak-2" />
      <div className="particle-shimmer" />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-brand-wrap"><PrepSightLogo /></div>
        <div className="auth-kicker">Ace every interview round</div>
        <h1>Welcome back to PrepSight</h1>
        <p>Placement insights from real interview journeys.</p>

        <form className="form-grid" onSubmit={handleLogin}>
          <input
            className="focus-input auth-input"
            name="username"
            placeholder="Username or Email"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className="focus-input auth-input"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn btn-primary btn-ripple" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>

        <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.99 }} href={getGoogleLoginUrl()} className="btn btn-google">
          <GoogleIcon />
          Continue with Google
        </motion.a>

        <p className="auth-link">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
