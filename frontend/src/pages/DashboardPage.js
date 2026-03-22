import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getDifficultyAnalysis, getTopicAnalysis } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [topicAnalysis, setTopicAnalysis] = useState({});
  const [difficultyAnalysis, setDifficultyAnalysis] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topicRes, difficultyRes] = await Promise.all([
          getTopicAnalysis(),
          getDifficultyAnalysis()
        ]);
        setTopicAnalysis(topicRes.data || {});
        setDifficultyAnalysis(difficultyRes.data || {});
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const topicEntries = useMemo(() => Object.entries(topicAnalysis), [topicAnalysis]);
  const difficultyEntries = useMemo(() => Object.entries(difficultyAnalysis), [difficultyAnalysis]);

  const mostAskedTopic = useMemo(() => {
    if (!topicEntries.length) {
      return 'N/A';
    }
    return topicEntries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0];
  }, [topicEntries]);

  const totalInterviews = useMemo(
    () => topicEntries.reduce((sum, [, count]) => sum + Number(count || 0), 0),
    [topicEntries]
  );

  const toughestBucket = useMemo(() => {
    if (!difficultyEntries.length) {
      return 'N/A';
    }
    return difficultyEntries.reduce((max, curr) => (curr[1] > max[1] ? curr : max))[0];
  }, [difficultyEntries]);

  if (loading) {
    return <LoadingSpinner label="Crunching placement insights..." />;
  }

  return (
    <motion.section className="page-card animated-page" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <h1>Placement Intelligence Dashboard</h1>
      <p className="highlight-banner glow-banner">
        Most asked topic: <strong>{mostAskedTopic}</strong>
      </p>

      <div className="kpi-grid">
        <motion.article className="kpi-card" whileHover={{ y: -6, scale: 1.01 }}>
          <h3>Total Interviews</h3>
          <strong>{totalInterviews}</strong>
        </motion.article>
        <motion.article className="kpi-card" whileHover={{ y: -6, scale: 1.01 }}>
          <h3>Top Topic</h3>
          <strong>{mostAskedTopic}</strong>
        </motion.article>
        <motion.article className="kpi-card" whileHover={{ y: -6, scale: 1.01 }}>
          <h3>Dominant Difficulty</h3>
          <strong>{toughestBucket}</strong>
        </motion.article>
      </div>

      <div className="stats-grid">
        <motion.article className="kpi-card analytic-card analytic-emphasis" whileHover={{ y: -6 }}>
          <h3>TOPIC FREQUENCY</h3>
          {topicEntries.length ? (
            <ul className="metric-list">
              {topicEntries.map(([topic, count]) => (
                <li key={topic}>
                  <span>{topic}</span>
                  <strong className="count-chip">{count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No topic data available.</p>
          )}
        </motion.article>

        <motion.article className="kpi-card analytic-card analytic-emphasis" whileHover={{ y: -6 }}>
          <h3>DIFFICULTY DISTRIBUTION</h3>
          {difficultyEntries.length ? (
            <ul className="metric-list">
              {difficultyEntries.map(([difficulty, count]) => (
                <li key={difficulty}>
                  <span>{difficulty}</span>
                  <strong className="count-chip">{count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <p>No difficulty data available.</p>
          )}
        </motion.article>
      </div>
    </motion.section>
  );
}

export default DashboardPage;
