import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PrepSightLogo from './PrepSightLogo';
import GoogleTranslate from './GoogleTranslate';

function AppLayout({ authApi }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    authApi.logout();
    navigate('/login');
  };

  return (
    <div className="shell-bg">
      <div className="aurora-wave aurora-wave-1" />
      <div className="aurora-wave aurora-wave-2" />
      <div className="light-streak streak-1" />
      <div className="light-streak streak-2" />
      <div className="particle-shimmer" />
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />

      <motion.header
        className="topbar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <Link to={authApi.auth?.role === 'ADMIN' ? '/admin' : '/dashboard'} className="brand"><PrepSightLogo /></Link>
        <nav className="top-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
            Dashboard
          </NavLink>
          {authApi.auth?.role === 'ADMIN' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              Admin
            </NavLink>
          )}
          <NavLink to="/experiences" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
            Experiences
          </NavLink>
          {(authApi.auth?.role === 'USER' || authApi.auth?.role === 'ADMIN') && (
            <NavLink to="/add-experience" className={({ isActive }) => (isActive ? 'nav-pill active' : 'nav-pill')}>
              Add Experience
            </NavLink>
          )}
        </nav>
        <GoogleTranslate />
        <div className="topbar-user">
          <span>{authApi.auth?.username} ({authApi.auth?.role})</span>
          <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
        </div>
      </motion.header>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
