import { useState } from 'react';
import { postJson } from '../services/api';
import Disclaimer from '../components/Disclaimer';

export default function AnalysisPage({ session, updateSession, navigate, resetSession }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      const payload = {
        profile: session.profile,
        symptoms: {
          selected_symptoms: session.symptoms || [],
        },
        eye_analysis: session.eyeAnalysis || {},
        reaction: session.reaction || {},
        memory: session.memory || {},
        attention: session.attention || {},
      };

      const response = await postJson('/api/screening/analyze', payload);
      updateSession({ result: response });
      navigate('/results');
    } catch (err) {
      setError('The backend could not complete the screening analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="analysis-card">
        <div className="section-header">
          <div>
            <h2>Processing assessment</h2>
            <p className="muted">NeuroGuard AI is combining eye, reaction, memory, attention, and symptom features.</p>
          </div>
        </div>

        <div className="summary-grid results-grid">
          <div className="metric-card">
            <span className="metric-label">Eye score</span>
            <strong>{session.eyeAnalysis?.tracking_score || 0}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Reaction score</span>
            <strong>{session.reaction?.reaction_score || 0}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Memory score</span>
            <strong>{session.memory?.memory_score || 0}</strong>
          </div>
          <div className="metric-card">
            <span className="metric-label">Attention score</span>
            <strong>{session.attention?.attention_score || 0}</strong>
          </div>
        </div>

        {error && <p style={{ color: '#fca5a5', marginTop: 18 }}>{error}</p>}

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/attention-test')}>
            Back
          </button>
          <button type="button" className="primary-btn" onClick={handleAnalyze} disabled={loading}>
            {loading ? 'Running analysis...' : 'Run screening analysis'}
          </button>
          <button type="button" className="secondary-btn" onClick={resetSession}>
            Restart
          </button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
