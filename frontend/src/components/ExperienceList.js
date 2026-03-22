import React from 'react';
import { motion } from 'framer-motion';

function ExperienceList({ auth, experiences, onDelete, onEdit }) {
  const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  const canUserEditDelete = (exp) => auth?.role === 'USER' && exp?.user?.username === auth?.username;
  const canAdminEditDelete = auth?.role === 'ADMIN';
  const canAdminDelete = auth?.role === 'ADMIN';

  return (
    <section className="card">
      <h2>Experience List</h2>
      {experiences.length === 0 ? (
        <p>No experiences found.</p>
      ) : (
        <div className="list-grid">
          {experiences.map((exp) => (
            <motion.article key={exp.id} className="experience-item" whileHover={{ y: -6 }}>
              <h3>{exp.companyName}</h3>
              <p><strong>Role:</strong> {exp.role}</p>
              <p><strong>Topics:</strong> {exp.topics}</p>
              <p><strong>Difficulty:</strong> {exp.difficulty}</p>
              <p><strong>Rating:</strong> <span className="stars">{renderStars(exp.rating)}</span></p>
              <p><strong>Feedback:</strong> {exp.feedback}</p>
              <p><strong>Author:</strong> {exp?.user?.username || 'Unknown'}</p>
              <div className="button-row">
                {canUserEditDelete(exp) ? (
                  <>
                    <button className="btn btn-ghost" onClick={() => onEdit(exp)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => onDelete(exp.id)}>Delete</button>
                  </>
                ) : null}

                {!canUserEditDelete(exp) && canAdminEditDelete ? (
                  <button className="btn btn-ghost" onClick={() => onEdit(exp)}>Edit</button>
                ) : null}

                {!canUserEditDelete(exp) && canAdminDelete ? (
                  <button className="btn btn-danger" onClick={() => onDelete(exp.id)}>Delete</button>
                ) : null}

                {auth?.role === 'VIEWER' ? <span className="role-chip">Viewer access</span> : null}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ExperienceList;
