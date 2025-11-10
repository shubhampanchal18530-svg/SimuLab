import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../../API/sortingApi';
import './Leaderboard.css';

const Leaderboard = ({ experimentId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard(experimentId);
        setLeaderboard(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load leaderboard');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [experimentId]);

  if (loading) return <div className="leaderboard-loading">Loading leaderboard...</div>;
  if (error) return <div className="leaderboard-error">{error}</div>;

  return (
    <div className="leaderboard">
      <h3>Top Performers</h3>
      <div className="leaderboard-table">
        <div className="leaderboard-header">
          <div className="rank">Rank</div>
          <div className="username">User</div>
          <div className="score">Score</div>
          <div className="completion-time">Time</div>
        </div>
        {leaderboard.map((entry, index) => (
          <div 
            key={entry._id} 
            className={`leaderboard-row ${index < 3 ? `top-${index + 1}` : ''}`}
          >
            <div className="rank">#{index + 1}</div>
            <div className="username">{entry.user.username}</div>
            <div className="score">{Math.round(entry.bestScore)}%</div>
            <div className="completion-time">
              {entry.attempts.reduce((min, att) => 
                att.timeSpent < min ? att.timeSpent : min, 
                entry.attempts[0].timeSpent
              ).toFixed(2)}s
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;