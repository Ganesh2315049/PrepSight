import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const decodeJwtPayload = (token) => {
  const parts = token.split('.');
  if (parts.length < 2) {
    throw new Error('Invalid token');
  }

  const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, '=');
  return JSON.parse(atob(padded));
};

const parseRoleFromToken = (token) => {
  try {
    const payload = decodeJwtPayload(token);
    return payload.role || 'USER';
  } catch (error) {
    return 'USER';
  }
};

const parseUsernameFromToken = (token) => {
  try {
    const payload = decodeJwtPayload(token);
    return payload.sub || '';
  } catch (error) {
    return '';
  }
};

function OAuthSuccessPage({ authApi }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      toast.error('OAuth login failed');
      navigate('/login');
      return;
    }

    const username = parseUsernameFromToken(token);
    const role = parseRoleFromToken(token);

    authApi.login({ token, username, role });
    toast.success('Google login successful');
    navigate('/dashboard');
  }, [authApi, navigate, searchParams]);

  return <LoadingSpinner label="Finalizing Google login..." />;
}

export default OAuthSuccessPage;
