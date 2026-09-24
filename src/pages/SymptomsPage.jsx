import { useState } from 'react';
import Disclaimer from '../components/Disclaimer';

const symptomsList = [
  'Headache',
  'Dizziness',
  'Nausea',
  'Confusion',
  'Difficulty concentrating',
  'Memory difficulty',
  'Balance problems',
  'Sensitivity to light',
  'Blurred vision',
  'Fatigue',
];

export default function SymptomsPage({ session, updateSession, navigate }) {
  const [selected, setSelected] = useState(session.symptoms || []);

  const toggleSymptom = (item) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item],
    );
  };

  const handleContinue = () => {
    updateSession({ symptoms: selected });
    navigate('/eye-test');
  };

  return (
    <div className="page">
      <div className="form-card">
        <div className="section-header">
          <div>
            <h2>Symptom assessment</h2>
            <p className="muted">Select symptoms experienced recently. This is for preliminary screening context only.</p>
          </div>
        </div>

        <div className="checkbox-grid">
          {symptomsList.map((symptom) => (
            <label className="check-item" key={symptom}>
              <input
                type="checkbox"
                checked={selected.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
              />
              <span>{symptom}</span>
            </label>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="ghost-btn" onClick={() => navigate('/profile')}>
            Back
          </button>
          <button type="button" className="primary-btn" onClick={handleContinue}>
            Continue to eye test
          </button>
        </div>

        <Disclaimer />
      </div>
    </div>
  );
}
