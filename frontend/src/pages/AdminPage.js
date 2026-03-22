import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  getDifficultyAnalysis,
  getExperiences,
  getTopicAnalysis,
  updateAdminUserRole
} from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminPage({ authApi }) {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState([]);
  const [topics, setTopics] = useState({});
  const [difficulties, setDifficulties] = useState({});
  const [users, setUsers] = useState([]);
  const [userSubmitting, setUserSubmitting] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    active: true
  });

  const roleOptions = ['USER', 'VIEWER'];

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      active: true
    });
  };

  const loadDashboard = async () => {
    const [expRes, topicRes, difficultyRes, usersRes] = await Promise.all([
      getExperiences('', 'latest'),
      getTopicAnalysis(),
      getDifficultyAnalysis(),
      getAdminUsers()
    ]);

    setExperiences(expRes.data || []);
    setTopics(topicRes.data || {});
    setDifficulties(difficultyRes.data || {});
    setUsers(usersRes.data || []);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await loadDashboard();
      } catch (error) {
        toast.error('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalUsers = useMemo(() => {
    const set = new Set((experiences || []).map((exp) => exp?.user?.username).filter(Boolean));
    return set.size;
  }, [experiences]);

  const registeredUsers = users.length;

  const onUserFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    setUserSubmitting(true);
    try {
      await createAdminUser(userForm);
      toast.success(`${userForm.role === 'VIEWER' ? 'Viewer' : 'User'} created`);
      resetUserForm();
      await loadDashboard();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'User operation failed');
    } finally {
      setUserSubmitting(false);
    }
  };

  const handleDeleteUser = async (id) => {
    setUserSubmitting(true);
    try {
      await deleteAdminUser(id);
      toast.success('User deleted');
      await loadDashboard();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete user failed');
    } finally {
      setUserSubmitting(false);
    }
  };

  const handleRoleAssign = async (userId, nextRole) => {
    setUserSubmitting(true);
    try {
      await updateAdminUserRole(userId, nextRole);
      toast.success('Role updated');
      await loadDashboard();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Role update failed');
    } finally {
      setUserSubmitting(false);
    }
  };

  if (authApi.auth?.role !== 'ADMIN') {
    return null;
  }

  if (loading) {
    return <LoadingSpinner label="Loading admin control center..." />;
  }

  return (
    <motion.section className="page-card animated-page" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}>
      <div className="section-head">
        <h1>Admin Control Center</h1>
        <span className="role-chip">ADMIN ACCESS</span>
      </div>

      <div className="kpi-grid">
        <motion.article className="kpi-card" whileHover={{ y: -6 }}>
          <h3>Total Experiences</h3>
          <strong>{experiences.length}</strong>
        </motion.article>
        <motion.article className="kpi-card" whileHover={{ y: -6 }}>
          <h3>Contributing Users</h3>
          <strong>{totalUsers}</strong>
        </motion.article>
        <motion.article className="kpi-card" whileHover={{ y: -6 }}>
          <h3>Manage Users</h3>
          <strong>{registeredUsers}</strong>
        </motion.article>
      </div>

      <div className="stats-grid">
        <motion.article className="kpi-card analytic-card analytic-emphasis" whileHover={{ y: -5 }}>
          <h3>TOPIC FREQUENCY</h3>
          {Object.keys(topics).length ? (
            <ul className="metric-list">
              {Object.entries(topics).map(([topic, count]) => (
                <li key={topic}><span>{topic}</span><strong className="count-chip">{count}</strong></li>
              ))}
            </ul>
          ) : (
            <p>No topic data available.</p>
          )}
        </motion.article>

        <motion.article className="kpi-card analytic-card analytic-emphasis" whileHover={{ y: -5 }}>
          <h3>DIFFICULTY DISTRIBUTION</h3>
          {Object.keys(difficulties).length ? (
            <ul className="metric-list">
              {Object.entries(difficulties).map(([difficulty, count]) => (
                <li key={difficulty}><span>{difficulty}</span><strong className="count-chip">{count}</strong></li>
              ))}
            </ul>
          ) : (
            <p>No difficulty data available.</p>
          )}
        </motion.article>
      </div>

      <section className="card manage-users-wrap">
        <div className="section-head manage-users-head">
          <h2>Manage Users</h2>
          <span className="role-chip">ADMIN MODE</span>
        </div>

        <div className="manage-users-grid">
          <form className="soft-card form-grid" onSubmit={handleUserSubmit}>
            <h3>{userForm.role === 'VIEWER' ? 'Create Viewer' : 'Create User'}</h3>
            <input
              className="focus-input"
              name="username"
              placeholder="Name"
              value={userForm.username}
              onChange={onUserFieldChange}
              required
            />
            <input
              className="focus-input"
              name="email"
              type="email"
              placeholder="Email"
              value={userForm.email}
              onChange={onUserFieldChange}
              required
            />
            <input
              className="focus-input"
              name="password"
              type="password"
              placeholder="Password"
              value={userForm.password}
              onChange={onUserFieldChange}
              required
            />
            <select className="focus-input" name="role" value={userForm.role} onChange={onUserFieldChange}>
              {roleOptions.map((roleOption) => (
                <option key={roleOption} value={roleOption}>{roleOption}</option>
              ))}
            </select>
            <label className="toggle-row">
              <input type="checkbox" name="active" checked={userForm.active} onChange={onUserFieldChange} />
              Active account
            </label>

            <div className="button-row">
              <button className="btn btn-primary" type="submit" disabled={userSubmitting}>
                {userSubmitting ? 'Saving...' : userForm.role === 'VIEWER' ? 'Create Viewer' : 'Create User'}
              </button>
              <button className="btn btn-ghost" type="button" onClick={resetUserForm}>
                Reset
              </button>
            </div>
          </form>

          <div className="soft-card users-list-card">
            <h3>Registered Users</h3>
            {!users.length ? (
              <p>No users found.</p>
            ) : (
              <div className="users-list">
                {users.map((user) => (
                  <article className="user-item" key={user.id}>
                    <div className="user-head">
                      <strong>{user.username}</strong>
                      <span className={`status-chip ${user.active ? 'status-active' : 'status-blocked'}`}>
                        {user.active ? 'ACTIVE' : 'BLOCKED'}
                      </span>
                    </div>
                    <p>{user.email}</p>
                    <div className="user-meta-row">
                      <span className="role-chip">{user.role}</span>
                      <span className="activity-chip">Activity: {user.activityCount}</span>
                    </div>
                    <div className="button-row users-actions-row">
                      {user.role === 'ADMIN' ? (
                        <span className="role-chip">ADMIN LOCKED</span>
                      ) : (
                        <select
                          className="focus-input role-assign-select"
                          value={user.role}
                          onChange={(event) => handleRoleAssign(user.id, event.target.value)}
                          disabled={userSubmitting}
                        >
                          {roleOptions.map((roleOption) => (
                            <option key={roleOption} value={roleOption}>{roleOption}</option>
                          ))}
                        </select>
                      )}
                      <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)} type="button">Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </motion.section>
  );
}

export default AdminPage;
