import { useEffect, useState } from 'react';
import { getJson } from '../services/api';

export default function HistoryPage({ navigate }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getJson('/api/assessment/history');
        setHistory(response.assessments || []);
      } catch (error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="page">
      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h2>Assessment history</h2>
            <p className="muted">Prototype record of screening assessments.</p>
          </div>
          <button className="primary-btn" onClick={() => navigate('/')}>Home</button>
        </div>

        {loading ? (
          <p className="muted">Loading assessment history...</p>
        ) : history.length === 0 ? (
          <p className="muted">No assessments saved yet.</p>
        ) : (
          <div className="history-list">
            {history.map((item) => {
              const profile = item.profile || {};
              const scoreValue = item.screening_score || 0;
              return (
                <div key={item.id} className="history-card">
                  <div>
                    <h3>{profile.name || 'Assessment'} • {profile.athlete_status || 'User'}</h3>
                    <p className="history-meta">
                      {new Date(item.created_at).toLocaleString()} • {profile.sport_activity || 'No sport recorded'}
                    </p>
                    <div className="list-inline">
                      <span className="selection-pill">Score: {scoreValue}</span>
                      <span className="selection-pill">{item.screening_indication || 'UNKNOWN'}</span>
                    </div>
                  </div>
                  <button className="secondary-btn" onClick={() => navigate('/results')}>
                    View result
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
