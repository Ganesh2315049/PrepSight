import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { registerUser } from '../api';
import PrepSightLogo from '../components/PrepSightLogo';

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success('Signup successful. Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Signup failed');
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
      <div className="bg-orb orb-3" />
      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-brand-wrap"><PrepSightLogo /></div>
        <h1>Create your PrepSight account</h1>
        <p>Track experiences, discover trends, improve outcomes.</p>

        <form className="form-grid" onSubmit={handleSignup}>
          <input className="focus-input auth-input" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
          <input className="focus-input auth-input" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input className="focus-input auth-input" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

          <select className="focus-input auth-input" name="role" value={formData.role} onChange={handleChange}>
            <option value="USER">USER</option>
            <option value="VIEWER">VIEWER</option>
          </select>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn btn-primary btn-ripple" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </motion.button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignupPage;
