import React from 'react';

function Dashboard({ topicAnalysis, difficultyAnalysis }) {
  const topicEntries = Object.entries(topicAnalysis);
  const difficultyEntries = Object.entries(difficultyAnalysis);

  const mostAskedTopic = topicEntries.length
    ? topicEntries.reduce((max, current) => (current[1] > max[1] ? current : max))[0]
    : 'N/A';

  return (
    <section className="card">
      <h2>Placement Dashboard</h2>
      <p className="highlight">
        Most asked topic: <strong>{mostAskedTopic}</strong>
      </p>

      <div className="dashboard-grid">
        <div>
          <h3>Topic Frequency</h3>
          {topicEntries.length === 0 ? (
            <p>No topic analysis yet.</p>
          ) : (
            <ul className="analysis-list">
              {topicEntries.map(([topic, count]) => (
                <li key={topic}>
                  <span>{topic}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3>Difficulty Distribution</h3>
          {difficultyEntries.length === 0 ? (
            <p>No difficulty analysis yet.</p>
          ) : (
            <ul className="analysis-list">
              {difficultyEntries.map(([difficulty, count]) => (
                <li key={difficulty}>
                  <span>{difficulty}</span>
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
