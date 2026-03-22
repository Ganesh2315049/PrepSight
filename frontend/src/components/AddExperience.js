import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const initialState = {
  companyName: '',
  role: '',
  topics: '',
  difficulty: 'Easy',
  rating: 3,
  feedback: ''
};

function AddExperience({ onSubmit, editingExperience, onCancelEdit }) {
  const [formData, setFormData] = useState(initialState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingExperience) {
      setFormData(editingExperience);
    } else {
      setFormData(initialState);
    }
  }, [editingExperience]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({
        ...formData,
        rating: Number(formData.rating)
      });
      setFormData(initialState);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.section className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="add-exp-heading">{editingExperience ? 'Update Experience' : 'Add Experience'}</h2>
      <form className="form-grid add-form-grid" onSubmit={handleSubmit}>
        <motion.div className="first-input-wrap" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          <input
            className="focus-input"
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <input
            className="focus-input"
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <input
            className="focus-input"
            type="text"
            name="topics"
            placeholder="Topics (e.g., Arrays,SQL,DBMS)"
            value={formData.topics}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
          <select
            className="focus-input"
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <input
            className="focus-input"
            type="number"
            name="rating"
            placeholder="Rating (1 to 5)"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
          <textarea
            className="focus-input"
            name="feedback"
            placeholder="Feedback"
            value={formData.feedback}
            onChange={handleChange}
            rows="4"
            required
          />
        </motion.div>

        <div className="button-row">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : editingExperience ? 'Update' : 'Save'}
          </motion.button>
          {editingExperience && (
            <button type="button" className="btn btn-ghost" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </motion.section>
  );
}

export default AddExperience;
