import { getJson } from '../services/api';
import Disclaimer from '../components/Disclaimer';

export default function ResultsPage({ session, navigate }) {
  const result = session.result;

  if (!result) {
    return (
      <div className="page">
        <div className="dashboard-card">
          <h2>Results unavailable</h2>
          <p className="muted">The screening has not been analyzed yet.</p>
          <button className="primary-btn" onClick={() => navigate('/analysis')}>Return to analysis</button>
        </div>
      </div>
    );
  }

  const screeningScore = Number(result.screening_score || 0);

  const handleDownload = async () => {
    try {
      const assessmentId = result.assessment_id || result.id;
      const response = await getJson(`/api/report/${assessmentId}`);
      const blob = new Blob([response.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename || 'neuroguard-report.txt';
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Report download failed.', error);
    }
  };

  return (
    <div className="page">
      <div className="dashboard-card">
        <div className="section-header">
          <div>
            <h2>NEUROGUARD AI</h2>
            <p className="muted">SCREENING SUMMARY</p>
          </div>
          <button className="secondary-btn" onClick={() => navigate('/history')}>Assessment history</button>
        </div>

        <div className="results-grid">
          <div className="score-card">
            <h3>User information</h3>
            <p><strong>Name:</strong> {session.profile?.name || 'N/A'}</p>
            <p><strong>Age:</strong> {session.profile?.age || 'N/A'}</p>
            <p><strong>Status:</strong> {session.profile?.athlete_status || 'N/A'}</p>
            <p><strong>Sport:</strong> {session.profile?.sport_activity || 'N/A'}</p>
          </div>

          <div className="score-card">
            <h3>Assessment summary</h3>
            <p><strong>Eye movement score:</strong> {session.eyeAnalysis?.tracking_score || 0}</p>
            <p><strong>Reaction time score:</strong> {session.reaction?.reaction_score || 0}</p>
            <p><strong>Memory score:</strong> {session.memory?.memory_score || 0}</p>
            <p><strong>Attention score:</strong> {session.attention?.attention_score || 0}</p>
          </div>

          <div className="score-card">
            <h3>Symptom summary</h3>
            <p>{(session.symptoms || []).length} symptom(s) recorded</p>
            <div className="list-inline">
              {(session.symptoms || []).map((item) => (
                <span className="selection-pill active" key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="score-ring" style={{ marginTop: 28 }}>
          <span>{screeningScore.toFixed(0)}</span>
        </div>

        <div className="results-grid" style={{ marginTop: 24 }}>
          <div className="score-card">
            <h3>Overall Prototype Screening Score</h3>
            <p className="info-text">{screeningScore.toFixed(2)}</p>
          </div>
          <div className="score-card">
            <h3>Preliminary Screening Indication</h3>
            <p className="info-text">{result.screening_indication || 'NOT AVAILABLE'}</p>
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <p className="info-text">
            Consider seeking professional medical evaluation, particularly if symptoms are present or worsening.
          </p>
          <p className="info-text" style={{ marginTop: 12 }}>
            This result is a preliminary screening indication and is not a medical diagnosis.
          </p>
        </div>

        <div className="form-actions">
          <button className="primary-btn" onClick={handleDownload}>Download report</button>
          <button className="secondary-btn" onClick={() => navigate('/history')}>View history</button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
