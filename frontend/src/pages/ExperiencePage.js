import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { deleteExperience, getExperiences } from '../api';
import ExperienceList from '../components/ExperienceList';
import LoadingSpinner from '../components/LoadingSpinner';

function ExperiencePage({ authApi }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [companyFilter, setCompanyFilter] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [searching, setSearching] = useState(false);

  const loadExperiences = async (company = '', withPageLoader = true) => {
    if (withPageLoader) {
      setLoading(true);
    } else {
      setSearching(true);
    }
    try {
      const response = await getExperiences(company, 'latest');
      setExperiences(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch experiences');
    } finally {
      if (withPageLoader) {
        setLoading(false);
      } else {
        setSearching(false);
      }
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteExperience(id);
      toast.success('Experience deleted');
      await loadExperiences(companyFilter);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (experience) => {
    navigate('/add-experience', { state: { experience } });
  };

  const onFilterChange = async (event) => {
    const value = event.target.value;
    setCompanyFilter(value);
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();
    await loadExperiences(companyFilter.trim(), false);
  };

  if (loading) {
    return <LoadingSpinner label="Loading experiences..." />;
  }

  return (
    <motion.section className="page-card animated-page" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="section-head">
        <h1>Interview Experiences</h1>
        {authApi.auth?.role === 'ADMIN' ? (
          <div className="button-row">
            <button className="btn btn-primary" onClick={() => navigate('/add-experience')}>Add New</button>
            <span className="role-chip">ADMIN MODE</span>
          </div>
        ) : authApi.auth?.role === 'USER' ? (
          <button className="btn btn-primary" onClick={() => navigate('/add-experience')}>Add New</button>
        ) : (
          <span className="role-chip">{authApi.auth?.role} MODE</span>
        )}
      </div>

      <form className="filter-row" onSubmit={handleFilterSubmit}>
        <label htmlFor="companyFilter">Filter by company</label>
        <input
          id="companyFilter"
          className="focus-input"
          placeholder="Type full word, e.g. Zoho"
          value={companyFilter}
          onChange={onFilterChange}
        />
        <div className="button-row">
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? 'Searching...' : 'Search'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              setCompanyFilter('');
              await loadExperiences('', false);
            }}
            disabled={searching}
          >
            Clear
          </button>
        </div>
      </form>

      <ExperienceList
        auth={authApi.auth}
        experiences={experiences}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </motion.section>
  );
}

export default ExperiencePage;
