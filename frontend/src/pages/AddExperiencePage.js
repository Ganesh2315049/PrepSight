import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addExperience, updateExperience } from '../api';
import AddExperience from '../components/AddExperience';

function AddExperiencePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingExperience = location.state?.experience || null;

  const handleSubmit = async (payload) => {
    try {
      if (editingExperience?.id) {
        await updateExperience(editingExperience.id, payload);
        toast.success('Experience updated');
      } else {
        await addExperience(payload);
        toast.success('Experience saved');
      }
      navigate('/experiences');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Save failed');
    }
  };

  return (
    <motion.section className="page-card add-exp-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="add-exp-wave" />
      <AddExperience
        editingExperience={editingExperience}
        onSubmit={handleSubmit}
        onCancelEdit={() => navigate('/experiences')}
      />
    </motion.section>
  );
}

export default AddExperiencePage;
